"use client";

import React, { useState } from "react";
import { X, MessageCircle, MessageSquare, Calendar, Clock, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatModal from "@/components/demanda/chatModal";
import ObservationModal from "@/components/demanda/observationModal";

export default function TasksDetailsModal({ task, isOpen, onClose }) {

  const [chatOpen, setChatOpen] = useState(false);

  const [obsOpen, setObsOpen] = useState(false);

  if (!isOpen || !task) return null;

  const statusColors = {

    concluida: "bg-emerald-100 text-emerald-700 border-emerald-200",

    em_andamento: "bg-blue-100 text-[#004785] border-blue-200",

    atrasada: "bg-red-100 text-red-700 border-red-200",

    pendente: "bg-amber-100 text-amber-700 border-amber-200",

    nao_iniciado: "bg-slate-100 text-slate-700 border-slate-200",

  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-[#004785]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Detalhes da Demanda</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-[#004785] leading-tight">{task.descricao}</h2>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-400" />

                  Produto: <span className="font-bold text-slate-700">{task.produto}</span>
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[task.status] || 'bg-slate-100 text-slate-700'}`}>

                {task.status ? task.status.replace('_', ' ') : 'indefinido'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<User className="w-4 h-4" />} label="Funcionário" value={task.funcionario_nome} />
              <InfoCard icon={<Calendar className="w-4 h-4" />} label="Atribuído em" value={task.created_at ? new Date(task.created_at).toLocaleDateString('pt-BR') : '-'} />
              <InfoCard

                icon={<Clock className="w-4 h-4 text-amber-600" />}

                label="Prazo Final"

                value={task.due_datetime ? new Date(task.due_datetime).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'A definir'}

                valueColor="text-amber-700"

              />
              <InfoCard icon={<Clock className="w-4 h-4" />} label="Carga Horária" value={task.expected_time ? `${task.expected_time}h` : '-'} />
            </div>

            {(task.processo || task.convenio) && (
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4" /> Informações Adicionais
                </h4>

                {task.processo && (
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-800">Processo:</strong> <span className="text-[#004785] hover:underline cursor-pointer">{task.processo}</span>
                  </p>

                )}

                {task.convenio && (
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-800">{task.conv_type || 'Convênio'}:</strong> {task.convenio} {task.conv_year && `| ${task.conv_year}`}
                  </p>

                )}

                {task.convenente && (
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-800">{task.conv_type === 'TED' ? 'Parceiro' : 'Convenente'}:</strong> {task.convenente}
                  </p>

                )}
              </div>

            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
            <Button

              onClick={() => setChatOpen(true)}

              className="flex-1 bg-[#004785] hover:bg-[#003566] text-white font-bold gap-2 py-6 rounded-xl shadow-sm"
            >
              <MessageCircle className="w-5 h-5" /> Abrir Chat
            </Button>
            <Button

              onClick={() => setObsOpen(true)}

              variant="outline"

              className="flex-1 gap-2 py-6 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-white shadow-sm"
            >
              <MessageSquare className="w-5 h-5 text-emerald-600" /> Observações
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

function InfoCard({ icon, label, value, valueColor = "text-slate-800" }) {

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">

        {icon} {label}
      </div>
      <p className={`text-sm font-black ${valueColor} truncate`}>{value}</p>
    </div>

  );

}
