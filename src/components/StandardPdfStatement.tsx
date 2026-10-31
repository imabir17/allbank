import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StatementData, Transaction } from '../types/standardTypes';
import { SBL_LOGO_BASE64, SBL_ONLINE_BADGE_BASE64 } from '../lib/standardAssets';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 6.8,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 25,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  // Top Header Area
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  logoImage: {
    width: 180,
    height: 28,
    objectFit: 'contain',
  },
  onlineBadgeImage: {
    width: 95,
    height: 26,
    marginLeft: 35,
    objectFit: 'contain',
  },
  pageNumberText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5,
    textAlign: 'right',
    marginBottom: 2,
  },
  branchBox: {
    width: 207,
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  branchTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8,
    textAlign: 'center',
    marginBottom: 2,
  },
  branchLine: {
    fontSize: 6.6,
    textAlign: 'center',
    lineHeight: 1.15,
  },
  branchPrintingDate: {
    fontSize: 6.6,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    lineHeight: 1.15,
  },
  // Statement Period
  periodText: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    marginTop: 6,
    marginBottom: 6,
  },
  // Customer & Account Box (Page 1)
  custBox: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    paddingVertical: 5,
    paddingHorizontal: 6,
    flexDirection: 'row',
    marginBottom: 6,
  },
  custColLeft: {
    width: '49%',
  },
  custColRight: {
    width: '51%',
  },
  custRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
    fontSize: 6.8,
  },
  custLabel: {
    width: 60,
    fontFamily: 'Helvetica',
  },
  custValue: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
  },
  // Table Container
  tableContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    minHeight: 18,
    alignItems: 'stretch',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    alignItems: 'stretch',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  // Columns
  colSl: {
    width: 23,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: 1.5,
  },
  colDate: {
    width: 49,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: 1.5,
  },
  colTransCode: {
    width: 98,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    paddingLeft: 3,
    paddingRight: 2,
    paddingVertical: 1.5,
  },
  colDebit: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
    paddingVertical: 1.5,
  },
  colCredit: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
    paddingVertical: 1.5,
  },
  colBalance: {
    width: 82,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
    paddingVertical: 1.5,
  },
  colRemarks: {
    width: 163,
    justifyContent: 'center',
    paddingLeft: 3,
    paddingRight: 3,
    paddingVertical: 1.5,
  },
  cellText: {
    fontSize: 6.8,
    lineHeight: 1.12,
  },
  remarksText: {
    fontSize: 6.8,
    lineHeight: 1.12,
    textAlign: 'right',
  },
  // Column Headers (all centered)
  headerColSl: {
    width: 23,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColDate: {
    width: 49,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColTransCode: {
    width: 98,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColDebit: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColCredit: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColBalance: {
    width: 82,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerColRemarks: {
    width: 163,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 6.8,
    textAlign: 'center',
  },
  // Summary Row
  summaryRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderStyle: 'solid',
    minHeight: 18,
    alignItems: 'stretch',
  },
  summaryLabelCol: {
    width: 170, // 23 + 49 + 98
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  summaryDebitCol: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
    paddingVertical: 2,
  },
  summaryCreditCol: {
    width: 65,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3,
    paddingVertical: 2,
  },
  summaryBalCol: {
    width: 82,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    paddingVertical: 2,
  },
  summaryRemarksCol: {
    width: 163,
    paddingVertical: 2,
  },
  // Footer Enclosed Box
  footerBox: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    marginTop: 5,
  },
  footerSection1: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
  },
  footerDesc: {
    fontSize: 5.9,
    lineHeight: 1.25,
  },
  footerSection2: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerThanks: {
    fontSize: 7.2,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  footerSection3: {
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  footerNotice: {
    fontSize: 5.7,
    lineHeight: 1.25,
  },
});

// ---- Row height estimation (Helvetica metrics, 1/1000 em) ----
const FONT_SIZE = 6.8;
const LINE_H = FONT_SIZE * 1.12;
const CELL_PAD_V = 4;
// Uniform row height like the official statement (fits up to 3 lines of remarks)
const MIN_ROW_H = 27;
const MAX_EXTRA = 2;
const CUST_LINE_H = 9;
// usable vertical space for rows (A4 = 841.89pt, minus header/table-header/bottom margin)
const PAGE_FIRST_AVAIL = 600;
const PAGE_OTHER_AVAIL = 676;
const FOOTER_RESERVE = 88;

function charW(c: string): number {
  if (c === ' ') return 278;
  if (/[0-9]/.test(c)) return 556;
  if (/[il.,:;'|!]/.test(c)) return 240;
  if (/[fjrt\-\/()]/.test(c)) return 320;
  if (/[mw]/.test(c)) return 833;
  if (/[MW]/.test(c)) return 900;
  if (/[A-Z]/.test(c)) return 690;
  return 540;
}

function countLines(text: string, widthPt: number): number {
  if (!text) return 1;
  const maxW = (widthPt / FONT_SIZE) * 1000;
  let lines = 1;
  let cur = 0;
  for (const word of text.split(' ')) {
    const w = [...word].reduce((s, c) => s + charW(c), 0);
    const add = cur === 0 ? w : w + 278;
    if (cur + add > maxW && cur > 0) {
      lines++;
      cur = w;
    } else {
      cur += add;
    }
  }
  return lines;
}

function estimateRowHeight(tx: Transaction): number {
  const lines = Math.max(countLines(tx.remarks || '', 154), countLines(tx.transCode || '', 90));
  return Math.max(MIN_ROW_H, lines * LINE_H + CELL_PAD_V);
}

interface StandardPdfStatementProps {
  data: StatementData;
  transactions: Transaction[];
  logoSrc?: string;
  onlineBadgeSrc?: string;
}

export function StandardPdfStatement({ data, transactions, logoSrc, onlineBadgeSrc }: StandardPdfStatementProps) {
  const formatMoney = (val: number | undefined) => {
    if (!val || val === 0) return '';
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const formatBalance = (val: number | undefined) => {
    if (val === undefined || val === null) return '';
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const totalDebitCents = transactions.reduce((acc, t) => acc + Math.round((t.debit || 0) * 100), 0);
  const totalCreditCents = transactions.reduce((acc, t) => acc + Math.round((t.credit || 0) * 100), 0);
  const totalDebit = totalDebitCents / 100;
  const totalCredit = totalCreditCents / 100;

  const formattedStartDate = format(new Date(data.startDate), 'dd/MM/yyyy');
  const formattedEndDate = format(new Date(data.endDate), 'dd/MM/yyyy');

  // Height-based A4 pagination: estimate each row's height, pack pages to fill the
  // available space, then stretch rows evenly so no large blank area remains at the bottom.
  const rowNeeds = transactions.map(estimateRowHeight);
  const firstAvail = PAGE_FIRST_AVAIL - (data.addressLine2 ? CUST_LINE_H : 0);
  const pagesIdx: number[][] = [];
  {
    let cur: number[] = [];
    let used = 0;
    let avail = firstAvail;
    rowNeeds.forEach((h, i) => {
      if (used + h > avail && cur.length > 0) {
        pagesIdx.push(cur);
        cur = [];
        used = 0;
        avail = PAGE_OTHER_AVAIL;
      }
      cur.push(i);
      used += h;
    });
    pagesIdx.push(cur);
    // Ensure the last page has room for summary row + footer box
    const lastAvail = pagesIdx.length === 1 ? firstAvail : PAGE_OTHER_AVAIL;
    const last = pagesIdx[pagesIdx.length - 1];
    let lastUsed = last.reduce((s, i) => s + rowNeeds[i], 0);
    if (lastUsed + FOOTER_RESERVE > lastAvail) {
      const moved: number[] = [];
      while (last.length > 1 && lastUsed + FOOTER_RESERVE > lastAvail) {
        const i = last.pop()!;
        lastUsed -= rowNeeds[i];
        moved.unshift(i);
      }
      // keep at least a few rows with the footer
      while (moved.length < 3 && last.length > 1) {
        moved.unshift(last.pop()!);
      }
      pagesIdx.push(moved);
    }
  }

  const pages: Transaction[][] = pagesIdx.map((ids) => ids.map((i) => transactions[i]));
  const pageRowHeights: number[][] = [];
  let lastExtra = MAX_EXTRA;
  pagesIdx.forEach((ids, pIdx) => {
    const isLast = pIdx === pagesIdx.length - 1;
    const avail = (pIdx === 0 ? firstAvail : PAGE_OTHER_AVAIL) - (isLast ? FOOTER_RESERVE : 0);
    const used = ids.reduce((s, i) => s + rowNeeds[i], 0);
    let extra = ids.length > 0 ? Math.max(0, (avail - used) / ids.length) : 0;
    extra = Math.min(extra, MAX_EXTRA);
    if (isLast && pagesIdx.length > 1) extra = Math.min(extra, lastExtra);
    if (!isLast) lastExtra = extra;
    pageRowHeights.push(ids.map((i) => Math.floor((rowNeeds[i] + extra) * 10) / 10));
  });

  const totalPagesCount = pages.length;

  return (
    <Document>
      {pages.map((pageTxs, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === totalPagesCount - 1;
        const pageNum = pageIdx + 1;

        return (
          <Page key={pageIdx} size="A4" style={styles.page} >
            {/* Top Bar with Logos and Branch Box */}
            <View style={styles.topBar}>
              <View style={styles.logoGroup}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={logoSrc || SBL_LOGO_BASE64} style={styles.logoImage} />
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={onlineBadgeSrc || SBL_ONLINE_BADGE_BASE64} style={styles.onlineBadgeImage} />
              </View>

              <View>
                <Text style={styles.pageNumberText}>
                  Page :      {pageNum} / {totalPagesCount}
                </Text>
                <View style={styles.branchBox}>
                  <Text style={styles.branchTitle}>{data.branchName.toUpperCase()}</Text>
                  <Text style={styles.branchLine}>{data.branchAddressLine1}</Text>
                  <Text style={styles.branchLine}>{data.branchAddressLine2}</Text>
                  <Text style={styles.branchLine}>Phone : {data.branchPhone}</Text>
                  <Text style={styles.branchLine}>
                    {data.branchFax ? `Fax : ${data.branchFax}  ` : ''}Email : {data.branchEmail}
                  </Text>
                  <Text style={styles.branchPrintingDate}>Printing Date :  {data.printingDate}</Text>
                </View>
              </View>
            </View>

            {/* Period */}
            <Text style={styles.periodText}>
              Statement of Account for the Period :   {formattedStartDate}    to    {formattedEndDate}
            </Text>

            {/* Customer Details Box (ONLY ON PAGE 1) */}
            {isFirstPage && (
              <View style={styles.custBox}>
                <View style={styles.custColLeft}>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>A/C Title</Text>
                    <Text style={styles.custValue}>:  {data.accountTitle}</Text>
                  </View>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>Address</Text>
                    <Text style={styles.custValue}>:  {data.addressLine1}</Text>
                  </View>
                  {data.addressLine2 ? (
                    <View style={styles.custRow}>
                      <Text style={styles.custLabel}></Text>
                      <Text style={styles.custValue}>   {data.addressLine2}</Text>
                    </View>
                  ) : null}
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>Contact No</Text>
                    <Text style={styles.custValue}>:  {data.contactNo}</Text>
                  </View>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>A/C Status</Text>
                    <Text style={styles.custValue}>:  {data.accountStatus}</Text>
                  </View>
                </View>

                <View style={styles.custColRight}>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>A/c No</Text>
                    <Text style={styles.custValue}>
                      : {data.accountNo}  Open Date :{data.openDate}
                    </Text>
                  </View>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>A/c Type</Text>
                    <Text style={styles.custValue}>: {data.accountType}</Text>
                  </View>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>Cust. ID</Text>
                    <Text style={styles.custValue}>: {data.customerId}</Text>
                  </View>
                  <View style={styles.custRow}>
                    <Text style={styles.custLabel}>Currency</Text>
                    <Text style={styles.custValue}>: {data.currency}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Transactions Table */}
            <View style={styles.tableContainer}>
              {/* Table Header (all column titles centered) */}
              <View style={styles.tableHeader}>
                <View style={styles.headerColSl}><Text style={styles.headerText}>SL</Text></View>
                <View style={styles.headerColDate}><Text style={styles.headerText}>Date</Text></View>
                <View style={styles.headerColTransCode}><Text style={styles.headerText}>Trans. Code / Chq No</Text></View>
                <View style={styles.headerColDebit}><Text style={styles.headerText}>Debit Amount</Text></View>
                <View style={styles.headerColCredit}><Text style={styles.headerText}>Credit Amount</Text></View>
                <View style={styles.headerColBalance}><Text style={styles.headerText}>Balance</Text></View>
                <View style={styles.headerColRemarks}><Text style={styles.headerText}>Remarks</Text></View>
              </View>

              {/* Transaction Rows */}
              {pageTxs.map((tx, idx) => {
                const isOpening = tx.id === 'tx-open';
                const isRowLast = idx === pageTxs.length - 1 && !isLastPage;
                const h = pageRowHeights[pageIdx][idx];

                return (
                  <View key={tx.id || idx} style={[styles.tableRow, { height: h }, isRowLast ? styles.tableRowLast : {}]} wrap={false}>
                    <View style={styles.colSl}>
                      <Text style={styles.cellText}>{tx.sl !== undefined && tx.sl !== '' ? tx.sl : ''}</Text>
                    </View>
                    <View style={styles.colDate}>
                      <Text style={styles.cellText}>{tx.date}</Text>
                    </View>
                    <View style={styles.colTransCode}>
                      <Text style={isOpening ? [styles.cellText, { fontFamily: 'Helvetica-Bold' }] : styles.cellText}>{tx.transCode}</Text>
                    </View>
                    <View style={styles.colDebit}>
                      <Text style={styles.cellText}>{!isOpening && tx.debit > 0 ? formatMoney(tx.debit) : ''}</Text>
                    </View>
                    <View style={styles.colCredit}>
                      <Text style={styles.cellText}>{!isOpening && tx.credit > 0 ? formatMoney(tx.credit) : ''}</Text>
                    </View>
                    <View style={styles.colBalance}>
                      <Text style={styles.cellText}>{formatBalance(tx.balance)}</Text>
                    </View>
                    <View style={styles.colRemarks}>
                      <Text style={styles.remarksText}>{tx.remarks || ''}</Text>
                    </View>
                  </View>
                );
              })}

              {/* Summary Row on the final page */}
              {isLastPage && (
                <View style={styles.summaryRow} wrap={false}>
                  <View style={styles.summaryLabelCol}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7 }}>Total Debit/Credit : ---&gt;</Text>
                  </View>
                  <View style={styles.summaryDebitCol}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.8 }}>{formatMoney(totalDebit) || '0.00'}</Text>
                  </View>
                  <View style={styles.summaryCreditCol}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 6.8 }}>{formatMoney(totalCredit) || '0.00'}</Text>
                  </View>
                  <View style={styles.summaryBalCol} />
                  <View style={styles.summaryRemarksCol} />
                </View>
              )}
            </View>

            {/* Footer Enclosed Box on final page */}
            {isLastPage && (
              <View style={styles.footerBox} wrap={false}>
                <View style={styles.footerSection1}>
                  <Text style={styles.footerDesc}>
                    Transaction Code Descriptions :   GE - General, CH - Charges, MB RI - Rtgs Inward, DC - Transfer, IC - Inter Branch Cash, MO - Micr Outward Clearing, PT - Pos Transaction, CS - Cash, AT - Atm Transaction, WDL - Withdrawals, N32 - Nps Atm Cash Wdl Charge, ICC - Maintenance Fee, A03 - Pos Cash Withdrawal, N29 - Nps Atm Cash Wdl,
                  </Text>
                </View>
                <View style={styles.footerSection2}>
                  <Text style={styles.footerThanks}>
                    Thanks for banking with us.
                  </Text>
                </View>
                <View style={styles.footerSection3}>
                  <Text style={styles.footerNotice}>
                    The Customer should examine promptly the statement received and notify the bank in writing within 15 calendar days after the statement is mailed, transmitted, or otherwise made available to customer of any errors, discrepancies or irregularities detected, failing which the statement will deem to be correct. This is a computer generated statement and does not require any signature.
                  </Text>
                </View>
              </View>
            )}
          </Page>
        );
      })}
    </Document>
  );
}
