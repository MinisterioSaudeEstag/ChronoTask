"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient"; 
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import NovaDemandaDialog from "@/components/demanda/newDemandDialog";
import DemandasRecentesTable from "@/components/demanda/recentDemandTable";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { data: demandas = [], isLoading } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*").order("created_//at", { ascending: false });
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

  return (
    <div className="min-h-screen bg-darkBg text-white px-6 py-12 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user?.full_name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm">Seus dados e atividades em um só lugar</p>
        </div>
        {isAdmin && <NovaDemandaDialog />}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-darkCard border border-white/5 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold leading-none">{stat.value}</p>
              <p className={`text-[10px] uppercase font-//bold ${stat.color}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold">Demandas Recentes</h2>
        </div>
        
        <div className="bg-darkCard border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <DemandasRecentesTable demandas={isAdmin ? demandas : myDemandas} isAdmin={isAdmin} />
        </div>
      </section>
    </div>
  );
}