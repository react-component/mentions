import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import Mentions from '../src';

describe('should support allowClear', () => {
  it('should change type when click', () => {
    const { container } = render(<Mentions allowClear />);
    fireEvent.change(container.querySelector('textarea')!, {
      target: { value: '111' },
    });
    expect(container.querySelector('textarea')?.value).toEqual('111');
    expect(
      container.querySelector('.rc-mentions-clear-icon-hidden'),
    ).toBeFalsy();
    fireEvent.click(container.querySelector('.rc-mentions-clear-icon')!);
    expect(
      container.querySelector('.rc-mentions-clear-icon-hidden'),
    ).toBeTruthy();
    expect(container.querySelector('textarea')?.value).toEqual('');
  });

  it('should not show icon if value is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val =>
      render(<Mentions allowClear value={val as unknown as string} />),
    );
    wrappers.forEach(({ asFragment, container }) => {
      expect(container.querySelector('textarea')?.value).toEqual('');
      expect(
        container.querySelector('.rc-mentions-clear-icon-hidden'),
      ).toBeTruthy();
      expect(asFragment().firstChild).toMatchSnapshot();
    });
  });

  it('should not show icon if defaultValue is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val =>
      render(<Mentions allowClear defaultValue={val as unknown as string} />),
    );
    wrappers.forEach(({ asFragment, container }) => {
      expect(container.querySelector('textarea')?.value).toEqual('');
      expect(
        container.querySelector('.rc-mentions-clear-icon-hidden'),
      ).toBeTruthy();
      expect(asFragment().firstChild).toMatchSnapshot();
    });
  });

  it('should trigger event correctly', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Mentions allowClear defaultValue="111" onChange={onChange} />,
    );
    fireEvent.click(container.querySelector('.rc-mentions-clear-icon')!);
    expect(onChange).toHaveBeenCalledWith('');
    expect(container.querySelector('textarea')?.value).toBe('');
  });

  it('should support onClear', () => {
    const onClear = jest.fn();
    const { container } = render(
      <Mentions onClear={onClear} defaultValue="test" allowClear />,
    );
    fireEvent.click(
      container.querySelector<HTMLSpanElement>('.rc-mentions-clear-icon')!,
    );
    expect(onClear).toHaveBeenCalled();
  });
});
