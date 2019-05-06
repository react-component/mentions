/**
 * Cut input selection into 2 part and return text before selection start
 */
export function getBeforeSelectionText(input: HTMLTextAreaElement) {
  const { selectionStart } = input as any;
  return input.value.slice(0, selectionStart);
}

/**
 * Find the last match prefix index
 */
export function getLastMeasureIndex(text: string, prefix: string = ''): number {
  return text.lastIndexOf(prefix);
}

interface MeasureConfig {
  measureLocation: number;
  prefix: string;
  targetText: string;
}

function lower(char: string | undefined): string {
  return (char || '').toLowerCase();
}

/**
 * Paint targetText into current text:
 *  text: little@litest
 *  targetText: light
 *  => little @light test
 */
export function replaceWithMeasure(text: string, measureConfig: MeasureConfig) {
  const { measureLocation, prefix, targetText } = measureConfig;

  // Before text will append one space if have other text
  let beforeMeasureText = text.slice(0, measureLocation).replace(/ $/, '');
  if (beforeMeasureText) {
    beforeMeasureText = `${beforeMeasureText} `;
  }
  let restText = text.slice(measureLocation + prefix.length);

  // Reuse rest text as it can
  const targetTextLen = targetText.length;
  for (let i = 0; i < targetTextLen; i += 1) {
    if (lower(restText[i]) !== lower(targetText[i])) {
      restText = restText.slice(i);
      break;
    } else if (i === targetTextLen - 1) {
      restText = restText.slice(targetTextLen);
    }
  }

  const connectedStartText = `${beforeMeasureText}${prefix}${targetText} `;

  return {
    text: `${connectedStartText}${restText.replace(/^ /, '')}`,
    selectionLocation: connectedStartText.length,
  };
}

export function setInputSelection(input: HTMLTextAreaElement, location: number) {
  input.setSelectionRange(location, location);

  /**
   * Reset caret into view.
   * Since this function always called by user control, it's safe to focus element.
   */
  input.blur();
  input.focus();
}
