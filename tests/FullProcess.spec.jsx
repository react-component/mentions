import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import React from 'react';
import Mentions from '../src';
import { simulateInput } from './shared/input';

const { Option } = Mentions;

describe('Full Process', () => {
  function createMentions(props) {
    return mount(
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
    const wrapper = createMentions({ onChange, onSelect, onSearch });

    simulateInput(wrapper, '@');
    expect(wrapper.find('DropdownMenu').props().options).toMatchObject([
      { value: 'bamboo' },
      { value: 'light' },
      { value: 'cat' },
    ]);

    simulateInput(wrapper, '@a');
    wrapper.find('textarea').instance().selectionStart = 2;
    wrapper.find('textarea').simulate('keyUp', {});
    expect(wrapper.find('DropdownMenu').props().options).toMatchObject([
      { value: 'bamboo' },
      { value: 'cat' },
    ]);
    expect(onSearch).toBeCalledWith('a', '@');

    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.DOWN,
    });
    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('@cat ');
    expect(onSelect).toBeCalledWith(expect.objectContaining({ value: 'cat' }), '@');
  });

  it('insert into half way', () => {
    const onChange = jest.fn();
    const wrapper = createMentions({ onChange });
    simulateInput(wrapper, '1 @ 2');

    // Mock direct to the position
    wrapper.find('textarea').instance().selectionStart = 3;
    wrapper.find('textarea').simulate('keyUp', {});
    expect(wrapper.state().measuring).toBeTruthy();

    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('1 @bamboo 2');
  });

  it('reuse typed text', () => {
    const onChange = jest.fn();
    const wrapper = createMentions({ onChange });
    simulateInput(wrapper, '1 @bamboo 2');

    // Mock direct to the position
    wrapper.find('textarea').instance().selectionStart = 3;
    wrapper.find('textarea').simulate('keyUp', {});
    expect(wrapper.state().measuring).toBeTruthy();

    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.ENTER,
    });

    expect(onChange).toBeCalledWith('1 @bamboo 2');
  });

  it('stop measure if match split', () => {
    const wrapper = createMentions();
    simulateInput(wrapper, '@a');
    expect(wrapper.state().measuring).toBeTruthy();
    simulateInput(wrapper, '@a ');
    expect(wrapper.state().measuring).toBeFalsy();
  });

  it('stop measure if remove prefix', () => {
    const wrapper = createMentions();
    simulateInput(wrapper, 'test@');
    expect(wrapper.state().measuring).toBeTruthy();
    simulateInput(wrapper, 'test');
    expect(wrapper.state().measuring).toBeFalsy();
  });

  it('ESC', () => {
    const wrapper = createMentions();

    simulateInput(wrapper, '@');
    expect(wrapper.state().measuring).toBe(true);

    simulateInput(wrapper, '@', {
      which: KeyCode.ESC,
    });

    expect(wrapper.state().measuring).toBe(false);
  });

  it('add suffix after target if suffix exists', () => {
    const onChange = jest.fn();
    const onKeyDown = jest.fn();
    const wrapper = createMentions({
      prefix: '{',
      suffix: '}',
      split: ' ',
      onChange,
      onKeyDown,
    });

    simulateInput(wrapper, '{');
    wrapper.find('textarea').instance().selectionStart = 1;
    expect(wrapper.state().measuring).toBe(true);

    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.ENTER,
    });

    expect(wrapper.state().measuring).toBe(false);
    expect(onChange).toBeCalledWith('{bamboo} ');
  });
});
