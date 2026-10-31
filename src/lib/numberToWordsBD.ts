const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(n: number, useHyphen = true): string {
  if (n === 0) return '';
  let str = '';
  if (n >= 100) {
    str += ONES[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      str += ONES[n];
    } else {
      const t = TENS[Math.floor(n / 10)];
      const o = ONES[n % 10];
      if (o) {
        str += useHyphen ? `${t}-${o}` : `${t} ${o}`;
      } else {
        str += t;
      }
    }
  }
  return str.trim();
}

/**
 * Convert a number to Bangladeshi words (Crore, Lac, Thousand, Hundred)
 * @param amount Number e.g. 2784526.19
 * @param options Configuration for hyphens and naming
 */
export function numberToWordsBD(
  amount: number,
  options: { useHyphen?: boolean; lacSpelling?: 'Lac' | 'Lakh' } = {}
): { integerWords: string; paisaWords: string; fullAmount: string } {
  const { useHyphen = true, lacSpelling = 'Lac' } = options;

  const totalCents = Math.round(Math.abs(amount) * 100);
  let integerPart = Math.floor(totalCents / 100);
  const paisa = totalCents % 100;

  if (integerPart === 0 && paisa === 0) {
    return { integerWords: 'Zero', paisaWords: '', fullAmount: 'Zero' };
  }

  let crore = 0;
  let lac = 0;
  let thousand = 0;
  let hundred = 0;

  // 1 Crore = 10,000,000
  if (integerPart >= 10000000) {
    crore = Math.floor(integerPart / 10000000);
    integerPart %= 10000000;
  }
  // 1 Lac = 100,000
  if (integerPart >= 100000) {
    lac = Math.floor(integerPart / 100000);
    integerPart %= 100000;
  }
  // 1 Thousand = 1,000
  if (integerPart >= 1000) {
    thousand = Math.floor(integerPart / 1000);
    integerPart %= 1000;
  }
  hundred = integerPart;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(`${convertLessThanThousand(crore, useHyphen)} Crore`);
  }
  if (lac > 0) {
    parts.push(`${convertLessThanThousand(lac, useHyphen)} ${lacSpelling}`);
  }
  if (thousand > 0) {
    parts.push(`${convertLessThanThousand(thousand, useHyphen)} Thousand`);
  }
  if (hundred > 0) {
    parts.push(convertLessThanThousand(hundred, useHyphen));
  }

  const integerWords = parts.join(' ').trim();
  const paisaWords = paisa > 0 ? convertLessThanThousand(paisa, useHyphen) : '';

  return { integerWords, paisaWords, fullAmount: integerWords };
}

/** Formats for Standard Islami Bank */
export function formatStandardWords(amount: number): string {
  const { integerWords, paisaWords } = numberToWordsBD(amount, { useHyphen: true, lacSpelling: 'Lac' });
  if (paisaWords) {
    return `BDT ${integerWords} and ${paisaWords} Paisa only.`;
  }
  return `BDT ${integerWords} only.`;
}

/** Formats for AB Bank */
export function formatAbWords(amount: number): string {
  const { integerWords, paisaWords } = numberToWordsBD(amount, { useHyphen: false, lacSpelling: 'Lac' });
  if (paisaWords) {
    return `${integerWords} Taka And ${paisaWords} Paisa Only`;
  }
  return `${integerWords} Taka Only`;
}

/** Formats for Janata Bank */
export function formatJanataWords(amount: number): string {
  const { integerWords, paisaWords } = numberToWordsBD(amount, { useHyphen: true, lacSpelling: 'Lac' });
  if (paisaWords) {
    return `Taka ${integerWords} And Paisa ${paisaWords}`;
  }
  return `Taka ${integerWords}`;
}
