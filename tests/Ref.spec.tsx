import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import type { MentionsProps } from '../src';
import Mentions from '../src';
import type { MentionsRef } from '../src/Mentions';

const { Option } = Mentions;

describe('Mentions.Ref', () => {
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

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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

  it('should apply resize style to textarea', () => {
    const { container } = render(
      <Mentions style={{ resize: 'none' }}>
        <Option value="bamboo">Bamboo</Option>
        <Option value="light">Light</Option>
        <Option value="cat">Cat</Option>
      </Mentions>,
    );

    const textarea = container.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea?.style.resize).toBe('none');
  });
});
