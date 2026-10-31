import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StatementData } from '../types/abTypes';
import { AB_SOL_ICON_BASE64, AB_SOL_TEXT_BASE64 } from '../lib/solvencyAssets';
import { formatAbWords } from '../lib/numberToWordsBD';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 45,
    backgroundColor: '#ffffff',
    color: '#000000',
    position: 'relative',
  },
  // Top Header Area with Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  logoIcon: {
    width: 48,
    height: 48,
    objectFit: 'contain',
    marginRight: 12,
  },
  logoTextImg: {
    width: 155,
    height: 34,
    objectFit: 'contain',
  },
  // Ref, Date, Branch block
  infoBlock: {
    marginBottom: 16,
    fontSize: 10,
    lineHeight: 1.3,
  },
  refText: {
    marginBottom: 2,
  },
  dateText: {
    marginBottom: 14,
  },
  branchName: {
    fontFamily: 'Times-Bold',
  },
  // Subject
  subjectRow: {
    marginTop: 6,
    marginBottom: 16,
  },
  subjectText: {
    fontFamily: 'Times-Bold',
    fontSize: 10.5,
    textDecoration: 'underline',
  },
  // Body intro
  introText: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 14,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  // Details grid
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    fontSize: 10,
    lineHeight: 1.35,
  },
  detailLabel: {
    width: 150,
    fontFamily: 'Times-Bold',
  },
  detailColon: {
    width: 18,
    fontFamily: 'Times-Bold',
  },
  detailValue: {
    flex: 1,
    fontFamily: 'Times-Bold',
  },
  // Solvency & Disclaimer text
  disclaimerText: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 12,
    textAlign: 'justify',
  },
  // Signatory
  signatoryContainer: {
    marginTop: 55,
    marginBottom: 30,
  },
  signatoryRole: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    marginBottom: 2,
  },
  signatoryBank: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
  },
  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 16,
    left: 35,
    right: 35,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.2,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 1.35,
  },
});

interface AbSolvencyPdfProps {
  data: StatementData;
}

export function AbSolvencyPdf({ data }: AbSolvencyPdfProps) {
  const formatBalance = (val: number | undefined) => {
    if (val === undefined || val === null) return '0.00';
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const genDateObj = new Date(data.generationDate || data.endDate);
  const formattedDate = format(genDateObj, 'MMMM dd, yyyy');

  const branchCode = (data.branchName || 'PAT').substring(0, 3).toUpperCase();
  const year = genDateObj.getFullYear();
  const refNo = `ABBL/${branchCode}/AOP/${year}/356`;

  const inWords = formatAbWords(data.endBalance);

  // Address cleaning
  const addr1 = data.addressLine1 || '';
  const addr2 = data.addressLine2 ? data.addressLine2.replace(/\n+/g, ', ') : '';
  const fullAddress = [addr1, addr2].filter(Boolean).join(', ');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo Top */}
        <View style={styles.logoRow}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={AB_SOL_ICON_BASE64} style={styles.logoIcon} />
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={AB_SOL_TEXT_BASE64} style={styles.logoTextImg} />
        </View>

        {/* Info Block (Ref, Date, Branch) */}
        <View style={styles.infoBlock}>
          <Text style={styles.refText}>{refNo}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.branchName}>{data.branchName || 'Patuakhali'} Branch</Text>
          <Text>Raza Badsha Somrat Bhaban, Holding No. 102</Text>
          <Text>Natun Bazar, Sadar Road, {data.branchName || 'Patuakhali'}</Text>
        </View>

        {/* Subject */}
        <View style={styles.subjectRow}>
          <Text style={styles.subjectText}>
            SUBJECT: SOLVENCY CERTIFICATE OF {(data.customerName || '').toUpperCase()}
          </Text>
        </View>

        {/* Body Intro */}
        <Text style={styles.introText}>
          This is to certify that the above named client <Text style={styles.bold}>{(data.customerName || '').toUpperCase()}</Text> has been maintaining the following account with our Branch:
        </Text>

        {/* Account Details */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Holder Address</Text>
          <Text style={styles.detailColon}>:</Text>
          <Text style={styles.detailValue}>{fullAddress.toUpperCase()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Number</Text>
          <Text style={styles.detailColon}>:</Text>
          <Text style={styles.detailValue}>{data.accountNo}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Balance</Text>
          <Text style={styles.detailColon}>:</Text>
          <Text style={styles.detailValue}>
            {formatBalance(data.endBalance)}/= (In Word: {inWords}).
          </Text>
        </View>

        {/* Disclaimers */}
        <Text style={[styles.disclaimerText, { marginTop: 14 }]}>
          To the best of our knowledge the client is financially solvent & sound. Our knowledge on the solvency of the client is based upon the current balance of the above account only and no other information has been taken into consideration.
        </Text>

        <Text style={styles.disclaimerText}>
          This certificate is being issued at the request of the above client without any risk and Responsibility on the part of the Bank or any of its officials.
        </Text>

        {/* Signatory */}
        <View style={styles.signatoryContainer}>
          <Text style={styles.signatoryRole}>Assistant Manager</Text>
          <Text style={styles.signatoryBank}>AB Bank Limited {data.branchName || 'Patuakhali'} Branch</Text>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.footerText}>
            Address: AB Bank Limited {data.branchName || 'Patuakhali'} Branch, Raza Badsha Somrat Bhaban, Holding No. 102, Natun Bazar, Sadar Road, {data.branchName || 'Patuakhali'}{'\n'}
            Telephone: (+8802)7768542 Telefax: (+8802)7774582 SWIFT Code: ABBLBDDH E-mail: info@abbl.com Web Page: www.abbl.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
