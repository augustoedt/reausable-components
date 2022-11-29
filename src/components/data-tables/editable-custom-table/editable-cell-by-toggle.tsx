import { MouseEvent, useEffect, useMemo, useState } from "react";
import { IProduct } from "../../../types/data.types";
import Selection, { SelectOption } from "../../selectors/selection";
import { headers, pageSizeOptions } from "./table-config";
import { Ordering, TableHeader } from "./table-entities";

const initialRowData: IProduct = {
  quantidade: 0,
  codigo: "",
  nome: "",
  marca: "",
  vendas: 0,
  saida: 0,
  estoque: 0,
  custo_unid: 0,
};

export function ToggleEditableCells({ dataset }: { dataset: IProduct[] }) {
  /*
  Variables.....
  - dataset - static -> creates a new data variable.
  - page - shows whats pagesize indicates
  - pagesize - number that page shows
  - ordering - change page order.
  */
  const [pageSize, setPageSize] = useState<SelectOption>(pageSizeOptions[0]);
  const [data, setData] = useState(dataset);
  const p = new PaginatedData(data, Number(pageSize?.value));
  const [paginator, setPaginator] = useState(p);
  const [values, setValues] = useState(initialRowData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentEditRow, setCurrentEditRow] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<Ordering>({
    order: "none",
    name: "",
    type: "",
  });

  const handleEditClick = (
    event:
      | MouseEvent<HTMLButtonElement>
      | MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>,
    item: IProduct
  ) => {
    event.preventDefault();
    setValues(item);
    setCurrentEditRow(item.codigo);
  };
  const update = (e: Ordering) => {
    if (e.order == "desc") {
      const newData = [...dataset];
      if (e.type == "number") {
        newData.sort((p1, p2) => (p1 as any)[e.name] - (p2 as any)[e.name]);
      }
      if (e.type == "string") {
        newData.sort((p1, p2) => p1.nome.localeCompare(p2.nome));
      }
      setData(newData);
      const p = new PaginatedData(newData, Number(pageSize?.value));
      setOrdering(e);
      setPaginator(p);
    } else if (e.order == "asc") {
      const newData = [...dataset];
      if (e.type == "number") {
        newData.sort((p1, p2) => (p2 as any)[e.name] - (p1 as any)[e.name]);
      }
      if (e.type == "string") {
        newData.sort((p1, p2) => p2.nome.localeCompare(p1.nome));
      }
      const p = new PaginatedData(newData, Number(pageSize?.value));
      setData(newData);
      setOrdering(e);
      setPaginator(p);
    } else if (e.order == "none") {
      setData([...dataset]);
      const p = new PaginatedData([...dataset], Number(pageSize?.value));
      setOrdering(e);
      setPaginator(p);
    }
  };

  const handleSelectRow = (e: IProduct) => {
    if (selected.includes(e.codigo)) {
      const newSelection = selected.filter((s) => s != e.codigo);
      setSelected([...newSelection]);
    } else {
      setSelected([...selected, e.codigo]);
    }
  };

  const paginationRange = usePagination({
    totalCount: data.length,
    pageSize: Number(pageSize.value),
    siblingCount: 1,
    currentPage: currentPage,
  });

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (currentEditRow) {
          const index = paginator.slicedData[currentPage - 1].findIndex(
            (v) => v.codigo == currentEditRow
          );
          if (index == paginator.slicedData[currentPage].length - 1) {
            setCurrentEditRow(paginator.slicedData[currentPage - 1][0].codigo);
          }
          setCurrentEditRow(
            paginator.slicedData[currentPage - 1][index + 1].codigo
          );
        }
      }
      if (e.key === "Escape") {
        if (currentEditRow) {
          setCurrentEditRow(undefined);
          setValues(initialRowData);
        }
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [currentEditRow]);

  return (
    <>
      <div className="flex gap-2 items-center">
        <span className="font-bold">Paginação</span>
        <Selection
          options={pageSizeOptions}
          value={pageSize}
          onChange={(e) => {
            setCurrentPage(1);
            setPageSize(e!);
            setPaginator(new PaginatedData(data, Number(e?.value)));
          }}
        />
      </div>
      <div className="flex gap-1 border-2 select-none">
        {paginationRange.map((d) =>
          d != -1 ? (
            <div
              onClick={() => {
                setCurrentPage(d);
              }}
              className={`py-1 px-2 shadow-md cursor-pointer ${
                d == currentPage ? "border-2 border-black" : ""
              }`}
            >
              {d}
            </div>
          ) : (
            <div>...</div>
          )
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th className="px-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (selected.length > 0) {
                    setSelected([]);
                  }
                  if (selected.length == 0) {
                    const newSelection: string[] = data.map((d) => d.codigo);
                    setSelected(newSelection);
                  }
                }}
                checked={selected.length > 0}
              />
            </th>
            <th>Ações</th>
            <THeader
              onOrdering={update}
              headers={headers}
              ordering={ordering}
            />
          </tr>
          <tr>
            <th colSpan={2}></th>
            {headers.map((h, i) => (
              <th className="">filter</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginator.slicedData[currentPage - 1].map((d, i) =>
            d.codigo == currentEditRow ? (
              <EditingRow
                handleEditClick={handleEditClick}
                item={d}
                onSelect={handleSelectRow}
                isSelected={selected.includes(d.codigo)}
                onChange={(e) => {}}
              />
            ) : (
              <ReadOnlyRow
                handleEditClick={handleEditClick}
                item={d}
                onSelect={handleSelectRow}
                isSelected={selected.includes(d.codigo)}
              />
            )
          )}
        </tbody>
      </table>
    </>
  );
}

