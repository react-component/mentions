import { clsx } from 'clsx';
import { BaseInput } from '@rc-component/input';
import type { HolderRef } from '@rc-component/input/lib/BaseInput';
import type { CommonInputProps } from '@rc-component/input/lib/interface';
import type { TextAreaProps, TextAreaRef } from '@rc-component/textarea';
import TextArea from '@rc-component/textarea';
import toArray from '@rc-component/util/lib/Children/toArray';
import useControlledState from '@rc-component/util/lib/hooks/useControlledState';
import KeyCode from '@rc-component/util/lib/KeyCode';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import useEffectState from './hooks/useEffectState';
import KeywordTrigger from './KeywordTrigger';
import MentionsContext from './MentionsContext';
import type { OptionProps } from './Option';
import Option from './Option';
import {
  filterOption as defaultFilterOption,
  validateSearch as defaultValidateSearch,
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';
import { UnstableContext } from './context';

type BaseTextareaAttrs = Omit<
  TextAreaProps,
  'prefix' | 'onChange' | 'onSelect' | 'showCount' | 'classNames'
>;

export type Placement = 'top' | 'bottom';
export type Direction = 'ltr' | 'rtl';

export interface DataDrivenOptionProps extends Omit<OptionProps, 'children'> {
  label?: React.ReactNode;
}

export interface MentionsProps extends BaseTextareaAttrs {
  autoFocus?: boolean;
  className?: string;
  defaultValue?: string;
  notFoundContent?: React.ReactNode;
  split?: string;
  style?: React.CSSProperties;
  transitionName?: string;
  placement?: Placement;
  direction?: Direction;
  prefix?: string | string[];
  prefixCls?: string;
  value?: string;
  silent?: boolean;
  filterOption?: false | typeof defaultFilterOption;
  validateSearch?: typeof defaultValidateSearch;
  onChange?: (text: string) => void;
  onSelect?: (option: OptionProps, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  getPopupContainer?: () => HTMLElement;
  popupClassName?: string;
  children?: React.ReactNode;
  options?: DataDrivenOptionProps[];
  classNames?: CommonInputProps['classNames'] & {
    mentions?: string;
    textarea?: string;
    popup?: string;
  };
  styles?: {
    textarea?: React.CSSProperties;
    popup?: React.CSSProperties;
  };
  onPopupScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export interface MentionsRef {
  focus: VoidFunction;
  blur: VoidFunction;

  /** @deprecated It may not work as expected */
  textarea: HTMLTextAreaElement | null;

  nativeElement: HTMLElement;
}

const InternalMentions = forwardRef<MentionsRef, MentionsProps>(
  (props, ref) => {
    const {
      // Style
      prefixCls,
      className,
      style,
      classNames: mentionClassNames,
      styles,

      // Misc
      prefix = '@',
      split = ' ',
      notFoundContent = 'Not Found',
      value,
      defaultValue,
      children,
      options,
      allowClear,
      silent,

      // Events
      validateSearch = defaultValidateSearch,
      filterOption = defaultFilterOption,
      onChange,
      onKeyDown,
      onKeyUp,
      onPressEnter,
      onSearch,
      onSelect,

      onFocus,
      onBlur,

      // Dropdown
      transitionName,
      placement,
      direction,
      getPopupContainer,
      popupClassName,

      rows = 1,

      // Fix Warning: Received `false` for a non-boolean attribute `visible`.
      // https://github.com/ant-design/ant-design/blob/df933e94efc8f376003bbdc658d64b64a0e53495/components/mentions/demo/render-panel.tsx
      // @ts-expect-error
      visible,
      onPopupScroll,

      // Rest
      ...restProps
    } = props;

    const mergedPrefix = useMemo(
      () => (Array.isArray(prefix) ? prefix : [prefix]),
      [prefix],
    );

    // =============================== Refs ===============================
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<TextAreaRef>(null);
    const measureRef = useRef<HTMLDivElement>(null);

    const getTextArea = () => textareaRef.current?.resizableTextArea?.textArea;

    React.useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      textarea: textareaRef.current?.resizableTextArea?.textArea,
      nativeElement: containerRef.current,
    }));

    // ============================== State ===============================
    const [measuring, setMeasuring] = useState(false);
    const [measureText, setMeasureText] = useState('');
    const [measurePrefix, setMeasurePrefix] = useState('');
    const [measureLocation, setMeasureLocation] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFocus, setIsFocus] = useState(false);

    // ============================== Value ===============================
    const [mergedValue, setMergedValue] = useControlledState(
      defaultValue || '',
      value,
    );

    // =============================== Open ===============================
    const { open } = useContext(UnstableContext);

    useEffect(() => {
      // Sync measure div top with textarea for rc-trigger usage
      if (measuring && measureRef.current) {
        measureRef.current.scrollTop = getTextArea().scrollTop;
      }
    }, [measuring]);

    const [
      mergedMeasuring,
      mergedMeasureText,
      mergedMeasurePrefix,
      mergedMeasureLocation,
    ] = React.useMemo<
      [
        typeof measuring,
        typeof measureText,
        typeof measurePrefix,
        typeof measureLocation,
      ]
    >(() => {
      if (open) {
        for (let i = 0; i < mergedPrefix.length; i += 1) {
          const curPrefix = mergedPrefix[i];
          const index = mergedValue.lastIndexOf(curPrefix);
          if (index >= 0) {
            return [true, '', curPrefix, index];
          }
        }
      }

      return [measuring, measureText, measurePrefix, measureLocation];
    }, [
      open,
      measuring,
      mergedPrefix,
      mergedValue,
      measureText,
      measurePrefix,
      measureLocation,
    ]);

    // ============================== Option ==============================
    const getOptions = React.useCallback(
      (targetMeasureText: string) => {
        let list;
        if (options && options.length > 0) {
          list = options.map(item => ({
            ...item,
            key: item?.key ?? item.value,
          }));
        } else {
          list = toArray(children).map(
            ({
              props: optionProps,
              key,
            }: {
              props: OptionProps;
              key: React.Key;
            }) => ({
              ...optionProps,
              label: optionProps.children,
              key: (key || optionProps.value) as string,
            }),
          );
        }

        return list.filter((option: OptionProps) => {
          /** Return all result if `filterOption` is false. */
          if (filterOption === false) {
            return true;
          }
          return filterOption(targetMeasureText, option);
        });
      },
      [children, options, filterOption],
    );

    const mergedOptions = React.useMemo(
      () => getOptions(mergedMeasureText),
      [getOptions, mergedMeasureText],
    );

    // ============================= Measure ==============================
    // Mark that we will reset input selection to target position when user select option
    const onSelectionEffect = useEffectState();

    const startMeasure = (
      nextMeasureText: string,
      nextMeasurePrefix: string,
      nextMeasureLocation: number,
    ) => {
      setMeasuring(true);
      setMeasureText(nextMeasureText);
      setMeasurePrefix(nextMeasurePrefix);
      setMeasureLocation(nextMeasureLocation);
      setActiveIndex(0);
    };

    const stopMeasure = (callback?: VoidFunction) => {
      setMeasuring(false);
      setMeasureLocation(0);
      setMeasureText('');
      onSelectionEffect(callback);
    };

    // ============================== Change ==============================
    const triggerChange = (nextValue: string) => {
      setMergedValue(nextValue);
      onChange?.(nextValue);
    };

    const onInternalChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({
      target: { value: nextValue },
    }) => {
      triggerChange(nextValue);
    };

    const selectOption = (option: OptionProps) => {
      const { value: mentionValue = '' } = option;
      const { text, selectionLocation } = replaceWithMeasure(mergedValue, {
        measureLocation: mergedMeasureLocation,
        targetText: mentionValue,
        prefix: mergedMeasurePrefix,
        selectionStart: getTextArea()?.selectionStart,
        split,
      });
      triggerChange(text);
      stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(getTextArea(), selectionLocation);
      });

      onSelect?.(option, mergedMeasurePrefix);
    };

    // ============================= KeyEvent =============================
    // Check if hit the measure keyword
    const onInternalKeyDown: React.KeyboardEventHandler<
      HTMLTextAreaElement
    > = event => {
      const { which } = event;

      onKeyDown?.(event);

      // Skip if not measuring
      if (!mergedMeasuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        const optionLen = mergedOptions.length;
        const offset = which === KeyCode.UP ? -1 : 1;
        const newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
        setActiveIndex(newActiveIndex);
        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        stopMeasure();
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        event.preventDefault();
        // loading skip
        if (silent) {
          return;
        }

        if (!mergedOptions.length) {
          stopMeasure();
          return;
        }
        const option = mergedOptions[activeIndex];
        selectOption(option);
      }
    };

    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */
    const onInternalKeyUp: React.KeyboardEventHandler<
      HTMLTextAreaElement
    > = event => {
      const { key, which } = event;
      const target = event.target as HTMLTextAreaElement;
      const selectionStartText = getBeforeSelectionText(target);
      const { location: measureIndex, prefix: nextMeasurePrefix } =
        getLastMeasureIndex(selectionStartText, mergedPrefix);

      // If the client implements an onKeyUp handler, call it
      onKeyUp?.(event);

      // Skip if match the white key list
      if (
        [KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(
          which,
        ) !== -1
      ) {
        return;
      }

      if (measureIndex !== -1) {
        const nextMeasureText = selectionStartText.slice(
          measureIndex + nextMeasurePrefix.length,
        );
        const validateMeasure: boolean = validateSearch(nextMeasureText, split);
        const matchOption = !!getOptions(nextMeasureText).length;

        if (validateMeasure) {
          // adding AltGraph also fort azert keyboard
          if (
            key === nextMeasurePrefix ||
            key === 'Shift' ||
            which === KeyCode.ALT ||
            key === 'AltGraph' ||
            mergedMeasuring ||
            (nextMeasureText !== mergedMeasureText && matchOption)
          ) {
            startMeasure(nextMeasureText, nextMeasurePrefix, measureIndex);
          }
        } else if (mergedMeasuring) {
          // Stop if measureText is invalidate
          stopMeasure();
        }

        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */
        if (onSearch && validateMeasure) {
          onSearch(nextMeasureText, nextMeasurePrefix);
        }
      } else if (mergedMeasuring) {
        stopMeasure();
      }
    };

    const onInternalPressEnter: React.KeyboardEventHandler<
      HTMLTextAreaElement
    > = event => {
      if (!mergedMeasuring && onPressEnter) {
        onPressEnter(event);
      }
    };

    // ============================ Focus Blur ============================
    const focusRef = useRef<number>();

    const onInternalFocus = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
      window.clearTimeout(focusRef.current);
      if (!isFocus && event && onFocus) {
        onFocus(event);
      }
      setIsFocus(true);
    };

    const onInternalBlur = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
      focusRef.current = window.setTimeout(() => {
        setIsFocus(false);
        stopMeasure();
        onBlur?.(event);
      }, 0);
    };

    const onDropdownFocus = () => {
      onInternalFocus();
    };

    const onDropdownBlur = () => {
      onInternalBlur();
    };

    // ============================== Scroll ===============================
    const onInternalPopupScroll: React.UIEventHandler<
      HTMLDivElement
    > = event => {
      onPopupScroll?.(event);
    };

    // ============================== Render ==============================

    return (
      <div
        className={clsx(prefixCls, className)}
        style={style}
        ref={containerRef}
      >
        <TextArea
          classNames={{ textarea: mentionClassNames?.textarea }}
          /**
           * Example:<Mentions style={{ resize: 'none' }} />.
           * If written this way, resizing here will become invalid.
           * The TextArea component code and found that the resize parameter in the style of the ResizeTextArea component is obtained from prop.style.
           * Just pass the resize attribute and leave everything else unchanged.
           */
          style={{ resize: style?.resize }}
          styles={{ textarea: styles?.textarea }}
          ref={textareaRef}
          value={mergedValue}
          {...restProps}
          rows={rows}
          onChange={onInternalChange}
          onKeyDown={onInternalKeyDown}
          onKeyUp={onInternalKeyUp}
          onPressEnter={onInternalPressEnter}
          onFocus={onInternalFocus}
          onBlur={onInternalBlur}
        />
        {mergedMeasuring && (
          <div ref={measureRef} className={`${prefixCls}-measure`}>
            {mergedValue.slice(0, mergedMeasureLocation)}
            <MentionsContext.Provider
              value={{
                notFoundContent,
                activeIndex,
                setActiveIndex,
                selectOption,
                onFocus: onDropdownFocus,
                onBlur: onDropdownBlur,
                onScroll: onInternalPopupScroll,
              }}
            >
              <KeywordTrigger
                prefixCls={prefixCls}
                transitionName={transitionName}
                placement={placement}
                direction={direction}
                options={mergedOptions}
                visible
                getPopupContainer={getPopupContainer}
                popupClassName={clsx(popupClassName, mentionClassNames?.popup)}
                popupStyle={styles?.popup}
              >
                <span>{mergedMeasurePrefix}</span>
              </KeywordTrigger>
            </MentionsContext.Provider>
            {mergedValue.slice(
              mergedMeasureLocation + mergedMeasurePrefix.length,
            )}
          </div>
        )}
      </div>
    );
  },
);

