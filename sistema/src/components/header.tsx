"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl inline-block text-primary">Vibe Class</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/alunos"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Gerenciar Alunos
            </Link>
            <Link
              href="/turmas"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Gerenciar Turmas
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
      <div className="md:hidden flex px-4 pb-2 gap-4 border-t">
         <Link
            href="/alunos"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary pt-2"
          >
            Alunos
          </Link>
          <Link
            href="/turmas"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary pt-2"
          >
            Turmas
          </Link>
      </div>
    </header>
  );
}