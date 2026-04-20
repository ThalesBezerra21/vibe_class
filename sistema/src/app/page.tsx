import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4">
      <main className="text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Vibe Class
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          O gerenciador de sala de aula moderno e intuitivo.
        </p>
        <div className="pt-4">
          <Button size="lg" className="w-full sm:w-auto font-semibold">
            Começar Agora
          </Button>
        </div>
      </main>
    </div>
  );
}
