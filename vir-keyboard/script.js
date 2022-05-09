const enRows = [{
        mainKeys: '`1234567890-='.split(''),
        extraContent: '~!@#$%^&*()_+'.split(''),
        afterSpecialKeys: ['Backspace'],
    },
    {
        mainKeys: `QWERTYUIOP[]\\`.split(''),
        extraContent: '            /'.split(''),
        beforeSpecialKeys: ['Tab'],
        afterSpecialKeys: ['DEL']
    },
    {
        mainKeys: `ASDFGHJKL;'`.split(''),
        beforeSpecialKeys: ['Caps Lock'],
        afterSpecialKeys: ['ENTER']
    },
    {
        mainKeys: `\\ZXCVBNM.,/`.split(''),
        beforeSpecialKeys: ['Shift'],
        afterSpecialKeys: ['ᐃ', 'Shift']
    },
    {
        mainKeys: ['space'],
        beforeSpecialKeys: ['Ctrl', 'Win', 'Alt'],
        afterSpecialKeys: ['Alt', 'Ctrl', 'ᐊ', 'ᐁ', 'ᐅ']
    }
];

const ruRows = [{
        mainKeys: 'Ё1234567890-='.split(''),
        extraContent: ' !"№;%:?*()_+'.split(''),
        afterSpecialKeys: ['Backspace'],
    },
    {
        mainKeys: `ЙЦУКЕНГШЩЗХЪ\\`.split(''),
        extraContent: '            /'.split(''),
        beforeSpecialKeys: ['Tab'],
        afterSpecialKeys: ['DEL']
    },
    {
        mainKeys: `ФЫВАПРОЛДЖЭ`.split(''),
        beforeSpecialKeys: ['Caps Lock'],
        afterSpecialKeys: ['ENTER']
    },
    {
        mainKeys: `ЯЧСМИТЬБЮ.,`.split(''),
        beforeSpecialKeys: ['Shift'],
        afterSpecialKeys: ['ᐃ', 'Shift']
    },
    {
        mainKeys: ['space'],
        beforeSpecialKeys: ['Ctrl', 'Win', 'Alt'],
        afterSpecialKeys: ['Alt', 'Ctrl', 'ᐊ', 'ᐁ', 'ᐅ']
    }
];

function createElement(tag, className) {
    const element = document.createElement(tag);
    if (Array.isArray(className)) {
        element.classList.add(...className);
    } else {
        element.classList.add(className);
    }
    return element;
}

function createKeyboard(content) {
    const keyboard = createElement('div', 'keyboard');
    let i = 0;
    content.forEach(element => {
        keyboard.append(createRow(element, i++))
    });
    keyboard.addEventListener('click', e => {
        keyboard.childNodes.forEach(row => {
            extraContentRows.forEach(num => {
                if (row.getAttribute('number') == num) {
                    row.click();
                }
            });
        });
    });
    keyboard.addEventListener('keydown', e => {
        keyboardKeyDown(e);
        if (shiftPressed && altPressed) {
            changeLanguage();
        }
    });
    keyboard.addEventListener('keyup', e => {
        keyboardKeyUp(e);
    });
    return keyboard;
}

function createKeyboardEn() {
    return createKeyboard(enRows);

}

function createKeyboardRu() {
    return createKeyboard(ruRows);
}

function createRow(rowContent, rowNumber) {
    const row = createElement('div', 'keyboard_row');
    if (rowContent.beforeSpecialKeys != undefined) {
        rowContent.beforeSpecialKeys.forEach(element => {
            if (element == 'Caps Lock' || element == 'Shift') {
                row.append(createSpecialKey(element, 'key_wide'));
                if (element == 'Shift') {
                    row.childNodes[row.childNodes.length - 1].addEventListener('click', shiftFunc1);
                }
            } else if (element == 'Tab' || element == 'Ctrl') {
                row.append(createSpecialKey(element, 'key_spacious'));
            } else {
                row.append(createSpecialKey(element));
            }
            if (element == 'Alt') {
                row.childNodes[row.childNodes.length - 1].addEventListener('click', altFunc1);
            }
        });
    }
    if (rowContent.extraContent == undefined) {
        rowContent.mainKeys.forEach(element => {
            if (element == 'space') {
                const key = createKey(' ');
                key.classList.add('key_space');
                row.append(key);
            } else {
                row.append(createKey(element));
            }
        });
    } else {
        const keys = createKeysWithExtraContent(rowContent.mainKeys, rowContent.extraContent);
        keys.forEach(element => {
            row.append(element);
        });
        extraContentRows.push(rowNumber);
    }
    if (rowContent.afterSpecialKeys != undefined) {
        rowContent.afterSpecialKeys.forEach(element => {
            if (element == 'ENTER' || element == 'Backspace') {
                row.append(createSpecialKey(element, 'key_wide'));
            } else if (element == 'Ctrl') {
                row.append(createSpecialKey(element, 'key_spacious'));
            } else {
                row.append(createSpecialKey(element));
            }
            if (element == 'Shift') {
                row.childNodes[row.childNodes.length - 1].addEventListener('click', shiftFunc2);
            }
            if (element == 'Alt') {
                row.childNodes[row.childNodes.length - 1].addEventListener('click', altFunc2);
            }
        });
    }
    row.setAttribute('number', rowNumber);
    row.addEventListener('click', () => {
        row.childNodes.forEach(child => {
            if (child.childNodes.length == 2) {
                if (shiftPressed) {
                    child.childNodes[0].classList.remove('key_content_main');
                    child.childNodes[0].classList.add('key_content_extra');
                    child.childNodes[1].classList.remove('key_content_extra');
                    child.childNodes[1].classList.add('key_content_main');
                } else {
                    child.childNodes[1].classList.remove('key_content_main');
                    child.childNodes[1].classList.add('key_content_extra');
                    child.childNodes[0].classList.remove('key_content_extra');
                    child.childNodes[0].classList.add('key_content_main');
                }
            }
        })
    });
    return row;
}

