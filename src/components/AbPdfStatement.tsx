import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { StatementData, Transaction } from '../types/abTypes';
import { format } from 'date-fns';

// Standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/roboto-font@0.1.0/fonts/Roboto/roboto-regular-webfont.ttf' }
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },
  headerTopContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    position: 'relative',
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Helvetica',
    marginLeft: 8,
  },
  titleArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: 5,
    zIndex: 1,
  },
  statementTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  headerDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  customerDetails: {
    width: '50%',
    paddingTop: 10,
  },
  customerName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginBottom: 5,
  },
  customerAddress: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },
  bankDetails: {
    width: '45%',
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  bankLabel: {
    width: '50%',
    textAlign: 'right',
    paddingRight: 5,
    fontSize: 9,
  },
  bankValue: {
    width: '50%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 10,
  },
  subHeaderText: {
    fontSize: 9,
  },
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    fontSize: 7,
  },
  colPostDate: { width: '8%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, overflow: 'hidden' },
  colValueDate: { width: '8%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, overflow: 'hidden' },
  colRef: { width: '17%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 2, overflow: 'hidden' },
  colPart: { width: '35%', paddingHorizontal: 5, borderRightWidth: 1, borderColor: '#000', paddingVertical: 12, justifyContent: 'center', overflow: 'hidden' },
  colDebit: { width: '10%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 2, paddingVertical: 12, overflow: 'hidden' },
  colCredit: { width: '10%', borderRightWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 2, paddingVertical: 12, overflow: 'hidden' },
  colBal: { width: '12%', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 2, paddingVertical: 12, overflow: 'hidden' },
  footerArea: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  footerLabel: {
    width: '50%',
    textAlign: 'center',
  },
  footerValue: {
    width: '12%',
    textAlign: 'right',
  },
  footerCreditValue: {
    width: '10%',
    textAlign: 'right',
    paddingRight: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  footerTime: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    fontSize: 8,
  }
});

const formatMoney = (amount: number) => {
  if (amount === 0) return '';
  const parts = amount.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const formatBalance = (amount: number) => {
  const parts = amount.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.') + 'CR';
};

export function AbPdfStatement({ data, transactions }: { data: StatementData; transactions: Transaction[] }) {
  
  const totalDebit = transactions.reduce((sum, tx) => sum + tx.debit, 0);
  const totalCredit = transactions.reduce((sum, tx) => sum + tx.credit, 0);
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : data.startBalance;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        
        {/* HEADER TOP (Logo + Title) */}
        <View style={styles.headerTopContainer} fixed>
          <View style={styles.logoArea}>
            <Image src="/ab-logo.png" style={{ width: 45, height: 45 }} />
            <Text style={styles.logoText}>AB Bank</Text>
          </View>
          <View style={styles.titleArea}>
            <Text style={styles.statementTitle}>Account Statement</Text>
          </View>
        </View>

        {/* HEADER DETAILS (Customer + Bank) */}
        <View style={styles.headerDetailsContainer} fixed>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{data.customerName}</Text>
            <Text style={styles.customerAddress}>{data.addressLine1}</Text>
            <Text style={styles.customerAddress}>{data.addressLine2}</Text>
          </View>

          <View style={styles.bankDetails}>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>BRANCH</Text>
              <Text style={styles.bankValue}>:{data.branchName}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>TELEPHONE</Text>
              <Text style={styles.bankValue}>:{data.telephone}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>TXN FROM DATE</Text>
              <Text style={styles.bankValue}>:{format(new Date(data.startDate), 'dd-MMM-yyyy')}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>TXN TO DATE</Text>
              <Text style={styles.bankValue}>:{format(new Date(data.endDate), 'dd-MMM-yyyy')}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>ACCOUNT TYPE</Text>
              <Text style={styles.bankValue}>:{data.accountType}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>ACCOUNT NO</Text>
              <Text style={styles.bankValue}>:{data.accountNo}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>CURRENCY</Text>
              <Text style={styles.bankValue}>:{data.currency}</Text>
            </View>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>PAGE</Text>
              <Text style={styles.bankValue}>:1 of      1</Text>
            </View>
          </View>
        </View>

        <View style={styles.subHeader} fixed>
          <Text style={styles.subHeaderText}>
            Statement of Account {data.accountNo} of {data.customerName} for the Period: {format(new Date(data.startDate), 'dd-MMM-yyyy')} to {format(new Date(data.endDate), 'dd-MMM-yyyy')}
          </Text>
          <Text style={styles.subHeaderText}>
            Date:{format(new Date(data.generationDate), 'dd-MMM-yyyy')}
          </Text>
        </View>

        <View style={styles.tableHeader} fixed>
          <View style={styles.colPostDate}><Text>Post Date</Text></View>
          <View style={styles.colValueDate}><Text>Value Date</Text></View>
          <View style={styles.colRef}><Text>Ref. No.</Text></View>
          <View style={[styles.colPart, { alignItems: 'center' }]}><Text>Particulars</Text></View>
          <View style={[styles.colDebit, { alignItems: 'center', paddingRight: 0 }]}><Text>Debit</Text></View>
          <View style={[styles.colCredit, { alignItems: 'center', paddingRight: 0 }]}><Text>Credit</Text></View>
          <View style={[styles.colBal, { alignItems: 'center', paddingRight: 0 }]}><Text>Balance</Text></View>
        </View>

        {transactions.map((tx) => (
          <View key={tx.id} style={styles.tableRow} wrap={false}>
            <View style={styles.colPostDate}><Text>{tx.postDate}</Text></View>
            <View style={styles.colValueDate}><Text>{tx.valueDate}</Text></View>
            <View style={styles.colRef}><Text>{tx.refNo}</Text></View>
            <View style={styles.colPart}><Text>{tx.particulars}</Text></View>
            <View style={styles.colDebit}><Text>{formatMoney(tx.debit)}</Text></View>
            <View style={styles.colCredit}><Text>{formatMoney(tx.credit)}</Text></View>
            <View style={styles.colBal}><Text>{formatBalance(tx.balance)}</Text></View>
          </View>
        ))}

        <View style={styles.tableRow} wrap={false}>
          <View style={styles.colPostDate}></View>
          <View style={styles.colValueDate}></View>
          <View style={styles.colRef}></View>
          <View style={[styles.colPart, { alignItems: 'center' }]}><Text>Credit Balance</Text></View>
          <View style={styles.colDebit}></View>
          <View style={styles.colCredit}></View>
          <View style={styles.colBal}><Text>{formatBalance(finalBalance)}</Text></View>
        </View>
        <View style={styles.tableRow} wrap={false}>
          <View style={styles.colPostDate}></View>
          <View style={styles.colValueDate}></View>
          <View style={styles.colRef}></View>
          <View style={[styles.colPart, { alignItems: 'center' }]}><Text>Available Balance</Text></View>
          <View style={styles.colDebit}></View>
          <View style={styles.colCredit}></View>
          <View style={styles.colBal}><Text>{formatBalance(finalBalance)}</Text></View>
        </View>
        <View style={styles.tableRow} wrap={false}>
          <View style={styles.colPostDate}></View>
          <View style={styles.colValueDate}></View>
          <View style={styles.colRef}></View>
          <View style={[styles.colPart, { alignItems: 'center' }]}><Text>Sum of</Text></View>
          <View style={styles.colDebit}><Text>{formatMoney(totalDebit)}</Text></View>
          <View style={styles.colCredit}><Text>{formatMoney(totalCredit)}</Text></View>
          <View style={styles.colBal}></View>
        </View>

        <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
          pageNumber === totalPages ? 'NOTE: It is an internet banking generated statement. For any information or queries on your account please contact any of our branches.' : ''
        )} fixed />
        <Text style={styles.footerTime} fixed>
          Timestamp: {format(new Date(data.generationDate), 'dd MMM yyyy')} 11:20:22 AM
        </Text>

      </Page>
    </Document>
  );
}
