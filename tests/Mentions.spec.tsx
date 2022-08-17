import React, { createRef } from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import Mentions from '../src';
import type { MentionsProps } from '../src';
import { expectMatchOptions, expectMeasuring, simulateInput } from './util';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import type { MentionsRef } from '../src/Mentions';

const { Option } = Mentions;

describe('Mentions', () => {
  function createMentions(
    props?: MentionsProps & { ref?: React.Ref<MentionsRef> },
  ) {
    return (
      <Mentions {...props}>
        <Option value="bamboo">Bamboo</Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>
    );
  }

  function renderMentions(
    props?: MentionsProps & { ref?: React.Ref<MentionsRef> },
  ) {
    return render(createMentions(props));
  }

  describe('focus test', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('autoFocus', () => {
      const { container } = renderMentions({ autoFocus: true });
      expect(document.activeElement).toBe(container.querySelector('textarea'));
    });

    it('not lose focus if click on dropdown', () => {
      const onBlur = jest.fn();
      const { container } = renderMentions({
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
        container.querySelector('li.rc-mentions-dropdown-menu-item'),
      );
      fireEvent.blur(container.querySelector('textarea'));
      fireEvent.click(
        container.querySelector('li.rc-mentions-dropdown-menu-item'),
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
      const { container } = renderMentions();
      simulateInput(container, '@');
      fireEvent.mouseEnter(
        container.querySelector('li.rc-mentions-dropdown-menu-item:last-child'),
      );
      expect(
        container.querySelector('.rc-mentions-dropdown-menu-item-active')
          .textContent,
      ).toBe('Cat');
    });
  });

  it('dropdownClassName should work', () => {
    const { container } = renderMentions({ dropdownClassName: 'my-dropdown' });
    simulateInput(container, '@');
    expect(
      container.querySelector('.my-dropdown.rc-mentions-dropdown'),
    ).toBeTruthy();
  });

  it('should support textarea in ref', () => {
    const ref = createRef<MentionsRef>();
    const { container } = render(createMentions({ ref }));
    expect(ref.current.textarea).toBe(container.querySelector('textarea'));
  });
});
