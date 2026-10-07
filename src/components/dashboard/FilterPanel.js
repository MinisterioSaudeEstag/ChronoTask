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
        className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${hasActiveFilters
            ? 'bg-blue-50 border-blue-200 text-[#004785]'
            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#004785] text-[10px] font-bold text-white shadow-sm">
            {selectedStatuses.length + selectedProducts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Filtros Avançados</h3>
                <p className="text-xs text-slate-500 mt-1">Refine a busca das demandas</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => toggleStatus(opt.value)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border ${selectedStatuses.includes(opt.value)
                          ? 'bg-blue-50 text-[#004785] border-blue-200 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4">Tipo de Produto</h4>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_OPTIONS.map(prod => (
                    <button
                      key={prod}
                      onClick={() => toggleProduct(prod)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border ${selectedProducts.includes(prod)
                          ? 'bg-blue-50 text-[#004785] border-blue-200 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-[2] px-4 py-3 rounded-xl text-sm font-bold bg-[#004785] text-white hover:bg-[#003566] transition-colors shadow-sm"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}