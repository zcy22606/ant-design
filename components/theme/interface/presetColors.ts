/** 颜色字符串 */
export const PresetColors = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'lime',
  'gold',
] as const;

/** 转成了颜色字符串联合类型 */
type PresetColorKey = typeof PresetColors[number];

/** key为颜色名，值为字符串 */
export type PresetColorType = Record<PresetColorKey, string>;

/** 颜色饱和度下标 */
type ColorPaletteKeyIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** key为颜色名-index，值为字符串 */
export type ColorPalettes = {
  [key in `${keyof PresetColorType}-${ColorPaletteKeyIndex}`]: string;
};
