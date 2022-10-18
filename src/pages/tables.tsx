import { EditableCell } from "../components/data-tables/editable-cells";
import { EditableSortedCells } from "../components/data-tables/editable-sorted-cells";
import { Header } from "../components/headers/header.components";
import { data } from "../utils/default";

export default function Tables() {
  return (
    <>
      <Header.Simple />
      <EditableSortedCells data={data} />
      <EditableCell data={data} />
    </>
  );
}
