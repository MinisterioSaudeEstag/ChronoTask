"use client";

export default function MonthFilter({ selectedMonth, setSelectedMonth }) {
  const months = [
    { value: 'all', label: 'Todos' },
    { value: '0', label: 'Jan' }, { value: '1', label: 'Fev' },
    { value: '2', label: 'Mar' }, { value: '3', label: 'Abr' },
    { value: '4', label: 'Mai' }, { value: '5', label: 'Jun' },
    { value: '6', label: 'Jul' }, { value: '7', label: 'Ago' },
    { value: '8', label: 'Set' }, { value: '9', label: 'Out' },
    { value: '10', label: 'Nov' }, { value: '11', label: 'Dez' },
  ];

  return (
    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full flex items-center">
      <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar">
        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mr-2 shrink-0">
          📅 Mês de Atribuição:
        </span>
        <div className="flex items-center gap-1">
          {months.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMonth(m.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${selectedMonth === m.value
                  ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-100'
                  : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}