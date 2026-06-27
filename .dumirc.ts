// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const name = 'mentions';
const isProdSite = process.env.GH_PAGES === '1';

const basePath = isProdSite ? `/${name}/` : '/';
const publicPath = isProdSite ? `/${name}/` : '/';

export default defineConfig({
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: '@rc-component/mentions',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
  outputPath: 'docs-dist',
  exportStatic: {},
  base: basePath,
  publicPath,
  styles: [
    `
      .markdown table {
        width: auto !important;
      }
    `,
  ],
  mfsu: {},
});
