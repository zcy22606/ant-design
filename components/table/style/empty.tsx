import type { CSSObject } from '@ant-design/cssinjs/es';
import type { GenerateStyle } from '../../theme/internal';
import type { TableToken } from './index';

// ========================= Placeholder ==========================
const genEmptyStyle: GenerateStyle<TableToken, CSSObject> = (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-tbody > tr${componentCls}-placeholder`]: {
        textAlign: 'center',
        color: token.colorTextDisabled,

        '&:hover > td': {
          background: token.colorBgContainer,
        },
      },
    },
  };
};

export default genEmptyStyle;
