'use client';

import React, { useState } from "react";
import { ExternalLink, Clock, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { toast } from 'sonner';

export default function DemandasRecentesTable({ demandas, isAdmin, onEdit }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);

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
      toast.success("Observação adicionada!");
      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      toast.error("Erro ao salvar observação: " + error.message);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    let observation = "";
    if (newStatus === "concluida") {
      observation = window.prompt("Por favor, insira a observação de conclusão da demanda:");
      if (observation === null) return;
      if (observation.trim() === "") {
        toast.error("A observação é obrigatória para concluir a demanda!");
        return;
      }
    }

    setUpdatingId(taskId);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, observation })
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      toast.error("Erro ao atualizar status: " + error.message);
    } finally {
      setUpdatingId(null);
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
              {isAdmin && <th className="px-4 py-3 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {demandas.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <ClipboardList className="w-16 h-16 text-slate-600" />
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-slate-600 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-slate-300">Nenhuma demanda encontrada.</p>
                      <p className="text-sm text-slate-500">Você ainda não possui demandas registradas.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              demandas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.funcionario_nome}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{item.descricao}</p>
                    {item.observation && (
                      <p className="text-[10px] italic text-emerald-600 dark:text-emerald-400 mt-1">
                        Obs: {item.observation}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.produto}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.processo);
                        toast.success("Número do processo copiado!");
                      }}
                      className="flex items-center gap-1 text-primary hover:underline font-medium transition-all hover:scale-105"
                    >
                      {item.processo} <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {item.convenio ? `${item.convenio} ${item.conv_year ? `| ${item.conv_year}` : ""}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">Início: {item.start_date}</p>
                    <p className="text-xs font-semibold">Retorno: {item.expected_date}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" /> {item.expected_time}
                      <span>{item.expected_time ? `${item.expected_time}h` : "-"}</span>
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
                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                        onClick={() => onEdit(item)}
                      >
                        Editar
                      </Button>
                    </td>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    onClick={() => handleAddObservation(item.id)}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" /> obs
                  </Button>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}