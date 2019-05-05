interface MeasureConfig {
  measureLocation: number;
  prefix?: string;
}

export function getMeasureText(fullText: string, config: MeasureConfig) {
  const { measureLocation, prefix = '' } = config;
  const restText = fullText.slice(measureLocation + prefix.length);
  return restText.split(' ')[0];
}

interface ReplaceConfig extends MeasureConfig {
  targetText: string;
}

export function replaceText(fullText: string, config: ReplaceConfig): string {
  const { measureLocation, prefix = '', targetText } = config;
  const measureText = getMeasureText(fullText, config);
  const startText = fullText.slice(0, measureLocation);
  const endText = fullText.slice(measureLocation + prefix.length + measureText.length);
  return `${startText} ${prefix}${targetText} ${endText}`;
}