import { IProduct } from "../../../types/data.types";

export type Ordering = {
  name: string;
  order: "asc" | "desc" | "none" | string;
  type: string;
};

export interface TableHeader {
  name: string;
  header: string;
  editable?: boolean;
  type: string;
}

export interface TableValues {
  rowData: IProduct;
  id: string | undefined;
}
