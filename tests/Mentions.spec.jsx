import { mount } from 'enzyme';
import React from 'react';
import KeyCode from 'rc-util/lib/KeyCode';
import toArray from 'rc-util/lib/Children/toArray';
import Mentions from '../src';
import { simulateInput } from './shared/input';

const { Option } = Mentions;

describe('Mentions', () => {
  function createMentions(props) {
    return mount(
      <Mentions {...props}>
        <Option value="bamboo">Bamboo</Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>,
    );
  }

  describe('focus test', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('autoFocus', () => {
      const wrapper = createMentions({ autoFocus: true });
      expect(document.activeElement).toBe(wrapper.find('textarea').instance());
    });

    it('not lose focus if click on dropdown', () => {
      const onBlur = jest.fn();
      const wrapper = createMentions({
        autoFocus: true,
        defaultValue: '@',
        onBlur,
      });

      // Inject to trigger measure
      wrapper.instance().startMeasure('b', '@', 1);
      jest.runAllTimers();
      wrapper.update();

      wrapper.find('li.rc-mentions-dropdown-menu-item').simulate('focus');
      wrapper.find('textarea').simulate('blur');
      wrapper.find('li.rc-mentions-dropdown-menu-item').simulate('click');
      wrapper.find('textarea').simulate('focus'); // This is not good but code focus not work in simulate
      jest.runAllTimers();

      expect(onBlur).not.toHaveBeenCalled();
    });

    it('focus', () => {
      const onFocus = jest.fn();
      const wrapper = createMentions({ onFocus });
      wrapper.find('textarea').simulate('focus');
      expect(onFocus).toHaveBeenCalled();
    });

    it('blur', () => {
      const onBlur = jest.fn();
      const wrapper = createMentions({ onBlur });
      wrapper.find('textarea').simulate('blur');
      jest.runAllTimers();
      expect(onBlur).toHaveBeenCalled();
    });

    it('focus() & blur()', () => {
      const wrapper = createMentions();
      wrapper.instance().focus();
      expect(document.activeElement).toBe(wrapper.find('textarea').instance());

      wrapper.instance().blur();
      expect(document.activeElement).not.toBe(
        wrapper.find('textarea').instance(),
      );
    });
  });

  describe('value', () => {
    it('defaultValue', () => {
      const wrapper = createMentions({ defaultValue: 'light' });
      expect(wrapper.find('textarea').props().value).toBe('light');
    });

    it('controlled value', () => {
      const wrapper = createMentions({ value: 'bamboo' });
      expect(wrapper.find('textarea').props().value).toBe('bamboo');

      wrapper.setProps({ value: 'cat' });
      expect(wrapper.find('textarea').props().value).toBe('cat');

      wrapper.setProps({ value: undefined });
      expect(wrapper.find('textarea').props().value).toBe('');
    });

    it('onChange', () => {
      const onChange = jest.fn();
      const wrapper = createMentions({ onChange });
      wrapper.find('textarea').simulate('change', {
        target: { value: 'bamboo' },
      });
      expect(onChange).toHaveBeenCalledWith('bamboo');
    });
  });

  describe('filterOption', () => {
    it('false', () => {
      const wrapper = createMentions({ filterOption: false });
      simulateInput(wrapper, '@notExist');
      expect(wrapper.find('DropdownMenu').props().options.length).toBe(3);
    });

    it('function', () => {
      const wrapper = createMentions({
        filterOption: (_, { value }) => value.includes('a'),
      });
      simulateInput(wrapper, '@notExist');
      expect(wrapper.find('DropdownMenu').props().options.length).toBe(2);
    });
  });

  it('notFoundContent', () => {
    const notFoundContent = 'Bamboo Light';
    const wrapper = createMentions({ notFoundContent });
    simulateInput(wrapper, '@a');
    simulateInput(wrapper, '@notExist');
    expect(wrapper.find('DropdownMenu').props().options.length).toBe(0);

    expect(
      toArray(
        wrapper.find('li.rc-mentions-dropdown-menu-item').props().children,
      )[0],
    ).toBe(notFoundContent);
    // https://github.com/ant-design/ant-design/issues/26097
    wrapper.find('textarea').simulate('keyDown', {
      which: KeyCode.ENTER,
    });
    // stop measure
    expect(wrapper.find('DropdownMenu').exists()).toBe(false);
    expect(wrapper.find('textarea').prop('value')).toBe('@notExist');
  });

  describe('accessibility', () => {
    it('hover', () => {
      const wrapper = createMentions();
      simulateInput(wrapper, '@');
      wrapper
        .find('li.rc-mentions-dropdown-menu-item')
        .last()
        .simulate('mouseEnter');
      expect(wrapper.find('Menu').props().activeKey).toBe('cat');
    });
  });
});
