# Clube de Robótica JGP — OBR 2026

Site institucional do Clube de Robótica da escola onde o Jorge é professor.
HTML estático + Supabase como backend (auth, RLS, storage).

## Estrutura do repo

- `index.html` — site público (era `robotica-site.html` antes de 2026-05-08)
- `admin.html` — painel admin protegido por Supabase Auth + RLS + role check
- `checklist.txt` — **fonte da verdade do progresso do deploy**. SEMPRE ler antes de qualquer ação no projeto. Atualizar conforme avança.
- `.gitignore` — ignora `.DS_Store`, `.env`, logs, IDEs

## Stack

- **Frontend:** HTML/CSS/JS puros, sem build, sem framework. Suporte a tema claro/escuro via `data-theme` no `<html>`.
- **Backend:** Supabase (plano Free)
  - Project ID: `wqpelifwwzshtntboeib`
  - Nome: `robotica-jgp`
  - Região: `sa-east-1`
- **Auth:** Supabase Auth (email/senha). Único admin atual: Jorge (`jorge.fxvx@gmail.com`).
- **Hospedagem (planejada):** Cloudflare Pages, conectado ao GitHub para deploy automático.

## Modelo de dados (Supabase, schema public)

- `teams` — equipes do clube
- `members` — alunos/membros
- `history_events` — eventos da timeline
- `blog_posts` — posts do blog
- `profiles(user_id, role, created_at)` — controle de role; `role = 'admin'` permite escrita

Funções/triggers importantes:
- `public.is_admin()` — SECURITY DEFINER, chamável por authenticated. Retorna true se user atual tem `role = 'admin'` em `profiles`. Usado no `admin.html` via `rpc('is_admin')`.
- Trigger `handle_new_user` — cria linha em `profiles` automaticamente no signup.

Buckets Storage:
- `blog-covers` e `history-photos` — SELECT amplo removido; upload/update/delete exigem `is_admin()`.

## Segurança / RLS

- RLS **ligado** em todas as tabelas (`teams`, `members`, `history_events`, `blog_posts`, `profiles`).
- Leitura pública nas 4 tabelas de conteúdo. Escrita apenas para admins (policies `admin_all_*`).
- Em `profiles`: usuário lê o próprio registro; só admin altera role.
- "Leaked Password Protection" indisponível no Free (item 4.7 marcado N/A).

## Convenções

- Não criar arquivos novos sem necessidade. Editar os existentes.
- Não inventar comentários: o código já é descritivo. Comentário só quando explica um *porquê* não-óbvio.
- Mensagens de commit em português, descrevendo o "porquê" da mudança.
- Antes de editar HTML: dar `git pull` para sincronizar com o que o outro colaborador possa ter feito.

## Fluxo de trabalho colaborativo

Este repo é compartilhado entre o Jorge e um colaborador. Ambos usam Claude Code com planos próprios. Como cada Claude tem memória independente:

- **Este `CLAUDE.md` é a memória compartilhada** — atualize-o sempre que decisões importantes forem tomadas.
- **`checklist.txt` é a fila de tarefas** — atualize ao concluir itens.
- Antes de mexer em qualquer arquivo: `git pull`.
- Após editar: `git add .` → `git commit -m "..."` → `git push`.
- Combinar via mensagem direta antes de editar o mesmo arquivo simultaneamente, para evitar conflitos.

## GitHub

- Repo: https://github.com/jorgefxv1/clube-robotica-jgp (público)
- Branch principal: `main`
- Owner: `jorgefxv1` (Jorge Frias)

## Status atual (resumo — detalhe em `checklist.txt`)

✅ Concluído: segurança Supabase (seção 4), git/GitHub (seção 2), renomeação para `index.html` (seção 3).
⏳ Próximo: hospedagem Cloudflare Pages (seção 1) → URLs no Supabase (seção 5) → testes em produção (seção 8).
