// @@include('files/regular.js', {})
// @@include('files/sliders.js', {})
// @@include('files/functions.js', {})
// @@include('files/popups.js', {})
// @@include('files/script.js', {})
// @@include('files/forms.js', {})
// ===============================================================
// *** Swiper slider
// код в sliders.js
// чтоб подключить swiper slider к родителю добавить класс _swiper
// добавить путь в gulpfile.js, инициализировать слайдер
// тоб сделать изображение адаптивным к обвертке добавить класс _ibg
// Для добавления паралакса, блоку с контентом можно добавить data-swiper-parallax-opaciti="0" data-swiper-parallax-x="-100%"
// *** Аккардеон
/* 
  Для родителя спойлера пишем атрибут data-spollers
  Для заголовков слайдеров пишем атрибут data-spoller
  Если нужно обеспечить работу спойлеров на всех размерах экранов пишем data-spollers без параметров
  Если нужно выключить\включить работу спойлеров на разных размерах экранов пишем параметры ширины и типа брекпоинта.
  Например: 
  data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
  data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

  Если нужно чтобы в блоке открывалься только один спойлер добавляем атрибут data-one-spoller
*/
// *** Попап
/* Инструкция:
код в popups.js
Для ссылки добовляем класс .popup-link и анкерную ссылку на с именем папап (#popup-1)
Для самого попап добавляем id c таким же именем (id="popup-1") и клас popup
const timeout = 800 - должен соответствовать транзишену с которим появляеться анимация
.lock-padding - клас добавляю для фиксированых обьектов headeru (если он фиксирован) и контенту попапа, чтоб не сдвигался на ширину ползунка прокрутки после открытия
*/

// *** Форма
// Форме добавляю класс .form, инпуту добавляю data атрибут data-value с текстом плейсхолдера
// код в forms.js

// *** Динамический адаптив
// Добавить к элементу который нужно перемещать при адаптиве data атрибут с параметрами data-da="куда(уникальный класс), какой(индекс масива каким по щету поместить или first/last), когда(цыфра разрешения экрана)"
// третий парамент можно не писать, last идет по умолчанию
// например data-da="content__column-river,2,992"

// =======================================
// адаптивное свойство (av) - миксин который позволяет уменьшать любое свойство в заданом диапазоне
// (fl) flex: 1 1 auto; позволяет элементу увеличиваться и сдвигать другие элементы в стороны
// align-self: flex-start;  элемент прижимаеться к началу
// align-self: flex-end;  элемент прижимаеться к концу
// align-items: stretch; позволяет элементам резиниться
// order меняет расположение flex элементов
// (ah) @media (any-hover: hover) {
//   &:hover {
// сработает на устройствах с мишью
//   }
// }