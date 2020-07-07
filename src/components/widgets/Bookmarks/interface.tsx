export type ListType = 'text' | 'card';

export interface UploadFile<T = any> {
  // uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  // status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: T;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: T;
  preview?: string;
}

// export type EventType =
//   | React.KeyboardEvent<HTMLDivElement>
//   | React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

export interface BookmarksProps {
  items?: any[];
  listType?: ListType;
  onAdd?: (bookmark: BookMark, imgUrl: string, imgFile: UploadFile) => void;
  onRename?: (preBookmark: BookMark, curBookmarkName: string) => void;
  onDelete?: (bookmark: BookMark) => void;
  allowClear?: boolean;
  onClear?: () => void | boolean;
  style?: React.CSSProperties;
  className?: string;
  confirmDelete?: boolean | void ;
}

export type BookMark = {
  name: string;
  camera: string;
  createTime: string;
  imgUrl: string;
  owner?: string;
  id?: string | number;
};

/**
 * 辅助类型
 */
// 类型集合A，B的非交集，组成新的类型集合
export type SetDifference<A, B> = A extends B ? never : A;

// 类型集合A和其子集A1的补集，组成新的类型集合
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

// 从对象T 中移除 对象T1存在的属性，生成新的类型（T1的属性是T的属性的子集）
export type Subtract<T extends T1, T1 extends object> = Pick<T, SetComplement<keyof T, keyof T1>>;
