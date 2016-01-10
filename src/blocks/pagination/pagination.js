var Auction = Auction || {};

Auction.instances = Auction.instances || {};

Auction.classes = Auction.classes || {};

Auction.classes.Pagination = function(element) {
  var $root = $(element);
  this.elements = {
    $root: $root,
    $window: $(window)
  };

  //создаем свой объект data, который бдуем заполнять, т.к. нам кроме этих двух свойств для пагинации больше ничего не нужно
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

Auction.classes.Pagination.prototype.attachEvents = function() {

  var _this = this;

  //подписываемся на события клик на руте на линках
  this.elements.$root.on('click', '.pagination__item-link', this.handleClick.bind(this));

  //подписываемся на события получения и отфильтровки лотов
  this.elements.$window.on('getLots, filtered', function(event, data) { //Пересчитывает страницы и Отрисовывает, когда получили данные с сервера или сработало событие фильтрации
    //пересчитываем количество страниц каждый раз при получении и фильтрации
    _this.data.pagination.pageCount = Math.ceil(data.items.length / 10);
    _this.render(_this.data);
  });

  this.elements.$window.on('hashchange', function() { // Отрисовывает, когда меняется хеш, т.е. карент пейдж
    _this.render(_this.data);
  });
};

Auction.classes.Pagination.prototype.handleClick = function(event) { //метод срабатывает при клике на линк

  //затираем поведение по умолчанию
  event.preventDefault();

  //сохраняем как объект элемент, на котором вызвали событие, т.е. линк
  var $current = $(event.target);

  //получаем значение дата атрибута с именем page, элемента, на котором вызвано событие
  var page = $current.data('page');

  //в хэш добавляем значение дата атрибута элемента, на котором вызвано событие
  $.bbq.pushState({p: page});
};

Auction.classes.Pagination.prototype.render = function(data) { //передаем созданную в начале data
  data.pagination.page = parseInt($.bbq.getState().p || 1, 10);

  var template = Auction.templates.pagination(data);
  this.elements.$root.html(template);
};

(function() { // функция обертка для скрытия переменных, использующихся для создания объектов
  var elements = document.getElementsByClassName('pagination'); //получаем массив элементов с классом promo
  Auction.instances.paginations = [];

  for(var i = 0; i < elements.length; i++) { // перебираем массив elements
    Auction.instances.paginations.push(new Auction.classes.Pagination(elements[i])); // для каждого элемента массива создаем объекты через конструктор Pagination и пушим их в массив promos. В данной ситуации такой объект один - это блок promo c каруселью.
  }
})();


