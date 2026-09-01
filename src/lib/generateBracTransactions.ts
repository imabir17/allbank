import { StatementData, Transaction } from '../types/bracTypes';
import { addDays, differenceInDays, format } from 'date-fns';
import { RANDOM_NAMES, RANDOM_AREAS } from './constants';

const getDepositParticulars = (isWeekend: boolean, hasFraction: boolean) => {
  const options = [];
  if (!isWeekend && !hasFraction) {
    options.push(
      'CASH DEPOSIT',
      'AB/CDEP/CD'
    );
  }
  if (!isWeekend) {
    options.push(
      'IB/FTR/JAPAN EDUC/NO REMARKS',
      'RTGS/IC/PUBALI /SHIBU MA/RIJIK',
      `RTGS/IC/UCBL /${pick(RANDOM_AREAS)} /${pick(RANDOM_NAMES).toUpperCase()}`,
      'AGB/FTPR/126715/CD'
    );
  }
  // Online/NPS/FTR can happen on weekends
  options.push(
    'IB/BKASH/01711330837/NO REMARKS',
    `IB/NPS/MUTUAL TRU/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}`,
    `IB/FTR/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/A`,
    `IB/FTR/AYAN FABRI/${pick(RANDOM_NAMES).toUpperCase()}`,
    `IB/NPS/MUTUAL TRU/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/SERVICE AIR`
  );
  return pick(options);
};

const getWithdrawalParticulars = (amount: number, isWeekend: boolean, hasFraction: boolean) => {
  const options = [];
  if (!isWeekend) {
    options.push(
      'IB/BKASH/01711330837/A',
      'CRTR/MTB DHAKA BD /',
      `IB/NPS/PRIME/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/PAYMENT`,
      `IB/NPS/PRIME/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/TUTION`,
      `PRCR/M/S ${pick(RANDOM_AREAS)} STORE ${pick(RANDOM_AREAS).substring(0, 6)} B/1056515310001`,
      'IB/BKASH/01309255852/TASNIM PAYMENT',
      'PRCR/EASY FASHION DHAKA BD /1056515310001'
    );
  } else {
    // Weekend safe digital withdrawals
    options.push(
      'IB/BKASH/01711330837/A',
      `IB/NPS/PRIME/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/PAYMENT`,
      `IB/NPS/PRIME/${pick(RANDOM_NAMES).toUpperCase().substring(0, 10)}/TUTION`,
      'IB/BKASH/01309255852/TASNIM PAYMENT'
    );
  }
  if (amount <= 20000 && amount % 500 === 0 && !hasFraction) {
    options.push(
      'CWDR/RIFLES SQUARE ATM DHAKA BD /1056515310001',
      'CWDR/DUTCH-BANGLA BANK PLC. DHAK/1056515310001',
      `CWDR/${pick(RANDOM_AREAS)} SME UNIT ATM ${pick(RANDOM_AREAS).substring(0, 6)}/1056515310001`
    );
  }
  return pick(options);
};

const getFeeParticulars = (date: Date) => {
  const currentYear = date.getFullYear();
  const prevMonth = new Date(date);
  prevMonth.setMonth(date.getMonth() - 1);
  const m1 = format(new Date(currentYear, prevMonth.getMonth(), 1), 'dd-MM-yyyy');
  const m2 = format(new Date(currentYear, prevMonth.getMonth() + 1, 0), 'dd-MM-yyyy');
  
  return pick([
    `HF YRLY AC MNT FEE-${currentYear}`,
    `VAT ON HF YRLY AC MNT FEE-${currentYear}`,
    `1056515310001:INT.PD:${m1} TO ${m2}`,
  ]);
};

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

