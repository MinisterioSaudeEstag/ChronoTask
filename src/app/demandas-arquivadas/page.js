"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Archive, RotateCcw, Calendar, User, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useArchiveTask } from "../../hooks/useArchiveTask";
import { toast } from "sonner";

export default function DemandasArquivadasPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { restoreTask } = useArchiveTask();

  const { data: arquivadas = [], isLoading } = useQuery({
    queryKey: ["tarefas_arquivadas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, profiles:admin_id(full_name)")
        .eq("archived", true) 
        .order("archived_at", { ascending: false });

      if (error) {
        console.error("Erro:", error);
        return [];
      }
      return data;
    },
    enabled: isAdmin, 
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream dark:bg-darkBg flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Archive className="w-16 h-16 mx-auto text-slate-300" />
            <h2 className="text-xl font-bold">Acesso Restrito</h2>
            <p className="text-slate-500 text-sm">
              Apenas administradores podem acessar o arquivo de demandas.
            </p>
            <Link href="/dashboard">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-8 transition-colors duration-300">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-700 rounded-xl shadow-sm">
            <Archive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demandas Arquivadas</h1>
            <p className="text-slate-500 text-sm">
              Histórico de demandas concluídas ou descontinuadas
            </p>
          </div>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-darkCard">
          <CardContent className="p-5 flex items-center gap-4">
            <Archive className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Arquivadas</p>
              <p className="text-2xl font-bold">{arquivadas.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Carregando arquivo...</div>
      ) : arquivadas.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center space-y-4">
            <Archive className="w-16 h-16 mx-auto text-slate-300" />
            <p className="text-slate-500 font-medium">Nenhuma demanda arquivada ainda.</p>
            <p className="text-xs text-slate-400">
              Quando você arquivar uma demanda, ela aparecerá aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">Demanda</th>
                  <th className="px-4 py-3">Funcionário</th>
                  <th className="px-4 py-3">Status Original</th>
                  <th className="px-4 py-3">Arquivada em</th>
                  <th className="px-4 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {arquivadas.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                        {task.descricao}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {task.produto}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {task.funcionario_nome}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {task.archived_at 
                        ? new Date(task.archived_at).toLocaleString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => {
                          if (confirm(`Restaurar a demanda "${task.descricao}"?\n\nEla voltará para a tela principal.`)) {
                            restoreTask(task.id);
                          }
                        }}
                      >
                        <RotateCcw className="w-3 h-3" /> Restaurar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}