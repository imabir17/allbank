import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { StatementData, Transaction } from '../types';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 8,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bankName: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
  },
  branchTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
  },
  statementTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 9,
    alignSelf: 'flex-end',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    fontFamily: 'Times-Bold',
  },
  gridRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 4,
  },
  col1Label: {
    width: '20%',
  },
  col1Value: {
    width: '25%',
    fontFamily: 'Times-Bold',
  },
  col2Label: {
    width: '20%',
  },
  col2Value: {
    width: '35%',
    fontFamily: 'Times-Bold',
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingVertical: 5,
    fontFamily: 'Times-Bold',
    fontSize: 7.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    fontSize: 7.5,
  },
  colDate: { width: '13%' },
  colType: { width: '13%' },
  colDesc: { width: '22%' },
  colRef: { width: '15%' },
  colChq: { width: '7%' },
  colDebit: { width: '10%', textAlign: 'right' },
  colCredit: { width: '10%', textAlign: 'right' },
  colBal: { width: '10%', textAlign: 'right' },
});

interface PdfStatementProps {
  data: StatementData;
  transactions: Transaction[];
}

export function PdfStatement({ data, transactions }: PdfStatementProps) {
  const formatMoney = (amount: number) => {
    if (amount === 0) return '';
    const parts = amount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };
  
  const formatBalance = (amount: number) => {
    const parts = amount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const formattedStartDate = format(new Date(data.startDate), 'dd MMM yyyy').toUpperCase().replace(/\./g, '');
  const formattedEndDate = format(new Date(data.endDate), 'dd MMM yyyy').toUpperCase().replace(/\./g, '');

  const totalDebit = transactions.reduce((sum, tx) => sum + tx.debit, 0);
  const totalCredit = transactions.reduce((sum, tx) => sum + tx.credit, 0);
  
  const finalBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : data.startBalance;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.bankName}>Janata Bank PLC.</Text>
            <Text style={styles.branchTitle}>{data.branchName} Branch</Text>
          </View>
          <View>
            <Text style={styles.statementTitle}>ACCOUNT STATEMENT</Text>
          </View>
        </View>

        {/* DETAILS GRID */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Account/Contract ID</Text>
            <Text style={styles.col1Value}>: {data.accountId}</Text>
            <Text style={styles.col2Label}></Text>
            <Text style={styles.col2Value}></Text>
          </View>
          
          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Customer ID</Text>
            <Text style={styles.col1Value}>: {data.customerId}</Text>
            <Text style={styles.col2Label}>Account/Contract Title</Text>
            <Text style={styles.col2Value}>: {data.accountTitle}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Legacy ID</Text>
            <Text style={styles.col1Value}>: {data.legacyId}</Text>
            <Text style={styles.col2Label}>Address</Text>
            <Text style={styles.col2Value}>: {data.address}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Currency</Text>
            <Text style={styles.col1Value}>: {data.currency}</Text>
            <Text style={styles.col2Label}></Text>
            <Text style={styles.col2Value}></Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Account Opening Date</Text>
            <Text style={styles.col1Value}>: {data.openingDate}</Text>
            <Text style={styles.col2Label}>Account/Contract Type</Text>
            <Text style={styles.col2Value}>: {data.accountType}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Account in Branch</Text>
            <Text style={styles.col1Value}>: {data.branchName}</Text>
            <Text style={styles.col2Label}>Routing No</Text>
            <Text style={styles.col2Value}>: {data.routingNo}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Statement for Period of</Text>
            <Text style={styles.col1Value}>: {formattedStartDate} ~ {formattedEndDate}</Text>
            <Text style={styles.col2Label}>Generation Date</Text>
            <Text style={styles.col2Value}>: {data.generationDate}</Text>
          </View>

          <View style={styles.gridRow}>
            <Text style={styles.col1Label}>Account Status</Text>
            <Text style={styles.col1Value}>: {data.accountStatus}</Text>
            <Text style={styles.col2Label}>Balance at Period Start</Text>
            <Text style={styles.col2Value}>: {formatBalance(data.startBalance)}</Text>
          </View>
        </View>

        {/* TRANSACTIONS TABLE */}
        <View style={styles.tableHeader}>
          <View style={styles.colDate}><Text>Date</Text></View>
          <View style={styles.colType}><Text>Transaction Type</Text></View>
          <View style={styles.colDesc}><Text>Description</Text></View>
          <View style={styles.colRef}><Text>Reference No</Text></View>
          <View style={styles.colChq}><Text>Cheque No</Text></View>
          <View style={styles.colDebit}><Text>Debit</Text></View>
          <View style={styles.colCredit}><Text>Credit</Text></View>
          <View style={styles.colBal}><Text>Balance</Text></View>
        </View>

        {transactions.map((tx, index) => (
          <View key={tx.id} style={[styles.tableRow, index % 2 !== 0 ? { backgroundColor: '#e5e7eb' } : {}]} wrap={false}>
            <View style={styles.colDate}><Text>{tx.date}</Text></View>
            <View style={styles.colType}><Text>{tx.transactionType}</Text></View>
            <View style={styles.colDesc}><Text>{tx.description}</Text></View>
            <View style={styles.colRef}><Text>{tx.referenceNo}</Text></View>
            <View style={styles.colChq}><Text>{tx.chequeNo}</Text></View>
            <View style={styles.colDebit}><Text>{tx.debit > 0 ? `-${formatMoney(tx.debit)}` : ''}</Text></View>
            <View style={styles.colCredit}><Text>{formatMoney(tx.credit)}</Text></View>
            <View style={styles.colBal}><Text>{formatBalance(tx.balance)}</Text></View>
          </View>
        ))}

        {/* SUMMARY TOTALS */}
        <View wrap={false} style={{ marginTop: 15, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }}>
          <View style={[{ flexDirection: 'row', paddingVertical: 4 }, transactions.length % 2 !== 0 ? { backgroundColor: '#e5e7eb' } : {}]}>
            <Text style={{ width: '12%', fontFamily: 'Times-Bold', fontSize: 8, paddingLeft: 4 }}>BALANCE:</Text>
            <Text style={{ fontFamily: 'Times-Roman', fontSize: 8 }}>{formatBalance(finalBalance)}</Text>
          </View>
          <View style={[{ flexDirection: 'row', paddingVertical: 4 }, transactions.length % 2 === 0 ? { backgroundColor: '#e5e7eb' } : {}]}>
            <Text style={{ width: '12%', fontFamily: 'Times-Bold', fontSize: 8, paddingLeft: 4 }}>TOTAL DR:</Text>
            <Text style={{ fontFamily: 'Times-Roman', fontSize: 8 }}>{totalDebit > 0 ? `-${formatBalance(totalDebit)}` : '0.00'}</Text>
          </View>
          <View style={[{ flexDirection: 'row', paddingVertical: 4 }, transactions.length % 2 !== 0 ? { backgroundColor: '#e5e7eb' } : {}]}>
            <Text style={{ width: '12%', fontFamily: 'Times-Bold', fontSize: 8, paddingLeft: 4 }}>TOTAL CR:</Text>
            <Text style={{ fontFamily: 'Times-Roman', fontSize: 8 }}>{formatBalance(totalCredit)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
