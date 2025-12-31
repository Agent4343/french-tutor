export async function POST(request) {
  const { question, answer, difficulty, targetStructures } = await request.json()

  if (!question || !answer) {
    return Response.json({ error: 'Question and answer are required' }, { status: 400 })
  }

  const apiKey = process.env.CLAUDE_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'Claude API key not configured' }, { status: 500 })
  }

  const systemPrompt = `Tu es un coach de français bienveillant pour l'examen oral PSC (Commission de la fonction publique du Canada) niveau ${difficulty || 'A2-B1'}.

CONTEXTE IMPORTANT:
- La réponse du candidat provient d'une transcription vocale automatique (speech-to-text)
- Cette transcription peut contenir des erreurs dues à la technologie, PAS à la prononciation du candidat
- Sois PRUDENT avant de critiquer - si un mot semble mal transcrit, c'est peut-être une erreur de reconnaissance vocale
- Concentre-toi sur le CONTENU et la STRUCTURE de la réponse, pas sur l'orthographe de la transcription

QUAND SIGNALER UNE ERREUR DE PRONONCIATION:
- Seulement si le mot transcrit suggère clairement une confusion phonétique typique (ex: "u/ou", "é/è")
- Si un mot français standard apparaît comme un mot anglais (ex: "work" au lieu de "travail")
- Si une liaison importante est clairement manquante dans la transcription

SONS À SURVEILLER (seulement si la transcription le suggère):
1. "R" français vs R anglais
2. "U" [y] vs "OU" [u] - ex: "tu" vs "tout"
3. Voyelles nasales manquantes
4. Liaisons importantes

ANALYSE PRINCIPALEMENT:
1. La qualité du CONTENU de la réponse (répond-elle à la question?)
2. Les erreurs GRAMMATICALES réelles (conjugaisons, accords, prépositions)
3. Le vocabulaire approprié pour le contexte professionnel
4. Les structures cibles: ${(targetStructures || []).join(', ')}
5. Des suggestions pour enrichir la réponse

SOIS ENCOURAGEANT - c'est un apprenant qui pratique!

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
          content: `Question posée à l'oral: "${question}"

Transcription automatique de la réponse du candidat: "${answer}"

Note: Cette transcription provient d'un système de reconnaissance vocale. Elle peut contenir des erreurs de transcription qui ne reflètent pas la vraie prononciation du candidat.

Analyse cette réponse en te concentrant sur:
1. Le contenu et la pertinence de la réponse
2. Les vraies erreurs grammaticales
3. Le vocabulaire utilisé
4. Des suggestions d'amélioration constructives

Sois encourageant et bienveillant. Réponds en JSON.`
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
