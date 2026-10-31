import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StatementData, Transaction } from '../types/bracTypes';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Courier',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 70, // generous bottom padding for absolute footer
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  // --- Header ---
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    color: '#0066b3',
    letterSpacing: 1,
  },
  branchDetails: {
    textAlign: 'right',
    fontSize: 8,
    fontFamily: 'Helvetica',
    lineHeight: 1.3,
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerDetails: {
    fontSize: 9,
    lineHeight: 1.3,
    textTransform: 'uppercase',
  },
  accountTable: {
    fontSize: 9,
    lineHeight: 1.3,
    marginTop: 40,
  },
  accountTableRow: {
    flexDirection: 'row',
  },
  accountTableLabel: {
    width: 80,
    fontFamily: 'Courier-Bold',
  },
  statementPeriod: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    marginTop: 25,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  // --- Table ---
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
    marginBottom: 4,
    fontFamily: 'Courier-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 9,
    alignItems: 'flex-start',
  },
  colDate: { width: '14%' },
  colParticulars: { flex: 1, paddingRight: 5 },
  colChq: { width: 50, textAlign: 'center', flexShrink: 0 },
  colWithdraw: { width: 75, textAlign: 'right', flexShrink: 0 },
  colDeposit: { width: 75, textAlign: 'right', flexShrink: 0 },
  colBalance: { width: 85, textAlign: 'right', flexShrink: 0 },
  
  // --- Summary & End ---
  summaryBlock: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    marginTop: 5,
    marginBottom: 20,
    fontFamily: 'Courier-Bold',
  },
  rewardBox: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 8,
    width: 320,
    alignSelf: 'center',
    marginBottom: 25,
  },
  rewardRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  rewardLabel: { width: 220, fontFamily: 'Courier-Bold' },
  note: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    marginBottom: 10,
    lineHeight: 1.2,
  },
  endStatement: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  // --- Fixed Footer ---
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    fontFamily: 'Courier-Bold',
  },
});

interface PdfStatementProps {
  data: StatementData;
  transactions: Transaction[];
}

