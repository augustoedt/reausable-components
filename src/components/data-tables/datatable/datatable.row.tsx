import { useState } from "react";
import { IProduct } from "../../../types/data.types";
import { headers } from "./datatable.config";

export function EditableRow({
  item,
  onAction,
  isSelected,
}: {
  item: IProduct;
  onAction(action: string, item: IProduct): void;
  isSelected: boolean;
}) {
  const [currentItem, setCurrentItem] = useState(item);

  const handleChange = (
    value: string | number | boolean,
    prop: string,
    type: string
  ) => {
    (currentItem as any)[prop] = value;
    setCurrentItem({
      ...currentItem,
    });
  };

  const collums = headers.map((h, ix) => {
    if (h.editable) {
      return (
        <td key={`${ix}-${(item as any)[h.prop]}`}>
          <input
            value={(currentItem as any)[h.prop]}
            type={h.type}
            onChange={(e) => {
              handleChange(e.currentTarget.value, h.prop, h.type);
            }}
          />
        </td>
      );
    }
    return <td key={`${ix}`}>{(item as any)[h.prop]}</td>;
  });

  return (
    <>
      <td>
        <input
          checked={isSelected}
          type="checkbox"
          onChange={(e) => {
            onAction("check", item);
          }}
        />
      </td>
      <td>
        <button
          onClick={() => {
            onAction("save", currentItem);
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            onAction("cancel", currentItem);
          }}
        >
          Cancel
        </button>
      </td>
      {collums}
    </>
  );
}

export function Row({
  item,
  onAction,
  isSelected,
}: {
  item: IProduct;
  onAction(action: string, item: IProduct): void;
  isSelected: boolean;
}) {
  const columns = headers.map((h, ix) => {
    return <td key={`${ix}`}>{(item as any)[h.prop]}</td>;
  });
  return (
    <>
      <td>
        <input
          checked={isSelected}
          type="checkbox"
          onChange={(e) => {
            onAction("check", item);
          }}
        />
      </td>
      <td>
        <button
          onClick={() => {
            onAction("edit", item);
          }}
        >
          Edit
        </button>
      </td>
      {columns}
    </>
  );
}
