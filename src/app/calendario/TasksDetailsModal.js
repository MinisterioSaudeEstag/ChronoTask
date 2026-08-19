"use client";
import React, { useState } from "react";
import { X, MessageCircle, MessageSquare, Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatModal from "../../components/demanda/chatModal";
import ObservationModal from "../../components/demanda/observationModal";

export default function TaskDetailsModal({ task, isOpen, onClose }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [obsOpen, setObsOpen] = useState(false);

  if (!isOpen || !task) return null;

  const statusColors = {
    concluida: "bg-emerald-100 text-emerald-700 border-emerald-200",
    em_andamento: "bg-blue-100 text-blue-700 border-blue-200",
    atrasada: "bg-red-100 text-red-700 border-red-200",
    pendente: "bg-amber-100 text-amber-700 border-amber-200",
    nao_iniciado: "bg-slate-200 text-slate-700 border-slate-300",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
          
          <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-900 dark:text-white">Detalhes da Demanda</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{task.descricao}</h2>
                <p className="text-sm text-slate-500 mt-1">Produto: <span className="font-medium text-slate-700 dark:text-slate-300">{task.produto}</span></p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[task.status] || 'bg-slate-100 text-slate-700'}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard icon={<User className="w-4 h-4" />} label="Funcionário" value={task.funcionario_nome} />
              <InfoCard icon={<Calendar className="w-4 h-4" />} label="Atribuído em" value={new Date(task.created_at).toLocaleDateString('pt-BR')} />
              <InfoCard 
                icon={<Clock className="w-4 h-4" />} 
                label="Prazo Final" 
                value={task.due_datetime ? new Date(task.due_datetime).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'A definir'} 
              />
              <InfoCard icon={<Clock className="w-4 h-4" />} label="Carga Horária" value={task.expected_time ? `${task.expected_time}h` : '-'} />
            </div>

            {(task.processo || task.convenio) && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase">Informações Adicionais</h4>
                {task.processo && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>Processo:</strong> {task.processo}
                  </p>
                )}
                {task.convenio && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{task.conv_type || 'Convênio'}:</strong> {task.convenio} {task.conv_year && `| ${task.conv_year}`}
                  </p>
                )}
                {task.convenente && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <strong>{task.conv_type === 'TED' ? 'Parceiro' : 'Convenente'}:</strong> {task.convenente}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 flex gap-2">
            <Button 
              onClick={() => setChatOpen(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Abrir Chat
            </Button>
            <Button 
              onClick={() => setObsOpen(true)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Observações
            </Button>
          </div>
        </div>
      </div>

      <ChatModal
        taskId={task.id}
        taskDescricao={task.descricao}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
      <ObservationModal
        taskId={task.id}
        taskDescricao={task.descricao}
        isOpen={obsOpen}
        onClose={() => setObsOpen(false)}
      />
    </>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-white/5">
      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {icon} {label}
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1 truncate">{value}</p>
    </div>
  );
}