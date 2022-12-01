import { SelectOption } from "../../selectors/selection";
import { DataHeader } from "./datatable.types";

export const options: SelectOption[] = [
  {
    label: "25 items",
    value: 25,
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
    label: "150 items",
    value: 150,
  },
];

export const headers: DataHeader[] = [
  {
    prop: "quantidade",
    name: "Qtd",
    editable: true,
    type: "number",
  },
  {
    prop: "codigo",
    name: "Codigo",
    type: "string",
  },
  {
    prop: "nome",
    name: "Nome",
    type: "string",
  },
  {
    prop: "marca",
    name: "Marca",
    type: "string",
  },
  {
    prop: "vendas",
    name: "Vendas",
    type: "number",
  },
  {
    prop: "saida",
    name: "Saida",
    type: "number",
  },
  {
    prop: "estoque",
    name: "Estoque",
    type: "number",
  },
  {
    prop: "custo_unid",
    name: "Custo/Unid",
    type: "number",
  },
];