export function BracPdfStatement({ data, transactions }: PdfStatementProps) {
  const formatMoney = (amount: number) => {
    if (amount === 0) return '0.00';
    const parts = amount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const totalWithdraw = transactions.reduce((sum, tx) => sum + Math.round((tx.withdraw || 0) * 100), 0) / 100;
  const totalDeposit = transactions.reduce((sum, tx) => sum + Math.round((tx.deposit || 0) * 100), 0) / 100;

  const formattedStartDate = new Date(data.startDate)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-')
    .replace(/\./g, '')
    .toUpperCase();
    
  const formattedEndDate = new Date(data.endDate)
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-')
    .replace(/\./g, '')
    .toUpperCase();
    
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : data.startBalance;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* --- DYNAMIC REPEATING FOOTER --- */}
        {/* Using fixed={true} forces it to render at the bottom of EVERY page automatically */}
        <View style={styles.footer} fixed>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          <Text>Issued By: 30739</Text>
        </View>

        {/* --- HEADER (Only on first page) --- */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={styles.logoContainer}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image 
                src="/brac-logo.jpg" style={styles.logoImage} />
              <Text style={styles.logoText}>BRAC BANK</Text>
            </View>

            <View style={styles.branchDetails}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>{data.branchName}</Text>
              {data.branchAddressLine1 && <Text>{data.branchAddressLine1}</Text>}
              {data.branchAddressLine2 && <Text>{data.branchAddressLine2}</Text>}
              {data.branchAddressLine3 && <Text>{data.branchAddressLine3}</Text>}
              {data.branchSwift && <Text>SWIFT : {data.branchSwift}</Text>}
              {data.branchEmail && <Text>E-mail : {data.branchEmail}</Text>}
              {data.branchWebsite && <Text>Website: {data.branchWebsite}</Text>}
              {data.branchPhone && <Text>24 Hours Call Center : {data.branchPhone}</Text>}
            </View>
          </View>

          <View style={styles.customerSection}>
            <View style={styles.customerDetails}>
              <Text style={{ marginBottom: 10 }}>Ref: {data.refNo}</Text>
              <Text style={{ fontFamily: 'Courier-Bold', marginBottom: 5 }}>{data.name}</Text>
              <Text>{data.addressLine1}</Text>
              <Text>{data.addressLine2}</Text>
              <Text>{data.addressLine3}</Text>
              <Text>{data.addressLine4}</Text>
              <Text>BANGLADESH</Text>
            </View>

            <View style={styles.accountTable}>
              <View style={styles.accountTableRow}><Text style={styles.accountTableLabel}>Customer Id</Text><Text>: {data.customerId}</Text></View>
              <View style={styles.accountTableRow}><Text style={styles.accountTableLabel}>Account No</Text><Text>: {data.accountNo}</Text></View>
              <View style={styles.accountTableRow}><Text style={styles.accountTableLabel}>Account Type</Text><Text>: {data.accountType}</Text></View>
              <View style={styles.accountTableRow}><Text style={styles.accountTableLabel}>Currency</Text><Text>: {data.currency}</Text></View>
              <View style={styles.accountTableRow}><Text style={styles.accountTableLabel}>Issue Date</Text><Text>: {data.issueDate}</Text></View>
            </View>
          </View>

          <Text style={styles.statementPeriod}>
            STATEMENT OF ACCOUNT FOR THE PERIOD OF {formattedStartDate} TO {formattedEndDate}
          </Text>
        </View>

        {/* --- TRANSACTIONS TABLE --- */}
        {/* Table Header (using fixed=true would repeat it on every page, but the user requested it only on page 1) */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDate}>DATE</Text>
          <Text style={styles.colParticulars}>PARTICULARS</Text>
          <Text style={styles.colChq}>CHQ.NO</Text>
          <Text style={styles.colWithdraw}>WITHDRAW</Text>
          <Text style={styles.colDeposit}>DEPOSIT</Text>
          <Text style={styles.colBalance}>BALANCE</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.colDate}></Text>
          <Text style={styles.colParticulars}>BALANCE FORWARD</Text>
          <Text style={styles.colChq}></Text>
          <Text style={styles.colWithdraw}>0.00</Text>
          <Text style={styles.colDeposit}>0.00</Text>
          <Text style={styles.colBalance}>{formatMoney(data.startBalance)}</Text>
        </View>

        {/* The PDF engine will automatically wrap lines and break pages perfectly! */}
        {transactions.map((tx) => (
          <View key={tx.id} style={styles.tableRow} wrap={false}>
            <Text style={styles.colDate}>{tx.date}</Text>
            <Text style={styles.colParticulars}>{tx.particulars}</Text>
            <Text style={styles.colChq}>{tx.chqNo}</Text>
            <Text style={styles.colWithdraw}>{formatMoney(tx.withdraw)}</Text>
            <Text style={styles.colDeposit}>{formatMoney(tx.deposit)}</Text>
            <Text style={styles.colBalance}>{formatMoney(tx.balance)}</Text>
          </View>
        ))}

        {/* --- SUMMARY SECTION --- */}
        <View wrap={false}>
          <View style={styles.summaryBlock}>
            <Text style={styles.colDate}></Text>
            <Text style={styles.colParticulars}></Text>
            <Text style={styles.colChq}></Text>
            <Text style={styles.colWithdraw}>{formatMoney(totalWithdraw)}</Text>
            <Text style={styles.colDeposit}>{formatMoney(totalDeposit)}</Text>
            <Text style={styles.colBalance}>{formatMoney(finalBalance)}</Text>
          </View>

          <View style={styles.rewardBox}>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>Reward Points For Acc No</Text>
              <Text>: {data.accountNo}</Text>
            </View>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>Available Reward Points as on {formattedEndDate}</Text>
              <Text>: 207</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Note: Please advice the Bank of any discrepancies within 14 days from the date of receipt of this{"\n"}
            statement. Otherwise this statement will be considered correct.
          </Text>

          <Text style={styles.endStatement}>**** END OF STATEMENT ****</Text>
        </View>

      </Page>
    </Document>
  );
}