function ReadOnlyRow({
  isSelected = false,
  item,
  handleEditClick,
  onSelect,
}: {
  isSelected: boolean;
  item: IProduct;
  handleEditClick(
    e:
      | MouseEvent<HTMLButtonElement>
      | MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>,
    item: IProduct
  ): void;
  onSelect(e: IProduct): void;
}) {
  return (
    <tr
      onDoubleClick={(e) => {
        handleEditClick(e, item);
      }}
      key={item.codigo}
      className={`text-center border-1 border-gray-700 ${
        isSelected ? "border-2 bg-gray-200" : ""
      }`}
    >
      <td>
        <input
          checked={isSelected}
          onChange={(e) => onSelect(item)}
          type="checkbox"
        />
      </td>
      <td>
        <button name={item.codigo} onClick={(e) => handleEditClick(e, item)}>
          Edit
        </button>
      </td>
      {headers.map((h, i) => {
        return <td key={i}>{(item as any)[h.name]}</td>;
      })}
    </tr>
  );
}

function EditingRow({
  isSelected = false,
  item,
  handleEditClick,
  onSelect,
  onChange,
}: {
  isSelected: boolean;
  item: IProduct;
  handleEditClick(e: MouseEvent<HTMLButtonElement>, item: IProduct): void;
  onSelect(e: IProduct): void;
  onChange(e: IProduct): void;
}) {
  const [value, setValue] = useState(item);

  return (
    <tr
      key={item.codigo}
      className={`text-center border-1 border-gray-700 ${
        isSelected ? "border-2 bg-gray-200" : ""
      }`}
    >
      <td>
        <input
          checked={isSelected}
          onChange={(e) => onSelect(item)}
          type="checkbox"
        />
      </td>
      <td>
        <button name={item.codigo} onClick={(e) => handleEditClick(e, item)}>
          Edit
        </button>
      </td>
      {headers.map((h, i) => {
        if (h.editable) {
          return (
            <td key={i}>
              <input
                className="px-2 w-[4em] text-center"
                autoFocus
                onChange={(e) => {
                  setValue({
                    ...value,
                    [h.name]: e.currentTarget.value,
                  });
                  onChange(value);
                }}
                value={(value as any)[h.name]}
                type="text"
              />
            </td>
          );
        }
        return <td key={i}>{(item as any)[h.name]}</td>;
      })}
    </tr>
  );
}

class PaginatedData<T> {
  slicedData: Array<T[]> = [];
  length: number;
  maxPages: number;
  sliceIndex: { start: number; end: number }[] = [];
  constructor(data: T[], pageSize: number) {
    this.length = data.length;
    this.maxPages = Math.ceil(data.length / pageSize);
    this.sliceIndex = [];
    for (let i = 0; i < this.maxPages; i++) {
      if (i == this.maxPages - 1) {
        const start = i * pageSize;
        this.slicedData.push(data.slice(start));
      } else {
        const start = i * pageSize;
        const end = (i + 1) * pageSize - 1;
        this.slicedData.push(data.slice(start, end));
      }
    }
  }
}
const range = (start: number, end: number) => {
  let length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

export const sortedData = ({
  data,
  sorted,
}: {
  data: IProduct[];
  sorted: Ordering | undefined;
}) => {
  const sortedData = useMemo(() => {
    if (sorted?.order == "asc") {
      return data.sort((a, b) => a.nome.localeCompare(b.nome));
    }
    if (sorted?.order == "desc") {
      return data.sort((a, b) => b.nome.localeCompare(a.nome));
    }
    return data;
  }, [sorted]);

  return sortedData;
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    const totalPageNumbers = siblingCount + 5;
    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );
    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, -1, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, -1, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];

    // }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

function THeader({
  headers,
  ordering,
  onOrdering,
}: {
  headers: TableHeader[];
  ordering: Ordering;
  onOrdering(e: Ordering): void;
}) {
  const [current, setCurrent] = useState("");
  return (
    <>
      {headers.map((h, i) => (
        <th className="px-2 py-1" key={h.name}>
          <div className="flex gap-2">
            <span>{h.header}</span>
            <button
              onClick={() => {
                const data = {
                  name: h.name,
                  order: "none",
                  type: h.type,
                };
                if (current == h.name) {
                  if (ordering.order == "none") {
                    data.order = "desc";
                    setCurrent(h.name);
                    onOrdering({ ...data });
                  } else if (ordering.order == "desc") {
                    data.order = "asc";
                    setCurrent(h.name);
                    onOrdering({ ...data });
                  } else if (ordering.order == "asc") {
                    data.order = "none";
                    setCurrent(h.name);
                    onOrdering({ ...data });
                  }
                } else {
                  setCurrent(h.name);
                  data.order = "desc";
                  onOrdering({ ...data });
                }
              }}
            >
              {current == h.name && ordering.order == "none" ? "=" : null}
              {current == h.name && ordering.order == "desc" ? "\u2193" : null}
              {current == h.name && ordering.order == "asc" ? "\u2191 " : null}
              {current != h.name ? "=" : null}
            </button>
          </div>
        </th>
      ))}
    </>
  );
}
