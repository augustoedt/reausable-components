import { useState } from "react";
import { DatatableHeader } from "./EditableDatatable.types";

type PaginationType = {
    size: number,
    page: number,
}

export function EditableDatatable<T>({
  dataKey,
  data,
  headers,
}: {
  data: T[];
  dataKey: keyof T;
  headers: DatatableHeader<T>[];
}) {
  const [pagination, setPagination] = useState<T[]>();
  const [currentEditable, setCurrentEditable] = useState<
    T | null | undefined
  >();

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            {headers.map((h, i) => (
              <th key={h.prop.toString()}>{h.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, ix) => {
            if (currentEditable == d[dataKey]) {
              return <EditableRow item={d} headers={headers} index={ix} />;
            }
            return <Row item={d} headers={headers} index={ix} />;
          })}
        </tbody>
      </table>
    </>
  );
}

export function EditableRow<T>({
  item,
  headers,
  index,
}: {
  item: T;
  headers: DatatableHeader<T>[];
  index: number;
}) {
  return (
    <tr>
      {headers.map((h) => {
        const value = item[h.prop] as string | number;
        if (h.editable) {
          return (
            <td>
              <input defaultValue={value} type={(typeof value).toString()} />
            </td>
          );
        } else {
          if (h.render) return <td>{h.render(item, index)}</td>;
          else return <td>{value}</td>;
        }
      })}
    </tr>
  );
}
export function Row<T>({
  item,
  headers,
  index,
}: {
  item: T;
  headers: DatatableHeader<T>[];
  index: number;
}) {
  return (
    <tr>
      {headers.map((h) => {
        const value = item[h.prop] as string | number;
        if (h.render) return <td>{h.render(item, index)}</td>;
        else return <td>{value}</td>;
      })}
    </tr>
  );
}