const Mentions = forwardRef<MentionsRef, MentionsProps>(
  (
    {
      suffix,
      prefixCls = 'rc-mentions',
      defaultValue,
      value: customValue,
      allowClear,
      onChange,
      classNames: mentionsClassNames,
      styles,
      className,
      disabled,
      onClear,
      ...rest
    },
    ref,
  ) => {
    // =============================== Ref ================================
    const holderRef = useRef<HolderRef>(null);
    const mentionRef = useRef<MentionsRef>(null);

    useImperativeHandle(ref, () => ({
      ...mentionRef.current,
      nativeElement:
        holderRef.current?.nativeElement || mentionRef.current?.nativeElement,
    }));

    // ============================== Value ===============================
    const [mergedValue, setMergedValue] = useControlledState(
      defaultValue || '',
      customValue,
    );

    // ============================== Change ==============================
    const triggerChange = (currentValue: string) => {
      setMergedValue(currentValue);
      onChange?.(currentValue);
    };

    // ============================== Reset ===============================
    const handleReset = () => {
      triggerChange('');
    };

    return (
      <BaseInput
        suffix={suffix}
        prefixCls={prefixCls}
        value={mergedValue}
        allowClear={allowClear}
        handleReset={handleReset}
        className={className}
        classNames={mentionsClassNames}
        disabled={disabled}
        ref={holderRef}
        onClear={onClear}
      >
        <InternalMentions
          className={mentionsClassNames?.mentions}
          styles={styles}
          classNames={mentionsClassNames}
          prefixCls={prefixCls}
          ref={mentionRef}
          onChange={triggerChange}
          disabled={disabled}
          {...rest}
        />
      </BaseInput>
    );
  },
) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MentionsProps> & React.RefAttributes<MentionsRef>
> & {
  Option: typeof Option;
};

Mentions.Option = Option;

export default Mentions;
