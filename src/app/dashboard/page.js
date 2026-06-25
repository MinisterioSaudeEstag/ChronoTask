"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient"; 
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import FuncionarioCard from "@/components/demanda/employeCard";
import NovaDemandaDialog from "@/components/demanda/newDemandDialog";
import DemandasRecentesTable from "@/components///demanda/recentDemandTable";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [taskToEdit, setTaskToEdit] = useState(null);

  const { data: demandas = [], isLoading } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const myDemandas = !isAdmin ? demandas.filter(d => d.funcionario_id === user?.id) : demandas;

  const stats = [
    { label: "Total", value: myDemandas.length, icon: ClipboardList, color: "text-statusBlue" },
    { label: "Pendentes", value: myDemandas.filter(d => d.status === "pendente").length, icon: Clock, color: "text-statusYellow" },
    { label: "Em Andamento", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-statusCyan" },
    { label: "Concluídas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-statusGreen" },
    { label: "Atrasadas", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-statusRed" },
  ];

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-10 w-64" /></div>;

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-12 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user?.full_name?.split(" ")[0] || "Usuário"} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Seus dados e atividades em um só lugar</p>
        </div>
        {isAdmin && (
          <NovaDemandaDialog 
            taskToEdit={taskToEdit} 
            setTaskToEdit={setTaskToEdit} 
          />
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-darkCard border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-center gap-4 shadow-sm transition-colors">
            <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold leading-none">{stat.value}</p>
              <p className={`text-[10px] uppercase font-bold ${stat.color}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold">Demandas Recentes</h2>
        </div>
        <div className="bg-white dark:bg-darkCard border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-xl transition-colors">
          <DemandasRecentesTable 
            demandas={isAdmin ? demandas : myDemandas} 
            isAdmin={isAdmin} 
            onEdit={(task) => setTaskToEdit(task)} 
          />
        </div>
      </section>
    </div>
  );
}
