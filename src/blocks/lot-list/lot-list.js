var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.LotList = function(element) {
  var $root = $(element);

  //будет хранить данные полученные с сервера, получит значение, когда сработает событие getLots
  this.data = null;

  this.elements = {
    $root: $root,
    $wrapper: $root.find('.lot-list__wrapper'),
    $anchor: $root.find('.lot-list__title'),
    $window: $(window)
  };

  this.init();
  this.attachEvents();
};

Auction.classes.LotList.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов

};

//метод для получения объекта с отфильтрованными данными
Auction.classes.LotList.prototype.getCurrentLots = function() {
  //будет хранить отфильтрованный объект
  var data = {};

  //метод для выделения значения из хэша
  var state = $.bbq.getState();

  //получаем страницу, на которой находимся
  var currentPage = parseInt(state.p || 1, 10);

  //переменная будет использоваться в условной констркции, объявляем тут, чтоб не объявлять два раза
  //будет хранить объект с минимальной и максимальной ценой в фильтре
  var prices;

  //вспомагательным метод для того, чтобы разделить цену в хэшэ на два значения
  function getPrices(price) {
    var prices = price.split('-');
    var minPrice = parseInt(prices[0], 10);
    var maxPrice = parseInt(prices[1], 10);

    return {minPrice: minPrice, maxPrice: maxPrice};
  }

  //отфильтровует data и возвращает массив из объектов, которые попадают под указанные критерии
  data.items = this.data.items.filter(function(lot) {

    if(state.color && state.price && state.category) {
      prices = getPrices(state.price);
      return (state.color === lot.color && lot.price >= prices.minPrice && lot.price <= prices.maxPrice && state.category === lot.category)
    } else if(state.color && state.price) {
      prices = getPrices(state.price);
      return (state.color === lot.color && lot.price >= prices.minPrice && lot.price <= prices.maxPrice)
    } else if(state.price && state.category) {
      prices = getPrices(state.price);
      return (lot.price >= prices.minPrice && lot.price <= prices.maxPrice && state.category === lot.category)
    } else if(state.color && state.category) {
      return (state.color === lot.color && state.category === lot.category)
    } else if(state.color) {
      return (state.color === lot.color)
    } else if(state.category) {
      return (state.category === lot.category)
    }else if(state.price) {
      prices = getPrices(state.price);
      return (lot.price >= prices.minPrice && lot.price <= prices.maxPrice);
    }

    else {
      return true; // если в хэшэ нет колора и прайса, то возвращать тру и отображать все
    }
  });

  this.elements.$window.trigger('filtered', data);

  data.items = data.items.filter(function(lot, index) { // фильтруем уже отфильтрованную дату
    return (index >= (currentPage - 1) * 10 && index < currentPage * 10);
  });

  //сортируем объекты
  data.items.sort(function(a, b) {
    //работаем с объектами а и b, у которых есть свойства date и price
    return a[state.sort || 'date'] - b[state.sort || 'date'];
  });
  return data;
};

Auction.classes.LotList.prototype.attachEvents = function() { // первичная настройка объекта и вызов вспомагательных методов

  var _this = this;

  //следим за событием получения лотов
  this.elements.$window.on('getLots', function(event, data) {
    _this.data = data;

    //вызываем метод рендер с новой отфильтрованной датой, которую возвращает метод геткарентлотс
    _this.render(_this.getCurrentLots());
  });

  //следим за событием смены хэша
  this.elements.$window.on('hashchange', function() {

    //вызываем метод рендер с новой отфильтрованной датой, которую возвращает метод геткарентлотс
    _this.render(_this.getCurrentLots());

    //скролим к заголовку блока каждый раз после перерисовки итемов
    _this.elements.$window.scrollTop(_this.elements.$anchor.offset().top);
  });
};


Auction.classes.LotList.prototype.render = function(data) { //отрисовывает html
  var template = Auction.templates['lot-list'](data); //получаем результат в виде строки
  // Auction.templates.promo(data) - метод handlebars, который в качестве параметра получает объект data и возвращает строку
  this.elements.$wrapper.html(template); //обращаемся к jquery объкту, созданному на основе элемента promo, вызываем на нем метод html, который подменяет текущий контент хтмлем из переданной строки.
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('lot-list'); //получаем массив элементов с классом promo
  Auction.instances['lot-lists'] = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances['lot-lists'].push(new Auction.classes.LotList(elements[i])); // для каждого элемента массива создаем объекты через конструктор LotList и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


