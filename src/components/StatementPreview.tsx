'use client';

import React, { useState, useEffect } from 'react';
import { StatementData, Transaction } from '../types';
import { PdfStatement } from './PdfStatement';
import { JanataSolvencyPdf } from './JanataSolvencyPdf';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Generating PDF...</div> }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface StatementPreviewProps {
  data: StatementData;
  transactions: Transaction[];
  onBack: () => void;
}

export function StatementPreview({ data, transactions, onBack }: StatementPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [activeDoc, setActiveDoc] = useState<'statement' | 'solvency'>('statement');
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 py-8 text-black">
      {/* Controls Header */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap justify-between items-center gap-4 px-2">
        <button
          onClick={onBack}
          className="bg-gray-800 text-white px-5 py-2.5 rounded shadow hover:bg-gray-700 cursor-pointer font-medium text-sm"
        >
          &larr; Back to Editor
        </button>

        {/* Document Switcher Toggle */}
        <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700 shadow-inner">
          <button
            onClick={() => setActiveDoc('statement')}
            className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeDoc === 'statement'
                ? 'bg-green-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📄 Account Statement
          </button>
          <button
            onClick={() => setActiveDoc('solvency')}
            className={`px-5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeDoc === 'solvency'
                ? 'bg-green-600 text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📜 Solvency Certificate
          </button>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center space-x-2">
          {mounted && (
            <>
              <PDFDownloadLink
                document={<PdfStatement data={data} transactions={transactions} />}
                fileName={`Janata_Bank_Statement_${data.accountId}.pdf`}
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2.5 rounded shadow transition cursor-pointer flex items-center space-x-1.5 text-xs"
              >
                {({ loading }) => (loading ? 'Preparing...' : '📥 Statement PDF')}
              </PDFDownloadLink>

              <PDFDownloadLink
                document={<JanataSolvencyPdf data={data} />}
                fileName={`Janata_Bank_Solvency_Certificate_${data.accountId}.pdf`}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded shadow transition cursor-pointer flex items-center space-x-1.5 text-xs"
              >
                {({ loading }) => (loading ? 'Preparing...' : '📜 Solvency PDF')}
              </PDFDownloadLink>
            </>
          )}
        </div>
      </div>

      {/* PDF Engine Container */}
      <div className="max-w-5xl mx-auto h-[1000px] shadow-2xl bg-white border border-gray-300">
        {mounted && (
          <PDFViewer
            key={activeDoc + transactions.length + (transactions[0]?.balance || 0)}
            width="100%"
            height="100%"
            className="border-none"
          >
            {activeDoc === 'statement' ? (
              <PdfStatement data={data} transactions={transactions} />
            ) : (
              <JanataSolvencyPdf data={data} />
            )}
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
