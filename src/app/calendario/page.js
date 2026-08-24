"use client";

import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Layers, Activity, AlertCircle, Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import TaskDetailsModal from "./TasksDetailsModal";
import MonthFilter from "@/components/dashboard/MonthFilter";

export const dynamic = 'force-dynamic';

const locales = { 
 'pt-BR': ptBR,
  'ptBR': ptBR,
 };
 
const localizer = dateFnsLocalizer({
  format, parse, getDay,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  locales,
});

export default function CalendarioPage() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ["calendario_tarefas"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*");
      return data || [];
    },
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

  const contadores = useMemo(() => {
    const finalizado = tarefasFiltradas.filter(d => d.status === 'concluida').length;
    const aberto = tarefasFiltradas.length - finalizado;
    return { aberto, finalizado };
  }, [tarefasFiltradas]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatusCard 
            label="Em Aberto" 
            value={contadores.aberto} 
            icon={<PlayCircle className="w-6 h-6" />} 
            color="blue" 
          />
          <StatusCard 
            label="Finalizadas" 
            value={contadores.finalizado} 
            icon={<CheckCircle2 className="w-6 h-6" />} 
            color="emerald" 
          />
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

function StatusCard({ label, value, icon, color }) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      iconBg: "bg-emerald-100",
    },
  };
  
  const c = colors[color];
  
  return (
    <div className={`p-6 rounded-2xl border-2 ${c.bg} ${c.border} flex items-center justify-between transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${c.iconBg} ${c.text}`}>
          {icon}
        </div>
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{label}</p>
          <p className={`text-3xl font-bold ${c.text} mt-1`}>{value}</p>
        </div>
      </div>
      <div className={`hidden md:block text-6xl ${c.text} opacity-20`}>
        {icon}
      </div>
    </div>
  );
}