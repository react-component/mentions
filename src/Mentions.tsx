import classNames from 'classnames';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import { useState, useRef } from 'react';
import TextArea from 'rc-textarea';
import type { TextAreaProps } from 'rc-textarea';
import KeywordTrigger from './KeywordTrigger';
import MentionsContext from './MentionsContext';
import Option from './Option';
import type { OptionProps } from './Option';
import {
  filterOption as defaultFilterOption,
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
  validateSearch as defaultValidateSearch,
} from './util';
import useEffectState from './hooks/useEffectState';

type BaseTextareaAttrs = Omit<
  TextAreaProps,
  'prefix' | 'onChange' | 'onSelect'
>;

export type Placement = 'top' | 'bottom';
export type Direction = 'ltr' | 'rtl';

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
  filterOption?: false | typeof defaultFilterOption;
  validateSearch?: typeof defaultValidateSearch;
  onChange?: (text: string) => void;
  onSelect?: (option: OptionProps, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  getPopupContainer?: () => HTMLElement;
  dropdownClassName?: string;
  /** @private Testing usage. Do not use in prod. It will not work as your expect. */
  open?: boolean;
  children?: React.ReactNode;
}

export interface MentionsRef {
  focus: VoidFunction;
  blur: VoidFunction;
}

const Mentions = React.forwardRef<MentionsRef, MentionsProps>((props, ref) => {
  const {
    // Style
    prefixCls,
    className,
    style,

    // Misc
    prefix,
    split,
    notFoundContent,
    value,
    defaultValue,
    children,

    open,

    // Events
    validateSearch,
    filterOption,
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
    dropdownClassName,

    // Rest
    ...restProps
  } = props;

  const mergedPrefix = Array.isArray(prefix) ? prefix : [prefix];
  const mergedProps = {
    ...props,
    prefix: mergedPrefix,
  };

  // =============================== Refs ===============================
  const textareaRef = useRef<TextArea>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
  }));

  // ============================== State ===============================
  const [measuring, setMeasuring] = useState(false);
  const [measureText, setMeasureText] = useState('');
  const [measurePrefix, setMeasurePrefix] = useState('');
  const [measureLocation, setMeasureLocation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  // ============================== Value ===============================
  const [mergedValue, setMergedValue] = useMergedState('', {
    defaultValue,
    value: value,
  });

  // =============================== Open ===============================
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
      if (process.env.NODE_ENV !== 'production') {
        warning(
          false,
          '`open` of Mentions is only used for debug usage. Do not use in you production.',
        );
      }

      for (let i = 0; i < mergedPrefix.length; i += 1) {
        const curPrefix = mergedPrefix[i];
        const index = mergedValue.indexOf(curPrefix);
        if (index >= 0) {
          // startMeasure('', curPrefix, index);
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
      const list = toArray(children)
        .map(
          ({
            props: optionProps,
            key,
          }: {
            props: OptionProps;
            key: React.Key;
          }) => ({
            ...optionProps,
            key: (key || optionProps.value) as string,
          }),
        )
        .filter((option: OptionProps) => {
          /** Return all result if `filterOption` is false. */
          if (filterOption === false) {
            return true;
          }
          return filterOption(targetMeasureText, option);
        });
      return list;
    },
    [children, filterOption],
  );

  const options = React.useMemo(
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
    const getTextArea = () => textareaRef.current?.resizableTextArea?.textArea;

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
      const optionLen = options.length;
      const offset = which === KeyCode.UP ? -1 : 1;
      const newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
      setActiveIndex(newActiveIndex);
      event.preventDefault();
    } else if (which === KeyCode.ESC) {
      stopMeasure();
    } else if (which === KeyCode.ENTER) {
      // Measure hit
      event.preventDefault();
      if (!options.length) {
        stopMeasure();
        return;
      }
      const option = options[activeIndex];
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
      [KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !==
      -1
    ) {
      return;
    }

    if (measureIndex !== -1) {
      const nextMeasureText = selectionStartText.slice(
        measureIndex + nextMeasurePrefix.length,
      );
      const validateMeasure: boolean = validateSearch(
        nextMeasureText,
        mergedProps,
      );
      const matchOption = !!getOptions(nextMeasureText).length;

      if (validateMeasure) {
        if (
          key === nextMeasurePrefix ||
          key === 'Shift' ||
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

  // ============================== Render ==============================
  return (
    <div className={classNames(prefixCls, className)} style={style}>
      <TextArea
        ref={textareaRef}
        value={mergedValue}
        {...restProps}
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
            }}
          >
            <KeywordTrigger
              prefixCls={prefixCls}
              transitionName={transitionName}
              placement={placement}
              direction={direction}
              options={options}
              visible
              getPopupContainer={getPopupContainer}
              dropdownClassName={dropdownClassName}
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
}) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<MentionsProps> & React.RefAttributes<MentionsRef>
> & {
  Option: typeof Option;
};

Mentions.defaultProps = {
  prefixCls: 'rc-mentions',
  prefix: '@',
  split: ' ',
  validateSearch: defaultValidateSearch,
  filterOption: defaultFilterOption,
  notFoundContent: 'Not Found',
  rows: 1,
};

Mentions.Option = Option;

export default Mentions;
