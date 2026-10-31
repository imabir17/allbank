import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { StatementData } from '../types/standardTypes';
import { SBL_SOL_LOGO_BASE64 } from '../lib/solvencyAssets';
import { formatStandardWords } from '../lib/numberToWordsBD';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    paddingTop: 32,
    paddingBottom: 0,
    paddingHorizontal: 45,
    backgroundColor: '#ffffff',
    color: '#000000',
    position: 'relative',
  },
  // Top Header Area
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logoContainer: {
    width: '48%',
    paddingTop: 4,
  },
  logoImage: {
    width: 215,
    height: 34,
    objectFit: 'contain',
  },
  branchBox: {
    width: '46%',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  branchTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  branchText: {
    fontSize: 7.8,
    color: '#000000',
    lineHeight: 1.25,
  },
  // Reference and Date
  refDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
    fontSize: 9.5,
  },
  refText: {
    fontFamily: 'Helvetica',
  },
  dateText: {
    fontFamily: 'Helvetica',
  },
  // Document Title
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    textDecoration: 'underline',
    letterSpacing: 0.5,
  },
  // Body Paragraphs
  bodyParagraph: {
    fontSize: 9.5,
    lineHeight: 1.45,
    marginBottom: 10,
    textAlign: 'justify',
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  // Account Details Table
  tableContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    marginTop: 6,
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    minHeight: 28,
    alignItems: 'center',
  },
  tableDataRow: {
    flexDirection: 'row',
    minHeight: 26,
    alignItems: 'center',
  },
  colAccountNo: {
    width: '24%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  colAccountType: {
    width: '32%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  colAccountName: {
    width: '22%',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  colBalance: {
    width: '22%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    textAlign: 'center',
  },
  tableCellText: {
    fontSize: 8.5,
    textAlign: 'center',
  },
  // In words line
  totalWordsRow: {
    fontSize: 9.5,
    lineHeight: 1.4,
    marginBottom: 14,
  },
  // Signatory Area
  signatoryContainer: {
    marginTop: 50,
    marginBottom: 40,
  },
  signatoryText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
  },
  // Footer Area
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  headOfficeText: {
    fontSize: 7.2,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 1.3,
    marginBottom: 8,
    paddingHorizontal: 40,
  },
  bottomStripe: {
    flexDirection: 'row',
    height: 26,
    width: '100%',
  },
  stripeGreen: {
    backgroundColor: '#009e47',
    width: '33.33%',
    height: '100%',
  },
  stripeRed: {
    backgroundColor: '#d60000',
    width: '33.34%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stripeYellow: {
    backgroundColor: '#ffcc00',
    width: '33.33%',
    height: '100%',
  },
  stripeWebsiteText: {
    color: '#ffffff',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
});

interface StandardSolvencyPdfProps {
  data: StatementData;
}

