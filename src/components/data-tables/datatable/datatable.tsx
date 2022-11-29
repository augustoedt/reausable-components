import { useMemo, useState } from "react";
import { IProduct } from "../../../types/data.types";
import Selection, { SelectOption } from "../../selectors/selection";
import { DataPagination } from "./data.pagination";
import { options } from "./datatable.config";
import { EditableRow, Row } from "./datatable.row";
import { DataHeader, Pagination } from "./datatable.types";

export default function DataTable<T>({
  headers,
  data,
}: {
  headers: DataHeader[];
  data: IProduct[];
}) {
  const [editable, setEditable] = useState<string>("");
  const [pagination, setPaginaton] = useState<Pagination>({
    pageSize: options[0],
    page: 0,
  });
  const pages = useMemo(
    () => generatePaginatination(pagination, data),
    [pagination.pageSize]
  );
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const handleAction = (action: string, item: IProduct) => {
    if (action == "edit") {
      setEditable(item.codigo);
    }
    if (action == "cancel" || action == "save") {
      setEditable("");
    }
    if (action == "check") {
      if (checkedValues.includes(item.codigo)) {
        setCheckedValues(checkedValues.filter((f) => f != item.codigo));
      } else {
        setCheckedValues([item.codigo, ...checkedValues]);
      }
    }
  };

  const handlePagination = (option: SelectOption | undefined) => {
    setPaginaton({
      page: 0,
      pageSize: option,
    });
  };

  return (
    <>
      <Selection
        value={pagination.pageSize}
        onChange={(e) => handlePagination(e)}
        options={options}
      />
      <DataPagination
        current={pagination.page}
        pages={pages}
        sibilings={3}
        onPageChange={(e) =>
          setPaginaton({
            ...pagination,
            page: e,
          })
        }
      />
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Ações</th>
            {headers.map((h, i) => {
              return <th key={`${i}-header-${h.prop}`}>{h.name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {pages[pagination.page].map((d, i) => {
            if (d.codigo == editable) {
              return (
                <tr key={`${d.codigo}-editable`}>
                  <EditableRow
                    isSelected={checkedValues.includes(d.codigo)}
                    item={d}
                    onAction={handleAction}
                  />
                </tr>
              );
            }
            return (
              <tr key={`${d.codigo}-normal`}>
                <Row
                  isSelected={checkedValues.includes(d.codigo)}
                  item={d}
                  onAction={handleAction}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function generatePaginatination(
  values: Pagination,
  data: IProduct[]
): IProduct[][] {
  const size = values.pageSize?.value as number;
  const numPages = Math.ceil(data.length / size);
  const allPages: IProduct[][] = [];
  for (let i = 0; i < numPages; i++) {
    if (i == numPages - 1) {
      allPages.push(data.slice(i * size));
      break;
    }
    allPages.push(data.slice(i * size, (i + 1) * size));
  }
  return allPages;
}
