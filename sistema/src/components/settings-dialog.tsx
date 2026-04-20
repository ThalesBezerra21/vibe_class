"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSettings, updateSettings, Settings } from "@/actions/settings";
import { useRouter } from "next/navigation";

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({ emailTime: "18:00" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      getSettings().then(setSettings);
    }
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    await updateSettings(settings);
    
    // A trick to trigger the cron reload immediately (on next server request)
    // We can just refresh to ensure server config applies to next calls.
    router.refresh();
    
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Configurações</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações do Sistema</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="emailTime">Horário de Envio Diário de E-mails</Label>
            <Input
              id="emailTime"
              type="time"
              value={settings.emailTime}
              onChange={(e) => setSettings({ ...settings, emailTime: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Define o horário em que o resumo das notas será enviado para todos os alunos que tiveram notas alteradas durante o dia.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}