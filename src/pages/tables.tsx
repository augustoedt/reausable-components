import { useState } from "react";
import DataTable from "../components/data-tables/datatable/datatable";
import { headers } from "../components/data-tables/datatable/datatable.config";
import { Product } from "../types/data.types";
import { data, selectionGroup } from "../utils/default";

export default function Tables() {
  const [tableData, setTableData] = useState(
    data.map((d, i) => {
      return { ...new Product(d).inovuaDataSource() };
    })
  );

  const [selections, setSelection] = useState(selectionGroup);

  return (
    <>
      <DataTable
        headers={headers}
        data={tableData}
        key={"codigo"}
        selectionGroup={selections}
      />
      {/* <ToggleEditableCells dataset={tableData} /> */}
      {/* <DataGridInovua dataset={tableData} /> */}
      {/* <EditableSortedCells data={data} /> */}
      {/* <EditableCell data={data} /> */}
      {/* <DataGridMui data={tableData} /> */}
    </>
  );
}
