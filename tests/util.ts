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

  if (!keyEvent) {
    fireEvent.change(container.querySelector('textarea'), {
      target: { value: text, selectionStart: text.length },
    });
  }

  fireEvent.keyUp(container.querySelector('textarea'), myKeyEvent);
}

export function expectMatchOptions(targetLabels: string[]) {
  const list = Array.from(
    document.querySelectorAll('.rc-mentions-dropdown-menu-item'),
  ).map(item => item.textContent);
  expect(list).toEqual(targetLabels);
}

export function expectMeasuring(container: HTMLElement, measuring = true) {
  const expected = expect(container.querySelector('.rc-mentions-measure'));

  if (measuring) {
    expected.toBeTruthy();
  } else {
    expected.toBeFalsy();
  }
}
