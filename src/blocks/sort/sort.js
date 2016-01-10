var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Sort = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root
  };

  this.init();
  this.attachEvents();
};

Auction.classes.Sort.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов

  //смотри в хэш, чтоб получить текущую сортировку
  var sort = $.bbq.getState().sort || 'date';

  //получаем jquery obj выбранной сортировки (input) и добавляем ему в дом своство checked
  $('#' + sort).prop('checked', true);


};

Auction.classes.Sort.prototype.attachEvents = function() {

  //ловим событие чендж на элементах с классом
  this.elements.$root.on('change', '.sort__input', this.handleChange.bind(this));
};


Auction.classes.Sort.prototype.handleChange = function(event) { // метод-обработчик события

  //получаем значение элемента, по которому кликнули
  var value = event.target.value;

  //пушим в хэш значение элемента с ключем сорт
  $.bbq.pushState({sort: value});


};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('sort'); //получаем массив элементов с классом promo
  Auction.instances.sort = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.sort.push(new Auction.classes.Sort(elements[i])); // для каждого элемента массива создаем объекты через конструктор Sort и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


