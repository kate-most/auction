var Auction = Auction || {};

Auction.instances = Auction.instances || {};

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

Auction.classes.Filters.prototype.attachEvents = function() { //ловим событие чендж на элементах склассом и вызываем метод, меняющий хэш
  this.elements.$root.on('change', '.filters__select', this.handleChange.bind(this));
};

Auction.classes.Filters.prototype.handleChange = function() { // метод, который изменяем хэш при всплытии события чендж
  var data = this.elements.$root.serialize();

  data = $.deparam(data);

  $.bbq.pushState(data);
};

Auction.classes.Filters.prototype.getFilters = function() { //получает информацию с сервера и вызывает метод рендер
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

Auction.classes.Filters.prototype.prepareData = function(data) { //метод для подготовки даты перед отображением

  //создаем клон объекта, чтоб не менять нативный
  var preparedData = $.extend({}, data);

  //записываем в переменную объект хэша
  var state = $.bbq.getState();

  // сравнивает значение свойств объекта хэша со значением

  //Пробегаемся по всем ключам объекта хэша
  Object.keys(state).forEach(function(value) {
    //пробегаемся по всем значениям объекта фильтры
    preparedData.filters.forEach(function(filter) {
      //сравниваем, если имя фильтра равно ключу объекта хэша
      if (filter.name === value) {
        //пробегаемся по каждому свойству-объекту фильтра values
        filter.values.forEach(function(val) {
          //сравниваем, если значение values.value равно значению ключа объекта хэша
          if (val.value === state[value]) {
           val.active = true; // добавляем свойство active в объект values, если значение поля селекта совпадает со значением в хэше
          }
        });
      }
    });
  });

  //клон дата, но с добавленными свойствами актив, если в хэше указаны значения свойств color или price
  return preparedData;
};

Auction.classes.Filters.prototype.render = function(data) { //отрисовывает html

  var template = Auction.templates.filters(this.prepareData(data)); //получает клон data с добавленными свойствами active

  this.elements.$root.html(template);
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('filters'); //получаем массив элементов с классом promo
  Auction.instances.filters = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.filters.push(new Auction.classes.Filters(elements[i])); // для каждого элемента массива создаем объекты через конструктор Filters и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


