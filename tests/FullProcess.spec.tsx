import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Mentions from '../src';
import type { MentionsProps } from '../src';
import { expectMatchOptions, expectMeasuring, simulateInput } from './util';

const { Option } = Mentions;

describe('Full Process', () => {
  function createMentions(props?: MentionsProps) {
    return render(
      <Mentions {...props}>
        <Option value="bamboo">Bamboo</Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>,
    );
  }

  it('Keyboard selection', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const onSearch = jest.fn();
    const onKeyDown = jest.fn();
    const onKeyUp = jest.fn();
    const { container } = createMentions({
      onChange,
      onKeyDown,
      onKeyUp,
      onSelect,
      onSearch,
    });

    simulateInput(container, '@');
    expectMatchOptions(['Bamboo', 'Light', 'Cat']);

    simulateInput(container, '@a');
    expectMatchOptions(['Bamboo', 'Cat']);
    expect(onSearch).toBeCalledWith('a', '@');

    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.DOWN,
      which: KeyCode.DOWN,
    });
    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('@cat ');
    expect(onSelect).toBeCalledWith(
      expect.objectContaining({ value: 'cat' }),
      '@',
    );
    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyUp).toHaveBeenCalled();
  });

  it('insert into half way', () => {
    const onChange = jest.fn();
    const { container } = createMentions({ onChange });
    simulateInput(container, '1 @ 2');

    // Mock direct to the position
    container.querySelector('textarea').selectionStart = 3;
    fireEvent.keyUp(container.querySelector('textarea'), {
      keyCode: KeyCode.SHIFT,
      which: KeyCode.SHIFT,
    });
    expectMeasuring(container);

    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('1 @bamboo 2');
  });

  it('reuse typed text', () => {
    const onChange = jest.fn();
    const { container } = createMentions({ onChange });
    simulateInput(container, '1 @bamboo 2');

    // Mock direct to the position
    container.querySelector('textarea').selectionStart = 3;
    fireEvent.keyUp(container.querySelector('textarea'), {
      keyCode: KeyCode.SHIFT,
      which: KeyCode.SHIFT,
    });
    expectMeasuring(container);

    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('1 @bamboo 2');
  });

  it('stop measure if match split', () => {
    const { container } = createMentions();
    simulateInput(container, '@a');
    expectMeasuring(container);
    simulateInput(container, '@a ');
    expectMeasuring(container, false);
  });

  it('stop measure if remove prefix', () => {
    const { container } = createMentions();
    simulateInput(container, 'test@');
    expectMeasuring(container);
    simulateInput(container, 'test');
    expectMeasuring(container, false);
  });

  it('should not call onPressEnter when measuring', () => {
    const onPressEnter = jest.fn();
    const { container } = createMentions({ onPressEnter });

    simulateInput(container, '@');
    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });
    expect(onPressEnter).not.toHaveBeenCalled();

    simulateInput(container, 'test');
    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });
    expect(onPressEnter).toHaveBeenCalled();
  });

  it('should support same value', () => {
    const { container } = render(
      <Mentions>
        <Option value="bamboo">Bamboo</Option>
        <Option value="bamboo" key="same_bamboo">
          Bamboo
        </Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>,
    );

    simulateInput(container, '@');
    expect(
      container.querySelectorAll('li.rc-mentions-dropdown-menu-item-active'),
    ).toHaveLength(1);
  });

  it('ESC', () => {
    const { container } = createMentions();

    simulateInput(container, '@');
    expectMeasuring(container);

    simulateInput(container, '@', {
      keyCode: KeyCode.ESC,
      which: KeyCode.ESC,
    });

    expectMeasuring(container, false);
  });
});
