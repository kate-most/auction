var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.Nav = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $link: $root.find('.nav__list-item-link'),
    $window: $(window)
  };

  this.init();
  this.attachEvents();
};

Auction.classes.Nav.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов

  var current = $.bbq.getState().nav;

  //получаем obj на основе селектора и добавляем ему класс
  $('a[data-nav="' + current + '"]').addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.attachEvents = function() { //подписка на события

  this.elements.$root.on('click', '.nav__list-item-link_nav', this.handleClick.bind(this));
  this.elements.$root.on('click', '.nav__list-item-link_sub', this.filterCategory.bind(this));
  this.elements.$root.on('click', '.nav__list-item-link_promo', this.scrollTop.bind(this))
};

Auction.classes.Nav.prototype.handleClick = function(event) {

  event.preventDefault();

  var $current = $(event.target);

  var nav = $current.data('nav');

  $.bbq.pushState({nav: nav, category: ''});

  //на кликнутый элемент добавляем класс, сняв его у всех остальных
  this.elements.$link.removeClass('nav__list-item-link_active');
  $current.addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.filterCategory = function(event) {

  event.preventDefault();

  var $current = $(event.target);

  var category = $current.data('category');

  $.bbq.pushState({category: category, nav: 'lot-list'});

  this.elements.$link.removeClass('nav__list-item-link_active');
  $current.parents('.nav__list-item').find('.nav__list-item-link_nav').addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.scrollTop = function(event) {
  event.preventDefault();

  this.elements.$window.scrollTop(0);
};

(function() {
  var elements = document.getElementsByClassName('nav'); //получаем массив элементов с классом promo
  Auction.instances.navs = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.navs.push(new Auction.classes.Nav(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


