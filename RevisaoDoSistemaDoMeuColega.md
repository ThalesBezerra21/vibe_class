# Revisão do projeto do colega - Ricardo Lins

## Revisão do sistema

### 1. O sistema está funcionando com as funcionalidades solicitadas?

Sim, o sistema está funcionando com todas as funcionalidades solicitadas, incluindo criar turmas, adicionar estudantes e enviar e-mails. O sistema tem persistência com JSON, como recomendado. 

A única ressalva é que o sistema não envia um e-mail por dia, como solicitado, mas envia o e-mail quando o usuário aperta um botão.

### 2. Quais os problemas de qualidade do código e dos testes?

Os dados são salvos em arquivos `.json` que estão dentro da pasta do projeto e não foram adicionados no `.gitignore`, tendo sido inclusive commitados. Qualquer alteração nos dados, como adicionar um aluno, é identificada pelo git como uma mudança no código do projeto.

Quando os arquivos `.ts` foram transpilados para `.js`, os `.js` resultantes foram commitados, que não é ideal.

Os testes no geral estão completos, senti falta apenas de testes para o caso de excluir estudantes e turmas.

No geral, a qualidade do código está sólida.

### 3. Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu sistema?

No geral ambos sistemas atendem o que foi solicitado. A principal diferença é que meu sistema envia todos os e-mail uma vez por dia em um horário escolhido pelo usuário, enquanto o do colega envia o de cada um quando um botão especifico para cada aluno é apertado.

Acho que meu projeto teve design e UX mais elaborados que o do colega, devido ao uso de uma biblioteca de frontend que eu pedi explicitamente para o agente utilizar.

O colega implementou mais casos de testes que eu, inclusive na parte dos e-mails, que não foi coberta de forma tão completa no meu projeto.

## Revisão do histórico de desenvolvimento

### 1. Estratégias de interação utilizadas

Inicialmente, o colega fez um `requirements.md` manualmente e pediu para o agente fazer um sistema com base nele.

Também foi pedido para que o agente fizesse arquivos de planejamento, como `pre-plan.md` e `plan.md`, além de pedir para o próprio agente fazer o `AGENT.md`.

Frequentemente o colega pede para o agente agir como um "desenvolvedor sênior", em busca de melhores resultados.

### 2. Situações em que o agente funcionou melhor ou pior

O agente parece ter tido mais dificuldades em fazer tarefas relacionadas ao e-mail, o que requiriu mais prompts para o refinamento.

Nas outras tarefas ele se saiu bem, sem nenhum grande erro ou impedimento.

### 3. Tipos de problemas observados (por exemplo, código incorreto ou inconsistências)

Quando o colega pediu a implementação da funcionalidade de e-mail, o agente entregou com o envio de e-mails mockado.
 
Na geração de testes, inicialmente o agente gerou testes muito básicos.

O agente não conseguiu fazer funcionar corretamente o envio de e-mail diários, fazendo o colega descartar essa funcionalidade.

### 4. Avaliação geral da utilidade do agente no desenvolvimento

O agente foi fundamental para a implementação do sistema, conseguindo executar a maior parte das tarefas sem problemas e sem a necessidade de grandes backtrackings. O programa foi construído sem a necessidade de grandes intervenções manuais do usuário. 

A única grande falha do agente foi não conseguir enviar o e-mail diário, se bem que provavelmente isso provavelmente seria alcançado com mais tentativas e melhor refinamento de prompt.

### 5. Comparação com a sua experiência de uso do agente

O colega usou conceitos de agentes mais avançadas que eu, incluindo múltiplos documentos em markdown para elencar requisitos, design do sistema e fazer planejamento, mas não necessariamente ele chegou em um resultado melhor utilizando isso, o que põe em dúvida a necessidade de abordagens mais complexas em um projeto desse escopo. Percebi também que a quantidade de prompts utilizados foi parecida nos dois projetos, o que significa que a abordagem mais complexa parece não necessariamente ter resultado em prompts mais eficientes do que a minha abordagem.

Sendo mais específico, tanto no meu projeto quanto no dele a parte de envio de e-mails foi onde o agente teve mais dificuldade, inclusive ambos encontramos o problema de o agente inicialmente mockar a funcionalidade ao invés de implementar. Fora a isso, o agente conseguiu implementar o resto do sistema sem grandes problemas em ambos projetos.

