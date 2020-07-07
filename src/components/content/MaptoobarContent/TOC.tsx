import React, { FC } from 'react';
import { connect } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MaptoolbarModelState } from '@/models/maptoolbar';

import styles from './index.less';
import LayerCatalog from '@/components/widgets/LayerCatalog';
import { TOCModelState } from '@/models/toc';
import SymbolEditor from '@/components/widgets/SymbolEditor';
import TitlePanel from '@/components/containers/titlePanel';

interface ConnectedProps extends ConnectProps {
  maptoolbar: MaptoolbarModelState;
  toc: TOCModelState;
}

export interface TOCPropTypes {}

/**
 * 由于LayerCatalog中的对象为了保持唯一性，只能加载一次
 * 因此，这里用TOC面板显示/隐藏的方式来让该组件一直在地图上
 * @param maptoolbar
 * @constructor
 */
const TOC: FC<TOCPropTypes & ConnectedProps> = ({ dispatch, maptoolbar, toc }) => {
  function renderTOCContent() {
    switch (toc.content) {
      case 'smart-mapping': {
        return <SymbolEditor />;
      }
      default:
        break;
    }
    return null;
  }

  return (
    <div
      className={styles.toc}
      style={{
        display: maptoolbar.activeToolbar === 'catalog' ? 'unset' : 'none',
      }}
    >
      <TitlePanel
        title="数据资源目录"
        onClose={() => {
          dispatch &&
            dispatch({
              type: 'maptoolbar/updataActiveToolbar',
              payload: '',
            });
        }}
      >
        <>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <LayerCatalog
              style={{
                display: toc.content ? 'none' : 'unset',
              }}
            />
          </div>
          {renderTOCContent()}
        </>
      </TitlePanel>
    </div>
  );
};

export default connect(({ maptoolbar, toc }: ConnectState) => {
  return { maptoolbar, toc };
})(TOC);
