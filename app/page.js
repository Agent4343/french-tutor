'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// PSC French Oral Exam Questions - Level A2-B1
// ESDC-focused questions - Progressive difficulty
// STAR method for behavioral questions: Situation - Task - Action - Result
const PSC_EXAM_QUESTIONS = [
  // SECTION 1: Introduction (A2)
  {
    id: 1,
    question: "Comment vous appelez-vous?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Je m'appelle [Prénom Nom].",
      keyPoints: [
        "Réponse simple et directe",
        "Utilisez 'Je m'appelle' ou 'Mon nom est'"
      ]
    }
  },
  {
    id: 2,
    question: "Quel poste occupez-vous à EDSC?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "J'occupe le poste d'analyste de politiques à EDSC. Je suis responsable de l'analyse des programmes d'emploi.",
      keyPoints: [
        "Présent pour décrire la situation actuelle",
        "Vocabulaire spécifique à EDSC"
      ]
    }
  },
  {
    id: 3,
    question: "Dans quelle direction ou quel secteur travaillez-vous?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Je travaille dans la Direction générale des compétences et de l'emploi. Mon secteur s'occupe des programmes de formation professionnelle.",
      keyPoints: [
        "Présent pour la situation actuelle",
        "Vocabulaire organisationnel: direction, secteur"
      ]
    }
  },
  {
    id: 4,
    question: "Depuis quand travaillez-vous à EDSC?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Je travaille à EDSC depuis cinq ans. J'ai commencé en 2020.",
      keyPoints: [
        "Depuis + durée pour exprimer la continuité",
        "Passé composé pour le début: j'ai commencé"
      ]
    }
  },
  {
    id: 5,
    question: "Quelles qualités sont nécessaires pour bien réussir dans votre poste?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent", "subjonctif"],
    sampleResponse: {
      text: "Pour réussir dans mon poste, il faut que je sois organisé et rigoureux. Il est essentiel que j'aie de bonnes compétences en communication. Il faut aussi que je puisse travailler sous pression et respecter des échéanciers serrés.",
      keyPoints: [
        "Subjonctif après 'il faut que': que je sois, que j'aie, que je puisse",
        "Vocabulaire des compétences professionnelles"
      ]
    }
  },
  {
    id: 6,
    question: "Quelle a été la procédure d'embauche à ce moment-là?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "La procédure d'embauche était assez longue. J'avais d'abord postulé en ligne sur le site Emplois GC. Ensuite, j'ai passé un examen écrit. Après, j'ai été convoqué à une entrevue avec un comité. Le processus complet a duré environ six mois.",
      keyPoints: [
        "Imparfait pour décrire le processus: était",
        "Plus-que-parfait pour l'action antérieure: j'avais postulé",
        "Passé composé pour les étapes: j'ai passé, j'ai été convoqué"
      ]
    }
  },
  {
    id: 7,
    question: "Combien de temps avez-vous attendu avant de commencer votre poste, et qu'avez-vous fait pendant cette période?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai attendu environ quatre mois entre l'offre et mon premier jour. Pendant cette période, je travaillais encore à mon emploi précédent. J'ai profité de ce temps pour améliorer mon français. C'était une période d'anticipation.",
      keyPoints: [
        "Passé composé pour les actions: j'ai attendu, j'ai profité",
        "Imparfait pour les situations continues: je travaillais, c'était"
      ]
    }
  },
  {
    id: 8,
    question: "Avez-vous suivi une formation d'intégration avant de commencer?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "Oui, j'ai suivi une formation d'intégration pendant ma première semaine. Elle comprenait une présentation sur la structure du ministère. On nous a expliqué les politiques et les outils informatiques. Cette formation m'a beaucoup aidé.",
      keyPoints: [
        "Passé composé pour les événements: j'ai suivi, on nous a expliqué",
        "Imparfait pour les descriptions: elle comprenait"
      ]
    }
  },
  {
    id: 9,
    question: "Où avez-vous commencé votre carrière dans la fonction publique?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai commencé ma carrière au ministère de l'Immigration en 2015. C'était un poste d'agent de programme. Le travail était stimulant et j'ai beaucoup appris.",
      keyPoints: [
        "Passé composé pour les événements: j'ai commencé, j'ai appris",
        "Imparfait pour les descriptions: c'était, le travail était"
      ]
    }
  },
  {
    id: 10,
    question: "Qui était votre premier gestionnaire et comment était-il ou était-elle?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait"],
    sampleResponse: {
      text: "Mon premier gestionnaire s'appelait Marie Tremblay. Elle était très patiente et encourageante. Elle prenait le temps d'expliquer les processus. Elle avait une approche collaborative.",
      keyPoints: [
        "Imparfait pour toutes les descriptions: s'appelait, était, prenait, avait",
        "Vocabulaire du mentorat et du leadership"
      ]
    }
  },
  {
    id: 11,
    question: "Était-ce un bon leader? Pourquoi?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait", "passé composé"],
    sampleResponse: {
      text: "Oui, c'était une excellente leader. Elle savait comment motiver son équipe. Quand il y avait des problèmes, elle nous soutenait toujours. Elle m'a donné des occasions de développer mes compétences. Par contre, elle était parfois trop occupée.",
      keyPoints: [
        "Imparfait pour les caractéristiques: savait, soutenait, était",
        "Passé composé pour les actions spécifiques: elle m'a donné",
        "Nuancer avec 'par contre'"
      ]
    }
  },
  {
    id: 12,
    question: "De quelle façon votre premier poste a-t-il influencé votre manière de travailler dans les suivants?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "présent"],
    sampleResponse: {
      text: "Mon premier poste a profondément influencé ma façon de travailler. J'ai appris l'importance de la rigueur et de la documentation. Aujourd'hui, je prends toujours des notes détaillées. Mon premier gestionnaire m'a montré comment communiquer efficacement.",
      keyPoints: [
        "Passé composé pour les apprentissages: a influencé, j'ai appris, m'a montré",
        "Présent pour les habitudes actuelles: je prends"
      ]
    }
  },
  {
    id: 13,
    question: "Parlez-moi d'une situation problématique survenue au travail et expliquez comment vous l'avez résolue. Utilisez la méthode STAR: Situation, Tâche, Action, Résultat.",
    topic: "conflict_management",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    starMethod: true,
    sampleResponse: {
      text: "SITUATION: L'année dernière, notre équipe devait livrer un rapport important, mais deux membres étaient malades. TÂCHE: Je devais m'assurer que le rapport soit terminé à temps. ACTION: J'ai redistribué les tâches. J'ai négocié une extension avec notre directeur. J'ai travaillé des heures supplémentaires. RÉSULTAT: Nous avons livré le rapport avec seulement deux jours de retard.",
      keyPoints: [
        "Structure STAR claire",
        "Imparfait pour le contexte: devait, étaient",
        "Passé composé pour les actions: j'ai redistribué, nous avons livré"
      ]
    }
  },
  {
    id: 14,
    question: "Parlez-moi de votre prochain poste ou d'un poste que vous aimeriez occuper.",
    topic: "future_plans",
    difficulty: "B1",
    targetStructures: ["conditionnel", "subjonctif"],
    sampleResponse: {
      text: "J'aimerais occuper un poste de gestionnaire dans les prochaines années. Je souhaiterais diriger une équipe. Pour y arriver, il faudrait que je suive des formations en gestion. Je voudrais développer mes compétences en leadership.",
      keyPoints: [
        "Conditionnel pour les souhaits: j'aimerais, je souhaiterais, je voudrais",
        "Subjonctif après 'il faudrait que': que je suive"
      ]
    }
  },
  {
    id: 15,
    question: "Quel est votre nom et votre prénom?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Mon nom est [Nom] et mon prénom est [Prénom]. Je m'appelle [Prénom Nom].",
      keyPoints: [
        "Deux façons de répondre",
        "Réponse simple et claire"
      ]
    }
  },
  {
    id: 16,
    question: "Vous êtes originaire d'où?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent", "passé composé"],
    sampleResponse: {
      text: "Je suis originaire de Montréal, au Québec. J'y ai grandi et j'ai fait mes études. J'ai déménagé à Ottawa il y a dix ans.",
      keyPoints: [
        "Présent pour l'origine: je suis originaire",
        "Passé composé: j'ai grandi, j'ai déménagé"
      ]
    }
  },
  {
    id: 17,
    question: "Quelle est votre profession ou votre rôle à EDSC?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Je suis analyste de politiques à EDSC. Mon rôle consiste à analyser les programmes et à rédiger des recommandations pour les cadres supérieurs.",
      keyPoints: [
        "Présent pour décrire le rôle actuel",
        "Verbe 'consister à' + infinitif"
      ]
    }
  },
  {
    id: 18,
    question: "En quoi consiste votre travail exactement?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent"],
    sampleResponse: {
      text: "Mon travail consiste principalement à analyser les politiques gouvernementales. Je rédige des notes de breffage. Je participe à des réunions avec les intervenants. Je dois aussi préparer des présentations.",
      keyPoints: [
        "Présent pour les tâches régulières",
        "Verbe 'consister à' + infinitif",
        "Vocabulaire administratif"
      ]
    }
  },
  {
    id: 19,
    question: "Pourquoi avez-vous choisi de travailler dans la fonction publique?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai choisi la fonction publique parce que je voulais contribuer au bien-être des Canadiens. J'étais attiré par les programmes sociaux. La stabilité d'emploi m'a également motivé. Je souhaitais avoir un travail significatif.",
      keyPoints: [
        "Passé composé: j'ai choisi, m'a motivé",
        "Imparfait pour les motivations: je voulais, j'étais attiré, je souhaitais"
      ]
    }
  },
  {
    id: 20,
    question: "Quelles études ou quelle formation avez-vous faites pour occuper votre poste actuel?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai obtenu un baccalauréat en administration publique. Pendant mes études, je me spécialisais en politiques sociales. J'ai complété une maîtrise en gestion publique. J'ai également suivi des formations professionnelles.",
      keyPoints: [
        "Passé composé pour les diplômes: j'ai obtenu, j'ai complété",
        "Imparfait pour le contexte: je me spécialisais"
      ]
    }
  },
  {
    id: 21,
    question: "Où avez-vous commencé votre carrière?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    sampleResponse: {
      text: "J'ai commencé ma carrière dans le secteur privé. Je travaillais pour une entreprise de consultation. Ensuite, j'ai décidé de joindre la fonction publique. C'était une transition importante.",
      keyPoints: [
        "Passé composé pour les événements: j'ai commencé, j'ai décidé",
        "Imparfait pour le contexte: je travaillais, c'était"
      ]
    }
  },
  {
    id: 22,
    question: "Comment vos collègues et vos gestionnaires vous ont-ils accueilli lors de votre première affectation ou de votre premier emploi à EDSC?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    sampleResponse: {
      text: "L'accueil a été très chaleureux. Mes collègues m'avaient préparé un espace de travail. Mon gestionnaire avait organisé des rencontres. Pendant les premières semaines, mes collègues prenaient le temps de répondre à mes questions.",
      keyPoints: [
        "Plus-que-parfait: avaient préparé, avait organisé",
        "Passé composé: a été",
        "Imparfait: prenaient"
      ]
    }
  },
  {
    id: 23,
    question: "Parlez-moi en détail d'une expérience de travail à l'extérieur de votre région ou d'un projet spécial dans un autre bureau.",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    starMethod: true,
    sampleResponse: {
      text: "SITUATION: Il y a deux ans, j'ai travaillé à Vancouver pendant trois mois. TÂCHE: Je devais aider l'équipe locale à implanter un nouveau système. ACTION: J'ai travaillé avec les employés locaux. Je participais aux réunions quotidiennes. J'avais préparé des guides avant mon arrivée. RÉSULTAT: Le projet a été un succès.",
      keyPoints: [
        "Structure STAR",
        "Plus-que-parfait: j'avais préparé",
        "Imparfait: je participais",
        "Passé composé: j'ai travaillé, a été"
      ]
    }
  },
  {
    id: 24,
    question: "Quel a été le plus grand défi pendant cette expérience?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "conditionnel passé"],
    sampleResponse: {
      text: "Le plus grand défi était la résistance au changement. Certains employés étaient habitués à l'ancien système. J'ai dû faire preuve de patience. Avec le recul, j'aurais dû les impliquer plus tôt. Cela aurait facilité la transition.",
      keyPoints: [
        "Imparfait: était, étaient habitués",
        "Passé composé: j'ai dû",
        "Conditionnel passé: j'aurais dû, cela aurait facilité"
      ]
    }
  },
  {
    id: 25,
    question: "Décrivez un problème que vous avez rencontré et comment vous l'avez géré.",
    topic: "conflict_management",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    starMethod: true,
    sampleResponse: {
      text: "SITUATION: Un collègue et moi avions des opinions différentes sur un dossier. TÂCHE: Je devais résoudre ce conflit. ACTION: J'ai proposé une rencontre privée. J'ai écouté son point de vue. Nous avons trouvé un compromis. RÉSULTAT: Notre relation s'est améliorée.",
      keyPoints: [
        "Imparfait: avions, devais",
        "Passé composé: j'ai proposé, j'ai écouté, nous avons trouvé"
      ]
    }
  },
  {
    id: 26,
    question: "Comment étaient vos conditions de travail pendant cette période?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait"],
    sampleResponse: {
      text: "Les conditions de travail étaient bonnes mais différentes. Le bureau était plus petit. L'équipe travaillait dans un espace ouvert. L'atmosphère était décontractée. Je devais m'adapter au décalage horaire pour les réunions.",
      keyPoints: [
        "Imparfait pour toutes les descriptions: étaient, était, travaillait, devais"
      ]
    }
  },
  {
    id: 27,
    question: "Étiez-vous suffisamment préparé ou préparée pour cette tâche? Pourquoi ou pourquoi pas?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["imparfait", "plus-que-parfait", "conditionnel passé"],
    sampleResponse: {
      text: "Je n'étais pas entièrement préparé. J'avais suivi une formation, mais elle ne couvrait pas tous les aspects. J'aurais aimé avoir plus de temps. Si c'était à refaire, je demanderais une période d'observation.",
      keyPoints: [
        "Imparfait: je n'étais pas, elle ne couvrait pas",
        "Plus-que-parfait: j'avais suivi",
        "Conditionnel passé: j'aurais aimé"
      ]
    }
  },
  {
    id: 28,
    question: "Si vous deviez refaire une expérience semblable, que feriez-vous différemment?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["conditionnel", "imparfait"],
    sampleResponse: {
      text: "Si je devais refaire cette expérience, je ferais plusieurs choses différemment. Je demanderais une rencontre préalable avec l'équipe. Je voudrais mieux comprendre leurs besoins. Je prendrais plus de temps pour établir des relations. Je me préparerais davantage.",
      keyPoints: [
        "Structure hypothétique: Si + imparfait, conditionnel",
        "Conditionnel: je ferais, je demanderais, je voudrais, je prendrais"
      ]
    }
  },
  {
    id: 29,
    question: "Quelles sont les prochaines formations que vous aimeriez suivre?",
    topic: "future_plans",
    difficulty: "B1",
    targetStructures: ["conditionnel", "subjonctif"],
    sampleResponse: {
      text: "J'aimerais suivre une formation en gestion de projet. Je voudrais aussi améliorer mes compétences en analyse de données. Il faudrait que je suive des cours de leadership. Je souhaiterais obtenir une certification professionnelle.",
      keyPoints: [
        "Conditionnel: j'aimerais, je voudrais, je souhaiterais",
        "Subjonctif après 'il faudrait que': que je suive"
      ]
    }
  },
  {
    id: 30,
    question: "Quels sont vos plans, ou ceux de votre gestionnaire, à long terme concernant votre développement professionnel?",
    topic: "future_plans",
    difficulty: "B1+",
    targetStructures: ["conditionnel", "subjonctif", "futur"],
    sampleResponse: {
      text: "Mon gestionnaire souhaite que je participe à des projets interministériels. À moyen terme, j'aimerais obtenir une affectation dans un autre secteur. Il faudrait que j'acquière de l'expérience en politique. À long terme, je viserais un poste de gestion. Mon gestionnaire m'a dit qu'il me soutiendrait.",
      keyPoints: [
        "Subjonctif: que je participe, que j'acquière",
        "Conditionnel: j'aimerais, je viserais",
        "Structure: court/moyen/long terme"
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
  const audioElementRef = useRef(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

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

  // Initialize persistent audio element for iOS compatibility
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioElementRef.current) {
      const audio = document.createElement('audio')
      audio.setAttribute('playsinline', 'true')
      audio.setAttribute('webkit-playsinline', 'true')
      audioElementRef.current = audio
    }
  }, [])

  // Unlock audio on first user interaction (required for iOS)
  const unlockAudio = useCallback(() => {
    if (!audioUnlocked && audioElementRef.current) {
      // Play a silent audio to unlock
      audioElementRef.current.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwmHAAAAAAD/+1DEAAAFAAGf9AAAIgAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxDmAAADSAAAAAAAAANIAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
      audioElementRef.current.play().then(() => {
        setAudioUnlocked(true)
      }).catch(() => {
        // Silent fail - will try again on next interaction
      })
    }
  }, [audioUnlocked])

  // Get speaking rate based on difficulty level
  const getSpeakingRate = (difficulty) => {
    switch (difficulty) {
      case 'A2':
        return 0.8   // Slow for beginners
      case 'A2-B1':
        return 0.85  // Slightly slow
      case 'B1':
        return 0.92  // Moderate
      case 'B1+':
        return 1.0   // Natural speed
      default:
        return 0.9
    }
  }

  const speakFrench = async (text, difficulty = 'B1') => {
    // Unlock audio on iOS if needed
    unlockAudio()

    // Stop any current audio
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.currentTime = 0
    }

    setIsSpeaking(true)
    const speakingRate = getSpeakingRate(difficulty)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speakingRate })
      })

      if (!response.ok) {
        throw new Error('TTS API failed')
      }

      const { audioContent } = await response.json()
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      )
      const audioUrl = URL.createObjectURL(audioBlob)

      // Use persistent audio element for iOS
      const audio = audioElementRef.current
      audio.src = audioUrl

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = (e) => {
        console.error('Audio playback error:', e)
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        // Try Web Speech API as fallback
        fallbackToWebSpeech(text, difficulty)
      }

      try {
        await audio.play()
      } catch (playError) {
        console.error('Audio play failed:', playError)
        // Fallback to Web Speech API
        fallbackToWebSpeech(text, difficulty)
      }
    } catch (error) {
      console.error('Google TTS failed:', error)
      fallbackToWebSpeech(text, difficulty)
    }
  }

  const fallbackToWebSpeech = (text, difficulty = 'B1') => {
    const speakingRate = getSpeakingRate(difficulty)

    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = speakingRate
      utterance.pitch = 1.05

      const voices = synthRef.current.getVoices()
      const frenchVoice = voices.find(v => v.lang.startsWith('fr'))
      if (frenchVoice) utterance.voice = frenchVoice

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    } else {
      setIsSpeaking(false)
    }
  }

  // Start exam - requires user tap for iOS audio unlock
  const startExam = useCallback(() => {
    // Unlock audio on iOS
    unlockAudio()

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
      speakFrench(firstQuestion.question, firstQuestion.difficulty)
    }, 500)
  }, [unlockAudio])

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
      speakFrench(feedback.spokenFeedback, currentQuestion.difficulty)
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

      const nextQuestion = PSC_EXAM_QUESTIONS[nextIndex]
      setTimeout(() => {
        speakFrench(nextQuestion.question, nextQuestion.difficulty)
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
        <div style={styles.startScreen}>
          <div style={styles.profileImageContainer}>
            <img
              src="/susan.jpg"
              alt="Susan Matheson"
              style={styles.profileImage}
            />
          </div>
          <h1 style={styles.startTitle}>Susan Matheson French Helper</h1>
          <p style={styles.startSubtitle}>Examen oral PSC - Niveau A2-B1</p>
          <div style={styles.startInfo}>
            <p>30 questions progressives</p>
            <p>Mode vocal uniquement</p>
            <p>Rétroaction après chaque réponse</p>
          </div>
          <button style={styles.startButton} onClick={startExam}>
            🎤 Commencer l'examen
          </button>
          <p style={styles.startNote}>
            Appuyez pour activer l'audio et commencer
          </p>
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
            onClick={() => speakFrench(currentQuestion.question, currentQuestion.difficulty)}
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
                onClick={() => speakFrench(examFeedback.sampleResponse.text, examFeedback.difficulty)}
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
  startScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1a2a4a, #2d3e5f)',
  },
  profileImageContainer: {
    marginBottom: '1.5rem',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  startTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.5rem',
    color: 'white',
    marginBottom: '0.5rem',
  },
  startSubtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '2rem',
  },
  startInfo: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '2rem',
    lineHeight: '1.8',
  },
  startButton: {
    background: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '1.2rem 3rem',
    fontSize: '1.3rem',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  startNote: {
    marginTop: '1.5rem',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.9rem',
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
