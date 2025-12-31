'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// PSC French Oral Exam Questions - Level A2-B1
// Questions designed to elicit: conditionnel, subjonctif, imparfait vs passé composé
const PSC_EXAM_QUESTIONS = [
  // Question 1 - Warm-up / Explaining (Easy)
  {
    id: 1,
    question: "Pouvez-vous me décrire votre poste actuel et vos responsabilités principales?",
    topic: "explaining",
    difficulty: "A2",
    targetStructures: ["présent", "vocabulaire professionnel"],
    sampleResponse: {
      text: "Je travaille comme analyste de politiques au ministère. Mes responsabilités principales comprennent la rédaction de documents d'information, la préparation de notes de breffage pour les cadres supérieurs, et la coordination avec d'autres directions. Je participe également aux réunions interministérielles.",
      keyPoints: [
        "Utilisation du présent pour décrire les tâches habituelles",
        "Vocabulaire spécifique à la fonction publique",
        "Structure claire: poste + responsabilités"
      ]
    }
  },
  // Question 2 - Explaining past experience (A2-B1)
  {
    id: 2,
    question: "Parlez-moi d'un projet important que vous avez réalisé dans le passé. Comment l'avez-vous mené à bien?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "L'année dernière, j'ai dirigé un projet de modernisation des services. Au début, nous avions des ressources limitées et l'équipe était petite. J'ai d'abord établi un plan de travail, puis j'ai consulté les intervenants clés. Pendant que nous travaillions sur le projet, nous avons rencontré plusieurs défis, mais nous les avons surmontés grâce à une bonne communication.",
      keyPoints: [
        "Passé composé pour les actions ponctuelles: j'ai dirigé, j'ai établi",
        "Imparfait pour le contexte/situation: nous avions, l'équipe était",
        "Articulation logique: d'abord, puis, pendant que"
      ]
    }
  },
  // Question 3 - Adaptation to Change (B1)
  {
    id: 3,
    question: "Comment réagiriez-vous si votre ministère annonçait une restructuration majeure qui affecterait votre équipe?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["conditionnel"],
    sampleResponse: {
      text: "Si une telle situation se produisait, je resterais d'abord calme et j'écouterais attentivement les informations officielles. J'essaierais de comprendre les raisons de ce changement. Je communiquerais ouvertement avec mon équipe pour les rassurer et je chercherais des occasions de développement professionnel dans cette nouvelle structure. Je m'adapterais aux nouvelles priorités tout en maintenant la qualité de mon travail.",
      keyPoints: [
        "Conditionnel présent: je resterais, j'essaierais, je communiquerais",
        "Structure hypothétique: Si... + imparfait, conditionnel",
        "Attitude positive face au changement"
      ]
    }
  },
  // Question 4 - Conflict Management (B1)
  {
    id: 4,
    question: "Décrivez une situation où vous avez dû gérer un conflit avec un collègue. Qu'avez-vous fait et qu'auriez-vous pu faire différemment?",
    topic: "conflict_management",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "conditionnel passé"],
    sampleResponse: {
      text: "Il y a quelques mois, un collègue et moi avions des opinions différentes sur l'approche d'un dossier. La tension montait et cela affectait l'équipe. J'ai proposé une rencontre privée pour en discuter. J'ai écouté son point de vue et j'ai exprimé le mien calmement. Nous avons trouvé un compromis. Avec le recul, j'aurais pu aborder le problème plus tôt. J'aurais dû être plus attentif aux signes de tension dès le début.",
      keyPoints: [
        "Imparfait pour le contexte: avions, montait, affectait",
        "Passé composé pour les actions: j'ai proposé, j'ai écouté",
        "Conditionnel passé pour la réflexion: j'aurais pu, j'aurais dû"
      ]
    }
  },
  // Question 5 - Policy Implementation (B1)
  {
    id: 5,
    question: "Il faut que vous mettiez en œuvre une nouvelle politique qui n'est pas populaire auprès de votre équipe. Comment procéderiez-vous?",
    topic: "policy_implementation",
    difficulty: "B1",
    targetStructures: ["subjonctif", "conditionnel"],
    sampleResponse: {
      text: "Il serait essentiel que je comprenne d'abord les préoccupations de l'équipe. Je voudrais que chacun puisse s'exprimer librement. Je leur expliquerais les raisons derrière cette politique et je m'assurerais qu'ils comprennent les objectifs. Il faudrait que nous travaillions ensemble pour trouver des solutions aux défis. Je suggérerais des formations pour que l'équipe soit bien préparée.",
      keyPoints: [
        "Subjonctif après 'il faut que', 'je voudrais que': que je comprenne, que chacun puisse",
        "Conditionnel pour les suggestions polies: je suggérerais, il serait",
        "Vocabulaire de gestion du changement"
      ]
    }
  },
  // Question 6 - Communication and Leadership (B1)
  {
    id: 6,
    question: "Vous êtes chef d'équipe et un membre de votre équipe ne performe pas bien. Comment aborderiez-vous cette situation pour qu'elle s'améliore?",
    topic: "communication_leadership",
    difficulty: "B1",
    targetStructures: ["subjonctif", "conditionnel"],
    sampleResponse: {
      text: "Je commencerais par avoir une conversation privée avec l'employé. Il serait important que je l'écoute avant de porter un jugement. Je voudrais qu'il comprenne mes attentes, mais aussi que nous identifiions ensemble les obstacles. Je proposerais un plan d'amélioration avec des objectifs clairs. Il faudrait que nous nous rencontrions régulièrement pour suivre les progrès. Je m'assurerais qu'il ait accès aux ressources nécessaires.",
      keyPoints: [
        "Subjonctif: qu'il comprenne, que nous identifiions, qu'il ait",
        "Conditionnel: je commencerais, je proposerais, je m'assurerais",
        "Approche constructive et bienveillante"
      ]
    }
  },
  // Question 7 - Adaptation + Past Experience (B1)
  {
    id: 7,
    question: "Racontez-moi une situation où vous avez dû vous adapter rapidement à un changement imprévu. Comment avez-vous géré le stress?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    sampleResponse: {
      text: "L'année dernière, alors que je préparais une présentation importante, notre système informatique est tombé en panne. J'avais déjà travaillé plusieurs jours sur ce dossier et la réunion était prévue pour le lendemain. J'ai d'abord pris une grande respiration. Ensuite, j'ai contacté les collègues qui avaient des copies de certains documents. J'ai réorganisé ma présentation avec les éléments disponibles. Le stress était intense, mais j'ai réussi à livrer une présentation satisfaisante.",
      keyPoints: [
        "Imparfait pour le contexte: je préparais, la réunion était prévue",
        "Passé composé pour les actions: est tombé, j'ai contacté",
        "Plus-que-parfait pour l'antériorité: j'avais travaillé, avaient des copies"
      ]
    }
  },
  // Question 8 - Complex scenario combining multiple themes (B1+)
  {
    id: 8,
    question: "Imaginez que vous deviez présenter une recommandation controversée à la haute direction, mais que certains membres de votre équipe ne soient pas d'accord. Comment géreriez-vous cette situation?",
    topic: "communication_leadership",
    difficulty: "B1+",
    targetStructures: ["subjonctif", "conditionnel", "imparfait"],
    sampleResponse: {
      text: "Avant tout, il faudrait que je m'assure de bien comprendre les objections de mon équipe. Je leur demanderais d'expliquer leurs préoccupations en détail. Si leurs arguments étaient valides, je les intégrerais dans ma recommandation. Je souhaiterais que nous présentions un front uni, mais si ce n'était pas possible, je respecterais leurs opinions tout en défendant ma position. Je présenterais les différentes perspectives à la direction pour qu'elle puisse prendre une décision éclairée.",
      keyPoints: [
        "Subjonctif: que je m'assure, que nous présentions, qu'elle puisse",
        "Conditionnel: je demanderais, je souhaiterais, je présenterais",
        "Imparfait dans les hypothèses: si leurs arguments étaient, si ce n'était pas"
      ]
    }
  }
]

