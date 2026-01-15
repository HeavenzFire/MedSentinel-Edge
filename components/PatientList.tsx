
import React from 'react';
import { Search, UserPlus, Filter, MoreVertical, Calendar, Hash } from 'lucide-react';
import { Patient } from '../types';

const mockPatients: Patient[] = [
  { id: '1', name: 'James Wilson', dob: '1978-05-14', mrn: 'MRN-99812', gender: 'Male' },
  { id: '2', name: 'Maria Rodriguez', dob: '1992-11-22', mrn: 'MRN-88273', gender: 'Female' },
  { id: '3', name: 'Robert Chen', dob: '1965-02-09', mrn: 'MRN-77361', gender: 'Male' },
  { id: '4', name: 'Sarah Thompson', dob: '2001-08-30', mrn: 'MRN-55122', gender: 'Female' },
  { id: '5', name: 'Linda Gaskins', dob: '1954-12-15', mrn: 'MRN-22109', gender: 'Female' },
];

const PatientList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Directory</h2>
          <p className="text-slate-500 text-sm">Managing 52 total active records in this node.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95">
          <UserPlus size={18} /> New Patient
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name, MRN, or condition..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-500 transition-all">
            <Filter size={18} />
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name & Identifiers</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Demographics</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Encounter</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPatients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1"><Hash size={10} /> {p.mrn}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 font-medium">{p.gender}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={10} /> {p.dob}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    2 hours ago
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
