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
import DemandasRecentesTable from "@/components/demanda/recentDemandTable";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [taskToEdit, setTaskToEdit] = useState(null);

  const { data: demandas = [], isLoading: loadingDemandas } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar demandas:", error);
        return [];
      }
      return data;
    },
  });

  const myDemandas = !isAdmin
    ? demandas.filter(d => d.funcionario_id === user?.id)
    : demandas;

  const stats = [
    { label: "Total", value: myDemandas.length, icon: ClipboardList, color: "text-statusBlue" },
    { label: "Pendentes", value: myDemandas.filter(d => d.status === "pendente").length, icon: Clock, color: "text-statusYellow" },
    { label: "Em Andamento", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-statusCyan" },
    { label: "Concluídas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-statusGreen" },
    { label: "Atrasadas", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-statusRed" },
  ];

  if (loadingDemandas) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-12 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Olá, {user?.full_name?.split(" ")[0] || "Usuário"} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isAdmin ? "Painel de controle de demandas da equipe" : "Suas demandas e atividades"}
          </p>
        </div>

        {isAdmin && (
          <NovaDemandaDialog 
            taskToEdit={taskToEdit} 
            setTaskToEdit={setTaskToEdit} 
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <Card key={stat.label} className="border-border/60 bg-white dark:bg-darkCard">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-100 dark:bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Equipe</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FUNCIONARIOS_EQUIPE.map(nome => (
              <FuncionarioCard
                key={nome}
                nome={nome}
                demandas={demandas.filter(d => d.funcionario_nome === nome)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <DemandasRecentesTable 
          demandas={isAdmin ? demandas : myDemandas} 
          isAdmin={isAdmin} 
          onEdit={(task) => setTaskToEdit(task)} 
        />
      </section>
    </div>
  );
}

const FUNCIONARIOS_EQUIPE = [
  "Arthur Vinícius",
  "Matheus Nascimento",
  "Ana Aparecida",
  "Giselly Soares",
  "Emilly Alves",
  "Maria Luna",
  "Maria Angelita de Lucena"
];