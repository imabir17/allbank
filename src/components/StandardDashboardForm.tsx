'use client';

import React from 'react';
import { StatementData } from '../types/standardTypes';

interface StandardDashboardFormProps {
  data: StatementData;
  onChange: (data: StatementData) => void;
  onGenerate: () => void;
}

export function StandardDashboardForm({ data, onChange, onGenerate }: StandardDashboardFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...data,
      [name]: type === 'number' ? (value === '' ? '' as unknown as number : Number(value)) : value,
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-2xl text-white">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-3xl font-bold text-teal-400">Standard Islami Bank Limited</h2>
          <p className="text-sm text-gray-400 mt-1">
            An Islami Shari&apos;ah Based Bank - Statement Generator
          </p>
        </div>
        <div className="text-xs bg-teal-950 text-teal-300 border border-teal-800 px-3 py-1.5 rounded-full font-mono">
          Standard Bank PLC
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Details */}
        <div className="space-y-4 bg-gray-800/40 p-5 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-teal-300 border-b border-gray-700/60 pb-2">Customer Details</h3>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">A/C Title</label>
            <input
              type="text"
              name="accountTitle"
              value={data.accountTitle}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={data.addressLine1}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Address Line 2 (City, Postcode)</label>
            <input
              type="text"
              name="addressLine2"
              value={data.addressLine2}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Contact No</label>
              <input
                type="text"
                name="contactNo"
                value={data.contactNo}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">A/C Status</label>
              <input
                type="text"
                name="accountStatus"
                value={data.accountStatus}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4 bg-gray-800/40 p-5 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-teal-300 border-b border-gray-700/60 pb-2">Account Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Account No</label>
              <input
                type="text"
                name="accountNo"
                value={data.accountNo}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Open Date</label>
              <input
                type="text"
                name="openDate"
                value={data.openDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Account Type</label>
            <input
              type="text"
              name="accountType"
              value={data.accountType}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Cust. ID</label>
              <input
                type="text"
                name="customerId"
                value={data.customerId}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Currency</label>
              <input
                type="text"
                name="currency"
                value={data.currency}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">ATM Card No</label>
              <input
                type="text"
                name="cardNumber"
                value={data.cardNumber}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Cheque Prefix</label>
              <input
                type="text"
                name="chequePrefix"
                value={data.chequePrefix}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Branch Details */}
        <div className="space-y-4 md:col-span-2 bg-gray-800/40 p-5 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-teal-300 border-b border-gray-700/60 pb-2">Branch Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={data.branchName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Building / Market</label>
              <input
                type="text"
                name="branchAddressLine1"
                value={data.branchAddressLine1}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Road / Area</label>
              <input
                type="text"
                name="branchAddressLine2"
                value={data.branchAddressLine2}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Phone</label>
              <input
                type="text"
                name="branchPhone"
                value={data.branchPhone}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email</label>
              <input
                type="text"
                name="branchEmail"
                value={data.branchEmail}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Printing Date & Time</label>
              <input
                type="text"
                name="printingDate"
                value={data.printingDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Generator Params */}
        <div className="space-y-4 md:col-span-2 bg-gray-800/40 p-5 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-teal-300 border-b border-gray-700/60 pb-2">Generation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={data.startDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={data.endDate}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Starting Balance</label>
              <input
                type="number"
                name="startBalance"
                value={data.startBalance}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Ending Balance</label>
              <input
                type="number"
                name="endBalance"
                value={data.endBalance}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Number of Transactions</label>
              <input
                type="number"
                name="numberOfTransactions"
                value={data.numberOfTransactions}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Highest Balance</label>
              <input
                type="number"
                name="highestBalance"
                value={data.highestBalance}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Lowest Balance</label>
              <input
                type="number"
                name="lowestBalance"
                value={data.lowestBalance}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Max Tx Amount</label>
              <input
                type="number"
                name="maxTxAmount"
                value={data.maxTxAmount}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:border-teal-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onGenerate}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-teal-500/20 transform transition duration-150 flex items-center space-x-2 cursor-pointer"
        >
          <span>Generate Statement</span>
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
