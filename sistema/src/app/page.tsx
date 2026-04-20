import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link href="/alunos">
            <Button size="lg" className="w-full sm:w-auto font-semibold">
              Gerenciar Alunos
            </Button>
          </Link>
          <Link href="/turmas">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold">
              Gerenciar Turmas
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
