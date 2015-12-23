var Auction = Auction || {}; // единственная глобальная переменная, которая выступает в виде объекта. Используется для того, чтоб убрать глобальные переменные, добавив их в виде свойств и методов этого объекта.
//Auction || {} - если переменная была объявлена раньше, то использовать имеющуюся, а если нет, то создать ее. Поскольку мы не знаем, что Auction создастся на момент выполнения другого скрипта, где мы уже объявляли эту переменную.

Auction.instances = Auction.instances || {}; // чтоб не перезаписать в пустой объект, если это свойство уже существует

Auction.classes = Auction.classes || {}; // свойство объекта Auction, которое содержит в себе конструкторы

Auction.classes.Promo = function(element) { // element - контекст класса Promo в доме, т.е. сам блок promo
  // нужно сходу при создании объекта Promo запустить функцию для получения json
  var $root = $(element); //создали jquery объект. $() - функция, что на основе ствоего параметра создает jquery объект
  this.elements = {
    $root: $root, // чтоб отовсюду иметь доступ к объекту $root
    $wrapper: $root.find('.promo__content') // на объекте применяем метод find, который ищет в контексте текущего объекта $root, у нас это promo блок, элемент с переданным селектором и возвращает jquery объект
  };

  this.init();
};

Auction.classes.Promo.prototype.init = function() { // метод для вызова первичных метдов, т.к. бест практис говорит не вызывать первичные методы сходу, а оборачивать их в функцию-обертку.

  this.getLots(); //поскольку init вызывается в this, getLots также имеет доступ к этому контексту
};

Auction.classes.Promo.prototype.getLots = function() { // получаем json с сервиса
  var _this = this; //В переменную сохранили контекст, чтоб вызвать потом метод в нужном нам контексте

  $.ajax({ // матод для ассинхронного http запроса
    url: '/auction/services/lots.json', //ссылка на нащ сервис
    dataType: 'json', // тип ожидаемых данных
    data: {}, // параметры запроса, с какими параметрами сервер увидит мой запрос и соответственно какие будет передавать. Пустой потому, что у нас нет сервиса, а есть статический json
    method: 'GET', // Указание на то, что получаем данные
    success: function(data) { // data - ответ с сервера, в нашем случае это объект с нашими данными с json файла
      _this.render(data); // this - объект, который возвращает ajax, поэтому вызываем метод на переменной, что хранит ссылку на нужный контекст
    }
  });
};

Auction.classes.Promo.prototype.carusel = function() {
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
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });
};

Auction.classes.Promo.prototype.render = function(data) { //отрисовывает html
  var template = Auction.templates.promo(data); //получаем результат в виде строки
  // Auction.templates.promo(data) - метод handlebars, который в качестве параметра получает объект data и возвращает строку
  this.elements.$wrapper.html(template); //обращаемся к jquery объкту, созданному на основе элемента promo, вызываем на нем метод html, который подменяет текущий контент хтмлем из переданной строки.

  this.carusel();

};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('promo'); //получаем массив элементов с классом promo
  Auction.instances.promos = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.promos.push(new Auction.classes.Promo(elements[i])); // для каждого элемента массива создаем объекты через конструктор Promo и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


