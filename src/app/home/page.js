"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, User, ExternalLink, X, CheckCircle2,
  Calendar, MessageCircle, Search, ArrowLeft,
  MoreVertical, AlertTriangle, FileText, Target,
  PieChart, LayoutGrid, Clock, ClipboardList, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ChatModal from "../../components/demanda/chatModal";
import { useUnreadChat } from "../../hooks/useUnreadChat";

export default function HomeEquipe() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedTaskForChat, setSelectedTaskForChat] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");

  const { data: equipe = [], isLoading: loadingEquipe } = useQuery({
    queryKey: ["equipe_list"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").neq("role", "admin");
      return data || [];
    },
  });

  const { data: allTasks = [] } = useQuery({
    queryKey: ["all_team_tasks_stats"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("funcionario_id, status");
      return data || [];
    },
  });

  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks_member", selectedEmployee?.id],
    queryFn: async () => {
      if (!selectedEmployee) return [];
      const { data } = await supabase
        .from("tasks")
        .select("*, profiles:admin_id(full_name), completed_at")
        .eq("funcionario_id", selectedEmployee.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selectedEmployee,
  });

  const { unreadMap } = useUnreadChat(tasks);

  const getInitials = (name) => {
    if (!name) return "??";
    const names = name.trim().split(' ');
    if (names.length >= 2) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getStats = (employeeId) => {
    const empTasks = allTasks.filter(t => t.funcionario_id === employeeId);
    return {
      em_andamento: empTasks.filter(t => t.status === 'em_andamento').length,
      atrasadas: empTasks.filter(t => t.status === 'atrasada').length,
      concluidas: empTasks.filter(t => t.status === 'concluida').length,
    };
  };

  const globalStats = useMemo(() => {
    return {
      em_andamento: allTasks.filter(t => t.status === 'em_andamento').length,
      atrasadas: allTasks.filter(t => t.status === 'atrasada').length,
      concluidas: allTasks.filter(t => t.status === 'concluida').length,
    };
  }, [allTasks]);

  const filteredEquipe = equipe.filter(emp =>
    emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.descricao.toLowerCase().includes(taskSearchTerm.toLowerCase()) ||
    (task.processo && task.processo.toLowerCase().includes(taskSearchTerm.toLowerCase())) ||
    (task.convenio && task.convenio.toLowerCase().includes(taskSearchTerm.toLowerCase()))
  );

  if (loadingEquipe) return <div className="flex justify-center items-center h-screen text-slate-500">Carregando equipe...</div>;

  if (selectedEmployee) {
    const empStats = {
      em_andamento: tasks.filter(t => t.status === 'em_andamento').length,
      atrasadas: tasks.filter(t => t.status === 'atrasada').length,
      concluidas: tasks.filter(t => t.status === 'concluida').length,
      total: tasks.length
    };

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 lg:p-8 transition-colors duration-300 animate-in fade-in">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <button
            onClick={() => setSelectedEmployee(null)}
            className="flex items-center gap-2 text-[#004785] font-semibold text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o painel da equipe
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-[#004785] flex items-center justify-center text-xl font-black border-2 border-white shadow-sm">
                {selectedEmployee.avatar_url ? (
                  <img src={selectedEmployee.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
                ) : getInitials(selectedEmployee.full_name)}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#004785]">{selectedEmployee.full_name}</h1>
                <p className="text-slate-500 text-sm">Integrante da equipe</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <StatCard icon={<ClipboardList className="w-5 h-5" />} value={empStats.em_andamento} label="Em andamento" color="text-blue-600" bg="bg-blue-100" />
              <StatCard icon={<AlertTriangle className="w-5 h-5" />} value={empStats.atrasadas} label="Atrasadas" color="text-red-500" bg="bg-red-100" />
              <StatCard icon={<CheckCircle2 className="w-5 h-5" />} value={empStats.concluidas} label="Concluídas" color="text-green-600" bg="bg-green-100" />
              <StatCard icon={<FileText className="w-5 h-5" />} value={empStats.total} label="Total de atividades" color="text-slate-600" bg="bg-slate-100" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Busca por nome, convênio, processo ou descrição da atividade..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#004785]"
                value={taskSearchTerm}
                onChange={(e) => setTaskSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <FilterSelect label="Período" value="Todos" icon={<Calendar className="w-4 h-4" />} />
              <FilterSelect label="Status" value="Todos" icon={<Filter className="w-4 h-4" />} />
              <button className="flex items-center gap-2 px-4 py-2 text-[#004785] border border-[#004785] rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                <Filter className="w-4 h-4" /> Limpar filtros
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#004785]" />
              <h2 className="font-bold text-lg text-[#004785]">Atividades</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Descrição da Atividade</th>
                    <th className="px-6 py-4">Convênio / Processo</th>
                    <th className="px-6 py-4">Prazo Final</th>
                    <th className="px-6 py-4">Atribuído Por</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingTasks ? (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">Buscando atividades...</td></tr>
                  ) : filteredTasks.length === 0 ? (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">Nenhuma atividade encontrada.</td></tr>
                  ) : (
                    filteredTasks.map(task => {
                      const isAtrasada = task.status === 'atrasada';
                      const isConcluida = task.status === 'concluida';
                      const isAndamento = task.status === 'em_andamento';

                      return (
                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                ${isConcluida ? 'bg-green-100 text-green-600' :
                                  isAtrasada ? 'bg-red-100 text-red-600' :
                                    isAndamento ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-[#004785] text-xs max-w-[150px] truncate" title={task.produto}>{task.produto}</p>
                                <p className="text-[10px] text-slate-500">{task.produto}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-700 text-xs max-w-[200px] truncate" title={task.descricao}>{task.descricao}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
                              {task.produto}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                {task.processo ? (
                                  <button onClick={() => { navigator.clipboard.writeText(task.processo); toast.success("Copiado!"); }} className="text-[#004785] font-semibold text-xs hover:underline">
                                    {task.processo}
                                  </button>
                                ) : <p className="text-slate-400 text-xs italic">Sem processo</p>}
                                <p className="text-[10px] text-slate-500 mt-0.5">Convênio {task.convenio || "N/A"}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-slate-700 text-xs">
                                  {task.due_datetime ? new Date(task.due_datetime).toLocaleDateString('pt-BR') : 'A definir'}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {task.due_datetime ? `às ${new Date(task.due_datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-[#004785] flex items-center justify-center text-[10px] font-bold">
                                {getInitials(task.profiles?.full_name || "Admin")}
                              </div>
                              <span className="text-xs font-semibold text-slate-700">{task.profiles?.full_name?.split(" ")[0] || "Admin"}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                ${isConcluida ? 'bg-emerald-100 text-emerald-700' :
                                isAndamento ? 'bg-blue-100 text-blue-700' :
                                  isAtrasada ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedTaskForChat(task);
                                  setChatModalOpen(true);
                                }}
                                className="relative p-1.5 text-[#004785] hover:bg-blue-50 rounded-md transition-colors"
                                title="Abrir Chat"
                              >
                                <MessageCircle className="w-4 h-4" />
                                {unreadMap[task.id] > 0 && (
                                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm">
                                    {unreadMap[task.id]}
                                  </span>
                                )}
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-[#004785] hover:bg-slate-50 rounded-md transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <p>Mostrando {filteredTasks.length} atividades</p>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100">&lt;</button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-[#004785] text-white font-bold">1</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 font-medium">2</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100">&gt;</button>
              </div>
            </div>
          </div>

        </div>

        <ChatModal
          taskId={selectedTaskForChat?.id}
          taskDescricao={selectedTaskForChat?.descricao}
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8">
        <div className="xl:col-span-9 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-[#004785] rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#004785]">Painel de Equipe</h1>
                <p className="text-sm text-slate-500 mt-0.5">Visualize os integrantes da sua equipe, acompanhe as atividades e mantenha o trabalho sempre organizado.</p>
              </div>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Busca por nome"
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#004785] shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipe.map(emp => {
              const stats = getStats(emp.id);
              return (
                <Card
                  key={emp.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#004785]/30 transition-all group overflow-hidden flex flex-col"
                >
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#004785] flex items-center justify-center text-lg font-black shrink-0 shadow-inner">
                          {emp.avatar_url ? (
                            <img src={emp.avatar_url} className="w-full h-full rounded-full object-cover" alt={emp.full_name} />
                          ) : getInitials(emp.full_name)}
                        </div>
                        <p className="font-bold text-[#004785] text-sm leading-tight truncate group-hover:text-blue-700 transition-colors">
                          {emp.full_name}
                        </p>
                      </div>
                      <button className="text-slate-400 hover:text-[#004785] shrink-0 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-base font-black text-slate-800 leading-none">{stats.em_andamento}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider text-center">Em andamento</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-base font-black text-slate-800 leading-none">{stats.atrasadas}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider text-center">Atrasadas</span>
                      </div>
                      <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span className="text-base font-black text-slate-800 leading-none">{stats.concluidas}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider text-center">Concluídas</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full border-blue-100 text-[#004785] hover:bg-blue-50 hover:border-blue-200 font-bold transition-all rounded-lg text-xs"
                        onClick={() => setSelectedEmployee(emp)}
                      >
                        Ver atividades →
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>

        <div className="hidden xl:block xl:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#004785] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#004785] leading-none mb-1">{equipe.length}</p>
              <p className="text-xs text-slate-500 font-medium">Integrantes da equipe</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-[#004785]" />
              <h3 className="font-bold text-slate-800 text-sm">Distribuição por status</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar label="Em andamento" count={globalStats.em_andamento} color="bg-blue-500" />
              <ProgressBar label="Atrasadas" count={globalStats.atrasadas} color="bg-red-500" />
              <ProgressBar label="Concluídas" count={globalStats.concluidas} color="bg-emerald-500" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#f0f5ff] to-white rounded-xl border border-blue-100 shadow-sm p-8 text-center flex flex-col items-center justify-center">
            <Calendar className="w-6 h-6 text-[#004785] mb-3" />
            <p className="text-sm font-bold text-[#004785] leading-relaxed">
              Juntos, tornamos as demandas em resultados.
            </p>
            <Users className="w-16 h-16 text-[#004785] mt-6 opacity-20" />
            <div className="w-8 h-1 bg-[#004785] mt-4 rounded-full opacity-20"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 shadow-sm w-full lg:w-auto lg:min-w-[180px]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-slate-800 leading-none mb-1">{value}</p>
        <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, icon }) {
  return (
    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[9px] text-slate-500 font-bold uppercase">{label}</p>
        <p className="text-xs font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, count, color }) {
  const percent = count > 0 ? Math.min(100, Math.max(10, count * 5)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color} shrink-0`}></div>
      <span className="text-xs text-slate-600 font-medium w-24">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
      <span className="text-xs font-black text-slate-800 w-6 text-right">{count}</span>
    </div>
  );
}