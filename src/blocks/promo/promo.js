var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.Promo = function(element) {

  var $root = $(element);

  this.elements = {
    $root: $root,
    $wrapper: $root.find('.promo__content'),
    $window: $(window)
  };

  this.init();
};

Auction.classes.Promo.prototype.init = function() { // метод для вызова первичных метдов

  this.getLots();
};

Auction.classes.Promo.prototype.getLots = function() { // получаем json с сервиса

  var _this = this;

  // метод для ассинхронного http запроса
  $.ajax({
    url: '/auction/services/lots.json',
    dataType: 'json',
    data: {},
    method: 'GET',
    success: function(data) {

      _this.render(data);

      _this.elements.$window.trigger('getLots', data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Tried to get lots but there was an error ' + errorThrown);
      _this.render(jqXHR, true);
      jqXHR.isError = true;
      _this.elements.$window.trigger('getLots', jqXHR);
    }
  });
};

Auction.classes.Promo.prototype.carusel = function() { //метод для инициализации плагина
  this.elements.$wrapper.slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
};

Auction.classes.Promo.prototype.render = function(data, isError) { //отрисовывает html

  var template;

  if (isError) {
    template = Auction.templates.error(data);
    this.elements.$root.html(template);

  } else {
    template = Auction.templates.promo(data);
    this.elements.$wrapper.html(template);

    this.carusel();
  }

};

(function() {
  var elements = document.getElementsByClassName('promo'); //получаем массив элементов с классом promo
  Auction.instances.promos = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.promos.push(new Auction.classes.Promo(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


