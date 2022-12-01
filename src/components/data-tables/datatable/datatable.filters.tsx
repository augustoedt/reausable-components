import { useRef } from "react";
import { Filter } from "./datatable.types";
export function TextFilter({
  onChange,
  prop,
}: {
  prop: string;
  onChange(e: Filter): void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <th className="">
      <input
        className="px-1 text-sm border bg-gray-100 border-gray-300 rounded w-36"
        type="text"
        ref={input}
        onChange={(e) => {
          onChange({
            value: input.current?.value,
            type: "contains",
            prop: prop,
          });
        }}
      />
    </th>
  );
}

export function NumberFilter({
  prop,
  onChange,
}: {
  prop: string;
  onChange(e: Filter): void;
}) {
  const inputMin = useRef<HTMLInputElement>(null);
  const inputMax = useRef<HTMLInputElement>(null);

  return (
    <th className="self-center">
      <div className="flex gap-2">
        <input
          className="px-1 text-sm border bg-gray-100 border-gray-300 rounded w-16"
          type="number"
          ref={inputMin}
          placeholder="min"
          onChange={(e) => {
            onChange({
              value: {
                min: inputMin.current?.value,
                max: inputMax.current?.value,
              },
              type: "range",
              prop: prop,
            });
          }}
        />
        <input
          className="px-1 text-sm border bg-gray-100 border-gray-300 rounded w-16"
          type="number"
          placeholder="max"
          ref={inputMax}
          onChange={(e) => {
            onChange({
              value: {
                min: inputMin.current?.value,
                max: inputMax.current?.value,
              },
              type: "range",
              prop: prop,
            });
          }}
        />
      </div>
    </th>
  );
}
