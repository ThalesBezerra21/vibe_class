import { getClasses } from "@/actions/classes";
import { getStudents } from "@/actions/students";
import { ClassManager } from "./class-manager";

export default async function TurmasPage() {
  const [initialClasses, initialStudents] = await Promise.all([
    getClasses(),
    getStudents(),
  ]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground">
            Gerencie as turmas, matrículas de alunos e acompanhamento de avaliações.
          </p>
        </div>
        
        <ClassManager initialClasses={initialClasses} allStudents={initialStudents} />
      </div>
    </div>
  );
}