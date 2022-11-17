import { SelectOption } from "../../selectors/selection";
import { TableHeader } from "./table-entities";

export const pageSizeOptions: SelectOption[] = [
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

export const headers: TableHeader[] = [
  {
    name: "quantidade",
    header: "Quantidade",
    editable: true,
    type: "number",
  },
  {
    name: "codigo",
    header: "Codigo",
    editable: true,
    type: "string",
  },
  {
    name: "nome",
    header: "Nome",
    type: "string",
  },
  {
    name: "marca",
    header: "Marca",
    type: "string",
  },
  {
    name: "vendas",
    header: "Vendas",
    type: "number",
  },
  {
    name: "saida",
    header: "Saida",
    type: "number",
  },
  {
    name: "estoque",
    header: "Estoque",
    type: "number",
  },
  {
    name: "custo_unid",
    header: "Custo/Unid",
    type: "number",
  },
];
