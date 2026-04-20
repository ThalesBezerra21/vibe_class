"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { processDailyEmails } from "@/actions/emails";
import { Mail, Check, Loader2 } from "lucide-react";

export function ProcessEmailsButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProcess = async () => {
    setLoading(true);
    await processDailyEmails();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setLoading(false);
    }, 3000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleProcess}
      disabled={loading}
      className={`border-dashed gap-2 ${success ? "border-green-500 text-green-500" : ""}`}
    >
      {success ? (
        <>
          <Check className="h-4 w-4" />
          Enviado
        </>
      ) : loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          Testar Envio Diário
        </>
      )}
    </Button>
  );
}