'use client';

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Calendar,
  Loader2,
  Download,
  ArrowRight,
  Info
} from "lucide-react";
import * as XLSX from "xlsx";
import { useAuth } from "@/lib/authContext";

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function exportToExcel() {
    if (!startDate || !endDate) {
      alert("Por favor, selecione o período de início e fim.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("funcionario_nome, status, expected_time, start_date, descricao")
        .gte("start_date", startDate)
        .lte("start_date", endDate);

      if (error) throw error;

      if (data.length === 0) {
        alert("Nenhuma demanda encontrada para este período.");
        setLoading(false);
        return;
      }

      const formattedData = data.map((item) => ({
        "Nome do Funcionário": item.funcionario_nome,
        "Status da Atividade": item.status,
        "Carga Horária (h)": item.expected_time,
        "Data de Início": item.start_date,
        "Função Atribuída": item.descricao,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio_Demandas");

      XLSX.writeFile(workbook, `Relatorio_ChronoTask_${startDate}_a_${endDate}.xlsx`);
    } catch (error) {
      alert("Erro ao exportar planilha: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col transition-colors duration-300 relative overflow-hidden">
      <div className="absolute right-[-5%] top-[10%] opacity-[0.03] pointer-events-none select-none hidden lg:block">
        <FileSpreadsheet className="w-[500px] h-[500px] text-[#004785] -rotate-12" />
      </div>

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-2xl bg-[#eef4ff] flex items-center justify-center shrink-0 shadow-sm border border-blue-100/50">
            <FileSpreadsheet className="w-10 h-10 text-[#004785]" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#004785] tracking-tight mb-2">
              Relatórios de Produtividade
            </h1>
            <p className="text-slate-500 text-lg">
              Exporte as demandas para análise no Power BI
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-sm p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eef4ff] flex items-center justify-center shrink-0 mt-1">
                <Calendar className="w-6 h-6 text-[#004785]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#004785] mb-2">
                  Data de Início do Período
                </label>
                <input
                  type="date"
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-slate-600 focus:border-[#004785] focus:ring-1 focus:ring-[#004785] outline-none transition-all hover:border-slate-300"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eef4ff] flex items-center justify-center shrink-0 mt-1">
                <Calendar className="w-6 h-6 text-[#004785]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#004785] mb-2">
                  Data de Término do Período
                </label>
                <input
                  type="date"
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-slate-600 focus:border-[#004785] focus:ring-1 focus:ring-[#004785] outline-none transition-all hover:border-slate-300"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <Button
              onClick={exportToExcel}
              disabled={loading}
              className="bg-[#004785] hover:bg-[#003566] text-white px-10 py-7 rounded-xl font-bold text-base flex items-center gap-4 transition-all hover:scale-105 shadow-md disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Download className="w-6 h-6" />
              )}
              {loading ? "Processando dados..." : "Exportar para Excel (.xlsx)"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
          <div className="bg-[#f4f8ff] border border-blue-100 rounded-2xl p-6 sm:p-8 flex items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-[#004785] flex items-center justify-center shrink-0 shadow-sm mt-1 sm:mt-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#004785] mb-1.5">
                Dica para Power BI:
              </h4>
              <p className="text-sm text-[#004785]/80 leading-relaxed">
                Esta planilha é gerada em formato de tabela plana. Ao importar no Power BI, utilize o <em>Power Query</em> para transformar a coluna "Data de Início" em tipo Data e a "Carga Horária" em Número Decimal para criar seus gráficos de produtividade.
              </p>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-xl font-black text-[#004785] tracking-tighter flex items-center gap-1">
              <span>SUS</span>
              <div className="w-4 h-4 bg-[#004785] rounded-sm flex items-center justify-center text-white">
                <div className="w-2 h-0.5 bg-white rounded-full"></div>
                <div className="h-2 w-0.5 bg-white absolute rounded-full"></div>
              </div>
            </div>
            <div className="border-l border-slate-300 pl-4">
              <p className="text-sm font-bold text-slate-700">MINISTÉRIO DA SAÚDE</p>
              <p className="text-[10px] text-slate-500">Secretaria Executiva | COTRE/PE | DITRE/PE</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="#" className="hover:text-[#004785] transition-colors">Termos de Privacidade</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[#004785] transition-colors">Suporte Técnico</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[#004785] transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" /> arthur.moreira@saude.gov.br
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}