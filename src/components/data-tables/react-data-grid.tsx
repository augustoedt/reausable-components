import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import {
  TypeEditInfo,
  TypeRowSelection,
  TypeSingleFilterValue
} from "@inovua/reactdatagrid-community/types";
import { TypeColumn } from "@inovua/reactdatagrid-community/types/TypeColumn";
import { TypeOnSelectionChangeArg } from "@inovua/reactdatagrid-community/types/TypeDataGridProps";
import { useCallback, useState } from "react";
import { IProduct } from "../../types/data.types";

const selectionLength = (selected: TypeRowSelection) => {
  return Object.keys(selected as any).length;
};

const gridStyle = { minHeight: 550, marginTop: 10 };

const filters: TypeSingleFilterValue[] = [
  { name: "quantidade", operator: "gte", type: "number", value: 0 },
  { name: "nome", operator: "startsWith", type: "string", value: "" },
  { name: "codigo", operator: "startsWith", type: "string", value: "" },
  { name: "marca", operator: "startsWith", type: "string", value: "" },
  { name: "vendas", operator: "gte", type: "number", value: 0 },
  { name: "saida", operator: "gte", type: "number", value: 0 },
  { name: "estoque", operator: "gte", type: "number", value: -10 },
  { name: "custo_unid", operator: "gte", type: "number", value: 0 },
];
const columns: TypeColumn[] = [
  {
    name: "quantidade",
    header: "Quantidade",
    type: "number",
    editable: true,
  },
  { name: "nome", header: "Nome", editable: false },
  { name: "codigo", header: "Codigo" },
  {
    name: "marca",
    header: "Marca",
    type: "string",
  },
  { name: "vendas", header: "Vendas", type: "number" },
  { name: "saida", header: "Saida", type: "number" },
  { name: "estoque", header: "Estoque", type: "number" },
  { name: "custo_unid", header: "Custo", type: "number" },
];
export function DataGridInovua({ dataset }: { dataset: IProduct[] }) {
  const [dataSource, setDataSource] = useState(dataset);
  const [selection, setSelectedion] = useState<TypeRowSelection>({});

  const onSelectionChange = useCallback(
    ({ selected, data, unselected }: TypeOnSelectionChangeArg) => {
      setSelectedion(selected);
    },
    [selection]
  );

  const marcas = [
    ...new Set(
      dataset.map((d) => {
        return d.marca;
      })
    ),
  ];

  const onEditComplete = useCallback(
    ({ value, rowId }: TypeEditInfo) => {
      const data = [...dataSource];
      const index = data.findIndex((r) => {
        return r.codigo === rowId;
      });
      data[index].quantidade = value;
      console.log(data[index]);

      setDataSource(data);
    },
    [dataSource]
  );

  return (
    <div className="w-full">
      <ReactDataGrid
        idProperty="codigo"
        style={gridStyle}
        dataSource={dataSource}
        defaultFilterValue={filters}
        columns={columns}
        selected={selection}
        multiSelect={true}
        checkboxOnlyRowSelect
        onSelectionChange={onSelectionChange}
        checkboxColumn
        onEditComplete={onEditComplete}
      />
      <p>Linhas selecionadas: {JSON.stringify(selectionLength(selection))}</p>
    </div>
  );
}
