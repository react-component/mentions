import React from 'react';
import Mentions from '@rc-component/mentions';
import '../../assets/index.less';
import './textarea.less';

export default () => (
  <div>
    <Mentions
      placeholder="disabled"
      disabled
      options={[
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
      options={[
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
        options={[
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
        options={[
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
        options={[
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
