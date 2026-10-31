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
  let maxTx       = data.maxTxAmount;
  let lowestBal   = Math.max(0, data.lowestBalance);
  let highestBal  = data.highestBalance;
  const startBal    = data.startBalance;
  const endBal      = data.endBalance;

  // Auto-correct impossible constraints
  const requiredHighest = Math.max(startBal, endBal);
  if (highestBal < requiredHighest) highestBal = requiredHighest + (requiredHighest * 0.2);
  
  const requiredLowest = Math.min(startBal, endBal);
  if (lowestBal > requiredLowest) lowestBal = Math.max(0, requiredLowest - (requiredLowest * 0.2));
  
  const requiredMaxTx = Math.abs(endBal - startBal) / Math.max(1, N * 0.2);
  if (maxTx < requiredMaxTx) maxTx = requiredMaxTx * 1.5;

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

  // ── Phase 5: Exact Final Balance Matching ─────────────────────────────────
  let currentError = Math.round((endBal - runningBalance) * 100) / 100;
  
  if (Math.abs(currentError) > 0.01) {
    const adjustableIndices = [];
    for (let i = 0; i < transactions.length; i++) {
       const p = transactions[i].particulars;
       if (!p.includes('VAT') && !p.includes('EXCISE DUTY') && !p.includes('FEE') && !p.includes('INT.PD')) {
           adjustableIndices.push(i);
       }
    }
    
    adjustableIndices.sort(() => Math.random() - 0.5);

    for (const idx of adjustableIndices) {
       if (Math.abs(currentError) < 0.01) break;
       
       const tx = transactions[idx];
       let adjustmentToBalance = 0;
       let newDeposit = tx.deposit;
       let newWithdraw = tx.withdraw;
       
       if (tx.deposit > 0) {
          const maxIncrease = maxTx - tx.deposit;
          const maxDecrease = tx.deposit - minTx;
          
          if (currentError > 0) {
             adjustmentToBalance = Math.min(currentError, maxIncrease);
          } else {
             adjustmentToBalance = -Math.min(Math.abs(currentError), maxDecrease);
          }
          newDeposit = Math.round((tx.deposit + adjustmentToBalance) * 100) / 100;
       } else if (tx.withdraw > 0) {
          const maxIncrease = maxTx - tx.withdraw;
          const maxDecrease = tx.withdraw - minTx;
          
          let withdrawAdjustment = 0;
          if (currentError < 0) {
             withdrawAdjustment = Math.min(Math.abs(currentError), maxIncrease);
             adjustmentToBalance = -withdrawAdjustment;
          } else {
             withdrawAdjustment = -Math.min(currentError, maxDecrease);
             adjustmentToBalance = -withdrawAdjustment;
          }
          newWithdraw = Math.round((tx.withdraw + withdrawAdjustment) * 100) / 100;
       }
       
       if (adjustmentToBalance !== 0) {
          let valid = true;
          let tempBal = startBal;
          
          for (let k = 0; k < transactions.length; k++) {
             const t = transactions[k];
             const c = (k === idx) ? newDeposit : t.deposit;
             const d = (k === idx) ? newWithdraw : t.withdraw;
             tempBal = Math.round((tempBal + c - d) * 100) / 100;
             if (tempBal < lowestBal || tempBal > highestBal) {
                valid = false;
                break;
             }
          }
          
          if (valid) {
             tx.deposit = newDeposit;
             tx.withdraw = newWithdraw;
             currentError = Math.round((currentError - adjustmentToBalance) * 100) / 100;
          }
       }
    }
    
    let finalBal = startBal;
    for (let i = 0; i < transactions.length; i++) {
       const tx = transactions[i];
       finalBal = Math.round((finalBal + tx.deposit - tx.withdraw) * 100) / 100;
       tx.balance = finalBal;
    }

    const residual = Math.round((endBal - finalBal) * 100) / 100;
    if (Math.abs(residual) >= 0.01 && transactions.length > 0) {
      const lastTx = transactions[transactions.length - 1];
      if (lastTx.deposit > 0) {
        lastTx.deposit = Math.round((lastTx.deposit + residual) * 100) / 100;
      } else {
        lastTx.withdraw = Math.round((lastTx.withdraw - residual) * 100) / 100;
      }
      let b = startBal;
      for (const tx of transactions) {
        b = Math.round((b + tx.deposit - tx.withdraw) * 100) / 100;
        tx.balance = b;
      }
    }
  }

  return transactions;
}
