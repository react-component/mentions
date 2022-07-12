import { fireEvent } from '@testing-library/react';

export function simulateInput(
  container: HTMLElement,
  text = '',
  keyEvent?: any,
) {
  const lastChar = text[text.length - 1];
  const myKeyEvent = keyEvent || {
    which: lastChar.charCodeAt(0),
    keyCode: lastChar.charCodeAt(0),
    key: lastChar,
  };

  fireEvent.keyDown(container.querySelector('textarea'), myKeyEvent);

  // const textareaInstance = container.querySelector('textarea');
  // textareaInstance.value = text;
  // textareaInstance.selectionStart = text.length;

  if (!keyEvent) {
    fireEvent.change(container.querySelector('textarea'), {
      target: { value: text, selectionStart: text.length },
    });
  }

  // textareaInstance.selectionStart = text.length;
  // wrapper.find('textarea').simulate('keyUp', myKeyEvent);
  fireEvent.keyUp(container.querySelector('textarea'), myKeyEvent);

  // wrapper.update();
}

export function expectMatchOptions(targetLabels: string[]) {
  const list = Array.from(
    document.querySelectorAll('.rc-mentions-dropdown-menu-item'),
  ).map(item => item.textContent);
  expect(list).toEqual(targetLabels);
}
