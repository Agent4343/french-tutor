'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// PSC French Oral Exam Questions - Level A2-B1
// ESDC-focused questions using STAR method for behavioral questions
// STAR: Situation - Task - Action - Result
const PSC_EXAM_QUESTIONS = [
  // Section 1: Introduction et présentation (A2)
  {
    id: 1,
    question: "Quel est votre nom et votre prénom?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Je m'appelle [Prénom Nom]. Je suis originaire de [ville/région].",
      keyPoints: [
        "Réponse simple et directe",
        "Utilisez 'Je m'appelle' ou 'Mon nom est'"
      ]
    }
  },
  {
    id: 2,
    question: "Quel poste occupez-vous à EDSC et dans quelle direction ou quel secteur travaillez-vous?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent", "vocabulaire professionnel"],
    sampleResponse: {
      text: "J'occupe le poste d'analyste de politiques à EDSC. Je travaille dans la Direction générale des compétences et de l'emploi. Mon rôle consiste à analyser les programmes d'emploi et à rédiger des notes d'information pour les cadres supérieurs.",
      keyPoints: [
        "Présent pour décrire la situation actuelle",
        "Vocabulaire spécifique à EDSC",
        "Structure: poste + direction + rôle"
      ]
    }
  },
  {
    id: 3,
    question: "Depuis quand travaillez-vous à EDSC et pourquoi avez-vous choisi de travailler dans la fonction publique?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent", "passé composé"],
    sampleResponse: {
      text: "Je travaille à EDSC depuis cinq ans. J'ai choisi la fonction publique parce que je voulais contribuer au bien-être des Canadiens. J'ai toujours été attiré par les programmes sociaux et l'idée de servir le public. La stabilité d'emploi et les possibilités de développement professionnel m'ont également motivé.",
      keyPoints: [
        "Depuis + durée pour exprimer la continuité",
        "Passé composé pour expliquer le choix: j'ai choisi",
        "Imparfait pour les motivations: je voulais, j'étais attiré"
      ]
    }
  },
  {
    id: 4,
    question: "Quelles qualités sont nécessaires pour bien réussir dans votre poste?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent", "subjonctif"],
    sampleResponse: {
      text: "Pour réussir dans mon poste, il faut que je sois organisé et rigoureux. Il est essentiel que j'aie de bonnes compétences en communication écrite. Il faut aussi que je puisse travailler sous pression et respecter des échéanciers serrés. La capacité d'analyser des données complexes et de collaborer avec différentes équipes est également importante.",
      keyPoints: [
        "Subjonctif après 'il faut que': que je sois, que j'aie, que je puisse",
        "Vocabulaire des compétences professionnelles",
        "Structure claire avec plusieurs qualités"
      ]
    }
  },
  {
    id: 5,
    question: "Où avez-vous commencé votre carrière dans la fonction publique et qui était votre premier gestionnaire?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai commencé ma carrière au ministère de l'Immigration en 2015. C'était un poste d'agent de programme. Mon premier gestionnaire s'appelait Marie Tremblay. Elle était très patiente et encourageante. Elle prenait le temps d'expliquer les processus et elle m'a beaucoup appris sur le fonctionnement de la fonction publique.",
      keyPoints: [
        "Passé composé pour les événements: j'ai commencé",
        "Imparfait pour les descriptions: elle était, elle prenait",
        "Vocabulaire de la hiérarchie et du mentorat"
      ]
    }
  },
  {
    id: 6,
    question: "Était-ce un bon leader? Pourquoi ou pourquoi pas?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait", "passé composé"],
    sampleResponse: {
      text: "Oui, c'était une excellente leader. Elle savait comment motiver son équipe et elle communiquait clairement ses attentes. Quand il y avait des problèmes, elle nous soutenait toujours. Elle m'a donné des occasions de développer mes compétences. Par contre, elle était parfois trop occupée pour nous rencontrer individuellement, ce qui rendait difficile d'obtenir de la rétroaction régulière.",
      keyPoints: [
        "Imparfait pour les caractéristiques: elle savait, elle communiquait",
        "Passé composé pour les actions spécifiques: elle m'a donné",
        "Nuancer la réponse avec 'par contre'"
      ]
    }
  },
  {
    id: 7,
    question: "Comment vos collègues et vos gestionnaires vous ont-ils accueilli lors de votre première affectation?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    sampleResponse: {
      text: "L'accueil a été très chaleureux. Mes collègues m'avaient préparé un espace de travail et ils m'ont présenté à toute l'équipe. Mon gestionnaire avait organisé des rencontres avec les partenaires clés. Pendant les premières semaines, mes collègues prenaient le temps de répondre à mes questions. Il y avait une atmosphère d'entraide qui m'a beaucoup aidé à m'intégrer.",
      keyPoints: [
        "Plus-que-parfait pour les actions préparées: avaient préparé, avait organisé",
        "Passé composé pour les événements: m'ont présenté, m'a aidé",
        "Imparfait pour le contexte: prenaient, il y avait"
      ]
    }
  },
  {
    id: 8,
    question: "Parlez-moi d'une situation problématique survenue au travail et expliquez comment vous l'avez résolue. Utilisez la méthode STAR: Situation, Tâche, Action, Résultat.",
    topic: "conflict_management",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    starMethod: true,
    sampleResponse: {
      text: "SITUATION: L'année dernière, notre équipe devait livrer un rapport important, mais deux membres clés étaient malades. TÂCHE: En tant que coordonnateur, je devais m'assurer que le rapport soit terminé à temps. ACTION: J'ai redistribué les tâches entre les membres disponibles. J'ai aussi négocié une courte extension avec notre directeur. J'ai travaillé des heures supplémentaires pour compléter les sections critiques. RÉSULTAT: Nous avons livré le rapport avec seulement deux jours de retard. La direction a apprécié notre effort et la qualité du travail.",
      keyPoints: [
        "Structure STAR claire et organisée",
        "Imparfait pour le contexte: devait, étaient, devais",
        "Passé composé pour les actions: j'ai redistribué, j'ai négocié, nous avons livré",
        "Vocabulaire de résolution de problèmes"
      ]
    }
  },
  {
    id: 9,
    question: "Décrivez un problème que vous avez rencontré dans un projet spécial ou une affectation et comment vous l'avez géré.",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "conditionnel passé"],
    starMethod: true,
    sampleResponse: {
      text: "SITUATION: Pendant une affectation dans une autre région, je travaillais sur un projet de modernisation des services. TÂCHE: Je devais coordonner avec des équipes qui utilisaient des systèmes différents. ACTION: Au début, la communication était difficile. J'ai organisé des réunions hebdomadaires pour améliorer la coordination. J'ai créé un document partagé pour suivre les progrès. J'ai aussi pris l'initiative de visiter les autres bureaux. RÉSULTAT: Après deux mois, nous avions établi un processus efficace. Avec le recul, j'aurais dû commencer les visites plus tôt.",
      keyPoints: [
        "Structure STAR avec réflexion finale",
        "Conditionnel passé pour la réflexion: j'aurais dû",
        "Plus-que-parfait pour le résultat: nous avions établi"
      ]
    }
  },
  {
    id: 10,
    question: "Étiez-vous suffisamment préparé pour cette tâche? Pourquoi ou pourquoi pas?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["imparfait", "plus-que-parfait", "conditionnel passé"],
    sampleResponse: {
      text: "Je n'étais pas entièrement préparé. Avant l'affectation, j'avais suivi une formation générale, mais elle ne couvrait pas tous les aspects techniques. Il m'a fallu apprendre beaucoup sur le terrain. J'aurais aimé avoir plus de temps pour me préparer. Cependant, cette expérience m'a enseigné l'importance de l'adaptabilité. Si c'était à refaire, je demanderais une période d'observation avant de commencer.",
      keyPoints: [
        "Imparfait pour l'état: je n'étais pas, elle ne couvrait pas",
        "Plus-que-parfait pour l'antériorité: j'avais suivi",
        "Conditionnel passé pour le souhait: j'aurais aimé",
        "Structure hypothétique: Si c'était à refaire, je demanderais"
      ]
    }
  },
  {
    id: 11,
    question: "Si vous deviez refaire une expérience semblable, que feriez-vous différemment?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["conditionnel", "imparfait"],
    sampleResponse: {
      text: "Si je devais refaire cette expérience, je ferais plusieurs choses différemment. Premièrement, je demanderais une rencontre préalable avec l'équipe locale. Je voudrais mieux comprendre leurs besoins avant de proposer des solutions. Je prendrais plus de temps pour établir des relations de confiance. Je me préparerais aussi davantage sur les outils techniques utilisés. Enfin, je documenterais mes apprentissages dès le début pour mieux les partager.",
      keyPoints: [
        "Structure hypothétique: Si + imparfait, conditionnel",
        "Conditionnel: je ferais, je demanderais, je voudrais, je prendrais",
        "Connecteurs logiques: premièrement, aussi, enfin"
      ]
    }
  },
  {
    id: 12,
    question: "De quelle façon votre premier poste a-t-il influencé votre manière de travailler dans les postes suivants?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "présent"],
    sampleResponse: {
      text: "Mon premier poste a profondément influencé ma façon de travailler. J'ai appris l'importance de la rigueur et de la documentation. Aujourd'hui, je prends toujours des notes détaillées et je conserve des traces de mes décisions. Mon premier gestionnaire m'a aussi montré comment communiquer efficacement avec les clients. Cette approche centrée sur le service m'accompagne encore aujourd'hui. J'ai également développé une habitude de vérifier mon travail deux fois avant de le soumettre.",
      keyPoints: [
        "Passé composé pour les apprentissages: j'ai appris, m'a montré, j'ai développé",
        "Présent pour les habitudes actuelles: je prends, je conserve, m'accompagne",
        "Lien entre passé et présent"
      ]
    }
  },
  {
    id: 13,
    question: "Parlez-moi de votre prochain poste ou d'un poste que vous aimeriez occuper. Quelles formations aimeriez-vous suivre?",
    topic: "future_plans",
    difficulty: "B1",
    targetStructures: ["conditionnel", "subjonctif"],
    sampleResponse: {
      text: "J'aimerais occuper un poste de gestionnaire dans les prochaines années. Je souhaiterais diriger une petite équipe pour développer mes compétences en leadership. Pour y arriver, il faudrait que je suive des formations en gestion. Je voudrais m'inscrire au Programme de perfectionnement des gestionnaires. Il serait aussi important que j'améliore mes compétences en gestion de projet. J'envisagerais également une certification en analyse de données pour rester pertinent.",
      keyPoints: [
        "Conditionnel pour les souhaits: j'aimerais, je souhaiterais, je voudrais",
        "Subjonctif après 'il faudrait que', 'il serait important que': que je suive, que j'améliore",
        "Vocabulaire du développement professionnel"
      ]
    }
  },
  {
    id: 14,
    question: "Quels sont vos plans, ou ceux de votre gestionnaire, à long terme concernant votre développement professionnel?",
    topic: "future_plans",
    difficulty: "B1+",
    targetStructures: ["conditionnel", "subjonctif", "futur"],
    sampleResponse: {
      text: "Mon gestionnaire et moi avons discuté de mon plan de développement. À court terme, je suivrai une formation en français pour atteindre le niveau C. Mon gestionnaire souhaite que je participe à des projets interministériels pour élargir mon réseau. À moyen terme, j'aimerais obtenir une affectation dans un autre secteur. Il faudrait que j'acquière de l'expérience en politique pour avancer. À long terme, je viserais un poste EX. Mon gestionnaire m'a dit qu'il me soutiendrait dans cette démarche.",
      keyPoints: [
        "Futur pour les plans concrets: je suivrai",
        "Subjonctif après 'souhaite que', 'il faudrait que': que je participe, que j'acquière",
        "Conditionnel pour les aspirations: j'aimerais, je viserais",
        "Structure temporelle: court/moyen/long terme"
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
  const audioRef = useRef(null)

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

  const speakFrench = async (text) => {
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsSpeaking(true)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!response.ok) {
        throw new Error('TTS API failed')
      }

      const { audioContent } = await response.json()
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      )
      const audioUrl = URL.createObjectURL(audioBlob)

      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
      audioRef.current.onerror = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
      await audioRef.current.play()
    } catch (error) {
      console.error('Google TTS failed, falling back to Web Speech API:', error)
      // Fallback to Web Speech API
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'fr-FR'
        utterance.rate = 0.9
        utterance.pitch = 1.05

        const voices = synthRef.current.getVoices()
        const frenchVoice = voices.find(v => v.lang.startsWith('fr'))
        if (frenchVoice) utterance.voice = frenchVoice

        utterance.onend = () => setIsSpeaking(false)
        synthRef.current.speak(utterance)
      } else {
        setIsSpeaking(false)
      }
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
          <h1 style={styles.title}>Susan Matheson French Helper</h1>
          <p style={styles.subtitle}>Examen oral PSC - Niveau A2-B1</p>
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
