'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// PSC French Oral Exam Questions - Level A2-B1
// Questions are asked ORALLY only - text hidden until after response
// AI analyzes responses and corrects pronunciation
const PSC_EXAM_QUESTIONS = [
  // Section 1: Introduction personnelle (A2)
  {
    id: 1,
    question: "Quel est votre nom et votre prénom?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    grammarTip: "Utilisez 'Je m'appelle...' ou 'Mon nom est... et mon prénom est...' avec le verbe être/s'appeler au présent.",
    exampleAnswer: "Je m'appelle Marie Tremblay. Mon prénom est Marie et mon nom de famille est Tremblay.",
  },
  {
    id: 2,
    question: "Vous êtes originaire d'où?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent", "passé composé"],
    grammarTip: "Utilisez 'Je suis originaire de...' (présent) ou 'Je suis né(e) à...' (passé composé). N'oubliez pas l'accord du participe passé avec être!",
    exampleAnswer: "Je suis originaire de Toronto, en Ontario. Je suis née là-bas, mais j'ai grandi à Ottawa.",
  },
  {
    id: 3,
    question: "Quel poste ou rôle occupez-vous actuellement à EDSC?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    grammarTip: "Utilisez 'J'occupe le poste de...' ou 'Je travaille comme...' au présent de l'indicatif.",
    exampleAnswer: "J'occupe le poste d'analyste des politiques au sein de la Direction générale des services.",
  },
  {
    id: 4,
    question: "Dans quelle direction ou quel secteur travaillez-vous?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    grammarTip: "Utilisez 'Je travaille dans...' ou 'Je fais partie de...' avec les prépositions correctes (dans, à, au sein de).",
    exampleAnswer: "Je travaille dans la Direction générale des opérations régionales, au sein du secteur des ressources humaines.",
  },
  {
    id: 5,
    question: "En quoi consiste votre travail exactement?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent"],
    grammarTip: "Décrivez vos tâches avec des verbes au présent: 'Mon travail consiste à + infinitif' ou 'Je suis responsable de + nom/infinitif'.",
    exampleAnswer: "Mon travail consiste à analyser les données et à préparer des rapports. Je suis responsable de la coordination des projets.",
  },
  {
    id: 6,
    question: "Depuis quand travaillez-vous à EDSC?",
    topic: "introduction",
    difficulty: "A2",
    targetStructures: ["présent"],
    grammarTip: "'Depuis' + durée ou date avec le PRÉSENT (pas le passé!): 'Je travaille ici depuis 5 ans' ou 'depuis 2019'.",
    exampleAnswer: "Je travaille à EDSC depuis 2018, donc ça fait maintenant six ans que je suis ici.",
  },
  {
    id: 7,
    question: "Pourquoi avez-vous choisi de travailler dans la fonction publique?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "Passé composé pour l'action (j'ai choisi) + imparfait pour expliquer les raisons/contexte (je voulais, c'était important).",
    exampleAnswer: "J'ai choisi la fonction publique parce que je voulais contribuer au bien-être des Canadiens. C'était important pour moi d'avoir un travail stable avec de bons avantages.",
  },
  {
    id: 8,
    question: "Quelles études ou formations avez-vous suivies pour occuper votre poste actuel?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé"],
    grammarTip: "Passé composé avec avoir: 'J'ai suivi', 'J'ai obtenu', 'J'ai fait'. Le participe passé ne s'accorde pas avec avoir (sauf si COD avant).",
    exampleAnswer: "J'ai obtenu un baccalauréat en administration publique à l'Université d'Ottawa. Ensuite, j'ai suivi plusieurs formations en gestion de projets.",
  },
  // Section 2: Parcours professionnel (A2-B1)
  {
    id: 9,
    question: "Où avez-vous commencé votre carrière dans la fonction publique?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "Passé composé pour l'événement (j'ai commencé) + imparfait pour décrire la situation (c'était, j'étais, il y avait).",
    exampleAnswer: "J'ai commencé ma carrière à Service Canada en 2015. C'était un poste d'agent de service à la clientèle. J'étais responsable d'aider les citoyens.",
  },
  {
    id: 10,
    question: "Quel était le poste que vous occupiez avant celui-ci et quelles en étaient les principales tâches?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait"],
    grammarTip: "L'imparfait décrit des situations passées habituelles: 'J'occupais', 'Je faisais', 'Mes tâches étaient'. Formation: radical + ais/ais/ait/ions/iez/aient.",
    exampleAnswer: "Avant ce poste, j'occupais le rôle de coordonnateur. Mes principales tâches étaient la planification des réunions et la rédaction de comptes rendus. Je travaillais avec plusieurs équipes.",
  },
  {
    id: 11,
    question: "Comment s'est déroulée la procédure d'embauche à l'époque?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "Passé composé pour les étapes (j'ai postulé, j'ai passé l'entrevue) + imparfait pour le contexte (le processus était, il y avait).",
    exampleAnswer: "La procédure d'embauche était assez longue. J'ai d'abord postulé en ligne, puis j'ai passé un examen écrit. Ensuite, il y avait une entrevue avec un comité de sélection.",
  },
  {
    id: 12,
    question: "Combien de temps avez-vous attendu avant de commencer votre poste et qu'avez-vous fait durant cette période?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "Passé composé pour les actions terminées (j'ai attendu, j'ai fait) + imparfait pour les activités en cours (je travaillais, je me préparais).",
    exampleAnswer: "J'ai attendu environ trois mois avant de commencer. Durant cette période, je travaillais encore à mon ancien poste et je me préparais pour mes nouvelles fonctions.",
  },
  {
    id: 13,
    question: "Avez-vous suivi une formation d'intégration avant de commencer?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["passé composé"],
    grammarTip: "Questions fermées avec passé composé: Oui, j'ai suivi... / Non, je n'ai pas suivi... N'oubliez pas 'ne...pas' autour de l'auxiliaire.",
    exampleAnswer: "Oui, j'ai suivi une formation d'intégration de deux semaines. On nous a présenté les politiques du ministère et les outils informatiques que nous allions utiliser.",
  },
  {
    id: 14,
    question: "Comment vos collègues et vos gestionnaires vous ont-ils accueilli lors de votre première affectation à EDSC?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "plus-que-parfait"],
    grammarTip: "Plus-que-parfait pour une action antérieure à une autre au passé: 'Ils avaient préparé mon bureau avant mon arrivée' (auxiliaire à l'imparfait + participe passé).",
    exampleAnswer: "Mes collègues m'ont très bien accueilli. Ils avaient déjà préparé mon bureau et mon ordinateur. Mon gestionnaire était très accueillant et m'a présenté à toute l'équipe.",
  },
  {
    id: 15,
    question: "Qui était votre premier gestionnaire et comment décririez-vous son style de leadership?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait", "conditionnel"],
    grammarTip: "Imparfait pour la description passée (il/elle était) + conditionnel présent pour une description hypothétique (je dirais, je le/la décrirais comme...).",
    exampleAnswer: "Ma première gestionnaire était Madame Bouchard. Je la décrirais comme une personne très organisée et à l'écoute. Elle encourageait toujours notre développement professionnel.",
  },
  {
    id: 16,
    question: "De quelle façon votre premier poste a-t-il influencé votre manière de travailler par la suite?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé", "présent"],
    grammarTip: "Passé composé pour l'influence passée (a influencé, j'ai appris) + présent pour le résultat actuel (maintenant je suis, j'utilise).",
    exampleAnswer: "Mon premier poste a beaucoup influencé ma façon de travailler. J'ai appris l'importance de la communication. Maintenant, je m'assure toujours de bien documenter mon travail.",
  },
  // Section 3: Responsabilités et compétences (B1)
  {
    id: 17,
    question: "Quelles sont vos responsabilités principales?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent"],
    grammarTip: "Utilisez des expressions comme 'Je suis responsable de + nom/infinitif', 'Je m'occupe de...', 'Mon rôle consiste à...' au présent.",
    exampleAnswer: "Je suis responsable de la gestion des dossiers des clients. Je m'occupe aussi de la formation des nouveaux employés et je participe aux réunions d'équipe.",
  },
  {
    id: 18,
    question: "Quelles qualités, compétences et connaissances sont nécessaires pour réussir dans votre poste?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent", "subjonctif"],
    grammarTip: "Subjonctif après 'il faut que', 'il est nécessaire que', 'pour que': 'Il faut que je sois organisé', 'Il est important que nous sachions...'",
    exampleAnswer: "Il faut être organisé et avoir de bonnes compétences en communication. Il est nécessaire que l'on sache travailler sous pression. La maîtrise d'Excel est aussi essentielle.",
  },
  {
    id: 19,
    question: "Quelles sont les exigences les plus difficiles à gérer dans votre travail ou en supervision?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent"],
    grammarTip: "Superlatifs: 'le plus difficile', 'la plus grande exigence'. Utilisez 'à + infinitif' après les adjectifs: 'difficile à gérer', 'compliqué à expliquer'.",
    exampleAnswer: "L'exigence la plus difficile à gérer est le respect des délais serrés. Il est parfois compliqué de concilier les priorités multiples de différents projets en même temps.",
  },
  {
    id: 20,
    question: "Parlez-moi d'un problème ou défi que vous avez rencontré au travail et expliquez comment vous l'avez géré.",
    topic: "conflict_management",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    starMethod: true,
    grammarTip: "Méthode STAR: Situation (imparfait), Tâche (imparfait), Action (passé composé), Résultat (passé composé). 'Il y avait... J'ai décidé de... J'ai réussi à...'",
    exampleAnswer: "L'année dernière, nous avions un projet urgent avec un délai très court. J'ai organisé des réunions quotidiennes et j'ai redistribué les tâches. Finalement, nous avons livré le projet à temps.",
  },
  {
    id: 21,
    question: "Quel est le problème qui revient le plus souvent dans votre travail?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent"],
    grammarTip: "Expressions de fréquence au présent: 'revient souvent', 'se produit régulièrement', 'arrive fréquemment'. Relatif 'qui' comme sujet.",
    exampleAnswer: "Le problème qui revient le plus souvent est le manque de ressources. Nous avons souvent trop de travail et pas assez de personnel pour tout accomplir dans les délais.",
  },
  {
    id: 22,
    question: "Comment gérez-vous votre temps au quotidien?",
    topic: "explaining",
    difficulty: "A2-B1",
    targetStructures: ["présent"],
    grammarTip: "Verbes pronominaux au présent: 'je m'organise', 'je me concentre'. Expressions de temps: 'chaque jour', 'd'abord', 'ensuite', 'finalement'.",
    exampleAnswer: "Chaque matin, je consulte mon calendrier et je fais une liste de priorités. D'abord, je m'occupe des tâches urgentes, ensuite je travaille sur les projets à long terme.",
  },
  // Section 4: Travail d'équipe (B1)
  {
    id: 23,
    question: "Préférez-vous travailler seul ou en équipe? Pourquoi?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent", "conditionnel"],
    grammarTip: "Exprimer la préférence: 'Je préfère + infinitif', 'J'aime mieux + infinitif'. Conditionnel pour nuancer: 'je dirais que', 'cela dépendrait de...'",
    exampleAnswer: "Je préfère travailler en équipe parce que j'aime échanger des idées avec mes collègues. Cependant, pour certaines tâches de concentration, je dirais que le travail seul est plus efficace.",
  },
  {
    id: 24,
    question: "Parlez-moi de votre meilleure expérience de collaboration.",
    topic: "communication_leadership",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    starMethod: true,
    grammarTip: "Superlatif passé: 'ma meilleure expérience'. Narration: imparfait (contexte) + passé composé (actions). 'Nous travaillions ensemble quand nous avons réussi...'",
    exampleAnswer: "Ma meilleure expérience de collaboration était un projet interdépartemental. Nous travaillions avec trois autres équipes. Nous avons réussi à créer un nouveau processus qui a réduit les délais de 30%.",
  },
  {
    id: 25,
    question: "Parlez-moi d'une activité sociale que vous avez organisée ou aidée à organiser au bureau.",
    topic: "communication_leadership",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "'Aider à + infinitif': 'J'ai aidé à organiser'. Passé composé pour les actions d'organisation + imparfait pour décrire l'événement.",
    exampleAnswer: "L'an dernier, j'ai aidé à organiser une fête de fin d'année pour notre équipe. Nous avons réservé un restaurant et j'ai préparé des jeux. C'était une soirée très réussie.",
  },
  // Section 5: Changement et adaptation (B1)
  {
    id: 26,
    question: "Quel a été le dernier grand changement dans votre unité de travail?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    grammarTip: "Passé composé avec être: 'Quel a été...' Accord du participe passé avec le sujet. Décrire l'impact avec l'imparfait et le passé composé.",
    exampleAnswer: "Le dernier grand changement a été l'adoption du travail hybride. Avant, nous travaillions tous au bureau. Maintenant, nous alternons entre le bureau et le télétravail.",
  },
  {
    id: 27,
    question: "Quel a été le moment le plus passionnant de votre carrière jusqu'à maintenant?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["passé composé"],
    grammarTip: "Superlatif + passé composé: 'le plus passionnant a été'. Expression 'jusqu'à maintenant' ou 'jusqu'ici' pour marquer la continuité vers le présent.",
    exampleAnswer: "Le moment le plus passionnant a été quand j'ai reçu ma première promotion. J'ai travaillé très fort pendant deux ans et cet accomplissement a été une grande fierté pour moi.",
  },
  {
    id: 28,
    question: "Quel était votre travail préféré et pourquoi?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait"],
    grammarTip: "L'imparfait pour décrire un état passé: 'Mon travail préféré était...', 'J'aimais ce poste parce que...' Attention: 'préféré' est un adjectif, pas un verbe ici.",
    exampleAnswer: "Mon travail préféré était celui de conseiller en communication. J'aimais ce poste parce que je rencontrais beaucoup de gens différents et chaque jour était différent.",
  },
  {
    id: 29,
    question: "Parlez-moi d'une expérience de travail à l'extérieur de votre région ou d'un projet spécial.",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait"],
    starMethod: true,
    grammarTip: "Prépositions de lieu: 'à l'extérieur de', 'dans une autre région', 'à + ville'. Narrer avec passé composé (actions) et imparfait (descriptions).",
    exampleAnswer: "J'ai participé à un projet spécial à Vancouver pendant trois mois. Je travaillais avec une équipe de l'Ouest canadien. C'était une expérience enrichissante qui m'a permis d'apprendre beaucoup.",
  },
  {
    id: 30,
    question: "Quel a été le plus grand défi?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["passé composé", "imparfait", "conditionnel passé"],
    grammarTip: "Conditionnel passé pour exprimer un regret ou ce qu'on aurait fait différemment: 'J'aurais dû...', 'J'aurais pu...' (auxiliaire au conditionnel + participe passé).",
    exampleAnswer: "Le plus grand défi a été de m'adapter au décalage horaire et à une nouvelle équipe. J'aurais pu mieux me préparer si j'avais su à l'avance les différences culturelles.",
  },
  {
    id: 31,
    question: "Comment étaient les conditions de travail?",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["imparfait"],
    grammarTip: "L'imparfait pour les descriptions: 'Les conditions étaient...', 'Il y avait...', 'Nous avions...'. Adjectifs accordés avec le nom qu'ils qualifient.",
    exampleAnswer: "Les conditions de travail étaient excellentes. Nous avions un bureau moderne avec de bons équipements. L'ambiance était collaborative et le gestionnaire était très supportif.",
  },
  {
    id: 32,
    question: "Étiez-vous suffisamment préparé(e)? Pourquoi?",
    topic: "adaptation",
    difficulty: "B1",
    targetStructures: ["imparfait", "plus-que-parfait", "conditionnel passé"],
    grammarTip: "Plus-que-parfait pour une action antérieure: 'J'avais préparé...'. Accord de 'préparé(e)' avec le sujet quand on utilise être. Conditionnel passé: 'j'aurais été mieux préparé(e)'.",
    exampleAnswer: "Je n'étais pas suffisamment préparé parce que je n'avais pas eu assez de temps pour me former. J'aurais été mieux préparé si j'avais suivi une formation avant de commencer.",
  },
  // Section 6: Services et ministère (B1)
  {
    id: 33,
    question: "Parlez-moi d'un service offert dans votre direction que vous jugez particulièrement important.",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent", "subjonctif"],
    grammarTip: "Subjonctif après 'je juge que' (quand il exprime un jugement subjectif) ou 'il est important que'. Participe passé 'offert' = masculin singulier.",
    exampleAnswer: "Un service que je juge particulièrement important est l'aide aux nouveaux arrivants. Il est essentiel que ces personnes reçoivent le soutien nécessaire pour s'intégrer au Canada.",
  },
  {
    id: 34,
    question: "Décrivez les services offerts par votre ministère et la clientèle desservie.",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent"],
    grammarTip: "Voix passive au présent: 'sont offerts', 'est desservie'. Participes passés accordés. Utiliser des connecteurs: 'premièrement', 'de plus', 'également'.",
    exampleAnswer: "Notre ministère offre plusieurs services. Premièrement, nous gérons les prestations d'assurance-emploi. De plus, nous offrons des services aux aînés. Notre clientèle est composée de tous les Canadiens.",
  },
  {
    id: 35,
    question: "Parlez-moi d'une tâche qui constitue selon vous une perte de temps actuellement.",
    topic: "explaining",
    difficulty: "B1",
    targetStructures: ["présent", "conditionnel"],
    grammarTip: "Expression d'opinion: 'selon moi', 'à mon avis'. Conditionnel pour suggérer: 'On pourrait...', 'Il serait préférable de...', 'Ce serait mieux si...'",
    exampleAnswer: "Selon moi, la saisie manuelle de données constitue une perte de temps. On pourrait automatiser ce processus. Il serait préférable d'investir dans un système informatique plus moderne.",
  },
  // Section 7: Développement professionnel (B1+)
  {
    id: 36,
    question: "Quelles formations aimeriez-vous suivre prochainement?",
    topic: "future_plans",
    difficulty: "B1",
    targetStructures: ["conditionnel"],
    grammarTip: "Conditionnel présent pour les souhaits: 'J'aimerais', 'Je voudrais', 'Je souhaiterais' + infinitif. Formation: radical du futur + terminaisons de l'imparfait.",
    exampleAnswer: "J'aimerais suivre une formation en gestion de projets. Je voudrais aussi améliorer mes compétences en analyse de données. Ce serait utile pour ma progression de carrière.",
  },
  {
    id: 37,
    question: "Quels sont vos objectifs ou ceux de votre gestionnaire concernant votre développement professionnel à long terme?",
    topic: "future_plans",
    difficulty: "B1+",
    targetStructures: ["présent", "conditionnel", "subjonctif"],
    grammarTip: "Subjonctif après 'Mon gestionnaire veut que je...', 'Il souhaite que nous...'. Mélange de temps: présent (objectifs actuels), conditionnel (souhaits), subjonctif (volonté d'autrui).",
    exampleAnswer: "Mon objectif est de devenir gestionnaire d'ici cinq ans. Mon gestionnaire souhaite que je développe mes compétences en leadership. Il voudrait que je prenne plus de responsabilités.",
  },
  {
    id: 38,
    question: "Quelles compétences devrez-vous développer à l'avenir pour poursuivre votre carrière?",
    topic: "future_plans",
    difficulty: "B1+",
    targetStructures: ["futur", "conditionnel"],
    grammarTip: "Futur simple pour les certitudes: 'je devrai', 'il faudra'. Formation: infinitif + ai/as/a/ons/ez/ont. Conditionnel pour les possibilités: 'je pourrais', 'ce serait bien de...'",
    exampleAnswer: "Je devrai développer mes compétences en communication orale en français. Il faudra aussi que j'améliore ma capacité à gérer des équipes. Ce serait bien de suivre une formation en leadership.",
  },
  {
    id: 39,
    question: "Parlez-moi du prochain poste que vous aimeriez occuper ou d'un projet que vous aimeriez entreprendre.",
    topic: "future_plans",
    difficulty: "B1+",
    targetStructures: ["conditionnel", "subjonctif"],
    grammarTip: "Conditionnel de souhait: 'J'aimerais occuper...', 'Je voudrais entreprendre...'. Subjonctif après 'pour que': 'pour que je puisse évoluer...'",
    exampleAnswer: "J'aimerais occuper un poste de gestionnaire d'équipe. Je voudrais entreprendre un projet d'amélioration des processus dans notre direction pour que nous puissions être plus efficaces.",
  },
  {
    id: 40,
    question: "Choisissez une tâche opérationnelle de votre travail et expliquez comment vous la présenteriez à des collègues en intégration.",
    topic: "explaining",
    difficulty: "B1+",
    targetStructures: ["conditionnel", "présent"],
    grammarTip: "Conditionnel pour expliquer une situation hypothétique: 'Je présenterais...', 'J'expliquerais...'. Impératif pour donner des instructions: 'D'abord, ouvrez...', 'Ensuite, cliquez...'",
    exampleAnswer: "Je choisirais d'expliquer le traitement des demandes de remboursement. Je présenterais d'abord le système informatique, puis j'expliquerais les étapes: D'abord, ouvrez le dossier du client, ensuite vérifiez les documents...",
  },
]

