var Auction = Auction || {};

Auction.instances = Auction.instances || {};

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
  //получаем значение свойства nav в хэшэ
  var current = $.bbq.getState().nav;
  //создаем jquery obj на основе селектора и добавляем ему класс
  $('a[data-nav="' + current + '"]').addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.attachEvents = function() {

  this.elements.$root.on('click', '.nav__list-item-link_nav', this.handleClick.bind(this));
  this.elements.$root.on('click', '.nav__list-item-link_sub', this.filterCategory.bind(this));
  this.elements.$root.on('click', '.nav__list-item-link_promo', this.scrollTop.bind(this))
};

Auction.classes.Nav.prototype.handleClick = function(event) {

  //затираем поведение по умолчанию, чтоб не перезатирался хэш
  event.preventDefault();

  //сохраняем, как jquery объект, элемент, на котором вызвали событие, т.е. линк
  var $current = $(event.target);

  //смотрим значение его data атрибута data-nav
  var nav = $current.data('nav');

  //пушим в хэш значение дата атрибута nav
  $.bbq.pushState({nav: nav, category: ''});

  //на кликнутый элемент добавляем класс, сняв его у всех остальных
  this.elements.$link.removeClass('nav__list-item-link_active');
  $current.addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.filterCategory = function(event) {
  //затираем поведение по умолчанию
  event.preventDefault();

  //сохраняем как объект элемент, на котором вызвали событие, т.е. link
  var $current = $(event.target);

  //смотрим значение его data атрибута data-category
  var category = $current.data('category');

  //пушим в хэш значение data атрибута nav, category
  $.bbq.pushState({category: category, nav: 'lot-list'});

  this.elements.$link.removeClass('nav__list-item-link_active');
  $current.parents('.nav__list-item').find('.nav__list-item-link_nav').addClass('nav__list-item-link_active');
};

Auction.classes.Nav.prototype.scrollTop = function(event) {
  event.preventDefault();

  //скролим вверх window
  this.elements.$window.scrollTop(0);
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('nav'); //получаем массив элементов с классом promo
  Auction.instances.navs = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.navs.push(new Auction.classes.Nav(elements[i])); // для каждого элемента массива создаем объекты через конструктор Nav и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


