"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/authContext";
import { supabase } from "../../lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Archive,
  ArrowRight,
  Calendar,
  Zap,
  LayoutDashboard,
  FileText
} from "lucide-react";
import FuncionarioCard from "../../components/demanda/employeCard";
import NovaDemandaDialog from "../../components/demanda/newDemandDialog";
import DemandasRecentesTable from "../../components/demanda/recentDemandTable";
import MonthFilter from "../../components/dashboard/MonthFilter";
import FiltersPanel from "../../components/dashboard/FilterPanel";
import { useArchiveTask } from "../../hooks/useArchiveTask";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { archiveTask } = useArchiveTask();

  const { data: equipe = [], isLoading: loadingEquipe } = useQuery({
    queryKey: ["equipe_dashboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .neq("role", "admin");
      return data || [];
    },
  });

  const { data: demandas = [], isLoading: loadingDemandas } = useQuery({
    queryKey: ["demandas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar demandas:", error);
        return [];
      }
      return data;
    },
  });

  const isLoading = loadingDemandas || loadingEquipe;

  const demandasFiltradas = useMemo(() => {
    let filtradas = [...demandas];

    if (!isAdmin) {
      filtradas = filtradas.filter(d => d.funcionario_id === user?.id);
    }

    if (selectedMonth !== 'all') {
      const mesFiltro = parseInt(selectedMonth);
      filtradas = filtradas.filter(d => {
        const dataAtribuicao = new Date(d.created_at);
        return dataAtribuicao.getMonth() === mesFiltro;
      });
    }

    if (selectedStatuses.length > 0) {
      filtradas = filtradas.filter(d => selectedStatuses.includes(d.status));
    }

    if (selectedProducts.length > 0) {
      filtradas = filtradas.filter(d => selectedProducts.includes(d.produto));
    }

    return filtradas;
  }, [demandas, isAdmin, user, selectedMonth, selectedStatuses, selectedProducts]);

  const myDemandas = !isAdmin
    ? demandasFiltradas.filter(d => d.funcionario_id === user?.id)
    : demandasFiltradas;

  const proximosVencimentos = useMemo(() => {
    return [...myDemandas]
      .filter(d => d.expected_date && d.status !== 'concluida')
      .sort((a, b) => new Date(a.expected_date) - new Date(b.expected_date))
      .slice(0, 3);
  }, [myDemandas]);

  const stats = [
    { label: "Demandas", sub: "Total de demandas", value: myDemandas.length, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Em andamento", sub: "Em execução", value: myDemandas.filter(d => d.status === "em_andamento").length, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Atrasadas", sub: "Fora do prazo", value: myDemandas.filter(d => d.status === "atrasada").length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100" },
    { label: "Concluídas", sub: "Finalizadas", value: myDemandas.filter(d => d.status === "concluida").length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pendentes", sub: "Não Iniciadas / Aguardando", value: myDemandas.filter(d => d.status === "nao_iniciado" || d.status === "pendente").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-100" },
  ];

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans px-4 sm:px-6 py-8 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">

        <div className="xl:col-span-8 2xl:col-span-9 space-y-8">

          <div className="relative bg-gradient-to-r from-[#f0f5ff] to-[#e6f0ff] rounded-2xl p-8 lg:p-10 overflow-hidden border border-blue-100 shadow-sm">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-slate-800 text-lg font-bold">
                  Olá, {user?.full_name?.split(" ")[0] || "Usuário"}! 👋
                </h2>
                {isAdmin && (
                  <NovaDemandaDialog taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} />
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#004785] mb-4 tracking-tight">
                Bem-vindo ao ChronoTask
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Aqui você acompanha suas demandas, prazos e o andamento das atividades da sua equipe, de forma simples e organizada.
              </p>
            </div>

            <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex justify-end items-end p-8 opacity-10 pointer-events-none">
              <LayoutDashboard className="w-64 h-64 text-[#004785] translate-x-10 translate-y-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map(stat => (
              <Card key={stat.label} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <CardContent className="p-5 flex flex-col justify-center h-full gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.value}</p>
                      <p className="text-sm font-bold text-[#004785] leading-tight">{stat.label}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{stat.sub}</p>
                  <ArrowRight className={`w-4 h-4 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity ${stat.color}`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex-1 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <MonthFilter
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
            <div className="shrink-0">
              <FiltersPanel
                selectedStatuses={selectedStatuses}
                setSelectedStatuses={setSelectedStatuses}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
            </div>
          </div>

          {(selectedMonth !== 'all' || selectedStatuses.length > 0 || selectedProducts.length > 0) && (
            <div className="text-sm text-slate-500 bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-100">
              Mostrando <strong className="text-[#004785]">{myDemandas.length}</strong> de <strong className="text-[#004785]">{demandas.length}</strong> demandas
            </div>
          )}

          {isAdmin && (
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-[#004785]" />
                <h2 className="text-lg font-bold text-slate-800">Equipe</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipe.map(func => (
                  <FuncionarioCard
                    key={func.id}
                    nome={func.full_name}
                    demandas={demandas.filter(d => d.funcionario_id === func.id)}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <Link
                  href="/demandas-arquivadas"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 hover:text-slate-800 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Ver Arquivadas
                </Link>
              </div>
            )}
            <div className="col-span-full w-full">
              <DemandasRecentesTable
                demandas={myDemandas}
                isAdmin={isAdmin}
                onEdit={(task) => setTaskToEdit(task)}
              />
            </div>
          </section>

        </div>

        <div className="xl:col-span-4 2xl:col-span-3 space-y-6">

          <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#004785]/10 flex items-center justify-center text-[#004785] shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Hoje é, {dataFormatada}</h3>
              <p className="text-xs text-slate-500 capitalize">{diaSemana}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#004785]" />
              <h3 className="font-bold text-[#004785]">Ações rápidas</h3>
            </div>
            <div className="p-2 flex flex-col gap-1">

              <Link href="/minhas-atividades" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100"><CheckCircle2 className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Minhas Atividades</p>
                    <p className="text-[10px] text-slate-500">Acesse suas tarefas</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>

              <Link href="/home" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100"><Users className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Minha equipe</p>
                    <p className="text-[10px] text-slate-500">Veja sua equipe e responsabilidades</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>

              <Link href="/calendario" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100"><Calendar className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Calendário</p>
                    <p className="text-[10px] text-slate-500">Confira prazos e vencimentos</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>

              <Link href="/relatorios" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100"><FileText className="w-4 h-4" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Relatórios</p>
                    <p className="text-[10px] text-slate-500">Acesse relatórios e indicadores</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </Link>

            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#004785]" />
                <h3 className="font-bold text-[#004785]">Próximos vencimentos</h3>
              </div>
              <Link href="/calendario" className="text-xs text-blue-600 font-semibold hover:underline">
                Ver calendário →
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 p-2">
              {proximosVencimentos.length > 0 ? proximosVencimentos.map(task => {
                const dataSplit = task.expected_date ? task.expected_date.split('-') : null;
                const dia = dataSplit ? dataSplit[2] : '--';
                const mes = dataSplit ? new Date(task.expected_date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '') : '---';

                return (
                  <div key={task.id} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-lg group transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-10 text-[#004785]">
                        <span className="text-lg font-black leading-none">{dia}</span>
                        <span className="text-[9px] font-bold">{mes}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 truncate max-w-[150px]" title={task.descricao}>{task.descricao}</p>
                        <p className="text-[10px] text-slate-500">{task.convenio || "Sem convênio"}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-[10px] font-bold shrink-0">
                      Prazo
                    </div>
                  </div>
                );
              }) : (
                <div className="p-6 text-center text-sm text-slate-500 font-medium">Nenhum vencimento próximo.</div>
              )}
            </div>

            <div className="m-4 mt-2 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4 flex items-start gap-3 border border-blue-100">
              <div className="bg-blue-500 p-1.5 rounded-full text-white mt-0.5 shrink-0 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#004785] mb-1">Juntos por uma gestão mais eficiente</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  O ChronoTask ajuda sua equipe a entregar mais, com organização e transparência.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}