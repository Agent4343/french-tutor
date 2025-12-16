'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// CEFR Level Definitions based on Common European Framework of Reference
const CEFR_LEVELS = {
  A1: {
    name: 'A1 - Breakthrough',
    description: 'Can understand and use familiar everyday expressions and very basic phrases.',
    objectives: [
      'Introduce yourself and others',
      'Ask and answer questions about personal details',
      'Interact in a simple way when the other person speaks slowly'
    ],
    color: '#4CAF50'
  },
  A2: {
    name: 'A2 - Waystage',
    description: 'Can understand sentences and frequently used expressions related to areas of immediate relevance.',
    objectives: [
      'Communicate in simple, routine tasks',
      'Describe aspects of your background and environment',
      'Handle basic social interactions'
    ],
    color: '#8BC34A'
  },
  B1: {
    name: 'B1 - Threshold',
    description: 'Can deal with most situations likely to arise while travelling in a French-speaking area.',
    objectives: [
      'Describe experiences, events, dreams and ambitions',
      'Give reasons and explanations for opinions',
      'Produce connected text on familiar topics'
    ],
    color: '#FFC107'
  },
  B2: {
    name: 'B2 - Vantage',
    description: 'Can interact with a degree of fluency and spontaneity with native speakers.',
    objectives: [
      'Produce clear, detailed text on a wide range of subjects',
      'Explain a viewpoint giving advantages and disadvantages',
      'Understand the main ideas of complex text'
    ],
    color: '#FF9800'
  }
}

// French pronunciation rules with enhanced pedagogical content
const PRONUNCIATION_RULES = {
  silent_endings: {
    pattern: /([dtsxzp])$/i,
    rule: "Final consonants (d, t, s, x, z, p) are usually silent in French",
    examples: ["petit", "beaucoup", "temps"],
    ipa: "Silent final consonants",
    mouthPosition: "Close your mouth naturally at the end - don't release the final consonant",
    commonMistake: "English speakers often pronounce the final consonant"
  },
  nasal_an: {
    pattern: /an|en|am|em/gi,
    rule: "AN/EN sounds like a nasal 'ah' - don't pronounce the 'n'",
    examples: ["enfant", "pendant", "temps"],
    ipa: "/ɑ̃/",
    mouthPosition: "Open mouth wide, lower jaw, air flows through nose",
    commonMistake: "Pronouncing the 'n' sound at the end"
  },
  nasal_on: {
    pattern: /on|om/gi,
    rule: "ON sounds like a nasal 'oh' - keep your mouth rounded",
    examples: ["bon", "maison", "nom"],
    ipa: "/ɔ̃/",
    mouthPosition: "Round lips like saying 'oh', push air through nose",
    commonMistake: "Not rounding lips enough or pronouncing the 'n'"
  },
  nasal_in: {
    pattern: /in|im|ain|ein|un/gi,
    rule: "IN/AIN sounds like a nasal 'ah' with lips spread",
    examples: ["vin", "pain", "jardin"],
    ipa: "/ɛ̃/",
    mouthPosition: "Spread lips as if smiling, push air through nose",
    commonMistake: "Pronouncing it like English 'in' or 'an'"
  },
  french_r: {
    pattern: /r/gi,
    rule: "French 'R' is pronounced in the throat, like a soft gargle",
    examples: ["rouge", "partir", "merci"],
    ipa: "/ʁ/",
    mouthPosition: "Back of tongue rises toward soft palate, slight friction in throat",
    commonMistake: "Using the English 'r' sound (tongue tip curled)"
  },
  french_u: {
    pattern: /(?<![o])u(?!i)/gi,
    rule: "French 'U' is pronounced with very rounded, pursed lips - different from English 'oo'",
    examples: ["tu", "du", "rue"],
    ipa: "/y/",
    mouthPosition: "Purse lips tightly as if whistling, tongue forward like saying 'ee'",
    commonMistake: "Saying 'oo' instead - keep tongue forward!"
  },
  liaison: {
    pattern: /s\s+[aeiouéèêëàâîïôûù]/gi,
    rule: "Liaison: the final 's' connects to the next word starting with a vowel, pronounced as 'z'",
    examples: ["les amis", "nous avons", "très important"],
    ipa: "Final consonant + vowel = liaison",
    mouthPosition: "Smoothly connect words without pausing",
    commonMistake: "Pausing between words or skipping the liaison"
  },
  eu_sound: {
    pattern: /eu|œu/gi,
    rule: "EU sounds like 'uh' with rounded lips - no English equivalent",
    examples: ["deux", "bleu", "heureux"],
    ipa: "/ø/ or /œ/",
    mouthPosition: "Round lips like 'oh' but say 'eh' - lips and tongue in different positions",
    commonMistake: "Saying 'oo' or 'uh' without rounding lips"
  },
  oi_sound: {
    pattern: /oi/gi,
    rule: "OI is pronounced 'wa'",
    examples: ["moi", "trois", "boire"],
    ipa: "/wa/",
    mouthPosition: "Start with rounded 'w', quickly move to open 'ah'",
    commonMistake: "Saying 'oy' like in English 'boy'"
  }
}

