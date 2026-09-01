export interface Transaction {
  id: string;
  date: string;
  transactionType: string;
  description: string;
  referenceNo: string;
  chequeNo: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface StatementData {
  accountId: string;
  customerId: string;
  accountTitle: string;
  legacyId: string;
  address: string;
  currency: string;
  openingDate: string;
  accountType: string;
  branchName: string;
  routingNo: string;
  startDate: string;
  endDate: string;
  generationDate: string;
  accountStatus: string;
  startBalance: number;
  endBalance: number;
  numberOfTransactions: number;
  highestBalance: number;
  lowestBalance: number;
  maxTxAmount: number;
  minTxAmount: number;
}
