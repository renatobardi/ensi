Contexto: este repositório é o app "Ways of Work" (funcional). Em
`docs/design-system/` estão TODOS os arquivos de referência: a pasta
`_ds/kubo-design-system-.../` (Kubo Design System), `WaysOfWork.dc.html`
(as 16 telas já rebrandadas como referência), `favicon.svg` (novo logo) e
`AGENTS.md` com as regras.

Tarefa: aplicar o rebrand do Kubo em TODO o app, mantendo 100% das
funcionalidades, rotas e comportamentos atuais. É um reskin: muda o visual,
não a lógica.

Regras: leia `docs/design-system/AGENTS.md` PRIMEIRO e siga-o à risca — é a
fonte de verdade. Antes de escrever qualquer CSS, leia os tokens em
`docs/design-system/_ds/kubo-design-system-.../tokens/` e a implementação de
referência `docs/design-system/WaysOfWork.dc.html`.

Pontos que NÃO podem falhar (todos detalhados no AGENTS.md):
1. Toda cor de UI vem de var(--*) do Kubo — NUNCA hex hardcoded. Tema claro por
   padrão; escuro via classe .dark (persistir escolha).
2. Remover a paleta antiga: sem vermelho Santander, sem teal Gluon, sem navy,
   sem tema azul da doc, sem gradientes.
3. A ÚNICA cor de marca é o âmbar WOW (--wow:#f59e0b / --wow-ink:#3a2a06),
   usada só em: logo, tag New, tint do pill de versão, botão Docs e ícone de
   filtro ativo.
4. Logo = lâmpada âmbar SOLTA (docs/design-system/favicon.svg), sem quadrado;
   wordmark "Ways of Work" (Inter 600); tagline em 1 linha. Setar o favicon.
5. Inter em tudo. Componentes e ícones (Lucide) SEMPRE do Kubo — nunca recriar
   nem usar emoji na interface (trocar todo emoji da doc por glifo Lucide).
6. Cards flat com ring (sem borda/sombra); botões pill com press translateY(1px).
7. Bilíngue PT-BR/EN por dicionário (UI + descrições), toggle no header.
8. Tags New (publicado ≤30 dias, âmbar) e Updated (atualizado ≤30 dias, neutro)
   ligadas às datas REAIS do apm.yml/metadata. New tem prioridade.
9. Marketplace mantém: filtros na sidebar com contadores, busca, toggle
   cards↔tabela e modal de instalação com copiar comando.
10. Remover o rodapé "Powered by APM · View Source" e o bloco de perfil na
    sidebar.

Entregue tela por tela, começando pelo Marketplace (que deve bater com
WaysOfWork.dc.html). Ao final, confirme o checklist "Definition of done" do
AGENTS.md.
