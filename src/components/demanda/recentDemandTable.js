'use client';

import React, { useState } from "react";
import { 
  ExternalLink, 
  Clock, 
  Loader2, 
  MessageSquare, 
  Trash2, 
  MessageCircle, 
  Archive,
  ClipboardList,
  ArrowRight,
  FileText,
  Edit,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { toast } from 'sonner';
import ObservationModal from "../demanda/observationModal";
import ChatModal from "../demanda/chatModal";
import { useUnreadChat } from "../../hooks/useUnreadChat";
import { useArchiveTask } from "../../hooks/useArchiveTask";

export default function DemandasRecentesTable({ demandas, isAdmin, onEdit }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  const [simplifiedView, setSimplifiedView] = useState(false);

  const [obsModalOpen, setObsModalOpen] = useState(false);
  const [selectedTaskForObs, setSelectedTaskForObs] = useState(null);

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedTaskForChat, setSelectedTaskForChat] = useState(null);

  const { unreadMap, markAsRead } = useUnreadChat(demandas);
  const { archiveTask } = useArchiveTask();

  const STATUS_OPTIONS = [
    { value: "nao_iniciado", label: "Não Iniciada", color: "bg-slate-100 text-slate-600" },
    { value: "pendente", label: "Pendente", color: "bg-amber-100 text-amber-700" },
    { value: "em_andamento", label: "Em Andamento", color: "bg-blue-100 text-[#004785]" },
    { value: "concluida", label: "Concluída", color: "bg-emerald-100 text-emerald-700" },
    { value: "atrasada", label: "Atrasada", color: "bg-red-100 text-red-600" },
  ];

  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  async function logAction(taskId, field, oldVal, newVal, description) {
    try {
      await supabase.from('task_history').insert([{
        task_id: taskId,
        user_id: user?.id,
        user_name: user?.full_name || 'Usuário',
        user_role: user?.role || 'employee',
        field_changed: field,
        old_value: oldVal,
        new_value: newVal,
        description: description
      }]);
    } catch (err) {
      console.error("Erro ao gravar log:", err);
    }
  }

  function openObservationModal(task) {
    setSelectedTaskForObs(task);
    setObsModalOpen(true);
  }

  function openChatModal(task) {
    setSelectedTaskForChat(task);
    setChatModalOpen(true);
  }

  async function handleQuickComplete(taskId, isFinalizado) {
    setUpdatingId(taskId);
    try {
      const novoEstado = !isFinalizado;
      
      const { error } = await supabase.from("tasks").update({ 
        is_finalizado: novoEstado 
      }).eq("id", taskId);
      
      if (error) throw error;
      
      toast.success(novoEstado ? "Demanda finalizada!" : "Demanda reaberta!");
      queryClient.invalidateQueries(["demandas"]);
    } catch (error) {
      toast.error("Erro: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    setUpdatingId(taskId);
    try {
      const { data: currentTask } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', taskId)
        .single();

      if (!currentTask) throw new Error("Tarefa não encontrada.");

      const updateData = { status: newStatus };

      if (newStatus === "concluida") {
        updateData.completed_at = new Date().toISOString();
      } else if (currentTask.status === "concluida") {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from("tasks")
        .update(updateData)
        .eq("id", taskId);
      if (error) throw error;

      if (currentTask.status !== newStatus) {
        await logAction(
          taskId,
          'status',
          currentTask.status,
          newStatus,
          `Status alterado de "${currentTask.status}" para "${newStatus}"`
        );
      }

      toast.success("Status atualizado!");
      queryClient.invalidateQueries(["demandas"]);

      if (newStatus === "concluida") {
        const taskCompleta = demandas.find(d => d.id === taskId);
        if (taskCompleta) {
          setSelectedTaskForObs(taskCompleta);
          setObsModalOpen(true);
        }
      }
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

      await logAction(taskId, 'delete', taskDescricao, 'EXCLUÍDO', 'Demanda excluída do sistema');

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
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#004785]" />
          <h2 className="text-lg font-bold text-[#004785]">Demandas Recentes</h2>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors">
          Ver todas <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr className="border-b border-slate-100">
              <th className="px-5 py-4">Funcionário</th>
              <th className="px-5 py-4">Demanda / Produto</th>
              <th className="px-5 py-4">Processo</th>
              <th className="px-5 py-4">Convênio</th>
              <th className="px-5 py-4">Início / Término</th>
              <th className="px-5 py-4">Carga Horária</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demandas.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 py-20 text-center text-slate-500">Nenhuma demanda encontrada.</td>
              </tr>
            ) : (
              demandas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#004785] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {getInitials(item.funcionario_nome)}
                      </div>
                      <span className="font-medium text-slate-700">{item.funcionario_nome}</span>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-sm text-[#004785] truncate max-w-[220px]" title={item.descricao}>
                        {item.descricao}
                      </p>
                      <p className="text-[11px] text-slate-500">{item.produto}</p>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4 whitespace-nowrap">
                    {item.processo && item.processo.length >= 4 && item.processo !== "0000000" ? (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.processo);
                          toast.success("Número do processo copiado!");
                        }}
                        className="flex items-center gap-1 text-[#004785] hover:underline text-xs font-medium transition-all"
                      >
                        {item.processo} <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  
                  <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                    {item.convenio ? `${item.convenio} ${item.conv_year ? `| ${item.conv_year}` : ""}` : "-"}
                  </td>
                  
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <p><span className="font-bold text-[#004785]">Início:</span> {item.start_date || "-"}</p>
                      <p><span className="font-bold text-[#004785]">Término:</span> {item.expected_date || "-"}</p>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium">
                        {(item.expected_time !== null && item.expected_time !== undefined && item.expected_time !== "")
                          ? `${item.expected_time}h`
                          : "-"}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="relative">
                      {updatingId === item.id && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                          <Loader2 className="w-3 h-3 animate-spin text-[#004785]" />
                        </div>
                      )}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        disabled={updatingId === item.id || (!isAdmin && item.funcionario_id !== user?.id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide outline-none cursor-pointer appearance-none border-none text-center
                          ${STATUS_OPTIONS.find(opt => opt.value === item.status)?.color || "bg-slate-100"}
                        `}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      
                      <button
                        onClick={() => {
                          openChatModal(item);
                          markAsRead(item.id);
                        }}
                        title="Chat da demanda"
                        className="relative w-8 h-8 rounded bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {unreadMap[item.id] > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm animate-pulse">
                            {unreadMap[item.id]}
                          </span>
                        )}
                      </button>

                      {!isAdmin && (
                        <button
                          onClick={() => openObservationModal(item)}
                          title="Observações"
                          className="w-8 h-8 rounded bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(item)}
                            title="Editar demanda"
                            className="w-8 h-8 rounded bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleQuickComplete(item.id, item.is_finalizado)}
                            disabled={updatingId === item.id}
                            title={item.is_finalizado ? "Reabrir demanda" : "Finalizar demanda"}
                            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                              item.is_finalizado
                                ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Arquivar a demanda "${item.descricao}"?\n\nA demanda sumirá da tela principal, mas pode ser restaurada depois em "Arquivadas".`)) {
                                archiveTask(item.id);
                              }
                            }}
                            title="Arquivar demanda"
                            className="w-8 h-8 rounded bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-700 flex items-center justify-center transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          <button
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id, item.descricao)}
                            title="Excluir demanda"
                            className="w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center justify-center transition-colors"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ObservationModal
        taskId={selectedTaskForObs?.id}
        taskDescricao={selectedTaskForObs?.descricao}
        isOpen={obsModalOpen}
        onClose={() => setObsModalOpen(false)}
      />

      <ChatModal
        taskId={selectedTaskForChat?.id}
        taskDescricao={selectedTaskForChat?.descricao}
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
      />
    </section>
  );
}