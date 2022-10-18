import React from "react";
import { headers } from "../../utils/default";

interface HeaderProps {
  title: string;
  href: string;
  key?: string | number;
}

export class Header extends React.Component {
  static Simple({ headerInfo = headers }: { headerInfo?: HeaderProps[] }) {
    return (
      // display itens styling
      <div className="flex flex-wrap w-screen">
        {headerInfo.map((h, i) => (
          <Header.Item key={i} title={h.title} href={h.href} />
        ))}
      </div>
    );
  }

  static Item({ title, href, key }: HeaderProps) {
    return (
      <a key={key} href={href}>
        {/* button styling */}
        <div className="p-2 font-semibold hover:bg-gray-100">{title}</div>
      </a>
    );
  }
}
