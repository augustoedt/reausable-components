import { MouseEvent, useEffect, useMemo, useState } from "react";
import { IProduct } from "../../../types/data.types";
import { Selection, SelectOption } from "../../selectors/selection";

interface TableHeader {
  name: string;
  header: string;
  editable?: boolean;
  type?: string;
}
const pageSizeOptions: SelectOption[] = [
  {
    label: "30 items",
    value: 30,
  },
  {
    label: "50 items",
    value: 50,
  },
  {
    label: "100 items",
    value: 100,
  },
  {
    label: "200 items",
    value: 200,
  },
];

const headers: TableHeader[] = [
  {
    name: "quantidade",
    header: "Quantidade",
    editable: true,
    type: "number",
  },
  {
    name: "codigo",
    header: "Codigo",
  },
  {
    name: "nome",
    header: "Nome",
  },
  {
    name: "marca",
    header: "Marca",
  },
  {
    name: "vendas",
    header: "Vendas",
  },
  {
    name: "saida",
    header: "Saida",
  },
  {
    name: "estoque",
    header: "Estoque",
  },
  {
    name: "custo_unid",
    header: "Custo/Unid",
  },
];

interface TableValues {
  rowData: IProduct;
  id: string | undefined;
}

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

type Ordering = {
  name: string;
  type: "asc" | "desc" | "none" | string;
};

export function ToggleEditableCells({ dataset }: { dataset: IProduct[] }) {
  const [pageSize, setPageSize] = useState<SelectOption>(pageSizeOptions[0]);
  const [data, setData] = useState(dataset);

  const p = new PaginatedData(data, Number(pageSize?.value));
  const [paginator, setPaginator] = useState(p);
  const [values, setValues] = useState(initialRowData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentEditRow, setCurrentEditRow] = useState<string | undefined>();
  const [ordering, setOrdering] = useState<Ordering | undefined>();

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

  const update = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (ordering == undefined) {
      console.log(ordering);
      const newData = data.sort((p1, p2) => p2.nome.localeCompare(p1.nome));
      const p = new PaginatedData(data, Number(pageSize?.value));
      setOrdering({ name: "", type: "asc" });
      setPaginator(p);
    } else if ((ordering.type = "asc")) {
      console.log(ordering);
      const newData = data.sort((p1, p2) => p1.nome.localeCompare(p2.nome));
      const p = new PaginatedData(data, Number(pageSize?.value));
      setOrdering({ name: "", type: "desc" });
      setPaginator(p);
    } else if ((ordering.type = "desc")) {
      console.log(ordering);
      const p = new PaginatedData(dataset, Number(pageSize?.value));
      setOrdering(undefined);
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
          const index = paginator.slicedData[currentPage].findIndex(
            (v) => v.codigo == currentEditRow
          );
          console.log(index);
          if (index == paginator.slicedData[currentPage].length - 1) {
            setCurrentEditRow(paginator.slicedData[currentPage][0].codigo);
          }
          setCurrentEditRow(
            paginator.slicedData[currentPage][index + 1].codigo
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
        <button onClick={update} className="shadow-md px-4 py-1">
          Sort
        </button>
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
              <input type="checkbox" />
            </th>
            <th>Ações</th>
            {headers.map((h, i) => (
              <th className="px-2 py-1" key={i}>
                <div className="flex gap-2">
                  <span>{h.header}</span>
                </div>
              </th>
            ))}
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
