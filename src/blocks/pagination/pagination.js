var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Pagination = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $window: $(window)
  };

  //создаем свой объект data, который будем заполнять, т.к. кроме этих двух свойств для пагинации больше ничего не нужно
  this.data = {
    pagination: {
      page: null,
      pageCount: null
    }
  };
  this.init();
  this.attachEvents();
};

Auction.classes.Pagination.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.Pagination.prototype.attachEvents = function() { //подписываемся на события

  var _this = this;

  this.elements.$root.on('click', '.pagination__item-link', this.handleClick.bind(this));

  this.elements.$window.on('getLots, filtered', function(event, data) {

    _this.data.pagination.pageCount = Math.ceil(data.items.length / 10);
    _this.render(_this.data);
  });

  this.elements.$window.on('hashchange', function() {
    _this.render(_this.data);
  });
};

Auction.classes.Pagination.prototype.handleClick = function(event) { //изменяет хэш при клике на страницу

  event.preventDefault();

  var $current = $(event.target);

  var page = $current.data('page');

  $.bbq.pushState({p: page});
};

Auction.classes.Pagination.prototype.render = function(data) { //передаем созданную в начале data
  data.pagination.page = parseInt($.bbq.getState().p || 1, 10);

  var template = Auction.templates.pagination(data);
  this.elements.$root.html(template);
};

(function() {
  var elements = document.getElementsByClassName('pagination'); //получаем массив элементов с классом promo
  Auction.instances.paginations = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.paginations.push(new Auction.classes.Pagination(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


