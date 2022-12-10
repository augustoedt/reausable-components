import { useState } from "react";
import { IProduct } from "../../../types/data.types";
import { headers } from "./datatable.config";
import { verifyData } from "./datatable.functions";
import { CancelIcon, EditIcon, SaveIcon } from "./datatable.icons";
import {
  ColumnContainer,
  EditorInput,
  ToolButton,
  ToolsContainer
} from "./datatables.styled.components";

type EditableRowProps = {
  current: IProduct;
  item: IProduct;
  onAction(action: string, item: IProduct): void;
  isSelected: boolean;
};

type RowProps = {
  item: IProduct;
  onAction(action: string, item: IProduct): void;
  isSelected: boolean;
};

export function EditableRow({ item, onAction, isSelected }: EditableRowProps) {
  const [currentItem, setCurrentItem] = useState({ ...item });
  const rowKey = `${item.codigo}-editable`;
  const handleChange = (
    value: typeof item[keyof typeof item],
    prop: keyof typeof item
  ) => {
    (currentItem as any)[prop] = value;
    setCurrentItem({
      ...currentItem,
    });
    const validated = verifyData(currentItem, item);
    onAction("editing", validated);
  };

  const columns = headers.map((h, ix) => {
    const columnKey = `${ix}-${item[h.prop]}`;
    const dataValue = item[h.prop];
    if (h.editable) {
      return (
        <ColumnContainer key={columnKey}>
          <EditorInput
            value={(currentItem as any)[h.prop]}
            type={h.type}
            autoFocus
            onChange={(e) => {
              handleChange(e.currentTarget.value, h.prop);
            }}
          />
        </ColumnContainer>
      );
    }
    return <td key={columnKey}>{dataValue}</td>;
  });
  return (
    <tr key={rowKey}>
      <ColumnContainer>
        <input
          checked={isSelected}
          type="checkbox"
          onChange={(e) => {
            onAction("check", item);
          }}
        />
      </ColumnContainer>
      <ColumnContainer>
        <ToolsContainer>
          <ToolButton
            onClick={() => {
              const data = verifyData(currentItem, item);
              onAction("save", data);
            }}
          >
            <SaveIcon />
          </ToolButton>
          <ToolButton
            onClick={() => {
              onAction("cancel", item);
            }}
          >
            <CancelIcon />
          </ToolButton>
        </ToolsContainer>
      </ColumnContainer>
      {columns}
    </tr>
  );
}

export function Row({ item, onAction, isSelected }: RowProps) {
  const columns = headers.map((h, ix) => {
    const columnKey = `${ix}`;
    const value = item[h.prop];
    return (
      <ColumnContainer key={columnKey}>
        <span>{value}</span>
      </ColumnContainer>
    );
  });
  return (
    <tr>
      <ColumnContainer>
        <input
          checked={isSelected}
          type="checkbox"
          onChange={(e) => {onAction("check", item);}}
        />
      </ColumnContainer>
      <ColumnContainer>
        <ToolsContainer>
          <ToolButton
            onClick={() => {onAction("edit", item);}}>
            <EditIcon />
          </ToolButton>
        </ToolsContainer>
      </ColumnContainer>
      {columns}
    </tr>
  );
}

export function HeaderRow({}: {}) {}
