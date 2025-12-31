export async function POST(request) {
  const { question, answer, difficulty, targetStructures } = await request.json()

  if (!question || !answer) {
    return Response.json({ error: 'Question and answer are required' }, { status: 400 })
  }

  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  const systemPrompt = `Tu es un examinateur expert de français pour l'examen oral PSC (Commission de la fonction publique du Canada) niveau ${difficulty || 'A2-B1'}.

Ton rôle est d'analyser la réponse orale d'un candidat et de fournir une rétroaction constructive.

IMPORTANT: Le candidat est un apprenant et peut faire des erreurs de prononciation qui ont été transcrites incorrectement par la reconnaissance vocale. Identifie ces erreurs probables et suggère les corrections.

Tu dois analyser:
1. Les erreurs de prononciation probables (basées sur les mots mal transcrits)
2. Les erreurs grammaticales
3. L'utilisation des structures cibles: ${(targetStructures || []).join(', ')}
4. Le vocabulaire approprié pour le contexte professionnel
5. La clarté et la structure de la réponse

Réponds en JSON avec ce format exact:
{
  "pronunciationErrors": [
    {"heard": "mot mal prononcé/transcrit", "correction": "forme correcte", "explanation": "explication brève"}
  ],
  "grammarErrors": [
    {"error": "erreur", "correction": "correction", "rule": "règle grammaticale"}
  ],
  "structuresUsed": ["liste des structures grammaticales correctement utilisées"],
  "structuresMissing": ["structures cibles non utilisées"],
  "vocabularySuggestions": ["suggestions de vocabulaire professionnel"],
  "overallFeedback": "commentaire général encourageant de 2-3 phrases",
  "improvedVersion": "version améliorée de la réponse du candidat en 2-3 phrases"
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
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Question posée: "${question}"

Réponse du candidat (transcription vocale): "${answer}"

Analyse cette réponse et fournis ta rétroaction en JSON.`
        }]
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Claude API error:', error)
      return Response.json({ error: 'Analysis request failed' }, { status: 500 })
    }

    const data = await response.json()
    const responseText = data.content[0].text

    // Try to parse JSON from response
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        return Response.json({ analysis })
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
    }

    // If JSON parsing fails, return raw text
    return Response.json({
      analysis: {
        pronunciationErrors: [],
        grammarErrors: [],
        structuresUsed: [],
        structuresMissing: [],
        vocabularySuggestions: [],
        overallFeedback: responseText,
        improvedVersion: ""
      }
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json({ error: 'Analysis request failed' }, { status: 500 })
  }
}
