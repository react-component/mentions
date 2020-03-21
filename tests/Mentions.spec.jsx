import { mount } from 'enzyme';
import React from 'react';
import Mentions from '../src';
import { simulateInput } from './shared/input';
import calculateNodeHeight, { calculateNodeStyling } from '../src/calculateNodeHeight';

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

      wrapper.find('MenuItem').simulate('focus');
      wrapper.find('textarea').simulate('blur');
      wrapper.find('MenuItem').simulate('click');
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
      expect(document.activeElement).not.toBe(wrapper.find('textarea').instance());
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
    expect(wrapper.find('MenuItem').props().children).toBe(notFoundContent);
  });

  describe('accessibility', () => {
    it('hover', () => {
      const wrapper = createMentions();
      simulateInput(wrapper, '@');
      wrapper
        .find('MenuItem')
        .last()
        .simulate('mouseEnter');
      expect(wrapper.find('Menu').props().activeKey).toBe('cat');
    });
  });

  describe('autoSize', () => {
    const originalGetComputedStyle = window.getComputedStyle;
    beforeEach(() => {
      Object.defineProperty(window, 'getComputedStyle', {
        value: node => ({
          getPropertyValue: prop => {
            if (prop === 'box-sizing') {
              return originalGetComputedStyle(node)[prop] || 'border-box';
            }
            return originalGetComputedStyle(node)[prop];
          },
        }),
      });
      jest.useFakeTimers();
    });

    afterEach(() => {
      Object.defineProperty(window, 'getComputedStyle', {
        value: originalGetComputedStyle,
      });
      jest.useRealTimers();
    });

    it('should auto calculate height according to content length', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(
        <Mentions defaultValue="" readOnly autoSize={{ minRows: 2, maxRows: 6 }} wrap="off" />,
      );
      const mockFunc = jest.spyOn(wrapper.instance(), 'resizeTextarea');
      wrapper.setState({ value: '1111\n2222\n3333' });
      jest.runAllTimers();
      expect(mockFunc).toHaveBeenCalledTimes(1);
      wrapper.setState({ value: '1111' });
      jest.runAllTimers();
      expect(mockFunc).toHaveBeenCalledTimes(2);
      wrapper.update();
      expect(wrapper.find('textarea').props().style.overflow).toBeFalsy();

      expect(errorSpy).not.toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('calculateNodeStyling works correctly', () => {
      const wrapper = document.createElement('textarea');
      wrapper.id = 'test';
      wrapper.wrap = 'wrap';
      calculateNodeStyling(wrapper, true);
      const value = calculateNodeStyling(wrapper, true);
      expect(value).toEqual({
        borderSize: 2,
        boxSizing: 'border-box',
        paddingSize: 4,
        sizingStyle:
          'letter-spacing:normal;line-height:normal;padding-top:2px;padding-bottom:2px;font-family:-webkit-small-control;font-weight:;font-size:;font-variant:;text-rendering:auto;text-transform:none;width:;text-indent:0;padding-left:2px;padding-right:2px;border-width:1px;box-sizing:border-box',
      });
    });

    it('boxSizing === "border-box"', () => {
      const wrapper = document.createElement('textarea');
      wrapper.style.boxSizing = 'border-box';
      const { height } = calculateNodeHeight(wrapper);
      expect(height).toBe(2);
    });

    it('boxSizing === "content-box"', () => {
      const wrapper = document.createElement('textarea');
      wrapper.style.boxSizing = 'content-box';
      const { height } = calculateNodeHeight(wrapper);
      expect(height).toBe(-4);
    });

    it('minRows or maxRows is not null', () => {
      const wrapper = document.createElement('textarea');
      expect(calculateNodeHeight(wrapper, 1, 1)).toEqual({
        height: 2,
        maxHeight: 9007199254740991,
        minHeight: 2,
        overflowY: undefined,
      });
      wrapper.style.boxSizing = 'content-box';
      expect(calculateNodeHeight(wrapper, 1, 1)).toEqual({
        height: -4,
        maxHeight: 9007199254740991,
        minHeight: -4,
        overflowY: undefined,
      });
    });

    it('should trigger onResize', done => {
      const onResize = jest.fn();
      const wrapper = mount(<Mentions onResize={onResize} autoSize />);
      jest.useRealTimers();
      setTimeout(() => {
        wrapper
          .find('ResizeObserver')
          .instance()
          .onResize([
            {
              target: {
                getBoundingClientRect() {
                  return {};
                },
              },
            },
          ]);
        expect(onResize).toHaveBeenCalledWith(
          expect.objectContaining({
            width: expect.any(Number),
            height: expect.any(Number),
          }),
        );
        done();
      }, 500);
    });
  });
});