export default function PSCExamSimulator() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // PSC Exam state
  const [examQuestionIndex, setExamQuestionIndex] = useState(0)
  const [examHistory, setExamHistory] = useState([])
  const [awaitingAnswer, setAwaitingAnswer] = useState(false)
  const [answerComplete, setAnswerComplete] = useState(false)
  const [examFeedback, setExamFeedback] = useState(null)
  const [examStarted, setExamStarted] = useState(false)
  const [fullTranscript, setFullTranscript] = useState('')

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
      // Pre-load voices
      synthRef.current.getVoices()
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'fr-FR'

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript + ' '
            } else {
              interimTranscript += result[0].transcript
            }
          }

          if (finalTranscript) {
            setFullTranscript(prev => prev + finalTranscript)
            setTranscript(prev => prev + finalTranscript)
          } else {
            setTranscript(fullTranscript + interimTranscript)
          }
        }

        recognitionRef.current.onend = () => {
          if (awaitingAnswer && isListening) {
            try {
              recognitionRef.current.start()
            } catch (e) {
              setIsListening(false)
            }
          } else {
            setIsListening(false)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setIsListening(false)
          }
        }
      }
    }
  }, [awaitingAnswer, isListening, fullTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setFullTranscript('')
      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakFrench = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.85
      utterance.pitch = 1

      const voices = synthRef.current.getVoices()
      const frenchVoice = voices.find(v => v.lang.startsWith('fr'))
      if (frenchVoice) {
        utterance.voice = frenchVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  // Start exam immediately
  const startExam = useCallback(() => {
    setExamStarted(true)
    setExamQuestionIndex(0)
    setExamHistory([])
    setExamFeedback(null)
    setAwaitingAnswer(true)
    setAnswerComplete(false)
    setTranscript('')
    setFullTranscript('')

    const firstQuestion = PSC_EXAM_QUESTIONS[0]
    setTimeout(() => {
      speakFrench(firstQuestion.question)
    }, 500)
  }, [])

  // Auto-start exam on mount
  useEffect(() => {
    if (!examStarted) {
      startExam()
    }
  }, [examStarted, startExam])

  const submitExamAnswer = () => {
    if (!transcript.trim()) return

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    setAnswerComplete(true)
    setAwaitingAnswer(false)

    const currentQuestion = PSC_EXAM_QUESTIONS[examQuestionIndex]
    const feedback = generateExamFeedback(transcript, currentQuestion)
    setExamFeedback(feedback)

    setExamHistory(prev => [...prev, {
      question: currentQuestion.question,
      answer: transcript,
      feedback: feedback
    }])

    setTimeout(() => {
      speakFrench(feedback.spokenFeedback)
    }, 500)
  }

  const generateExamFeedback = (answer, question) => {
    const lowerAnswer = answer.toLowerCase()
    const targetStructures = question.targetStructures

    const structureAnalysis = []
    let structuresFound = []
    let structuresMissing = []

    const conditionalPatterns = /\b(serais?|aurais?|voudrais?|pourrais?|devrais?|ferais?|irais?|dirais?|prendrais?|mettrais?|aimerais?|souhaiterais?|préférerais?|resterais?|écouterais?|essaierais?|communiquerais?|chercherais?|adapterais?|proposerais?|suggérerais?|assurerais?|commencerais?|demanderais?|intégrerais?|présenterais?|respecterais?|défendrais?)\b/gi
    const hasConditional = conditionalPatterns.test(lowerAnswer)

    const subjonctifPatterns = /\b(que je|qu'il|qu'elle|que nous|que vous|qu'ils|qu'elles)\s+(sois?|aie?|fasse?|puisse?|aille?|veuille?|sache?|prenne?|comprenne?|identifiions?|travaillions?|rencontrions?|présentions?|ait|soit|puisse|fasse|vienne|doive)\b/gi
    const hasSubjonctif = subjonctifPatterns.test(lowerAnswer)

    const passeComposePatterns = /\b(j'ai|tu as|il a|elle a|nous avons|vous avez|ils ont|elles ont|je suis|tu es|il est|elle est|nous sommes|vous êtes|ils sont|elles sont)\s+\w*(é|i|u|is|it|ert|ait|eint)\b/gi
    const hasPasseCompose = passeComposePatterns.test(lowerAnswer)

    const imparfaitPatterns = /\b\w+(ais|ait|ions|iez|aient)\b/gi
    const imparfaitMatches = lowerAnswer.match(imparfaitPatterns) || []
    const hasImparfait = imparfaitMatches.length >= 2

    targetStructures.forEach(structure => {
      if (structure.includes('conditionnel')) {
        if (hasConditional) {
          structuresFound.push('Conditionnel')
          structureAnalysis.push({ structure: 'Conditionnel', found: true, note: 'Bien utilisé pour exprimer des situations hypothétiques' })
        } else {
          structuresMissing.push('Conditionnel')
          structureAnalysis.push({ structure: 'Conditionnel', found: false, note: 'Cette question appelle l\'utilisation du conditionnel (ex: je ferais, je dirais)' })
        }
      }
      if (structure.includes('subjonctif')) {
        if (hasSubjonctif) {
          structuresFound.push('Subjonctif')
          structureAnalysis.push({ structure: 'Subjonctif', found: true, note: 'Bon usage après les expressions de nécessité ou de souhait' })
        } else {
          structuresMissing.push('Subjonctif')
          structureAnalysis.push({ structure: 'Subjonctif', found: false, note: 'Le subjonctif serait approprié ici (ex: il faut que je fasse, je voudrais qu\'il comprenne)' })
        }
      }
      if (structure.includes('passé composé')) {
        if (hasPasseCompose) {
          structuresFound.push('Passé composé')
          structureAnalysis.push({ structure: 'Passé composé', found: true, note: 'Correctement utilisé pour les actions ponctuelles passées' })
        } else {
          structuresMissing.push('Passé composé')
          structureAnalysis.push({ structure: 'Passé composé', found: false, note: 'Le passé composé devrait être utilisé pour les actions terminées (ex: j\'ai fait, nous avons décidé)' })
        }
      }
      if (structure.includes('imparfait')) {
        if (hasImparfait) {
          structuresFound.push('Imparfait')
          structureAnalysis.push({ structure: 'Imparfait', found: true, note: 'Bien utilisé pour décrire le contexte ou les situations habituelles' })
        } else {
          structuresMissing.push('Imparfait')
          structureAnalysis.push({ structure: 'Imparfait', found: false, note: 'L\'imparfait serait utile pour décrire le contexte (ex: la situation était, nous avions)' })
        }
      }
    })

    let spokenFeedback = "Merci pour votre réponse. "

    if (structuresFound.length > 0) {
      spokenFeedback += `J'ai noté l'utilisation ${structuresFound.length > 1 ? 'des structures suivantes' : 'de la structure suivante'}: ${structuresFound.join(', ')}. `
    }

    if (structuresMissing.length > 0) {
      spokenFeedback += `Pour améliorer votre réponse, vous pourriez utiliser ${structuresMissing.join(' et ')}. `
    }

    spokenFeedback += "Veuillez consulter les suggestions écrites pour plus de détails."

    return {
      structureAnalysis,
      structuresFound,
      structuresMissing,
      sampleResponse: question.sampleResponse,
      spokenFeedback,
      topic: question.topic,
      difficulty: question.difficulty
    }
  }

  const nextExamQuestion = () => {
    if (examQuestionIndex < PSC_EXAM_QUESTIONS.length - 1) {
      const nextIndex = examQuestionIndex + 1
      setExamQuestionIndex(nextIndex)
      setExamFeedback(null)
      setAnswerComplete(false)
      setAwaitingAnswer(true)
      setTranscript('')
      setFullTranscript('')

      setTimeout(() => {
        speakFrench(PSC_EXAM_QUESTIONS[nextIndex].question)
      }, 500)
    }
  }

  const restartExam = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
    setExamStarted(false)
    setExamQuestionIndex(0)
    setExamHistory([])
    setExamFeedback(null)
    setAwaitingAnswer(false)
    setAnswerComplete(false)
    setTranscript('')
    setFullTranscript('')

    setTimeout(() => startExam(), 100)
  }

  const currentQuestion = PSC_EXAM_QUESTIONS[examQuestionIndex]

  if (!examStarted) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>
          <p>Préparation de l'examen...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Examen oral PSC</h1>
          <p style={styles.subtitle}>Commission de la fonction publique du Canada - Niveau A2-B1</p>
        </div>
        <div style={styles.headerMeta}>
          <span style={styles.progress}>Question {examQuestionIndex + 1} / {PSC_EXAM_QUESTIONS.length}</span>
          <span style={styles.level}>Niveau: {currentQuestion.difficulty}</span>
        </div>
      </header>

      <div style={styles.content}>
        {/* Question Card */}
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <span style={styles.questionNumber}>Question {currentQuestion.id}</span>
            <span style={styles.questionTopic}>
              {currentQuestion.topic === 'explaining' && 'Explication'}
              {currentQuestion.topic === 'adaptation' && 'Adaptation au changement'}
              {currentQuestion.topic === 'conflict_management' && 'Gestion des conflits'}
              {currentQuestion.topic === 'policy_implementation' && 'Mise en œuvre des politiques'}
              {currentQuestion.topic === 'communication_leadership' && 'Communication et leadership'}
            </span>
          </div>
          <p style={styles.questionText}>{currentQuestion.question}</p>
          <button
            style={{
              ...styles.listenButton,
              ...(isSpeaking ? styles.listenButtonActive : {})
            }}
            onClick={() => speakFrench(currentQuestion.question)}
            disabled={isSpeaking}
          >
            {isSpeaking ? '🔊 Lecture...' : '🔊 Réécouter la question'}
          </button>
        </div>

        {/* Recording Section */}
        {awaitingAnswer && (
          <div style={styles.recordSection}>
            <p style={styles.instructions}>
              Répondez oralement. Cliquez sur le microphone pour commencer, puis cliquez sur "J'ai terminé" quand vous avez fini.
            </p>

            <button
              style={{
                ...styles.micButton,
                ...(isListening ? styles.micButtonActive : {})
              }}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? (
                <>
                  <span style={styles.micIcon}>⏹️</span>
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <span style={styles.micIcon}>🎤</span>
                  <span>Parler</span>
                </>
              )}
            </button>

            {isListening && (
              <div style={styles.listeningIndicator}>
                <div style={styles.pulseRing}></div>
                <span>Écoute en cours...</span>
              </div>
            )}

            {transcript && (
              <div style={styles.transcriptBox}>
                <p style={styles.transcriptLabel}>Votre réponse:</p>
                <p style={styles.transcriptText}>{transcript}</p>
              </div>
            )}

            {transcript && !isListening && (
              <button style={styles.submitButton} onClick={submitExamAnswer}>
                J'ai terminé ma réponse
              </button>
            )}
          </div>
        )}

        {/* Feedback Section */}
        {examFeedback && answerComplete && (
          <div style={styles.feedbackContainer}>
            <h3 style={styles.feedbackTitle}>Rétroaction de l'examinateur</h3>

            <div style={styles.yourAnswer}>
              <h4 style={styles.sectionSubtitle}>Votre réponse:</h4>
              <p style={styles.yourAnswerText}>{transcript}</p>
            </div>

            <div style={styles.structureAnalysis}>
              <h4 style={styles.sectionSubtitle}>Analyse grammaticale:</h4>
              {examFeedback.structureAnalysis.map((item, i) => (
                <div key={i} style={{
                  ...styles.structureItem,
                  ...(item.found ? styles.structureFound : styles.structureMissing)
                }}>
                  <span style={styles.structureIcon}>
                    {item.found ? '✓' : '○'}
                  </span>
                  <div>
                    <strong>{item.structure}</strong>
                    <p style={styles.structureNote}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.sampleResponse}>
              <h4 style={styles.sectionSubtitle}>Exemple de réponse (niveau A2-B1):</h4>
              <div style={styles.sampleText}>
                <p>{examFeedback.sampleResponse.text}</p>
              </div>
              <button
                style={{...styles.listenButton, marginTop: '1rem'}}
                onClick={() => speakFrench(examFeedback.sampleResponse.text)}
                disabled={isSpeaking}
              >
                {isSpeaking ? '🔊 Lecture...' : '🔊 Écouter l\'exemple'}
              </button>

              <div style={styles.keyPoints}>
                <h5 style={styles.keyPointsTitle}>Points clés:</h5>
                <ul style={styles.keyPointsList}>
                  {examFeedback.sampleResponse.keyPoints.map((point, i) => (
                    <li key={i} style={styles.keyPoint}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={styles.navigation}>
              {examQuestionIndex < PSC_EXAM_QUESTIONS.length - 1 ? (
                <button style={styles.nextButton} onClick={nextExamQuestion}>
                  Question suivante →
                </button>
              ) : (
                <button style={styles.completeButton} onClick={restartExam}>
                  Recommencer l'examen
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          {PSC_EXAM_QUESTIONS.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.progressDot,
                ...(i < examQuestionIndex ? styles.progressDotCompleted : {}),
                ...(i === examQuestionIndex ? styles.progressDotCurrent : {})
              }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#FAF7F2',
    fontFamily: "'DM Sans', -apple-system, sans-serif",
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#6B7280',
    fontSize: '1.1rem',
  },
  header: {
    background: 'linear-gradient(135deg, #1a2a4a, #2d3e5f)',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
  },
  headerContent: {
    marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.85,
  },
  headerMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  progress: {
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  level: {
    background: 'rgba(255,255,255,0.2)',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  questionCard: {
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  questionNumber: {
    fontWeight: 600,
    color: '#1a2a4a',
    fontSize: '0.9rem',
  },
  questionTopic: {
    background: 'rgba(201, 162, 39, 0.15)',
    color: '#C9A227',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  questionText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.4rem',
    color: '#1a2a4a',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
  },
  listenButton: {
    background: '#1a2a4a',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  listenButtonActive: {
    background: '#C53030',
  },
  recordSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  instructions: {
    color: '#6B7280',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  micButton: {
    background: 'linear-gradient(135deg, #C53030, #E53E3E)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    margin: '0 auto',
    boxShadow: '0 4px 15px rgba(197, 48, 48, 0.3)',
  },
  micButtonActive: {
    background: 'linear-gradient(135deg, #059669, #10B981)',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
  },
  micIcon: {
    fontSize: '1.75rem',
  },
  listeningIndicator: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    color: '#059669',
  },
  pulseRing: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#059669',
    animation: 'pulse 1.5s infinite',
  },
  transcriptBox: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(26, 42, 74, 0.05)',
    borderRadius: '12px',
    textAlign: 'left',
  },
  transcriptLabel: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginBottom: '0.5rem',
  },
  transcriptText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.1rem',
    color: '#1a2a4a',
    lineHeight: 1.6,
  },
  submitButton: {
    marginTop: '1.5rem',
    background: '#1a2a4a',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '1rem 2.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  feedbackContainer: {
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
  },
  feedbackTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.5rem',
    color: '#1a2a4a',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a2a4a',
    marginBottom: '0.75rem',
  },
  yourAnswer: {
    marginBottom: '1.5rem',
    padding: '1rem',
    background: 'rgba(26, 42, 74, 0.03)',
    borderRadius: '12px',
  },
  yourAnswerText: {
    fontStyle: 'italic',
    color: '#6B7280',
    lineHeight: 1.6,
  },
  structureAnalysis: {
    marginBottom: '1.5rem',
  },
  structureItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
  },
  structureFound: {
    background: 'rgba(5, 150, 105, 0.1)',
    border: '1px solid rgba(5, 150, 105, 0.3)',
  },
  structureMissing: {
    background: 'rgba(217, 119, 6, 0.1)',
    border: '1px solid rgba(217, 119, 6, 0.3)',
  },
  structureIcon: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  structureNote: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginTop: '0.25rem',
  },
  sampleResponse: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08), rgba(201, 162, 39, 0.03))',
    border: '1px solid rgba(201, 162, 39, 0.25)',
    borderRadius: '12px',
  },
  sampleText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.05rem',
    color: '#1a2a4a',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  keyPoints: {
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(201, 162, 39, 0.25)',
  },
  keyPointsTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#1a2a4a',
    marginBottom: '0.5rem',
  },
  keyPointsList: {
    margin: 0,
    paddingLeft: '1.25rem',
  },
  keyPoint: {
    fontSize: '0.9rem',
    color: '#6B7280',
    marginBottom: '0.35rem',
    lineHeight: 1.5,
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  nextButton: {
    background: '#1a2a4a',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '1rem 2.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  completeButton: {
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '1rem 2.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
  },
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#E5E7EB',
  },
  progressDotCompleted: {
    background: '#059669',
  },
  progressDotCurrent: {
    background: '#1a2a4a',
    transform: 'scale(1.3)',
  },
}
