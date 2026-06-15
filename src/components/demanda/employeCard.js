import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Circle } from "lucide-react";

export default function FuncionarioCard({ nome, demandas }) {
  const total = demandas.length;
  const pendentes = demandas.filter(d => d.status === "pendente").length;

  return (
    <Card className="hover:border-[#004785] transition-all cursor-pointer group">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[#004785]">
            {nome.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{nome}</p>
            <p className="text-xs text-muted-foreground">{total} demandas totais</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pendentes > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">
              <Circle className="w-2 h-2 fill-current" /> {pendentes} pend.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}