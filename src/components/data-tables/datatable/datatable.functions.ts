import type { IProduct } from "../../../types/data.types";
import { headers } from "./datatable.config";
import {
  Filter,
  Order,
  OrderFilter,
  Pagination,
  RangeFilterType
} from "./datatable.types";

export function verifyData(currentItem: IProduct, item: IProduct) {
  let value = { ...currentItem };

  for (let i = 0; i < headers.length; i++) {
    const prop = headers[i].prop;
    const isEditable = headers[i].editable;
    const currentValue = currentItem[prop];
    const lastValue = item[prop];
    const type = headers[i].type;

    if (isEditable) {
      if (type == "number") {
        const temp = Number(currentValue);
        if (isNaN(temp)) {
          value = {
            ...value,
            [prop]: lastValue,
          };
        } else {
          value = {
            ...value,
            [prop]: Number(temp),
          };
        }
      }
    }
  }
  return value;
}

export function generatePaginatination<T>(
  values: Pagination,
  dataset: T[]
): T[][] {
  const size = values.pageSize?.value as number;
  const calc = Math.ceil(dataset.length / size);
  const numPages = calc == 0 ? 1 : calc;
  const allPages: T[][] = [];
  for (let i = 0; i < numPages; i++) {
    if (i == numPages - 1) {
      allPages.push(dataset.slice(i * size));
      break;
    }
    allPages.push(dataset.slice(i * size, (i + 1) * size));
  }
  return allPages;
}

export function updateList<T>(data: T[], item: T, key: keyof T) {
  return data.map((d) => {
    if (d[key] == item[key]) {
      return item;
    } else {
      return d;
    }
  });
}

export function filterComputation(
  data: IProduct[],
  filters: Filter<IProduct>[]
) {
  let filtered: IProduct[] = [...data];

  filters.forEach((f) => {
    filtered = filtered.filter((d) => {
      const dataValue = d[f.prop];
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

export function getNextFilter<T>(
  prop: keyof T,
  currentFilter: OrderFilter<T>
): OrderFilter<T> {
  if (currentFilter.prop == null || prop != currentFilter.prop) {
    return {
      prop,
      order: Order.asc,
    };
  } else {
    if (currentFilter.order == Order.desc) {
      return {
        prop,
        order: Order.none,
      };
    }
    if (currentFilter.order == Order.asc) {
      return {
        prop,
        order: Order.desc,
      };
    }
    return { prop, order: Order.asc };
  }
}

export function orderData<T>(filter: OrderFilter<T>, data: T[]) {
  console.log(filter);
  if (filter.prop && typeof data[0][filter.prop] == "number") {
    console.log("number order");
    return data.sort((a, b) => {
      if (filter.order == Order.asc) {
        return (a[filter.prop!] as number) - (b[filter.prop!] as number);
      }
      if (filter.order == Order.desc) {
        return (b[filter.prop!] as number) - (a[filter.prop!] as number);
      }
      return 0;
    });
  }
  if (filter.prop && typeof data[0][filter.prop] == "string") {
    console.log("string order");
    return data.sort((a, b) => {
      if (filter.order == Order.asc) {
        return (a[filter.prop!] as string)
          .toLowerCase()
          .localeCompare(b[filter.prop!] as string);
      }
      if (filter.order == Order.desc) {
        return (b[filter.prop!] as string)
          .toLowerCase()
          .localeCompare(a[filter.prop!] as string);
      }
      return 0;
    });
  }

  return data;
}