export default function PSCExamSimulator() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // App mode: 'home' | 'exam' | 'tutor'
  const [appMode, setAppMode] = useState('home')

  // PSC Exam state
  const [examQuestionIndex, setExamQuestionIndex] = useState(0)
  const [examHistory, setExamHistory] = useState([])
  const [completedQuestions, setCompletedQuestions] = useState([]) // Track completed question IDs
  const [awaitingAnswer, setAwaitingAnswer] = useState(false)
  const [answerComplete, setAnswerComplete] = useState(false)
  const [examFeedback, setExamFeedback] = useState(null)
  const [examStarted, setExamStarted] = useState(false)
  const [fullTranscript, setFullTranscript] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [progressLoaded, setProgressLoaded] = useState(false)
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState([])
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)

  // AI Tutor state
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const chatEndRef = useRef(null)

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

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProgress = localStorage.getItem('frenchExamProgress')
        if (savedProgress) {
          const progress = JSON.parse(savedProgress)
          if (progress.examQuestionIndex !== undefined) {
            setExamQuestionIndex(progress.examQuestionIndex)
          }
          if (progress.completedQuestions) {
            setCompletedQuestions(progress.completedQuestions)
          }
          if (progress.examHistory) {
            setExamHistory(progress.examHistory)
          }
        }
      } catch (e) {
        console.error('Error loading progress:', e)
      }
      setProgressLoaded(true)
    }
  }, [])

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && progressLoaded) {
      try {
        const progress = {
          examQuestionIndex,
          completedQuestions,
          examHistory,
          lastUpdated: new Date().toISOString()
        }
        localStorage.setItem('frenchExamProgress', JSON.stringify(progress))
      } catch (e) {
        console.error('Error saving progress:', e)
      }
    }
  }, [examQuestionIndex, completedQuestions, examHistory, progressLoaded])

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

    setAppMode('exam')
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

  // Start AI Tutor mode
  const startTutor = () => {
    unlockAudio()
    setAppMode('tutor')
    setChatMessages([{
      role: 'assistant',
      content: "Bonjour! Je suis votre tuteur de français. Je suis là pour vous aider à préparer votre examen oral PSC niveau A2-B1. 🇫🇷\n\nVous pouvez me poser des questions sur:\n• La grammaire (conditionnel, subjonctif, imparfait vs passé composé)\n• Le vocabulaire professionnel\n• La préparation aux entrevues\n• La méthode STAR pour les questions comportementales\n• Ou tout autre sujet en français!\n\nComment puis-je vous aider aujourd'hui?"
    }])
  }

  // Send chat message to AI tutor
  const sendChatMessage = async (messageText) => {
    const text = messageText || chatInput.trim()
    if (!text || isChatLoading) return

    const userMessage = { role: 'user', content: text }
    const newMessages = [...chatMessages, userMessage]
    setChatMessages(newMessages)
    setChatInput('')
    setIsChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) throw new Error('Chat failed')

      const data = await response.json()
      setChatMessages([...newMessages, { role: 'assistant', content: data.message }])

      // Auto-scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Chat error:', error)
      setChatMessages([...newMessages, {
        role: 'assistant',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer."
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  // Use voice input for chat
  const startVoiceChat = () => {
    if (recognitionRef.current && !isListening) {
      setFullTranscript('')
      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const sendVoiceMessage = () => {
    if (transcript.trim()) {
      sendChatMessage(transcript.trim())
      setTranscript('')
      setFullTranscript('')
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
  }

  // Reset chat to start fresh
  const resetChat = () => {
    setChatMessages([{
      role: 'assistant',
      content: "Bonjour! Je suis votre tuteur de français. Je suis là pour vous aider à préparer votre examen oral PSC niveau A2-B1. 🇫🇷\n\nVous pouvez me poser des questions sur:\n• La grammaire (conditionnel, subjonctif, imparfait vs passé composé)\n• Le vocabulaire professionnel\n• La préparation aux entrevues\n• La méthode STAR pour les questions comportementales\n• Ou tout autre sujet en français!\n\nComment puis-je vous aider aujourd'hui?"
    }])
    setChatInput('')
    setTranscript('')
    setFullTranscript('')
  }

  // Go back to home
  const goHome = () => {
    setAppMode('home')
    setExamStarted(false)
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
  }

  const submitExamAnswer = async () => {
    if (!transcript.trim()) return

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    setAnswerComplete(true)
    setAwaitingAnswer(false)
    setIsAnalyzing(true)
    setAiAnalysis(null)

    const currentQuestion = PSC_EXAM_QUESTIONS[examQuestionIndex]

    // Get basic grammar feedback while AI analyzes
    const feedback = generateExamFeedback(transcript, currentQuestion)
    setExamFeedback(feedback)

    setExamHistory(prev => [...prev, {
      question: currentQuestion.question,
      answer: transcript,
      feedback: feedback
    }])

    // Call AI analysis API for pronunciation and detailed feedback
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: transcript,
          difficulty: currentQuestion.difficulty,
          targetStructures: currentQuestion.targetStructures
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnalysis(data.analysis)

        // Speak AI feedback
        if (data.analysis.overallFeedback) {
          setTimeout(() => {
            speakFrench(data.analysis.overallFeedback, currentQuestion.difficulty)
          }, 500)
        }
      } else {
        // Fall back to basic spoken feedback
        setTimeout(() => {
          speakFrench(feedback.spokenFeedback, currentQuestion.difficulty)
        }, 500)
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      // Fall back to basic spoken feedback
      setTimeout(() => {
        speakFrench(feedback.spokenFeedback, currentQuestion.difficulty)
      }, 500)
    } finally {
      setIsAnalyzing(false)
    }
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
    // Mark current question as completed
    const currentQuestion = PSC_EXAM_QUESTIONS[examQuestionIndex]
    if (!completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions(prev => [...prev, currentQuestion.id])
    }

    const allQs = [...PSC_EXAM_QUESTIONS, ...aiGeneratedQuestions]
    if (examQuestionIndex < allQs.length - 1) {
      const nextIndex = examQuestionIndex + 1
      setExamQuestionIndex(nextIndex)
      setExamFeedback(null)
      setAnswerComplete(false)
      setAwaitingAnswer(true)
      setTranscript('')
      setFullTranscript('')
      setAiAnalysis(null)
      setIsAnalyzing(false)

      const nextQuestion = allQs[nextIndex]
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
    setCompletedQuestions([])
    setExamFeedback(null)
    setAwaitingAnswer(false)
    setAnswerComplete(false)
    setTranscript('')
    setFullTranscript('')
    setAiAnalysis(null)
    setIsAnalyzing(false)
    setAiGeneratedQuestions([])

    // Clear localStorage progress
    if (typeof window !== 'undefined') {
      localStorage.removeItem('frenchExamProgress')
    }

    setTimeout(() => startExam(), 100)
  }

  // Generate more questions with AI
  const generateMoreQuestions = async () => {
    setIsGeneratingQuestions(true)
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTopics: ['introduction', 'explaining'],
          difficulty: 'B1',
          count: 10
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.questions && data.questions.length > 0) {
          // Add IDs starting from 41 + existing AI questions
          const startId = 41 + aiGeneratedQuestions.length
          const newQuestions = data.questions.map((q, i) => ({
            ...q,
            id: startId + i,
            isAiGenerated: true
          }))
          setAiGeneratedQuestions(prev => [...prev, ...newQuestions])
        }
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
    }
    setIsGeneratingQuestions(false)
  }

  // Combine original and AI-generated questions
  const allQuestions = [...PSC_EXAM_QUESTIONS, ...aiGeneratedQuestions]
  const currentQuestion = allQuestions[examQuestionIndex]
  const totalQuestions = allQuestions.length

  // Home screen with mode selection
  // Calculate progress percentage
  const progressPercent = Math.round((completedQuestions.length / PSC_EXAM_QUESTIONS.length) * 100)
  const hasProgress = completedQuestions.length > 0 || examQuestionIndex > 0

  if (appMode === 'home') {
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
          <p style={styles.startSubtitle}>Préparation à l'examen oral PSC - Niveau A2-B1</p>

          {/* Progress indicator */}
          {hasProgress && progressLoaded && (
            <div style={styles.progressSection}>
              <div style={styles.progressHeader}>
                <span style={styles.progressLabel}>Votre progression</span>
                <span style={styles.progressPercent}>{progressPercent}%</span>
              </div>
              <div style={styles.progressBarContainer}>
                <div style={{...styles.progressBarFill, width: `${progressPercent}%`}} />
              </div>
              <p style={styles.progressText}>
                {completedQuestions.length} / {PSC_EXAM_QUESTIONS.length} questions complétées
              </p>
            </div>
          )}

          <div style={styles.modeButtons}>
            {/* Show continue button if there's progress */}
            {hasProgress && progressLoaded && (
              <button style={{...styles.modeButton, ...styles.continueButton}} onClick={startExam}>
                <span style={styles.modeIcon}>▶️</span>
                <span style={styles.modeTitle}>Continuer</span>
                <span style={styles.modeDesc}>Question {examQuestionIndex + 1} / {PSC_EXAM_QUESTIONS.length}</span>
              </button>
            )}

            <button style={styles.modeButton} onClick={() => {
              if (hasProgress) {
                if (confirm('Voulez-vous vraiment recommencer? Votre progression sera perdue.')) {
                  restartExam()
                }
              } else {
                startExam()
              }
            }}>
              <span style={styles.modeIcon}>🎤</span>
              <span style={styles.modeTitle}>{hasProgress ? 'Recommencer' : 'Examen simulé'}</span>
              <span style={styles.modeDesc}>{hasProgress ? 'Réinitialiser la progression' : '40 questions progressives'}</span>
            </button>

            <button style={{...styles.modeButton, ...styles.tutorButton}} onClick={startTutor}>
              <span style={styles.modeIcon}>🤖</span>
              <span style={styles.modeTitle}>Tuteur IA</span>
              <span style={styles.modeDesc}>Posez vos questions</span>
            </button>
          </div>

          <p style={styles.startNote}>
            {hasProgress ? 'Continuez où vous vous êtes arrêté' : 'Choisissez un mode pour commencer'}
          </p>
        </div>
      </main>
    )
  }

  // AI Tutor chat mode
  if (appMode === 'tutor') {
    return (
      <main style={styles.main}>
        <header style={styles.header}>
          <button style={styles.backButton} onClick={goHome}>
            ← Retour
          </button>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>Tuteur IA Français</h1>
            <p style={styles.subtitle}>Posez vos questions sur le français</p>
          </div>
          <button style={styles.resetButton} onClick={resetChat}>
            🔄 Nouvelle conversation
          </button>
        </header>

        <div style={styles.chatContainer}>
          <div style={styles.chatMessages}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.chatMessage,
                  ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                }}
              >
                <div style={styles.messageContent}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} style={styles.messageLine}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div style={{...styles.chatMessage, ...styles.assistantMessage}}>
                <div style={styles.typingIndicator}>
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.chatInputContainer}>
            {isListening && (
              <div style={styles.voiceTranscript}>
                <p>{transcript || "Écoute en cours..."}</p>
              </div>
            )}

            <div style={styles.chatInputRow}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Tapez votre question en français..."
                style={styles.chatInput}
                disabled={isChatLoading || isListening}
              />

              {!isListening ? (
                <>
                  <button
                    style={styles.voiceButton}
                    onClick={startVoiceChat}
                    disabled={isChatLoading}
                    title="Parler"
                  >
                    🎤
                  </button>
                  <button
                    style={styles.sendButton}
                    onClick={() => sendChatMessage()}
                    disabled={isChatLoading || !chatInput.trim()}
                  >
                    Envoyer
                  </button>
                </>
              ) : (
                <button
                  style={styles.sendVoiceButton}
                  onClick={sendVoiceMessage}
                >
                  ✓ Envoyer
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Exam mode (existing code)
  if (!examStarted) {
    return (
      <main style={styles.main}>
        <div style={styles.loading}>
          <p>Chargement...</p>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={goHome}>
          ← Retour
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Examen oral PSC</h1>
          <p style={styles.subtitle}>Niveau A2-B1</p>
        </div>
        <div style={styles.headerMeta}>
          <span style={styles.progress}>Question {examQuestionIndex + 1} / {totalQuestions}</span>
          <span style={styles.level}>Niveau: {currentQuestion.difficulty}</span>
        </div>
      </header>

      <div style={styles.content}>
        {/* Question Card - Text hidden until after response */}
        <div style={styles.questionCard}>
          <div style={styles.questionHeader}>
            <span style={styles.questionNumber}>Question {currentQuestion.id}</span>
            <span style={styles.questionTopic}>
              {currentQuestion.topic === 'introduction' && 'Introduction'}
              {currentQuestion.topic === 'explaining' && 'Explication'}
              {currentQuestion.topic === 'adaptation' && 'Adaptation au changement'}
              {currentQuestion.topic === 'conflict_management' && 'Gestion des conflits'}
              {currentQuestion.topic === 'policy_implementation' && 'Mise en œuvre des politiques'}
              {currentQuestion.topic === 'communication_leadership' && 'Communication et leadership'}
              {currentQuestion.topic === 'future_plans' && 'Plans futurs'}
            </span>
          </div>

          {/* Show question text only after answer is complete */}
          {answerComplete ? (
            <p style={styles.questionText}>{currentQuestion.question}</p>
          ) : (
            <div style={styles.hiddenQuestion}>
              <p style={styles.hiddenQuestionText}>Écoutez la question et répondez oralement</p>
              <p style={styles.hiddenQuestionNote}>Le texte de la question sera affiché après votre réponse</p>
            </div>
          )}

          <button
            style={{
              ...styles.listenButton,
              ...(isSpeaking ? styles.listenButtonActive : {})
            }}
            onClick={() => speakFrench(currentQuestion.question, currentQuestion.difficulty)}
            disabled={isSpeaking}
          >
            {isSpeaking ? '🔊 Lecture...' : (answerComplete ? '🔊 Réécouter la question' : '🔊 Écouter la question')}
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
        {answerComplete && (
          <div style={styles.feedbackContainer}>
            <h3 style={styles.feedbackTitle}>Rétroaction de l'examinateur</h3>

            <div style={styles.yourAnswer}>
              <h4 style={styles.sectionSubtitle}>Votre réponse:</h4>
              <p style={styles.yourAnswerText}>{transcript}</p>
            </div>

            {/* Grammar Tip Section */}
            {currentQuestion.grammarTip && (
              <div style={styles.grammarTipSection}>
                <h4 style={styles.sectionSubtitle}>📖 Conseil grammatical:</h4>
                <p style={styles.grammarTipText}>{currentQuestion.grammarTip}</p>
                <div style={styles.targetStructuresRow}>
                  {currentQuestion.targetStructures.map((struct, i) => (
                    <span key={i} style={styles.structureBadge}>{struct}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Example Answer Section */}
            {currentQuestion.exampleAnswer && (
              <div style={styles.exampleAnswerSection}>
                <h4 style={styles.sectionSubtitle}>💡 Exemple de réponse:</h4>
                <p style={styles.exampleAnswerText}>"{currentQuestion.exampleAnswer}"</p>
                <button
                  style={{...styles.listenButton, marginTop: '0.75rem'}}
                  onClick={() => speakFrench(currentQuestion.exampleAnswer, currentQuestion.difficulty)}
                  disabled={isSpeaking}
                >
                  {isSpeaking ? '🔊 Lecture...' : '🔊 Écouter l\'exemple'}
                </button>
              </div>
            )}

            {/* AI Analysis Loading */}
            {isAnalyzing && (
              <div style={styles.analyzingContainer}>
                <div style={styles.analyzingSpinner}></div>
                <p style={styles.analyzingText}>Analyse en cours par l'IA...</p>
              </div>
            )}

            {/* Pronunciation & Fluency Scores */}
            {aiAnalysis && (aiAnalysis.pronunciationScore || aiAnalysis.fluencyScore) && (
              <div style={styles.scoresSection}>
                <div style={styles.scoresGrid}>
                  {aiAnalysis.pronunciationScore && (
                    <div style={styles.scoreCard}>
                      <div style={styles.scoreCircle}>
                        <span style={styles.scoreNumber}>{aiAnalysis.pronunciationScore}</span>
                        <span style={styles.scoreMax}>/10</span>
                      </div>
                      <span style={styles.scoreLabel}>Prononciation</span>
                    </div>
                  )}
                  {aiAnalysis.fluencyScore && (
                    <div style={styles.scoreCard}>
                      <div style={styles.scoreCircle}>
                        <span style={styles.scoreNumber}>{aiAnalysis.fluencyScore}</span>
                        <span style={styles.scoreMax}>/10</span>
                      </div>
                      <span style={styles.scoreLabel}>Fluidité</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Pronunciation Corrections - Enhanced */}
            {aiAnalysis && aiAnalysis.pronunciationErrors && aiAnalysis.pronunciationErrors.length > 0 && (
              <div style={styles.pronunciationSection}>
                <h4 style={styles.sectionSubtitle}>🎯 Corrections de prononciation:</h4>
                {aiAnalysis.pronunciationErrors.map((error, i) => (
                  <div key={i} style={styles.pronunciationError}>
                    <div style={styles.pronunciationHeader}>
                      <div style={styles.pronunciationRow}>
                        <span style={styles.heardWord}>"{error.heard}"</span>
                        <span style={styles.arrow}>→</span>
                        <span style={styles.correctWord}>"{error.correction}"</span>
                      </div>
                      {error.soundType && (
                        <span style={styles.soundTypeBadge}>{error.soundType.replace('_', ' ')}</span>
                      )}
                    </div>
                    {error.phonetic && (
                      <div style={styles.ipaRow}>
                        <span style={styles.ipaLabel}>IPA:</span>
                        <span style={styles.ipaText}>[{error.phonetic}]</span>
                      </div>
                    )}
                    <p style={styles.pronunciationExplanation}>{error.explanation}</p>
                    {error.mouthPosition && (
                      <div style={styles.mouthPositionBox}>
                        <span style={styles.mouthIcon}>👄</span>
                        <span style={styles.mouthPositionText}>{error.mouthPosition}</span>
                      </div>
                    )}
                    {error.practiceWord && (
                      <div style={styles.practiceWordBox}>
                        <span style={styles.practiceLabel}>Pratiquez avec:</span>
                        <button
                          style={styles.practiceWordButton}
                          onClick={() => speakFrench(error.practiceWord, 'A2')}
                          disabled={isSpeaking}
                        >
                          🔊 "{error.practiceWord}"
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Phonetic Tips Section */}
            {aiAnalysis && aiAnalysis.phoneticTips && aiAnalysis.phoneticTips.length > 0 && (
              <div style={styles.phoneticTipsSection}>
                <h4 style={styles.sectionSubtitle}>📚 Guide de prononciation:</h4>
                {aiAnalysis.phoneticTips.map((tip, i) => (
                  <div key={i} style={styles.phoneticTipCard}>
                    <div style={styles.tipHeader}>
                      <span style={styles.tipSound}>{tip.sound}</span>
                      {tip.ipa && <span style={styles.tipIpa}>[{tip.ipa}]</span>}
                    </div>
                    <p style={styles.tipText}>{tip.tip}</p>
                    {tip.mouthGuide && (
                      <div style={styles.mouthGuideBox}>
                        <p style={styles.mouthGuideText}>{tip.mouthGuide}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* AI Grammar Errors */}
            {aiAnalysis && aiAnalysis.grammarErrors && aiAnalysis.grammarErrors.length > 0 && (
              <div style={styles.grammarSection}>
                <h4 style={styles.sectionSubtitle}>Corrections grammaticales:</h4>
                {aiAnalysis.grammarErrors.map((error, i) => (
                  <div key={i} style={styles.grammarError}>
                    <div style={styles.grammarRow}>
                      <span style={styles.errorText}>"{error.error}"</span>
                      <span style={styles.arrow}>→</span>
                      <span style={styles.correctionText}>"{error.correction}"</span>
                    </div>
                    <p style={styles.grammarRule}>{error.rule}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Basic Structure Analysis (fallback) */}
            {examFeedback && examFeedback.structureAnalysis && examFeedback.structureAnalysis.length > 0 && (
              <div style={styles.structureAnalysis}>
                <h4 style={styles.sectionSubtitle}>Structures grammaticales ciblées:</h4>
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
            )}

            {/* AI Overall Feedback */}
            {aiAnalysis && aiAnalysis.overallFeedback && (
              <div style={styles.aiFeedbackSection}>
                <h4 style={styles.sectionSubtitle}>Commentaire de l'examinateur:</h4>
                <p style={styles.aiFeedbackText}>{aiAnalysis.overallFeedback}</p>
              </div>
            )}

            {/* AI Improved Version */}
            {aiAnalysis && aiAnalysis.improvedVersion && (
              <div style={styles.improvedVersionSection}>
                <h4 style={styles.sectionSubtitle}>Version améliorée suggérée:</h4>
                <div style={styles.improvedVersionText}>
                  <p>{aiAnalysis.improvedVersion}</p>
                </div>
                <button
                  style={{...styles.listenButton, marginTop: '1rem'}}
                  onClick={() => speakFrench(aiAnalysis.improvedVersion, currentQuestion.difficulty)}
                  disabled={isSpeaking}
                >
                  {isSpeaking ? '🔊 Lecture...' : '🔊 Écouter la version améliorée'}
                </button>
              </div>
            )}

            {/* Vocabulary Suggestions */}
            {aiAnalysis && aiAnalysis.vocabularySuggestions && aiAnalysis.vocabularySuggestions.length > 0 && (
              <div style={styles.vocabularySection}>
                <h4 style={styles.sectionSubtitle}>Suggestions de vocabulaire:</h4>
                <ul style={styles.vocabularyList}>
                  {aiAnalysis.vocabularySuggestions.map((suggestion, i) => (
                    <li key={i} style={styles.vocabularyItem}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.navigation}>
              {examQuestionIndex < totalQuestions - 1 ? (
                <button style={styles.nextButton} onClick={nextExamQuestion} disabled={isAnalyzing}>
                  Question suivante →
                </button>
              ) : (
                <div style={styles.completionButtons}>
                  <button
                    style={styles.generateButton}
                    onClick={generateMoreQuestions}
                    disabled={isGeneratingQuestions || isAnalyzing}
                  >
                    {isGeneratingQuestions ? '⏳ Génération...' : '🤖 Générer 10 nouvelles questions'}
                  </button>
                  <button style={styles.completeButton} onClick={restartExam} disabled={isAnalyzing || isGeneratingQuestions}>
                    🔄 Recommencer l'examen
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          {allQuestions.map((q, i) => (
            <div
              key={i}
              style={{
                ...styles.progressDot,
                ...(completedQuestions.includes(q.id) ? styles.progressDotCompleted : {}),
                ...(i === examQuestionIndex ? styles.progressDotCurrent : {}),
                ...(q.isAiGenerated ? styles.progressDotAI : {})
              }}
              title={`Question ${i + 1}${q.isAiGenerated ? ' (IA)' : ''}`}
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
  // Progress section styles
  progressSection: {
    width: '100%',
    maxWidth: '320px',
    marginBottom: '2rem',
    padding: '1rem 1.5rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: '1.1rem',
    color: '#22c55e',
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #22c55e, #4ade80)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  continueButton: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    border: '2px solid rgba(255,255,255,0.3)',
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
  modeButtons: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modeButton: {
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '16px',
    padding: '1.5rem 2rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '160px',
    transition: 'all 0.2s',
  },
  tutorButton: {
    background: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  modeIcon: {
    fontSize: '2.5rem',
  },
  modeTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
  },
  modeDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
  },
  backButton: {
    position: 'absolute',
    left: '1rem',
    top: '1rem',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  resetButton: {
    position: 'absolute',
    right: '1rem',
    top: '1rem',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 120px)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  chatMessage: {
    maxWidth: '85%',
    padding: '1rem',
    borderRadius: '16px',
    lineHeight: '1.5',
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#3b82f6',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    background: 'white',
    color: '#1f2937',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
  },
  messageLine: {
    margin: '0 0 0.5rem 0',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '0.5rem',
  },
  chatInputContainer: {
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    background: 'white',
  },
  chatInputRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '24px',
    fontSize: '1rem',
    outline: 'none',
  },
  voiceButton: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  sendButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  sendVoiceButton: {
    background: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  voiceTranscript: {
    background: '#fef3c7',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#92400e',
  },
  header: {
    position: 'relative',
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
  // Hidden question styles
  hiddenQuestion: {
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(26, 42, 74, 0.08), rgba(26, 42, 74, 0.03))',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  hiddenQuestionText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.3rem',
    color: '#1a2a4a',
    marginBottom: '0.5rem',
  },
  hiddenQuestionNote: {
    fontSize: '0.9rem',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  // AI Analysis styles
  analyzingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    gap: '1rem',
  },
  analyzingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  analyzingText: {
    color: '#6B7280',
    fontSize: '1rem',
  },
  // Pronunciation correction styles
  pronunciationSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(239, 68, 68, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  pronunciationError: {
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
  },
  pronunciationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '0.25rem',
  },
  heardWord: {
    color: '#dc2626',
    fontWeight: '600',
    textDecoration: 'line-through',
  },
  arrow: {
    color: '#6B7280',
    fontSize: '1.2rem',
  },
  correctWord: {
    color: '#059669',
    fontWeight: '600',
  },
  pronunciationExplanation: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginTop: '0.25rem',
    fontStyle: 'italic',
  },
  // Grammar correction styles
  grammarSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(245, 158, 11, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
  grammarError: {
    marginBottom: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(245, 158, 11, 0.1)',
  },
  grammarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '0.25rem',
  },
  errorText: {
    color: '#d97706',
    fontWeight: '600',
  },
  correctionText: {
    color: '#059669',
    fontWeight: '600',
  },
  grammarRule: {
    fontSize: '0.85rem',
    color: '#6B7280',
    marginTop: '0.25rem',
    fontStyle: 'italic',
  },
  // AI Feedback styles
  aiFeedbackSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03))',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },
  aiFeedbackText: {
    fontSize: '1rem',
    color: '#1a2a4a',
    lineHeight: 1.6,
  },
  // Improved version styles
  improvedVersionSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(5, 150, 105, 0.03))',
    borderRadius: '12px',
    border: '1px solid rgba(5, 150, 105, 0.2)',
  },
  improvedVersionText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.05rem',
    color: '#1a2a4a',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  // Vocabulary styles
  vocabularySection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'rgba(201, 162, 39, 0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(201, 162, 39, 0.2)',
  },
  vocabularyList: {
    margin: 0,
    paddingLeft: '1.25rem',
  },
  vocabularyItem: {
    fontSize: '0.95rem',
    color: '#1a2a4a',
    marginBottom: '0.35rem',
    lineHeight: 1.5,
  },
  // Scores section styles
  scoresSection: {
    marginBottom: '1.5rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, rgba(26, 42, 74, 0.08), rgba(26, 42, 74, 0.03))',
    borderRadius: '16px',
    border: '1px solid rgba(26, 42, 74, 0.1)',
  },
  scoresGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  scoreCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'white',
    border: '4px solid #1a2a4a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(26, 42, 74, 0.15)',
  },
  scoreNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a2a4a',
    lineHeight: 1,
  },
  scoreMax: {
    fontSize: '0.75rem',
    color: '#6B7280',
  },
  scoreLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1a2a4a',
  },
  // Enhanced pronunciation styles
  pronunciationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  soundTypeBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    padding: '0.25rem 0.6rem',
    borderRadius: '12px',
    textTransform: 'uppercase',
  },
  ipaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  ipaLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#6B7280',
  },
  ipaText: {
    fontSize: '1.1rem',
    fontFamily: "'Times New Roman', serif",
    color: '#1a2a4a',
    fontWeight: '500',
  },
  mouthPositionBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    background: 'rgba(59, 130, 246, 0.08)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginTop: '0.5rem',
    border: '1px solid rgba(59, 130, 246, 0.15)',
  },
  mouthIcon: {
    fontSize: '1.25rem',
  },
  mouthPositionText: {
    fontSize: '0.85rem',
    color: '#1a2a4a',
    lineHeight: 1.5,
    flex: 1,
  },
  practiceWordBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
  },
  practiceLabel: {
    fontSize: '0.85rem',
    color: '#6B7280',
    fontWeight: '500',
  },
  practiceWordButton: {
    background: 'linear-gradient(135deg, #059669, #10B981)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
  },
  // Phonetic tips section styles
  phoneticTipsSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.03))',
    borderRadius: '12px',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  phoneticTipCard: {
    background: 'white',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '0.75rem',
    border: '1px solid rgba(139, 92, 246, 0.15)',
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  tipSound: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#7c3aed',
  },
  tipIpa: {
    fontSize: '1rem',
    fontFamily: "'Times New Roman', serif",
    color: '#1a2a4a',
    background: 'rgba(139, 92, 246, 0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
  },
  tipText: {
    fontSize: '0.9rem',
    color: '#1a2a4a',
    lineHeight: 1.6,
    marginBottom: '0.5rem',
  },
  mouthGuideBox: {
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.08))',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(251, 191, 36, 0.3)',
  },
  mouthGuideText: {
    fontSize: '0.85rem',
    color: '#1a2a4a',
    lineHeight: 1.6,
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  // Grammar tip styles
  grammarTipSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.25)',
  },
  grammarTipText: {
    fontSize: '0.95rem',
    color: '#1a2a4a',
    lineHeight: 1.6,
    marginBottom: '0.75rem',
  },
  targetStructuresRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  structureBadge: {
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#059669',
    padding: '0.25rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  // Example answer styles
  exampleAnswerSection: {
    marginBottom: '1.5rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))',
    borderRadius: '12px',
    border: '1px solid rgba(251, 191, 36, 0.25)',
  },
  exampleAnswerText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1rem',
    color: '#1a2a4a',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  // Generate button styles
  completionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  generateButton: {
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)',
  },
  // AI-generated question indicator
  progressDotAI: {
    background: '#8b5cf6',
    boxShadow: '0 0 4px rgba(139, 92, 246, 0.5)',
  },
}
