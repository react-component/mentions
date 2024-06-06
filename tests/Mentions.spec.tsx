import { fireEvent, render } from '@testing-library/react';
import KeyCode from 'rc-util/lib/KeyCode';
import React, { createRef } from 'react';
import { act } from 'react-dom/test-utils';
import type { MentionsProps } from '../src';
import Mentions from '../src';
import type { MentionsRef } from '../src/Mentions';
import { expectMatchOptions, expectMeasuring, simulateInput } from './util';

const { Option } = Mentions;

describe('Mentions', () => {
  function createMentions(
    props?: MentionsProps & { ref?: React.Ref<MentionsRef> },
  ) {
    return (
      <Mentions
        options={[
          {
            value: 'bamboo',
            label: 'Bamboo',
          },
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'cat',
            label: 'Cat',
          },
        ]}
        {...props}
      />
    );
  }

  function renderMentions(
    props?: MentionsProps & { ref?: React.Ref<MentionsRef> },
  ) {
    return render(createMentions(props));
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('focus test', () => {
    it('autoFocus', () => {
      const { container } = renderMentions({ autoFocus: true });
      expect(document.activeElement).toBe(container.querySelector('textarea'));
    });

    it('not lose focus if click on dropdown', () => {
      const onBlur = jest.fn();
      const { container, baseElement } = renderMentions({
        autoFocus: true,
        defaultValue: '@',
        onBlur,
      });

      // Inject to trigger measure
      simulateInput(container, '@b');
      act(() => {
        jest.runAllTimers();
      });

      fireEvent.focus(
        baseElement.querySelector('li.rc-mentions-dropdown-menu-item'),
      );
      fireEvent.blur(container.querySelector('textarea'));
      fireEvent.click(
        baseElement.querySelector('li.rc-mentions-dropdown-menu-item'),
      );
      fireEvent.focus(container.querySelector('textarea'));

      expect(onBlur).not.toHaveBeenCalled();
    });

    it('focus', () => {
      const onFocus = jest.fn();
      const { container } = renderMentions({ onFocus });
      fireEvent.focus(container.querySelector('textarea'));
      expect(onFocus).toHaveBeenCalled();
    });

    it('blur', () => {
      const onBlur = jest.fn();
      const { container } = renderMentions({ onBlur });
      fireEvent.blur(container.querySelector('textarea'));
      act(() => {
        jest.runAllTimers();
      });
      expect(onBlur).toHaveBeenCalled();
    });

    it('focus() & blur()', () => {
      const mentionsRef = React.createRef<MentionsRef>();
      const { container } = renderMentions({ ref: mentionsRef });
      mentionsRef.current.focus();
      expect(document.activeElement).toBe(container.querySelector('textarea'));

      mentionsRef.current.blur();
      expect(document.activeElement).not.toBe(
        container.querySelector('textarea'),
      );
    });
  });

  describe('value', () => {
    it('defaultValue', () => {
      const { container } = renderMentions({ defaultValue: 'light' });
      expect(container.querySelector('textarea').value).toBe('light');
    });

    it('controlled value', () => {
      const { container, rerender } = renderMentions({ value: 'bamboo' });
      expect(container.querySelector('textarea').value).toBe('bamboo');

      rerender(createMentions({ value: 'cat' }));
      expect(container.querySelector('textarea').value).toBe('cat');

      rerender(createMentions({ value: undefined }));
      expect(container.querySelector('textarea').value).toBe('');
    });

    it('onChange', () => {
      const onChange = jest.fn();
      const { container } = renderMentions({ onChange });
      fireEvent.change(container.querySelector('textarea'), {
        target: { value: 'bamboo' },
      });
      expect(onChange).toHaveBeenCalledWith('bamboo');
    });

    it('Keyboard Enter event', () => {
      const { container, rerender } = renderMentions();
      simulateInput(container, '@lig');
      fireEvent.keyDown(container.querySelector('textarea'), {
        which: KeyCode.ENTER,
        keyCode: KeyCode.ENTER,
      });
      expect(container.querySelector('textarea').value).toBe('@light ');

      rerender(createMentions({ silent: true }));
      simulateInput(container, '@lig');
      fireEvent.keyDown(container.querySelector('textarea'), {
        which: KeyCode.ENTER,
        keyCode: KeyCode.ENTER,
      });
      expect(container.querySelector('textarea').value).toBe('@lig');
    });
  });

  describe('support children Option', () => {
    function renderOptionsMentions(
      props?: MentionsProps & { ref?: React.Ref<MentionsRef> },
    ) {
      return render(
        <Mentions {...props}>
          <Option value="bamboo">Bamboo</Option>
          <Option value="light">Light</Option>
          <Option value="cat">Cat</Option>
        </Mentions>,
      );
    }
    it('defaultValue', () => {
      const { container } = renderOptionsMentions({ defaultValue: 'light' });
      expect(container.querySelector('textarea').value).toBe('light');
    });

    it('controlled value', () => {
      const { container, rerender } = renderOptionsMentions({
        value: 'bamboo',
      });
      expect(container.querySelector('textarea').value).toBe('bamboo');

      rerender(createMentions({ value: 'cat' }));
      expect(container.querySelector('textarea').value).toBe('cat');

      rerender(createMentions({ value: undefined }));
      expect(container.querySelector('textarea').value).toBe('');
    });

    it('onChange', () => {
      const onChange = jest.fn();
      const { container } = renderMentions({ onChange });
      fireEvent.change(container.querySelector('textarea'), {
        target: { value: 'bamboo' },
      });
      expect(onChange).toHaveBeenCalledWith('bamboo');
    });

    it('do not lose label', () => {
      const { container, baseElement } = renderOptionsMentions();
      simulateInput(container, '@');
      fireEvent.mouseEnter(
        baseElement.querySelector(
          'li.rc-mentions-dropdown-menu-item:last-child',
        ),
      );
      expect(
        baseElement.querySelector('.rc-mentions-dropdown-menu-item-active')
          .textContent,
      ).toBe('Cat');
    });
  });

  describe('filterOption', () => {
    it('false', () => {
      const { container } = renderMentions({ filterOption: false });
      simulateInput(container, '@notExist');
      expectMatchOptions(['Bamboo', 'Light', 'Cat']);
    });

    it('function', () => {
      const { container } = renderMentions({
        filterOption: (_, { value }) => value.includes('a'),
      });
      simulateInput(container, '@notExist');
      expectMatchOptions(['Bamboo', 'Cat']);
    });
  });

  it('notFoundContent', () => {
    const notFoundContent = 'Bamboo Light';
    const { container } = renderMentions({ notFoundContent });
    simulateInput(container, '@a');
    simulateInput(container, '@notExist');
    expectMatchOptions([notFoundContent]);

    // https://github.com/ant-design/ant-design/issues/26097
    fireEvent.keyDown(container.querySelector('textarea'), {
      which: KeyCode.ENTER,
      keyCode: KeyCode.ENTER,
    });
    // stop measure
    expectMeasuring(container, false);
    expect(container.querySelector('textarea').value).toBe('@notExist');
  });

  describe('accessibility', () => {
    it('hover', () => {
      const { container, baseElement } = renderMentions();
      simulateInput(container, '@');
      fireEvent.mouseEnter(
        baseElement.querySelector(
          'li.rc-mentions-dropdown-menu-item:last-child',
        ),
      );
      expect(
        baseElement.querySelector('.rc-mentions-dropdown-menu-item-active')
          .textContent,
      ).toBe('Cat');
    });
  });

  it('dropdownClassName should work', () => {
    const { container, baseElement } = renderMentions({
      dropdownClassName: 'my-dropdown',
    });
    simulateInput(container, '@');
    expect(
      baseElement.querySelector('.my-dropdown.rc-mentions-dropdown'),
    ).toBeTruthy();
  });

  it('should support direction', () => {
    const { container, baseElement } = renderMentions({ direction: 'rtl' });
    simulateInput(container, '@');
    act(() => {
      jest.runAllTimers();
    });
    expect(baseElement.querySelector('.rc-mentions-dropdown')).toBeTruthy();
  });

  it('should support textarea in ref', () => {
    const ref = createRef<MentionsRef>();
    const { container } = render(createMentions({ ref }));
    expect(ref.current.textarea).toBe(container.querySelector('textarea'));
  });

  it('className should always on the root element', () => {
    const ref = createRef<MentionsRef>();
    const { container, rerender } = render(
      createMentions({ ref, className: 'test-cls' }),
    );
    expect(container.firstChild).toHaveClass('test-cls');
    rerender(createMentions({ ref, className: 'test-cls', suffix: '123' }));
    expect(container.firstChild).toHaveClass('test-cls');
  });

  it('disabled should work on affix wrapper', () => {
    const { container } = render(
      createMentions({ disabled: true, suffix: '1' }),
    );
    expect(container.firstChild).toHaveClass('rc-mentions-disabled');
  });

  describe('nativeElement', () => {
    it('work', () => {
      const ref = createRef<MentionsRef>();
      const { container } = render(createMentions({ ref }));

      expect(ref.current.nativeElement).toBe(
        container.querySelector('.rc-mentions'),
      );
    });

    it('wrap ref', () => {
      const ref = createRef<MentionsRef>();
      const { container } = render(createMentions({ ref, allowClear: true }));

      expect(ref.current.nativeElement).toBe(
        container.querySelector('.rc-mentions-affix-wrapper'),
      );
    });
  });
});
