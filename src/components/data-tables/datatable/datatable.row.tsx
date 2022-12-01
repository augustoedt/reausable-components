import { useState } from "react";
import { IProduct } from "../../../types/data.types";
import { headers } from "./datatable.config";

export function EditableRow({
  item,
  onAction,
  isSelected,
  current,
}: {
  current: IProduct;
  item: IProduct;
  onAction(action: string, item: IProduct): void;
  isSelected: boolean;
}) {
  const [currentItem, setCurrentItem] = useState({ ...item });

  const handleChange = (
    value: string | number | boolean,
    prop: string,
    type: string
  ) => {
    (currentItem as any)[prop] = value;
    setCurrentItem({
      ...currentItem,
    });
    const validated = verify();
    onAction("editing", validated);
  };

  function verify() {
    let value = { ...currentItem };
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].editable) {
        if (headers[i].type == "number") {
          const temp = Number((currentItem as any)[headers[i].prop]);
          if (isNaN(temp)) {
            value = {
              ...value,
              [headers[i].prop]: (item as any)[headers[i].prop] as number,
            };
          } else {
            value = {
              ...value,
              [headers[i].prop]: Number(temp),
            };
          }
        }
      }
    }
    return value;
  }
  const collums = headers.map((h, ix) => {
    if (h.editable) {
      return (
        <td key={`${ix}-${(item as any)[h.prop]}`}>
          <input
            value={(currentItem as any)[h.prop]}
            type={h.type}
            autoFocus
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
    <tr key={`${item.codigo}-editable`}>
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
            const data = verify();
            onAction("save", data);
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            onAction("cancel", item);
          }}
        >
          Cancel
        </button>
      </td>
      {collums}
    </tr>
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
    <tr
      // onDoubleClick={(e) => {
      //   onAction("edit", item);
      // }}
    >
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
    </tr>
  );
}


export function HeaderRow({}:{}){

}