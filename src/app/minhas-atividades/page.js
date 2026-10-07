'use client';

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock, Calendar, FileText, CheckCircle2,
  MessageSquare, AlertTriangle, Target, Filter,
  ChevronRight, MoreVertical, ClipboardList, PlayCircle,
  ChevronDown, Search, CheckCheck
} from "lucide-react";
import { toast } from 'sonner';

export default function MinhasAtividades() {
  const { user } = useAuth();
  const [concludingId, setConcludingId] = useState(null);
  const [observation, setObservation] = useState("");
  const [activeTab, setActiveTab] = useState("todas"); 

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["my_tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("funcionario_id", user.id)
        .order("due_datetime", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  async function handleAddObservation(taskId) {
    const obs = window.prompt("Escreva sua observação ou devolutiva:");
    if (obs === null || obs.trim() === "") return;
    try {
      const { error } = await supabase.from("tasks").update({ observation: obs }).eq("id", taskId);
      if (error) throw error;
      toast.success("Observação enviada ao Admin!");
    } catch (error) {
      toast.error("Erro: " + error.message);
    }
  }

  async function handleCompleteTask(taskId) {
    if (!observation.trim()) {
      toast.error("Por favor, adicione uma observação de conclusão.");
      return;
    }
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "concluida", observation: observation })
        .eq("id", taskId);
      if (error) throw error;
      toast.success("Tarefa concluída com sucesso!");
      setConcludingId(null);
      setObservation("");
    } catch (error) {
      toast.error("Erro: " + error.message);
    }
  }

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      em_andamento: tasks.filter(t => t.status === 'em_andamento').length,
      atrasadas: tasks.filter(t => t.status === 'atrasada').length,
      concluidas: tasks.filter(t => t.status === 'concluida').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeTab === "em_andamento") return tasks.filter(t => t.status === 'em_andamento');
    if (activeTab === "atrasadas") return tasks.filter(t => t.status === 'atrasada');
    if (activeTab === "concluidas") return tasks.filter(t => t.status === 'concluida');
    return tasks;
  }, [tasks, activeTab]);

  const getInitials = (name) => {
    if (!name) return "AV";
    const names = name.trim().split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getTempoRestante = (dueDate, status) => {
    if (status === 'concluida') return { text: "Finalizado", color: "text-emerald-600" };
    if (!dueDate) return { text: "Sem prazo", color: "text-slate-500" };
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: `Atrasada há ${Math.abs(diffDays)} dia(s)`, color: "text-red-600" };
    if (diffDays === 0) return { text: "Vence hoje", color: "text-amber-600" };
    return { text: `Restam ${diffDays} dia(s)`, color: "text-[#004785]" };
  };

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });

  if (isLoading) return <div className="flex justify-center items-center h-screen text-slate-500">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2 text-[#004785]">
                <Filter className="w-5 h-5" />
                <h3 className="font-bold text-lg">Filtros</h3>
              </div>
              <button className="text-xs text-blue-600 font-medium hover:underline">Limpar filtros</button>
            </div>

            <div className="space-y-5">
              <FilterSelect label="Tipo de produto" icon={<ClipboardList className="w-4 h-4" />} placeholder="Todos os tipos" />
              <FilterSelect label="Status" icon={<Clock className="w-4 h-4" />} placeholder="Todos os status" />
              <FilterSelect label="Prazo de finalização" icon={<Calendar className="w-4 h-4" />} placeholder="Selecione o período" />
              <FilterSelect label="Data de atribuição" icon={<Calendar className="w-4 h-4" />} placeholder="Selecione o período" />
              <FilterSelect label="Convênio / Processo" icon={<FileText className="w-4 h-4" />} placeholder="Todos os convênios" />
              <FilterSelect label="Responsável" icon={<CheckCircle2 className="w-4 h-4" />} placeholder="Todos os responsáveis" />
            </div>

            <button className="w-full mt-8 bg-[#004785] hover:bg-[#003566] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
              <Filter className="w-4 h-4" /> Aplicar filtros
            </button>
          </div>
        </div>

        <div className="xl:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-[#004785] rounded-xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#004785]">Minhas Atividades</h1>
                <p className="text-sm text-slate-500">Acompanhe todas as suas demandas, prazos e status de execução.</p>
              </div>
            </div>
            <div className="hidden md:flex relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Buscar por demanda, convênio..." className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-[#004785]" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<ClipboardList className="w-5 h-5" />} value={stats.total} label="Total de demandas" color="text-blue-600" bg="bg-blue-100" />
            <StatCard icon={<PlayCircle className="w-5 h-5" />} value={stats.em_andamento} label="Em andamento" color="text-emerald-600" bg="bg-emerald-100" />
            <StatCard icon={<AlertTriangle className="w-5 h-5" />} value={stats.atrasadas} label="Atrasadas" color="text-red-500" bg="bg-red-100" />
            <StatCard icon={<CheckCircle2 className="w-5 h-5" />} value={stats.concluidas} label="Concluídas" color="text-green-600" bg="bg-green-100" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <TabButton active={activeTab === 'todas'} onClick={() => setActiveTab('todas')} color="blue" label="Todas" />
              <TabButton active={activeTab === 'em_andamento'} onClick={() => setActiveTab('em_andamento')} color="blue" dot label="Em andamento" />
              <TabButton active={activeTab === 'atrasadas'} onClick={() => setActiveTab('atrasadas')} color="red" dot label="Atrasadas" />
              <TabButton active={activeTab === 'concluidas'} onClick={() => setActiveTab('concluidas')} color="green" dot label="Concluídas" />
            </div>
            <div className="flex items-center gap-2 shrink-0 border-l border-slate-100 pl-4">
              <span className="text-xs text-slate-500">Ordenar por</span>
              <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Prazo mais próximo <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <Card className="border-dashed border-2 p-12 text-center shadow-none bg-transparent">
                <CheckCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhuma atividade encontrada para este filtro.</p>
              </Card>
            ) : (
              filteredTasks.map((task) => {
                const isConcluding = concludingId === task.id;
                const statusColor = task.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'em_andamento' ? 'bg-blue-100 text-[#004785]' :
                    task.status === 'atrasada' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700';
                const timeInfo = getTempoRestante(task.due_datetime, task.status);

                return (
                  <div key={task.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#004785]/30 transition-all group">
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative">
                      <div className="w-12 h-12 rounded-full bg-[#004785] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                        {task.status === 'concluida' ? <ClipboardList className="w-5 h-5" /> : getInitials(user?.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-slate-800 text-base truncate pr-4">{task.descricao}</h3>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          Convênio {task.convenio || "-"} &nbsp;•&nbsp; Processo {task.processo || "-"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                          <FileText className="w-3 h-3" /> Tipo: {task.produto}
                        </p>
                      </div>

                      <div className="shrink-0 hidden md:block w-32">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="shrink-0 flex flex-col gap-2 min-w-[160px]">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-500 font-semibold leading-tight">Prazo de finalização</p>
                            <p className="text-xs font-bold text-slate-700">
                              {task.due_datetime ? new Date(task.due_datetime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'A definir'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${timeInfo.color} shrink-0`} />
                          <p className={`text-[11px] font-bold ${timeInfo.color}`}>{timeInfo.text}</p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 border-l border-slate-100 pl-2">
                        <button onClick={() => setConcludingId(isConcluding ? null : task.id)} className="p-2 text-slate-400 hover:text-[#004785] transition-colors rounded-full hover:bg-slate-50">
                          <ChevronRight className={`w-5 h-5 transition-transform ${isConcluding ? 'rotate-90' : ''}`} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-[#004785] transition-colors rounded-full hover:bg-slate-50">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                    </div>

                    {isConcluding && (
                      <div className="bg-slate-50 border-t border-slate-100 p-5 animate-in slide-in-from-top-2">
                        <div className="flex gap-4">
                          <div className="flex-1 space-y-3">
                            <label className="text-xs font-bold text-slate-700">Observação ou devolutiva da demanda:</label>
                            <textarea
                              placeholder="Insira a observação de entrega ou status atual..."
                              className="w-full p-3 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#004785]/20 focus:border-[#004785] resize-none"
                              rows="2"
                              value={observation}
                              onChange={(e) => setObservation(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2 pt-2">
                              {task.status !== 'concluida' && (
                                <Button size="sm" onClick={() => handleCompleteTask(task.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-4 shadow-sm">
                                  <CheckCircle2 className="w-4 h-4 mr-2" /> Confirmar Conclusão
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleAddObservation(task.id)} className="bg-white h-9 px-4 text-slate-700 border-slate-200 font-semibold shadow-sm">
                                <MessageSquare className="w-4 h-4 mr-2" /> Apenas Adicionar Observação
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm p-5 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:scale-110 transition-transform">
              <Target className="w-24 h-24 text-[#004785]" />
            </div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 bg-white rounded-full shadow-sm text-[#004785] shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#004785] mb-1 flex items-center justify-between">
                  Juntos por uma gestão mais eficiente <ChevronRight className="w-3 h-3" />
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  O ChronoTask ajuda sua equipe a entregar mais, com organização e transparência.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Calendar className="w-5 h-5 text-[#004785]" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Resumo do seu dia</h3>
                <p className="text-[10px] text-slate-500 capitalize">{diaSemana}, {dataFormatada}</p>
              </div>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <WidgetRow
                icon={<AlertTriangle className="w-4 h-4" />} color="red" bg="bg-red-50"
                value={tasks.filter(t => {
                  if (!t.due_datetime) return false;
                  const due = new Date(t.due_datetime);
                  const today = new Date();
                  return due.toDateString() === today.toDateString() && t.status !== 'concluida';
                }).length}
                label="Vencem hoje"
              />
              <WidgetRow
                icon={<ClipboardList className="w-4 h-4" />} color="blue" bg="bg-blue-50"
                value={stats.em_andamento}
                label="Em andamento"
              />
              <WidgetRow
                icon={<CheckCircle2 className="w-4 h-4" />} color="emerald" bg="bg-emerald-50"
                value={tasks.filter(t => {
                  if (!t.completed_at) return false;
                  return new Date(t.completed_at).toDateString() === new Date().toDateString();
                }).length}
                label="Concluídas hoje"
              />
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#f0f5ff] to-white rounded-xl border border-blue-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <Calendar className="w-10 h-10 text-[#004785] mb-4 opacity-80" />
            <p className="text-sm font-bold text-[#004785] italic leading-relaxed">
              "Planejamento é o primeiro passo para grandes resultados."
            </p>
            <div className="w-8 h-1 bg-[#004785] mt-4 rounded-full opacity-20"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, icon, placeholder }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold text-[#004785] mb-2">
        {icon} {label}
      </label>
      <div className="relative">
        <select className="w-full appearance-none bg-white border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#004785] cursor-pointer">
          <option>{placeholder}</option>
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
          {icon}
        </div>
        <div>
          <p className={`text-xl font-black leading-none mb-1 ${color === 'text-blue-600' ? 'text-slate-800' : 'text-slate-800'}`}>{value}</p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{label}</p>
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${color}`} />
    </div>
  );
}

function TabButton({ active, onClick, label, dot, color }) {
  const bgActive = color === 'blue' ? 'bg-[#004785] text-white' :
    color === 'red' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white';
  const dotColor = color === 'blue' ? 'bg-blue-500' :
    color === 'red' ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border
        ${active ? `${bgActive} border-transparent shadow-sm` : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
    >
      {!active && dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>}
      {label}
    </button>
  );
}

function WidgetRow({ icon, color, bg, value, label }) {
  const textColor = color === 'red' ? 'text-red-500' : color === 'blue' ? 'text-blue-500' : 'text-emerald-500';
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
      <div className={`w-8 h-8 rounded-full ${bg} ${textColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-base font-black text-slate-800 leading-none mb-0.5">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}