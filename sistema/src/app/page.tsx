import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center flex-1 bg-background text-foreground px-4 py-16 sm:py-24">
      <main className="text-center w-full max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
            🎉 Bem-vindo ao Vibe Class
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            Gestão Escolar <br className="hidden sm:block" />
            <span className="text-primary">Simples e Moderna.</span>
          </h1>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-[42rem]">
            O gerenciador de sala de aula perfeito para acompanhar o progresso de seus alunos e organizar suas turmas com eficiência.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/alunos">
              <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 h-12 px-8">
                <Users className="w-5 h-5" />
                Gerenciar Alunos
              </Button>
            </Link>
            <Link href="/turmas">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold gap-2 h-12 px-8">
                <BookOpen className="w-5 h-5" />
                Gerenciar Turmas
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 pt-12">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Users className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Cadastro de Alunos</h3>
                <p className="text-sm text-muted-foreground">Registre novos alunos, edite informações e mantenha a base sempre atualizada.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <BookOpen className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Controle de Turmas</h3>
                <p className="text-sm text-muted-foreground">Crie turmas, matricule estudantes e organize seu semestre em poucos cliques.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 text-left">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <GraduationCap className="h-10 w-10 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Avaliações Precisas</h3>
                <p className="text-sm text-muted-foreground">Avalie alunos em três pilares principais usando métricas objetivas (MANA, MPA, MA).</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
