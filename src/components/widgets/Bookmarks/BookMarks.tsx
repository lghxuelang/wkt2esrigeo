import React, { useState, useEffect, useRef } from 'react';
import { Button, Popconfirm, message } from 'antd';
import { isViewReady } from '@/utils/arcgis/view';
import { takeScreenShot, dataURLtoFile } from './utils';
import classnames from 'classnames';

import './index.less';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';

import { UploadFile, BookMark, BookmarksProps } from './interface';

const _b = 'geomap-widget';
const _e = 'bookmark';
const _be = `${_b}-${_e}`;

console.log('测试提交')

const stopPropagation = (e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation();

/**
 * 书签展示组件
 */
const Bookmarks: React.FC<BookmarksProps> = ({
  listType,
  items,
  onRename,
  onDelete,
  onAdd,
  onClear,
  allowClear,
  className,
  confirmDelete = false,
  style,
}) => {
  const [curBookmarkName, setCurBookmarkName] = useState<string>('');
  const [curEditingId, setCurEditingId] = useState<string | number>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [focusIndex, setFocusIndex] = useState<number>(0);
  const [curDeleteId, setCurDeleteId] = useState<string>(''); // 解决确认删除的popover闪烁的问题
  const isCardListType: boolean = listType === 'card';

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [focusIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setCurBookmarkName(value);
  };

  const handleAddClick = async (): Promise<void> => {
    // todo 加throtten
    const createTime = '' + Date.now();
    const name = 'bm_' + createTime;
    const view = await isViewReady();
    const imgUrl = await takeScreenShot({ quality: 5 });
    const imgFile = dataURLtoFile(imgUrl, name);

    const camera = JSON.stringify(view.camera.toJSON());
    const newBookmark: BookMark = {
      name,
      camera,
      createTime,
      imgUrl,
      // owner,
      // id: uuid(),
    };
    onAdd!(newBookmark, imgUrl, imgFile);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLElement>, bookmark: BookMark): void => {
    e.stopPropagation();
    if (curEditingId) {
      message.error('当前有书签正在编辑');
      return;
    }
    bookmark.id && setCurEditingId(bookmark.id);
    bookmark.name && setCurBookmarkName(bookmark.name);
    setFocusIndex(i => ++i);
  };

  const handleModifyClick = (name: string): void => {
    if (!name) {
      let preBookmark: BookMark;
      for (let i = 0; i < items!.length; i++) {
        const element = items![i];
        if (element.name === name) {
          preBookmark = element;
          if (preBookmark.name === name) {
            break;
          }
          onRename!(preBookmark, curBookmarkName);
          break;
        }
      }
    }
    setCurBookmarkName('');
    setCurEditingId('');
  };

  const handleDeleteClick = (bookmark: BookMark): void => {
    if (curEditingId === bookmark.id) {
      setCurBookmarkName('');
    }
    onDelete!(bookmark);
    curDeleteId && setCurDeleteId('');
  };

  const handleDeleteCancel = () => {
    curDeleteId && setCurDeleteId('');
  }

  const handleClearClick = (): void => {
    onClear!();
  };

  const handleItemClick = async (bookmark: BookMark): Promise<void> => {
    const view = await isViewReady();
    view.goTo(JSON.parse(bookmark.camera));
  };

  const _footer = (
    <div className={`${_be}__footer`}>
      <Button onClick={handleAddClick} type="primary" style={{ marginBottom: 10 }} block>
        添加书签
      </Button>
      {allowClear && (
        <Popconfirm
          title={`确认删除书签？`}
          okText="确认"
          cancelText="取消"
          onConfirm={handleClearClick}
        >
          <Button type="danger" block>
            清除全部
          </Button>
        </Popconfirm>
      )}
    </div>
  );

  return (
    <div className={classnames(_be, className)} style={style}>
      <ul
        className={classnames(`${_be}__list`, {
          [`${_be}__list-card`]: isCardListType,
        })}
      >
        {!!items!.length ? (
          items!.map(bookmark => {
            const { name, id, imgUrl } = bookmark;
            const isEditing = curEditingId === id;
            return (
              <li
                key={id}
                onClick={() => handleItemClick(bookmark)}
                className={`${_be}__item ${_be}${!isCardListType ? '__item-text' : '__item-card'} `}
              >
                <div
                  className={`${_be}__item-card-img`}
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                {isEditing ? (
                  <input
                    ref={inputRef}
                    className={`${_be}__item-input`}
                    onClick={stopPropagation}
                    value={curBookmarkName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className={`${_be}__item-title`}>{name}</span>
                )}
                <span
                  className={classnames(`${_be}__item-btns`, {
                    [`${_be}__item-btns-active`]: curDeleteId && curDeleteId === bookmark.id,
                    // [`${_be}__item-btns-disable`]: curDeleteId && curDeleteId !== bookmark.id,
                  })}
                  onClick={stopPropagation}
                >
                  {isEditing ? (
                    <CheckOutlined
                      className={`${_be}__item-btn`}
                      onClick={() => handleModifyClick(name)}
                    />
                  ) : (
                    <EditOutlined
                      className={classnames(`${_be}__item-btn`, {
                        // 禁止同时编辑两条
                        [`${_be}__item-btn-disable`]: curEditingId,
                      })}
                      onClick={e => handleEditClick(e, bookmark)}
                    />
                  )}
                  {/* 删除确认做成可配置的 */}
                  {confirmDelete ? (
                    <Popconfirm
                      title="确认删除书签?"
                      onConfirm={() => handleDeleteClick(bookmark)}
                      onCancel={handleDeleteCancel}
                      okText="删除"
                      cancelText="取消"
                    >
                      <DeleteOutlined
                        className={`${_be}__item-btn`}
                        onClick={() => setCurDeleteId(bookmark.id)}
                      />
                    </Popconfirm>
                  ) :
                  (
                    <DeleteOutlined
                      className={`${_be}__item-btn`}
                      onClick={() => handleDeleteClick(bookmark)}
                    />
                  )}
                </span>
              </li>
            );
          })
        ) : (
          <div className={`${_be}__none`}>暂无书签</div>
        )}
      </ul>
      {/* footer */}
      {_footer}
    </div>
  );
};

export default Bookmarks;
