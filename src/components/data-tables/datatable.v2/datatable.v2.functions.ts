import { QuotationResult, Winner } from "./datatable.v2.types";

export function getWinnerUsers(report: QuotationResult) {
  const winners: Winner[] = [];
  report.items.map((v, i) => {
    let userEmail: string = "";
    let codigo: string = "";
    let price: number = Infinity;
    let userId: string = "";
    let quantidade: number = 0;
    for (let ix = 0; ix < report.proposals.length; ix++) {
      const user = report.proposals[ix];
      const item = user.items[i];
      if (item.price < price && item.price > 0) {
        userEmail = user.email;
        userId = user.id;
        price = item.price;
        quantidade = item.quantidade;
      }
      codigo = item.codigo;
    }
    winners.push({
      userEmail,
      codigo,
      price,
      userId,
      quantidade,
    });
  });

  return winners;
}
