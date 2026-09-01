import { StatementData, Transaction } from '../types/abTypes';
import { addDays, differenceInDays, format, subDays } from 'date-fns';

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

export function generateAbTransactions(data: StatementData): Transaction[] {
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

  type RawStep = { isDeposit: boolean; amount: number; isFee: boolean; isInterestMarker?: boolean };
  const steps: RawStep[] = [];
  let balance = startBal;

  const feeSlotsCount = Math.max(1, Math.floor(N * 0.04));
  const feeIndices = new Set<number>();
  while (feeIndices.size < feeSlotsCount) {
    feeIndices.add(randInt(0, N - 2));
  }

  for (let i = 0; i < N; i++) {
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
  
  // Inject Interest/Tax markers for June 30 and Dec 31
  const interestDates: Date[] = [];
  for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
    const june30 = new Date(y, 5, 30);
    const dec31 = new Date(y, 11, 31);
    if (june30 >= start && june30 <= end) interestDates.push(june30);
    if (dec31 >= start && dec31 <= end) interestDates.push(dec31);
  }
  for (const d of interestDates) {
    indexed.push({
      step: { isDeposit: true, amount: 0, isFee: false, isInterestMarker: true },
      date: d
    });
  }

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

  let idCounter = 1;

  for (let i = 0; i < indexed.length; i++) {
    const { step, date } = indexed[i];
    let { isDeposit, amount, isFee, isInterestMarker } = step;

    if (isInterestMarker) {
       const interestAmount = Math.max(0, Math.round(runningBalance * 0.01 * 100) / 100);
       if (interestAmount > 0) {
           runningBalance = Math.round((runningBalance + interestAmount) * 100) / 100;
           transactions.push({
             id: (idCounter++).toString(),
             postDate: format(date, 'ddMMMyy').toUpperCase(),
             valueDate: '',
             refNo: '',
             particulars: 'Profit',
             debit: 0,
             credit: interestAmount,
             balance: runningBalance,
           });
           
           // Deduct 10% Tax on Profit
           const taxAmount = Math.round(interestAmount * 0.10 * 100) / 100;
           runningBalance = Math.round((runningBalance - taxAmount) * 100) / 100;
           transactions.push({
             id: (idCounter++).toString(),
             postDate: format(date, 'ddMMMyy').toUpperCase(),
             valueDate: '',
             refNo: '',
             particulars: 'Tax on Profit',
             debit: taxAmount,
             credit: 0,
             balance: runningBalance,
           });
       }
       continue;
    }

    let particulars = '';
    let refNo = '';
    let valueDate = '';

    const isWeekend = date.getDay() === 5 || date.getDay() === 6;
    let createNpsbFee = false;
    let npsbRef = '';

    if (isFee) {
      const typeRoll = Math.random();
      if (typeRoll < 0.3) {
        particulars = 'VAT';
        amount = 24.00;
      } else if (typeRoll < 0.6) {
        particulars = 'AMF AMF & VAT';
        amount = 115.00;
      } else {
        particulars = 'Cheque Book Fee, Cheque Book Fee';
        amount = 160.00;
      }
    } else if (isDeposit) {
      const typeRoll = Math.random();
      if (typeRoll < 0.3 && !isWeekend) {
        particulars = 'CSH';
      } else if (typeRoll < 0.5 && !isWeekend) {
        particulars = 'CSH, self';
      } else if (typeRoll < 0.6 && !isWeekend) {
        particulars = 'CSH islp';
      } else if (typeRoll < 0.75) {
        particulars = `MFS Deposit, Transfer Money, 01${randInt(7, 9)}${randInt(10000000, 99999999)} to\n${data.accountNo}`;
      } else if (typeRoll < 0.9) {
        refNo = randomEftRef();
        particulars = `Inward EFT Received, PIF-TT No ${randInt(100000000000, 999999999999)} of\nStandard, FOREIGEN REMIT~AC-2075071, BK-\nSTANDARD BANK ~BR-REMITTANCE`;
      } else {
        particulars = 'TFR, ' + randomTfrRef().replace('TFR, ', '') + '\nIssuer Fund transasfer, BRBL ONLINE BANKING, BD';
      }
    } else {
      const typeRoll = Math.random();
      if (typeRoll < 0.7) {
        refNo = randomNpsbRef();
        particulars = `NPSB Transfer, ftr, FTR from ${data.accountNo}`;
        createNpsbFee = true;
        npsbRef = refNo;
        if (Math.random() < 0.3) {
          valueDate = format(subDays(date, 2), 'ddMMMyy').toUpperCase();
        }
      } else {
        particulars = `CHQ ${randInt(1000000, 9999999)}`;
      }
    }

    runningBalance = isDeposit
      ? Math.round((runningBalance + amount) * 100) / 100
      : Math.round((runningBalance - amount) * 100) / 100;

    transactions.push({
      id: (idCounter++).toString(),
      postDate: format(date, 'ddMMMyy').toUpperCase(),
      valueDate: valueDate,
      refNo: refNo,
      particulars: particulars,
      debit: isDeposit ? 0 : amount,
      credit: isDeposit ? amount : 0,
      balance: runningBalance,
    });

    if (createNpsbFee) {
        runningBalance = Math.round((runningBalance - 10.00) * 100) / 100;
        transactions.push({
          id: (idCounter++).toString(),
          postDate: format(date, 'ddMMMyy').toUpperCase(),
          valueDate: valueDate,
          refNo: '',
          particulars: `FEE ${npsbRef}, NPSB Charge VAT IBFT`,
          debit: 10.00,
          credit: 0,
          balance: runningBalance,
        });
    }
  }

  // ── Phase 5: Exact Final Balance Matching ─────────────────────────────────
  let currentError = Math.round((endBal - runningBalance) * 100) / 100;
  
  if (Math.abs(currentError) > 0.01) {
    const adjustableIndices = [];
    for (let i = 1; i < transactions.length; i++) {
       const p = transactions[i].particulars;
       if (!p.includes('VAT') && !p.includes('AMF') && !p.includes('Cheque Book Fee') && !p.includes('FEE') && !p.includes('Profit')) {
           adjustableIndices.push(i);
       }
    }
    
    adjustableIndices.sort(() => Math.random() - 0.5);

    for (const idx of adjustableIndices) {
       if (Math.abs(currentError) < 0.01) break;
       
       const tx = transactions[idx];
       let adjustmentToBalance = 0;
       let newCredit = tx.credit;
       let newDebit = tx.debit;
       
       if (tx.credit > 0) {
          const maxIncrease = maxTx - tx.credit;
          const maxDecrease = tx.credit - minTx;
          
          if (currentError > 0) {
             adjustmentToBalance = Math.min(currentError, maxIncrease);
          } else {
             adjustmentToBalance = -Math.min(Math.abs(currentError), maxDecrease);
          }
          newCredit = Math.round((tx.credit + adjustmentToBalance) * 100) / 100;
       } else if (tx.debit > 0) {
          const maxIncrease = maxTx - tx.debit;
          const maxDecrease = tx.debit - minTx;
          
          let debitAdjustment = 0;
          if (currentError < 0) {
             debitAdjustment = Math.min(Math.abs(currentError), maxIncrease);
             adjustmentToBalance = -debitAdjustment;
          } else {
             debitAdjustment = -Math.min(currentError, maxDecrease);
             adjustmentToBalance = -debitAdjustment;
          }
          newDebit = Math.round((tx.debit + debitAdjustment) * 100) / 100;
       }
       
       if (adjustmentToBalance !== 0) {
          let valid = true;
          let tempBal = transactions[0].balance;
          
          for (let k = 1; k < transactions.length; k++) {
             const t = transactions[k];
             const c = (k === idx) ? newCredit : t.credit;
             const d = (k === idx) ? newDebit : t.debit;
             tempBal = Math.round((tempBal + c - d) * 100) / 100;
             if (tempBal < lowestBal || tempBal > highestBal) {
                valid = false;
                break;
             }
          }
          
          if (valid) {
             tx.credit = newCredit;
             tx.debit = newDebit;
             currentError = Math.round((currentError - adjustmentToBalance) * 100) / 100;
          }
       }
    }
    
    let finalBal = transactions[0].balance;
    for (let i = 1; i < transactions.length; i++) {
       const tx = transactions[i];
       finalBal = Math.round((finalBal + tx.credit - tx.debit) * 100) / 100;
       tx.balance = finalBal;
    }
  }

  return transactions;
}
