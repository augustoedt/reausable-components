import { useState } from "react";

interface Props<T> {
  onAction?(value: HeaderAction): void;
  data: T[];
}

interface HeaderAction {
  action: string;
  type:
    | "number"
    | "string"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";
  key: string;
}

export const EditableCell = <T extends unknown>({
  data,
  onAction,
}: Props<T>) => {
  const keys = Object.keys(data[0] as any);
  const [dataValues, setDataValues] = useState({
    filter: {
      key: "none",
      action: "asc",
      type: "number",
    },
    data: data,
  });
  const [values, setValues] = useState({
    allChecked: false,
    checkList: (dataValues.data as any[]).map((d) => false),
    items: (dataValues.data as T[]).map((d, i) => {
      return {
        quantity: 0,
        item: d,
      };
    }),
  });

  const sortBy = (value: HeaderAction) => {
    let data;
    if (value.type == "string") {
      if (value.action == "asc") {
        data = dataValues.data.sort((a, b) => {
          const valuesA = (a as any)[value.key];
          const valuesB = (b as any)[value.key];
          return (valuesA as string).localeCompare(valuesB as string);
        });
      } else {
        data = dataValues.data.sort((a, b) => {
          const valuesA = (a as any)[value.key];
          const valuesB = (b as any)[value.key];
          return (valuesB as string).localeCompare(valuesA as string);
        });
      }
    }

    if (value.type == "number") {
      if (value.action == "asc") {
        data = dataValues.data.sort((a, b) => {
          const valuesA = (a as any)[value.key];
          const valuesB = (b as any)[value.key];
          return (valuesA as number) - (valuesB as number);
        });
      } else {
        data = dataValues.data.sort((a, b) => {
          const valuesA = (a as any)[value.key];
          const valuesB = (b as any)[value.key];
          return (valuesB as number) - (valuesA as number);
        });
      }
    }

    return data;
  };

  return (
    <table>
      <thead>
        <tr key="head-checkbox" className="border-2">
          <td className="px-2">
            <input
              type="checkbox"
              checked={values.allChecked}
              onChange={(e) => {
                values.checkList.forEach((c, i) => {
                  if (values.allChecked == true) {
                    values.checkList[i] = false;
                  } else {
                    values.checkList[i] = true;
                  }
                });
                setValues({
                  ...values,
                  checkList: values.checkList,
                  allChecked: e.target.checked,
                });
              }}
            ></input>
          </td>
          <td key="head-textbox" className="px-2">
            Quantidade
          </td>
          {keys.map((k, i) => {
            return (
              <td key={i} className="px-2">
                {k}
                <button
                  onClick={(e) => {
                    const action = {
                      type: typeof (dataValues.data[0] as any)[k],
                      key: k,
                      action:
                        dataValues.filter.action == "asc" ? "desc" : "asc",
                    };
                    console.log(action);
                    const data = sortBy(action);
                    setDataValues({
                      filter: action,
                      data: data as T[],
                    });
                    const ncheckedlist = dataValues.data.map((vl, ind) => {
                      const index = values.items.findIndex((v) => v.item == vl);
                      return values.checkList[index];
                    });
                    const quantities = dataValues.data.map((vl, ind) => {
                      const index = values.items.findIndex((v) => v.item == vl);
                      return values.items[index].quantity;
                    });

                    setValues({
                      ...values,
                      checkList: ncheckedlist,
                      items: quantities.map((q, i) => {
                        return {
                          quantity: q,
                          item: dataValues.data[i],
                        };
                      }),
                    });
                  }}
                  className={`${
                    k == dataValues.filter.key ? "text-red-500" : ""
                  } px-2 mx-2 my-1 shadow-md text-center ${
                    dataValues.filter.key == k &&
                    dataValues.filter.action == "asc"
                      ? "rotate-180"
                      : ""
                  }`}
                >
                  ^
                </button>
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataValues.data.map((d, i) => {
          return (
            <tr className="border-2" key={i}>
              <td key="checkbox" className="text-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (values.allChecked) {
                      values.checkList[i] = false;
                      setValues({
                        ...values,
                        allChecked: false,
                        checkList: values.checkList,
                      });
                    } else {
                      values.checkList[i] = !values.checkList[i];
                      setValues({
                        ...values,
                        checkList: values.checkList,
                      });
                    }
                    console.log(values);
                  }}
                  checked={values.checkList[i]}
                />
              </td>
              <td key="textbox" className="text-center">
                <input
                  className={`${
                    !values.checkList[i]
                      ? "border-gray-200 text-gray-300"
                      : values.items[i].quantity > 0 &&
                        values.items[i].quantity != NaN
                      ? "border-black"
                      : "border-red-400"
                  } border-2 max-w-[50px] text-center rounded-sm`}
                  maxLength={4}
                  type="text"
                  onChange={(e) => {
                    let quantity = 0;
                    try {
                      quantity = Number(e.target.value);
                    } catch (error) {
                      quantity = 0;
                    }
                    values.items[i] = {
                      quantity: quantity,
                      item: (data as any[])[i],
                    };
                    setValues({
                      ...values,
                    });
                    console.log(values);
                  }}
                  value={(() => {
                    const q = values.items.find((it) => it.item == d);
                    return q?.quantity;
                  })()}
                  disabled={!values.checkList[i]}
                />
              </td>
              {keys.map((k, i) => {
                return (
                  <td key={i} className="text-center">
                    {(d as any)[k]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
