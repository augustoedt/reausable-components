import { useState } from "react";
import { ToggleEditableCells } from "../components/data-tables/editable-custom-table/editable-cell-by-toggle";
import { Product } from "../types/data.types";
import { data } from "../utils/default";

export default function Tables() {
  const [tableData, setTableData] = useState(
    data.map((d, i) => {
      return { ...new Product(d).inovuaDataSource() };
    })
  );

  return (
    <>
      <ToggleEditableCells dataset={tableData} />
      {/* <DataGridInovua dataset={tableData} /> */}
      {/* <EditableSortedCells data={data} /> */}
      {/* <EditableCell data={data} /> */}
      {/* <DataGridMui data={tableData} /> */}
    </>
  );
}
