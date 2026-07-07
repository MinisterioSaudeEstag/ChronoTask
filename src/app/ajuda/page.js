"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, BookOpen, Users, FileText, CheckCircle, 
  AlertTriangle, Mail, ChevronDown, ChevronUp, Clock, Edit
} from "lucide-react";

export default function AjudaPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      pergunta: "Como eu atribuo uma nova demanda?",
      resposta: "Apenas os Administradores (Eliane, Maria Juliana, Monalisa e Matheus) podem atribuir demandas. Clique no botão azul 'Atribuir Nova Demanda' no topo do Dashboard, preencha os campos do formulário e clique em salvar.",
      icon: <FileText className="w-5 h-5 text-primary" />
    },
    {
      pergunta: "Como mudo o status de uma demanda?",
      resposta: "Na tabela de Demandas Recentes, clique no badge de status (ex: 'Pendente'). Um menu irá aparecer. Se o status for 'Concluída', será necessário escrever uma observação obrigatória.",
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
    },
    {
      pergunta: "Como adiciono uma observação?",
      resposta: "Se você for um funcionário, clique no botão verde 'obs' na linha da sua demanda. Escreva sua mensagem e clique em OK. O Administrador será notificado.",
      icon: <Edit className="w-5 h-5 text-amber-500" />
    },
    {
      pergunta: "O que significam as cores dos status?",
      resposta: "Cinza: Não Iniciada | Amarelo: Pendente | Azul: Em Andamento | Verde: Concluída | Vermelho: Atrasada.",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />
    },
    {
      pergunta: "Como vejo as atividades dos outros colegas?",
      resposta: "No menu superior, clique em 'Equipe'. Você verá os cards de todos os funcionários. Clique em 'Ver Atividades' para abrir a lista detalhada de tarefas daquela pessoa.",
      icon: <Users className="w-5 h-5 text-blue-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-darkBg text-slate-900 dark:text-white px-6 py-12 space-y-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl">
            <HelpCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Central de Ajuda</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Aprenda a utilizar todas as funcionalidades do ChronoTask.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-darkCard border-border/60">
            <CardContent className="p-6 text-center space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-primary" />
              <h3 className="font-bold">Manual de Uso</h3>
              <p className="text-xs text-slate-500">Passo a passo de cada tela</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-darkCard border-border/60">
            <CardContent className="p-6 text-center space-y-2">
              <Clock className="w-8 h-8 mx-auto text-amber-500" />
              <h3 className="font-bold">Status e Prazos</h3>
              <p className="text-xs text-slate-500">Entenda as cores e alertas</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-darkCard border-border/60">
            <CardContent className="p-6 text-center space-y-2">
              <Mail className="w-8 h-8 mx-auto text-emerald-500" />
              <h3 className="font-bold">Notificações</h3>
              <p className="text-xs text-slate-500">Avisos em tempo real</p>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Perguntas Frequentes
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <Card 
                key={i} 
                className="bg-white dark:bg-darkCard border-border/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {faq.icon}
                    <span className="font-semibold text-sm md:text-base">{faq.pergunta}</span>
                  </div>
                  {openIndex === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openIndex === i && (
                  <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-300 border-t border-border/40 bg-slate-50/50 dark:bg-white/5">
                    {faq.resposta}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Card className="bg-primary text-white">
          <CardContent className="p-8 text-center space-y-3">
            <h3 className="text-xl font-bold">Ainda precisa de ajuda?</h3>
            <p className="text-slate-200 text-sm">
              Entre em contato com a equipe de TI do DITRE/PE ou envie um e-mail para o administrador do sistema.
            </p>
            <div className="pt-2 text-xs text-slate-300 uppercase tracking-widest">
              COTRE/PE | DITRE/PE
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}