var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Router = function() {

  this.elements = {
    $window: $(window)
  };

  this.init();
  this.attachEvents();
};

Auction.classes.Router.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
  this.route();
};

//подписываемся на событие смены хеша
Auction.classes.Router.prototype.attachEvents = function() {
  this.elements.$window.on('hashchange', this.route.bind(this));
};

//
Auction.classes.Router.prototype.route = function() {
  //получаем значение свойства нав из хэша
  var nav = $.bbq.getState().nav || 'lot-list';

  //скрываем все блоки и отображаем только с нужным классом
  $('.block').hide();
  $('.' + nav).show();
};

(function() {
  Auction.instances.router = new Auction.classes.Router();
})();


