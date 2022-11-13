/* eslint no-console: 0 */

import React from 'react';
import Mentions from '../src';
import '../assets/index.less';
import './textarea.less';

const { Option } = Mentions;

export default () => (
  <div>
    <Mentions
      placeholder="disabled"
      disabled
      items={[
        {
          value: 'light',
          label: 'Light',
        },
        {
          value: 'bamboo',
          label: 'Bamboo',
        },
        {
          value: 'cat',
          label: 'Cat',
        },
      ]}
    />

    <Mentions
      placeholder="readonly"
      readOnly
      items={[
        {
          value: 'light',
          label: 'Light',
        },
        {
          value: 'bamboo',
          label: 'Bamboo',
        },
        {
          value: 'cat',
          label: 'Cat',
        },
      ]}
    />

    <div style={{ paddingTop: 100 }}>
      <Mentions
        placeholder="Support AutoSize"
        autoSize
        transitionName="motion-zoom"
        items={[
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'bamboo',
            label: 'Bamboo',
          },
          {
            value: 'cat',
            label: 'Cat',
          },
        ]}
      />
    </div>

    <div style={{ paddingTop: 100 }}>
      <Mentions
        placeholder="placement: top"
        placement="top"
        transitionName="motion-zoom"
        items={[
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'bamboo',
            label: 'Bamboo',
          },
          {
            value: 'cat',
            label: 'Cat',
          },
        ]}
      />
    </div>

    <div style={{ padding: '100px 0', width: 200, direction: 'rtl' }}>
      <Mentions
        placeholder="direction: rtl"
        direction="rtl"
        transitionName="motion-zoom"
        items={[
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'bamboo',
            label: 'Bamboo',
          },
          {
            value: 'cat',
            label: 'Cat',
          },
        ]}
      />
    </div>
  </div>
);
