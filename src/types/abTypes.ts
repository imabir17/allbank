export interface StatementData {
  customerName: string;
  addressLine1: string;
  addressLine2: string;
  branchName: string;
  telephone: string;
  accountType: string;
  accountNo: string;
  currency: string;
  startDate: string;
  endDate: string;
  generationDate: string;
  startBalance: number;
  endBalance: number;
  numberOfTransactions: number;
  highestBalance: number;
  lowestBalance: number;
  maxTxAmount: number;
  minTxAmount: number;
}

export interface Transaction {
  id: string;
  postDate: string;
  valueDate: string;
  refNo: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}
