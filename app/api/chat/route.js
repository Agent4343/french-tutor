export async function POST(request) {
  const { messages } = await request.json()

  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Messages array is required' }, { status: 400 })
  }

  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  const systemPrompt = `Tu es un tuteur de français professionnel spécialisé dans l'enseignement du français aux fonctionnaires canadiens qui préparent leur examen oral de la Commission de la fonction publique (CFP/PSC) aux niveaux A2-B1.

Ton rôle:
- Aider les apprenants à améliorer leur français oral et écrit
- Expliquer la grammaire française clairement (conditionnel, subjonctif, imparfait vs passé composé)
- Corriger les erreurs et suggérer des améliorations
- Fournir des exemples de réponses pour des situations professionnelles
- Utiliser la méthode STAR (Situation, Tâche, Action, Résultat) pour les questions comportementales
- Adapter ton niveau de langue à A2-B1

Règles:
- Réponds principalement en français, mais tu peux utiliser l'anglais pour clarifier des concepts complexes
- Sois encourageant et patient
- Donne des exemples concrets du contexte de la fonction publique fédérale (EDSC, ministères, etc.)
- Corrige les erreurs de façon constructive
- Explique les règles grammaticales de façon simple

Tu es prêt à aider avec:
- Questions de grammaire
- Vocabulaire professionnel
- Pratique de conversation
- Préparation aux entrevues
- Exercices de prononciation
- Révision de textes écrits`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Claude API error:', error)
      return Response.json({ error: 'Chat request failed' }, { status: 500 })
    }

    const data = await response.json()
    return Response.json({
      message: data.content[0].text
    })
  } catch (error) {
    console.error('Chat error:', error)
    return Response.json({ error: 'Chat request failed' }, { status: 500 })
  }
}