function createKeysWithExtraContent(mainContent, extraContent) {
    let keys = [];
    for (let i = 0; i < mainContent.length; i++) {
        if (extraContent[i] && extraContent[i] != ' ') {
            keys.push(createKey(mainContent[i], extraContent[i]));
        } else {
            keys.push(createKey(mainContent[i]));
        }
    }
    return keys;
}

function createKey(mainContent, extraContent = '', specialKey = false) {
    const key = createElement('div', 'keyboard_key');
    const keyMainContent = createElement('div', 'key_content_main');
    keyMainContent.innerHTML = mainContent;
    key.append(keyMainContent);
    if (specialKey) {
        key.classList.add('special_key');
    } else {
        key.classList.add('typing_key');
        if (extraContent) {
            const keyExtraContent = createElement('div', 'key_content_extra');
            keyExtraContent.innerHTML = extraContent;
            key.append(keyExtraContent);
        }
        key.setAttribute('code', `Key${mainContent}`);
    }
    key.setAttribute('focused', false);
    key.addEventListener('mousedown', e => {
        keyMouseDown(key);
    });
    key.addEventListener('mouseup', e => {
        keyMouseUp(key);
    });
    key.addEventListener('mouseleave', e => {
        keyMouseLeave(key);
    });
    key.addEventListener('keydown', e => {
        keyMouseDown(key);
    });
    key.addEventListener('keyup', e => {
        keyMouseUp(key);
    })
    return key;
}

function inputKeyContent(key) {
    let keyContent = key.querySelector('.key_content_main').textContent;
    if (key.classList.contains('typing_key')) {
        if ((capsLockPressed || shiftPressed) && keyContent.toUpperCase() != keyContent.toLowerCase()) {
            addFragment(keyContent);
        } else {
            addFragment(keyContent.toLowerCase());
        }
        caretPos++;
        changeCaret();
    }
    if (key.classList.contains('special_key')) {
        if (keyContent == 'Caps Lock') {
            capsLockFunc();
        }
        if (keyContent == 'Tab') {
            input.value += tabFunc();
        }
        if (keyContent == 'Caps Lock') {
            input.value += enterFunc();
        }
        if (keyContent == 'Backspace') {
            backspaceFunc();
        }
        if (keyContent == 'DEL') {
            delFunc();
        }
    }
}

function changeCaret() {
    input.focus();
    if (caretPos < 0) {
        caretPos = 0;
    }
    input.setSelectionRange(caretPos, caretPos);
}

function keyMouseDown(key) {
    key.classList.add('key_active');
    key.setAttribute('focused', true);
}

function keyMouseUp(key) {
    key.classList.remove('key_active');
    if (key.getAttribute('focused') == 'true') {
        inputKeyContent(key);
    }
    key.setAttribute('focused', false);
}

function keyMouseLeave(key) {
    key.classList.remove('key_active');
    key.setAttribute('focused', false);
}

function inputChange() {
    caretPos = input.selectionStart;
}

function createSpecialKey(content, className = '') {
    const key = createKey(content, '', true);
    if (className != '') {
        key.classList.add(className);
    }
    return key;
}

function shiftFunc1() {
    shift1 = !shift1;
    shiftPressed = shift1 || shift2;
    if (shiftPressed && altPressed) {
        changeLanguage();
    }
    keyboard.click();
}

function shiftFunc2() {
    shift2 = !shift2;
    shiftPressed = shift1 || shift2;
    if (shiftPressed && altPressed) {
        changeLanguage();
    }
    keyboard.click();
}

