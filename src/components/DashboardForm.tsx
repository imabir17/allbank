'use client';

import React from 'react';
import { StatementData } from '../types';

interface DashboardFormProps {
  data: StatementData;
  onChange: (data: StatementData) => void;
  onGenerate: () => void;
}

export function DashboardForm({ data, onChange, onGenerate }: DashboardFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...data,
      [name]: type === 'number' ? (value === '' ? '' as unknown as number : Number(value)) : value,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-8 text-green-500">Janata Bank Statement Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Customer Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account / Contract Title</label>
            <input type="text" name="accountTitle" value={data.accountTitle} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer ID</label>
            <input type="text" name="customerId" value={data.customerId} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <textarea name="address" value={data.address} onChange={handleChange} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Account Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account / Contract ID</label>
            <input type="text" name="accountId" value={data.accountId} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account / Contract Type</label>
            <input type="text" name="accountType" value={data.accountType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Legacy ID</label>
            <input type="text" name="legacyId" value={data.legacyId} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <input type="text" name="currency" value={data.currency} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Opening Date</label>
            <input type="text" name="openingDate" value={data.openingDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Status</label>
            <input type="text" name="accountStatus" value={data.accountStatus} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
          </div>
        </div>

        {/* Branch Details */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Branch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account in Branch</label>
              <input type="text" name="branchName" value={data.branchName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Routing No</label>
              <input type="text" name="routingNo" value={data.routingNo} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Generator Params */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Generation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input type="date" name="startDate" value={data.startDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input type="date" name="endDate" value={data.endDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Generation Date</label>
              <input type="text" name="generationDate" value={data.generationDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Starting Balance</label>
              <input type="number" name="startBalance" value={data.startBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ending Balance</label>
              <input type="number" name="endBalance" value={data.endBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Number of Transactions</label>
              <input type="number" name="numberOfTransactions" value={data.numberOfTransactions} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Balance Guardrails & Transaction Limits</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Highest Balance</label>
                <input type="number" name="highestBalance" value={data.highestBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Lowest Balance</label>
                <input type="number" name="lowestBalance" value={data.lowestBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Tx Amount</label>
                <input type="number" name="maxTxAmount" value={data.maxTxAmount} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Tx Amount</label>
                <input type="number" name="minTxAmount" value={data.minTxAmount} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-green-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button 
          onClick={onGenerate}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition active:scale-95 text-lg"
        >
          Generate Statement
        </button>
      </div>
    </div>
  );
}
