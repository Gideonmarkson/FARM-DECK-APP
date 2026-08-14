import React, { useState } from 'react';
import { PRD_SECTIONS } from '../data/prdData';
import { Search, CheckCircle2, Copy, Bookmark } from 'lucide-react';

export const PRDViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(PRD_SECTIONS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSections = PRD_SECTIONS.filter(
    sec =>
      sec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.badge?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-[#2e7d32] text-[10px] px-3 py-1 rounded-full font-bold uppercase border border-emerald-200">
            Official Specification v1.0
          </span>
          <h1 className="font-heading text-xl font-extrabold text-stone-900 mt-2">Farm Deck Product Requirements Document (PRD)</h1>
          <p className="text-stone-500 text-xs mt-0.5 max-w-3xl font-medium">
            Detailed technical specification detailing problem statements, user personas, Gherkin acceptance criteria, database schemas, and system architecture.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search PRD..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-[#f3f7f4] border border-emerald-200 text-stone-900 text-xs pl-10 pr-4 py-2.5 rounded-full font-semibold w-64 focus:outline-none focus:border-[#2e7d32]"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TOC Sidebar */}
        <div className="lg:col-span-4 bg-white border border-emerald-100 p-4 rounded-2xl h-fit lg:sticky lg:top-24 shadow-xs">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Bookmark className="w-4 h-4 text-[#2e7d32]" />
            <h3 className="font-heading text-sm font-extrabold text-stone-900 uppercase">
              Sections
            </h3>
          </div>

          <div className="space-y-1">
            {filteredSections.map(sec => {
              const isActive = activeSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#2e7d32] text-white shadow-xs font-extrabold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-[#f3f7f4]'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  {sec.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full uppercase ${
                        isActive ? 'bg-emerald-950 text-emerald-100' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PRD Reader */}
        <div className="lg:col-span-8 space-y-6">
          {filteredSections.map(sec => (
            <div
              key={sec.id}
              id={sec.id}
              className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs scroll-mt-24"
            >
              <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-emerald-50">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-base font-extrabold text-stone-900">{sec.title}</h2>
                  {sec.badge && (
                    <span className="bg-emerald-100 text-[#2e7d32] text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {sec.badge}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleCopy(sec.id, sec.content)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#2e7d32] font-bold bg-[#f3f7f4] px-3 py-1.5 rounded-full border border-emerald-200"
                >
                  {copiedId === sec.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[#2e7d32] font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="prose max-w-none text-stone-800 text-xs leading-relaxed whitespace-pre-line font-mono bg-[#f3f7f4] p-4 rounded-xl border border-emerald-100">
                {sec.content}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
