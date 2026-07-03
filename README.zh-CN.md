<div align="center">
  <h1>@rc-component/mentions</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>💬 React 提及输入组件，支持建议列表、自定义过滤和多前缀触发。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/mentions"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/mentions.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/mentions"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/mentions.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/mentions/actions/workflows/react-component-ci.yml"><img alt="build status" src="https://github.com/react-component/mentions/actions/workflows/react-component-ci.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/mentions"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/mentions/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/mentions"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/mentions?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 特性

- 文本区域提及基于前缀的搜索和选择。
- 支持建议菜单的键盘导航。
- 支持数据驱动的 `options` API 和 `Option` 子节点 API。
- 多个前缀、自定义过滤、自定义验证和拆分令牌支持。
- Built on `@rc-component/input`, `@rc-component/menu`, and `@rc-component/trigger`.

## 安装

```bash
npm install @rc-component/mentions
```

> 该包发布为 `@rc-component/mentions`。旧的 `rc-mentions` 引用应迁移到带 scope 的包名。

## 使用

```tsx | pure
import Mentions from '@rc-component/mentions';

const options = [
  { value: 'light', label: 'Light' },
  { value: 'bamboo', label: 'Bamboo' },
  { value: 'cat', label: 'Cat' },
];

export default () => (
  <Mentions options={options} placeholder="Use @ to mention someone" />
);
```

```tsx | pure
import Mentions from '@rc-component/mentions';

const { Option } = Mentions;

export default () => (
  <Mentions prefix={['@', '#']}>
    <Option value="design">Design</Option>
    <Option value="docs">Docs</Option>
  </Mentions>
);
```

从 `assets/index.less` 引入样式，或使用 `npm run compile` 生成的编译后 CSS。

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Mentions

| 参数              | 类型                                                       | 默认值        | 说明                           |
| ----------------- | ---------------------------------------------------------- | ------------- | ------------------------------ |
| allowClear        | `boolean \| { clearIcon?: ReactNode }`                     | `false`       | 显示文本区域值的清除按钮。     |
| autoFocus         | `boolean`                                                  | `false`       | 安装后聚焦文本区域。           |
| autoSize          | `boolean \| { minRows?: number; maxRows?: number }`        | -             | 自动调整文本区域高度。         |
| children          | `ReactNode`                                                | -             | `Mentions.Option` 子元素。     |
| className         | `string`                                                   | -             | 根元素的 className。           |
| classNames        | `MentionsProps['classNames']`                              | -             | 插槽的语义 className。         |
| defaultValue      | `string`                                                   | -             | 初始值。                       |
| direction         | `'ltr' \| 'rtl'`                                           | `ltr`         | 弹层方向。                     |
| filterOption      | `false \| (input: string, option: OptionProps) => boolean` | -             | 自定义选项过滤。               |
| getPopupContainer | `() => HTMLElement`                                        | -             | 指定弹层窗口的容器。           |
| id                | `string`                                                   | -             | 文本域 id。                    |
| notFoundContent   | `ReactNode`                                                | `Not Found`   | 没有选项匹配时显示的内容。     |
| options           | `DataDrivenOptionProps[]`                                  | -             | 数据驱动的选项。               |
| placement         | `'top' \| 'bottom'`                                        | `bottom`      | 弹层窗口位置。                 |
| popupClassName    | `string`                                                   | -             | 弹层窗口的 className。         |
| prefix            | `string \| string[]`                                       | `@`           | 触发前缀或前缀。               |
| prefixCls         | `string`                                                   | `rc-mentions` | className 前缀。               |
| rows              | `number`                                                   | `1`           | 文本域行数。                   |
| silent            | `boolean`                                                  | `false`       | 忽略过渡阶段的 Enter 行为。    |
| split             | `string`                                                   | `' '`         | 在选定的提及之后插入的字符串。 |
| style             | `React.CSSProperties`                                      | -             | 根元素的内联样式。             |
| styles            | `MentionsProps['styles']`                                  | -             | 插槽的语义化样式。             |
| transitionName    | `string`                                                   | -             | 弹层过渡名称。                 |
| validateSearch    | `(text: string, split: MentionsProps['split']) => boolean` | -             | 自定义触发搜索逻辑。           |
| value             | `string`                                                   | -             | 受控值。                       |
| onBlur            | `React.FocusEventHandler<HTMLTextAreaElement>`             | -             | 当文本区域失去焦点时触发。     |
| onChange          | `(text: string) => void`                                   | -             | 当值改变时触发。               |
| onFocus           | `React.FocusEventHandler<HTMLTextAreaElement>`             | -             | 当文本区域获得焦点时触发。     |
| onKeyDown         | `React.KeyboardEventHandler<HTMLTextAreaElement>`          | -             | 按键按下时触发。               |
| onKeyUp           | `React.KeyboardEventHandler<HTMLTextAreaElement>`          | -             | 按键释放时触发。               |
| onPopupScroll     | `(event: React.UIEvent<HTMLDivElement>) => void`           | -             | 当弹层窗口滚动时触发。         |
| onPressEnter      | `React.KeyboardEventHandler<HTMLTextAreaElement>`          | -             | 当按下 Enter 时触发。          |
| onResize          | `(size: { width: number; height: number }) => void`        | -             | 当文本区域大小改变时触发。     |
| onSearch          | `(text: string, prefix: string) => void`                   | -             | 当前缀开始搜索时触发。         |
| onSelect          | `(option: OptionProps, prefix: string) => void`            | -             | 选择选项时触发。               |

### Option

| 参数      | 类型                  | 默认值  | 说明                   |
| --------- | --------------------- | ------- | ---------------------- |
| children  | `ReactNode`           | -       | 选项标签。             |
| className | `string`              | -       | 选项的 className。     |
| disabled  | `boolean`             | `false` | 禁用该选项。           |
| key       | `string`              | -       | React键和选项键。      |
| style     | `React.CSSProperties` | -       | 内联选项样式。         |
| value     | `string`              | -       | 提及插入文本区域的值。 |

### Ref

```tsx | pure
import Mentions, { type MentionsRef } from '@rc-component/mentions';

const ref = React.useRef<MentionsRef>(null);

ref.current?.focus();
ref.current?.blur();
```

| 参数          | 类型                          | 说明                   |
| ------------- | ----------------------------- | ---------------------- |
| focus         | `() => void`                  | 聚焦文本区域。         |
| blur          | `() => void`                  | 模糊文本区域。         |
| textarea      | `HTMLTextAreaElement \| null` | 已弃用的文本区域参考。 |
| nativeElement | `HTMLElement`                 | 根原生元素。           |

## 本地开发

```bash
npm install
npm start
npm test
npm run tsc
npm run compile
npm run build
```

dumi 站点默认运行在 `http://localhost:8000`。

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## 许可证

@rc-component/mentions 基于 [MIT](./LICENSE) 许可证发布。
