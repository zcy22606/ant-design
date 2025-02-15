import type { CSSInterpolation, Theme } from '@ant-design/cssinjs/es';
import { createTheme, useCacheToken, useStyleRegister } from '@ant-design/cssinjs/es';
import React from 'react';
import version from '../version';
import type {
  AliasToken,
  GlobalToken,
  MapToken,
  OverrideToken,
  PresetColorType,
  SeedToken,
} from './interface';
import { PresetColors } from './interface';
import defaultDerivative from './themes/default';
import defaultSeedToken from './themes/seed';
import formatToken from './util/alias';
import type { FullToken } from './util/genComponentStyleHook';
import genComponentStyleHook from './util/genComponentStyleHook';
import statisticToken, { merge as mergeToken, statistic } from './util/statistic';

const defaultTheme = createTheme(defaultDerivative);

export {
  // colors
  PresetColors,
  // Statistic
  statistic,
  statisticToken,
  mergeToken,
  // hooks
  useStyleRegister,
  genComponentStyleHook,
};
export type {
  SeedToken,
  AliasToken,
  PresetColorType,
  // FIXME: Remove this type
  AliasToken as DerivativeToken,
  FullToken,
};

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  /** 主题预设 */
  token: defaultSeedToken,
  /** 哈希 */
  hashed: true,
};

export const DesignTokenContext = React.createContext<{
  token: Partial<AliasToken>;
  theme?: Theme<SeedToken, MapToken>;
  components?: OverrideToken;
  hashed?: string | boolean;
}>(defaultConfig);

// ================================== Hook ==================================
export function useToken(): [Theme<SeedToken, MapToken>, GlobalToken, string] {
  const {
    /** 预设主题样式 */
    token: rootDesignToken,
    /** 哈希 */
    hashed,
    /** 无 */
    theme,
    /** 无 */
    components,
  } = React.useContext(DesignTokenContext);

  const salt = `${version}-${hashed || ''}`;

  /** 合并主题 */

  const mergedTheme = theme || defaultTheme;
  const [token, hashId] = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    [defaultSeedToken, rootDesignToken],
    {
      salt,
      override: { override: rootDesignToken, ...components },
      formatToken,
    },
  );

  return [mergedTheme, token, hashed ? hashId : ''];
}

export type UseComponentStyleResult = [(node: React.ReactNode) => React.ReactElement, string];

export type GenerateStyle<
  ComponentToken extends object = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType;
