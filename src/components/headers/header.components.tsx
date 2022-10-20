import React from "react";
import { headers } from "../../utils/default";

interface HeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  href: string;
}

export class Header {
  static Simple({ headerInfo = headers }) {
    return (
      // display itens styling
      <div className="flex flex-wrap w-screen">
        {headerInfo.map((h, i) => (
          <Header.Item
            key={`${i}-${h.title.toLowerCase()}`}
            title={h.title}
            href={h.href}
          />
        ))}
      </div>
    );
  }

  static Item({ title, href }: HeaderProps) {
    return (
      <a href={href}>
        <div className="p-2 font-semibold hover:bg-gray-100">{title}</div>
      </a>
    );
  }
}
