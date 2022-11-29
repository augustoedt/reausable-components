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
