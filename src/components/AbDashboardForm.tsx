'use client';

import React from 'react';
import { StatementData } from '../types/abTypes';

interface DashboardFormProps {
  data: StatementData;
  onChange: (data: StatementData) => void;
  onGenerate: () => void;
}

export function AbDashboardForm({ data, onChange, onGenerate }: DashboardFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...data,
      [name]: type === 'number' ? (value === '' ? '' as unknown as number : Number(value)) : value,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-8 text-red-500">AB Bank Statement Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Customer Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer Name</label>
            <input type="text" name="customerName" value={data.customerName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 1 (Name & c/o)</label>
            <input type="text" name="addressLine1" value={data.addressLine1} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 2 (Street/City)</label>
            <textarea name="addressLine2" value={data.addressLine2} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Account Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account No</label>
            <input type="text" name="accountNo" value={data.accountNo} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Type</label>
            <input type="text" name="accountType" value={data.accountType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <input type="text" name="currency" value={data.currency} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Branch Name</label>
              <input type="text" name="branchName" value={data.branchName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Telephone</label>
              <input type="text" name="telephone" value={data.telephone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Generator Params */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Generation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input type="date" name="startDate" value={data.startDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input type="date" name="endDate" value={data.endDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Generation Date</label>
              <input type="text" name="generationDate" value={data.generationDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Starting Balance</label>
              <input type="number" name="startBalance" value={data.startBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ending Balance</label>
              <input type="number" name="endBalance" value={data.endBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Number of Transactions</label>
              <input type="number" name="numberOfTransactions" value={data.numberOfTransactions} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-red-500 outline-none" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button 
          onClick={onGenerate}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition active:scale-95 text-lg"
        >
          Generate AB Bank Statement
        </button>
      </div>
    </div>
  );
}
