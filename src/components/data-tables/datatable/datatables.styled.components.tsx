import { ReactElement } from "react";
import tw, { css } from "twin.macro";

type ColProps = {
  align?: keyof typeof alignStyle;
  children?: ReactElement | ReactElement[];
};

export const ToolButton = tw.button`shadow self-center`;
export const ToolsContainer = tw.div`flex gap-2 place-content-center`;
export const EditorInput = tw.input`p-1 text-sm border bg-gray-100 border-gray-300 rounded-md w-28`;
export const alignStyle = {
  center: tw`text-center`,
  left: tw`text-left`,
  right: tw`text-right`,
};

export const paginationStyle = {
  pageButton: ({ isCurrent }: { isCurrent?: any }) => [
    tw`shadow py-1 px-2`,
    isCurrent && tw`font-bold`,
  ],
  dotButton: [tw`px-2`],
  container: [tw`py-1 flex mx-1`],
};

export const ColumnContainer = ({ align = "center", children }: ColProps) => (
  <td css={tw`border overflow-scroll overflow-ellipsis`}>
    <div
      css={[
        tw`py-1`,
        css`
          display: -webkit-box;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          -webkit-line-clamp: 1;
        `,
        alignStyle[align],
      ]}
    >
      {children}
    </div>
  </td>
);
