'use client';

import React, { useState } from 'react';

// Janata
import { DashboardForm } from '@/components/DashboardForm';
import { StatementPreview } from '@/components/StatementPreview';
import { StatementData, Transaction } from '@/types';
import { generateTransactions } from '@/lib/generateTransactions';

// BRAC
import { BracDashboardForm } from '@/components/BracDashboardForm';
import { BracStatementPreview } from '@/components/BracStatementPreview';
import { StatementData as BracStatementData, Transaction as BracTransaction } from '@/types/bracTypes';
import { generateTransactions as generateBracTransactions } from '@/lib/generateBracTransactions';

// AB Bank
import { AbDashboardForm } from '@/components/AbDashboardForm';
import { AbStatementPreview } from '@/components/AbStatementPreview';
import { StatementData as AbStatementData, Transaction as AbTransaction } from '@/types/abTypes';
import { generateAbTransactions } from '@/lib/generateAbTransactions';

export default function Home() {
  const [selectedBank, setSelectedBank] = useState<'janata' | 'brac' | 'ab'>('janata');

  // Janata State
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [data, setData] = useState<StatementData>({
    accountId: '0100005375627',
    customerId: '10420489',
    accountTitle: 'MD MAHBUBUR RAHMAN',
    legacyId: '',
    address: 'FLAT NO. A/22, 948/1-2\nMOMENBAGH\nRAJARBAGH, DHAKA,\nBANGLADESH',
    currency: 'BDT',
    openingDate: '27 JUN 2010',
    accountType: 'Savings Deposits - Individual',
    branchName: 'Mohakhali Corporate',
    routingNo: '135263220',
    startDate: '2025-07-01',
    endDate: '2026-08-09',
    generationDate: '09 AUG 2026',
    accountStatus: 'Active',
    startBalance: 3860716.67,
    endBalance: 1386938.26,
    numberOfTransactions: 40,
    highestBalance: 5000000,
    lowestBalance: 500000,
    maxTxAmount: 200000,
    minTxAmount: 1000,
  });

  // BRAC State
  const [bracMode, setBracMode] = useState<'edit' | 'preview'>('edit');
  const [bracTransactions, setBracTransactions] = useState<BracTransaction[]>([]);
  const [bracData, setBracData] = useState<BracStatementData>({
    name: 'MD IMRAN KHAN',
    addressLine1: 'EIDGAH RAPA, COURTPARA, KUSHTIA',
    addressLine2: 'SADAR',
    addressLine3: 'KUSHTIA 7000',
    addressLine4: 'KHULNA',
    branchName: 'KUSHTIA SME/KRISHI BRANCH',
    branchAddressLine1: 'Tofazzel Heath Centre Bhabon (1st Floor)',
    branchAddressLine2: 'Holding # 42/1, N.S. Road',
    branchAddressLine3: 'Ward # 3, Kushtia',
    branchSwift: 'BRAKBDDH',
    branchEmail: 'enquiry@bracbank.com',
    branchWebsite: 'www.bracbank.com',
    branchPhone: '16221',
    refNo: 'BBL 3101-2025-000433',
    customerId: '05651531',
    accountNo: '1056515310001',
    accountType: 'SAVINGS ACCOUNT',
    currency: 'BDT',
    issueDate: 'October 06, 2025 02:00:06 pm',
    startDate: '2024-10-07',
    endDate: '2025-10-05',
    startBalance: 228807.94,
    endBalance: 100000.00,
    numberOfTransactions: 40,
    highestBalance: 500000,
    lowestBalance: 50000,
    maxTxAmount: 200000,
    minTxAmount: 1000,
  });

  // AB Bank State
  const [abMode, setAbMode] = useState<'edit' | 'preview'>('edit');
  const [abTransactions, setAbTransactions] = useState<AbTransaction[]>([]);
  const [abData, setAbData] = useState<AbStatementData>({
    customerName: 'MD.ZAKIR HOSSAIN',
    addressLine1: 'MD.ZAKIR HOSSAIN, S/O JAYNUL ABEDIN, HOUSE',
    addressLine2: 'NO.65/A,PARGENDARIA, KHAZURBAG SCHOOL ROAD, DHAKA-\n1310.BANGLADESH',
    branchName: 'Jinjira Branch',
    telephone: '01921610822',
    accountType: 'SAVINGS ACCOUNT',
    accountNo: '4012273696300',
    currency: 'BDT',
    startDate: '2026-02-12',
    endDate: '2026-08-11',
    generationDate: '2026-08-11',
    startBalance: 1300.87,
    endBalance: 130004.50,
    numberOfTransactions: 25,
    highestBalance: 500000,
    lowestBalance: 1000,
    maxTxAmount: 100000,
    minTxAmount: 500,
  });

  const handleGenerateJanata = () => {
    const txs = generateTransactions(data);
    setTransactions(txs);
    setMode('preview');
  };

  const handleGenerateBrac = () => {
    const txs = generateBracTransactions(bracData);
    setBracTransactions(txs);
    setBracMode('preview');
  };

  const handleGenerateAb = () => {
    const txs = generateAbTransactions(abData);
    setAbTransactions(txs);
    setAbMode('preview');
  };

  const isPreviewMode = 
    (selectedBank === 'janata' && mode === 'preview') || 
    (selectedBank === 'brac' && bracMode === 'preview') ||
    (selectedBank === 'ab' && abMode === 'preview');

  return (
    <main className="min-h-screen bg-black print:bg-white text-white">
      
      {!isPreviewMode && (
        <div className="pt-12 flex justify-center space-x-6">
          <button
            onClick={() => setSelectedBank('janata')}
            className={`px-8 py-3 font-bold rounded-lg shadow-lg transform transition duration-200 ${
              selectedBank === 'janata'
                ? 'bg-green-600 text-white scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Janata Bank
          </button>
          <button
            onClick={() => setSelectedBank('brac')}
            className={`px-8 py-3 font-bold rounded-lg shadow-lg transform transition duration-200 ${
              selectedBank === 'brac'
                ? 'bg-blue-600 text-white scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            BRAC Bank
          </button>
          <button
            onClick={() => setSelectedBank('ab')}
            className={`px-8 py-3 font-bold rounded-lg shadow-lg transform transition duration-200 ${
              selectedBank === 'ab'
                ? 'bg-red-600 text-white scale-105'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            AB Bank
          </button>
        </div>
      )}

      {selectedBank === 'janata' ? (
        mode === 'edit' ? (
          <div className="py-8 px-4">
            <DashboardForm data={data} onChange={setData} onGenerate={handleGenerateJanata} />
          </div>
        ) : (
          <StatementPreview data={data} transactions={transactions} onBack={() => setMode('edit')} />
        )
      ) : selectedBank === 'brac' ? (
        bracMode === 'edit' ? (
          <div className="py-8 px-4">
            <BracDashboardForm data={bracData} onChange={setBracData} onGenerate={handleGenerateBrac} />
          </div>
        ) : (
          <BracStatementPreview data={bracData} transactions={bracTransactions} onBack={() => setBracMode('edit')} />
        )
      ) : (
        abMode === 'edit' ? (
          <div className="py-8 px-4">
            <AbDashboardForm data={abData} onChange={setAbData} onGenerate={handleGenerateAb} />
          </div>
        ) : (
          <AbStatementPreview data={abData} transactions={abTransactions} onBack={() => setAbMode('edit')} />
        )
      )}
    </main>
  );
}
