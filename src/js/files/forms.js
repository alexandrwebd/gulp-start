// *** Работа с формами ***
const forms = document.querySelectorAll('.form')
const dataValue = document.querySelectorAll('[data-value]')

// Заполняю плейсхолдер формы с data-value
if (dataValue.length > 0) {
  for (let item of dataValue) {
    item.placeholder = item.dataset.value
  }
}

// Навешую слушателей на формы

if (forms.length > 0) {
  for (let form of forms) {
    form.addEventListener('submit', formSend)
  }
}

// *** Отправляет форму, добавить async перед функцией ***
function formSend(e) {
  e.preventDefault()

  // делаю валидацию

  let error = 0
  let formData
  if (forms.length > 0) {
    for (let form of forms) {
      error += formValidate(form)
      // получаю данные с полей формы
      formData = new FormData(form)
    }
  }

  // formData.append('image', formImage.files[0])

  if (error === 0) {
    // let response = await fetch('sendmail.php', {
    //   method: 'POST',
    //   body: formData,
    // })
    // //отправляю форму
    // if (response.ok) {
    //   let result = await response.json()
    //   alert(result.message)
    //   formPreview.innerHTML = ''
    //   form.reset()
    //   form.classList.remove('_sending')
    // } else {
    //   alert('Ошибка')
    //   form.classList.remove('_sending')
    // }
    // Временно
    const popupMessage = document.querySelector('.popup_subscribe-message')
    popupMessage.classList.add('open')
  } else {
    // alert('Заполните обязательные поля')

    const errorElement = element('span', ['form__error'], 'Ошибка')

    const formError = document.querySelector('form._error')

    formError.append(errorElement)
  }
}

// *** валидирует формы ***

function formValidate(form) {
  let error = 0
  let formReq = document.querySelectorAll('._reg')

  for (let index = 0; index < formReq.length; index++) {
    const input = formReq[index]
    formRemoveError(input)

    if (input.classList.contains('_email')) {
      if (emailTest(input)) {
        formAddError(input)
        error++
      }
    } else if (
      input.getAttribute('type') === 'checkbox' &&
      input.checked === false
    ) {
      formAddError(input)
      error++
    } else {
      if (input.value === '') {
        formAddError(input)
        error++
      }
    }
  }
  return error
}

// *** Добавляет и удаляет класс _error у формы и инпута ***
function formAddError(input) {
  input.parentElement.classList.add('_error')
  input.classList.add('_error')
}

function formRemoveError(input) {
  input.parentElement.classList.remove('_error')
  input.classList.remove('_error')
}

// *** Функция теста email ***
function emailTest(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
}
