import { useEffect, useMemo, useRef, useState } from "react";
import { IProduct } from "../../../types/data.types";
import Selection, { SelectOption } from "../../selectors/selection";
import { DataPagination } from "./data.pagination";
import { options } from "./datatable.config";
import { NumberFilter, TextFilter } from "./datatable.filters";
import {
  filterComputation,
  generatePaginatination,
  getNextFilter,
  orderData,
  updateList,
  verifySelectionGroup
} from "./datatable.functions";
import { OrderComponent } from "./datatable.icons";
import { EditableRow, Row } from "./datatable.row";
import {
  DataHeader,
  Filter,
  Order,
  OrderFilter,
  Pagination,
  RangeFilterType,
  SelectionGroup
} from "./datatable.types";

const emptyRow: IProduct = {
  nome: "",
  quantidade: 0,
  codigo: "",
  marca: "",
  vendas: 0,
  saida: 0,
  estoque: 0,
  custo_unid: 0,
};

export default function DataTable<T>({
  key,
  headers,
  data,
  selectionGroup,
}: {
  key: keyof IProduct;
  headers: DataHeader<IProduct>[];
  data: IProduct[];
  selectionGroup: SelectionGroup<IProduct>[];
}) {
  const [ordering, setOrdering] = useState<OrderFilter<IProduct>>({
    prop: null,
    order: Order.none,
  });
  const [virtualData, setVirtualData] = useState([...data]);
  const [columnFilter, setColumnFilter] = useState<Filter<IProduct>[]>([]);
  const filteredData = useMemo(() => {
    return filterComputation(virtualData, columnFilter);
  }, [columnFilter, virtualData]);
  const [editableData, setEditableData] = useState({ ...emptyRow });
  const [editable, setEditable] = useState<string>("");
  const [pagination, setPaginaton] = useState<Pagination>({
    pageSize: options[0],
    page: 0,
  });
  const pages = useMemo(
    () => generatePaginatination(pagination, filteredData),
    [pagination.pageSize, filteredData]
  );
  const [checked, setChecked] = useState<string[]>([]);

  const mainSelect = useRef<HTMLInputElement>(null);

  // useMemo(() => {
  //   if (checked.length != filteredData.length) {
  //     if (mainSelect.current) {
  //       mainSelect.current.checked = false;
  //       mainSelect.current.indeterminate = true;
  //     }
  //   }
  // }, [checked.length]);

  const handleAction = (
    action: string,
    item?: IProduct,
    prop?: keyof IProduct
  ) => {
    if (action == "orderBy" && prop != undefined) {
      const newOrderingFilter = getNextFilter(prop, ordering);
      setOrdering(newOrderingFilter);
      if (newOrderingFilter.order == Order.none) {
        setVirtualData([...data]);
      } else {
        const newVirtualData = orderData(newOrderingFilter, [...virtualData]);
        setVirtualData([...newVirtualData]);
      }
    }
    if (item && action == "edit") {
      setEditableData({ ...item });
      setEditable(item.codigo);
    }
    if (item && action == "editing") {
      setEditableData({ ...item });
    }
    if (item && action == "cancel") {
      setEditableData({ ...item });
      setEditable("");
    }
    if (item && action == "save") {
      setEditableData({ ...item });
      setEditable("");
      setVirtualData([...updateList(virtualData, item, "codigo")]);
    }
    if (item && action == "check") {
      if (checked.includes(item.codigo)) {
        setChecked(checked.filter((f) => f != item.codigo));
      } else {
        setChecked([item.codigo, ...checked]);
      }
    }
  };

  const handlePageRange = (option: SelectOption | undefined) => {
    setPaginaton({
      ...pagination,
      page: 0,
      pageSize: option,
    });
  };

  const handlePage = (e: number) => {
    setPaginaton({
      ...pagination,
      page: e,
    });
  };

  const columns = pages[pagination.page].map((d, i) => {
    const isChecked = checked.includes(d.codigo);
    const isInSelectionGroup = verifySelectionGroup(d, selectionGroup);
    if (d.codigo == editable) {
      return (
        <EditableRow
          isInSelectionGroup={isInSelectionGroup}
          key={d.codigo}
          current={editableData}
          isSelected={isChecked}
          item={d}
          onAction={handleAction}
        />
      );
    }
    return (
      <Row
        isInSelectionGroup={isInSelectionGroup}
        key={d.codigo}
        isSelected={isChecked}
        item={d}
        onAction={handleAction}
      />
    );
  });

  const paginationView = useMemo(() => {
    return (
      <DataPagination
        current={pagination.page}
        pages={pages.length}
        sibilings={2}
        onPageChange={handlePage}
      />
    );
  }, [pages, pagination.page]);
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (editable !== "") {
          const index = pages[pagination.page].findIndex(
            (v) => v.codigo == editable
          );
          /*
          CASE EDITABLE ROW IS LAST ROW CHANGE TO FIRST ROW
          */
          if (index == pages[pagination.page].length - 1) {
            setVirtualData([
              ...updateList(virtualData, editableData, "codigo"),
            ]);
            setEditableData(pages[pagination.page][0]);
            setEditable(pages[pagination.page][0].codigo);
          }
          /*
          CHANGE EDITABLE ROW TO NEXT ROW BELOW
          */
          setVirtualData([...updateList(virtualData, editableData, "codigo")]);
          setEditableData(pages[pagination.page][index + 1]);
          setEditable(pages[pagination.page][index + 1].codigo);
        }
      }
      if (e.key === "Escape") {
        if (editable !== "") {
          setEditable("");
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [editable, editableData]);

  return (
    <>
      <div className="flex">
        <Selection
          value={pagination.pageSize}
          onChange={handlePageRange}
          options={options}
        />
        {paginationView}
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                ref={mainSelect}
                onClick={(e) => {
                  const indeterminated = mainSelect.current?.indeterminate;
                  const isChecked = mainSelect.current?.checked;
                  console.log(indeterminated, isChecked);
                  if (indeterminated) {
                    mainSelect.current.checked = true;
                    setChecked([...filteredData.map((f) => f.codigo)]);
                  } else if (isChecked) {
                    console.log("isChecked");
                    mainSelect.current.checked = false;
                    setChecked([]);
                  }
                }}
              />
            </th>
            <th>Ações</th>
            {headers.map((h, i) => {
              return (
                <th key={`${i}-header-${h.prop}`}>
                  <div className="flex items-center gap-2 justify-center">
                    {h.name}
                    <OrderComponent
                      onAction={handleAction}
                      prop={h.prop}
                      filter={ordering}
                    />
                  </div>
                </th>
              );
            })}
          </tr>
          <tr>
            <th></th>
            <th></th>
            {headers.map((h, i) => {
              if (h.type == "string") {
                return (
                  <TextFilter
                    prop={h.prop}
                    key={`${h.prop}-filter`}
                    onChange={(e) => {
                      const index = columnFilter.findIndex(
                        (f) => f.prop == e.prop
                      );
                      setPaginaton({
                        ...pagination,
                        page: 0,
                      });
                      if (e.value == "") {
                        setColumnFilter(
                          columnFilter.filter((f) => f.prop !== e.prop)
                        );
                      } else {
                        if (index == -1) {
                          setColumnFilter([...columnFilter, e]);
                        } else {
                          columnFilter[index] = e;
                          setColumnFilter([...columnFilter]);
                        }
                      }
                    }}
                  />
                );
              }
              if (h.type == "number") {
                return (
                  <NumberFilter
                    prop={h.prop}
                    onChange={(e) => {
                      const value = e.value as RangeFilterType;
                      const index = columnFilter.findIndex(
                        (f) => f.prop == e.prop
                      );
                      setPaginaton({
                        ...pagination,
                        page: 0,
                      });
                      if (value.max == "" && value.min == "") {
                        setColumnFilter([
                          ...columnFilter.filter((f) => f.prop !== e.prop),
                        ]);
                      } else {
                        if (index == -1) {
                          setColumnFilter([...columnFilter, e]);
                        } else {
                          columnFilter[index] = e;
                          setColumnFilter([...columnFilter]);
                        }
                      }
                    }}
                    key={`${h.prop}-filter`}
                  />
                );
              }
              <td key={`${h.prop}-filter`}></td>;
            })}
          </tr>
        </thead>
        <tbody>{columns}</tbody>
      </table>
      <div>{columns.length > 0 ? null : "Nenhum resultado encontrado"}</div>
    </>
  );
}
