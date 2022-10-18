import { useState } from "react";

interface Props<T> {
  onAction?(value: HeaderAction): void;
  data: T[];
}

interface HeaderAction {
  action: string;
  type: string;
  key: string;
}

interface TableData<T> {
  checked: boolean;
  value: number;
  item: T;
}

export const EditableSortedCells = <T extends unknown>({
  data,
  onAction,
}: Props<T>) => {
  const keys = Object.keys(data[0] as any);
  const [allChecked, setAllChecked] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    key: "none",
    action: "none",
    type: "none",
  });
  const [tableValues, setTableValues] = useState<TableData<T>[]>(
    data.map((d) => {
      return {
        checked: false,
        value: 0,
        item: d,
      };
    })
  );

  const sortBy = (filter: HeaderAction) => {
    let data;
    if (filter.type == "string") {
      if (filter.action == "asc" || currentFilter.action == "none") {
        data = tableValues.sort((a, b) => {
          const valuesA = (a.item as any)[filter.key];
          const valuesB = (b.item as any)[filter.key];
          return (valuesA as string).localeCompare(valuesB as string);
        });
      } else {
        data = tableValues.sort((a, b) => {
          const valuesA = (a.item as any)[filter.key];
          const valuesB = (b.item as any)[filter.key];
          return (valuesB as string).localeCompare(valuesA as string);
        });
      }
    }

    if (filter.type == "number") {
      if (filter.action == "asc" || currentFilter.action == "none") {
        data = tableValues.sort((a, b) => {
          const valuesA = (a.item as any)[filter.key];
          const valuesB = (b.item as any)[filter.key];
          return (valuesA as number) - (valuesB as number);
        });
      } else {
        data = tableValues.sort((a, b) => {
          const valuesA = (a.item as any)[filter.key];
          const valuesB = (b.item as any)[filter.key];
          return (valuesB as number) - (valuesA as number);
        });
      }
    }
    if (data != undefined) {
      return data;
    } else {
      return [];
    }
  };

  return (
    <table>
      <thead>
        <tr key="header">
          <td key="checkbox-all">
            <input
              checked={allChecked}
              onChange={(e) => {
                tableValues.forEach((t, i) => {
                  t.checked = e.target.checked;
                });
                setTableValues([...tableValues]);
                setAllChecked(e.target.checked);
              }}
              type="checkbox"
            />
          </td>
          <td>Value</td>
          {keys.map((k, i) => {
            return (
              <td key={i}>
                {k}
                <button
                  onClick={(e) => {
                    console.log(currentFilter.action);
                    const filter = {
                      type: typeof (tableValues[0].item as any)[k],
                      action:
                        currentFilter.action == "none" ||
                        currentFilter.action == "desc"
                          ? "asc"
                          : "desc",
                      key: k,
                    };
                    console.log(filter);
                    const newData = sortBy(filter);
                    setCurrentFilter(filter);
                    setTableValues(newData);
                  }}
                  className="px-2 shadow-md mx-2"
                >
                  ^
                </button>
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {tableValues.map((d, i) => {
          return (
            <tr key={i}>
              <td key="checkbox-input">
                <input
                  checked={d.checked}
                  onChange={(e) => {
                    console.log(e.target.checked);
                    if (
                      !e.target.checked == true &&
                      !e.target.checked == allChecked
                    ) {
                      setAllChecked(false);
                      tableValues[i].checked = e.target.checked;
                      setTableValues([...tableValues]);
                    } else {
                      tableValues[i].checked = e.target.checked;
                      setTableValues([...tableValues]);
                    }
                  }}
                  type="checkbox"
                />
              </td>
              <td key="texfield-input">
                <input
                  className="border-2 max-w-[45px]"
                  type="text"
                  onChange={(e) => {
                    let value = 0;
                    try {
                      value = Number(e.target.value);
                    } catch (error) {
                      value = 0;
                    }
                    tableValues[i].value = value;
                    setTableValues([...tableValues]);
                  }}
                  maxLength={3}
                  value={d.value}
                />
              </td>
              {keys.map((k, i) => {
                return <td key={i}>{(d.item as any)[k]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
