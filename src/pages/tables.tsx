import { useMemo, useState } from "react";
import Datatable2 from "../components/data-tables/datatable.v2/datatable.v2";
import { getWinnerUsers } from "../components/data-tables/datatable.v2/datatable.v2.functions";
import {
  QuotationResult,
  Winner
} from "../components/data-tables/datatable.v2/datatable.v2.types";
import { CreatedDemandItem, CreateDemand, Product } from "../types/data.types";
import { data, report, selectionGroup } from "../utils/default";

export default function Tables() {
  const [tableData, setTableData] = useState(
    data.map((d, i) => {
      return { ...new Product(d).inovuaDataSource() };
    })
  );

  const [selections, setSelection] = useState(selectionGroup);

  const quotationReport: QuotationResult = report;

  const winners: Winner[] = useMemo(() => {
    return getWinnerUsers(report);
  }, [report.id]);

  const initialResult: CreateDemand = {
    quotation_id: quotationReport.id,
    user_id: "admin",
    name: quotationReport.name,
    avaliable_for: quotationReport.proposals.map((p) => p.userId),
    itens: winners.map((w, i) => {
      return {
        user_id: "",
        email: "",
        codigo: w.codigo,
        description: quotationReport.items[i].nome,
        quantity: quotationReport.items[i].quantidade,
        price: 0,
      };
    }),
  };

  const [aprovalResult, setAprovalResult] = useState({ ...initialResult });

  function handleUpdateResult(item: CreatedDemandItem, index: number) {
    const itens = [...aprovalResult.itens];
    itens[index] = item;
    setAprovalResult({
      ...aprovalResult,
      itens,
    });
    console.log(item);
  }

  return (
    <>
      <Datatable2
        winners={winners}
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
