var Auction = Auction || {};

// хранит массивы из объектов, созданных через new
Auction.instances = Auction.instances || {};

// хранит функции-конутрукторы
Auction.classes = Auction.classes || {};

Auction.classes.Pdp = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $window: $(window)
  };

  //будет хранить данные полученные с сервера; присваиваем значение, когда сработает событие getLots
  this.data = null;

  this.init();
  this.attachEvents();
};

Auction.classes.Pdp.prototype.init = function() { // первичная настройка объекта и вызов вспомагательных методов
};

Auction.classes.Pdp.prototype.attachEvents = function() { //подписываемся на события

  this.elements.$window.on('getLots', this.handleGetLots.bind(this));

  this.elements.$window.on('hashchange', this.findData.bind(this));

  this.elements.$root.on('submit', '.bid-details__bet', this.makeBid.bind(this));
};

Auction.classes.Pdp.prototype.handleGetLots = function(event, data) {

  //сохраняем data
  this.data = data;
  this.findData();
};

Auction.classes.Pdp.prototype.findData = function() { //получить data конкретного лота

  var state = $.bbq.getState();

  if (state.nav === 'pdp') {

    if (this.data.isError) {
      this.render(this.data, true);
    } else {
      var id = parseInt(state.id, 10);

      for (var i = 0; i < this.data.items.length; i++) {
        if (id === this.data.items[i].id) {
          this.render(this.data.items[i]);

          break;
        }
      }
    }
  }
};

Auction.classes.Pdp.prototype.makeBid = function(event) { //Изменяет значение в поле bid-value
  event.preventDefault();

  //заменяем тект элемента на переданный в text, т.е. цену заменяем на ту, что получили из input
  this.elements.$root.find('.bid-details__console__current-bid-value').text(event.target.elements.bid.value);
};

Auction.classes.Pdp.prototype.render = function(data, isError) { //отрисовывает html

  var template;

  if (isError) {
    template = Auction.templates.error(data);
    this.elements.$root.html(template);

  } else {
    template = Auction.templates.pdp(data);
    this.elements.$root.html(template);
    this.elements.$anchor = this.elements.$root.find('.pdp__title');
    this.elements.$window.scrollTop(this.elements.$anchor.offset().top);
  }
};

(function() {
  var elements = document.getElementsByClassName('pdp'); //получаем массив элементов с классом promo
  Auction.instances.pdps = [];

  for(var i = 0; i < elements.length; i++) {
    Auction.instances.pdps.push(new Auction.classes.Pdp(elements[i])); // для каждого элемента массива создаем объекты через конструктор
  }
})();


