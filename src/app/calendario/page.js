"use client";
import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { Calendar as CalendarIcon, Activity, Clock, AlertCircle, Layers } from "lucide-react";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format, parse, getDay,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  locales,
});

export default function CalendarioPage() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ["calendario_tarefas"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*");
      return data || [];
    },
    enabled: typeof window !== "undefined", 
    staleTime: 1000 * 60, 
  });

  const statusConfig = {
    concluida: { label: "Concluída", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    em_andamento: { label: "Em Andamento", color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    atrasada: { label: "Atrasada", color: "#ef4444", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    pendente: { label: "Pendente", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    nao_iniciado: { label: "Não Iniciada", color: "#64748b", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  };

  const eventos = useMemo(() => tarefas.map(task => ({
    id: task.id,
    title: task.descricao,
    start: task.due_datetime ? new Date(task.due_datetime) : new Date(),
    end: task.due_datetime ? new Date(task.due_datetime) : new Date(),
    color: statusConfig[task.status]?.color || "#64748b",
    status: task.status,
  })), [tarefas]);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      padding: '2px 6px',
      fontSize: '11px',
      fontWeight: '600'
    }
  });

  const resumoEquipe = useMemo(() => {
    const grouped = {};
    
    tarefas.forEach(task => {
      const key = task.funcionario_nome || "Sem nome";
      if (!grouped[key]) {
        grouped[key] = { nome: key, total: 0, concluidas: 0, andamento: 0, pendentes: 0, atrasadas: 0, color: null };
      }
      grouped[key].total++;
      if (task.status === 'concluida') grouped[key].concluidas++;
      else if (task.status === 'em_andamento') grouped[key].andamento++;
      else if (task.status === 'atrasada') grouped[key].atrasadas++;
      else grouped[key].pendentes++;
      
      if (!grouped[key].color || task.status === 'atrasada') {
        grouped[key].color = statusConfig[task.status]?.color;
      }
    });
    return Object.values(grouped).sort((a, b) => b.total - a.total);
  }, [tarefas]);

  const stats = {
    total: tarefas.length,
    concluidas: tarefas.filter(t => t.status === 'concluida').length,
    atrasadas: tarefas.filter(t => t.status === 'atrasada').length,
    andamento: tarefas.filter(t => t.status === 'em_andamento').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#004785] rounded-xl shadow-sm">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendário de Demandas</h1>
            <p className="text-slate-500 text-sm">Gestão visual de prazos e produtividade</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Layers className="w-5 h-5" />} label="Total" value={stats.total} color="slate" />
          <KpiCard icon={<Activity className="w-5 h-5" />} label="Em Andamento" value={stats.andamento} color="blue" />
          <KpiCard icon={<AlertCircle className="w-5 h-5" />} label="Atrasadas" value={stats.atrasadas} color="red" />
          <KpiCard icon={<Clock className="w-5 h-5" />} label="Concluídas" value={stats.concluidas} color="emerald" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" style={{ height: '650px' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              Carregando calendário...
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={["month", "week", "day", "agenda"]}
              view={view}
              date={currentDate}
              onView={(v) => setView(v)}
              onNavigate={(d) => setCurrentDate(d)}
              eventPropGetter={eventStyleGetter}
              culture="pt-BR"
              messages={{
                next: "Próximo", previous: "Anterior", today: "Hoje",
                month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda",
                date: "Data", time: "Hora", event: "Demanda",
                noEventsInRange: "Nenhuma demanda neste período.",
                showMore: (total) => `+ ${total} demandas`,
              }}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#004785]" />
              <h2 className="font-bold text-slate-800">Resumo da Equipe</h2>
            </div>
            <span className="text-xs text-slate-500">
              A cor do avatar indica o status predominante
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Funcionário</th>
                  <th className="px-6 py-3 text-center">Total</th>
                  <th className="px-6 py-3 text-center">Em Andamento</th>
                  <th className="px-6 py-3 text-center">Pendentes</th>
                  <th className="px-6 py-3 text-center">Atrasadas</th>
                  <th className="px-6 py-3 text-center">Concluídas</th>
                  <th className="px-6 py-3">Progresso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resumoEquipe.map((membro, idx) => {
                  const progresso = membro.total > 0 ? Math.round((membro.concluidas / membro.total) * 100) : 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                            style={{ backgroundColor: membro.color }}
                          >
                            {membro.nome.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-800 truncate max-w-[150px]">{membro.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">{membro.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {membro.andamento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          {membro.pendentes}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          {membro.atrasadas}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {membro.concluidas}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                              style={{ width: `${progresso}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600 w-10 text-right">{progresso}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, color }) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}