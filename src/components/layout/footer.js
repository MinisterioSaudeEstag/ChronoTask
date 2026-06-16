import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3 opacity-80">
             <img src="/logo-ms.jpg" alt="MS" className="h-6 w-auto" />
             <span className="text-xs font-bold text-muted-foreground uppercase">Ministério da Saúde</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Diretoria de Tecnologia da Informação e Redes - <span className="font-semibold">DITRE/PE</span>
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link href="/privacidade" className="hover:text-[#004785] transition-colors">Termos de Privacidade</Link>
          <Link href="#" className="hover:text-[#004785] transition-colors">Suporte Técnico</Link>
          <Link href="https://www.gov.br" target="_blank" className="hover:text-[#004785] transition-colors">Gov.br</Link>
        </div>
      </div>
    </footer>
  );
}