// Lesson content organized by CEFR level with cultural context and grammar notes
const LESSONS = {
  A1: [
    {
      id: 'greetings',
      title: 'Les Salutations',
      subtitle: 'Greetings',
      culturalNote: 'In France, greetings are very important. Always greet shopkeepers when entering a store with "Bonjour" - it\'s considered rude not to. The French also kiss on the cheeks (la bise) when greeting friends and family.',
      grammarFocus: 'Formal vs. informal: Use "vous" with strangers and elders, "tu" with friends and children.',
      phrases: [
        { french: 'Bonjour', english: 'Hello / Good day', phonetic: 'bohn-ZHOOR', ipa: '/bɔ̃.ʒuʁ/', difficulty: 1 },
        { french: 'Bonsoir', english: 'Good evening', phonetic: 'bohn-SWAHR', ipa: '/bɔ̃.swaʁ/', difficulty: 1 },
        { french: 'Au revoir', english: 'Goodbye', phonetic: 'oh ruh-VWAHR', ipa: '/o ʁə.vwaʁ/', difficulty: 2 },
        { french: 'Merci beaucoup', english: 'Thank you very much', phonetic: 'mehr-SEE boh-KOO', ipa: '/mɛʁ.si bo.ku/', difficulty: 2 },
        { french: "S'il vous plaît", english: 'Please (formal)', phonetic: 'seel voo PLEH', ipa: '/sil vu plɛ/', difficulty: 2 },
        { french: 'Comment allez-vous?', english: 'How are you? (formal)', phonetic: 'koh-mahn tah-lay VOO', ipa: '/kɔ.mɑ̃ ta.le vu/', difficulty: 3 },
      ]
    },
    {
      id: 'introductions',
      title: 'Se Présenter',
      subtitle: 'Introducing Yourself',
      culturalNote: 'The French value formality in introductions. When meeting someone professionally, always use their title (Monsieur, Madame) until invited to use first names.',
      grammarFocus: 'Reflexive verbs: "Je m\'appelle" literally means "I call myself" - the verb is "s\'appeler".',
      phrases: [
        { french: "Je m'appelle...", english: 'My name is...', phonetic: 'zhuh mah-PEL', ipa: '/ʒə ma.pɛl/', difficulty: 2 },
        { french: 'Je suis américain(e)', english: 'I am American', phonetic: 'zhuh swee ah-may-ree-KAHN', ipa: '/ʒə sɥi a.me.ʁi.kɛ̃/', difficulty: 2 },
        { french: "J'habite à...", english: 'I live in...', phonetic: 'zhah-BEET ah', ipa: '/ʒa.bit a/', difficulty: 2 },
        { french: 'Enchanté(e)', english: 'Nice to meet you', phonetic: 'ahn-shahn-TAY', ipa: '/ɑ̃.ʃɑ̃.te/', difficulty: 2 },
        { french: "J'ai ... ans", english: 'I am ... years old', phonetic: 'zhay ... ahn', ipa: '/ʒe ... ɑ̃/', difficulty: 2 },
      ]
    },
    {
      id: 'numbers',
      title: 'Les Nombres',
      subtitle: 'Numbers 1-10',
      culturalNote: 'French numbers get interesting after 69: 70 is "soixante-dix" (60+10), 80 is "quatre-vingts" (4×20), and 90 is "quatre-vingt-dix" (4×20+10)!',
      grammarFocus: 'Numbers are essential for shopping, telling time, and exchanging phone numbers.',
      phrases: [
        { french: 'un', english: 'one', phonetic: 'uhn', ipa: '/œ̃/', difficulty: 1 },
        { french: 'deux', english: 'two', phonetic: 'duh', ipa: '/dø/', difficulty: 1 },
        { french: 'trois', english: 'three', phonetic: 'twah', ipa: '/tʁwa/', difficulty: 2 },
        { french: 'quatre', english: 'four', phonetic: 'KAH-truh', ipa: '/katʁ/', difficulty: 2 },
        { french: 'cinq', english: 'five', phonetic: 'sank', ipa: '/sɛ̃k/', difficulty: 1 },
        { french: 'six', english: 'six', phonetic: 'sees', ipa: '/sis/', difficulty: 1 },
        { french: 'sept', english: 'seven', phonetic: 'set', ipa: '/sɛt/', difficulty: 1 },
        { french: 'huit', english: 'eight', phonetic: 'weet', ipa: '/ɥit/', difficulty: 2 },
        { french: 'neuf', english: 'nine', phonetic: 'nuhf', ipa: '/nœf/', difficulty: 2 },
        { french: 'dix', english: 'ten', phonetic: 'dees', ipa: '/dis/', difficulty: 1 },
      ]
    }
  ],
  A2: [
    {
      id: 'restaurant',
      title: 'Au Restaurant',
      subtitle: 'At the Restaurant',
      culturalNote: 'French dining is an experience to savor. Meals can last 2+ hours. The server won\'t bring the check until you ask - it\'s considered rude to rush diners. Say "L\'addition, s\'il vous plaît" when ready.',
      grammarFocus: 'Conditional tense: "Je voudrais" (I would like) is more polite than "Je veux" (I want).',
      phrases: [
        { french: "Je voudrais réserver une table", english: 'I would like to reserve a table', phonetic: 'zhuh voo-DREH ray-zehr-VAY oon TAH-bluh', ipa: '/ʒə vu.dʁɛ ʁe.zɛʁ.ve yn tabl/', difficulty: 3 },
        { french: "L'addition, s'il vous plaît", english: 'The check, please', phonetic: 'lah-dee-SYOHN seel voo PLEH', ipa: '/la.di.sjɔ̃ sil vu plɛ/', difficulty: 2 },
        { french: "Qu'est-ce que vous recommandez?", english: 'What do you recommend?', phonetic: 'kehs kuh voo ruh-koh-mahn-DAY', ipa: '/kɛs kə vu ʁə.kɔ.mɑ̃.de/', difficulty: 3 },
        { french: "Je suis allergique à...", english: 'I am allergic to...', phonetic: 'zhuh swee ah-lehr-ZHEEK ah', ipa: '/ʒə sɥi a.lɛʁ.ʒik a/', difficulty: 2 },
        { french: "C'était délicieux", english: 'It was delicious', phonetic: 'say-TEH day-lee-SYUH', ipa: '/se.tɛ de.li.sjø/', difficulty: 2 },
      ]
    },
    {
      id: 'directions',
      title: 'Les Directions',
      subtitle: 'Asking for Directions',
      culturalNote: 'French cities are often organized around a central square (place) or main street (rue principale). Many streets are named after historical figures or dates.',
      grammarFocus: 'Imperative mood: "Tournez" and "Allez" are commands. The formal imperative uses the "vous" form.',
      phrases: [
        { french: 'Où est la gare?', english: 'Where is the train station?', phonetic: 'oo eh lah GAHR', ipa: '/u ɛ la ɡaʁ/', difficulty: 2 },
        { french: 'Tournez à gauche', english: 'Turn left', phonetic: 'toor-NAY ah GOHSH', ipa: '/tuʁ.ne a ɡoʃ/', difficulty: 2 },
        { french: 'Tournez à droite', english: 'Turn right', phonetic: 'toor-NAY ah DRWAHT', ipa: '/tuʁ.ne a dʁwat/', difficulty: 2 },
        { french: 'Allez tout droit', english: 'Go straight', phonetic: 'ah-LAY too DRWAH', ipa: '/a.le tu dʁwa/', difficulty: 2 },
        { french: "C'est à côté de...", english: 'It is next to...', phonetic: 'seh tah koh-TAY duh', ipa: '/sɛ ta ko.te də/', difficulty: 2 },
      ]
    },
    {
      id: 'shopping',
      title: 'Faire les Courses',
      subtitle: 'Shopping',
      culturalNote: 'Many French people shop daily at local markets and specialty shops (boulangerie for bread, boucherie for meat, fromagerie for cheese) rather than supermarkets.',
      grammarFocus: 'Partitive articles: "du" (some, masc.), "de la" (some, fem.), "des" (some, plural) are used when talking about unspecified quantities.',
      phrases: [
        { french: "Je voudrais du pain", english: 'I would like some bread', phonetic: 'zhuh voo-DREH doo PAN', ipa: '/ʒə vu.dʁɛ dy pɛ̃/', difficulty: 2 },
        { french: "Combien ça coûte?", english: 'How much does it cost?', phonetic: 'kohm-BYEN sah KOOT', ipa: '/kɔ̃.bjɛ̃ sa kut/', difficulty: 2 },
        { french: "C'est trop cher", english: "It's too expensive", phonetic: 'seh troh SHEHR', ipa: '/sɛ tʁo ʃɛʁ/', difficulty: 2 },
        { french: "Je peux payer par carte?", english: 'Can I pay by card?', phonetic: 'zhuh puh pay-YAY par KART', ipa: '/ʒə pø pe.je paʁ kaʁt/', difficulty: 3 },
        { french: "Un sac, s'il vous plaît", english: 'A bag, please', phonetic: 'uhn SAK seel voo PLEH', ipa: '/œ̃ sak sil vu plɛ/', difficulty: 1 },
      ]
    }
  ],
  B1: [
    {
      id: 'opinions',
      title: 'Exprimer son Opinion',
      subtitle: 'Expressing Opinions',
      culturalNote: 'The French love debate and discussion. Don\'t be surprised if conversations become animated - it\'s a form of intellectual engagement, not conflict.',
      grammarFocus: 'Subjunctive mood: After expressions of opinion like "Je ne pense pas que...", use the subjunctive.',
      phrases: [
        { french: 'Je pense que...', english: 'I think that...', phonetic: 'zhuh PAHNS kuh', ipa: '/ʒə pɑ̃s kə/', difficulty: 2 },
        { french: 'À mon avis...', english: 'In my opinion...', phonetic: 'ah mohn ah-VEE', ipa: '/a mɔ̃n a.vi/', difficulty: 2 },
        { french: "Je suis d'accord", english: 'I agree', phonetic: 'zhuh swee dah-KOHR', ipa: '/ʒə sɥi da.kɔʁ/', difficulty: 2 },
        { french: "Je ne suis pas d'accord", english: 'I disagree', phonetic: 'zhuh nuh swee pah dah-KOHR', ipa: '/ʒə nə sɥi pa da.kɔʁ/', difficulty: 3 },
        { french: "Il me semble que...", english: 'It seems to me that...', phonetic: 'eel muh SAHM-bluh kuh', ipa: '/il mə sɑ̃bl kə/', difficulty: 3 },
      ]
    },
    {
      id: 'travel',
      title: 'Voyager',
      subtitle: 'Travel Conversations',
      culturalNote: 'France has an excellent train system (SNCF/TGV). Validate your ticket before boarding regional trains! The Paris Métro is one of the densest subway networks in the world.',
      grammarFocus: 'Future tense: "Je vais + infinitive" (near future) vs "Je ferai" (simple future).',
      phrases: [
        { french: "À quelle heure part le train?", english: 'What time does the train leave?', phonetic: 'ah kehl UHR par luh TRAN', ipa: '/a kɛl œʁ paʁ lə tʁɛ̃/', difficulty: 3 },
        { french: "Je voudrais un aller-retour", english: 'I would like a round-trip ticket', phonetic: 'zhuh voo-DREH uhn ah-LAY ruh-TOOR', ipa: '/ʒə vu.dʁɛ œ̃n a.le ʁə.tuʁ/', difficulty: 3 },
        { french: "Le vol est retardé", english: 'The flight is delayed', phonetic: 'luh VOL eh ruh-tar-DAY', ipa: '/lə vɔl ɛ ʁə.taʁ.de/', difficulty: 2 },
        { french: "Où sont les toilettes?", english: 'Where are the restrooms?', phonetic: 'oo sohn lay twah-LET', ipa: '/u sɔ̃ le twa.lɛt/', difficulty: 2 },
        { french: "Pouvez-vous m'aider?", english: 'Can you help me?', phonetic: 'poo-vay VOO meh-DAY', ipa: '/pu.ve vu me.de/', difficulty: 3 },
      ]
    }
  ],
  B2: [
    {
      id: 'workplace',
      title: 'Au Travail',
      subtitle: 'Professional French',
      culturalNote: 'French workplace culture values work-life balance. The 35-hour work week is standard, and August is traditionally vacation month when many businesses close.',
      grammarFocus: 'Formal register: Professional French uses "vous" exclusively and often employs the conditional for politeness.',
      phrases: [
        { french: "Je vous envoie le dossier", english: "I'm sending you the file", phonetic: 'zhuh vooz ahn-VWAH luh doh-SYAY', ipa: '/ʒə vuz ɑ̃.vwa lə dɔ.sje/', difficulty: 3 },
        { french: "Pourriez-vous me rappeler?", english: 'Could you call me back?', phonetic: 'poo-ree-ay VOO muh rah-PLAY', ipa: '/pu.ʁje vu mə ʁa.ple/', difficulty: 4 },
        { french: "J'ai une réunion à 14h", english: 'I have a meeting at 2pm', phonetic: 'zhay oon ray-oo-NYON ah kah-TORZ uhr', ipa: '/ʒe yn ʁe.y.njɔ̃ a ka.tɔʁz œʁ/', difficulty: 3 },
        { french: "Veuillez trouver ci-joint...", english: 'Please find attached...', phonetic: 'vuh-YAY troo-VAY see-ZHWAN', ipa: '/vœ.je tʁu.ve si.ʒwɛ̃/', difficulty: 4 },
        { french: "Je serai absent demain", english: 'I will be absent tomorrow', phonetic: 'zhuh suh-RAY ab-SAHN duh-MAN', ipa: '/ʒə sə.ʁe ap.sɑ̃ də.mɛ̃/', difficulty: 3 },
      ]
    },
    {
      id: 'current_events',
      title: "L'Actualité",
      subtitle: 'Discussing Current Events',
      culturalNote: 'The French are politically engaged. Discussing politics, philosophy, and social issues is common even among strangers. Major newspapers include Le Monde, Le Figaro, and Libération.',
      grammarFocus: 'Passive voice and reported speech are common in news and formal discussions.',
      phrases: [
        { french: "Selon les dernières informations...", english: 'According to the latest news...', phonetic: 'suh-LOHN lay dehr-NYEHR an-for-mah-SYOHN', ipa: '/sə.lɔ̃ le dɛʁ.njɛʁ ɛ̃.fɔʁ.ma.sjɔ̃/', difficulty: 4 },
        { french: "Qu'en pensez-vous?", english: 'What do you think about it?', phonetic: 'kahn pahn-SAY VOO', ipa: '/kɑ̃ pɑ̃.se vu/', difficulty: 3 },
        { french: "C'est une question complexe", english: "It's a complex issue", phonetic: 'seh toon kehs-TYOHN kohm-PLEKS', ipa: '/sɛ tyn kɛs.tjɔ̃ kɔ̃.plɛks/', difficulty: 3 },
        { french: "D'un côté... de l'autre...", english: 'On one hand... on the other...', phonetic: 'duhn koh-TAY... duh LOH-truh', ipa: '/dœ̃ ko.te də lotʁ/', difficulty: 3 },
        { french: "Il faudrait que...", english: 'It would be necessary to...', phonetic: 'eel foh-DREH kuh', ipa: '/il fo.dʁɛ kə/', difficulty: 4 },
      ]
    }
  ]
}

