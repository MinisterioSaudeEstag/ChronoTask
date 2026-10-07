"use client";

import React, { useState, useMemo } from "react";
import dynamicImport from "next/dynamic";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  Calendar as CalendarIcon,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import TaskDetailsModal from "./TasksDetailsModal";

const Calendar = dynamicImport(
  () => import("react-big-calendar").then((mod) => mod.Calendar),
  { ssr: false }
);

const locales = {
  "pt-BR": ptBR,
  ptBR: ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  return (
    <div className="flex items-center gap-4 mb-6 px-2">
      <button onClick={goToBack} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-lg font-bold text-slate-800 capitalize w-48 text-center">
        {format(toolbar.date, "MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <button onClick={goToNext} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const CustomEvent = ({ event }) => {
  const isConcluida = event.status === 'concluida';
  const isAtrasada = event.status === 'atrasada';
  const isAndamento = event.status === 'em_andamento';

  const bg = isConcluida ? 'bg-emerald-100/70' : isAtrasada ? 'bg-red-100/70' : isAndamento ? 'bg-blue-100/70' : 'bg-slate-100';
  const text = isConcluida ? 'text-emerald-700' : isAtrasada ? 'text-red-700' : isAndamento ? 'text-blue-700' : 'text-slate-700';
  const Icon = isConcluida ? CheckCircle2 : isAtrasada ? AlertTriangle : Clock;

  return (
    <div className={`flex flex-col gap-0.5 p-1.5 rounded-lg ${bg} ${text} h-full w-full overflow-hidden transition-colors`}>
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] font-bold truncate leading-none mt-0.5">{event.title.split(' - ')[1] || event.title}</span>
      </div>
      <span className="text-[9px] font-medium opacity-80 leading-none pl-5">
        {event.task.due_datetime ? format(new Date(event.task.due_datetime), 'HH:mm') : ''}
      </span>
    </div>
  );
};

export default function CalendarioPage() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatuses] = useState([]);
  const [selectedProducts] = useState([]);

  const { data: tarefas = [], isLoading } = useQuery({
    queryKey: ["calendario_tarefas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60,
  });

  const tarefasFiltradas = useMemo(() => {
    let filtradas = [...tarefas];
    if (selectedMonth !== "all") {
      const mesFiltro = parseInt(selectedMonth, 10);
      filtradas = filtradas.filter((d) => {
        if (!d.created_at) return false;
        return new Date(d.created_at).getMonth() === mesFiltro;
      });
    }
    if (selectedStatuses.length > 0) filtradas = filtradas.filter((d) => selectedStatuses.includes(d.status));
    if (selectedProducts.length > 0) filtradas = filtradas.filter((d) => d.produto && selectedProducts.includes(d.produto));
    return filtradas;
  }, [tarefas, selectedMonth, selectedStatuses, selectedProducts]);

  const stats = useMemo(() => {
    return {
      total: tarefasFiltradas.length,
      em_andamento: tarefasFiltradas.filter((d) => d.status === "em_andamento").length,
      atrasadas: tarefasFiltradas.filter((d) => d.status === "atrasada").length,
      concluidas: tarefasFiltradas.filter((d) => d.status === "concluida").length,
    };
  }, [tarefasFiltradas]);

  const eventos = useMemo(() =>
    tarefasFiltradas.map((task) => ({
      id: task.id,
      title: `${task.funcionario_nome || "Sem Nome"} - ${task.descricao || "Sem Descrição"}`,
      start: task.due_datetime ? new Date(task.due_datetime) : new Date(),
      end: task.due_datetime ? new Date(task.due_datetime) : new Date(),
      status: task.status,
      task: task,
    })),
    [tarefasFiltradas]
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "transparent",
      borderRadius: "0px",
      color: "inherit",
      border: "none",
      padding: "0px",
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-[#004785] rounded-xl shadow-sm">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#004785] tracking-tight">Calendário de Demandas</h1>
              <p className="text-slate-500 text-sm mt-0.5">Visualize os prazos, vencimentos e compromissos das suas demandas em um só lugar.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <div className="relative w-64 hidden md:block shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input type="text" placeholder="Buscar por demanda, convênio..." className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:border-[#004785] shadow-sm" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-3 shadow-sm cursor-pointer shrink-0">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">Mês</span>
                <span className="text-xs font-bold text-slate-800 leading-none mt-1 capitalize">{format(currentDate, "MMMM/yyyy", { locale: ptBR })}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0">
              <button onClick={() => setView('month')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${view === 'month' ? 'bg-[#004785] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Mês</button>
              <button onClick={() => setView('week')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${view === 'week' ? 'bg-[#004785] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Semana</button>
              <button onClick={() => setView('agenda')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${view === 'agenda' ? 'bg-[#004785] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>Agenda</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="p-1.5 bg-blue-100 rounded-lg text-[#004785]">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Resumo do mês</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <StatBox icon={<CalendarIcon className="w-5 h-5" />} value={stats.total} label="Total de demandas" color="blue" />
                <StatBox icon={<Clock className="w-5 h-5" />} value={stats.em_andamento} label="Em andamento" color="blue" />
                <StatBox icon={<AlertTriangle className="w-5 h-5" />} value={stats.atrasadas} label="Atrasadas" color="red" />
                <StatBox icon={<CheckCircle2 className="w-5 h-5" />} value={stats.concluidas} label="Concluídas" color="emerald" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="p-1.5 bg-blue-100 rounded-lg text-[#004785]">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Legenda</h3>
              </div>
              <div className="p-5 space-y-4">
                <LegendItem color="bg-blue-500" label="Em andamento" />
                <LegendItem color="bg-red-500" label="Atrasadas" />
                <LegendItem color="bg-emerald-500" label="Concluídas" />
                <LegendItem color="bg-slate-400" label="Planejamento / Outros" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-[#004785]">
              <Info className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium leading-relaxed">Clique em um evento para ver mais detalhes da demanda.</p>
            </div>
          </div>

          <div className="xl:col-span-9">
            {isLoading ? (
              <div className="bg-white p-12 rounded-xl text-center text-slate-400 border border-slate-200">
                Carregando calendário...
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200" style={{ height: "750px" }}>
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .rbc-month-view { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
                  .rbc-header { padding: 12px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: capitalize; border-bottom: 1px solid #e2e8f0; border-left: none; }
                  .rbc-header + .rbc-header { border-left: 1px solid #e2e8f0; }
                  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #e2e8f0; }
                  .rbc-month-row + .rbc-month-row { border-top: 1px solid #e2e8f0; }
                  .rbc-date-cell { font-size: 13px; font-weight: 700; color: #334155; padding: 8px; text-align: left; }
                  .rbc-off-range-bg { background-color: #f8fafc; }
                  .rbc-off-range .rbc-date-cell { color: #cbd5e1; font-weight: 500; }
                  .rbc-today { background-color: #f0f5ff; }
                  .rbc-event { background: transparent !important; }
                `}} />
                <Calendar
                  localizer={localizer}
                  events={eventos}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={["month", "week", "day", "agenda"]}
                  view={view}
                  date={currentDate}
                  onView={(v) => setView(v)}
                  onNavigate={(d) => setCurrentDate(d)}
                  eventPropGetter={eventStyleGetter}
                  components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent
                  }}
                  onSelectEvent={(event) => setSelectedTask(event.task)}
                  culture="pt-BR"
                  messages={{
                    noEventsInRange: "Nenhuma demanda neste período.",
                    showMore: (total) => `+ ${total} demandas`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

function StatBox({ icon, value, label, color }) {
  const colorClass = color === 'blue' ? 'text-[#004785]' : color === 'red' ? 'text-red-500' : 'text-emerald-500';
  const bgClass = color === 'blue' ? 'bg-blue-50' : color === 'red' ? 'bg-red-50' : 'bg-emerald-50';
  return (
    <div className="flex flex-col p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-1.5 rounded-lg ${colorClass} ${bgClass}`}>
          {icon}
        </div>
        <span className="text-2xl font-black text-slate-800 leading-none">{value}</span>
      </div>
      <span className="text-[10px] font-medium text-slate-500">{label}</span>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div>
      <span className="text-xs text-slate-600 font-medium">{label}</span>
    </div>
  );
}