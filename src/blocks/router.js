var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
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

Auction.classes.Router.prototype.attachEvents = function() { //подписываемся на событие смены хеша

  this.elements.$window.on('hashchange', this.route.bind(this));
};

Auction.classes.Router.prototype.route = function() {

  var nav = $.bbq.getState().nav || 'lot-list';

  $('.block').hide();
  $('.' + nav).show();
};

(function() {
  Auction.instances.router = new Auction.classes.Router();
})();


