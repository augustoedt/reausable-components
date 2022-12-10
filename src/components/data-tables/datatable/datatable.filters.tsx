import { useRef } from "react";
import tw from "twin.macro";
import { Filter } from "./datatable.types";

const StringInput = tw.input`p-1 text-sm border bg-gray-100 border-gray-300 rounded w-28`;
const NumberInput = tw(StringInput)`w-16 text-center`;

export function TextFilter<T>({
  onChange,
  prop,
}: {
  prop: keyof T;
  onChange(e: Filter<T>): void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <th className="">
      <StringInput
        className=""
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

export function NumberFilter<T>({
  prop,
  onChange,
}: {
  prop: keyof T;
  onChange(e: Filter<T>): void;
}) {
  const inputMin = useRef<HTMLInputElement>(null);
  const inputMax = useRef<HTMLInputElement>(null);

  return (
    <th className="self-center">
      <div className="flex gap-2">
        <NumberInput
          className=""
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
        <NumberInput
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
