import { Database, Gauge, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const SURFACES = [
  {
    key: "inferenceLedger",
    icon: Database,
    numPoints: 3,
    tone: "from-sky-500/12 via-sky-500/6 to-transparent",
  },
  {
    key: "financeLedger",
    icon: ReceiptText,
    numPoints: 3,
    tone: "from-amber-500/14 via-amber-500/6 to-transparent",
  },
  {
    key: "liveQuotas",
    icon: Gauge,
    numPoints: 3,
    tone: "from-emerald-500/14 via-emerald-500/6 to-transparent",
  },
] as const;

export function AccountingModelCard() {
  const { t } = useTranslation();

  return (
    <Card className="relative overflow-hidden border-border/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_32%)]" />
      <CardHeader className="relative px-5 pt-5 pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {t("accountingModel.title")}
        </CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6">
          {t("accountingModel.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative grid gap-3 px-5 pb-5 md:grid-cols-3">
        {SURFACES.map((surface) => {
          const Icon = surface.icon;
          const points = Array.from({ length: surface.numPoints }, (_, i) =>
            t(`accountingModel.surfaces.${surface.key}.point${i + 1}`)
          );
          return (
            <div
              key={surface.key}
              className={`rounded-2xl border border-border/70 bg-gradient-to-br ${surface.tone} p-4 shadow-sm`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t(`accountingModel.surfaces.${surface.key}.title`)}</div>
                  <div className="text-xs text-muted-foreground">{t(`accountingModel.surfaces.${surface.key}.description`)}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {points.map((point) => (
                  <div key={point}>{point}</div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
