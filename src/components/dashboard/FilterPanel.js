"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: 'nao_iniciado', label: 'Não Iniciada' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'atrasada', label: 'Atrasada' },
];

const PRODUCT_OPTIONS = [
  'Planilha', 'Documento', 'Relatório', 'Parecer', 
  'Nota Técnica', 'Ofício', 'Despacho', 'Outro'
];

export default function FiltersPanel({ 
  selectedStatuses, setSelectedStatuses,
  selectedProducts, setSelectedProducts 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (value) => {
    if (selectedStatuses.includes(value)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== value));
    } else {
      setSelectedStatuses([...selectedStatuses, value]);
    }
  };

  const toggleProduct = (value) => {
    if (selectedProducts.includes(value)) {
      setSelectedProducts(selectedProducts.filter(p => p !== value));
    } else {
      setSelectedProducts([...selectedProducts, value]);
    }
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedProducts([]);
  };

  const hasActiveFilters = selectedStatuses.length > 0 || selectedProducts.length > 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
          hasActiveFilters 
            ? 'bg-primary text-black shadow-md' 
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-black'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-black animate-pulse">
            {selectedStatuses.length + selectedProducts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white">Filtros Avançados</h3>
                <p className="text-xs text-slate-500">Refine a busca das demandas</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-black dark:text-slate-300 mb-3">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => toggleStatus(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selectedStatuses.includes(opt.value)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-slate-50 dark:bg-slate-800 text-black dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-black dark:text-slate-300 mb-3">Tipo de Produto</h4>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_OPTIONS.map(prod => (
                    <button
                      key={prod}
                      onClick={() => toggleProduct(prod)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selectedProducts.includes(prod)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-slate-50 dark:bg-slate-800 text-black dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary'
                      }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex gap-2">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-300"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-black"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}