// Conversation scenarios for practice with CEFR levels
const CONVERSATIONS = [
  {
    id: 'cafe',
    title: 'Au Café',
    description: 'Order coffee and pastries at a Parisian café',
    cefrLevel: 'A1',
    starter: "Bonjour! Bienvenue au Café de Flore. Qu'est-ce que je vous sers?",
    context: "You are at a famous Parisian café. The waiter greets you warmly.",
    culturalTip: "French cafés are social institutions. It's acceptable to sit for hours with just one coffee. Café culture in Paris dates back to the 17th century.",
    suggestions: [
      "Je voudrais un café crème, s'il vous plaît",
      "Qu'est-ce que vous avez comme pâtisseries?",
      "Un croissant et un café noir, s'il vous plaît"
    ]
  },
  {
    id: 'metro',
    title: 'Dans le Métro',
    description: 'Ask for directions on the Paris metro',
    cefrLevel: 'A2',
    starter: "Excusez-moi, vous avez besoin d'aide?",
    context: "You look lost at a metro station. A friendly Parisian offers help.",
    culturalTip: "Parisians may seem reserved, but many are happy to help tourists. The Paris Métro opened in 1900 and now has 16 lines serving 302 stations.",
    suggestions: [
      "Oui, je cherche la station Châtelet",
      "Comment puis-je aller à la Tour Eiffel?",
      "Quelle ligne dois-je prendre?"
    ]
  },
  {
    id: 'shopping',
    title: 'Faire du Shopping',
    description: 'Shop for clothes at a boutique',
    cefrLevel: 'A2',
    starter: "Bonjour! Je peux vous aider à trouver quelque chose?",
    context: "You're browsing in a chic Parisian boutique.",
    culturalTip: "French boutiques offer personalized service. Sales associates expect to help you - browsing silently may be seen as rude. Always greet with 'Bonjour' when entering.",
    suggestions: [
      "Je cherche une robe pour une occasion spéciale",
      "Est-ce que vous avez cela en bleu?",
      "Je peux essayer cette taille?"
    ]
  },
  {
    id: 'doctor',
    title: 'Chez le Médecin',
    description: 'Describe symptoms and understand medical advice',
    cefrLevel: 'B1',
    starter: "Bonjour, qu'est-ce qui vous amène aujourd'hui?",
    context: "You're visiting a French doctor because you're not feeling well.",
    culturalTip: "France has an excellent healthcare system. Pharmacists (pharmaciens) can provide basic medical advice and some medications without a prescription.",
    suggestions: [
      "J'ai mal à la tête depuis deux jours",
      "Je tousse et j'ai de la fièvre",
      "Je me sens très fatigué(e)"
    ]
  },
  {
    id: 'job_interview',
    title: "L'Entretien d'Embauche",
    description: 'Navigate a professional job interview',
    cefrLevel: 'B2',
    starter: "Bonjour, merci d'avoir postulé. Pouvez-vous vous présenter?",
    context: "You're interviewing for a position at a French company.",
    culturalTip: "French interviews are formal. Use 'vous' throughout, arrive exactly on time (not early), and be prepared to discuss your educational background in detail - French employers value diplomas.",
    suggestions: [
      "J'ai cinq ans d'expérience dans ce domaine",
      "Ce qui m'attire dans ce poste, c'est...",
      "Je suis disponible immédiatement"
    ]
  }
]

// Spaced repetition intervals (in hours)
const SRS_INTERVALS = [1, 6, 24, 72, 168, 336, 720] // 1h, 6h, 1d, 3d, 1w, 2w, 1m

