'use client';

import React from 'react';
import { StatementData } from '../types/bracTypes';

interface DashboardFormProps {
  data: StatementData;
  onChange: (data: StatementData) => void;
  onGenerate: () => void;
}

export function BracDashboardForm({ data, onChange, onGenerate }: DashboardFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...data,
      [name]: type === 'number' ? (value === '' ? '' as unknown as number : Number(value)) : value,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-8 text-blue-400">BRAC Bank Statement Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Personal Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" name="name" value={data.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 1</label>
            <input type="text" name="addressLine1" value={data.addressLine1} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 2</label>
            <input type="text" name="addressLine2" value={data.addressLine2} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 3</label>
            <input type="text" name="addressLine3" value={data.addressLine3} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address Line 4</label>
            <input type="text" name="addressLine4" value={data.addressLine4} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Account Details</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Customer Id</label>
            <input type="text" name="customerId" value={data.customerId} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account No</label>
            <input type="text" name="accountNo" value={data.accountNo} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Type</label>
            <input type="text" name="accountType" value={data.accountType} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <input type="text" name="currency" value={data.currency} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Issue Date (e.g. October 06, 2025 02:00:06 pm)</label>
            <input type="text" name="issueDate" value={data.issueDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Ref No</label>
            <input type="text" name="refNo" value={data.refNo} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
          </div>
        </div>

        {/* Branch Details */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Branch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Branch Name</label>
              <input type="text" name="branchName" value={data.branchName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address Line 1</label>
              <input type="text" name="branchAddressLine1" value={data.branchAddressLine1} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address Line 2</label>
              <input type="text" name="branchAddressLine2" value={data.branchAddressLine2} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address Line 3</label>
              <input type="text" name="branchAddressLine3" value={data.branchAddressLine3} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">SWIFT Code</label>
              <input type="text" name="branchSwift" value={data.branchSwift} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="text" name="branchEmail" value={data.branchEmail} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Website</label>
              <input type="text" name="branchWebsite" value={data.branchWebsite} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone / Call Center</label>
              <input type="text" name="branchPhone" value={data.branchPhone} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Generator Params */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2">Generation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start Date</label>
              <input type="date" name="startDate" value={data.startDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">End Date</label>
              <input type="date" name="endDate" value={data.endDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Starting Balance</label>
              <input type="number" name="startBalance" value={data.startBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ending Balance</label>
              <input type="number" name="endBalance" value={data.endBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Number of Transactions</label>
              <input type="number" name="numberOfTransactions" value={data.numberOfTransactions} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
            </div>
          </div>

          {/* Balance Guardrails */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Balance Guardrails — keeps the running balance within a realistic range during generation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Highest Balance (peak balance allowed)</label>
                <input type="number" name="highestBalance" value={data.highestBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Lowest Balance (minimum balance allowed)</label>
                <input type="number" name="lowestBalance" value={data.lowestBalance} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Transaction Amount Range */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Transaction Amount Range — each individual deposit or withdrawal will be between these two values.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Max Transaction Amount</label>
                <input type="number" name="maxTxAmount" value={data.maxTxAmount} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Min Transaction Amount</label>
                <input type="number" name="minTxAmount" value={data.minTxAmount} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button 
          onClick={onGenerate}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition active:scale-95 text-lg"
        >
          Generate Statement
        </button>
      </div>
    </div>
  );
}
