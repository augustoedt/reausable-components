import { useState } from "react";
import Selection, { SelectOption } from "../components/selectors/selection";

const options = [
  {
    label: "Augusto Eduardo",
    value: "23k23nio2b34n1o31",
  },
  {
    label: "Android Teles",
    value: "sasf23k3m1m33k4j4",
  },
  {
    label: "Leonardo Jales",
    value: "123k3n45i20lsl11s",
  },
  {
    label: "Camila Gomes",
    value: "jn22jk33kii20ccsd",
  },
];

export default function Selectors() {
  const [value1, setValue1] = useState<SelectOption | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOption[]>([]);

  return (
    <div>
      <Selection options={options} value={value1} onChange={setValue1} />
      <Selection
        multiple
        options={options}
        value={value2}
        onChange={setValue2}
      />
    </div>
  );
}
