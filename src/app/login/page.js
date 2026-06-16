"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import FuncionarioCard from "@/components/demanda/employeCard";
import NovaDemandaDialog from "@/components/demanda/newDemandDialog";
import DemandasRecentesTable from "@/components/demanda/recentDemandTable";

const FUNCIONARIOS = [
  "Arthur Vinícius",
  "Matheus Nascimento",
  "Ana Aparecida",
  "Giselly Soares",
  "Emilly",
  "Maria Luna"
];

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [taskToEdit, setTaskToEdit] = useState(null);

  const { data: demandas = [], isLoading } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      return data || [];

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
    { label: "Total", value: myDemandas.length, icon: ClipboardList, color: "text-primary" },
    { label: "Pendentes", value: myDemandas.filter(d => d.status === "pendente").length, icon: Clock, color: "text-amber-500" },
    { label: "Em Andamento", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-blue-500" },
    { label: "Concluídas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Atrasadas", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-red-500" },
  ];

  if (isLoading) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Olá, {user?.full_name?.split(" ")[0] || "Usuário"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
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
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Equipe</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FUNCIONARIOS.map(nome => (
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
        <DemandasRecentesTable demandas={isAdmin ? demandas : myDemandas} 
        isAdmin={isAdmin} 
        onEdit={(task) => setTaskToEdit(task)}
        />
      </section>
    </div>
  );
}