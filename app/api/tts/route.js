export async function POST(request) {
  const { text } = await request.json()

  if (!text) {
    return Response.json({ error: 'Text is required' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY

  if (!apiKey) {
    return Response.json({ error: 'TTS API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'fr-FR',
            name: 'fr-FR-Neural2-A',  // High-quality female neural voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.95,
            pitch: 0.5
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Google TTS error:', error)
      return Response.json({ error: 'TTS request failed' }, { status: 500 })
    }

    const data = await response.json()
    return Response.json({ audioContent: data.audioContent })
  } catch (error) {
    console.error('TTS error:', error)
    return Response.json({ error: 'TTS request failed' }, { status: 500 })
  }
}
