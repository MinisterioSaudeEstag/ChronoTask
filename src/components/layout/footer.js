import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 bg-darkBg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3 opacity-80">
            <img src="/logo-sus.png" alt="SUS" className="h-6 w-auto" />
            <span className="text-xs font-bold uppercase text-slate-400 ml-2">Ministério da Saúde</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Secretaria Executiva | COTRE/PE | DITRE/PE
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link href="/privacidade" className="hover:text-white transition-colors">Termos de Privacidade</Link>
          <Link className="hover:text-white transition-colors">Suporte Técnico | Entre em contato | Arthur.moreira@saude.gov.br</Link>
          <Link href="https://www.gov.br" target="_blank" className="hover:text-white transition-colors">
            <img src="/logo-ms.jpeg" alt="gov.br" className="h-5 w-auto" />
          </Link>
        </div>
      </div>
    </footer>
  );
}