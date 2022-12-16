import { useState } from "react";
import Datatable2 from "../components/data-tables/datatable.v2/datatable.v2";
import { QuotationResult } from "../components/data-tables/datatable.v2/datatable.v2.types";
import { Product } from "../types/data.types";
import { data, report, selectionGroup } from "../utils/default";

export default function Tables() {
  const [tableData, setTableData] = useState(
    data.map((d, i) => {
      return { ...new Product(d).inovuaDataSource() };
    })
  );

  const [selections, setSelection] = useState(selectionGroup);

  const quotationReport: QuotationResult = report;

  const initialResult = {};

  const [aprovalResult, setAprovalResult] = useState({ ...initialResult });

  function handleUpdateResult(item: any) {
    setAprovalResult(item);
  }

  return (
    <>
      <Datatable2
        report={quotationReport}
        onUpdateResult={handleUpdateResult}
      />
      {/* <DataTable
        headers={headers}
        data={tableData}
        key={"codigo"}
        selectionGroup={selections}
      /> */}
      {/* <ToggleEditableCells dataset={tableData} /> */}
      {/* <DataGridInovua dataset={tableData} /> */}
      {/* <EditableSortedCells data={data} /> */}
      {/* <EditableCell data={data} /> */}
      {/* <DataGridMui data={tableData} /> */}
    </>
  );
}
