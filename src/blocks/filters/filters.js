var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.Filters = function(element) {

  var $root = $(element);

  this.elements = {
    $root: $root
  };

  this.init();
  this.attachEvents();
};

Auction.classes.Filters.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
  this.getFilters();
};

Auction.classes.Filters.prototype.attachEvents = function() { //ловит события
  this.elements.$root.on('change', '.filters__select', this.handleChange.bind(this));
};

Auction.classes.Filters.prototype.handleChange = function() { //изменяет хэш при всплытии события change на форме

  //получаем сериализированную строку из элементов формы
  var data = this.elements.$root.serialize();

  //сериализированную строку превращаем в объект
  data = $.deparam(data);

  $.bbq.pushState(data);
};

Auction.classes.Filters.prototype.getFilters = function() { //получает информацию с сервиса и вызывает метод render

  var _this = this;

  $.ajax({
    url: '/auction/services/filters.json',
    dataType: 'json',
    data: {},
    method: 'GET',
    success: function(data) {
      _this.render(data);
    }
  });
};

Auction.classes.Filters.prototype.prepareData = function(data) { //метод для подготовки data перед отображением - добавление свойств active

  //создание клона объекта, чтоб не менять нативный
  var preparedData = $.extend({}, data);

  var state = $.bbq.getState();

  //Пробегаемся по всем ключам объекта хэша
  //Object.keys возвращает массив из имен ключей
  Object.keys(state).forEach(function(value) {
    //пробегаемся по всем элементам-объектам массива filters
    preparedData.filters.forEach(function(filter) {
      //сравниваем, если значение поля name фильтра равно ключу объекта хэша
      if (filter.name === value) {
        //пробегаемся по каждому свойству-объекту массива values фильтра
        filter.values.forEach(function(val) {
          //сравниваем, если значение values.value равно значению ключа объекта хэша
          if (val.value === state[value]) {
            // добавляем свойство active в этот объект массива values, если значение опшина совпадает со значением в хэше
           val.active = true;
          }
        });
      }
    });
  });

  return preparedData;
};

Auction.classes.Filters.prototype.render = function(data) { //отрисовывает html

  var template = Auction.templates.filters(this.prepareData(data));

  this.elements.$root.html(template);
};

(function() {
  var elements = document.getElementsByClassName('filters'); //получаем массив элементов с классом promo
  Auction.instances.filters = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.filters.push(new Auction.classes.Filters(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


