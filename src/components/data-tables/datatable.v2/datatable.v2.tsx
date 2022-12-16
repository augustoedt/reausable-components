import { useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import { getWinnerUsers } from "./datatable.v2.functions";
import { ProposalRItem, QuotationResult, Winner } from "./datatable.v2.types";

export default function Datatable2({
  report,
  onUpdateResult,
}: {
  report: QuotationResult;
  onUpdateResult(item: any): void;
}) {
  const winners: Winner[] = useMemo(() => {
    return getWinnerUsers(report);
  }, [report.id]);
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);
  const users = report.proposals.map((p) => {
    return {
      id: p.id,
      email: p.email,
    };
  });

  const handleHide = (id: string) => {
    if (hiddenUsers.includes(id)) {
      setHiddenUsers([...hiddenUsers.filter((h) => h != id)]);
      console.log(hiddenUsers)
    } else {
      hiddenUsers.push(id);
      setHiddenUsers([...hiddenUsers]);
    }
  };
  return (
    <>
      <select
        value={hiddenUsers}
        multiple={true}
        onChange={(e) =>console.log(e.currentTarget.value)}
      >
        {users.map((u, i) => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
      </select>
      <Tables>
        <THead>
          <tr>
            <HColumn colSpan={2}>Seleção</HColumn>
            <HColumn colSpan={4}>Resultado</HColumn>
            {report.proposals.map((p) => {
              const colorStyle = p.draft
                ? HColumnColorStyle.red
                : HColumnColorStyle.green;
              const hide = hiddenUsers.includes(p.userId);
              return (
                <th
                  css={[HColumnStyle1, HColumnStyle2, colorStyle]}
                  colSpan={2}
                  key={p.id}
                >
                  <span>{p.email}</span>
                </th>
              );
            })}
          </tr>
          <tr>
            <HColumn>Aprovar</HColumn>
            <HColumn>Vencedor</HColumn>
            <HColumn>Código</HColumn>
            <HColumn>Qtd</HColumn>
            <HColumn>Ult. compra</HColumn>
            <HColumn>M. valor</HColumn>

            {report.proposals.map((p, i) => {
              return (
                <UserHeader key={i} hide={hiddenUsers.includes(p.userId)} />
              );
            })}
          </tr>
        </THead>
        <tbody>
          {report.items.map((r, i) => {
            return (
              <Row key={i.toString()}>
                <SelectionColumns
                  selected={winners[i]}
                  users={users}
                  index={i}
                  onSelection={(e) => {
                    console.log(e);
                  }}
                />
                <WinnerColumns
                  winner={winners[i]}
                  lastPrice={report.items[i].ultimoPreco}
                />
                {report.proposals.map((p, ir) => {
                  return (
                    <UserColumn
                      key={ir}
                      item={p.items[i]}
                      isWinner={p.id == winners[i].userId}
                    />
                  );
                })}
              </Row>
            );
          })}
        </tbody>
      </Tables>
    </>
  );
}

function UserHeader({ hide }: { hide: boolean }) {
  return (
    <>
      <HColumn>Valor</HColumn>
      <HColumn>Qtd</HColumn>
    </>
  );
}

function WinnerColumns({
  winner,
  lastPrice,
}: {
  winner: Winner;
  lastPrice: number;
}) {
  const greater = winner.price > lastPrice;
  const style = greater ? ColumnStyle.yellow : ColumnStyle.green;
  return (
    <>
      <Column>{winner.codigo}</Column>
      <Column>{winner.quantidade}</Column>
      <Column>{lastPrice}</Column>
      <td css={style}>{winner.price}</td>
    </>
  );
}

function UserColumn({
  item,
  isWinner,
}: {
  item: ProposalRItem;
  isWinner: boolean;
}) {
  const columnStyle = isWinner ? ColumnStyle.winner : ColumnStyle.none;
  return (
    <>
      <td css={columnStyle}>{item.price}</td>
      <td css={columnStyle}>{item.quantidade}</td>
    </>
  );
}

type WinnerUser = {
  email: string;
  id: string;
};

function SelectionColumns({
  selected,
  users,
  onSelection,
}: {
  selected: Winner;
  users: WinnerUser[];
  index: number;
  onSelection(index: number): void;
}) {
  const [current, setCurrent] = useState<boolean>(false);
  const currentStyle = current
    ? ButtonStyle.optionYes
    : ButtonStyle.noSelection;
  return (
    <>
      <WColumn>
        <button css={currentStyle} onClick={() => setCurrent(!current)}>
          Sim
        </button>
      </WColumn>
      <WColumn>
        <select css={SelectorStyle} defaultValue={selected.userId}>
          {users.map((u, i) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>
      </WColumn>
    </>
  );
}

const SelectorStyle = tw`bg-gray-50 border border-gray-300 text-sm rounded-md py-2 w-28`;

const ButtonStyle = {
  noSelection: tw`px-4 py-1 my-1 text-sm font-semibold uppercase bg-gray-200 shadow-sm hover:shadow-xl hover:bg-gray-300 rounded-md`,
  optionYes: tw`px-4 py-1 my-1 text-sm font-semibold uppercase bg-green-300 shadow-sm hover:shadow-xl hover:bg-green-400 rounded-md`,
};

const ColumnStyle = {
  yellow: tw`py-2 px-6 text-center bg-yellow-200`,
  green: tw`py-2 px-6 text-center bg-green-200`,
  winner: tw`py-2 px-6 text-center bg-slate-300`,
  none: tw`py-2 px-6 text-center`,
};

const Tables = tw.table`rounded-t-lg overflow-clip`;
const THead = tw.thead`border-b border-black bg-slate-200 uppercase text-sm `;
const TBody = tw.tbody`border border-gray-200`;
const Row = tw.tr`hover:bg-gray-100 border-b-2 border-gray-200 text-sm font-semibold bg-gray-50`;
const HRow = tw.tr``;
const HColumn = tw.th`px-4 py-2`;
const HColumnStyle1 = tw`px-4 py-2 overflow-clip text-ellipsis`;
const HColumnStyle2 = { "max-width": "12em" };
const HColumnColorStyle = {
  red: tw`bg-red-400`,
  green: tw`bg-green-300`,
};
const Column = tw.td`py-2 px-6 text-center`;
const WColumn = tw.td`py-1 px-1 text-center`;
