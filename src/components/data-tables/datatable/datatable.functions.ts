import type { IProduct } from "../../../types/data.types";
import type { Filter, Pagination, RangeFilterType } from "./datatable.types";

export function generatePaginatination(
  values: Pagination,
  dataset: IProduct[]
): IProduct[][] {
  const size = values.pageSize?.value as number;
  const numPages = Math.floor(dataset.length / size) + 1;
  console.log(`num-page: ${numPages}`);
  const allPages: IProduct[][] = [];
  for (let i = 0; i < numPages; i++) {
    if (i == numPages - 1) {
      allPages.push(dataset.slice(i * size));
      break;
    }
    allPages.push(dataset.slice(i * size, (i + 1) * size));
  }
  return allPages;
}

export function updateList<T>(data: T[], item: T, key: string) {
  return data.map((d) => {
    if ((d as any)[key] == (item as any)[key]) {
      return item;
    } else {
      return d;
    }
  });
}

export function filterComputation(data: IProduct[], filters: Filter[]) {
  let filtered: IProduct[] = [...data];

  filters.forEach((f) => {
    filtered = filtered.filter((d) => {
      const dataValue = (d as any)[f.prop];
      if (f.type == "contains" && f.value != "") {
        return (dataValue as string)
          .toLowerCase()
          .includes((f.value as string).toLowerCase());
      }
      if (f.type == "range") {
        const filter = f.value as RangeFilterType;
        if (filter.max != "" && filter.min != "") {
          const r =
            dataValue >= Number(filter.min) && dataValue <= Number(filter.max);
          if (Number(filter.max) < Number(filter.min)) {
            return false;
          }
          return r;
        }
        if (filter.max != "" && filter.min == "") {
          return dataValue <= Number(filter.max);
        }
        if (filter.max == "" && filter.min != "") {
          return dataValue >= Number(filter.min);
        }
      }
    });
  });

  return filtered;
}
