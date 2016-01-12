var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.LotsHandler = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root
  };

  this.init();
  this.attachEvents();
};

Auction.classes.LotsHandler.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.LotsHandler.prototype.attachEvents = function() { //подписка на события

  this.elements.$root.on('click', '.lot-handler__button', this.handleClick.bind(this));
};

Auction.classes.LotsHandler.prototype.handleClick = function(event) {

  var lotId = $(event.target).data('lot-id');

  $.bbq.pushState({id: lotId, nav: 'pdp'});
};

(function() {
  var elements = document.getElementsByClassName('lots-handler'); //получаем массив элементов с классом
  Auction.instances['lots-handler'] = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances['lots-handler'].push(new Auction.classes.LotsHandler(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


