export function getMeasureText(fullText: string, measureStartLoc: number) {
  const restText = fullText.slice(measureStartLoc);
  return restText.split(' ')[0];
}