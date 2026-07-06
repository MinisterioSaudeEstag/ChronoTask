import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Circle } from "lucide-react";

export default function FuncionarioCard({ nome, demandas }) {
  const total = demandas.length;
  const pendentes = demandas.filter(d => d.status === "pendente").length;
  const naoIniciadas = demandas.filter(d => d.status === "nao_iniciado").length;

  return (
    <Card className="hover:border-primary transition-all group bg-white dark:bg-darkCard">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-primary">
            {nome.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-900 dark:text-white">{nome}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{total} demandas totais</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">

          {pendentes > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium border border-amber-200">
              <Circle className="w-2 h-2 fill-current" />
              {pendentes} {pendentes === 1 ? "pendente" : "pendentes"}
            </span>
          )}

          {naoIniciadas > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium border border-slate-300">
              <Circle className="w-2 h-2 fill-current" />
              {naoIniciadas} {naoIniciadas === 1 ? "não iniciada" : "não iniciadas"}
            </span>
          )}

        </div>
      </CardContent>
    </Card>
  );
}