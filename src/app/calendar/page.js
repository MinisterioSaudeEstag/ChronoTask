"use client";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { Calendar as CalendarIcon } from "lucide-react";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarioPage() {
  const [view, setView] = useState("month");

  const { data: eventos = [] } = useQuery({
    queryKey: ["calendario_eventos"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*");
      
      return (data || []).map(task => ({
        id: task.id,
        title: `${task.funcionario_nome} - ${task.descricao}`,
        start: task.due_datetime ? new Date(task.due_datetime) : new Date(),
        end: task.due_datetime ? new Date(task.due_datetime) : new Date(),
        resource: task,
        color: task.status === 'concluida' ? '#22c55e' :
               task.status === 'em_andamento' ? '#3b82f6' :
               task.status === 'atrasada' ? '#ef4444' : '#eab308'
      }));
    },
  });

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '8px',
      color: 'white',
      border: 'none',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: '600'
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-[#004785]" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendário de Demandas</h1>
            <p className="text-slate-500 text-sm">Visão geral dos prazos da equipe</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200" style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={["month", "week", "day", "agenda"]}
            view={view}
            onView={(newView) => setView(newView)}
            eventPropGetter={eventStyleGetter}
            culture="pt-BR"
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              date: "Data",
              time: "Hora",
              event: "Demanda",
              noEventsInRange: "Nenhuma demanda neste período.",
              showMore: (total) => `+ ${total} demandas`,
            }}
          />
        </div>
      </div>
    </div>
  );
}