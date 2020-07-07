import React, { Component } from 'react';
import uuid from 'uuid';
import { Subtract, BookMark, BookmarksProps } from './interface';
const LOCAL_BOOKMARK = 'LOCAL_BOOKMARK';

const getLocalBookmarks = (): Array<object> => {
  const value = window.localStorage.getItem(LOCAL_BOOKMARK);
  const bookmarks = value ? JSON.parse(value) : [];
  return bookmarks!.map(item => {
    item.imgUrl = window.localStorage.getItem('bm' + item.id);
    return item;
  });
};

const setLocalBookmarks = (bookmarks: BookMark[]) => {
  const _bookmarks = bookmarks.map(item => {
    const { imgUrl, ..._item } = item;
    const localKey = 'bm' + item.id;
    if (!window.localStorage.getItem(localKey)) {
      window.localStorage.setItem(localKey, imgUrl);
    }
    return _item;
  });
  window.localStorage.setItem(LOCAL_BOOKMARK, JSON.stringify(_bookmarks));
};

const deleteLocalBookmark = (id: string | number) => {
  if (!id) return
  window.localStorage.removeItem('bm' + id);
};

interface DataState {
  // data: BookMark[];
  data: any[];
}
// interface InjectedBookmarkProps {
//   items: number;
//   listType: string;
//   dataIndex: string;
//   onRename(): void;
//   onDelete(): void;
//   onAdd(): void;
// }

interface WithLocalStorageProps {
  listType?:string,
  style?: React.CSSProperties;
}

export const withLocalStorage = <P extends BookmarksProps>(
  Component: React.ComponentType<P>
) =>
  class WithLocalStorage extends React.Component<
    Subtract<P, BookmarksProps> & WithLocalStorageProps,
    DataState
  > {
    state: DataState = {
      data: [],
    };

    componentDidMount() {
      const data = getLocalBookmarks();
      this.setState({ data });
    }

    handleAdd = (bookmark:BookMark, imgUrl: string, imgFile:any) => {
      const { data } = this.state;
      bookmark.id = uuid()
      const _data = [...data, bookmark];
      this.setState({ data: _data });
      setLocalBookmarks(_data);
    };

    handleRename = (preBookmark: BookMark, curBookmarkName: string) => {
      const { data } = this.state;
      const _data = data.map(item => {
        if (item.id === preBookmark.id) {
          item.name = curBookmarkName;
        }
        return item;
      });
      this.setState({ data: _data });
      setLocalBookmarks(_data);
    };

    handleDelete = (bookmark: BookMark) => {
      const {id=''} = bookmark
      deleteLocalBookmark(id)
      const { data } = this.state;
      const _data = data.filter(item => item.id !== bookmark.id);
      this.setState({ data: _data });
      setLocalBookmarks(_data);
    };

    render() {
      return (
        <Component
          {...(this.props as P)}
          items={this.state.data}
          listType="card"
          dataIndex="id"
          onRename={this.handleRename}
          onDelete={this.handleDelete}
          onAdd={this.handleAdd}
          confirmDelete
        />
      );
    }
  };
