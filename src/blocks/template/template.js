var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Template = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root
  };

  this.init();
};

Auction.classes.Template.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.Template.prototype.getLots = function() { //получает информацию с сервера
};

Auction.classes.Template.prototype.render = function(data) { //отрисовывает html

};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('template'); //получаем массив элементов с классом promo
  Auction.instances.templates = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.templates.push(new Auction.classes.Template(elements[i])); // для каждого элемента массива создаем объекты через конструктор Template и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


