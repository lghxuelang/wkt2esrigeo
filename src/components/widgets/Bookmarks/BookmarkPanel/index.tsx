import React from 'react';
import TitlePanel from '@/components/containers/titlePanel';
import styles from './index.less';
import Bookmarks, { withLocalStorage } from '..';
// 引入公共样式组件
// import StyledPanel from '@/components/containers/styledPanel';
const BookmarkPanel: React.FC<any> = ({ onClose }) => {
  const LocalStorageBookmark = withLocalStorage(Bookmarks);
  return (
    <TitlePanel title="书签管理" className={styles.wrap} onClose={onClose}>
      <div style={{ padding: 18, paddingTop: 0 }}>
        <LocalStorageBookmark
          listType="text"
          style={{
            backgroundColor: 'transparent',
            color: '#fff',
          }}
        />
      </div>
    </TitlePanel>
  );
};

export default BookmarkPanel;



// import React from 'react';
// import TitlePanel from '@/components/containers/titlePanel';
// import styles from './index.less';
// import Bookmarks, { withLocalStorage } from '..';
// // 引入公共样式组件
// import StyledPanel from '@/components/containers/styledPanel';

// const BookmarkPanel: React.FC<any> = ({ onClose }) => {
//   const LocalStorageBookmark = withLocalStorage(Bookmarks);
//   return (
//     <StyledPanel>
//       <div className="geomap-widget-daylight__daylight-content">
//         <p className="geomap-widget-daylight__daylight-title">
//           日光
//           <span
//             className="geomap-widget-daylight__daylight-closebtn"
//             onClick={(): void => onClose && onClose()}
//           >
//             ×
//           </span>
//         </p>
//       </div>
//       <div style={{ padding: 18, paddingTop: 0 }}>
//         <LocalStorageBookmark
//           listType="text"
//           style={{
//             backgroundColor: 'transparent',
//             color: '#fff',
//           }}
//         />
//       </div>
//     </StyledPanel>
//   );
// };

// export default BookmarkPanel;
