import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const OBR_KNOWLEDGE = `
Você é um assistente especialista na OBR (Olimpíada Brasileira de Robótica) integrado ao site do Clube de Robótica JGP.
Responda sempre em português, de forma clara e amigável para alunos do Ensino Médio.
Use respostas curtas e diretas. Se não souber algo com certeza, diga que o aluno deve consultar o site oficial obr.robocup.org.br.

## Sobre a OBR
- A OBR é uma olimpíada científica com temática de Robótica. É pública, gratuita e sem fins lucrativos.
- Iniciativa RoboCup Brasil em parceria com o IFRN.
- Mais de 200 mil participantes de todos os estados brasileiros.
- Objetivo: incentivar jovens na carreira científico-tecnológica, envolvendo robótica e IA com disciplinas escolares.
- Site oficial: obr.robocup.org.br
- Email da modalidade prática: obr.pratica@robocup.org.br

## Modalidades
### Modalidade Teórica
- Prova individual de múltipla escolha sobre robótica e ciências.
- Níveis 1 a 5 (por série/idade).
- Não precisa de hardware. Qualquer aluno pode participar.

### Modalidades Práticas Presenciais
**Resgate:** O robô deve percorrer uma pista, detectar "vítimas" (bolinhas coloridas), coletá-las com garra ou sucção e depositá-las na zona de resgate. O robô é autônomo.
- Nível 1: pista simples, linha preta, vítimas fáceis.
- Nível 2: pista complexa, obstáculos, vítimas variadas. Os melhores do Nível 2 concorrem a vagas na RoboCup Mundial.

**Robótica Artística:** Apresentação cultural com robô. Criatividade e dança com robôs.

**Virtual/Simulação:** Robôs digitais em ambiente simulado de resgate. Acessível sem hardware físico. Pode ser combinada com modalidades presenciais.

## Estrutura da Competição
1. Etapa Regional ou Estadual (organizada por cada estado)
2. Etapa Nacional (realizada em cidade diferente a cada ano; em 2025 foi em Vitória/ES)
3. RoboCup Mundial (os destaques do Nível 2 presencial concorrem a vagas)

## Premiações
- Medalhas, certificados e classificações para a RoboCup Mundial.
- Bolsas de Iniciação Científica Júnior do CNPq.
- Vagas em instituições públicas de ensino.
- Minicursos e outros prêmios.

## Inscrições
- Inscrições abertas para OBR 2026 (abertas em março de 2026).
- As inscrições são feitas pelo Sistema Olimpo no Portal do Participante.
- Gratuitas. Professor cadastra a escola e os alunos.
- Manuais e documentos disponíveis em: obr.robocup.org.br/participantes/

## Pista de Resgate (Regras Gerais)
- As vítimas são bolinhas que simulam pessoas em desastre.
- O robô detecta com sensores (cor, distância, câmera), coleta e deposita na zona de resgate.
- Cada vítima corretamente depositada vale pontos.
- Velocidade e precisão influenciam no placar.
- O robô deve ser autônomo durante a prova (sem controle remoto).
- Dimensões máximas do robô variam conforme o manual de cada edição.

## Cronograma do Clube JGP (OBR 2026)
- Fase 1 — Pesquisa e Design: 11–18 de maio
- Fase 2 — Montagem Física: 19–30 de maio
- Fase 3 — Programação: 31 mai – 10 jun
- Fase 4 — Testes e Ajustes: 11–20 de junho
`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { question, history = [] } = await req.json();

    if (!question || typeof question !== "string" || question.length > 800) {
      return new Response(
        JSON.stringify({ error: "Pergunta inválida." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Bot não configurado. Contate o administrador." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new Anthropic({ apiKey });

    const messages: Anthropic.MessageParam[] = [
      ...history.slice(-6),
      { role: "user", content: question },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: OBR_KNOWLEDGE,
      messages,
    });

    const answer = response.content[0].type === "text" ? response.content[0].text : "";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Erro interno. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
