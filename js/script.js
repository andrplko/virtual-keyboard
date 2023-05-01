import ru from './ru.js';
import en from './en.js';

let [activeLang = 'en', language] = [];
let [isPressed = false, isCapsPressed = false] = [];

const body = document.querySelector('body');
body.classList.add('body');

function setLocalStorage() {
  localStorage.setItem('lang', activeLang);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if (localStorage.getItem('lang')) {
    activeLang = localStorage.getItem('lang');
    language = localStorage.getItem('lang') === 'en' ? en : ru;
  }
}
window.addEventListener('load', getLocalStorage);

const createTemplate = (className) => {
  const divElement = document.createElement('div');
  divElement.classList.add(className);
  return divElement;
};

const setDOM = () => {
  body.innerHTML = `
    <main class="main">
      <h2 class="title">Virtual Keyboard</h2>
      <textarea class="textarea" placeholder="Write something..." id="textarea" rows="7" cols="50"></textarea>
      <div class="container">
        <div class="keyboard-keys"></div>
      </div>
      <p class="description">Клавиатура создана в операционной системе macOS</p>
      <p class="language">Для переключения языка используется комбинация клавиш: Alt + Shift</p>
    </main>
  `;

  const textarea = document.querySelector('textarea');

  const keysArr = [];
  for (let i = 0; i < language.length; i += 1) {
    keysArr.push(createTemplate('key'));
  }

  const rowsArr = [];
  for (let i = 0; i < 5; i += 1) {
    rowsArr.push(createTemplate('keyboard-row'));
  }

  let idx = 0;
  for (let i = 0; i < language.length; i += 1) {
    keysArr[i].innerHTML = language[i].small;
    keysArr[i].classList.add(language[i].code);
    rowsArr[idx].appendChild(keysArr[i]);
    if (language[i].small === 'Backspace' || language[i].small === 'Delete' || language[i].small === 'Enter' || language[i].code === 'ShiftRight') {
      idx += 1;
    }
    document.querySelector('.keyboard-keys').appendChild(rowsArr[idx]);
  }

  document.querySelectorAll('.key').forEach((el) => el.addEventListener('mousedown', (event) => {
    textarea.focus();
    if (el.innerHTML === 'Tab') {
      event.preventDefault();
      textarea.value += '\t';
    }
    if (el.innerHTML === 'Enter') {
      event.preventDefault();
      textarea.value += '\n';
    }
    if (el.innerHTML === 'Backspace') {
      event.preventDefault();
      textarea.value = textarea.value.substring(0, textarea.value.length - 1);
    }
    if (el.innerHTML === 'Delete') {
      event.preventDefault();
      const val = textarea.value;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newVal = val.slice(0, start) + val.slice(end + 1);
      textarea.value = newVal;
      textarea.selectionStart = start;
      textarea.selectionEnd = textarea.selectionStart;
    }
    if (el.innerHTML !== 'Backspace' && el.innerHTML !== 'CapsLock' && el.innerHTML !== 'Delete' && el.innerHTML !== 'Shift' && el.innerHTML !== 'Ctrl' && el.innerHTML !== 'Alt' && el.innerHTML !== 'Tab' && el.innerHTML !== 'Win' && el.innerHTML !== 'Enter') {
      textarea.value += el.innerHTML;
    }
    if (el.innerHTML !== 'CapsLock') {
      el.classList.add('active');
    }
    if (el.innerHTML === 'Shift') {
      document.querySelectorAll('.key').forEach((item, index) => {
        const element = item;
        element.innerHTML = language[index].shift;
      });
    }
    if (el.innerHTML === 'CapsLock' && !isCapsPressed) {
      isCapsPressed = true;
      el.classList.add('active');
      document.querySelectorAll('.key').forEach((item, i) => {
        const element = item;
        if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(item.innerHTML)) {
          element.innerHTML = language[i].shift;
        }
      });
    } else if (el.innerHTML === 'CapsLock' && isCapsPressed) {
      isCapsPressed = false;
      el.classList.remove('active');
      document.querySelectorAll('.key').forEach((item, index) => {
        const element = item;
        if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(element.innerHTML)) {
          element.innerHTML = language[index].small;
        }
      });
    }
  }));

  document.querySelectorAll('.key').forEach((el) => el.addEventListener('mouseup', () => {
    if (el.innerHTML !== 'CapsLock') {
      el.classList.remove('active');
    }
    if (el.innerHTML === 'Shift') {
      document.querySelectorAll('.key').forEach((item, index) => {
        const element = item;
        element.innerHTML = language[index].small;
      });
    }
  }));
};

window.addEventListener('load', setDOM);

document.addEventListener('keydown', (event) => {
  document.querySelector('textarea').focus();
  document.querySelectorAll('.key').forEach((item, index) => {
    const element = item;
    if (event.code === language[index].code) {
      element.classList.add('active');
    }
  });
  if (event.code === 'Tab') {
    event.preventDefault();
    document.querySelector('textarea').value += '\t';
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    document.querySelectorAll('.key').forEach((item, index) => {
      const element = item;
      element.innerHTML = language[index].shift;
    });
  }
  if (event.code === 'CapsLock') {
    document.querySelectorAll('.key').forEach((item, index) => {
      const element = item;
      if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(element.innerHTML)) {
        element.innerHTML = language[index].shift;
      }
    });
  }
  if (event.code === 'AltLeft' || event.code === 'AltRight') {
    isPressed = true;
  }
  if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && isPressed && activeLang === 'en') {
    isPressed = false;
    language = ru;
    activeLang = 'ru';
  } else if ((event.code === 'ShiftLeft' || event.code === 'ShiftRight') && isPressed && activeLang === 'ru') {
    isPressed = false;
    language = en;
    activeLang = 'en';
  }
});

document.addEventListener('keyup', (event) => {
  document.querySelectorAll('.key').forEach((item, index) => {
    const element = item;
    if (event.code === language[index].code) {
      element.classList.remove('active');
    }
  });
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    document.querySelectorAll('.key').forEach((item, index) => {
      const element = item;
      element.innerHTML = language[index].small;
    });
  }
  if (event.code === 'CapsLock') {
    document.querySelectorAll('.key').forEach((item, index) => {
      const element = item;
      if (/^[a-zA-Zа-яА-ЯёЁ]+$/.test(element.innerHTML)) {
        element.innerHTML = language[index].small;
      }
    });
  }
});
