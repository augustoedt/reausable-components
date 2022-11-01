import {
  ChangeEvent,
  Fragment,
  MouseEvent,
  SyntheticEvent,
  useEffect,
  useState
} from "react";
import { IProduct } from "../../types/data.types";

interface TableHeader {
  name: string;
  header: string;
  editable?: boolean;
}

const headers: TableHeader[] = [
  {
    name: "quantidade",
    header: "Quantidade",
    editable: true,
  },
  {
    name: "codigo",
    header: "Codigo",
  },
  {
    name: "nome",
    header: "Nome",
  },
  {
    name: "marca",
    header: "Marca",
  },
  {
    name: "vendas",
    header: "Vendas",
  },
  {
    name: "saida",
    header: "Saida",
  },
  {
    name: "estoque",
    header: "Estoque",
  },
  {
    name: "custo_unid",
    header: "Custo/Unid",
  },
];

interface TableValues {
  rowData: IProduct;
  id: string | undefined;
}

const initialRowData: IProduct = {
  quantidade: 0,
  codigo: "",
  nome: "",
  marca: "",
  vendas: 0,
  saida: 0,
  estoque: 0,
  custo_unid: 0,
};

export function ToggleEditableCells({ dataset }: { dataset: IProduct[] }) {
  const [data, setData] = useState(dataset);
  const [values, setValues] = useState<TableValues>({
    rowData: initialRowData,
    id: undefined,
  });

  const handleEditClick = async (
    event: MouseEvent<HTMLButtonElement>,
    item: IProduct
  ) => {
    event.preventDefault();

    setValues({
      rowData: item,
      id: item.codigo,
    });

    // console.log(`codigo-item: ${item.codigo}`);
    // console.log(`codigo-values: ${values.id}`);
  };

  const handleEditFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log(values);
    const fieldName = event.target.getAttribute("name")!;
    const fieldValue = event.target.value;

    const newFormData = { ...values.rowData };
    if (fieldName != null) {
      (newFormData as any)[fieldName] = fieldValue;
      setValues({
        ...values,
        rowData: newFormData,
      });
    }
  };

  const handleEditFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    submit();
  };

  const submit = () => {
    const editedItem = {
      ...values.rowData,
    };
    const newData = [...data];

    const index = data.findIndex(
      (item) => item.codigo === values.rowData.codigo
    );

    newData[index] = editedItem as IProduct;
    setValues({ rowData: initialRowData, id: undefined });
    setData(newData);
  };

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        return;
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <form onSubmit={handleEditFormSubmit}>
      <table>
        <thead>
          <tr>
            <th>Ações</th>
            {headers.map((h, i) => (
              <th className="px-2 py-1" key={i}>
                {h.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <Fragment>
              {values.id === d.codigo ? (
                <EditableRow
                  editFormData={values.rowData}
                  handleEditFormChange={handleEditFormChange}
                  // handleCancelClick={handleCancelClick}
                />
              ) : (
                <ReadOnlyRow handleEditClick={handleEditClick} item={d} />
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </form>
  );
}

function ReadOnlyRow({
  item,
  handleEditClick,
}: {
  item: IProduct;
  handleEditClick(e: MouseEvent<HTMLButtonElement>, item: IProduct): void;
}) {
  return (
    <tr key={item.codigo} className="text-center border-1 border-gray-700">
      <td>
        <button name={item.codigo} onClick={(e) => handleEditClick(e, item)}>
          Edit
        </button>
      </td>
      {headers.map((h, i) => {
        return <td key={i}>{(item as any)[h.name]}</td>;
      })}
    </tr>
  );
}

function EditableRow({
  editFormData,
  handleEditFormChange,
}: {
  editFormData: IProduct;
  handleEditFormChange(e: ChangeEvent<HTMLInputElement>): void;
}) {
  return (
    <tr
      key={`editable-${editFormData.codigo}`}
      className="text-center border-1 border-gray-700"
    >
      <td>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </td>
      {headers.map((h, i) => {
        if (h.editable) {
          return (
            <td key={i}>
              <input
                className="border-2 border-black w-20"
                value={(editFormData as any)[h.name]}
                name={h.name}
                onChange={handleEditFormChange}
                type="number"
              />
            </td>
          );
        } else {
          return <td className="max-w-md">{(editFormData as any)[h.name]}</td>;
        }
      })}
    </tr>
  );
}
