import { SelectOption } from "../../selectors/selection";

export type DataHeader = {
  prop: string;
  name: string;
  type: string;
  editable?: boolean;
  hasFilter?: boolean;
};

export type Pagination = {
  pageSize?: SelectOption;
  page: number;
};

export type FilterType = "contains" | "range" | "selection";
export type RangeFilterType = { min?: number | string; max?: number | string };

export type Filter = {
  type: FilterType;
  value?: RangeFilterType | string | string[];
  prop: string;
};
