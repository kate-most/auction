var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
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

  var sort = $.bbq.getState().sort || 'date';

  //получаем obj выбранной сортировки и добавляем ему в дом своство checked
  $('#' + sort).prop('checked', true);
};

Auction.classes.Sort.prototype.attachEvents = function() { //подписка на события

  this.elements.$root.on('change', '.sort__input', this.handleChange.bind(this));
};


Auction.classes.Sort.prototype.handleChange = function(event) { // метод-обработчик события change

  var value = event.target.value;

  $.bbq.pushState({sort: value});
};

(function() {
  var elements = document.getElementsByClassName('sort'); //получаем массив элементов с классом promo
  Auction.instances.sort = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.sort.push(new Auction.classes.Sort(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


