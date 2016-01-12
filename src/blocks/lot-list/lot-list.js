var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.LotList = function(element) {
  var $root = $(element);

  //будет хранить данные полученные с сервера; присваиваем значение, когда сработает событие getLots
  this.data = null;

  this.elements = {
    $root: $root,
    $wrapper: $root.find('.lot-list__wrapper'),
    //необходимо для scrollTop
    $anchor: $root.find('.lot-list__title'),
    $window: $(window)
  };

  this.init();
  this.attachEvents();
};

Auction.classes.LotList.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.LotList.prototype.attachEvents = function() { //подписываемся на события

  var _this = this;

  this.elements.$window.on('getLots', function(event, data) {

    _this.data = data;

    if (data.isError) {
      _this.render(data, true);
    } else {
      _this.render(_this.getCurrentLots());
    }
  });

  this.elements.$window.on('hashchange', function() {

    _this.render(_this.getCurrentLots());

    //скролим к заголовку блока каждый раз после перерисовки лотов
    _this.elements.$window.scrollTop(_this.elements.$anchor.offset().top);
  });
};

Auction.classes.LotList.prototype.getCurrentLots = function() { //метод для получения объекта с отфильтрованными данными

  var _this = this;

  //будет хранить массив из отфильтрованных лотов
  var data = {};

  var state = $.bbq.getState();

  var currentPage = parseInt(state.p || 1, 10);

  //будет хранить объект с минимальной и максимальной ценой в фильтре
  var prices;

  //отфильтровует data
  data.items = this.data.items.filter(function(lot) {

    if(state.color && state.price && state.category) {
      prices = _this.getPrices(state.price);
      return (state.color === lot.color && lot.price >= prices.minPrice && lot.price <= prices.maxPrice && state.category === lot.category)
    } else if(state.color && state.price) {
      prices = _this.getPrices(state.price);
      return (state.color === lot.color && lot.price >= prices.minPrice && lot.price <= prices.maxPrice)
    } else if(state.price && state.category) {
      prices = _this.getPrices(state.price);
      return (lot.price >= prices.minPrice && lot.price <= prices.maxPrice && state.category === lot.category)
    } else if(state.color && state.category) {
      return (state.color === lot.color && state.category === lot.category)
    } else if(state.color) {
      return (state.color === lot.color)
    } else if(state.category) {
      return (state.category === lot.category)
    }else if(state.price) {
      prices = _this.getPrices(state.price);
      return (lot.price >= prices.minPrice && lot.price <= prices.maxPrice);
    } else {
      return true;
    }
  });

  this.elements.$window.trigger('filtered', data);

  //фильтрация для пагинации
  data.items = data.items.filter(function(lot, index) {
    return (index >= (currentPage - 1) * 10 && index < currentPage * 10);
  });

  //сортируем объекты
  data.items.sort(function(a, b) {
    return a[state.sort || 'date'] - b[state.sort || 'date'];
  });

  return data;
};

Auction.classes.LotList.prototype.getPrices = function(price) { //вспомагательный метод - делит цену в хэшэ на два значения
  var prices = price.split('-');
  var minPrice = parseInt(prices[0], 10);
  var maxPrice = parseInt(prices[1], 10);

  return {minPrice: minPrice, maxPrice: maxPrice};
};

Auction.classes.LotList.prototype.render = function(data, isError) { //отрисовывает html

  var template;

  if (isError) {
    template = Auction.templates.error(data);
    this.elements.$root.html(template);

  } else {
    template = Auction.templates['lot-list'](data);
    this.elements.$wrapper.html(template);
  }
};

(function() {
  var elements = document.getElementsByClassName('lot-list'); //получаем массив элементов с классом promo
  Auction.instances['lot-lists'] = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances['lot-lists'].push(new Auction.classes.LotList(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


