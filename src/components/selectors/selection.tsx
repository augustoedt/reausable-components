import { useState } from "react";
import "./selection.module.css";
export type SelectOption = {
  label: string;
  value: string | number;
};

type MutipleSelectProp = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProp = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value?: SelectOption) => void;
};

type SelectProps = {
  options: SelectOption[];
  hasClearOptions?: false;
} & (SingleSelectProp | MutipleSelectProp);
export default function Selection({
  multiple,
  value,
  onChange,
  options,
  hasClearOptions,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value?.includes(option)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option != value) onChange(option);
    }
  }

  function isSelectedOption(option: SelectOption) {
    return multiple ? value.includes(option) : option.value === value?.value;
  }

  return (
    <div
      className="container"
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <span className="value flex">
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className="option-badge outline-2 outline rounded-md px-2 inline-block align-middle"
              >
                {v.label} <span className="clear-btn">&times;</span>
              </button>
            ))
          : value?.label}
      </span>
      {hasClearOptions ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearOptions();
          }}
          className="clear-btn"
        >
          &times;
        </button>
      ) : null}
      <div className="divider"></div>
      <div className="caret"></div>
      <ul className="options" style={{ display: isOpen ? "block" : "none " }}>
        {options.map((option, i) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            className={`option ${isSelectedOption(option) ? "selected" : ""}`}
            key={option.value}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
