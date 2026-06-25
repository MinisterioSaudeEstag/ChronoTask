'use client';

import React, { useState } from "react";
import { ExternalLink, Clock, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { toast } from 'sonner';

export default function DemandasRecentesTable({ demandas, isAdmin, onEdit }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const STATUS_OPTIONS = [
    { value: "pendente", label: "Pendente", color: "bg-amber-100 text-amber-700" },
    { value: "em_andamento", label: "Em Andamento", color: "bg-blue-100 text-blue-700" },
    { value: "concluida", label: "Concluída", color: "bg-emerald-100 text-emerald-700" },
    { value: "atrasada", label: "Atrasada", color: "bg-red-100 text-red-700" },
  ];

  async function handleAddObservation(taskId) {
    const observation = window.prompt("Insira a observação ou devolutiva da demanda:");
    if (observation === null) return;
    if (observation.trim() === "") return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ observation })
        .eq("id", taskId);

      if (error) throw error;
      toast.success("Observação salva!");
      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      toast.error("Erro ao salvar observação: " + error.message);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    let observation = "";
    if (newStatus === "concluida") {
      observation = window.prompt("Sua demanda foi concluída. Por favor, insira a observação final:");
      if (observation === null) return;
      if (observation.trim() === "") {
        toast.error("A observação é obrigatória para concluir!");
        return;
      }
    }

    setUpdatingId(taskId);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, observation: observation || undefined })
        .eq("id", taskId);

      if (error) throw error;
      toast.success("Status atualizado!");
      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      toast.error("Erro: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(taskId, taskDescricao) {
    const confirmar = window.confirm(`Tem certeza que deseja EXCLUIR a demanda "${taskDescricao}"?\n\nEsta ação não pode ser desfeita.`);
    if (!confirmar) return;

    try {
      setDeletingId(taskId);
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Demanda excluída com sucesso!");
      queryClient.invalidateQueries(["demandas"]);
      queryClient.invalidateQueries(["equipe"]);
    } catch (error) {
      toast.error("Erro ao deletar: " + error.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4">

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground uppercase text-[10px] font-bold">
            <tr className="border-b border-white/5">
              <th className="px-4 py-3">Funcionário</th>
              <th className="px-4 py-3">Demanda / Produto</th>
              <th className="px-4 py-3">Processo</th>
              <th className="px-4 py-3">Convênio</th>
              <th className="px-4 py-3">Início / Término</th>
              <th className="px-4 py-3">Carga Horária</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {demandas.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-20 text-center">Nenhuma demanda encontrada.</td>
              </tr>
            ) : (
              demandas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.funcionario_nome}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium truncate max-w-[200px]">{item.descricao}</p>
                      {item.observation && (
                        <div className="flex items-start gap-1 text-[10px] italic text-emerald-600 dark:text-emerald-400">
                          <MessageSquare className="w-3 h-3 mt-0.5" /> {item.observation}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{item.produto}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {item.processo && item.processo.length >= 4 && item.processo !== "0000000" ? (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.processo);
                          toast.success("Número do processo copiado!");
                        }}
                        className="flex items-center gap-1 text-primary hover:underline font-medium transition-all hover:scale-105"
                      >
                        {item.processo} <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 text-xs italic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Não informado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {item.convenio ? `${item.convenio} ${item.conv_year ? `| ${item.conv_year}` : ""}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">Início: {item.start_date || "-"}</p>
                    <p className="text-xs font-semibold">Retorno: {item.expected_date || "-"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">
                        {(item.expected_time !== null && item.expected_time !== undefined && item.expected_time !== "")
                          ? `${item.expected_time}h`
                          : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative max-w-[140px]">
                      {updatingId === item.id && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10">
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                        </div>
                      )}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        disabled={updatingId === item.id || (!isAdmin && item.funcionario_id !== user?.id)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase outline-none cursor-pointer appearance-none border-none
                          ${STATUS_OPTIONS.find(opt => opt.value === item.status)?.color || "bg-slate-100"}
                        `}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {!isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                        onClick={() => handleAddObservation(item.id)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" /> obs
                      </Button>
                    )}

                    {isAdmin && (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 px-2 cursor-pointer" onClick={() => onEdit(item)}>
                          Editar
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === item.id}
                          className="h-8 px-2 bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                          onClick={() => handleDelete(item.id, item.descricao)}
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}