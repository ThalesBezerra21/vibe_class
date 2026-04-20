import { getStudents } from "@/actions/students";
import { StudentManager } from "./student-manager";

export default async function AlunosPage() {
  const initialStudents = await getStudents();

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie os alunos cadastrados no sistema.
          </p>
        </div>
        
        <StudentManager initialStudents={initialStudents} />
      </div>
    </div>
  );
}