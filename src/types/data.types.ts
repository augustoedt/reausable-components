export interface IProduct {
  nome: string;
  quantidade?: number;
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

  constructor(p: IProduct) {
    this.nome = p.nome;
    this.quantidade = p.quantidade || 0;
    this.codigo = p.codigo;
    this.marca = p.marca;
    this.vendas = p.vendas;
    this.saida = p.saida;
    this.estoque = p.estoque;
    this.custo_unid = p.custo_unid;
  }

  inovuaDataSource = () => {
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
  };
}
