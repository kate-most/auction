var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Pdp = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $window: $(window)
  };

  this.data = null;

  this.init();
  this.attachEvents();
};

Auction.classes.Pdp.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.Pdp.prototype.attachEvents = function() {

  this.elements.$window.on('getLots', this.handleGetLots.bind(this));

  this.elements.$window.on('hashchange', this.findData.bind(this));

  this.elements.$root.on('submit', '.bid-details__bet', this.makeBid.bind(this));
};

Auction.classes.Pdp.prototype.handleGetLots = function(event, data) {
  this.data = data;

  this.findData();
};

Auction.classes.Pdp.prototype.findData = function() {

  var state = $.bbq.getState();

  if(state.nav === 'pdp') {
    var id = parseInt(state.id, 10);

    for(var i = 0; i < this.data.items.length; i++) {
      if(id === this.data.items[i].id) {
        this.render(this.data.items[i]);

        break;
      }
    }
  }
};

Auction.classes.Pdp.prototype.makeBid = function(event) {
  event.preventDefault();

  this.elements.$root.find('.bid-details__console__current-bid-value').text(event.target.elements.bid.value);
};

Auction.classes.Pdp.prototype.render = function(data) { //отрисовывает html

  var template = Auction.templates.pdp(data);

  this.elements.$root.html(template);
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('pdp'); //получаем массив элементов с классом promo
  Auction.instances.pdps = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.pdps.push(new Auction.classes.Pdp(elements[i])); // для каждого элемента массива создаем объекты через конструктор Pdp и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


