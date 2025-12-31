export async function POST(request) {
  const { question, answer, difficulty, targetStructures } = await request.json()

  if (!question || !answer) {
    return Response.json({ error: 'Question and answer are required' }, { status: 400 })
  }

  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  const systemPrompt = `Tu es un expert en phonétique française et coach de prononciation pour l'examen oral PSC (Commission de la fonction publique du Canada) niveau ${difficulty || 'A2-B1'}.

Tu analyses la prononciation des apprenants anglophones qui apprennent le français. Tu es spécialisé dans l'identification des erreurs de prononciation typiques des anglophones.

SONS FRANÇAIS DIFFICILES POUR LES ANGLOPHONES:
1. Le "R" français (uvulaire) - Les anglophones roulent souvent le R ou utilisent le R anglais
2. Le "U" français [y] - Confusion avec "ou" [u], ex: "tu" vs "tout"
3. Les voyelles nasales: "an/en" [ɑ̃], "in/ain" [ɛ̃], "on" [ɔ̃], "un" [œ̃]
4. Le "EU" [ø] comme dans "deux", "peu"
5. La différence é [e] vs è [ɛ]
6. Le son "GN" [ɲ] comme dans "gagner"
7. Les liaisons manquantes ou incorrectes
8. L'intonation française (montante pour questions)

ANALYSE LA RÉPONSE POUR:
1. Erreurs de prononciation phonétiques détaillées avec symboles IPA
2. Position de la bouche et conseils articulatoires
3. Erreurs typiques d'anglophones détectées
4. Erreurs grammaticales
5. Utilisation des structures cibles: ${(targetStructures || []).join(', ')}

Réponds en JSON avec ce format exact:
{
  "pronunciationErrors": [
    {
      "heard": "mot mal prononcé/transcrit",
      "correction": "forme correcte",
      "phonetic": "transcription IPA correcte",
      "soundType": "r_uvulaire|u_francais|voyelle_nasale|eu|e_accent|gn|liaison|autre",
      "explanation": "explication détaillée",
      "mouthPosition": "description de la position de la bouche/langue",
      "practiceWord": "mot simple pour pratiquer ce son"
    }
  ],
  "phoneticTips": [
    {
      "sound": "nom du son problématique",
      "ipa": "symbole IPA",
      "tip": "conseil de prononciation détaillé",
      "mouthGuide": "🔴 Lèvres: ... 👅 Langue: ... 🎵 Vibration: ..."
    }
  ],
  "grammarErrors": [
    {"error": "erreur", "correction": "correction", "rule": "règle grammaticale"}
  ],
  "structuresUsed": ["structures grammaticales correctement utilisées"],
  "structuresMissing": ["structures cibles non utilisées"],
  "vocabularySuggestions": ["suggestions de vocabulaire professionnel"],
  "fluencyScore": 1-10,
  "pronunciationScore": 1-10,
  "overallFeedback": "commentaire encourageant avec focus sur les progrès",
  "improvedVersion": "version améliorée naturelle de la réponse"
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
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Question posée: "${question}"

Réponse du candidat (transcription vocale - peut contenir des erreurs dues à une mauvaise prononciation): "${answer}"

Analyse cette réponse en détail. Identifie les erreurs de prononciation typiques d'un anglophone et fournis des conseils phonétiques précis avec positions de la bouche. Réponds en JSON.`
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
        phoneticTips: [],
        grammarErrors: [],
        structuresUsed: [],
        structuresMissing: [],
        vocabularySuggestions: [],
        fluencyScore: 5,
        pronunciationScore: 5,
        overallFeedback: responseText,
        improvedVersion: ""
      }
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json({ error: 'Analysis request failed' }, { status: 500 })
  }
}
