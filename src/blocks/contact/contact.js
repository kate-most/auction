var Auction = Auction || {};

Auction.instances = Auction.instances || {};

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

  //при инициализации проекта, запускаем метод для получения data контактов. Сработает только, если в хеше в поле nav есть значение contact
  this.getContact();
};

Auction.classes.Contact.prototype.attachEvents = function() {
  //подписываемся на собые смены хэша и при его смене запускаем метод для получения data контактов
  this.elements.$window.on('hashchange', this.getContact.bind(this));
};

Auction.classes.Contact.prototype.getContact = function() {

  //смотрим есть ли в хэшэ свойство нав, которое === контакт
  if($.bbq.getState().nav === 'contact') {

    var _this = this;

    //если есть, получаем данные с сервера и отрисовыаем разметку
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

//отображение карты
Auction.classes.Contact.prototype.initMap = function(data) {

  var map = new google.maps.Map(this.elements.$map.get(0), { //получаем элемент из jquery obj
    center: data.map.center, //получаем объект-свойство оюъекта мап
    scrollwheel: false,
    zoom: data.map.zoom
  });

  var marker = new google.maps.Marker({
    position: data.map.marker, //получаем объект-свойство оюъекта мап
    map: map,
    title: 'Auction'
  });
};

Auction.classes.Contact.prototype.render = function(data) { //отрисовывает html

  var template = Auction.templates.contact(data);
  this.elements.$wrapper.html(template);
  this.elements.$map = this.elements.$root.find('.contact__map');
  this.initMap(data);

  this.elements.$window.scrollTop(this.elements.$anchor.offset().top);
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('contact'); //получаем массив элементов с классом promo
  Auction.instances.contacts = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.contacts.push(new Auction.classes.Contact(elements[i])); // для каждого элемента массива создаем объекты через конструктор Contact и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


