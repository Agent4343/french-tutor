export async function POST(request) {
  const { completedTopics, difficulty, count = 10 } = await request.json()

  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  const systemPrompt = `Tu es un examinateur expert pour l'examen oral PSC (Commission de la fonction publique du Canada) niveau A2-B1.

Tu génères de nouvelles questions d'examen oral pour pratiquer. Les questions doivent:
1. Être appropriées pour un examen oral de français niveau A2-B1
2. Concerner le contexte professionnel de la fonction publique canadienne (EDSC, Service Canada, etc.)
3. Être variées et couvrir différents thèmes
4. Cibler différentes structures grammaticales

THÈMES POSSIBLES:
- Introduction personnelle
- Parcours professionnel
- Responsabilités actuelles
- Travail d'équipe et collaboration
- Gestion de conflits
- Adaptation au changement
- Développement professionnel
- Services du ministère
- Projets spéciaux
- Objectifs futurs

STRUCTURES GRAMMATICALES À CIBLER:
- Présent de l'indicatif
- Passé composé
- Imparfait
- Plus-que-parfait
- Futur simple
- Conditionnel présent
- Conditionnel passé
- Subjonctif présent

Génère ${count} nouvelles questions différentes de celles déjà posées.

Réponds en JSON avec ce format:
{
  "questions": [
    {
      "id": 41,
      "question": "la question en français",
      "topic": "thème (introduction, explaining, adaptation, future_plans, conflict_management, communication_leadership)",
      "difficulty": "A2 | A2-B1 | B1 | B1+",
      "targetStructures": ["structures grammaticales ciblées"],
      "grammarTip": "conseil grammatical détaillé avec exemples de formation",
      "exampleAnswer": "exemple de réponse complète en français"
    }
  ]
}`

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
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Génère ${count} nouvelles questions d'examen oral PSC.

Thèmes déjà bien couverts (évite de les répéter trop): ${completedTopics?.join(', ') || 'aucun'}

Niveau de difficulté souhaité: ${difficulty || 'B1'}

Assure-toi que chaque question:
1. A un grammarTip détaillé expliquant la structure grammaticale à utiliser
2. A un exampleAnswer montrant comment répondre correctement
3. Est différente des questions typiques d'introduction

Réponds en JSON.`
        }]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Claude API error:', error)
      return Response.json({ error: 'Question generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const responseText = data.content[0].text

    // Try to parse JSON from response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        return Response.json(result)
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
    }

    return Response.json({ error: 'Failed to parse generated questions' }, { status: 500 })
  } catch (error) {
    console.error('Generation error:', error)
    return Response.json({ error: 'Question generation failed' }, { status: 500 })
  }
}
