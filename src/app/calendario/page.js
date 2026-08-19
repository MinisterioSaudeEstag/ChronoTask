"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { Layers, Activity, AlertCircle, Clock } from "lucide-react";
import TaskDetailsModal from "./TasksDetailsModal";
import MonthFilter from "../../components/dashboard/MonthFilter";

const locales = { "pt-BR": ptBR };

const formats = {
  dayHeaderFormat: (date, culture, localizer) =>
    localizer.format(date, "eeee, dd/MM/yyyy", culture),
  agendaDateFormat: (date, culture, localizer) =>
    localizer.format(date, "dd/MM/yyyy", culture),
  weekdayFormat: (date, culture, localizer) =>
    localizer.format(date, "eeee", culture),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  getDay,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  locales,
  formats,
});

export default function CalendarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ["calendario_tarefas"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*");
      return data || [];
    },
    enabled: isMounted,
    staleTime: 1000 * 60,
  });

  const statusConfig = {
    concluida: { color: "#10b981" },
    em_andamento: { color: "#3b82f6" },
    atrasada: { color: "#ef4444" },
    pendente: { color: "#f59e0b" },
    nao_iniciado: { color: "#64748b" },
  };

  const tarefasFiltradas = useMemo(() => {
    let filtradas = [...tarefas];

    if (selectedMonth !== 'all') {
      const mesFiltro = parseInt(selectedMonth);
      filtradas = filtradas.filter(d => {
        const data = new Date(d.created_at);
        return data.getMonth() === mesFiltro;
      });
    }

    if (selectedStatuses.length > 0) {
      filtradas = filtradas.filter(d => selectedStatuses.includes(d.status));
    }

    if (selectedProducts.length > 0) {
      filtradas = filtradas.filter(d => selectedProducts.includes(d.produto));
    }

    return filtradas;
  }, [tarefas, selectedMonth, selectedStatuses, selectedProducts]);

  const eventos = useMemo(() => tarefasFiltradas.map(task => ({
    id: task.id,
    title: `${task.funcionario_nome} - ${task.descricao}`,
    start: task.due_datetime ? new Date(task.due_datetime) : new Date(),
    end: task.due_datetime ? new Date(task.due_datetime) : new Date(),
    color: statusConfig[task.status]?.color || "#64748b",
    status: task.status,
    task: task,
  })), [tarefasFiltradas]);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      padding: '2px 6px',
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  });

  const stats = {
    total: tarefasFiltradas.length,
    andamento: tarefasFiltradas.filter(t => t.status === 'em_andamento').length,
    atrasadas: tarefasFiltradas.filter(t => t.status === 'atrasada').length,
    concluidas: tarefasFiltradas.filter(t => t.status === 'concluida').length,
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center text-slate-400">Carregando calendário...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#004785] rounded-xl shadow-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendário de Demandas</h1>
            <p className="text-slate-500 text-sm">Visão geral dos prazos e produtividade</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Layers className="w-5 h-5" />} label="Total" value={stats.total} color="slate" />
          <KpiCard icon={<Activity className="w-5 h-5" />} label="Em Andamento" value={stats.andamento} color="blue" />
          <KpiCard icon={<AlertCircle className="w-5 h-5" />} label="Atrasadas" value={stats.atrasadas} color="red" />
          <KpiCard icon={<Clock className="w-5 h-5" />} label="Concluídas" value={stats.concluidas} color="emerald" />
        </div>

        <MonthFilter selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        
        <div className="text-sm text-slate-600">
          Mostrando <strong>{tarefasFiltradas.length}</strong> de <strong>{tarefas.length}</strong> demandas
        </div>

        {isLoading ? (
          <div className="bg-white p-12 rounded-xl text-center text-slate-400">Carregando...</div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" style={{ height: '650px' }}>
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
              onSelectEvent={(event) => setSelectedTask(event.task)}
              culture="pt-BR"
              messages={{
                next: "Próximo", previous: "Anterior", today: "Hoje",
                month: "Mês", week: "Semana", day: "Dia", agenda: "Agenda",
                date: "Data", time: "Hora", event: "Demanda",
                noEventsInRange: "Nenhuma demanda neste período.",
                showMore: (total) => `+ ${total} demandas`,
              }}
            />
          </div>
        )}
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
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