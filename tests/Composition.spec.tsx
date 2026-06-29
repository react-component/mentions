import { act, createEvent, fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@rc-component/util';
import React from 'react';
import Mentions from '../src';
import { simulateInput } from './util';

// The keydown that confirms an IME composition still reports `which === ENTER`
// on some browsers (e.g. Safari) while `isComposing` is true.
function imeEnterKeyDown(element: HTMLElement) {
  const event = createEvent.keyDown(element, { keyCode: KeyCode.ENTER });
  Object.defineProperties(event, {
    which: { get: () => KeyCode.ENTER },
    isComposing: { get: () => true },
  });
  act(() => {
    fireEvent(element, event);
  });
}

const options = [
  { value: 'bamboo', label: 'Bamboo' },
  { value: 'cat', label: 'Cat' },
];

describe('Mentions.Composition', () => {
  it('does not select the active option when Enter only confirms the IME composition', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { container } = render(
      <Mentions options={options} onChange={onChange} onSelect={onSelect} />,
    );

    simulateInput(container, '@');

    // Typing the trigger fires onChange, so only watch what the Enter does.
    onChange.mockClear();
    onSelect.mockClear();

    imeEnterKeyDown(container.querySelector('textarea'));

    expect(onSelect).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('still selects the active option on a normal Enter', () => {
    const onSelect = jest.fn();
    const { container } = render(
      <Mentions options={options} onSelect={onSelect} />,
    );

    simulateInput(container, '@');

    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'bamboo' }),
      '@',
    );
  });
});