export function StandardSolvencyPdf({ data }: StandardSolvencyPdfProps) {
  const formatBalance = (val: number | undefined) => {
    if (val === undefined || val === null) return '0.00';
    const parts = Number(val).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const endDateObj = new Date(data.endDate);
  const formattedDate = format(endDateObj, 'MMMM dd, yyyy');
  const formattedBalanceDate = format(endDateObj, 'dd.MM.yyyy');

  const branchCode = (data.branchName || 'TONGI').split(' ')[0].toUpperCase();
  const year = endDateObj.getFullYear();
  const refNo = `SBPLC/${branchCode}/Certificate/${year}/2588`;

  const totalInWords = formatStandardWords(data.endBalance);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={SBL_SOL_LOGO_BASE64} style={styles.logoImage} />
          </View>
          <View style={styles.branchBox}>
            <Text style={styles.branchTitle}>{(data.branchName || 'Tongi').toUpperCase()} BRANCH</Text>
            <Text style={styles.branchText}>{data.branchAddressLine1 || 'Amin Bhaban'}</Text>
            <Text style={styles.branchText}>{data.branchAddressLine2 || '12 Cherag Ali Market, Tongi'}</Text>
            <Text style={styles.branchText}>Phone: {data.branchPhone || '+88-02-9862207, 9840907'}</Text>
            {data.branchFax ? <Text style={styles.branchText}>Fax: {data.branchFax}</Text> : null}
            <Text style={styles.branchText}>Mobile: 01701221687 (M), 01701221686 (MO)</Text>
            <Text style={styles.branchText}>Email: {data.branchEmail || 'tongi@standardbankbd.com'}</Text>
            <Text style={styles.branchText}>Swift: SDBLBDDH11</Text>
          </View>
        </View>

        {/* Reference & Date */}
        <View style={styles.refDateRow}>
          <Text style={styles.refText}>{refNo}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Document Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>TO WHOM IT MAY CONCERN</Text>
        </View>

        {/* Body Paragraph 1 */}
        <Text style={styles.bodyParagraph}>
          This is to certify that <Text style={styles.boldText}>{data.accountTitle}</Text> address at {data.addressLine1}
          {data.addressLine2 ? `, ${data.addressLine2}` : ''} has been maintaining a {data.accountType} Account bearing no. <Text style={styles.boldText}>{data.accountNo}</Text> with us.
        </Text>

        <Text style={[styles.bodyParagraph, { marginBottom: 4 }]}>
          Details of the account are stated below:
        </Text>

        {/* Account Details Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.colAccountNo}>
              <Text style={styles.tableHeaderText}>Account No.</Text>
            </View>
            <View style={styles.colAccountType}>
              <Text style={styles.tableHeaderText}>Account Type</Text>
            </View>
            <View style={styles.colAccountName}>
              <Text style={styles.tableHeaderText}>Account Name</Text>
            </View>
            <View style={styles.colBalance}>
              <Text style={styles.tableHeaderText}>Balance as on</Text>
              <Text style={styles.tableHeaderText}>{formattedBalanceDate}</Text>
              <Text style={styles.tableHeaderText}>(BDT)</Text>
            </View>
          </View>

          <View style={styles.tableDataRow}>
            <View style={styles.colAccountNo}>
              <Text style={styles.tableCellText}>{data.accountNo}</Text>
            </View>
            <View style={styles.colAccountType}>
              <Text style={styles.tableCellText}>{data.accountType}</Text>
            </View>
            <View style={styles.colAccountName}>
              <Text style={[styles.tableCellText, styles.boldText]}>{data.accountTitle}</Text>
            </View>
            <View style={styles.colBalance}>
              <Text style={[styles.tableCellText, styles.boldText]}>{formatBalance(data.endBalance)}</Text>
            </View>
          </View>
        </View>

        {/* Total In Words */}
        <Text style={styles.totalWordsRow}>
          <Text style={styles.boldText}>Total : </Text>{totalInWords}
        </Text>

        {/* Solvency statements */}
        <Text style={styles.bodyParagraph}>
          To the best of our knowledge <Text style={styles.boldText}>{data.accountTitle}</Text> is financially sound and solvent.
        </Text>

        <Text style={styles.bodyParagraph}>
          This certificate has been issued at the request of our client and the responsibility of the bank and its officials are restricted to the contents of this certificate only.
        </Text>

        <Text style={styles.bodyParagraph}>
          We wish every success in life.
        </Text>

        {/* Authorized Signature */}
        <View style={styles.signatoryContainer}>
          <Text style={styles.signatoryText}>Authorized Signature</Text>
        </View>

        {/* Footer Area with 3-colored bottom bar */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.headOfficeText}>
            Head Office: Metropolitan Chamber Building (3rd Floor) 122-124 Motijheel C/A, Dhaka-1000, Bangladesh{'\n'}
            Telephone: +8802223358385, +8802223385106, +8802223357913, Email: sblho@standardbankbd.com{'\n'}
            Swift Code: SDBLBDDH102
          </Text>

          <View style={styles.bottomStripe}>
            <View style={styles.stripeGreen} />
            <View style={styles.stripeRed}>
              <Text style={styles.stripeWebsiteText}>www.standardbankbd.com</Text>
            </View>
            <View style={styles.stripeYellow} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
