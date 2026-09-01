export interface Transaction {
  id: string;
  date: string;
  particulars: string;
  chqNo: string;
  withdraw: number;
  deposit: number;
  balance: number;
}

export interface StatementData {
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  branchName: string;
  branchAddressLine1: string;
  branchAddressLine2: string;
  branchAddressLine3: string;
  branchSwift: string;
  branchEmail: string;
  branchWebsite: string;
  branchPhone: string;
  refNo: string;
  customerId: string;
  accountNo: string;
  accountType: string;
  currency: string;
  issueDate: string;
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