export default function FrenchTutor() {
  const [mode, setMode] = useState('home') // home, lessons, practice, conversation, progress
  const [selectedLevel, setSelectedLevel] = useState('A1')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [conversationHistory, setConversationHistory] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showPhonetic, setShowPhonetic] = useState(true)
  const [showIPA, setShowIPA] = useState(false)
  const [showCultural, setShowCultural] = useState(true)
  const [showGrammar, setShowGrammar] = useState(true)
  const [practiceStats, setPracticeStats] = useState({ attempts: 0, good: 0, excellent: 0 })

  // Spaced repetition tracking - stored per phrase
  const [srsData, setSrsData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('frenchTutor_srs')
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })

  // Overall progress tracking
  const [progressData, setProgressData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('frenchTutor_progress')
      return saved ? JSON.parse(saved) : {
        phrasesLearned: 0,
        totalPracticeTime: 0,
        streakDays: 0,
        lastPracticeDate: null,
        levelProgress: { A1: 0, A2: 0, B1: 0, B2: 0 }
      }
    }
    return {
      phrasesLearned: 0,
      totalPracticeTime: 0,
      streakDays: 0,
      lastPracticeDate: null,
      levelProgress: { A1: 0, A2: 0, B1: 0, B2: 0 }
    }
  })
  
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const analyzePronunciationRef = useRef(null)

  // Persist SRS and progress data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('frenchTutor_srs', JSON.stringify(srsData))
    }
  }, [srsData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('frenchTutor_progress', JSON.stringify(progressData))
    }
  }, [progressData])

  // Update SRS data for a phrase based on performance
  const updateSRS = useCallback((phraseId, score) => {
    setSrsData(prev => {
      const existing = prev[phraseId] || { level: 0, nextReview: Date.now(), lastScore: 0 }
      let newLevel = existing.level

      if (score >= 90) {
        newLevel = Math.min(existing.level + 1, SRS_INTERVALS.length - 1)
      } else if (score < 50) {
        newLevel = Math.max(existing.level - 1, 0)
      }

      const intervalHours = SRS_INTERVALS[newLevel]
      const nextReview = Date.now() + (intervalHours * 60 * 60 * 1000)

      return {
        ...prev,
        [phraseId]: {
          level: newLevel,
          nextReview,
          lastScore: score,
          lastPracticed: Date.now()
        }
      }
    })
  }, [])

  // Get phrases due for review
  const getPhrasesForReview = useCallback(() => {
    const now = Date.now()
    const dueForReview = []

    Object.entries(LESSONS).forEach(([level, lessons]) => {
      lessons.forEach(lesson => {
        lesson.phrases.forEach(phrase => {
          const phraseId = `${level}_${lesson.id}_${phrase.french}`
          const srsInfo = srsData[phraseId]
          if (srsInfo && srsInfo.nextReview <= now) {
            dueForReview.push({ ...phrase, level, lessonId: lesson.id, phraseId, srsInfo })
          }
        })
      })
    })

    return dueForReview.sort((a, b) => a.srsInfo.nextReview - b.srsInfo.nextReview)
  }, [srsData])

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'fr-FR'

        recognitionRef.current.onresult = (event) => {
          const current = event.resultIndex
          const result = event.results[current]
          const transcriptText = result[0].transcript
          setTranscript(transcriptText)

          if (result.isFinal) {
            // Use ref to call the latest version of analyzePronunciation
            // to avoid stale closure issues
            analyzePronunciationRef.current?.(transcriptText)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          if (event.error === 'no-speech') {
            setFeedback({
              type: 'info',
              message: "I didn't hear anything. Try speaking closer to the microphone.",
              tips: []
            })
          }
        }
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setFeedback(null)
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
      
      // Try to get a French voice
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

  const analyzePronunciation = useCallback((spokenText) => {
    if (!selectedLesson && !selectedConversation) return

    const targetPhrase = selectedLesson
      ? selectedLesson.phrases[currentPhraseIndex].french
      : null

    const normalizedSpoken = spokenText.toLowerCase().trim()
    const normalizedTarget = targetPhrase?.toLowerCase().trim()

    // Calculate similarity score
    let score = 0
    let tips = []

    if (targetPhrase) {
      // Word-level comparison
      const spokenWords = normalizedSpoken.split(/\s+/)
      const targetWords = normalizedTarget.split(/\s+/)

      let matchedWords = 0
      targetWords.forEach((word, i) => {
        if (spokenWords[i] && (
          spokenWords[i] === word ||
          levenshteinDistance(spokenWords[i], word) <= Math.max(1, word.length * 0.3)
        )) {
          matchedWords++
        }
      })

      score = Math.round((matchedWords / targetWords.length) * 100)

      // Check for common pronunciation issues with enhanced guidance
      Object.entries(PRONUNCIATION_RULES).forEach(([key, rule]) => {
        if (rule.pattern.test(targetPhrase)) {
          tips.push({
            rule: rule.rule,
            examples: rule.examples,
            ipa: rule.ipa,
            mouthPosition: rule.mouthPosition,
            commonMistake: rule.commonMistake
          })
        }
      })

      // Update SRS data for this phrase
      const phraseId = `${selectedLevel}_${selectedLesson?.id}_${targetPhrase}`
      updateSRS(phraseId, score)

      // Update stats
      setPracticeStats(prev => ({
        attempts: prev.attempts + 1,
        good: score >= 70 ? prev.good + 1 : prev.good,
        excellent: score >= 90 ? prev.excellent + 1 : prev.excellent
      }))
    }

    // Generate feedback
    let feedbackType = 'poor'
    let message = ''

    if (score >= 90) {
      feedbackType = 'excellent'
      message = "Excellent! Très bien! 🎉"
    } else if (score >= 70) {
      feedbackType = 'good'
      message = "Good job! Bon travail! Keep practicing."
    } else if (score >= 50) {
      feedbackType = 'fair'
      message = "Getting there! Let's try again."
    } else {
      feedbackType = 'poor'
      message = "Let's practice this one more. Listen and try again."
    }

    setFeedback({
      type: feedbackType,
      score,
      message,
      spoken: spokenText,
      target: targetPhrase,
      tips: tips.slice(0, 2) // Show max 2 tips
    })
  }, [selectedLesson, selectedConversation, currentPhraseIndex, selectedLevel, updateSRS])

  // Keep the ref updated with the latest analyzePronunciation function
  useEffect(() => {
    analyzePronunciationRef.current = analyzePronunciation
  }, [analyzePronunciation])

  // Levenshtein distance for fuzzy matching
  const levenshteinDistance = (a, b) => {
    const matrix = []
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[b.length][a.length]
  }

  const handleConversationResponse = async (userMessage) => {
    if (!selectedConversation || isProcessing) return
    
    setIsProcessing(true)
    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }]
    setConversationHistory(newHistory)
    
    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const responses = {
        cafe: [
          "Très bon choix! Un café crème, ça marche. Et avec ceci?",
          "Nous avons des croissants frais, des pains au chocolat, et une excellente tarte aux pommes.",
          "Voilà votre commande. Bon appétit!"
        ],
        metro: [
          "Pour Châtelet, prenez la ligne 4 direction Porte de Clignancourt.",
          "Pour la Tour Eiffel, descendez à Trocadéro sur la ligne 9.",
          "C'est direct, environ 15 minutes."
        ],
        shopping: [
          "Bien sûr! Nous avons plusieurs robes élégantes. Quelle couleur préférez-vous?",
          "Oui, nous l'avons en bleu marine et en bleu ciel.",
          "Bien sûr, les cabines d'essayage sont au fond à droite."
        ]
      }
      
      const responseOptions = responses[selectedConversation.id] || ["Je vous écoute..."]
      const randomResponse = responseOptions[Math.min(newHistory.filter(m => m.role === 'assistant').length, responseOptions.length - 1)]
      
      setConversationHistory([...newHistory, { role: 'assistant', content: randomResponse }])
      speakFrench(randomResponse)
      setIsProcessing(false)
    }, 1000)
  }

  const nextPhrase = () => {
    if (selectedLesson && currentPhraseIndex < selectedLesson.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1)
      setTranscript('')
      setFeedback(null)
    }
  }

  const prevPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1)
      setTranscript('')
      setFeedback(null)
    }
  }

  const resetLesson = () => {
    setCurrentPhraseIndex(0)
    setTranscript('')
    setFeedback(null)
    setPracticeStats({ attempts: 0, good: 0, excellent: 0 })
  }

  // Calculate review count for badge
  const reviewCount = getPhrasesForReview().length

  // Render different screens based on mode
  const renderHome = () => (
    <div style={styles.homeContainer}>
      <div style={styles.heroSection}>
        <div style={styles.heroDecoration}></div>
        <h1 style={styles.heroTitle}>Parlez</h1>
        <p style={styles.heroSubtitle}>Master French with CEFR-aligned learning</p>
        <p style={styles.heroDescription}>
          Professional French instruction using the Common European Framework.
          Practice pronunciation, learn grammar in context, and explore French culture.
        </p>
      </div>

      {/* CEFR Level Overview */}
      <div style={styles.cefrOverview}>
        <h3 style={styles.cefrTitle}>Your CEFR Progress</h3>
        <div style={styles.cefrLevels}>
          {Object.entries(CEFR_LEVELS).map(([level, info]) => (
            <div key={level} style={styles.cefrLevel}>
              <div style={{...styles.cefrBadge, background: info.color}}>{level}</div>
              <span style={styles.cefrName}>{info.name.split(' - ')[1]}</span>
              <div style={styles.cefrProgress}>
                <div style={{
                  ...styles.cefrProgressBar,
                  width: `${progressData.levelProgress[level] || 0}%`,
                  background: info.color
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.modeCards}>
        <button
          style={styles.modeCard}
          onClick={() => setMode('lessons')}
        >
          <div style={styles.modeIcon}>📚</div>
          <h3 style={styles.modeTitle}>Structured Lessons</h3>
          <p style={styles.modeDescription}>
            CEFR-aligned lessons with cultural context, grammar notes, and IPA pronunciation
          </p>
        </button>

        <button
          style={styles.modeCard}
          onClick={() => setMode('conversation')}
        >
          <div style={styles.modeIcon}>💬</div>
          <h3 style={styles.modeTitle}>Conversation Practice</h3>
          <p style={styles.modeDescription}>
            Real-world scenarios from café to job interview - immersive task-based learning
          </p>
        </button>

        <button
          style={{...styles.modeCard, position: 'relative'}}
          onClick={() => setMode('review')}
        >
          {reviewCount > 0 && (
            <div style={styles.reviewBadge}>{reviewCount}</div>
          )}
          <div style={styles.modeIcon}>🔄</div>
          <h3 style={styles.modeTitle}>Spaced Review</h3>
          <p style={styles.modeDescription}>
            Review phrases using scientifically-proven spaced repetition
          </p>
        </button>

        <button
          style={styles.modeCard}
          onClick={() => setMode('progress')}
        >
          <div style={styles.modeIcon}>📈</div>
          <h3 style={styles.modeTitle}>Progress Dashboard</h3>
          <p style={styles.modeDescription}>
            Track your learning journey and see detailed statistics
          </p>
        </button>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🎯</span>
          <span>CEFR Framework</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🔄</span>
          <span>Spaced Repetition</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🇫🇷</span>
          <span>Cultural Context</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>📖</span>
          <span>IPA Pronunciation</span>
        </div>
      </div>
    </div>
  )

  const renderLessons = () => (
    <div style={styles.lessonsContainer}>
      <button style={styles.backButton} onClick={() => {
        setMode('home')
        setSelectedLesson(null)
        resetLesson()
      }}>
        ← Back to Home
      </button>

      {!selectedLesson ? (
        <>
          <h2 style={styles.sectionTitle}>Choose Your CEFR Level</h2>
          <p style={styles.sectionSubtitle}>
            Lessons aligned with the Common European Framework of Reference for Languages
          </p>

          <div style={styles.levelTabs}>
            {Object.entries(CEFR_LEVELS).map(([level, info]) => (
              <button
                key={level}
                style={{
                  ...styles.levelTab,
                  ...(selectedLevel === level ? {...styles.levelTabActive, background: info.color, borderColor: info.color} : {})
                }}
                onClick={() => setSelectedLevel(level)}
                title={info.description}
              >
                {info.name}
              </button>
            ))}
          </div>

          {/* CEFR Level Description */}
          <div style={styles.levelDescription}>
            <p style={styles.levelDescText}>{CEFR_LEVELS[selectedLevel].description}</p>
            <div style={styles.levelObjectives}>
              <strong>Learning objectives:</strong>
              <ul style={styles.objectivesList}>
                {CEFR_LEVELS[selectedLevel].objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Display Options */}
          <div style={styles.displayOptions}>
            <label style={styles.toggleLabel}>
              <input type="checkbox" checked={showCultural} onChange={e => setShowCultural(e.target.checked)} style={styles.toggleInput} />
              <span style={styles.toggleText}>Cultural notes</span>
            </label>
            <label style={styles.toggleLabel}>
              <input type="checkbox" checked={showGrammar} onChange={e => setShowGrammar(e.target.checked)} style={styles.toggleInput} />
              <span style={styles.toggleText}>Grammar focus</span>
            </label>
            <label style={styles.toggleLabel}>
              <input type="checkbox" checked={showIPA} onChange={e => setShowIPA(e.target.checked)} style={styles.toggleInput} />
              <span style={styles.toggleText}>IPA transcription</span>
            </label>
          </div>

          <div style={styles.lessonGrid}>
            {LESSONS[selectedLevel]?.map(lesson => (
              <button
                key={lesson.id}
                style={styles.lessonCard}
                onClick={() => {
                  setSelectedLesson({...lesson, cefrLevel: selectedLevel})
                  setCurrentPhraseIndex(0)
                }}
              >
                <div style={{...styles.lessonLevelBadge, background: CEFR_LEVELS[selectedLevel].color}}>
                  {selectedLevel}
                </div>
                <h3 style={styles.lessonTitle}>{lesson.title}</h3>
                <p style={styles.lessonSubtitle}>{lesson.subtitle}</p>
                <p style={styles.lessonCount}>{lesson.phrases.length} phrases</p>
                {showCultural && lesson.culturalNote && (
                  <p style={styles.lessonCulturalPreview}>🇫🇷 {lesson.culturalNote.substring(0, 60)}...</p>
                )}
              </button>
            ))}
          </div>
        </>
      ) : (
        renderPractice()
      )}
    </div>
  )

  const renderPractice = () => {
    const currentPhrase = selectedLesson.phrases[currentPhraseIndex]
    const phraseId = `${selectedLesson.cefrLevel || selectedLevel}_${selectedLesson.id}_${currentPhrase.french}`
    const phraseSRS = srsData[phraseId]

    return (
      <div style={styles.practiceContainer}>
        <div style={styles.practiceHeader}>
          <button
            style={styles.backButton}
            onClick={() => {
              setSelectedLesson(null)
              resetLesson()
            }}
          >
            ← Back to Lessons
          </button>
          <div style={styles.progressInfo}>
            <div style={styles.progress}>
              {currentPhraseIndex + 1} / {selectedLesson.phrases.length}
            </div>
            {phraseSRS && (
              <div style={styles.srsIndicator} title={`SRS Level ${phraseSRS.level + 1}/7`}>
                {'●'.repeat(phraseSRS.level + 1)}{'○'.repeat(6 - phraseSRS.level)}
              </div>
            )}
          </div>
        </div>

        <div style={styles.lessonTitleBar}>
          <div>
            <div style={{...styles.lessonLevelBadge, background: CEFR_LEVELS[selectedLesson.cefrLevel || selectedLevel]?.color || '#666', display: 'inline-block', marginBottom: '0.5rem'}}>
              {selectedLesson.cefrLevel || selectedLevel}
            </div>
            <h2 style={styles.currentLessonTitle}>{selectedLesson.title}</h2>
          </div>
          <div style={styles.practiceToggles}>
            <label style={styles.toggleLabel}>
              <input type="checkbox" checked={showPhonetic} onChange={(e) => setShowPhonetic(e.target.checked)} style={styles.toggleInput} />
              <span style={styles.toggleText}>Phonetic</span>
            </label>
            <label style={styles.toggleLabel}>
              <input type="checkbox" checked={showIPA} onChange={(e) => setShowIPA(e.target.checked)} style={styles.toggleInput} />
              <span style={styles.toggleText}>IPA</span>
            </label>
          </div>
        </div>

        {/* Cultural & Grammar Context */}
        {(showCultural || showGrammar) && (
          <div style={styles.contextSection}>
            {showCultural && selectedLesson.culturalNote && (
              <div style={styles.culturalNote}>
                <span style={styles.contextIcon}>🇫🇷</span>
                <div>
                  <strong>Cultural Context:</strong>
                  <p style={styles.contextText}>{selectedLesson.culturalNote}</p>
                </div>
              </div>
            )}
            {showGrammar && selectedLesson.grammarFocus && (
              <div style={styles.grammarNote}>
                <span style={styles.contextIcon}>📖</span>
                <div>
                  <strong>Grammar Focus:</strong>
                  <p style={styles.contextText}>{selectedLesson.grammarFocus}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={styles.phraseCard}>
          <div style={styles.phraseMain}>
            <p style={styles.frenchPhrase}>{currentPhrase.french}</p>
            {showPhonetic && (
              <p style={styles.phonetic}>[{currentPhrase.phonetic}]</p>
            )}
            {showIPA && currentPhrase.ipa && (
              <p style={styles.ipaText}>IPA: {currentPhrase.ipa}</p>
            )}
            <p style={styles.englishPhrase}>{currentPhrase.english}</p>
            {currentPhrase.difficulty && (
              <div style={styles.difficultyIndicator}>
                Difficulty: {'★'.repeat(currentPhrase.difficulty)}{'☆'.repeat(4 - currentPhrase.difficulty)}
              </div>
            )}
          </div>

          <button
            style={{
              ...styles.speakButton,
              ...(isSpeaking ? styles.speakButtonActive : {})
            }}
            onClick={() => speakFrench(currentPhrase.french)}
            disabled={isSpeaking}
          >
            {isSpeaking ? '🔊 Playing...' : '🔊 Listen'}
          </button>
        </div>
        
        <div style={styles.recordSection}>
          <p style={styles.recordInstructions}>
            Click the microphone and say the phrase in French
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
                <span>Stop</span>
              </>
            ) : (
              <>
                <span style={styles.micIcon}>🎤</span>
                <span>Speak</span>
              </>
            )}
          </button>
          
          {isListening && (
            <div style={styles.listeningIndicator}>
              <div style={styles.pulseRing}></div>
              <div style={styles.pulseRing2}></div>
              <span>Listening...</span>
            </div>
          )}
          
          {transcript && (
            <div style={styles.transcriptBox}>
              <p style={styles.transcriptLabel}>You said:</p>
              <p style={styles.transcriptText}>{transcript}</p>
            </div>
          )}
        </div>
        
        {feedback && (
          <div style={{
            ...styles.feedbackCard,
            ...(feedback.type === 'excellent' ? styles.feedbackExcellent :
                feedback.type === 'good' ? styles.feedbackGood :
                feedback.type === 'fair' ? styles.feedbackFair :
                styles.feedbackPoor)
          }}>
            <div style={styles.feedbackHeader}>
              <span style={styles.feedbackScore}>
                {feedback.score !== undefined ? `${feedback.score}%` : ''}
              </span>
              <span style={styles.feedbackMessage}>{feedback.message}</span>
            </div>

            {feedback.tips && feedback.tips.length > 0 && (
              <div style={styles.tipsSection}>
                <p style={styles.tipsTitle}>💡 Pronunciation Guide:</p>
                {feedback.tips.map((tip, i) => (
                  <div key={i} style={styles.tip}>
                    <p style={styles.tipRule}><strong>{tip.rule}</strong></p>
                    {tip.ipa && <p style={styles.tipIPA}>IPA: {tip.ipa}</p>}
                    {tip.mouthPosition && (
                      <p style={styles.tipMouth}>
                        <span style={styles.tipLabel}>👄 Mouth position:</span> {tip.mouthPosition}
                      </p>
                    )}
                    {tip.commonMistake && (
                      <p style={styles.tipMistake}>
                        <span style={styles.tipLabel}>⚠️ Common mistake:</span> {tip.commonMistake}
                      </p>
                    )}
                    <p style={styles.tipExamples}>
                      Practice words: {tip.examples.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div style={styles.navigationButtons}>
          <button
            style={{
              ...styles.navButton,
              ...(currentPhraseIndex === 0 ? styles.navButtonDisabled : {})
            }}
            onClick={prevPhrase}
            disabled={currentPhraseIndex === 0}
          >
            ← Previous
          </button>
          
          {currentPhraseIndex < selectedLesson.phrases.length - 1 ? (
            <button style={styles.navButton} onClick={nextPhrase}>
              Next →
            </button>
          ) : (
            <button 
              style={{...styles.navButton, ...styles.navButtonComplete}}
              onClick={() => {
                setSelectedLesson(null)
                resetLesson()
              }}
            >
              Complete ✓
            </button>
          )}
        </div>
        
        {practiceStats.attempts > 0 && (
          <div style={styles.statsBar}>
            <span>Session: {practiceStats.attempts} attempts</span>
            <span>Good: {practiceStats.good}</span>
            <span>Excellent: {practiceStats.excellent}</span>
          </div>
        )}
      </div>
    )
  }

  const renderConversation = () => (
    <div style={styles.conversationContainer}>
      <button style={styles.backButton} onClick={() => {
        setMode('home')
        setSelectedConversation(null)
        setConversationHistory([])
      }}>
        ← Back to Home
      </button>
      
      {!selectedConversation ? (
        <>
          <h2 style={styles.sectionTitle}>Choose a Scenario</h2>
          <p style={styles.sectionSubtitle}>
            Practice real-world French conversations
          </p>
          
          <div style={styles.scenarioGrid}>
            {CONVERSATIONS.map(conv => (
              <button
                key={conv.id}
                style={styles.scenarioCard}
                onClick={() => {
                  setSelectedConversation(conv)
                  setConversationHistory([
                    { role: 'assistant', content: conv.starter }
                  ])
                  speakFrench(conv.starter)
                }}
              >
                <h3 style={styles.scenarioTitle}>{conv.title}</h3>
                <p style={styles.scenarioDescription}>{conv.description}</p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h3 style={styles.chatTitle}>{selectedConversation.title}</h3>
            <p style={styles.chatContext}>{selectedConversation.context}</p>
          </div>
          
          <div style={styles.chatMessages}>
            {conversationHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.chatMessage,
                  ...(msg.role === 'user' ? styles.chatMessageUser : styles.chatMessageAssistant)
                }}
              >
                <p style={styles.messageText}>{msg.content}</p>
                {msg.role === 'assistant' && (
                  <button
                    style={styles.replayButton}
                    onClick={() => speakFrench(msg.content)}
                  >
                    🔊
                  </button>
                )}
              </div>
            ))}
            {isProcessing && (
              <div style={{...styles.chatMessage, ...styles.chatMessageAssistant}}>
                <p style={styles.typingIndicator}>...</p>
              </div>
            )}
          </div>
          
          <div style={styles.chatInputArea}>
            <p style={styles.suggestionLabel}>Suggested responses:</p>
            <div style={styles.suggestions}>
              {selectedConversation.suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  style={styles.suggestionButton}
                  onClick={() => handleConversationResponse(suggestion)}
                  disabled={isProcessing}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div style={styles.voiceInputSection}>
              <button
                style={{
                  ...styles.micButton,
                  ...(isListening ? styles.micButtonActive : {})
                }}
                onClick={() => {
                  if (isListening) {
                    stopListening()
                    if (transcript) {
                      handleConversationResponse(transcript)
                    }
                  } else {
                    startListening()
                  }
                }}
              >
                {isListening ? '⏹️ Stop & Send' : '🎤 Speak Your Response'}
              </button>
              
              {transcript && (
                <p style={styles.liveTranscript}>{transcript}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Progress Dashboard
  const renderProgress = () => {
    const totalPhrases = Object.values(LESSONS).flat().reduce((acc, lesson) => acc + lesson.phrases.length, 0)
    const learnedPhrases = Object.keys(srsData).length

    return (
      <div style={styles.progressContainer}>
        <button style={styles.backButton} onClick={() => setMode('home')}>
          ← Back to Home
        </button>

        <h2 style={styles.sectionTitle}>Learning Progress</h2>
        <p style={styles.sectionSubtitle}>Track your French learning journey</p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{learnedPhrases}</div>
            <div style={styles.statLabel}>Phrases Practiced</div>
            <div style={styles.statSubtext}>of {totalPhrases} total</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{reviewCount}</div>
            <div style={styles.statLabel}>Due for Review</div>
            <div style={styles.statSubtext}>Spaced repetition</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{Object.values(srsData).filter(s => s.level >= 3).length}</div>
            <div style={styles.statLabel}>Well Learned</div>
            <div style={styles.statSubtext}>SRS level 4+</div>
          </div>
        </div>

        <h3 style={styles.progressSectionTitle}>CEFR Level Progress</h3>
        <div style={styles.cefrProgressGrid}>
          {Object.entries(CEFR_LEVELS).map(([level, info]) => {
            const levelPhrases = LESSONS[level]?.reduce((acc, lesson) => acc + lesson.phrases.length, 0) || 0
            const levelLearned = Object.keys(srsData).filter(k => k.startsWith(level + '_')).length
            const percentage = levelPhrases > 0 ? Math.round((levelLearned / levelPhrases) * 100) : 0

            return (
              <div key={level} style={styles.cefrProgressCard}>
                <div style={styles.cefrProgressHeader}>
                  <div style={{...styles.cefrBadge, background: info.color}}>{level}</div>
                  <span style={styles.cefrProgressPercent}>{percentage}%</span>
                </div>
                <div style={styles.cefrProgressBarContainer}>
                  <div style={{...styles.cefrProgressBar, width: `${percentage}%`, background: info.color}}></div>
                </div>
                <div style={styles.cefrProgressStats}>
                  {levelLearned} / {levelPhrases} phrases
                </div>
                <p style={styles.cefrProgressDesc}>{info.description}</p>
              </div>
            )
          })}
        </div>

        <h3 style={styles.progressSectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {Object.entries(srsData)
            .sort((a, b) => (b[1].lastPracticed || 0) - (a[1].lastPracticed || 0))
            .slice(0, 5)
            .map(([phraseId, data]) => {
              const parts = phraseId.split('_')
              const level = parts[0]
              return (
                <div key={phraseId} style={styles.activityItem}>
                  <div style={{...styles.activityBadge, background: CEFR_LEVELS[level]?.color || '#666'}}>{level}</div>
                  <div style={styles.activityText}>
                    <span style={styles.activityPhrase}>{parts.slice(2).join('_')}</span>
                    <span style={styles.activityScore}>Last score: {data.lastScore}%</span>
                  </div>
                  <div style={styles.activitySRS}>
                    Level {data.level + 1}/7
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }

  // Review Mode for Spaced Repetition
  const renderReview = () => {
    const dueForReview = getPhrasesForReview()

    if (dueForReview.length === 0) {
      return (
        <div style={styles.reviewContainer}>
          <button style={styles.backButton} onClick={() => setMode('home')}>
            ← Back to Home
          </button>
          <div style={styles.emptyReview}>
            <div style={styles.emptyIcon}>✅</div>
            <h2 style={styles.emptyTitle}>All caught up!</h2>
            <p style={styles.emptyText}>
              No phrases due for review right now. Keep practicing new lessons
              and check back later!
            </p>
            <button style={styles.primaryButton} onClick={() => setMode('lessons')}>
              Start a Lesson
            </button>
          </div>
        </div>
      )
    }

    return (
      <div style={styles.reviewContainer}>
        <button style={styles.backButton} onClick={() => setMode('home')}>
          ← Back to Home
        </button>
        <h2 style={styles.sectionTitle}>Spaced Review</h2>
        <p style={styles.sectionSubtitle}>
          {dueForReview.length} phrase{dueForReview.length !== 1 ? 's' : ''} due for review
        </p>
        <div style={styles.reviewList}>
          {dueForReview.slice(0, 10).map((phrase, i) => (
            <div key={i} style={styles.reviewItem}>
              <div style={{...styles.reviewBadgeSmall, background: CEFR_LEVELS[phrase.level]?.color || '#666'}}>
                {phrase.level}
              </div>
              <div style={styles.reviewContent}>
                <p style={styles.reviewFrench}>{phrase.french}</p>
                <p style={styles.reviewEnglish}>{phrase.english}</p>
              </div>
              <button
                style={styles.reviewPracticeBtn}
                onClick={() => {
                  const lesson = LESSONS[phrase.level]?.find(l => l.id === phrase.lessonId)
                  if (lesson) {
                    const phraseIndex = lesson.phrases.findIndex(p => p.french === phrase.french)
                    setSelectedLesson({...lesson, cefrLevel: phrase.level})
                    setCurrentPhraseIndex(phraseIndex >= 0 ? phraseIndex : 0)
                    setSelectedLevel(phrase.level)
                    setMode('lessons')
                  }
                }}
              >
                Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => {
          setMode('home')
          setSelectedLesson(null)
          setSelectedConversation(null)
          setConversationHistory([])
          resetLesson()
        }}>
          <span style={styles.logoIcon}>🇫🇷</span>
          <span style={styles.logoText}>Parlez</span>
        </div>
      </header>

      <div style={styles.content}>
        {mode === 'home' && renderHome()}
        {mode === 'lessons' && renderLessons()}
        {mode === 'conversation' && renderConversation()}
        {mode === 'progress' && renderProgress()}
        {mode === 'review' && renderReview()}
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid var(--light-border)',
    background: 'rgba(250, 247, 242, 0.9)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    width: 'fit-content',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--deep-blue)',
  },
  content: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  },
  
  // Home styles
  homeContainer: {
    animation: 'fadeIn 0.5s ease-out',
  },
  heroSection: {
    textAlign: 'center',
    padding: '3rem 0',
    position: 'relative',
  },
  heroDecoration: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '4rem',
    fontWeight: 700,
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
    position: 'relative',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--french-red)',
    fontStyle: 'italic',
    marginBottom: '1rem',
  },
  heroDescription: {
    fontSize: '1rem',
    color: 'var(--soft-gray)',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  
  modeCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '3rem',
  },
  modeCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  modeIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  modeTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
  },
  modeDescription: {
    color: 'var(--soft-gray)',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '3rem',
    flexWrap: 'wrap',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--soft-gray)',
    fontSize: '0.9rem',
  },
  featureIcon: {
    fontSize: '1.25rem',
  },
  
  // Lessons styles
  lessonsContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'var(--soft-gray)',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    padding: '0.5rem 0',
    transition: 'color 0.2s',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    color: 'var(--soft-gray)',
    marginBottom: '2rem',
  },
  
  levelTabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  levelTab: {
    padding: '0.75rem 1.5rem',
    border: '1px solid var(--light-border)',
    borderRadius: '30px',
    background: 'white',
    color: 'var(--soft-gray)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  levelTabActive: {
    background: 'var(--deep-blue)',
    color: 'white',
    borderColor: 'var(--deep-blue)',
  },
  
  lessonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  lessonCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  lessonTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.25rem',
  },
  lessonSubtitle: {
    color: 'var(--soft-gray)',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  },
  lessonCount: {
    color: 'var(--gold)',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  
  // Practice styles
  practiceContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  practiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  progress: {
    color: 'var(--soft-gray)',
    fontSize: '0.9rem',
  },
  lessonTitleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  currentLessonTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.75rem',
    color: 'var(--deep-blue)',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  toggleInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  toggleText: {
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
  },
  
  phraseCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  phraseMain: {
    marginBottom: '1.5rem',
  },
  frenchPhrase: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.25rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.75rem',
    lineHeight: 1.3,
  },
  phonetic: {
    color: 'var(--gold)',
    fontSize: '1.1rem',
    fontStyle: 'italic',
    marginBottom: '0.75rem',
  },
  englishPhrase: {
    color: 'var(--soft-gray)',
    fontSize: '1.1rem',
  },
  speakButton: {
    background: 'var(--deep-blue)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  speakButtonActive: {
    background: 'var(--french-red)',
  },
  
  recordSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  recordInstructions: {
    color: 'var(--soft-gray)',
    marginBottom: '1.5rem',
  },
  micButton: {
    background: 'linear-gradient(135deg, var(--french-red), #E53E3E)',
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
    transition: 'all 0.3s ease',
  },
  micButtonActive: {
    background: 'linear-gradient(135deg, #059669, #10B981)',
    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
    animation: 'pulse 1.5s infinite',
  },
  micIcon: {
    fontSize: '1.75rem',
  },
  
  listeningIndicator: {
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'var(--success)',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'var(--success)',
    animation: 'ripple 1.5s infinite',
    opacity: 0.3,
  },
  pulseRing2: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'var(--success)',
    animation: 'ripple 1.5s infinite 0.5s',
    opacity: 0.3,
  },
  
  transcriptBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: 'rgba(26, 42, 74, 0.05)',
    borderRadius: '12px',
    maxWidth: '500px',
    margin: '1.5rem auto 0',
  },
  transcriptLabel: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    marginBottom: '0.5rem',
  },
  transcriptText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    color: 'var(--deep-blue)',
  },
  
  feedbackCard: {
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
    animation: 'fadeIn 0.4s ease-out',
  },
  feedbackExcellent: {
    background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.05))',
    border: '1px solid rgba(5, 150, 105, 0.3)',
  },
  feedbackGood: {
    background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(217, 119, 6, 0.05))',
    border: '1px solid rgba(201, 162, 39, 0.3)',
  },
  feedbackFair: {
    background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(245, 158, 11, 0.05))',
    border: '1px solid rgba(217, 119, 6, 0.3)',
  },
  feedbackPoor: {
    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05))',
    border: '1px solid rgba(220, 38, 38, 0.3)',
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  feedbackScore: {
    fontSize: '2rem',
    fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  feedbackMessage: {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  
  tipsSection: {
    borderTop: '1px solid rgba(0,0,0,0.1)',
    paddingTop: '1rem',
    marginTop: '0.5rem',
  },
  tipsTitle: {
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: 'var(--deep-blue)',
  },
  tip: {
    marginBottom: '0.75rem',
  },
  tipRule: {
    fontSize: '0.95rem',
    marginBottom: '0.25rem',
  },
  tipExamples: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    fontStyle: 'italic',
  },
  
  navigationButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  navButton: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '30px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    color: 'var(--deep-blue)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  navButtonComplete: {
    background: 'var(--success)',
    color: 'white',
    borderColor: 'var(--success)',
  },
  
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '2rem',
    padding: '1rem',
    background: 'rgba(26, 42, 74, 0.03)',
    borderRadius: '30px',
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
  },
  
  // Conversation styles
  conversationContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  scenarioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  scenarioCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    padding: '1.5rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  scenarioTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.35rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
  },
  scenarioDescription: {
    color: 'var(--soft-gray)',
    fontSize: '0.95rem',
  },
  
  chatContainer: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  chatHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--light-border)',
    background: 'var(--deep-blue)',
    color: 'white',
  },
  chatTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    marginBottom: '0.25rem',
  },
  chatContext: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  
  chatMessages: {
    padding: '1.5rem',
    maxHeight: '350px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  chatMessage: {
    maxWidth: '80%',
    padding: '1rem 1.25rem',
    borderRadius: '16px',
    position: 'relative',
    animation: 'slideIn 0.3s ease-out',
  },
  chatMessageUser: {
    alignSelf: 'flex-end',
    background: 'var(--deep-blue)',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  chatMessageAssistant: {
    alignSelf: 'flex-start',
    background: 'rgba(26, 42, 74, 0.05)',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  replayButton: {
    position: 'absolute',
    bottom: '-8px',
    right: '-8px',
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    fontSize: '1.5rem',
    letterSpacing: '2px',
    animation: 'pulse 1s infinite',
  },
  
  chatInputArea: {
    padding: '1.5rem',
    borderTop: '1px solid var(--light-border)',
    background: 'rgba(250, 247, 242, 0.5)',
  },
  suggestionLabel: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    marginBottom: '0.75rem',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  suggestionButton: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.95rem',
    color: 'var(--deep-blue)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  voiceInputSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  liveTranscript: {
    color: 'var(--soft-gray)',
    fontStyle: 'italic',
    fontSize: '0.95rem',
  },

  // CEFR Overview styles
  cefrOverview: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  cefrTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.1rem',
    color: 'var(--deep-blue)',
    marginBottom: '1rem',
  },
  cefrLevels: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  cefrLevel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: '1 1 200px',
  },
  cefrBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  cefrName: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    minWidth: '80px',
  },
  cefrProgress: {
    flex: 1,
    height: '6px',
    background: 'var(--light-border)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  cefrProgressBar: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },

  // Review badge
  reviewBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: 'var(--french-red)',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
  },

  // Level description
  levelDescription: {
    background: 'rgba(26, 42, 74, 0.03)',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '1.5rem',
  },
  levelDescText: {
    color: 'var(--soft-gray)',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  },
  levelObjectives: {
    fontSize: '0.9rem',
  },
  objectivesList: {
    margin: '0.5rem 0 0 1.5rem',
    color: 'var(--soft-gray)',
  },

  // Display options
  displayOptions: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },

  // Lesson card enhancements
  lessonLevelBadge: {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.7rem',
    marginBottom: '0.5rem',
    display: 'inline-block',
  },
  lessonCulturalPreview: {
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
    fontStyle: 'italic',
    marginTop: '0.5rem',
    lineHeight: 1.4,
  },

  // Practice enhancements
  progressInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  srsIndicator: {
    fontSize: '0.75rem',
    color: 'var(--gold)',
    letterSpacing: '1px',
  },
  practiceToggles: {
    display: 'flex',
    gap: '1rem',
  },

  // Context section
  contextSection: {
    marginBottom: '1.5rem',
  },
  culturalNote: {
    display: 'flex',
    gap: '0.75rem',
    background: 'linear-gradient(135deg, rgba(0, 85, 164, 0.05), rgba(239, 65, 53, 0.03))',
    border: '1px solid rgba(0, 85, 164, 0.1)',
    borderRadius: '12px',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  grammarNote: {
    display: 'flex',
    gap: '0.75rem',
    background: 'rgba(201, 162, 39, 0.08)',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    borderRadius: '12px',
    padding: '1rem',
  },
  contextIcon: {
    fontSize: '1.25rem',
  },
  contextText: {
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
    lineHeight: 1.5,
    marginTop: '0.25rem',
  },

  // IPA and difficulty
  ipaText: {
    color: 'var(--french-red)',
    fontSize: '1rem',
    fontFamily: 'monospace',
    marginBottom: '0.5rem',
  },
  difficultyIndicator: {
    fontSize: '0.85rem',
    color: 'var(--gold)',
    marginTop: '0.75rem',
  },

  // Enhanced tips
  tipIPA: {
    fontSize: '0.85rem',
    color: 'var(--french-red)',
    fontFamily: 'monospace',
    marginBottom: '0.25rem',
  },
  tipMouth: {
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
  },
  tipMistake: {
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    color: '#B45309',
  },
  tipLabel: {
    fontWeight: 500,
  },

  // Progress dashboard
  progressContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center',
  },
  statNumber: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--deep-blue)',
  },
  statLabel: {
    fontSize: '0.95rem',
    color: 'var(--deep-blue)',
    marginTop: '0.25rem',
  },
  statSubtext: {
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
    marginTop: '0.25rem',
  },
  progressSectionTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    color: 'var(--deep-blue)',
    marginBottom: '1rem',
    marginTop: '1.5rem',
  },
  cefrProgressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  cefrProgressCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  cefrProgressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  cefrProgressPercent: {
    fontWeight: 600,
    color: 'var(--deep-blue)',
  },
  cefrProgressBarContainer: {
    height: '8px',
    background: 'var(--light-border)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  cefrProgressStats: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    marginBottom: '0.5rem',
  },
  cefrProgressDesc: {
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
    lineHeight: 1.4,
  },

  // Activity list
  activityList: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid var(--light-border)',
  },
  activityBadge: {
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.7rem',
  },
  activityText: {
    flex: 1,
  },
  activityPhrase: {
    display: 'block',
    fontFamily: "'Playfair Display', Georgia, serif",
    color: 'var(--deep-blue)',
  },
  activityScore: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
  },
  activitySRS: {
    fontSize: '0.8rem',
    color: 'var(--gold)',
  },

  // Review mode
  reviewContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  emptyReview: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.75rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: 'var(--soft-gray)',
    marginBottom: '1.5rem',
    maxWidth: '400px',
    margin: '0 auto 1.5rem',
  },
  primaryButton: {
    background: 'var(--deep-blue)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  reviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '1rem',
  },
  reviewBadgeSmall: {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
  },
  reviewContent: {
    flex: 1,
  },
  reviewFrench: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.1rem',
    color: 'var(--deep-blue)',
  },
  reviewEnglish: {
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
  },
  reviewPracticeBtn: {
    background: 'var(--deep-blue)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
}
