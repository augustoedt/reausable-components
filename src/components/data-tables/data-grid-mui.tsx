import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";
import { IProduct } from "../../types/data.types";

export function DataGridMui({ data = [] }: { data: IProduct[] }) {
  const columns: GridColDef[] = [
    { field: "id", hide: true },
    {
      field: "quantity",
      headerName: "Quantidade",
      type: "number",
      editable: true,
    },
    { field: "nome", headerName: "Nome" },
    { field: "codigo", headerName: "Codigo" },
    { field: "marca", headerName: "Marca" },
    { field: "vendas", headerName: "Vendas", type: "number" },
    { field: "saida", headerName: "Saida", type: "number" },
    { field: "estoque", headerName: "Estoque", type: "number" },
    { field: "custo_unid", headerName: "Custo", type: "number" },
  ];

  const rows: GridRowsProp = data.map((d, i) => {
    return {
      id: i,
      ...d,
    };
  });

  const [selected, setSelected] = useState([]);

  const [rowData, setRowData] = useState(rows);

  const grid = (
    <DataGrid
      columns={columns}
      rows={rowData}
      checkboxSelection={true}
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
      onSelectionModelChange={(details, params) => {}}
      onCellFocusOut={(details, params) => {
        console.log(details.row);
        // setRowData(addOrUpdateField(details.row));
        console.log(rowData[details.id as number]);
      }}
      disableIgnoreModificationsIfProcessingProps
    />
  );
  return <div className="h-[560px]">{grid}</div>;
}
