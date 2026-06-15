'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Calendar, Loader2, Download } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Relatórios de Produtividade</h1>
        <p className="text-muted-foreground">
          Exporte as demandas para análise no Power BI
        </p>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Data de Início do Período
              </label>
              <input 
                type="date" 
                className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Data de Término do Período
              </label>
              <input 
                type="date" 
                className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button 
              onClick={exportToExcel} 
              disabled={loading}
              className="bg-[#004785] hover:bg-[#003566] text-white px-8 py-6 gap-3 text-lg shadow-lg transition-all hover:scale-105"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-5 h-5" />
              )}
              {loading ? "Processando dados..." : "Exportar para Excel (.xlsx)"}
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Dica para Power BI:</strong> Esta planilha é gerada em formato de tabela plana. 
              Ao importar no Power BI, utilize o <em>Power Query</em> para transformar a coluna "Data de Início" em tipo Data e a "Carga Horária" em Número Decimal para criar seus gráficos de produtividade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}