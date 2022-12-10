import { SelectOption } from "../../selectors/selection";

export type DataHeader<T> = {
  prop: keyof T;
  name: string;
  type: string;
  editable?: boolean;
  hasFilter?: boolean;
  render?: (record: T) => string | number;
};

export type Pagination = {
  pageSize?: SelectOption;
  page: number;
};

export type FilterType = "contains" | "range" | "selection";
export type RangeFilterType = { min?: number | string; max?: number | string };

export type Filter<T> = {
  type: FilterType;
  value?: RangeFilterType | string | string[];
  prop: keyof T;
};

export enum Order {
  asc,
  desc,
  none,
}

export type OrderFilter<T> = {
  prop: keyof T | null;
  order: Order;
};

export type SelectionGroup<T> = {
  id: string;
  name: string;
  show: boolean;
  key: keyof T;
  itens: SelectionItem<T>[]
};
export type SelectionItem<T> = {
  value: T[keyof T];
};
