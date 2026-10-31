import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StatementData } from '../types';
import { JANATA_SOL_LOGO_BASE64, JANATA_SOL_FOOTER_BASE64 } from '../lib/solvencyAssets';
import { formatJanataWords } from '../lib/numberToWordsBD';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    paddingTop: 30,
    paddingBottom: 45,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    color: '#000000',
    position: 'relative',
  },
  // Top Header Area
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  leftHeaderCol: {
    flexDirection: 'row',
    width: '58%',
  },
  logoImage: {
    width: 44,
    height: 33,
    objectFit: 'contain',
    marginRight: 10,
    marginTop: 4,
  },
  hoDetails: {
    flex: 1,
  },
  bankTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 15,
    marginBottom: 2,
  },
  hoText: {
    fontSize: 7.2,
    lineHeight: 1.25,
    color: '#000000',
  },
  rightHeaderCol: {
    width: '40%',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  branchTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 10,
    marginBottom: 2,
  },
  branchText: {
    fontSize: 7.8,
    lineHeight: 1.25,
    color: '#000000',
  },
  // Horizontal Line
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    marginTop: 8,
    marginBottom: 12,
  },
  // Ref & Date
  refDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    fontSize: 9.8,
  },
  refText: {
    fontFamily: 'Times-Bold',
  },
  dateText: {
    fontFamily: 'Times-Bold',
  },
  // Document Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleText: {
    fontFamily: 'Times-BoldItalic',
    fontSize: 14.5,
    textDecoration: 'underline',
    letterSpacing: 0.5,
  },
  // Body Paragraphs
  paragraph: {
    fontSize: 11,
    lineHeight: 1.45,
    marginBottom: 14,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  // Footer Graphic Banner
  footerBannerContainer: {
    position: 'absolute',
    bottom: 12,
    left: 35,
    right: 35,
    alignItems: 'center',
  },
  footerBanner: {
    width: '100%',
    height: 26,
    objectFit: 'contain',
  },
});

interface JanataSolvencyPdfProps {
  data: StatementData;
}

export function JanataSolvencyPdf({ data }: JanataSolvencyPdfProps) {
  const formatBalance = (val: number | undefined) => {
    if (val === undefined || val === null) return '0.00';
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const genDateObj = new Date(data.generationDate || data.endDate);
  const formattedDate = format(genDateObj, 'dd/MM/yyyy');
  const formattedAsOfDate = format(genDateObj, 'dd MMMM yyyy');

  const branchCode = (data.branchName || 'SCB').substring(0, 3).toUpperCase();
  const yearShort = genDateObj.getFullYear().toString().slice(-2);
  const refNo = `Ref: JBPLC/${branchCode}/SOLV./SB- 8415-10/${yearShort}`;

  const inWords = formatJanataWords(data.endBalance);

  // Clean address for display
  const addressFormatted = data.address ? data.address.replace(/\n+/g, ', ') : 'Dhaka, Bangladesh';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.leftHeaderCol}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={JANATA_SOL_LOGO_BASE64} style={styles.logoImage} />
            <View style={styles.hoDetails}>
              <Text style={styles.bankTitle}>Janata Bank PLC.</Text>
              <Text style={styles.hoText}>Head Office: Janata Bhaban</Text>
              <Text style={styles.hoText}>110, Motijheel Commercial Area, Dhaka-1000, Bangladesh.</Text>
              <Text style={styles.hoText}>Contact- +88-02-223387168</Text>
              <Text style={styles.hoText}>Fax: 88-02-9564644, SWIFT: JANBBDDH</Text>
              <Text style={styles.hoText}>Website: www.jb.com.bd</Text>
              <Text style={styles.hoText}>e-mail: jb0002@janatabank-bd.com</Text>
            </View>
          </View>

          <View style={styles.rightHeaderCol}>
            <Text style={styles.branchTitle}>{data.branchName || 'Satkhira Corporate'} Branch</Text>
            <Text style={styles.branchText}>Corporate Bhaban, Holding No. 12</Text>
            <Text style={styles.branchText}>{data.branchName || 'Satkhira'}, Bangladesh</Text>
            <Text style={styles.branchText}>Routing No: {data.routingNo || '135263220'}</Text>
            <Text style={styles.branchText}>Contact: +88-02-478805467</Text>
            <Text style={styles.branchText}>e-mail: jb0067@janatabank-bd.com</Text>
          </View>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Ref and Date */}
        <View style={styles.refDateRow}>
          <Text style={styles.refText}>{refNo}</Text>
          <Text style={styles.dateText}>Date: {formattedDate}</Text>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>TO WHOM IT MAY CONCERN</Text>
        </View>

        {/* Paragraph 1 */}
        <Text style={styles.paragraph}>
          This is to certify that <Text style={styles.bold}>{data.accountTitle}</Text>, residing at {addressFormatted}, has been maintaining a <Text style={styles.bold}>{data.accountType}</Text> Account (No. <Text style={styles.bold}>{data.accountId}</Text>) with our branch since {data.openingDate || '12 April 2021'}, and the account remains active as of the issuance date of this certificate.
        </Text>

        {/* Paragraph 2 */}
        <Text style={styles.paragraph}>
          As per our banking records, the current balance in the account as of <Text style={styles.bold}>{formattedAsOfDate}</Text> is BDT <Text style={styles.bold}>{formatBalance(data.endBalance)}</Text> ({inWords}) only. The account’s transaction history has been consistent and satisfactory.
        </Text>

        {/* Paragraph 3 */}
        <Text style={styles.paragraph}>
          Based on the account&apos;s transaction history, <Text style={styles.bold}>{data.accountTitle}</Text> is financially sound and solvent.
        </Text>

        {/* Paragraph 4 */}
        <Text style={styles.paragraph}>
          This certificate has been issued upon the customer’s request and does not bear any liability beyond the information stated herein.
        </Text>

        {/* Bottom Graphic Banner */}
        <View style={styles.footerBannerContainer} fixed>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={JANATA_SOL_FOOTER_BASE64} style={styles.footerBanner} />
        </View>
      </Page>
    </Document>
  );
}
