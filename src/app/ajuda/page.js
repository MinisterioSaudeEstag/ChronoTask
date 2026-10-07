"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle, BookOpen, Users, FileText, CheckCircle,
  AlertTriangle, Mail, ChevronDown, Clock, Edit,
  Headphones, Lightbulb, ArrowRight, Phone, Info,
  Minus, MessageSquare
} from "lucide-react";

export default function AjudaPage() {
  const [openIndex, setOpenIndex] = useState(0); 

  const faqs = [
    {
      pergunta: "Como mudo o status de uma demanda?",
      resposta: "Para alterar o status de uma demanda, acesse o painel de atividades, localize a atividade desejada e clique no campo 'Status'. Em seguida, selecione o status correspondente. A mudança será registrada automaticamente no sistema.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      pergunta: "Como adiciono uma observação?",
      resposta: "Se você for um funcionário, clique no botão 'obs' na linha da sua demanda. Escreva sua mensagem e clique em OK. O Administrador será notificado.",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      icon: <Edit className="w-5 h-5" />
    },
    {
      pergunta: "O que significam as cores dos status?",
      resposta: "Cinza: Não Iniciada | Amarelo: Pendente | Azul: Em Andamento | Verde: Concluída | Vermelho: Atrasada.",
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      pergunta: "Como vejo as atividades dos outros colegas?",
      resposta: "No menu superior, clique em 'Equipe'. Você verá os cards de todos os funcionários. Clique em 'Ver Atividades' para abrir a lista detalhada de tarefas daquela pessoa.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      icon: <Users className="w-5 h-5" />
    },
    {
      pergunta: "Como filtrar a tabela de demandas?",
      resposta: "Na aba de Minhas Atividades ou na Equipe, utilize os filtros laterais ou a barra de pesquisa superior para encontrar demandas específicas por status, prazo ou responsável.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col transition-colors duration-300">
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="relative bg-gradient-to-r from-[#f0f5ff] to-white rounded-2xl p-8 lg:p-12 overflow-hidden border border-blue-100 shadow-sm flex items-center justify-between">
          <div className="flex items-start gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#004785] tracking-tight">
                Central de Ajuda
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Encontre respostas para as principais dúvidas sobre o ChronoTask.<br />
                Se precisar de mais ajuda, nossa equipe está à disposição.
              </p>
            </div>
          </div>
          <div className="hidden lg:flex relative items-center justify-center opacity-80 pr-12">
            <div className="relative">
              <Headphones className="w-32 h-32 text-blue-400 stroke-[1.5]" />
              <MessageSquare className="w-8 h-8 text-blue-500 absolute -right-6 top-2" />
              <div className="w-3 h-3 rounded-full bg-blue-300 absolute -right-12 top-6"></div>
              <div className="w-2 h-2 rounded-full bg-blue-200 absolute -right-10 top-12"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ShortcutCard
            icon={<BookOpen className="w-6 h-6 text-blue-500" />} bg="bg-blue-50"
            title="Manual de Uso" desc={<>Passo a passo de todas as funcionalidades <strong>do sistema.</strong></>}
          />
          <ShortcutCard
            icon={<Clock className="w-6 h-6 text-amber-500" />} bg="bg-amber-50"
            title="Status e Prazos" desc="Entenda as cores e alertas do sistema."
          />
          <ShortcutCard
            icon={<Mail className="w-6 h-6 text-emerald-500" />} bg="bg-emerald-50"
            title="Notificações" desc="Avisos em tempo real sobre suas atividades."
          />
          <ShortcutCard
            icon={<Lightbulb className="w-6 h-6 text-purple-500" />} bg="bg-purple-50"
            title="Dicas Rápidas" desc="Atalhos e boas práticas para o seu dia a dia."
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-4">
          <section className="xl:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-[#004785]" />
              <div>
                <h2 className="text-xl font-extrabold text-[#004785]">Perguntas Frequentes</h2>
                <p className="text-sm text-slate-500">Tire suas dúvidas de forma rápida e simples.</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl overflow-hidden transition-all duration-300 border shadow-sm
                      ${isOpen ? 'bg-[#f0f5ff] border-blue-200' : 'bg-white border-slate-200 hover:border-blue-100'}
                    `}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        {isOpen ? (
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Minus className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className={`w-10 h-10 rounded-xl ${faq.iconBg} ${faq.iconColor} flex items-center justify-center shrink-0`}>
                            {faq.icon}
                          </div>
                        )}
                        <span className={`font-bold text-sm sm:text-base ${isOpen ? 'text-[#004785]' : 'text-slate-800'}`}>
                          {faq.pergunta}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#004785]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 pl-[76px] animate-in slide-in-from-top-2">
                        <p className="text-sm text-slate-600 leading-relaxed bg-transparent">
                          {faq.resposta}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="xl:col-span-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Headphones className="w-8 h-8 text-[#004785]" />
                <div>
                  <h3 className="text-lg font-bold text-[#004785]">Ainda precisa de ajuda?</h3>
                  <p className="text-xs text-slate-500 mt-1">Se você não encontrou o que precisava, nossa equipe está pronta para te atender.</p>
                </div>
              </div>

              <div className="space-y-2">
                <ContactRow icon={<Mail className="w-5 h-5" />} label="E-mail de suporte" value="arthur.moreira@saude.gov.br" />
                <ContactRow icon={<Phone className="w-5 h-5" />} label="Telefone" value="(81) 99994-4106" />
                <ContactRow icon={<Clock className="w-5 h-5" />} label="Horário de atendimento" value="Segunda a sexta, das 8h às 17h" />
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#004785] mb-1">Dica</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Antes de entrar em contato, verifique se sua dúvida não está no manual de uso.<br />
                    Isso nos ajuda a te atender mais rápido!
                  </p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-xl font-black text-[#004785] tracking-tighter flex items-center gap-1">
              <span>SUS</span>
              <div className="w-4 h-4 bg-[#004785] rounded-sm flex items-center justify-center text-white">
                <div className="w-2 h-0.5 bg-white rounded-full"></div>
                <div className="h-2 w-0.5 bg-white absolute rounded-full"></div>
              </div>
            </div>
            <div className="border-l border-slate-300 pl-4">
              <p className="text-sm font-bold text-slate-700">MINISTÉRIO DA SAÚDE</p>
              <p className="text-[10px] text-slate-500">Secretaria Executiva | COTRE/PE | DITRE/PE</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <Link href="#" className="hover:text-[#004785] transition-colors">Termos de Privacidade</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[#004785] transition-colors">Suporte Técnico</Link>
            <span>|</span>
            <Link href="#" className="hover:text-[#004785] transition-colors">Entre em contato</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ShortcutCard({ icon, bg, title, desc }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#004785]/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-[#004785] text-sm group-hover:text-blue-700 transition-colors">{title}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 pr-2">{desc}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#004785] shrink-0 transition-colors" />
    </div>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-100 transition-colors cursor-default group">
      <div className="flex items-center gap-3">
        <div className="text-blue-500">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">{label}</p>
          <p className="text-[10px] text-slate-500">{value}</p>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 group-hover:text-blue-400 transition-colors" />
    </div>
  );
}