import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-6 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 opacity-60">
          <div className="w-4 h-4 bg-[#004785] rounded-full" />
          <span className="text-xs font-medium text-muted-foreground">
            © {new Date().getFullYear()} ChronoTask - Ministério da Saúde / SUS
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-[#004785] transition-colors">Privacidade</a>
          <a href="#" className="hover:text-[#004785] transition-colors">Suporte Técnico</a>
          <a href="#" className="hover:text-[#004785] transition-colors">Gov.br</a>
        </div>
      </div>
    </footer>
  );
}
