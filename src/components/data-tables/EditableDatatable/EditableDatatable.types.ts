import { ReactNode } from "react";

export type DatatableHeader<T> = {
  title?: ReactNode;
  editable?: boolean;
  prop: keyof T;
  render?(record: T, index: number): ReactNode;
};
