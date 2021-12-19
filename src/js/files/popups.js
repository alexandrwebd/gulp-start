//************ Получаю переменные **************/
const body = document.querySelector('body')
const lockPadding = document.querySelectorAll('.lock-padding')
const popupLinks = document.querySelectorAll('.popup-link')
let unlock = true

const timeout = 800

// при клике на ссылку ищет получает id попапа и передает его в функцию
if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index]

    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '')
      const curentPopup = document.getElementById(popupName)
      popupOpen(curentPopup)
      e.preventDefault()
    })
  }
}

// ищет все крестики для закрытия и при клике закрывает попап (ближайшего родителя с классом .popup)
const popupCloseIcon = document.querySelectorAll('.close-popup')
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index]
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'))
      e.preventDefault()
    })
  }
}

// открывает попап
function popupOpen(curentPopup) {
  if (curentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open')

    if (popupActive) {
      console.log(popupActive)
      popupClose(popupActive, false)
    } else {
      bodyLock()
    }
    curentPopup.classList.add('open')
    curentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'))
      }
    })
  }
}
// закрывает попап
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open')
    if (doUnlock) {
      bodyUnLock()
    }
  }
}

// убирает скрол body при открытии
function bodyLock() {
  //  получаю ширину полосы скрола
  const lockPaddingValue =
    window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px'

  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index]
      el.style.paddingRight = lockPaddingValue
    }
  }

  // добавляю паддинг к body чтоб не дергался контент
  body.style.paddingRight = lockPaddingValue
  body.classList.add('lock')

  // чтобы не было повторных нажатий
  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index]
        el.style.paddingRight = '0px'
      }
    }

    body.style.paddingRight = '0px'
    body.classList.remove('lock')
  }, timeout)

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

// закрытие попап по кнопке esc
document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open')
    popupClose(popupActive)
  }
})

// (
//   // полифилы для старых браузеров
//   function () {
//     // проверяем поддержку
//     if (!Element.prototype.closest) {
//       // реализуем
//       Element.prototype.closest = function (css) {
//         var node = this

//         while (node) {
//           if (node.matches(css)) return node
//           else node = node.parentElement
//         }
//         return null
//       }
//     }
//   }
// )()(function () {
//   // проверяем поддержку
//   if (!Element.prototype.matches) {
//     // определяем свойство
//     Element.prototype.matches =
//       Element.prototype.matchesSelector ||
//       Element.prototype.webkitMatchesSelector ||
//       Element.prototype.mozMatchesSelector ||
//       Element.prototype.msMatchesSelector
//   }
// })()

/* Инструкция:
Для ссылки добовляем класс .popup-link и анкерную ссылку на с именем папап (#popup-1)
Для самого попап добавляем id c таким же именем (id="popup-1") и клас popup
const timeout = 800 - должен соответствовать транзишену с которим появляеться анимация
.lock-padding - клас добавляю для фиксированых обьектов headeru (если он фиксирован) и контенту попапа, чтоб не сдвигался на ширину ползунка прокрутки после открытия
Не разобрался с проблемой открытия нового попап с ссылки в открытом попап
*/
