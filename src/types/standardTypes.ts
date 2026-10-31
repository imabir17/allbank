export interface StatementData {
  // Customer details
  accountTitle: string;
  addressLine1: string;
  addressLine2: string;
  contactNo: string;
  accountStatus: string;

  // Account details
  accountNo: string;
  openDate: string;
  accountType: string;
  customerId: string;
  currency: string;

  // Branch details
  branchName: string;
  branchAddressLine1: string;
  branchAddressLine2: string;
  branchPhone: string;
  branchFax: string;
  branchEmail: string;
  printingDate: string;

  // Card / Cheque details for realistic remarks
  cardNumber: string;
  chequePrefix: string;

  // Statement dates & generation
  startDate: string;
  endDate: string;
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
  sl: number | string;
  date: string;
  transCode: string;
  debit: number;
  credit: number;
  balance: number;
  remarks: string;
}
