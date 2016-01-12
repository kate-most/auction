var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.Contact = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $wrapper: $root.find('.contact__wrapper'),
    $window: $(window),
    $anchor: $root.find('.contact__title')
  };

  this.init();
  this.attachEvents();
};

Auction.classes.Contact.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов

  this.getContact();
};

Auction.classes.Contact.prototype.attachEvents = function() { //подписываемся на собые смены хэша

  this.elements.$window.on('hashchange', this.getContact.bind(this));
};

Auction.classes.Contact.prototype.getContact = function() {

  //смотрим есть ли в хэшэ свойство nav, которое === contact
  if($.bbq.getState().nav === 'contact') {

    var _this = this;

    //если есть, получаем данные с сервера
    $.ajax({
      url: '/auction/services/contact.json',
      dataType: 'json',
      data: {},
      method: 'GET',
      success: function(data) {
        _this.render(data);
      }
    })
  }
};

Auction.classes.Contact.prototype.initMap = function(data) { //отображение карты

  var map = new google.maps.Map(this.elements.$map.get(0), { //получаем элемент из jquery obj
    center: data.map.center,
    scrollwheel: false,
    zoom: data.map.zoom
  });

  var marker = new google.maps.Marker({
    position: data.map.marker,
    map: map,
    title: 'Auction'
  });
};

Auction.classes.Contact.prototype.render = function(data) { //отрисовывает html

  var template = Auction.templates.contact(data);
  this.elements.$wrapper.html(template);

  //поскольку ранее map будет не отрендерин
  this.elements.$map = this.elements.$root.find('.contact__map');
  this.initMap(data);

  this.elements.$window.scrollTop(this.elements.$anchor.offset().top);
};

(function() {
  var elements = document.getElementsByClassName('contact'); //получаем массив элементов с классом
  Auction.instances.contacts = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.contacts.push(new Auction.classes.Contact(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