function capsLockFunc() {
    capsLockPressed = !capsLockPressed;
}

function backspaceFunc() {
    deleteFragment(caretPos - 1, caretPos);
    caretPos--;
    changeCaret();
}

function delFunc() {
    deleteFragment(caretPos, caretPos + 1);
    changeCaret();
}

function altFunc1() {
    alt1 = !alt1;
    altPressed = alt1 || alt2;
    if (shiftPressed && altPressed) {
        changeLanguage();
    }
}

function altFunc2() {
    alt2 = !alt2;
    altPressed = alt1 || alt2;
    if (shiftPressed && altPressed) {
        changeLanguage();
    }
}

function deleteFragment(start, end) {
    let startStr = input.value.slice(0, start);
    let endStr = input.value.slice(end, input.value.length);
    input.value = startStr + endStr;
}

function addFragment(fragment) {
    let startStr = input.value.slice(0, caretPos);
    let endStr = input.value.slice(caretPos, input.value.length);
    input.value = startStr + fragment + endStr;
}

function tabFunc() {
    caretPos++;
    return '\t';
}

function enterFunc() {
    return '\r\n';
}

function switchKeyActivation(e, isActive) {
    keyboard.childNodes.forEach(row => {
        row.childNodes.forEach(key => {
            let keyContent = key.querySelector('.key_content_main').textContent;
            if (key.classList.contains('typing_key')) {
                if (e.detail.key.toLowerCase() && keyContent.toLowerCase()) {
                    if (e.detail.key.toLowerCase() == keyContent.toLowerCase()) {
                        if (isActive) {
                            key.dispatchEvent(new CustomEvent('keydown'));
                        } else {
                            key.dispatchEvent(new CustomEvent('keyup'));
                        }
                    }
                }
            } else {
                if (e.detail.key == keyContent) {
                    if (isActive) {
                        key.dispatchEvent(new CustomEvent('keydown'));
                        key.dispatchEvent(new CustomEvent('click'));
                    } else {
                        key.dispatchEvent(new CustomEvent('keyup'));
                        key.dispatchEvent(new CustomEvent('click'));
                    }
                }
                else {
                    if (e.detail.key == 'Control' && keyContent == 'Ctrl') {
                        if (isActive) {
                            key.dispatchEvent(new CustomEvent('keydown'));
                        } else {
                            key.dispatchEvent(new CustomEvent('keyup'));
                        }
                    }
                }
            }
        });
    });
}

function clearAllKey() {
    keyboard.childNodes.forEach(row => {
        row.childNodes.forEach(key => {
            key.classList.remove('key_active');
        });
    });
    alt1 = alt2 = shift1 = shift2 = altPressed = shiftPressed = false;
}

function keyboardKeyDown(e) {
    switchKeyActivation(e, true);
}

function keyboardKeyUp(e) {
    switchKeyActivation(e, false);
}

function changeLanguage() {
    let newKeyboard;
    if (localStorage.getItem('lang') == 'ru') {
        newKeyboard = createKeyboardEn();
        localStorage.setItem('lang', 'en')
    } else {
        newKeyboard = createKeyboardRu();
        localStorage.setItem('lang', 'ru')
    }
    main.replaceChild(newKeyboard, keyboard);
    keyboard = newKeyboard;
    clearAllKey();
}

function createToolBar() {
    let toolBar = createElement('div', 'tool_bar');

}

function createVirtualKeyboard() {
    const main = createElement('div', 'main');
    if (localStorage.getItem('lang') == undefined || localStorage.getItem('lang') == 'en') {
        main.append(createKeyboardEn());
    } else {
        main.append(createKeyboardRu());
    }
    const textArea = createElement('div', 'text_area');
    textArea.append(createElement('textarea', 'input_area'));
    main.prepend(textArea);
    return main;
}

let extraContentRows = [];
let shiftPressed = false;
let shift1 = false;
let shift2 = false;
let capsLockPressed = false;
let altPressed = false;
let alt1 = false;
let alt2 = false;
let caretPos = 0;
const main = createVirtualKeyboard();
document.body.append(main);
const input = document.querySelector('.input_area');
input.addEventListener('mouseup', inputChange);
input.addEventListener('change', inputChange);
input.addEventListener('keypress', e => {
    e.preventDefault();
});
let keyboard = document.querySelector('.keyboard');
document.addEventListener('keydown', (e) => {
    //e.preventDefault();
    input.focus();
    keyboard.dispatchEvent(new CustomEvent('keydown', {
        detail: {
            key: e.key
        }
    }));
});
document.addEventListener('keyup', (e) => {
    //e.preventDefault();
    keyboard.dispatchEvent(new CustomEvent('keyup', {
        detail: {
            key: e.key,
            code: e.code
        }
    }));
});
document.addEventListener('blur', clearAllKey);