import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  FileText,
  Users, 
  ClipboardList,
  ChevronRight,
  LineChart,
  CalendarCheck,
  Bell,
  Search,
  LayoutDashboard,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      <header className="bg-white sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-8 h-8 text-[#004785]" />
              <span className="font-bold text-2xl tracking-tight text-[#004785]">
                ChronoTask
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#" className="text-[#004785] border-b-2 border-[#004785] pb-1">Início</Link>
              <Link href="#" className="hover:text-[#004785] transition-colors">Recursos</Link>
              <Link href="#" className="hover:text-[#004785] transition-colors">Como funciona</Link>
              <Link href="#" className="hover:text-[#004785] transition-colors">Suporte</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium text-slate-600 hover:text-[#004785]">
                Entrar
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#004785] hover:bg-[#003566] text-white px-5 rounded-md gap-2">
                Acessar Sistema <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Organize suas demandas.<br/>
                Acompanhe seus prazos.<br/>
                Entregue com <span className="text-[#004785]">controle.</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                O ChronoTask centraliza as demandas da equipe, facilita a distribuição das atividades e permite acompanhar prazos, responsáveis e andamento em um único lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="bg-[#004785] hover:bg-[#003566] text-white px-8 rounded-md gap-2">
                    Acessar o sistema <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8 text-[#004785] border-[#004785] hover:bg-[#004785]/5 rounded-md">
                  Conhecer recursos
                </Button>
              </div>
            </div>

            <div className="relative z-10">
              <img 
                src="mockup-dashboard.png"
                alt="Mockup do dashboard do ChronoTask"
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
              Tudo sob controle em um único lugar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <HorizontalFeatureCard 
                icon={<ClipboardList className="w-6 h-6 text-[#004785]" />}
                title="Demandas"
                description="Organize todas as atividades da sua equipe."
              />
              <HorizontalFeatureCard 
                icon={<Users className="w-6 h-6 text-[#004785]" />}
                title="Equipe"
                description="Distribua responsabilidades de forma simples."
              />
              <HorizontalFeatureCard 
                icon={<Clock className="w-6 h-6 text-[#004785]" />}
                title="Prazos"
                description="Acompanhe vencimentos e evite atrasos."
              />
              <HorizontalFeatureCard 
                icon={<CheckCircle className="w-6 h-6 text-[#004785]" />}
                title="Resultados"
                description="Monitore conclusões e garanta entregas."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">
              Como o ChronoTask funciona
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
              <StepItem number="01" title="Administrador atribui" desc="Define as demandas e responsáveis." />
              <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
              
              <StepItem number="02" title="Funcionário recebe" desc="Visualiza suas atividades." />
              <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
              
              <StepItem number="03" title="Atividade é executada" desc="Com o acompanhamento da equipe." />
              <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
              
              <StepItem number="04" title="Entrega é registrada" desc="Atualiza o status da demanda." />
              <ChevronRight className="hidden md:block w-5 h-5 text-slate-300 shrink-0" />
              
              <StepItem number="05" title="Gestão acompanha" desc="Acessa relatórios e resultados." />
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">
              Recursos principais
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <HorizontalFeatureCard 
                icon={<Users className="w-6 h-6 text-[#004785]" />}
                title="Gestão de equipe"
                description="Distribua demandas e acompanhe responsáveis."
              />
              <HorizontalFeatureCard 
                icon={<FileText className="w-6 h-6 text-[#004785]" />}
                title="Controle de processos"
                description="Vincule demandas aos respectivos processos."
              />
              <HorizontalFeatureCard 
                icon={<Clock className="w-6 h-6 text-[#004785]" />}
                title="Controle de prazos"
                description="Acompanhe início, término e tempo estimado."
              />
              <HorizontalFeatureCard 
                icon={<LineChart className="w-6 h-6 text-[#004785]" />}
                title="Acompanhamento em tempo real"
                description="Veja o status de cada demanda instantaneamente."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function HorizontalFeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-[#004785]/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function StepItem({ number, title, desc }) {
  return (
    <div className="flex items-start gap-4 max-w-[220px]">
      <div className="w-8 h-8 rounded-full bg-[#004785] text-white flex items-center justify-center text-sm font-bold shrink-0">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-sm text-[#004785] mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function MockupStat({ value, label, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        {icon}
      </div>
      <span className="text-[10px] text-slate-500 uppercase font-semibold">{label}</span>
    </div>
  );
}

function MockupListItem({ title, sub, user, status, statusColor }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
  };
  const dotMap = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${dotMap[statusColor]}`} />
        <div>
          <p className="text-xs font-semibold text-slate-800">{title}</p>
          <p className="text-[10px] text-slate-500">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-[10px] text-slate-500 text-right hidden md:block">
          <p className="font-medium text-slate-700">{user}</p>
          <p>Hoje, 10:24</p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold ${colorMap[statusColor]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}