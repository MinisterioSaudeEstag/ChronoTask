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
    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider mr-2 shrink-0 text-black">
          📅 Mês de Atribuição:
        </span>
        <div className="flex items-center gap-1">
          {/* text black */}
          {months.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMonth(m.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedMonth === m.value
                  ? 'bg-primary text-black shadow-md'
                  : 'dark:bg-slate-800 text-black dark:text-slate-300'
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