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

            <div className="relative hidden lg:block perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#004785]/10 to-transparent rounded-3xl blur-3xl -z-10" />
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex h-[460px] transform hover:-translate-y-2 transition-transform duration-500">
                <div className="w-64 bg-[#003566] text-white p-6 flex flex-col gap-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarCheck className="w-6 h-6 text-blue-300" />
                    <span className="font-bold text-lg">ChronoTask</span>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-md text-sm font-medium"><LayoutDashboard className="w-4 h-4" /> Início</div>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white"><FileText className="w-4 h-4" /> Minhas atividades</div>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white"><Users className="w-4 h-4" /> Equipe</div>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white"><LineChart className="w-4 h-4" /> Relatórios</div>
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white"><Settings className="w-4 h-4" /> Perfil</div>
                  </nav>
                </div>
                <div className="flex-1 bg-[#f8fafc] flex flex-col">
                  <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
                    <div className="relative w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input type="text" placeholder="Buscar demanda..." className="w-full bg-slate-100 rounded-md py-1.5 pl-9 pr-4 text-sm outline-none" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Bell className="w-5 h-5 text-slate-400" />
                      <div className="w-8 h-8 rounded-full bg-[#004785] text-white flex items-center justify-center"><User className="w-4 h-4" /></div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Olá, Maria!</h2>
                      <p className="text-sm text-slate-500">Veja o resumo das suas demandas de hoje.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <MockupStat value="12" label="Total de demandas" icon={<FileText className="w-4 h-4 text-blue-500" />} />
                      <MockupStat value="4" label="Em andamento" icon={<div className="w-2 h-2 rounded-full bg-blue-500" />} />
                      <MockupStat value="3" label="Atrasadas" icon={<div className="w-2 h-2 rounded-full bg-red-500" />} />
                      <MockupStat value="5" label="Concluídas" icon={<div className="w-2 h-2 rounded-full bg-green-500" />} />
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-sm text-slate-800">Atividades recentes</h3>
                        <span className="text-xs text-blue-600 font-medium">Ver todas →</span>
                      </div>
                      <div className="space-y-3">
                        <MockupListItem title="Análise de processo nº 25000.123456/2024-11" sub="Convênio 12545 - Fundo Municipal de Saúde" user="João Silva" status="Em andamento" statusColor="blue" />
                        <MockupListItem title="Elaboração de parecer técnico" sub="Processo nº 25000.987654/2024-22" user="Ana Costa" status="Atrasada" statusColor="red" />
                        <MockupListItem title="Revisão de documentos" sub="Convênio 67890 - Hospital Municipal" user="Carlos Lima" status="Concluída" statusColor="green" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              
              <StepItem number="02" title="Servidor recebe" desc="Visualiza suas atividades." />
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

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
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
              <p className="text-xs text-slate-500">Secretaria Executiva | COTRE/PE | DITRE/PE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium text-[#004785]">
            <Link href="#" className="hover:underline">Termos de Privacidade</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:underline">Suporte Técnico</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:underline">Entre em contato</Link>
          </div>
        </div>
      </footer>
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