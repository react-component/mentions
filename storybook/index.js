/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import BasicSource from 'rc-source-loader!../examples/basic';
import Basic from '../examples/basic';
import READMECode from '../README.md';

storiesOf('rc-mentions', module)
  .addDecorator(checkA11y)
  .addDecorator(withInfo)
  .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  .addDecorator(withViewport())
  .add(
    'readMe',
    () => (
      <div
        className="markdown-body entry-content"
        style={{
          padding: 24,
        }}
      >
        <Markdown escapeHtml={false} source={READMECode} />
      </div>
    ),
    {
      source: {
        code: READMECode,
      },
    },
  )
  .add('basic', () => <Basic />, {
    source: {
      code: BasicSource,
    },
  });
