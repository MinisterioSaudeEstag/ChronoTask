'use client';

import React, { useState } from "react";
import { ExternalLink, Clock, Loader2 } from "lucide-react";
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

  async function handleStatusChange(taskId, newStatus) {
    let observation = "";
    if (newStatus === "concluida") {
      observation = window.prompt("Insira a observação de conclusão:");
      if (observation === null) return;
      if (observation.trim() === "") {
        toast.error("Observação obrigatória!");
        return;
      }
    }
    setUpdatingId(taskId);
    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus, observation }).eq("id", taskId);
      if (error) throw error;
      queryClient.invalidateQueries(["demandas"]);
      toast.success("Atualizado!");
    } catch (error) {
      toast.error("Erro: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Demandas Recentes</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/60 bg-white dark:bg-slate-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-[10px] font-bold">
            <tr className="border-b border-white/5">
              <th className="px-4 py-4">Nº Demanda</th>
              <th className="px-4 py-4">Demandante / Projeto</th>
              <th className="px-4 py-4">Processo SEI</th>
              <th className="px-4 py-3">COTRE/PE</th>
              <th className="px-4 py-3">DITRE/PE</th>
              <th className="px-4 py-3">Status</th>
              {isAdmin && <th className="px-4 py-3 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {demandas.length === 0 ? (
              <tr><td colSpan="8" className="px-4 py-8 text-center text-muted-foreground">Nenhuma demanda encontrada.</td></tr>
            ) : (
              demandas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.funcionario_nome}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[200px]">{item.descricao}</p>
                    {item.observation && <p className="text-[10px] italic text-emerald-600 mt-1">Obs: {item.observation}</p>}
                    <p className="text-xs text-muted-foreground">{item.produto}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { navigator.clipboard.writeText(item.processo); toast.success("Copiado!"); }} className="flex items-center gap-1 text-primary hover:underline font-medium">
                      {item.processo} <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">
                    {item.convenio || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">Início: {item.start_date}</p>
                    <p className="text-xs font-semibold">Retorno: {item.expected_date}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" /> {item.expected_time}h
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
                      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onEdit(item)}>
                        Editar
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}