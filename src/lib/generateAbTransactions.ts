import { StatementData, Transaction } from '../types/abTypes';
import { addDays, differenceInDays, format, subDays } from 'date-fns';
import { RANDOM_NAMES } from './constants';

const FEE_DESCRIPTIONS = [
  'Cheque Book Fee, Cheque Book Fee',
  'VAT',
  'AMF AMF & VAT',
];

const REF_CHARS = '0123456789';

function randomNpsbRef(): string {
  let result = 'IB66666';
  for (let i = 0; i < 9; i++) {
    result += REF_CHARS.charAt(Math.floor(Math.random() * REF_CHARS.length));
  }
  return result;
}

function randomTfrRef(): string {
  // Format: TFR, 518781 00600009 614711518780 052322, IBFT
  let part1 = '';
  for (let i=0; i<6; i++) part1 += REF_CHARS.charAt(Math.floor(Math.random() * REF_CHARS.length));
  let part2 = '00600009';
  let part3 = '61' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  let part4 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `TFR, ${part1} ${part2} ${part3} ${part4}, IBFT`;
}

function randomEftRef(): string {
  // Format: B21026207D087679
  let result = 'B';
  const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 15; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

/** Round to a "nice" whole number typical of real bank transfers */
function roundToNice(amount: number): number {
  if (amount >= 100000) return Math.round(amount / 10000) * 10000;
  if (amount >= 10000)  return Math.round(amount / 1000)  * 1000;
  if (amount >= 1000)   return Math.round(amount / 500)   * 500;
  return Math.round(amount / 100) * 100;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function generateAbTransactions(data: StatementData): Transaction[] {
  const start    = new Date(data.startDate);
  const end      = new Date(data.endDate);
  const diffDays = Math.max(1, differenceInDays(end, start));

  const N           = data.numberOfTransactions;
  const minTx       = Math.max(1, data.minTxAmount);
  const maxTx       = data.maxTxAmount;
  const lowestBal   = Math.max(0, data.lowestBalance);
  const highestBal  = data.highestBalance;
  const startBal    = data.startBalance;
  const endBal      = data.endBalance;

  type RawStep = { isDeposit: boolean; amount: number; isFee: boolean };
  const steps: RawStep[] = [];
  let balance = startBal;

  const feeSlotsCount = Math.max(1, Math.floor(N * 0.08));
  const feeIndices = new Set<number>();
  while (feeIndices.size < feeSlotsCount) {
    feeIndices.add(randInt(1, N - 1));
  }

  for (let i = 1; i < N; i++) { // Start from 1 because index 0 is "Credit Balance"
    const isFee = feeIndices.has(i);

    if (isFee) {
      const feeAmount = Math.round((randInt(10, 160) + Math.random()) * 100) / 100;
      const safeAmount = Math.min(feeAmount, Math.max(0.01, balance - lowestBal));
      balance = Math.round((balance - safeAmount) * 100) / 100;
      steps.push({ isDeposit: false, amount: safeAmount, isFee: true });
      continue;
    }

    const canDeposit  = balance < highestBal;
    const canWithdraw = balance - minTx >= lowestBal;

    const progress = i / (N - 1);
    const idealBalance = startBal + (endBal - startBal) * progress;
    
    let depositChance = 0.5;
    if (balance < idealBalance) {
      depositChance = 0.75;
    } else {
      depositChance = 0.25;
    }

    let isDeposit: boolean;
    if (!canDeposit && !canWithdraw) {
      isDeposit = true;
    } else if (!canWithdraw) {
      isDeposit = true;
    } else if (!canDeposit) {
      isDeposit = false;
    } else {
      isDeposit = Math.random() < depositChance;
    }

    let maxAllowed: number;
    let minAllowed: number;
    
    const forceSmallWithdrawal = !isDeposit && Math.random() < 0.25;
    
    let amount: number;
    if (isDeposit) {
      maxAllowed = Math.min(maxTx, highestBal - balance);
      const catchUp = Math.max(0, idealBalance - balance);
      minAllowed = Math.max(minTx, Math.min(catchUp * 0.4, maxAllowed * 0.5));
      if (minAllowed > maxAllowed) minAllowed = maxAllowed;
      const rawAmount = minAllowed + Math.random() * (maxAllowed - minAllowed);
      amount = Math.max(minTx, roundToNice(rawAmount));
    } else {
      maxAllowed = Math.min(maxTx, balance - lowestBal);
      if (forceSmallWithdrawal) {
        maxAllowed = Math.min(maxAllowed, 20000);
        const catchUp = Math.max(0, balance - idealBalance);
        minAllowed = Math.max(minTx, Math.min(catchUp * 0.4, maxAllowed * 0.5));
        if (minAllowed > maxAllowed) minAllowed = maxAllowed;
        const rawAmount = minAllowed + Math.random() * (maxAllowed - minAllowed);
        amount = Math.max(500, Math.floor(rawAmount / 500) * 500);
      } else {
        const catchUp = Math.max(0, balance - idealBalance);
        minAllowed = Math.max(minTx, Math.min(catchUp * 0.4, maxAllowed * 0.5));
        if (minAllowed > maxAllowed) minAllowed = maxAllowed;
        const rawAmount = minAllowed + Math.random() * (maxAllowed - minAllowed);
        amount = Math.max(minTx, roundToNice(rawAmount));
      }
    }

    balance = isDeposit
      ? Math.round((balance + amount) * 100) / 100
      : Math.round((balance - amount) * 100) / 100;

    steps.push({ isDeposit, amount, isFee: false });
  }

  const rawDates = steps.map((step) => {
    let d = addDays(start, randInt(0, diffDays - 1));
    let attempts = 0;
    if ((step.amount > 20000 || step.isDeposit) && !step.isFee) {
      while ((d.getDay() === 5 || d.getDay() === 6) && attempts < 20) {
        d = addDays(start, randInt(0, diffDays - 1));
        attempts++;
      }
    }
    return d;
  });
  
  const indexed = steps.map((step, i) => ({ step, date: rawDates[i] }));
  indexed.sort((a, b) => a.date.getTime() - b.date.getTime());

  const transactions: Transaction[] = [];
  let runningBalance = startBal;

  // 1st Transaction: Credit Balance (Start Balance)
  transactions.push({
    id: '0',
    postDate: format(start, 'ddMMMyy').toUpperCase(),
    valueDate: '',
    refNo: '',
    particulars: 'Credit Balance',
    debit: 0,
    credit: 0,
    balance: startBal,
  });

  for (let i = 0; i < indexed.length; i++) {
    const { step, date } = indexed[i];
    let { isDeposit, amount, isFee } = step;

    let particulars = '';
    let refNo = '';
    let valueDate = '';

    const isWeekend = date.getDay() === 5 || date.getDay() === 6;

    if (isFee) {
      const typeRoll = Math.random();
      if (typeRoll < 0.3) {
        particulars = 'VAT';
        amount = 24.00;
      } else if (typeRoll < 0.5) {
        particulars = 'AMF AMF & VAT';
        amount = 115.00;
      } else if (typeRoll < 0.7) {
        particulars = 'Cheque Book Fee, Cheque Book Fee';
        amount = 160.00;
      } else {
        refNo = randomNpsbRef();
        particulars = `FEE ${refNo}, NPSB Charge VAT IBFT`;
        amount = 10.00;
      }
    } else if (isDeposit) {
      const typeRoll = Math.random();
      if (typeRoll < 0.15) {
        particulars = 'Profit';
        amount = Math.round(amount / 100) + Math.random() * 50;
      } else if (typeRoll < 0.3 && !isWeekend) {
        particulars = 'CSH';
      } else if (typeRoll < 0.6) {
        refNo = `TM${randInt(100000, 999999)}${randInt(100000, 999999)}C`;
        particulars = `MFS Deposit, Transfer Money, 01${randInt(7, 9)}${randInt(10000000, 99999999)} to\n${data.accountNo}`;
        valueDate = format(subDays(date, 2), 'ddMMMyy').toUpperCase();
      } else if (typeRoll < 0.8) {
        refNo = randomEftRef();
        particulars = 'Inward EFT Received, PIF-TT No 100526022104 of\nStandard, FOREIGEN REMIT~AC-2075071, BK-\nSTANDARD BANK ~BR-REMITTANCE';
      } else {
        refNo = randomEftRef();
        particulars = 'Inward EFT Received, PIF-TT No 100526023314 of Cash\nInce, FOREIGEN REMIT~AC-2075071, BK-STANDARD\nBANK ~BR-REMITTANCE';
      }
    } else {
      const typeRoll = Math.random();
      if (typeRoll < 0.25 && !isWeekend) {
        particulars = 'CSH, self';
      } else if (typeRoll < 0.6) {
        refNo = randomNpsbRef();
        particulars = `NPSB Transfer, ftr, FTR from ${data.accountNo}`;
        if (Math.random() < 0.3) {
          valueDate = format(subDays(date, 2), 'ddMMMyy').toUpperCase();
        }
      } else if (typeRoll < 0.8) {
        particulars = 'TFR, ' + randomTfrRef().replace('TFR, ', '') + '\nIssuer Fund transasfer, DUTCH-BANGLA BANK LTD.,\nBD';
        if (Math.random() < 0.5) valueDate = format(subDays(date, 1), 'ddMMMyy').toUpperCase();
      } else {
        particulars = `CHQ ${randInt(1000000, 9999999)}`;
      }
    }

    if (particulars === 'Profit') {
      amount = Math.round(amount * 100) / 100;
    }

    runningBalance = isDeposit
      ? Math.round((runningBalance + amount) * 100) / 100
      : Math.round((runningBalance - amount) * 100) / 100;

    transactions.push({
      id: (i + 1).toString(),
      postDate: format(date, 'ddMMMyy').toUpperCase(),
      valueDate: valueDate,
      refNo: refNo,
      particulars: particulars,
      debit: isDeposit ? 0 : amount,
      credit: isDeposit ? amount : 0,
      balance: runningBalance,
    });
  }

  return transactions;
}
