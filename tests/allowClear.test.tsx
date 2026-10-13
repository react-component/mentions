import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import Mentions from '../src';

describe('allowClear configuration', () => {
  it.each([undefined, 'suffix'])(
    'preserves clear configuration and suffix %s',
    suffix => {
      const onChange = jest.fn();
      const onClear = jest.fn();
      const config = Object.freeze({
        clearIcon: 'custom',
        label: 'Erase',
        tabIndex: -1,
      });
      const props = { defaultValue: 'text', suffix, onChange, onClear };
      const { container, getByRole, queryByRole, rerender } = render(
        <Mentions {...props} allowClear={false} />,
      );
      const markup = container.innerHTML;
      rerender(
        <Mentions {...props} allowClear={{ ...config, disabled: true }} />,
      );
      expect(container.innerHTML).toBe(markup);
      expect(queryByRole('button')).toBeNull();
      expect(getByRole('textbox')).toHaveValue('text');
      expect(onChange).not.toHaveBeenCalled();
      expect(onClear).not.toHaveBeenCalled();
      rerender(<Mentions {...props} allowClear={config} />);
      const button = getByRole('button', { name: 'Erase' });
      expect(button).toHaveTextContent('custom');
      expect(button.tabIndex).toBe(-1);
      fireEvent.click(button);
      expect(getByRole('textbox')).toHaveValue('');
      expect(onChange).toHaveBeenCalledWith('');
      expect(onClear).toHaveBeenCalledTimes(1);
    },
  );

  it('updates only the clear button tabIndex and label', () => {
    const { getByRole, rerender } = render(
      <Mentions
        defaultValue="text"
        tabIndex={3}
        allowClear={{ tabIndex: -1 }}
      />,
    );
    const input = getByRole('textbox');
    expect(input.tabIndex).toBe(3);
    expect(getByRole('button', { name: 'Clear' }).tabIndex).toBe(-1);
    rerender(
      <Mentions
        defaultValue="text"
        tabIndex={3}
        allowClear={{ tabIndex: 0, label: 'Erase' }}
      />,
    );
    expect(getByRole('button', { name: 'Erase' }).tabIndex).toBe(0);
    expect(input.tabIndex).toBe(3);
  });

  it('preserves focus and selection when the suffix retains the wrapper', () => {
    const { getByRole, rerender } = render(
      <Mentions suffix="suffix" defaultValue="text" allowClear />,
    );
    const input = getByRole('textbox') as HTMLTextAreaElement;
    act(() => input.focus());
    input.setSelectionRange(1, 3);
    rerender(
      <Mentions
        suffix="suffix"
        defaultValue="text"
        allowClear={{ disabled: true }}
      />,
    );
    expect(getByRole('textbox')).toBe(input);
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(3);
  });
});
