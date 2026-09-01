import { StatementData, Transaction } from '../types';
import { addDays, differenceInDays, format } from 'date-fns';
import { RANDOM_NAMES } from './constants';

const FEE_DESCRIPTIONS = [
  { type: 'Transfer', desc: 'Clearing Chq Return Charge' },
  { type: 'Transfer', desc: 'Clg. Chq. Return Charge' },
  { type: 'Online Charge', desc: '' },
  { type: 'Tax Amount Due', desc: '' },
];

const ATM_DESCRIPTIONS = [
  '002375440693 6011',
  '002403338930 6011',
  '002453512174 6011',
  '002488779539 6011 905001 NA',
  '002506066426 6011 905001 NA',
];



const REF_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomRef(date: Date, suffix: string = '/0888'): string {
  let result = `FT${format(date, 'yy')}`;
  for (let i = 0; i < 9; i++) {
    result += REF_CHARS.charAt(Math.floor(Math.random() * REF_CHARS.length));
  }
  return result + suffix;
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

  type RawStep = { isDeposit: boolean; amount: number; isFee: boolean; isInterestMarker?: boolean };
  const steps: RawStep[] = [];
  let balance = startBal;

  const feeSlotsCount = Math.max(1, Math.floor(N * 0.06));
  const feeIndices = new Set<number>();
  while (feeIndices.size < feeSlotsCount) {
    feeIndices.add(randInt(0, N - 2));
  }

  for (let i = 0; i < N; i++) {
    const isFee = feeIndices.has(i);

    if (isFee) {
      const feeAmount = Math.round((randInt(50, 150) + Math.random()) * 100) / 100;
      const safeAmount = Math.min(feeAmount, Math.max(0.01, balance - lowestBal));
      balance = Math.round((balance - safeAmount) * 100) / 100;
      steps.push({ isDeposit: false, amount: safeAmount, isFee: true });
      continue;
    }

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
    
    // Force frequent small withdrawals for ATM limits and POS
    const forceAtmWithdrawal = !isDeposit && Math.random() < 0.40; // 40% chance for ATM
    const forcePosWithdrawal = !isDeposit && !forceAtmWithdrawal && Math.random() < 0.50;
    
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
      if (forceAtmWithdrawal) {
        maxAllowed = Math.min(maxAllowed, 20000);
        const catchUp = Math.max(0, balance - idealBalance);
        minAllowed = Math.max(minTx, Math.min(catchUp * 0.4, maxAllowed * 0.5));
        if (minAllowed > maxAllowed) minAllowed = maxAllowed;
        const rawAmount = minAllowed + Math.random() * (maxAllowed - minAllowed);
        // Force to multiple of 500 for ATM realism
        amount = Math.max(500, Math.floor(rawAmount / 500) * 500);
      } else if (forcePosWithdrawal) {
        maxAllowed = Math.min(maxAllowed, 12000); // POS usually small/medium
        const rawAmount = minTx + Math.random() * (maxAllowed - minTx);
        // Realistic POS amounts (e.g. 350, 1245, 8790) without rounding to hundreds
        amount = Math.max(minTx, Math.round(rawAmount));
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
  let lastTransactionType = '';
  let lastDescription = '';
  
  let lastCreditInterestDate = start;
  let hasExciseDutyThisYear = -1;
  let hasSmsFeeThisYear = -1;
  let hasJuneFeeThisYear = -1;
  let hasDecFeeThisYear = -1;

  for (let i = 0; i < indexed.length; i++) {
    const { step, date } = indexed[i];
    let { isDeposit, amount, isFee, isInterestMarker } = step;

    if (isInterestMarker) {
       // Calculate interest: 2% p.a. => ~1% half-yearly applied on current running balance
       const interestAmount = Math.max(0, Math.round(runningBalance * 0.01 * 100) / 100);
       if (interestAmount > 0) {
           runningBalance = Math.round((runningBalance + interestAmount) * 100) / 100;
           transactions.push({
             id: `int-${i}`,
             date: format(date, 'dd MMM yy').toUpperCase().replace(/\./g, ''),
             transactionType: 'Transfer',
             description: 'Credit Interest',
             referenceNo: randomRef(date, '/0888'),
             chequeNo: '',
             debit: 0,
             credit: interestAmount,
             balance: runningBalance,
           });
           
           // Deduct 10% AIT
           const aitAmount = Math.round(interestAmount * 0.10 * 100) / 100;
           runningBalance = Math.round((runningBalance - aitAmount) * 100) / 100;
           transactions.push({
             id: `ait-${i}`,
             date: format(date, 'dd MMM yy').toUpperCase().replace(/\./g, ''),
             transactionType: 'Transfer',
             description: 'AIT on Interest',
             referenceNo: randomRef(date, '/0888'),
             chequeNo: '',
             debit: aitAmount,
             credit: 0,
             balance: runningBalance,
           });
       }
       continue;
    }

    let transactionType = '';
    let description = '';
    
    // Attempt to pick a non-repeating description up to 5 times
    for (let attempts = 0; attempts < 5; attempts++) {
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      
      if (isFee) {
        const currentYear = date.getFullYear();
        const m = date.getMonth();
        if (m === 5) {
          if (hasJuneFeeThisYear !== currentYear) {
            const fee = pick([{ type: 'Ac Maint Fee-VAT', desc: '' }, { type: 'ATM Card Maint Fees', desc: '' }]);
            transactionType = fee.type;
            description = fee.desc;
            hasJuneFeeThisYear = currentYear;
          } else {
            const fee = pick([{ type: 'Online Charge', desc: '' }]);
            transactionType = fee.type;
            description = fee.desc;
          }
        } else if (m === 11) {
          if (hasExciseDutyThisYear !== currentYear) {
            transactionType = 'Excise Duty';
            description = `Excise Duty-${currentYear}`;
            hasExciseDutyThisYear = currentYear;
          } else if (hasSmsFeeThisYear !== currentYear) {
            transactionType = 'SMS Charges';
            description = '';
            hasSmsFeeThisYear = currentYear;
          } else if (hasDecFeeThisYear !== currentYear) {
            const fee = pick([{ type: 'Ac Maint Fee-VAT', desc: '' }, { type: 'ATM Card Maint Fees', desc: '' }]);
            transactionType = fee.type;
            description = fee.desc;
            hasDecFeeThisYear = currentYear;
          } else {
            const fee = pick([{ type: 'Online Charge', desc: '' }]);
            transactionType = fee.type;
            description = fee.desc;
          }
        } else {
          const fee = pick(FEE_DESCRIPTIONS);
          transactionType = fee.type;
          description = fee.desc;
        }
      } else if (isDeposit) {
        
        const typeRoll = Math.random();
          if (!isWeekend) {
            if (typeRoll < 0.45) {
              transactionType = 'Cash Deposit';
              description = 'SELF';
            } else if (typeRoll < 0.65) {
              transactionType = 'Clearing Inward';
              description = pick(RANDOM_NAMES);
            } else if (typeRoll < 0.90) {
              transactionType = 'BEFTN Inward';
              description = pick(RANDOM_NAMES);
            } else if (typeRoll < 0.98) {
              transactionType = 'NPSB Inward';
              description = pick(RANDOM_NAMES);
            } else {
              transactionType = 'Transfer';
              description = pick(RANDOM_NAMES);
            }
          } else {
            // Weekends
            if (typeRoll < 0.85) {
              transactionType = 'NPSB Inward';
              description = pick(RANDOM_NAMES);
            } else {
              transactionType = 'Transfer';
              description = 'Internet Banking Fund Transfer';
            }
          }
        
      } else {
        const allowedTypes = [];
        
        if (!isWeekend) {
          allowedTypes.push('Cash Withdrawal', 'Cash Withdrawal'); 
          allowedTypes.push('Clearing Outward');
        }
        
        // Massive boost for ATM if it matches the amount criteria
        if (amount <= 20000 && amount % 500 === 0) {
            allowedTypes.push('ATM Transaction', 'ATM Transaction', 'ATM Transaction', 'ATM Transaction', 'ATM Transaction');
        }
        
        if (amount <= 50000) {
            allowedTypes.push('POS Transaction', 'POS Transaction');
            // Give POS extreme priority if it's a small odd amount
            if (amount <= 15000 && amount % 100 !== 0) {
                allowedTypes.push('POS Transaction', 'POS Transaction', 'POS Transaction', 'POS Transaction', 'POS Transaction');
            }
        }
        
        // Lower weight for other electronic transfers to ensure they are less frequent
        if (amount <= 500000 && !isWeekend && Math.random() > 0.5) allowedTypes.push('BEFTN Outward');
        if (amount <= 200000 && Math.random() > 0.5) allowedTypes.push('NPSB Outward');
        
        // Very rarely add Transfer unless absolutely nothing else is available
        if (Math.random() > 0.9 || allowedTypes.length === 0) {
            allowedTypes.push('Transfer');
        }
        
        transactionType = pick(allowedTypes);

        if (transactionType === 'ATM Transaction') {
          description = pick(ATM_DESCRIPTIONS);
        } else if (transactionType === 'POS Transaction') {
          description = pick(['Agora', 'Shwapno', 'Meena Bazar', 'Bata', 'Lotto', 'Aarong', 'Steakout', 'Easy Fashion', 'Abesh Hotel']);
        } else if (transactionType === 'Cash Withdrawal') {
          description = 'SELF';
        } else if (['BEFTN Outward', 'NPSB Outward', 'Clearing Outward'].includes(transactionType)) {
          description = pick(RANDOM_NAMES);
        } else {
          const TRANSFER_DESCRIPTIONS = [
            'Fund Transfer to DBBL',
            'Supplier Payment',
            'Contractor Payment',
            'Material Purchase',
            'Fund Transfer to CBL',
          ];
          if (amount <= 9000) {
            TRANSFER_DESCRIPTIONS.push('Utility Bill Payment', 'Internet Bill', 'Mobile Recharge');
          }
          description = pick(TRANSFER_DESCRIPTIONS);
        }
      }
      
      // If it doesn't match the last one exactly, break loop
      if (description !== lastDescription || transactionType !== lastTransactionType) {
        break;
      }
    }
    
    if (isFee) {
        if (transactionType === 'Excise Duty') amount = 500.00;
        else if (transactionType === 'ATM Card Maint Fees') amount = 345.00;
        else if (transactionType === 'Ac Maint Fee-VAT') amount = 115.00;
        else if (transactionType === 'SMS Charges') amount = 115.00;
        else amount = 57.50;
    }

    runningBalance = isDeposit
      ? Math.round((runningBalance + amount) * 100) / 100
      : Math.round((runningBalance - amount) * 100) / 100;

    lastTransactionType = transactionType;
    lastDescription = description;

    // Only generate cheque numbers for valid physical transfer types, not electronic networks
    let chqNo = '';
    const validChequeDescriptions = ['Contractor Payment', 'Supplier Payment', 'Material Purchase', 'Shop Rent By-Fast Computer'];
    if (transactionType === 'Cash Withdrawal') {
      chqNo = randInt(1000000, 9999999).toString();
    } else if (transactionType === 'Transfer' && validChequeDescriptions.includes(description)) {
      chqNo = Math.random() > 0.85 ? randInt(1000000, 9999999).toString() : '';
    }
    
    // Determine appropriate suffix based on transaction type
    let suffix = '/0888';
    if (['Cash Deposit', 'ATM Transaction', 'Cash Withdrawal'].includes(transactionType) || isFee) {
      suffix = '/0900';
    }
    
    const currentRef = randomRef(date, suffix);

    transactions.push({
      id: i.toString(),
      date: format(date, 'dd MMM yy').toUpperCase().replace(/\./g, ''),
      transactionType,
      description,
      referenceNo: currentRef,
      chequeNo: chqNo,
      debit: isDeposit ? 0 : amount,
      credit: isDeposit ? amount : 0,
      balance: runningBalance,
    });
  }

  // ── Phase 4: Exact Final Balance Matching ─────────────────────────────────
  let currentError = Math.round((endBal - runningBalance) * 100) / 100;
  
  if (Math.abs(currentError) > 0.01) {
    const adjustableIndices = [];
    for (let i = 0; i < transactions.length; i++) {
       const type = transactions[i].transactionType;
       // Avoid touching fees, interest, tax, ATM, POS
       if (['Cash Deposit', 'Clearing Inward', 'BEFTN Inward', 'Transfer', 'Cash Withdrawal', 'Clearing Outward', 'BEFTN Outward', 'NPSB Inward', 'NPSB Outward'].includes(type)) {
           adjustableIndices.push(i);
       }
    }
    
    // Shuffle indices to distribute adjustments randomly
    adjustableIndices.sort(() => Math.random() - 0.5);

    for (const idx of adjustableIndices) {
       if (Math.abs(currentError) < 0.01) break;
       
       const tx = transactions[idx];
       let adjustmentToBalance = 0; // Positive means we add to balance
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
          const maxIncrease = maxTx - tx.debit; // withdraw more -> decrease balance
          const maxDecrease = tx.debit - minTx; // withdraw less -> increase balance
          
          let debitAdjustment = 0; // Positive means withdraw more
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
          // Verify this adjustment doesn't break min/max balance rules for subsequent transactions
          let valid = true;
          let tempBal = startBal;
          
          for (let k = 0; k < transactions.length; k++) {
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
    
    // Final recalculation of balances to apply the approved adjustments
    let finalBal = startBal;
    for (const tx of transactions) {
       finalBal = Math.round((finalBal + tx.credit - tx.debit) * 100) / 100;
       tx.balance = finalBal;
    }
  }

  return transactions;
}
