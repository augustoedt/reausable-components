import { useMemo } from "react";
import { IProduct } from "../../../types/data.types";
import { paginationStyle } from "./datatables.styled.components";

export function DataPagination({
  current,
  pages,
  sibilings = 1,
  onPageChange,
}: {
  current: number;
  pages: IProduct[][];
  sibilings?: number;
  onPageChange(e: number): void;
}) {
  const paginationRange = useMemo<(string | number)[]>(() => {
    // min of 3 elements |1| |2| ... [4]
    const indexes: (string | number)[] = [];
    if (pages.length <= 2 + 2 * sibilings) {
      for (let i = 0; i < pages.length; i++) {
        indexes.push(i);
      }
      return indexes;
    }
    //
    for (let i = 0; i < pages.length; i++) {
      if (i == 0 && i != current) indexes.push(i);
      if (i == 1 && i < current - sibilings) {
        indexes.push("...");
      }
      if (i < current && i > 0 && i >= current - sibilings) indexes.push(i);
      if (i == current) indexes.push(i);
      if (i <= current + sibilings && i > current) indexes.push(i);
      if (!indexes.includes(i) && i == pages.length - 2) {
        indexes.push("...");
      }
      if (i == pages.length - 1 && i > current + sibilings) indexes.push(i);
    }
    return indexes;
  }, [current, pages]);

  const buttons = paginationRange.map((p, id) => {
    const dotsKey = `pag-${id}`;
    const buttonKey = `btn-${p}`;
    const isCurrent = current == p;
    const page = p as number;
    if (p == "...") {
      return (
        <div css={paginationStyle.dotButton} key={dotsKey}>
          ...
        </div>
      );
    }
    return (
      <button
        css={paginationStyle.pageButton({ isCurrent })}
        key={buttonKey}
        onClick={() => onPageChange(page)}
      >
        {page + 1}
      </button>
    );
  });
  return <div css={paginationStyle.container}>{buttons}</div>;
}