export function generateTransactions(data: StatementData): Transaction[] {
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

  // ── Phase 1: Generate N-1 FREE transactions ───────────────────────────────
  // These are a natural random walk within guardrails.
  // The Nth transaction will ALWAYS be the exact mathematical bridge.

  type RawStep = { isDeposit: boolean; amount: number; isFee: boolean };
  const steps: RawStep[] = [];
  let balance = startBal;

  // Decide which indices will be fee transactions (small decimal amounts)
  const feeSlotsCount = Math.max(1, Math.floor(N * 0.06));
  const feeIndices = new Set<number>();
  while (feeIndices.size < feeSlotsCount) {
    // Avoid making the very last transaction (index N-1) a fee
    feeIndices.add(randInt(0, N - 2));
  }

  for (let i = 0; i < N - 1; i++) {
    const isFee = feeIndices.has(i);

    if (isFee) {
      // Fees are always small withdrawals with decimal amounts
      const feeAmount = Math.round((randInt(100, 2500) + Math.random()) * 100) / 100;
      const safeAmount = Math.min(feeAmount, Math.max(0.01, balance - lowestBal));
      balance = Math.round((balance - safeAmount) * 100) / 100;
      steps.push({ isDeposit: false, amount: safeAmount, isFee: true });
      continue;
    }

    // Determine which direction is possible
    const canDeposit  = balance < highestBal;
    const canWithdraw = balance - minTx >= lowestBal;

    // Smart targeting: calculate ideal balance at this step
    const progress = i / (N - 1);
    const idealBalance = startBal + (endBal - startBal) * progress;
    
    let depositChance = 0.5;
    if (balance < idealBalance) {
      depositChance = 0.75; // Bias to grow
    } else {
      depositChance = 0.25; // Bias to shrink
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
      // Force occasional small withdrawals to allow ATMs
      const forceSmallWithdrawal = Math.random() < 0.25;
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

  // ── Phase 2: Removed forced balancing transaction! The end balance will naturally float.

  // ── Phase 3: Assign sorted dates ─────────────────────────────────────────
  const rawDates = steps.map((step) => {
    let d = addDays(start, randInt(0, diffDays - 1));
    let attempts = 0;
    // Physical transactions (large withdrawals or standard deposits) shouldn't happen on weekends.
    if ((step.amount > 20000 || step.isDeposit) && !step.isFee) {
      while ((d.getDay() === 5 || d.getDay() === 6) && attempts < 20) {
        d = addDays(start, randInt(0, diffDays - 1));
        attempts++;
      }
    }
    return d;
  });
  const indexed  = steps.map((step, i) => ({ step, date: rawDates[i] }));
  indexed.sort((a, b) => a.date.getTime() - b.date.getTime());

  // ── Phase 4: Build Transaction rows with verified running balance ─────────
  const transactions: Transaction[] = [];
  let runningBalance = startBal;
  let hasExciseDutyThisYear = -1;
  let hasJuneFeeThisYear = -1;
  let hasDecFeeThisYear = -1;

  for (let i = 0; i < indexed.length; i++) {
    const { step, date } = indexed[i];

    let particulars: string;
    const isWeekend = date.getDay() === 5 || date.getDay() === 6;
    
    if (step.isFee) {
      const currentYear = date.getFullYear();
      const m = date.getMonth();
      if (m === 11) {
        if (hasExciseDutyThisYear !== currentYear) {
          particulars = `EXCISE DUTY ${currentYear} :1056515310001`;
          hasExciseDutyThisYear = currentYear;
        } else if (hasDecFeeThisYear !== currentYear) {
          particulars = getFeeParticulars(date);
          hasDecFeeThisYear = currentYear;
        } else {
          particulars = `HF YRLY AC MNT FEE-${currentYear}`;
        }
      } else if (m === 5) {
        if (hasJuneFeeThisYear !== currentYear) {
          particulars = getFeeParticulars(date);
          hasJuneFeeThisYear = currentYear;
        } else {
          particulars = `HF YRLY AC MNT FEE-${currentYear}`;
        }
      } else {
        particulars = `VAT ON HF YRLY AC MNT FEE-${currentYear}`;
      }
    } else if (step.isDeposit) {
      particulars = getDepositParticulars(isWeekend, false);
    } else {
      particulars = getWithdrawalParticulars(step.amount, isWeekend, false);
    }

    let chqNo = '';
    const isDigitalOrCash = particulars.includes('ATM') || particulars.includes('NPS') || particulars.includes('BKASH') || particulars.includes('RTGS') || particulars.includes('CASH DEPOSIT');
    if (!step.isFee && !isDigitalOrCash) {
      chqNo = Math.random() > 0.90 ? randInt(1000000, 9999999).toString() : '';
    }
    
    let amount = step.amount;
    if (step.isFee) {
      if (particulars.includes('EXCISE DUTY')) amount = 500.00;
      else if (particulars.includes('VAT')) amount = 115.00;
      else amount = 345.00;
    } else if (step.isDeposit && particulars.includes('INT.PD')) {
      amount = Math.round(amount) + 0.45;
    }

    runningBalance = step.isDeposit
      ? Math.round((runningBalance + amount) * 100) / 100
      : Math.round((runningBalance - amount) * 100) / 100;

    transactions.push({
      id: i.toString(),
      date: format(date, 'dd MMM yyyy').toUpperCase().replace(/\./g, ''),
      particulars,
      chqNo,
      withdraw: step.isDeposit ? 0 : amount,
      deposit:  step.isDeposit ? amount : 0,
      balance:  runningBalance,
    });
  }

  return transactions;
}
