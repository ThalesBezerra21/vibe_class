import { getClasses } from "@/actions/classes";
import { getStudents } from "@/actions/students";
import { notFound } from "next/navigation";
import { ClassDetail } from "./class-detail";

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [classes, allStudents] = await Promise.all([
    getClasses(),
    getStudents(),
  ]);

  const classRoom = classes.find(c => c.id === id);
  
  if (!classRoom) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <ClassDetail classRoom={classRoom} allStudents={allStudents} />
    </div>
  );
}