var Auction = Auction || {};

Auction.instances = Auction.instances || {};

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

Auction.classes.LotsHandler.prototype.attachEvents = function() {
  this.elements.$root.on('click', '.lot-handler__button', this.handleClick.bind(this));
};

Auction.classes.LotsHandler.prototype.handleClick = function(event) {
  var lotId = $(event.target).data('lot-id');

  $.bbq.pushState({id: lotId, nav: 'pdp'});
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('lots-handler'); //получаем массив элементов с классом promo
  Auction.instances['lots-handler'] = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances['lots-handler'].push(new Auction.classes.LotsHandler(elements[i])); // для каждого элемента массива создаем объекты через конструктор LotsHandler и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


