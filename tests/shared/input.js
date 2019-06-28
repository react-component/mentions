/* eslint-disable import/prefer-default-export */

export function simulateInput(wrapper, text = '', keyEvent) {
  const lastChar = text[text.length - 1];
  const myKeyEvent = keyEvent || {
    which: lastChar.charCodeAt(0),
    key: lastChar,
    target: {
      value: text,
      selectionStart: text.length,
    },
  };

  wrapper.find('textarea').simulate('keyDown', myKeyEvent);

  const textareaInstance = wrapper.find('textarea').instance();
  textareaInstance.value = text;
  textareaInstance.selectionStart = text.length;
  textareaInstance.selectionStart = text.length;

  if (!keyEvent) {
    wrapper.find('textarea').simulate('change', {
      target: { value: text },
    });
  }

  wrapper.find('textarea').simulate('keyUp', myKeyEvent);
  wrapper.update();
}
