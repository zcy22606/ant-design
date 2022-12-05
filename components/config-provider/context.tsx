import * as React from 'react';
import type { DerivativeFunc } from '@ant-design/cssinjs/es';
import type { RequiredMark } from '../form/Form';
import type { Locale } from '../locale-provider';
import type { AliasToken, MapToken, OverrideToken, SeedToken } from '../theme/interface';
import type { RenderEmptyHandler } from './defaultRenderEmpty';
import type { SizeType } from './SizeContext';

export const defaultIconPrefixCls = 'anticon';

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
}

export interface CSPConfig {
  nonce?: string;
}

export type DirectionType = 'ltr' | 'rtl' | undefined;

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;

export interface ThemeConfig {
  token?: Partial<AliasToken>;
  components?: OverrideToken;
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  hashed?: boolean;
  inherit?: boolean;
}

export interface ConfigConsumerProps {
  getTargetContainer?: () => HTMLElement;
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
  rootPrefixCls?: string;
  /** icon前缀，默认为anticon */
  iconPrefixCls: string;
  /** 获取类名前缀，默认是antd-xxx，如果有自定义前缀就用自定义，如果第一个参数没传，默认返回antd */
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
  renderEmpty?: RenderEmptyHandler;
  csp?: CSPConfig;
  autoInsertSpaceInButton?: boolean;
  input?: {
    autoComplete?: string;
  };
  pagination?: {
    showSizeChanger?: boolean;
  };
  locale?: Locale;
  pageHeader?: {
    ghost: boolean;
  };
  direction?: DirectionType;
  space?: {
    size?: SizeType | number;
  };
  virtual?: boolean;
  dropdownMatchSelectWidth?: boolean;
  form?: {
    requiredMark?: RequiredMark;
    colon?: boolean;
  };
  theme?: ThemeConfig;
}

/** 获取类名前缀，默认是antd-xxx，如果有自定义前缀就用自定义，如果第一个参数没传，默认返回antd */
const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;

  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
export const ConfigContext = React.createContext<ConfigConsumerProps>({
  /** 获取类名前缀，默认是antd-xxx，如果有自定义前缀就用自定义，如果第一个参数没传，默认返回antd */
  getPrefixCls: defaultGetPrefixCls,
  /** icon前缀，默认为anticon */
  iconPrefixCls: defaultIconPrefixCls,
});

export const ConfigConsumer = ConfigContext.Consumer;

// =========================== withConfigConsumer ===========================
interface BasicExportProps {
  prefixCls?: string;
}

interface ConsumerConfig {
  prefixCls: string;
}

interface ConstructorProps {
  displayName?: string;
}

/** @deprecated Use hooks instead. This is a legacy function */
export function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig) {
  return function withConfigConsumerFunc<ComponentDef>(
    Component: React.ComponentType<ExportProps>,
  ): React.FC<ExportProps> & ComponentDef {
    // Wrap with ConfigConsumer. Since we need compatible with react 15, be careful when using ref methods
    const SFC = ((props: ExportProps) => (
      <ConfigConsumer>
        {(configProps: ConfigConsumerProps) => {
          const { prefixCls: basicPrefixCls } = config;
          const { getPrefixCls } = configProps;
          const { prefixCls: customizePrefixCls } = props;
          const prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
          return <Component {...configProps} {...props} prefixCls={prefixCls} />;
        }}
      </ConfigConsumer>
    )) as React.FC<ExportProps> & ComponentDef;

    const cons: ConstructorProps = Component.constructor as ConstructorProps;
    const name = (cons && cons.displayName) || Component.name || 'Component';

    if (process.env.NODE_ENV !== 'production') {
      SFC.displayName = `withConfigConsumer(${name})`;
    }
    return SFC;
  };
}
