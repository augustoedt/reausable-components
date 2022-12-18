export interface IProduct {
  nome: string;
  quantidade: number;
  codigo: string;
  marca: string;
  vendas: number;
  saida: number;
  estoque: number;
  custo_unid: number;
}

export interface Product extends IProduct {}

export class Product implements IProduct {
  nome: string;
  quantidade: number;
  codigo: string;
  marca: string;
  vendas: number;
  saida: number;
  estoque: number;
  custo_unid: number;

  constructor(p: Omit<IProduct, "quantidade">) {
    this.nome = p.nome;
    this.quantidade = 0;
    this.codigo = p.codigo;
    this.marca = p.marca;
    this.vendas = p.vendas;
    this.saida = p.saida;
    this.estoque = p.estoque;
    this.custo_unid = p.custo_unid;
  }

  inovuaDataSource(): IProduct {
    return {
      nome: this.nome,
      quantidade: this.quantidade,
      codigo: this.codigo,
      marca: this.marca,
      vendas: this.vendas,
      saida: this.saida,
      estoque: this.estoque,
      custo_unid: this.custo_unid,
    };
  }
}

export type CreatedDemandItem = {
  user_id: string;
  email: string;
  codigo: string;
  description: string;
  quantity: number;
  price: number;
};

export type CreateDemand = {
  quotation_id: string;
  user_id: string;
  name: string;
  avaliable_for: string[];
  itens: CreatedDemandItem[];
};

export type UpdateDemand = {
  quotation_id?: string | undefined;
  name?: string | undefined;
  avaliable_for?: string[] | undefined;
  itens?:
    | {
        user_id: string;
        email: string;
        codigo: string;
        description: string;
        quantity: number;
        price: number;
      }[]
    | undefined;
  id: string;
};
