"use client";

import { useState } from "react";
import { ClassRoom, addClass, updateClass, deleteClass, toggleStudentEnrollment, updateStudentEvaluation } from "@/actions/classes";
import { Student } from "@/actions/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ClassManager({ initialClasses, allStudents }: { initialClasses: ClassRoom[], allStudents: Student[] }) {
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [isOpen, setIsOpen] = useState(false);
  const [viewingClass, setViewingClass] = useState<ClassRoom | null>(null);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    description: "",
    year: new Date().getFullYear(),
    semester: 1,
  });

  const handleOpenNew = () => {
    setEditingClass(null);
    setFormData({ description: "", year: new Date().getFullYear(), semester: 1 });
    setIsOpen(true);
  };

  const handleOpenEdit = (classRoom: ClassRoom) => {
    setEditingClass(classRoom);
    setFormData({ description: classRoom.description, year: classRoom.year, semester: classRoom.semester });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) {
      await updateClass(editingClass.id, { ...formData, year: Number(formData.year), semester: Number(formData.semester) });
    } else {
      await addClass({
        ...formData,
        year: Number(formData.year),
        semester: Number(formData.semester),
        enrolledStudents: [],
        evaluations: {},
      });
    }
    setIsOpen(false);
    refreshData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta turma?")) {
      await deleteClass(id);
      refreshData();
    }
  };

  const handleToggleEnrollment = async (classId: string, studentId: string) => {
    await toggleStudentEnrollment(classId, studentId);
    await refreshData();
  };

  const handleUpdateEvaluation = async (classId: string, studentId: string, grade: string, notes: string) => {
    await updateStudentEvaluation(classId, studentId, { 
      grade: grade ? Number(grade) : null,
      notes
    });
    refreshData();
  };

  const refreshData = async () => {
    const updatedClasses = await import("@/actions/classes").then((m) => m.getClasses());
    setClasses(updatedClasses);
    
    // Update viewing class if open
    if (viewingClass) {
      const updatedView = updatedClasses.find(c => c.id === viewingClass.id);
      setViewingClass(updatedView || null);
    }
    
    router.refresh();
  };

  // Searching logic
  const filteredStudents = allStudents.filter(s => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.cpf.includes(q) || s.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* List / Form classes dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>Voltar</Button>
          <Button onClick={handleOpenNew}>Nova Turma</Button>
        </div>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Editar Turma" : "Nova Turma"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="desc">Tópico / Descrição</Label>
              <Input
                id="desc"
                placeholder="Ex: Introdução a Programação"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sem">Semestre</Label>
                <Input
                  id="sem"
                  type="number"
                  min="1"
                  max="2"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {viewingClass && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {viewingClass.description} ({viewingClass.year}/{viewingClass.semester})
                </DialogTitle>
              </DialogHeader>
              
              {/* Alunos matriculados e notas */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Alunos Matriculados ({viewingClass.enrolledStudents.length})</h3>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Nota</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingClass.enrolledStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Nenhum aluno matriculado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        viewingClass.enrolledStudents.map(studentId => {
                          const student = allStudents.find(s => s.id === studentId);
                          if (!student) return null;
                          const evaluation = viewingClass.evaluations[studentId] || { grade: null, notes: "" };

                          return (
                            <TableRow key={studentId}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>
                                <Input 
                                  type="number" 
                                  className="w-20 form-input h-8" 
                                  defaultValue={evaluation.grade ?? ""}
                                  onBlur={(e) => handleUpdateEvaluation(viewingClass.id, studentId, e.target.value, evaluation.notes)}
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  className="w-full form-input h-8" 
                                  placeholder="Obs..."
                                  defaultValue={evaluation.notes ?? ""}
                                  onBlur={(e) => handleUpdateEvaluation(viewingClass.id, studentId, String(evaluation.grade ?? ""), e.target.value)}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="destructive" size="sm" onClick={() => handleToggleEnrollment(viewingClass.id, studentId)}>
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Matricular novos alunos */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-lg mb-2">Matricular Aluno</h3>
                <div className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Pesquisar por nome, CPF ou email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchQuery.trim().length > 0 && (
                    <div className="rounded-md border my-2 bg-background shadow-sm">
                       <Table>
                        <TableBody>
                          {filteredStudents.length === 0 ? (
                            <TableRow><TableCell className="text-center text-sm py-4">Nenhum aluno encontrado</TableCell></TableRow>
                          ) : (
                            filteredStudents.map(student => {
                              const isEnrolled = viewingClass.enrolledStudents.includes(student.id);
                              return (
                                <TableRow key={student.id}>
                                  <TableCell>{student.name} <span className="opacity-50 text-xs ml-2">{student.cpf}</span></TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant={isEnrolled ? "outline" : "default"} 
                                      size="sm" 
                                      onClick={() => handleToggleEnrollment(viewingClass.id, student.id)}
                                    >
                                      {isEnrolled ? "Desmatricular" : "Matricular"}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          )}
                        </TableBody>
                       </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tópico</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Alunos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhuma turma cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.description}</TableCell>
                  <TableCell>{cls.year} / {cls.semester}º Sem</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cls.enrolledStudents.length}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewingClass(cls)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(cls)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}