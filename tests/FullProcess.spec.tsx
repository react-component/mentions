import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Mentions from '../src';
import type { MentionsProps } from '../src';
import { expectMatchOptions, simulateInput } from './util';

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
    console.log(container.innerHTML);
    expect(container.querySelector('.rc-mentions-measure')).toBeTruthy();

    fireEvent.keyDown(container.querySelector('textarea'), {
      keyCode: KeyCode.ENTER,
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('1 @bamboo 2');
  });

  // it('reuse typed text', () => {
  //   const onChange = jest.fn();
  //   const wrapper = createMentions({ onChange });
  //   simulateInput(wrapper, '1 @bamboo 2');

  //   // Mock direct to the position
  //   wrapper.find('textarea').instance().selectionStart = 3;
  //   wrapper.find('textarea').simulate('keyUp', {});
  //   expect(wrapper.state().measuring).toBeTruthy();

  //   wrapper.find('textarea').simulate('keyDown', {
  //     which: KeyCode.ENTER,
  //   });

  //   expect(onChange).toBeCalledWith('1 @bamboo 2');
  // });

  // it('stop measure if match split', () => {
  //   const wrapper = createMentions();
  //   simulateInput(wrapper, '@a');
  //   expect(wrapper.state().measuring).toBeTruthy();
  //   simulateInput(wrapper, '@a ');
  //   expect(wrapper.state().measuring).toBeFalsy();
  // });

  // it('stop measure if remove prefix', () => {
  //   const wrapper = createMentions();
  //   simulateInput(wrapper, 'test@');
  //   expect(wrapper.state().measuring).toBeTruthy();
  //   simulateInput(wrapper, 'test');
  //   expect(wrapper.state().measuring).toBeFalsy();
  // });

  // it('should not call onPressEnter when measuring', () => {
  //   const onPressEnter = jest.fn();
  //   const wrapper = createMentions({ onPressEnter });

  //   simulateInput(wrapper, '@');
  //   wrapper.find('textarea').simulate('keyDown', {
  //     keyCode: KeyCode.ENTER,
  //   });
  //   expect(onPressEnter).not.toHaveBeenCalled();

  //   simulateInput(wrapper, 'test');
  //   wrapper.find('textarea').simulate('keyDown', {
  //     keyCode: KeyCode.ENTER,
  //   });
  //   expect(onPressEnter).toHaveBeenCalled();
  // });

  // it('should support same value', () => {
  //   const wrapper = mount(
  //     <Mentions>
  //       <Option value="bamboo">Bamboo</Option>
  //       <Option value="bamboo" key="same_bamboo">
  //         Bamboo
  //       </Option>
  //       <Option value="light">Light</Option>
  //       <Option value="cat">Cat</Option>
  //     </Mentions>,
  //   );

  //   simulateInput(wrapper, '@');
  //   expect(
  //     wrapper.find('li.rc-mentions-dropdown-menu-item-active').length,
  //   ).toBe(1);
  // });

  // it('ESC', () => {
  //   const wrapper = createMentions();

  //   simulateInput(wrapper, '@');
  //   expect(wrapper.state().measuring).toBe(true);

  //   simulateInput(wrapper, '@', {
  //     which: KeyCode.ESC,
  //   });

  //   expect(wrapper.state().measuring).toBe(false);
  // });
});
