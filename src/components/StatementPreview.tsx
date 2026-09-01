'use client';

import React, { useState, useEffect } from 'react';
import { StatementData, Transaction } from '../types';
import { PdfStatement } from './PdfStatement';
import dynamic from 'next/dynamic';

// Next.js SSR doesn't play well with the browser-based PDFViewer.
// We dynamically import it with ssr: false to prevent hydration errors.
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Generating PDF...</div> }
);

interface StatementPreviewProps {
  data: StatementData;
  transactions: Transaction[];
  onBack: () => void;
}

export function StatementPreview({ data, transactions, onBack }: StatementPreviewProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 py-8 text-black">
      {/* Controls */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <button onClick={onBack} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-700">
          &larr; Back to Editor
        </button>
        <div className="text-sm text-gray-500 italic bg-gray-100 px-4 py-2 rounded">
          Use the toolbar in the PDF viewer below to directly Save or Print your statement.
        </div>
      </div>

      {/* PDF Engine Container */}
      <div className="max-w-5xl mx-auto h-[1000px] shadow-2xl bg-white border border-gray-300">
        {mounted && (
          <PDFViewer key={transactions.length + transactions[0]?.balance} width="100%" height="100%" className="border-none">
            <PdfStatement data={data} transactions={transactions} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
