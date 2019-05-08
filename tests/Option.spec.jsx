import { mount } from 'enzyme';
import React from 'react';
import Mentions from '../src';

const { Option } = Mentions;

describe('Option', () => {
  // Option is a placeholder component. It should render nothing.
  it('should be empty', () => {
    const wrapper = mount(<Option>Nothing</Option>);
    expect(wrapper.instance()).toBe(null);
  });
});
