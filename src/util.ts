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
  selectionEnd: number;
  prefix: string;
  targetText: string;
}

export function replaceWithMeasure(text: string, measureConfig: MeasureConfig) {
  const { measureLocation, selectionEnd, prefix, targetText } = measureConfig;
  const beforeMeasureText = text.slice(0, measureLocation);
  const connectedStartText = `${beforeMeasureText} ${prefix}${targetText} `;
  const endText = text.slice(selectionEnd);

  return {
    text: `${connectedStartText}${endText}`,
    selectionLocation: connectedStartText.length,
  };
}
