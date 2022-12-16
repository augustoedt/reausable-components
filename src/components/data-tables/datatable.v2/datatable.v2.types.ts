export type ProposalResult = {
  id: string;
  userId: string;
  email: string;
  draft: boolean;
  items: ProposalRItem[];
};

export type ProposalRItem = {
  price: number;
  codigo: string;
  quantidade: number;
};

export type QuotationRItems = {
  nome: string;
  codigo: string;
  quantidade: number;
  ultimoPreco: number;
};

export type Winner = {
  price: number;
  codigo: string;
  userId: string;
  userEmail: string;
  quantidade: number;
};

export type QuotationResult = {
  id: string;
  draft: boolean;
  name: string;
  items: QuotationRItems[];
  proposals: ProposalResult[];
};

export type SelectionAproval = {
  selected: boolean;
  user: {
    userId: string;
    userEmail: string;
  };
};
