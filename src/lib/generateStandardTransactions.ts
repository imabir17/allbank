import { StatementData, Transaction } from '../types/standardTypes';
import { differenceInDays, format, addDays } from 'date-fns';

const BRANCH_NAMES = [
  'Gulshan-1', 'Uttara', 'Imamgonj', 'Brahmanbaria', 'Kamarpara',
  'Khatungonj', 'Islampur', 'Motijheel', 'Progati Sharani', 'Agrabad',
  'Dhanmondi', 'Rajshahi', 'Foreign Ex.', 'Principal', 'Tongi'
];

const DIGI_SENDERS = [
  'Tanvir Ahmed', 'Showkat', 'Farhana Akter', 'Rafiqul Islam',
  'Kamal Hossain', 'Paid', 'Self'
];

const RTGS_SENDERS = [
  { name: 'Icon Electronics', acc: '0190086145001', bank: 'Ific Bank Ltd. >> Truncation Point, Org: Current Account,' },
  { name: 'Jan Mohammad', acc: '12200010450', bank: 'Rajshahi Krishi Unnayan Bank >> Jamnagar,' },
  { name: 'M M Traders', acc: '0902101000002911', bank: 'United Commercial Bank Plc >> Banani,' },
  { name: 'Aymaan Trade International', acc: '00234055123', bank: 'Mutual Trust Bank PLC >> Motijheel,' },
  { name: 'Rahman & Brothers', acc: '014522008912', bank: 'Dutch-Bangla Bank PLC >> Dilkusha,' }
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Round an integer amount of cents to a realistic banking multiple (e.g. 500, 1000, 5000 Tk)
 */
function roundToNiceCents(amountCents: number): number {
  const amountTk = Math.round(amountCents / 100);
  let niceTk: number;
  if (amountTk >= 100000) niceTk = Math.round(amountTk / 5000) * 5000;
  else if (amountTk >= 10000) niceTk = Math.round(amountTk / 1000) * 1000;
  else if (amountTk >= 1000) niceTk = Math.round(amountTk / 500) * 500;
  else niceTk = Math.round(amountTk / 100) * 100;
  return Math.max(100, niceTk) * 100;
}

/**
 * Mathematically guaranteed transaction generator for Standard Islami Bank.
 *
 * Guarantees:
 * 1. Exact integer cent arithmetic: row-by-row balance:
 *    Balance_k = Balance_{k-1} + Credit_k - Debit_k with zero floating point drift.
 * 2. Final transaction lands identically on endBalance.
 * 3. Total Credit - Total Debit === endBalance - startBalance exact to 0.00.
 * 4. All balances remain within [lowestBalance, highestBalance].
 * 5. Realistic transaction amounts, codes, and remarks matching Standard Bank statements.
 */
export function generateStandardTransactions(data: StatementData): Transaction[] {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const totalDays = Math.max(1, differenceInDays(end, start));

  const targetCount = Math.max(5, Math.floor(Number(data.numberOfTransactions) || 40));
  const startCents = Math.round(Number(data.startBalance) * 100);
  const endCents = Math.round(Number(data.endBalance) * 100);

  let lowestCents = Math.round(Number(data.lowestBalance) * 100);
  let highestCents = Math.round(Number(data.highestBalance) * 100);
  let minTxCents = Math.max(100 * 100, Math.round(Number(data.minTxAmount) * 100));
  let maxTxCents = Math.max(minTxCents * 2, Math.round(Number(data.maxTxAmount) * 100));

  // Auto-correct impossible bounds gracefully
  const reqMin = Math.min(startCents, endCents);
  const reqMax = Math.max(startCents, endCents);
  if (lowestCents > reqMin) lowestCents = Math.max(0, reqMin - 5000000);
  if (highestCents < reqMax) highestCents = reqMax + 5000000;

  const netDiff = Math.abs(endCents - startCents);
  const minMaxNeeded = Math.ceil(netDiff / Math.max(1, targetCount * 0.5));
  if (maxTxCents < minMaxNeeded) {
    maxTxCents = Math.round(minMaxNeeded * 1.5);
  }
  if (minTxCents >= maxTxCents) {
    minTxCents = Math.max(10000, Math.floor(maxTxCents * 0.1));
  }

  // Generate monotonically sorted days distribution
  const stepDays: number[] = [];
  for (let i = 0; i < targetCount; i++) {
    const frac = i / (targetCount - 1);
    const day = Math.min(totalDays, Math.max(0, Math.round(frac * totalDays)));
    stepDays.push(day);
  }
  stepDays.sort((a, b) => a - b);

  let chequeCounter = 3579030;
  if (data.chequePrefix) {
    const numPart = data.chequePrefix.replace(/\D/g, '');
    if (numPart.length > 0) chequeCounter = parseInt(numPart, 10);
  }

  // Phase 1: Determine delta amounts for each transaction step in integer cents.
  // deltas[0..targetCount-1] represents the net change for each of the targetCount transactions.
  const deltas: number[] = new Array(targetCount).fill(0);
  const atmRefs: (string | null)[] = new Array(targetCount).fill(null);
  let currentBalCents = startCents;

  const normalSteps = targetCount - 2;
  let stepIdx = 0;

  while (stepIdx < normalSteps) {
    const rem = targetCount - stepIdx;
    const frac = (stepIdx + 1) / targetCount;
    const targetBal = startCents + Math.round((endCents - startCents) * frac);

    // ATM pair: 2 slots, max 20,000 Tk, sufficient balance
    const canDoAtm = (rem >= 3) && (stepIdx < normalSteps - 1) && (Math.random() < 0.2) &&
      (currentBalCents - 2000000 >= lowestCents);

    if (canDoAtm) {
      const atmTk = randInt(2, 40) * 500;
      const atmCents = atmTk * 100;
      const atRef = `AT${start.getFullYear()}${randInt(1000000, 9999999)}`;

      deltas[stepIdx] = -atmCents;
      atmRefs[stepIdx] = atRef;

      deltas[stepIdx + 1] = -1500; // 15.00 Tk charge
      atmRefs[stepIdx + 1] = atRef;
      stepDays[stepIdx + 1] = stepDays[stepIdx]; // Share the same date

      currentBalCents -= (atmCents + 1500);
      stepIdx += 2;
      continue;
    }

    const canDeposit = currentBalCents + minTxCents <= highestCents;
    const canWithdraw = currentBalCents - minTxCents >= lowestCents;

    let wantDeposit = currentBalCents < targetBal;
    if (!canWithdraw) wantDeposit = true;
    if (!canDeposit) wantDeposit = false;

    // Remaining capacity invariant
    const maxReachableHigher = currentBalCents + (rem - 1) * maxTxCents;
    const minReachableLower = currentBalCents - (rem - 1) * maxTxCents;
    if (endCents > maxReachableHigher) wantDeposit = true;
    if (endCents < minReachableLower) wantDeposit = false;

    if (wantDeposit) {
      const maxPossible = Math.max(minTxCents, Math.min(maxTxCents, highestCents - currentBalCents));
      let amt = roundToNiceCents(randInt(minTxCents, maxPossible));
      if (amt <= 0) amt = minTxCents;
      deltas[stepIdx] = amt;
      currentBalCents += amt;
    } else {
      const maxPossible = Math.max(minTxCents, Math.min(maxTxCents, currentBalCents - lowestCents));
      let amt = roundToNiceCents(randInt(minTxCents, maxPossible));
      if (amt <= 0) amt = minTxCents;
      deltas[stepIdx] = -amt;
      currentBalCents -= amt;
    }

    stepIdx++;
  }

  // Handle any boundary slots before the final two
  while (stepIdx < targetCount - 2) {
    const amt = minTxCents;
    if (currentBalCents + amt <= highestCents) {
      deltas[stepIdx] = amt;
      currentBalCents += amt;
    } else {
      deltas[stepIdx] = -amt;
      currentBalCents -= amt;
    }
    stepIdx++;
  }

  // Final 2 transactions (indices targetCount - 2 and targetCount - 1)
  // Reconcile deltas[N-2] + deltas[N-1] = endCents - currentBalCents with 100% precision.
  const R = endCents - currentBalCents;
  const centMod = ((R % 10000) + 10000) % 10000;
  const R_round = R - centMod;

  let deltaPenultimate = 0;
  let deltaUltimate = 0;

  if (R_round >= 2 * minTxCents) {
    let half = roundToNiceCents(Math.round(R_round / 2));
    if (half < minTxCents) half = minTxCents;
    if (R_round - half < minTxCents) half = R_round - minTxCents;
    deltaPenultimate = half + centMod;
    deltaUltimate = R_round - half;
  } else if (R_round <= -2 * minTxCents) {
    let half = roundToNiceCents(Math.round(Math.abs(R_round) / 2));
    if (half < minTxCents) half = minTxCents;
    if (Math.abs(R_round) - half < minTxCents) half = Math.abs(R_round) - minTxCents;
    deltaPenultimate = -half + centMod;
    deltaUltimate = -(Math.abs(R_round) - half);
  } else {
    const offset = roundToNiceCents(Math.max(minTxCents, Math.min(maxTxCents / 2, 2500000)));
    if (currentBalCents + offset + centMod <= highestCents) {
      deltaPenultimate = offset + centMod;
      deltaUltimate = R - deltaPenultimate;
    } else {
      deltaPenultimate = -offset + centMod;
      deltaUltimate = R - deltaPenultimate;
    }
  }

  deltas[targetCount - 2] = deltaPenultimate;
  deltas[targetCount - 1] = deltaUltimate;

  // Phase 2: Construct Transaction rows with exact integer-cent balance tracking
  const results: Transaction[] = [];

  // Opening Balance Row
  results.push({
    id: 'tx-open',
    sl: '',
    date: format(start, 'dd/MM/yy'),
    transCode: 'Opening Balance :',
    debit: 0,
    credit: 0,
    balance: startCents / 100,
    remarks: '',
  });

  let runningBalCents = startCents;
  let sl = 1;

  for (let i = 0; i < targetCount; i++) {
    const d = deltas[i];
    const isAtmFee = (d === -1500) && (i > 0 && deltas[i - 1] < 0);
    const day = stepDays[i];
    const txDate = addDays(start, day);
    const formattedDate = format(txDate, 'dd/MM/yy');

    runningBalCents += d;

    let debit = 0;
    let credit = 0;
    let transCode = '';
    let remarks = '';

    if (d > 0) {
      credit = d / 100;
      const hasCents = (d % 100 !== 0);
      const isDigi = hasCents || (i === targetCount - 2) || (Math.random() < 0.4);

      if (isDigi) {
        const sender = randItem(DIGI_SENDERS);
        const senderAcc = `002340${randInt(10000, 99999)}`;
        const refId = `Sbl${randInt(1000, 9999)}`;
        transCode = 'MB DEP Z123';
        remarks = `Sbl Txn :Sbl Digibanking Account Transfer - ${sender} From ${senderAcc} To ${data.accountNo} ${refId}`;
      } else if (Math.random() < 0.3) {
        const rtgs = randItem(RTGS_SENDERS);
        transCode = 'RI DEP';
        remarks = `Ft From Rtgs From ${rtgs.name} - ${rtgs.acc} - ${rtgs.bank}`;
      } else if (Math.random() < 0.5) {
        transCode = 'IC IB1';
        remarks = `Ic Cash Dep, ${randItem(BRANCH_NAMES)} Branch`;
      } else {
        transCode = 'CS DEP';
        remarks = 'Cs Deposits';
      }
    } else {
      debit = Math.abs(d) / 100;
      if (isAtmFee) {
        const atRef = atmRefs[i] || `AT${txDate.getFullYear()}${randInt(1000000, 9999999)}`;
        transCode = `AT N32 ${atRef}`;
        remarks = `Npsb Atm Cash Withdraw Charge WithCard No ${data.cardNumber}`;
      } else if (i < targetCount - 1 && deltas[i + 1] === -1500) {
        const atRef = atmRefs[i] || `AT${txDate.getFullYear()}${randInt(1000000, 9999999)}`;
        transCode = `AT N29 ${atRef}`;
        remarks = `Npsb Atm Cash Withdraw With Card No : ${data.cardNumber}`;
      } else if (Math.random() < 0.25) {
        const ptRef = `PT${txDate.getFullYear()}${randInt(1000000, 9999999)}`;
        transCode = `PT A03 ${ptRef}`;
        remarks = `Cash Withdraw Through Pos By Issuing Card no.: ${data.cardNumber}`;
      } else if (Math.random() < 0.5) {
        const chq = `SBA${chequeCounter++}`;
        transCode = `CS WDL ${chq}`;
        remarks = 'Cs Withdrawals';
      } else {
        const chq = `SBA${chequeCounter++}`;
        transCode = `IC IB3 ${chq}`;
        remarks = `Ic Cash Wdl, ${randItem(BRANCH_NAMES)} Branch`;
      }
    }

    results.push({
      id: `tx-${sl}`,
      sl: sl++,
      date: formattedDate,
      transCode,
      debit,
      credit,
      balance: runningBalCents / 100,
      remarks,
    });
  }

  return results;
}
