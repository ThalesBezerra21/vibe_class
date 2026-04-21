# Vibe Class

**Vibe Class** é um sistema de gerenciamento educacional prático desenvolvido para facilitar a administração de alunos, turmas, matrículas e avaliações.

## O que o Vibe Class faz?

O sistema permite que administradores e professores realizem as seguintes operações essenciais:
- **Gerenciamento de Alunos:** Cadastro, edição e deleção de alunos com informações detalhadas (Nome, CPF e E-mail).
- **Gerenciamento de Turmas:** Criação e configuração de turmas organizadas por disciplina, ano e semestre.
- **Matrículas e Vínculos:** Associação rápida de alunos cadastrados a turmas ativas.
- **Avaliações e Notas:** Lançamento das notas guiado por critérios estabelecidos (como "requisitos", "testes" e "implementacao") usando conceitos de avaliação (MA, MPA, MANA).
- **Notificações por E-mail Automáticas:** Fila de envio automático de e-mails via SMTP para notificar alunos de forma assíncrona assim que novas notas e avaliações são registradas.
*(Nota: O armazenamento local de dados é realizado utilizando arquivos JSON estáticos na pasta `data/`).*

## Tecnologias Utilizadas
- **Core:** [Next.js](https://nextjs.org/) App Router, React, TypeScript.
- **Estilização & UI:** Tailwind CSS, shadcn/ui.
- **Background Jobs:** Nodemailer & node-cron para o worker e envio de e-mails em segundo plano.
- **Qualidade & Testes:** Cucumber / Gherkin para Testes de Aceitação e Integração (BDD).

## Setup e Instalação

### Pré-requisitos
- Node.js (versão 18+ recomendada)
- npm, yarn ou pnpm

### Passos para rodar localmente

1. Clone o repositório e navegue até a pasta do projeto (`sistema/`).
2. Instale todas as dependências:
   ```bash
   npm install
   ```

3. **Configuração das Variáveis de Ambiente:**
   Para garantir que as funcionalidades de notificação de alunos operem normalmente, é necessário configurar o serviço de e-mail. Crie um arquivo `.env` (ou `.env.local`) na raiz do diretório `sistema/` e utilize o modelo abaixo:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   SMTP_FROM=your-email@gmail.com
   ```
   *(Substitua os dados com as suas credenciais reais de servidor SMTP, como senhas de aplicativo do Gmail)*.

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000). A partir do primeiro uso, os arquivos de repositório JSON aparecerão automaticamente dentro do diretório `/data`.

## Como Rodar os Testes de Aceitação (Integração)

O projeto **Vibe Class** utiliza boas práticas de BDD (*Behavior-Driven Development*) através do framework **Cucumber**, garantindo que as regras de negócio vitais estejam firmes através de testes de integração robustos.

Nossos cenários validam os fluxos de ponta-a-ponta independentes da interface (Server Actions), tais como vincular alunos ou gerenciar persistência de turmas. 

Para testar a aplicação, execute o script no seu terminal:

```bash
npm run test:integration
```

Os arquivos com a escrita das instâncias e cenários de testes ficam organizados no diretório `features/` (em português) e o seu mapeamento em TypeScript encontra-se em `features/step_definitions/`.
