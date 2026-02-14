'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// French pronunciation rules and common mistakes
const PRONUNCIATION_RULES = {
  // Silent letters
  silent_endings: {
    pattern: /([dtsxzp])$/i,
    rule: "Final consonants (d, t, s, x, z, p) are usually silent in French",
    examples: ["petit", "beaucoup", "temps"]
  },
  // Nasal vowels
  nasal_an: {
    pattern: /an|en|am|em/gi,
    rule: "AN/EN sounds like a nasal 'ah' - don't pronounce the 'n'",
    examples: ["enfant", "pendant", "temps"]
  },
  nasal_on: {
    pattern: /on|om/gi,
    rule: "ON sounds like a nasal 'oh' - keep your mouth rounded",
    examples: ["bon", "maison", "nom"]
  },
  nasal_in: {
    pattern: /in|im|ain|ein|un/gi,
    rule: "IN/AIN sounds like a nasal 'ah' with lips spread",
    examples: ["vin", "pain", "jardin"]
  },
  // R sound
  french_r: {
    pattern: /r/gi,
    rule: "French 'R' is pronounced in the throat, like a soft gargle",
    examples: ["rouge", "partir", "merci"]
  },
  // U vs OU
  french_u: {
    pattern: /(?<![o])u(?!i)/gi,
    rule: "French 'U' is pronounced with very rounded, pursed lips - different from English 'oo'",
    examples: ["tu", "du", "rue"]
  },
  // Liaison
  liaison: {
    pattern: /s\s+[aeiouéèêëàâîïôûù]/gi,
    rule: "Liaison: the final 's' connects to the next word starting with a vowel, pronounced as 'z'",
    examples: ["les amis", "nous avons", "très important"]
  },
  // EU sound
  eu_sound: {
    pattern: /eu|œu/gi,
    rule: "EU sounds like 'uh' with rounded lips - no English equivalent",
    examples: ["deux", "bleu", "heureux"]
  },
  // OI sound
  oi_sound: {
    pattern: /oi/gi,
    rule: "OI is pronounced 'wa'",
    examples: ["moi", "trois", "boire"]
  }
}

// Lesson content organized by level
const LESSONS = {
  beginner: [
    {
      id: 'greetings',
      title: 'Les Salutations',
      subtitle: 'Greetings',
      phrases: [
        { french: 'Bonjour', english: 'Hello / Good day', phonetic: 'bohn-ZHOOR' },
        { french: 'Bonsoir', english: 'Good evening', phonetic: 'bohn-SWAHR' },
        { french: 'Au revoir', english: 'Goodbye', phonetic: 'oh ruh-VWAHR' },
        { french: 'Merci beaucoup', english: 'Thank you very much', phonetic: 'mehr-SEE boh-KOO' },
        { french: "S'il vous plaît", english: 'Please (formal)', phonetic: 'seel voo PLEH' },
        { french: 'Comment allez-vous?', english: 'How are you? (formal)', phonetic: 'koh-mahn tah-lay VOO' },
      ]
    },
    {
      id: 'introductions',
      title: 'Se Présenter',
      subtitle: 'Introducing Yourself',
      phrases: [
        { french: "Je m'appelle...", english: 'My name is...', phonetic: 'zhuh mah-PEL' },
        { french: 'Je suis américain', english: 'I am American', phonetic: 'zhuh swee ah-may-ree-KAHN' },
        { french: "J'habite à...", english: 'I live in...', phonetic: 'zhah-BEET ah' },
        { french: 'Enchanté', english: 'Nice to meet you', phonetic: 'ahn-shahn-TAY' },
        { french: "J'ai ... ans", english: 'I am ... years old', phonetic: 'zhay ... ahn' },
      ]
    },
    {
      id: 'numbers',
      title: 'Les Nombres',
      subtitle: 'Numbers 1-10',
      phrases: [
        { french: 'un', english: 'one', phonetic: 'uhn' },
        { french: 'deux', english: 'two', phonetic: 'duh' },
        { french: 'trois', english: 'three', phonetic: 'twah' },
        { french: 'quatre', english: 'four', phonetic: 'KAH-truh' },
        { french: 'cinq', english: 'five', phonetic: 'sank' },
        { french: 'six', english: 'six', phonetic: 'sees' },
        { french: 'sept', english: 'seven', phonetic: 'set' },
        { french: 'huit', english: 'eight', phonetic: 'weet' },
        { french: 'neuf', english: 'nine', phonetic: 'nuhf' },
        { french: 'dix', english: 'ten', phonetic: 'dees' },
      ]
    },
    {
      id: 'colors',
      title: 'Les Couleurs',
      subtitle: 'Colors',
      phrases: [
        { french: 'rouge', english: 'red', phonetic: 'roozh' },
        { french: 'bleu', english: 'blue', phonetic: 'bluh' },
        { french: 'vert', english: 'green', phonetic: 'vehr' },
        { french: 'jaune', english: 'yellow', phonetic: 'zhohn' },
        { french: 'blanc', english: 'white', phonetic: 'blahn' },
        { french: 'noir', english: 'black', phonetic: 'nwahr' },
      ]
    },
    {
      id: 'family',
      title: 'La Famille',
      subtitle: 'Family',
      phrases: [
        { french: 'mon père', english: 'my father', phonetic: 'mohn PEHR' },
        { french: 'ma mère', english: 'my mother', phonetic: 'mah MEHR' },
        { french: 'mon frère', english: 'my brother', phonetic: 'mohn FREHR' },
        { french: "ma sœur", english: 'my sister', phonetic: 'mah SUR' },
        { french: 'mes enfants', english: 'my children', phonetic: 'may zahn-FAHN' },
        { french: 'mes grands-parents', english: 'my grandparents', phonetic: 'may grahn-pah-RAHN' },
      ]
    }
  ],
  intermediate: [
    {
      id: 'restaurant',
      title: 'Au Restaurant',
      subtitle: 'At the Restaurant',
      phrases: [
        { french: "Je voudrais réserver une table", english: 'I would like to reserve a table', phonetic: 'zhuh voo-DREH ray-zehr-VAY oon TAH-bluh' },
        { french: "L'addition, s'il vous plaît", english: 'The check, please', phonetic: 'lah-dee-SYOHN seel voo PLEH' },
        { french: "Qu'est-ce que vous recommandez?", english: 'What do you recommend?', phonetic: 'kehs kuh voo ruh-koh-mahn-DAY' },
        { french: "Je suis allergique à...", english: 'I am allergic to...', phonetic: 'zhuh swee ah-lehr-ZHEEK ah' },
        { french: "C'était délicieux", english: 'It was delicious', phonetic: 'say-TEH day-lee-SYUH' },
      ]
    },
    {
      id: 'directions',
      title: 'Les Directions',
      subtitle: 'Asking for Directions',
      phrases: [
        { french: 'Où est la gare?', english: 'Where is the train station?', phonetic: 'oo eh lah GAHR' },
        { french: 'Tournez à gauche', english: 'Turn left', phonetic: 'toor-NAY ah GOHSH' },
        { french: 'Tournez à droite', english: 'Turn right', phonetic: 'toor-NAY ah DRWAHT' },
        { french: 'Allez tout droit', english: 'Go straight', phonetic: 'ah-LAY too DRWAH' },
        { french: "C'est à côté de...", english: 'It is next to...', phonetic: 'seh tah koh-TAY duh' },
      ]
    },
    {
      id: 'weather',
      title: 'Le Temps',
      subtitle: 'Weather & Seasons',
      phrases: [
        { french: 'Il fait beau', english: 'The weather is nice', phonetic: 'eel feh BOH' },
        { french: 'Il pleut', english: "It's raining", phonetic: 'eel PLUH' },
        { french: 'Il fait froid', english: "It's cold", phonetic: 'eel feh FRWAH' },
        { french: 'Il fait chaud', english: "It's hot", phonetic: 'eel feh SHOH' },
        { french: 'Il neige', english: "It's snowing", phonetic: 'eel NEZH' },
      ]
    },
    {
      id: 'doctor',
      title: 'Chez le Médecin',
      subtitle: 'At the Doctor',
      phrases: [
        { french: "J'ai mal à la tête", english: 'I have a headache', phonetic: 'zhay mal ah lah TET' },
        { french: 'Je ne me sens pas bien', english: "I don't feel well", phonetic: 'zhuh nuh muh sahn pah BYEH' },
        { french: "J'ai besoin d'un rendez-vous", english: 'I need an appointment', phonetic: 'zhay buh-ZWAHN duhn rahn-day-VOO' },
        { french: 'Depuis combien de temps?', english: 'For how long?', phonetic: 'duh-PWEE kohm-BYEH duh TAHN' },
        { french: "J'ai de la fièvre", english: 'I have a fever', phonetic: 'zhay duh lah FYEH-vruh' },
      ]
    }
  ],
  advanced: [
    {
      id: 'opinions',
      title: 'Exprimer son Opinion',
      subtitle: 'Expressing Opinions',
      phrases: [
        { french: 'Je pense que...', english: 'I think that...', phonetic: 'zhuh PAHNS kuh' },
        { french: 'À mon avis...', english: 'In my opinion...', phonetic: 'ah mohn ah-VEE' },
        { french: "Je suis d'accord", english: 'I agree', phonetic: 'zhuh swee dah-KOHR' },
        { french: "Je ne suis pas d'accord", english: 'I disagree', phonetic: 'zhuh nuh swee pah dah-KOHR' },
        { french: "Il me semble que...", english: 'It seems to me that...', phonetic: 'eel muh SAHM-bluh kuh' },
      ]
    },
    {
      id: 'work',
      title: 'Le Monde du Travail',
      subtitle: 'The World of Work',
      phrases: [
        { french: 'Je travaille dans le domaine de...', english: 'I work in the field of...', phonetic: 'zhuh trah-VY dahn luh doh-MEN duh' },
        { french: "J'ai une réunion à...", english: 'I have a meeting at...', phonetic: 'zhay oon ray-oo-NYOHN ah' },
        { french: 'Quel est votre parcours professionnel?', english: 'What is your professional background?', phonetic: 'kel eh voh-truh par-KOOR pro-feh-syoh-NEL' },
        { french: "Je cherche un emploi", english: "I'm looking for a job", phonetic: 'zhuh shehrsh uhn ahm-PLWAH' },
        { french: 'Je suis en congé', english: 'I am on leave', phonetic: 'zhuh swee ahn kohn-ZHAY' },
      ]
    },
    {
      id: 'emotions',
      title: 'Exprimer ses Émotions',
      subtitle: 'Expressing Emotions',
      phrases: [
        { french: 'Je suis ravi', english: 'I am delighted', phonetic: 'zhuh swee rah-VEE' },
        { french: "Ça m'inquiète", english: 'That worries me', phonetic: 'sah mahn-KYET' },
        { french: 'Je suis déçu', english: 'I am disappointed', phonetic: 'zhuh swee day-SOO' },
        { french: 'Ça me fait plaisir', english: 'That makes me happy', phonetic: 'sah muh feh pleh-ZEER' },
        { french: "J'en ai marre", english: "I'm fed up", phonetic: 'zhahn ay MAR' },
      ]
    }
  ]
}

// Conversation scenarios for practice
const CONVERSATIONS = [
  {
    id: 'cafe',
    title: 'Au Café',
    description: 'Order coffee and pastries at a Parisian café',
    starter: "Bonjour! Bienvenue au Café de Flore. Qu'est-ce que je vous sers?",
    context: "You are at a famous Parisian café. The waiter greets you warmly.",
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
    starter: "Excusez-moi, vous avez besoin d'aide?",
    context: "You look lost at a metro station. A friendly Parisian offers help.",
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
    starter: "Bonjour! Je peux vous aider à trouver quelque chose?",
    context: "You're browsing in a chic Parisian boutique.",
    suggestions: [
      "Je cherche une robe pour une occasion spéciale",
      "Est-ce que vous avez cela en bleu?",
      "Je peux essayer cette taille?"
    ]
  },
  {
    id: 'hotel',
    title: "À l'Hôtel",
    description: 'Check in at a Parisian boutique hotel',
    starter: "Bonsoir et bienvenue à l'Hôtel du Marais. Comment puis-je vous aider?",
    context: "You've just arrived at a boutique hotel in Paris after a long journey.",
    suggestions: [
      "J'ai une réservation au nom de...",
      "Avez-vous une chambre disponible pour ce soir?",
      "À quelle heure est le petit-déjeuner?"
    ]
  },
  {
    id: 'market',
    title: 'Au Marché',
    description: 'Shop for fresh produce at an outdoor market',
    starter: "Bonjour! Regardez ces belles tomates! Vous cherchez quelque chose en particulier?",
    context: "You're at an outdoor French market, browsing fresh produce and local goods.",
    suggestions: [
      "Je voudrais un kilo de tomates, s'il vous plaît",
      "C'est combien, les fraises?",
      "Qu'est-ce qui est de saison en ce moment?"
    ]
  }
]

// Verb conjugation data
const VERB_CATEGORIES = [
  { id: 'all', label: 'All Verbs' },
  { id: 'regular_er', label: '-er Verbs', description: '1st group' },
  { id: 'regular_ir', label: '-ir Verbs', description: '2nd group' },
  { id: 'irregular', label: 'Irregular', description: '3rd group' },
  { id: 'reflexive', label: 'Reflexive', description: 'Pronominal' },
]

const TENSES = [
  { id: 'présent', label: 'Présent', english: 'Present' },
  { id: 'passé_composé', label: 'Passé Composé', english: 'Past' },
  { id: 'imparfait', label: 'Imparfait', english: 'Imperfect' },
  { id: 'futur_simple', label: 'Futur Simple', english: 'Future' },
]

const PRONOUNS = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles']

const ACCENT_CHARS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'ô', 'ç', 'î', 'ï']

const TENSE_TIPS = {
  présent: {
    title: 'Le Présent',
    usage: 'Current actions, habits, and general truths',
    example: 'Je parle français tous les jours.',
    exampleEn: 'I speak French every day.',
    formation: 'Drop the infinitive ending (-er, -ir, -re) and add present tense endings.',
  },
  passé_composé: {
    title: 'Le Passé Composé',
    usage: 'Completed actions in the past with a clear endpoint',
    example: "J'ai parlé français hier.",
    exampleEn: 'I spoke French yesterday.',
    formation: 'Auxiliary (avoir/être) in present tense + past participle. Most verbs use avoir; movement and reflexive verbs use être.',
  },
  imparfait: {
    title: "L'Imparfait",
    usage: 'Ongoing or habitual past actions, descriptions, and background setting',
    example: "Je parlais français quand j'étais enfant.",
    exampleEn: 'I used to speak French when I was a child.',
    formation: 'Take the nous form of the present tense, drop -ons, add imparfait endings (-ais, -ais, -ait, -ions, -iez, -aient).',
  },
  futur_simple: {
    title: 'Le Futur Simple',
    usage: 'Future actions, predictions, and promises',
    example: 'Je parlerai français couramment un jour.',
    exampleEn: 'I will speak French fluently one day.',
    formation: 'Add future endings (-ai, -as, -a, -ons, -ez, -ont) to the infinitive. Irregular verbs have special stems.',
  },
}

const CONJUGATION_VERBS = [
  // Regular -er verbs
  {
    infinitive: 'parler',
    english: 'to speak',
    category: 'regular_er',
    tenses: {
      présent: { 'je': 'je parle', 'tu': 'tu parles', 'il/elle': 'il/elle parle', 'nous': 'nous parlons', 'vous': 'vous parlez', 'ils/elles': 'ils/elles parlent' },
      passé_composé: { 'je': "j'ai parlé", 'tu': 'tu as parlé', 'il/elle': 'il/elle a parlé', 'nous': 'nous avons parlé', 'vous': 'vous avez parlé', 'ils/elles': 'ils/elles ont parlé' },
      imparfait: { 'je': 'je parlais', 'tu': 'tu parlais', 'il/elle': 'il/elle parlait', 'nous': 'nous parlions', 'vous': 'vous parliez', 'ils/elles': 'ils/elles parlaient' },
      futur_simple: { 'je': 'je parlerai', 'tu': 'tu parleras', 'il/elle': 'il/elle parlera', 'nous': 'nous parlerons', 'vous': 'vous parlerez', 'ils/elles': 'ils/elles parleront' },
    }
  },
  {
    infinitive: 'manger',
    english: 'to eat',
    category: 'regular_er',
    tenses: {
      présent: { 'je': 'je mange', 'tu': 'tu manges', 'il/elle': 'il/elle mange', 'nous': 'nous mangeons', 'vous': 'vous mangez', 'ils/elles': 'ils/elles mangent' },
      passé_composé: { 'je': "j'ai mangé", 'tu': 'tu as mangé', 'il/elle': 'il/elle a mangé', 'nous': 'nous avons mangé', 'vous': 'vous avez mangé', 'ils/elles': 'ils/elles ont mangé' },
      imparfait: { 'je': 'je mangeais', 'tu': 'tu mangeais', 'il/elle': 'il/elle mangeait', 'nous': 'nous mangions', 'vous': 'vous mangiez', 'ils/elles': 'ils/elles mangeaient' },
      futur_simple: { 'je': 'je mangerai', 'tu': 'tu mangeras', 'il/elle': 'il/elle mangera', 'nous': 'nous mangerons', 'vous': 'vous mangerez', 'ils/elles': 'ils/elles mangeront' },
    }
  },
  {
    infinitive: 'aimer',
    english: 'to like / to love',
    category: 'regular_er',
    tenses: {
      présent: { 'je': "j'aime", 'tu': 'tu aimes', 'il/elle': 'il/elle aime', 'nous': 'nous aimons', 'vous': 'vous aimez', 'ils/elles': 'ils/elles aiment' },
      passé_composé: { 'je': "j'ai aimé", 'tu': 'tu as aimé', 'il/elle': 'il/elle a aimé', 'nous': 'nous avons aimé', 'vous': 'vous avez aimé', 'ils/elles': 'ils/elles ont aimé' },
      imparfait: { 'je': "j'aimais", 'tu': 'tu aimais', 'il/elle': 'il/elle aimait', 'nous': 'nous aimions', 'vous': 'vous aimiez', 'ils/elles': 'ils/elles aimaient' },
      futur_simple: { 'je': "j'aimerai", 'tu': 'tu aimeras', 'il/elle': 'il/elle aimera', 'nous': 'nous aimerons', 'vous': 'vous aimerez', 'ils/elles': 'ils/elles aimeront' },
    }
  },
  // Regular -ir verbs
  {
    infinitive: 'finir',
    english: 'to finish',
    category: 'regular_ir',
    tenses: {
      présent: { 'je': 'je finis', 'tu': 'tu finis', 'il/elle': 'il/elle finit', 'nous': 'nous finissons', 'vous': 'vous finissez', 'ils/elles': 'ils/elles finissent' },
      passé_composé: { 'je': "j'ai fini", 'tu': 'tu as fini', 'il/elle': 'il/elle a fini', 'nous': 'nous avons fini', 'vous': 'vous avez fini', 'ils/elles': 'ils/elles ont fini' },
      imparfait: { 'je': 'je finissais', 'tu': 'tu finissais', 'il/elle': 'il/elle finissait', 'nous': 'nous finissions', 'vous': 'vous finissiez', 'ils/elles': 'ils/elles finissaient' },
      futur_simple: { 'je': 'je finirai', 'tu': 'tu finiras', 'il/elle': 'il/elle finira', 'nous': 'nous finirons', 'vous': 'vous finirez', 'ils/elles': 'ils/elles finiront' },
    }
  },
  {
    infinitive: 'choisir',
    english: 'to choose',
    category: 'regular_ir',
    tenses: {
      présent: { 'je': 'je choisis', 'tu': 'tu choisis', 'il/elle': 'il/elle choisit', 'nous': 'nous choisissons', 'vous': 'vous choisissez', 'ils/elles': 'ils/elles choisissent' },
      passé_composé: { 'je': "j'ai choisi", 'tu': 'tu as choisi', 'il/elle': 'il/elle a choisi', 'nous': 'nous avons choisi', 'vous': 'vous avez choisi', 'ils/elles': 'ils/elles ont choisi' },
      imparfait: { 'je': 'je choisissais', 'tu': 'tu choisissais', 'il/elle': 'il/elle choisissait', 'nous': 'nous choisissions', 'vous': 'vous choisissiez', 'ils/elles': 'ils/elles choisissaient' },
      futur_simple: { 'je': 'je choisirai', 'tu': 'tu choisiras', 'il/elle': 'il/elle choisira', 'nous': 'nous choisirons', 'vous': 'vous choisirez', 'ils/elles': 'ils/elles choisiront' },
    }
  },
  // Irregular verbs
  {
    infinitive: 'être',
    english: 'to be',
    category: 'irregular',
    tenses: {
      présent: { 'je': 'je suis', 'tu': 'tu es', 'il/elle': 'il/elle est', 'nous': 'nous sommes', 'vous': 'vous êtes', 'ils/elles': 'ils/elles sont' },
      passé_composé: { 'je': "j'ai été", 'tu': 'tu as été', 'il/elle': 'il/elle a été', 'nous': 'nous avons été', 'vous': 'vous avez été', 'ils/elles': 'ils/elles ont été' },
      imparfait: { 'je': "j'étais", 'tu': 'tu étais', 'il/elle': 'il/elle était', 'nous': 'nous étions', 'vous': 'vous étiez', 'ils/elles': 'ils/elles étaient' },
      futur_simple: { 'je': 'je serai', 'tu': 'tu seras', 'il/elle': 'il/elle sera', 'nous': 'nous serons', 'vous': 'vous serez', 'ils/elles': 'ils/elles seront' },
    }
  },
  {
    infinitive: 'avoir',
    english: 'to have',
    category: 'irregular',
    tenses: {
      présent: { 'je': "j'ai", 'tu': 'tu as', 'il/elle': 'il/elle a', 'nous': 'nous avons', 'vous': 'vous avez', 'ils/elles': 'ils/elles ont' },
      passé_composé: { 'je': "j'ai eu", 'tu': 'tu as eu', 'il/elle': 'il/elle a eu', 'nous': 'nous avons eu', 'vous': 'vous avez eu', 'ils/elles': 'ils/elles ont eu' },
      imparfait: { 'je': "j'avais", 'tu': 'tu avais', 'il/elle': 'il/elle avait', 'nous': 'nous avions', 'vous': 'vous aviez', 'ils/elles': 'ils/elles avaient' },
      futur_simple: { 'je': "j'aurai", 'tu': 'tu auras', 'il/elle': 'il/elle aura', 'nous': 'nous aurons', 'vous': 'vous aurez', 'ils/elles': 'ils/elles auront' },
    }
  },
  {
    infinitive: 'aller',
    english: 'to go',
    category: 'irregular',
    tenses: {
      présent: { 'je': 'je vais', 'tu': 'tu vas', 'il/elle': 'il/elle va', 'nous': 'nous allons', 'vous': 'vous allez', 'ils/elles': 'ils/elles vont' },
      passé_composé: { 'je': 'je suis allé', 'tu': 'tu es allé', 'il/elle': 'il/elle est allé', 'nous': 'nous sommes allés', 'vous': 'vous êtes allés', 'ils/elles': 'ils/elles sont allés' },
      imparfait: { 'je': "j'allais", 'tu': 'tu allais', 'il/elle': 'il/elle allait', 'nous': 'nous allions', 'vous': 'vous alliez', 'ils/elles': 'ils/elles allaient' },
      futur_simple: { 'je': "j'irai", 'tu': 'tu iras', 'il/elle': 'il/elle ira', 'nous': 'nous irons', 'vous': 'vous irez', 'ils/elles': 'ils/elles iront' },
    }
  },
  {
    infinitive: 'faire',
    english: 'to do / to make',
    category: 'irregular',
    tenses: {
      présent: { 'je': 'je fais', 'tu': 'tu fais', 'il/elle': 'il/elle fait', 'nous': 'nous faisons', 'vous': 'vous faites', 'ils/elles': 'ils/elles font' },
      passé_composé: { 'je': "j'ai fait", 'tu': 'tu as fait', 'il/elle': 'il/elle a fait', 'nous': 'nous avons fait', 'vous': 'vous avez fait', 'ils/elles': 'ils/elles ont fait' },
      imparfait: { 'je': 'je faisais', 'tu': 'tu faisais', 'il/elle': 'il/elle faisait', 'nous': 'nous faisions', 'vous': 'vous faisiez', 'ils/elles': 'ils/elles faisaient' },
      futur_simple: { 'je': 'je ferai', 'tu': 'tu feras', 'il/elle': 'il/elle fera', 'nous': 'nous ferons', 'vous': 'vous ferez', 'ils/elles': 'ils/elles feront' },
    }
  },
  {
    infinitive: 'prendre',
    english: 'to take',
    category: 'irregular',
    tenses: {
      présent: { 'je': 'je prends', 'tu': 'tu prends', 'il/elle': 'il/elle prend', 'nous': 'nous prenons', 'vous': 'vous prenez', 'ils/elles': 'ils/elles prennent' },
      passé_composé: { 'je': "j'ai pris", 'tu': 'tu as pris', 'il/elle': 'il/elle a pris', 'nous': 'nous avons pris', 'vous': 'vous avez pris', 'ils/elles': 'ils/elles ont pris' },
      imparfait: { 'je': 'je prenais', 'tu': 'tu prenais', 'il/elle': 'il/elle prenait', 'nous': 'nous prenions', 'vous': 'vous preniez', 'ils/elles': 'ils/elles prenaient' },
      futur_simple: { 'je': 'je prendrai', 'tu': 'tu prendras', 'il/elle': 'il/elle prendra', 'nous': 'nous prendrons', 'vous': 'vous prendrez', 'ils/elles': 'ils/elles prendront' },
    }
  },
  {
    infinitive: 'venir',
    english: 'to come',
    category: 'irregular',
    tenses: {
      présent: { 'je': 'je viens', 'tu': 'tu viens', 'il/elle': 'il/elle vient', 'nous': 'nous venons', 'vous': 'vous venez', 'ils/elles': 'ils/elles viennent' },
      passé_composé: { 'je': 'je suis venu', 'tu': 'tu es venu', 'il/elle': 'il/elle est venu', 'nous': 'nous sommes venus', 'vous': 'vous êtes venus', 'ils/elles': 'ils/elles sont venus' },
      imparfait: { 'je': 'je venais', 'tu': 'tu venais', 'il/elle': 'il/elle venait', 'nous': 'nous venions', 'vous': 'vous veniez', 'ils/elles': 'ils/elles venaient' },
      futur_simple: { 'je': 'je viendrai', 'tu': 'tu viendras', 'il/elle': 'il/elle viendra', 'nous': 'nous viendrons', 'vous': 'vous viendrez', 'ils/elles': 'ils/elles viendront' },
    }
  },
  // Reflexive (pronominal) verbs
  {
    infinitive: 'se lever',
    english: 'to get up',
    category: 'reflexive',
    tenses: {
      présent: { 'je': 'je me lève', 'tu': 'tu te lèves', 'il/elle': 'il/elle se lève', 'nous': 'nous nous levons', 'vous': 'vous vous levez', 'ils/elles': 'ils/elles se lèvent' },
      passé_composé: { 'je': 'je me suis levé', 'tu': "tu t'es levé", 'il/elle': "il/elle s'est levé", 'nous': 'nous nous sommes levés', 'vous': 'vous vous êtes levés', 'ils/elles': 'ils/elles se sont levés' },
      imparfait: { 'je': 'je me levais', 'tu': 'tu te levais', 'il/elle': 'il/elle se levait', 'nous': 'nous nous levions', 'vous': 'vous vous leviez', 'ils/elles': 'ils/elles se levaient' },
      futur_simple: { 'je': 'je me lèverai', 'tu': 'tu te lèveras', 'il/elle': 'il/elle se lèvera', 'nous': 'nous nous lèverons', 'vous': 'vous vous lèverez', 'ils/elles': 'ils/elles se lèveront' },
    }
  },
  {
    infinitive: 'se coucher',
    english: 'to go to bed',
    category: 'reflexive',
    tenses: {
      présent: { 'je': 'je me couche', 'tu': 'tu te couches', 'il/elle': 'il/elle se couche', 'nous': 'nous nous couchons', 'vous': 'vous vous couchez', 'ils/elles': 'ils/elles se couchent' },
      passé_composé: { 'je': 'je me suis couché', 'tu': "tu t'es couché", 'il/elle': "il/elle s'est couché", 'nous': 'nous nous sommes couchés', 'vous': 'vous vous êtes couchés', 'ils/elles': 'ils/elles se sont couchés' },
      imparfait: { 'je': 'je me couchais', 'tu': 'tu te couchais', 'il/elle': 'il/elle se couchait', 'nous': 'nous nous couchions', 'vous': 'vous vous couchiez', 'ils/elles': 'ils/elles se couchaient' },
      futur_simple: { 'je': 'je me coucherai', 'tu': 'tu te coucheras', 'il/elle': 'il/elle se couchera', 'nous': 'nous nous coucherons', 'vous': 'vous vous coucherez', 'ils/elles': 'ils/elles se coucheront' },
    }
  },
  {
    infinitive: "s'habiller",
    english: 'to get dressed',
    category: 'reflexive',
    tenses: {
      présent: { 'je': "je m'habille", 'tu': "tu t'habilles", 'il/elle': "il/elle s'habille", 'nous': 'nous nous habillons', 'vous': 'vous vous habillez', 'ils/elles': "ils/elles s'habillent" },
      passé_composé: { 'je': 'je me suis habillé', 'tu': "tu t'es habillé", 'il/elle': "il/elle s'est habillé", 'nous': 'nous nous sommes habillés', 'vous': 'vous vous êtes habillés', 'ils/elles': 'ils/elles se sont habillés' },
      imparfait: { 'je': "je m'habillais", 'tu': "tu t'habillais", 'il/elle': "il/elle s'habillait", 'nous': 'nous nous habillions', 'vous': 'vous vous habilliez', 'ils/elles': "ils/elles s'habillaient" },
      futur_simple: { 'je': "je m'habillerai", 'tu': "tu t'habilleras", 'il/elle': "il/elle s'habillera", 'nous': 'nous nous habillerons', 'vous': 'vous vous habillerez', 'ils/elles': "ils/elles s'habilleront" },
    }
  },
  {
    infinitive: 'se promener',
    english: 'to go for a walk',
    category: 'reflexive',
    tenses: {
      présent: { 'je': 'je me promène', 'tu': 'tu te promènes', 'il/elle': 'il/elle se promène', 'nous': 'nous nous promenons', 'vous': 'vous vous promenez', 'ils/elles': 'ils/elles se promènent' },
      passé_composé: { 'je': 'je me suis promené', 'tu': "tu t'es promené", 'il/elle': "il/elle s'est promené", 'nous': 'nous nous sommes promenés', 'vous': 'vous vous êtes promenés', 'ils/elles': 'ils/elles se sont promenés' },
      imparfait: { 'je': 'je me promenais', 'tu': 'tu te promenais', 'il/elle': 'il/elle se promenait', 'nous': 'nous nous promenions', 'vous': 'vous vous promeniez', 'ils/elles': 'ils/elles se promenaient' },
      futur_simple: { 'je': 'je me promènerai', 'tu': 'tu te promèneras', 'il/elle': 'il/elle se promènera', 'nous': 'nous nous promènerons', 'vous': 'vous vous promènerez', 'ils/elles': 'ils/elles se promèneront' },
    }
  },
  {
    infinitive: "s'appeler",
    english: 'to be called',
    category: 'reflexive',
    tenses: {
      présent: { 'je': "je m'appelle", 'tu': "tu t'appelles", 'il/elle': "il/elle s'appelle", 'nous': 'nous nous appelons', 'vous': 'vous vous appelez', 'ils/elles': "ils/elles s'appellent" },
      passé_composé: { 'je': 'je me suis appelé', 'tu': "tu t'es appelé", 'il/elle': "il/elle s'est appelé", 'nous': 'nous nous sommes appelés', 'vous': 'vous vous êtes appelés', 'ils/elles': 'ils/elles se sont appelés' },
      imparfait: { 'je': "je m'appelais", 'tu': "tu t'appelais", 'il/elle': "il/elle s'appelait", 'nous': 'nous nous appelions', 'vous': 'vous vous appeliez', 'ils/elles': "ils/elles s'appelaient" },
      futur_simple: { 'je': "je m'appellerai", 'tu': "tu t'appelleras", 'il/elle': "il/elle s'appellera", 'nous': 'nous nous appellerons', 'vous': 'vous vous appellerez', 'ils/elles': "ils/elles s'appelleront" },
    }
  },
]

// Vocabulary flashcard decks
const VOCABULARY_DECKS = [
  {
    id: 'food',
    title: 'La Nourriture',
    subtitle: 'Food & Drink',
    cards: [
      { french: 'le pain', english: 'bread', gender: 'm', example: 'Je voudrais du pain, s\'il vous plaît.' },
      { french: 'le fromage', english: 'cheese', gender: 'm', example: 'Le fromage français est délicieux.' },
      { french: 'le vin', english: 'wine', gender: 'm', example: 'Un verre de vin rouge, s\'il vous plaît.' },
      { french: "l'eau", english: 'water', gender: 'f', example: "Je voudrais de l'eau, s'il vous plaît." },
      { french: 'le poulet', english: 'chicken', gender: 'm', example: 'Le poulet rôti est très bon ici.' },
      { french: 'la salade', english: 'salad', gender: 'f', example: 'Je prends une salade verte.' },
      { french: 'le gâteau', english: 'cake', gender: 'm', example: 'Ce gâteau au chocolat est merveilleux.' },
      { french: 'le café', english: 'coffee', gender: 'm', example: 'Un café crème, s\'il vous plaît.' },
    ]
  },
  {
    id: 'body',
    title: 'Le Corps',
    subtitle: 'Body Parts',
    cards: [
      { french: 'la tête', english: 'head', gender: 'f', example: "J'ai mal à la tête." },
      { french: 'le bras', english: 'arm', gender: 'm', example: 'Il a cassé son bras.' },
      { french: 'la main', english: 'hand', gender: 'f', example: 'Levez la main droite.' },
      { french: 'la jambe', english: 'leg', gender: 'f', example: 'Elle a mal à la jambe.' },
      { french: 'le pied', english: 'foot', gender: 'm', example: 'Je suis venu à pied.' },
      { french: 'le dos', english: 'back', gender: 'm', example: "J'ai mal au dos." },
      { french: 'le cœur', english: 'heart', gender: 'm', example: 'Il a bon cœur.' },
      { french: 'la bouche', english: 'mouth', gender: 'f', example: 'Ouvrez la bouche.' },
    ]
  },
  {
    id: 'time',
    title: 'Le Temps',
    subtitle: 'Days, Months & Time',
    cards: [
      { french: 'lundi', english: 'Monday', gender: null, example: 'Lundi, je commence le travail.' },
      { french: 'mardi', english: 'Tuesday', gender: null, example: "Mardi, j'ai un rendez-vous." },
      { french: 'mercredi', english: 'Wednesday', gender: null, example: 'Les enfants ne travaillent pas mercredi.' },
      { french: 'janvier', english: 'January', gender: 'm', example: "En janvier, il fait très froid." },
      { french: 'juillet', english: 'July', gender: 'm', example: 'En juillet, nous partons en vacances.' },
      { french: 'aujourd\'hui', english: 'today', gender: null, example: "Aujourd'hui, c'est un beau jour." },
      { french: 'demain', english: 'tomorrow', gender: null, example: 'Demain, je vais au cinéma.' },
      { french: 'hier', english: 'yesterday', gender: null, example: 'Hier, il a plu toute la journée.' },
    ]
  },
  {
    id: 'adjectives',
    title: 'Les Adjectifs',
    subtitle: 'Common Adjectives',
    cards: [
      { french: 'grand / grande', english: 'big / tall', gender: null, example: 'Paris est une grande ville.' },
      { french: 'petit / petite', english: 'small / short', gender: null, example: "C'est un petit restaurant." },
      { french: 'bon / bonne', english: 'good', gender: null, example: "C'est une bonne idée!" },
      { french: 'mauvais / mauvaise', english: 'bad', gender: null, example: 'Il fait mauvais temps.' },
      { french: 'beau / belle', english: 'beautiful', gender: null, example: "Quelle belle journée!" },
      { french: 'nouveau / nouvelle', english: 'new', gender: null, example: "J'ai une nouvelle voiture." },
      { french: 'vieux / vieille', english: 'old', gender: null, example: "C'est un vieux château." },
      { french: 'jeune', english: 'young', gender: null, example: "C'est une jeune femme très intelligente." },
    ]
  },
  {
    id: 'house',
    title: 'La Maison',
    subtitle: 'In the House',
    cards: [
      { french: 'la cuisine', english: 'kitchen', gender: 'f', example: 'Je prépare le dîner dans la cuisine.' },
      { french: 'la chambre', english: 'bedroom', gender: 'f', example: 'La chambre est au premier étage.' },
      { french: 'la salle de bain', english: 'bathroom', gender: 'f', example: 'La salle de bain est à droite.' },
      { french: 'le salon', english: 'living room', gender: 'm', example: 'Nous regardons la télé dans le salon.' },
      { french: 'le jardin', english: 'garden', gender: 'm', example: 'Les enfants jouent dans le jardin.' },
      { french: 'la fenêtre', english: 'window', gender: 'f', example: 'Ouvrez la fenêtre, il fait chaud.' },
      { french: 'la porte', english: 'door', gender: 'f', example: 'Fermez la porte, s\'il vous plaît.' },
      { french: 'l\'escalier', english: 'stairs', gender: 'm', example: "Montez l'escalier jusqu'au deuxième étage." },
    ]
  },
  {
    id: 'travel',
    title: 'Le Voyage',
    subtitle: 'Travel Essentials',
    cards: [
      { french: 'le billet', english: 'ticket', gender: 'm', example: "J'ai acheté un billet aller-retour." },
      { french: "l'aéroport", english: 'airport', gender: 'm', example: "L'aéroport est à 30 minutes." },
      { french: 'la gare', english: 'train station', gender: 'f', example: 'La gare est au centre-ville.' },
      { french: 'la valise', english: 'suitcase', gender: 'f', example: "J'ai perdu ma valise." },
      { french: 'le passeport', english: 'passport', gender: 'm', example: "N'oubliez pas votre passeport." },
      { french: 'la carte', english: 'map / card', gender: 'f', example: 'Avez-vous une carte de la ville?' },
      { french: 'le train', english: 'train', gender: 'm', example: 'Le train part à 8 heures.' },
      { french: "l'hôtel", english: 'hotel', gender: 'm', example: "L'hôtel est près de la plage." },
    ]
  },
]

export default function FrenchTutor() {
  const [mode, setMode] = useState('home') // home, lessons, practice, conversation
  const [selectedLevel, setSelectedLevel] = useState('beginner')
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
  const [practiceStats, setPracticeStats] = useState({ attempts: 0, good: 0, excellent: 0 })

  // Conjugation state
  const [conjugationCategory, setConjugationCategory] = useState('all')
  const [selectedVerb, setSelectedVerb] = useState(null)
  const [selectedTense, setSelectedTense] = useState('présent')
  const [currentPronounIndex, setCurrentPronounIndex] = useState(0)
  const [conjugationInput, setConjugationInput] = useState('')
  const [conjugationFeedback, setConjugationFeedback] = useState(null)
  const [conjugationScore, setConjugationScore] = useState({ correct: 0, total: 0 })
  const [showConjugationTable, setShowConjugationTable] = useState(false)
  const [showTenseTip, setShowTenseTip] = useState(false)
  const [completedLessons, setCompletedLessons] = useState(new Set())

  // Flashcard state
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [flashcardResults, setFlashcardResults] = useState({ mastered: new Set(), learning: new Set() })

  // Dictation state
  const [dictationMode, setDictationMode] = useState(false)
  const [dictationInput, setDictationInput] = useState('')
  const [dictationFeedback, setDictationFeedback] = useState(null)

  // Streak tracking
  const [streak, setStreak] = useState(0)
  const [lastPracticeDate, setLastPracticeDate] = useState(null)

  const recognitionRef = useRef(null)
  const conjugationInputRef = useRef(null)
  const synthRef = useRef(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('parlez-progress')
        if (saved) {
          const data = JSON.parse(saved)
          setCompletedLessons(new Set(data.completedLessons || []))
          setStreak(data.streak || 0)
          setLastPracticeDate(data.lastPracticeDate || null)
          if (data.flashcardMastered) {
            setFlashcardResults(prev => ({
              ...prev,
              mastered: new Set(data.flashcardMastered)
            }))
          }
        }
      } catch (e) { /* ignore parse errors */ }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('parlez-progress', JSON.stringify({
        completedLessons: Array.from(completedLessons),
        streak,
        lastPracticeDate,
        flashcardMastered: Array.from(flashcardResults.mastered),
      }))
    }
  }, [completedLessons, streak, lastPracticeDate, flashcardResults])

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
            analyzePronunciation(transcriptText)
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

  const analyzePronunciation = (spokenText) => {
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
      
      // Check for common pronunciation issues
      Object.entries(PRONUNCIATION_RULES).forEach(([key, rule]) => {
        if (rule.pattern.test(targetPhrase)) {
          tips.push({
            rule: rule.rule,
            examples: rule.examples
          })
        }
      })
      
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
  }

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
          "Bien sûr, les cabines d'essayage sont au fond à droite.",
          "Ça vous va à merveille! Voulez-vous que je l'emballe?",
          "Merci pour votre visite! Bonne journée!"
        ],
        hotel: [
          "Parfait, laissez-moi vérifier. Oui, votre chambre est prête. C'est la chambre 24 au deuxième étage.",
          "Oui, nous avons une chambre double avec vue sur le jardin. C'est 150 euros la nuit.",
          "Le petit-déjeuner est servi de 7h à 10h dans la salle à manger. Voici votre clé.",
          "N'hésitez pas à appeler la réception si vous avez besoin de quoi que ce soit.",
          "Nous vous souhaitons un excellent séjour!"
        ],
        market: [
          "Voilà, un kilo de nos meilleures tomates. Ce sera 3 euros 50. Autre chose?",
          "Les fraises sont à 4 euros la barquette. Elles sont très sucrées aujourd'hui!",
          "En ce moment, les pêches et les abricots sont excellents. Voulez-vous goûter?",
          "Très bon choix! Je vous mets ça dans un sac?",
          "Merci beaucoup, bonne journée et bon appétit!"
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

  const navigateTo = (newMode) => {
    setMode(newMode)
    setSelectedLesson(null)
    setSelectedConversation(null)
    setConversationHistory([])
    resetLesson()
    resetConjugation()
    resetFlashcards()
    setDictationMode(false)
    setDictationInput('')
    setDictationFeedback(null)
  }

  const markLessonComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
    recordPractice()
  }

  const normalizeForComparison = (text) => {
    return text.toLowerCase().trim()
      .replace(/[\u2018\u2019\u0060\u00B4]/g, "'")
      .replace(/\s+/g, ' ')
  }

  const isConjugationCorrect = (userAnswer, correctAnswer) => {
    const normalized = normalizeForComparison(userAnswer)
    const correct = normalizeForComparison(correctAnswer)
    if (normalized === correct) return true

    const variants = [correct]
    if (correct.includes('il/elle')) {
      variants.push(correct.replace('il/elle', 'il'))
      variants.push(correct.replace('il/elle', 'elle'))
      variants.push(correct.replace('il/elle', 'on'))
    }
    if (correct.includes('ils/elles')) {
      variants.push(correct.replace('ils/elles', 'ils'))
      variants.push(correct.replace('ils/elles', 'elles'))
    }
    return variants.some(v => normalized === v)
  }

  const insertAccentChar = (char) => {
    setConjugationInput(prev => prev + char)
    setTimeout(() => {
      if (conjugationInputRef.current) {
        conjugationInputRef.current.focus()
      }
    }, 0)
  }

  // Conjugation quiz logic
  const getFilteredVerbs = () => {
    if (conjugationCategory === 'all') return CONJUGATION_VERBS
    return CONJUGATION_VERBS.filter(v => v.category === conjugationCategory)
  }

  const startVerbPractice = (verb) => {
    setSelectedVerb(verb)
    setSelectedTense('présent')
    setCurrentPronounIndex(0)
    setConjugationInput('')
    setConjugationFeedback(null)
    setConjugationScore({ correct: 0, total: 0 })
    setShowConjugationTable(false)
  }

  const checkConjugation = () => {
    if (!selectedVerb || !conjugationInput.trim()) return
    recordPractice()

    const pronoun = PRONOUNS[currentPronounIndex]
    const correctAnswer = selectedVerb.tenses[selectedTense][pronoun]

    const isCorrect = isConjugationCorrect(conjugationInput, correctAnswer)

    setConjugationFeedback({
      correct: isCorrect,
      userAnswer: conjugationInput.trim(),
      correctAnswer: correctAnswer,
    })

    setConjugationScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }))
  }

  const nextConjugationQuestion = () => {
    if (currentPronounIndex < PRONOUNS.length - 1) {
      setCurrentPronounIndex(prev => prev + 1)
    } else {
      setCurrentPronounIndex(0)
    }
    setConjugationInput('')
    setConjugationFeedback(null)
  }

  const resetConjugation = () => {
    setSelectedVerb(null)
    setCurrentPronounIndex(0)
    setConjugationInput('')
    setConjugationFeedback(null)
    setConjugationScore({ correct: 0, total: 0 })
    setShowConjugationTable(false)
    setShowTenseTip(false)
  }

  // Flashcard logic
  const startDeck = (deck) => {
    setSelectedDeck(deck)
    setFlashcardIndex(0)
    setIsCardFlipped(false)
    recordPractice()
  }

  const flipCard = () => setIsCardFlipped(!isCardFlipped)

  const markFlashcard = (result) => {
    const card = selectedDeck.cards[flashcardIndex]
    const key = `${selectedDeck.id}:${card.french}`
    setFlashcardResults(prev => {
      const mastered = new Set(prev.mastered)
      const learning = new Set(prev.learning)
      if (result === 'mastered') {
        mastered.add(key)
        learning.delete(key)
      } else {
        learning.add(key)
        mastered.delete(key)
      }
      return { mastered, learning }
    })
    if (flashcardIndex < selectedDeck.cards.length - 1) {
      setFlashcardIndex(prev => prev + 1)
      setIsCardFlipped(false)
    } else {
      setFlashcardIndex(0)
      setIsCardFlipped(false)
    }
  }

  const resetFlashcards = () => {
    setSelectedDeck(null)
    setFlashcardIndex(0)
    setIsCardFlipped(false)
  }

  const getDeckProgress = (deck) => {
    let mastered = 0
    deck.cards.forEach(card => {
      if (flashcardResults.mastered.has(`${deck.id}:${card.french}`)) mastered++
    })
    return mastered
  }

  // Dictation logic
  const checkDictation = () => {
    if (!selectedLesson || !dictationInput.trim()) return
    const target = selectedLesson.phrases[currentPhraseIndex].french
    const normalizedInput = normalizeForComparison(dictationInput)
    const normalizedTarget = normalizeForComparison(target)

    const inputWords = normalizedInput.split(/\s+/)
    const targetWords = normalizedTarget.split(/\s+/)
    let matched = 0
    targetWords.forEach((word, i) => {
      if (inputWords[i] && (
        inputWords[i] === word ||
        levenshteinDistance(inputWords[i], word) <= Math.max(1, word.length * 0.3)
      )) {
        matched++
      }
    })
    const score = Math.round((matched / targetWords.length) * 100)

    setDictationFeedback({ score, userAnswer: dictationInput.trim(), correctAnswer: target })
    setPracticeStats(prev => ({
      attempts: prev.attempts + 1,
      good: score >= 70 ? prev.good + 1 : prev.good,
      excellent: score >= 90 ? prev.excellent + 1 : prev.excellent,
    }))
    recordPractice()
  }

  // Streak tracking
  const recordPractice = () => {
    const today = new Date().toISOString().split('T')[0]
    if (lastPracticeDate === today) return
    if (lastPracticeDate) {
      const last = new Date(lastPracticeDate)
      const now = new Date(today)
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        setStreak(prev => prev + 1)
      } else if (diffDays > 1) {
        setStreak(1)
      }
    } else {
      setStreak(1)
    }
    setLastPracticeDate(today)
  }

  const getTotalLessons = () => {
    return Object.values(LESSONS).flat().length
  }

  const getTotalMasteredCards = () => {
    return flashcardResults.mastered.size
  }

  const getTotalVocabCards = () => {
    return VOCABULARY_DECKS.reduce((sum, deck) => sum + deck.cards.length, 0)
  }

  // Render different screens based on mode
  const renderHome = () => (
    <div style={styles.homeContainer}>
      <div style={styles.heroSection}>
        <div style={styles.heroDecoration}></div>
        <h1 style={styles.heroTitle}>Parlez</h1>
        <p style={styles.heroSubtitle}>Your complete French learning companion</p>
        <p style={styles.heroDescription}>
          Master pronunciation with real-time feedback, practice real-world conversations,
          and conquer verb conjugation across all tenses.
        </p>
      </div>
      
      {(streak > 0 || completedLessons.size > 0 || getTotalMasteredCards() > 0) && (
        <div style={styles.progressSummary}>
          {streak > 0 && (
            <div style={styles.progressItem}>
              <span style={styles.progressValue}>{streak}</span>
              <span style={styles.progressLabel}>Day Streak</span>
            </div>
          )}
          <div style={styles.progressItem}>
            <span style={styles.progressValue}>{completedLessons.size}/{getTotalLessons()}</span>
            <span style={styles.progressLabel}>Lessons Done</span>
          </div>
          <div style={styles.progressItem}>
            <span style={styles.progressValue}>{getTotalMasteredCards()}/{getTotalVocabCards()}</span>
            <span style={styles.progressLabel}>Vocab Mastered</span>
          </div>
        </div>
      )}

      <div style={styles.modeCards}>
        <button
          style={styles.modeCard}
          onClick={() => setMode('lessons')}
        >
          <div style={styles.modeIcon}>📚</div>
          <h3 style={styles.modeTitle}>Phrase Practice</h3>
          <p style={styles.modeDescription}>
            Learn essential phrases with guided pronunciation and dictation
          </p>
        </button>

        <button
          style={styles.modeCard}
          onClick={() => setMode('flashcards')}
        >
          <div style={styles.modeIcon}>🃏</div>
          <h3 style={styles.modeTitle}>Vocabulary</h3>
          <p style={styles.modeDescription}>
            Build your vocabulary with themed flashcards and spaced review
          </p>
        </button>

        <button
          style={styles.modeCard}
          onClick={() => setMode('conversation')}
        >
          <div style={styles.modeIcon}>💬</div>
          <h3 style={styles.modeTitle}>Conversation</h3>
          <p style={styles.modeDescription}>
            Practice real-world scenarios with an AI conversation partner
          </p>
        </button>

        <button
          style={styles.modeCard}
          onClick={() => setMode('conjugation')}
        >
          <div style={styles.modeIcon}>✍️</div>
          <h3 style={styles.modeTitle}>Verb Conjugation</h3>
          <p style={styles.modeDescription}>
            Practice conjugating regular, irregular, and reflexive verbs across tenses
          </p>
        </button>
      </div>
      
      <div style={styles.features}>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🎤</span>
          <span>Speech Recognition</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>📊</span>
          <span>Pronunciation Scoring</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>🔊</span>
          <span>Native Audio</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>✍️</span>
          <span>Verb Conjugation</span>
        </div>
        <div style={styles.feature}>
          <span style={styles.featureIcon}>💡</span>
          <span>Grammar Tips</span>
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
          <h2 style={styles.sectionTitle}>Choose Your Level</h2>
          
          <div style={styles.levelTabs}>
            {['beginner', 'intermediate', 'advanced'].map(level => (
              <button
                key={level}
                style={{
                  ...styles.levelTab,
                  ...(selectedLevel === level ? styles.levelTabActive : {})
                }}
                onClick={() => setSelectedLevel(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          
          <div style={styles.lessonGrid}>
            {LESSONS[selectedLevel].map(lesson => (
              <button
                key={lesson.id}
                style={{
                  ...styles.lessonCard,
                  ...(completedLessons.has(lesson.id) ? styles.lessonCardCompleted : {})
                }}
                onClick={() => {
                  setSelectedLesson(lesson)
                  setCurrentPhraseIndex(0)
                }}
              >
                <div style={styles.lessonCardHeader}>
                  <h3 style={styles.lessonTitle}>{lesson.title}</h3>
                  {completedLessons.has(lesson.id) && (
                    <span style={styles.completedBadge}>Completed</span>
                  )}
                </div>
                <p style={styles.lessonSubtitle}>{lesson.subtitle}</p>
                <p style={styles.lessonCount}>{lesson.phrases.length} phrases</p>
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
          <div style={styles.progress}>
            {currentPhraseIndex + 1} / {selectedLesson.phrases.length}
          </div>
        </div>
        
        <div style={styles.lessonTitleBar}>
          <h2 style={styles.currentLessonTitle}>{selectedLesson.title}</h2>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showPhonetic}
              onChange={(e) => setShowPhonetic(e.target.checked)}
              style={styles.toggleInput}
            />
            <span style={styles.toggleText}>Show pronunciation guide</span>
          </label>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={dictationMode}
              onChange={(e) => {
                setDictationMode(e.target.checked)
                setDictationInput('')
                setDictationFeedback(null)
              }}
              style={styles.toggleInput}
            />
            <span style={styles.toggleText}>Dictation mode</span>
          </label>
        </div>

        <div style={styles.phraseCard}>
          <div style={styles.phraseMain}>
            {dictationMode ? (
              <p style={styles.frenchPhrase}>???</p>
            ) : (
              <>
                <p style={styles.frenchPhrase}>{currentPhrase.french}</p>
                {showPhonetic && (
                  <p style={styles.phonetic}>[{currentPhrase.phonetic}]</p>
                )}
              </>
            )}
            <p style={styles.englishPhrase}>{currentPhrase.english}</p>
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

        {dictationMode ? (
          <div style={styles.dictationSection}>
            <p style={styles.recordInstructions}>
              Listen to the audio above, then type what you hear
            </p>
            <div style={styles.quizInputArea}>
              <input
                type="text"
                style={{
                  ...styles.conjugationInputField,
                  ...(dictationFeedback
                    ? dictationFeedback.score >= 70 ? styles.inputCorrect : styles.inputIncorrect
                    : {})
                }}
                value={dictationInput}
                onChange={(e) => setDictationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (dictationFeedback) {
                      setDictationInput('')
                      setDictationFeedback(null)
                      nextPhrase()
                    } else {
                      checkDictation()
                    }
                  }
                }}
                placeholder="Type what you hear..."
                disabled={dictationFeedback !== null}
                autoComplete="off"
              />
              {!dictationFeedback ? (
                <button style={styles.checkButton} onClick={checkDictation} disabled={!dictationInput.trim()}>
                  Check
                </button>
              ) : (
                <button style={styles.nextQuestionButton} onClick={() => {
                  setDictationInput('')
                  setDictationFeedback(null)
                  nextPhrase()
                }}>
                  Next
                </button>
              )}
            </div>
            <div style={styles.accentHelper}>
              <span style={styles.accentLabel}>Accents:</span>
              {ACCENT_CHARS.map(char => (
                <button key={char} style={styles.accentButton} onClick={() => setDictationInput(prev => prev + char)} disabled={dictationFeedback !== null} type="button">{char}</button>
              ))}
            </div>
            {dictationFeedback && (
              <div style={{
                ...styles.conjugationFeedbackCard,
                ...(dictationFeedback.score >= 70 ? styles.feedbackExcellent : styles.feedbackPoor)
              }}>
                <p style={styles.conjugationFeedbackText}>
                  {dictationFeedback.score >= 90 ? 'Excellent!' : dictationFeedback.score >= 70 ? 'Good!' : 'Not quite.'} Score: {dictationFeedback.score}%
                </p>
                <p style={styles.correctAnswerText}>{dictationFeedback.correctAnswer}</p>
              </div>
            )}
          </div>
        ) : (
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
        )}

        {!dictationMode && feedback && (
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
                <p style={styles.tipsTitle}>💡 Pronunciation Tips:</p>
                {feedback.tips.map((tip, i) => (
                  <div key={i} style={styles.tip}>
                    <p style={styles.tipRule}>{tip.rule}</p>
                    <p style={styles.tipExamples}>
                      Examples: {tip.examples.join(', ')}
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
                markLessonComplete(selectedLesson.id)
                setSelectedLesson(null)
                resetLesson()
              }}
            >
              Complete
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

  const renderFlashcards = () => (
    <div style={styles.conjugationContainer}>
      <button style={styles.backButton} onClick={() => {
        if (selectedDeck) {
          resetFlashcards()
        } else {
          setMode('home')
        }
      }}>
        {selectedDeck ? 'Back to Decks' : 'Back to Home'}
      </button>

      {!selectedDeck ? (
        <>
          <h2 style={styles.sectionTitle}>Vocabulary Flashcards</h2>
          <p style={styles.sectionSubtitle}>
            Tap a card to flip it. Build your vocabulary with themed decks.
          </p>

          <div style={styles.lessonGrid}>
            {VOCABULARY_DECKS.map(deck => {
              const mastered = getDeckProgress(deck)
              return (
                <button
                  key={deck.id}
                  style={{
                    ...styles.lessonCard,
                    ...(mastered === deck.cards.length ? styles.lessonCardCompleted : {})
                  }}
                  onClick={() => startDeck(deck)}
                >
                  <div style={styles.lessonCardHeader}>
                    <h3 style={styles.lessonTitle}>{deck.title}</h3>
                    {mastered > 0 && (
                      <span style={styles.completedBadge}>{mastered}/{deck.cards.length}</span>
                    )}
                  </div>
                  <p style={styles.lessonSubtitle}>{deck.subtitle}</p>
                  <p style={styles.lessonCount}>{deck.cards.length} cards</p>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <div style={styles.flashcardPractice}>
          <div style={styles.practiceHeader}>
            <h2 style={styles.currentLessonTitle}>{selectedDeck.title}</h2>
            <div style={styles.progress}>
              {flashcardIndex + 1} / {selectedDeck.cards.length}
            </div>
          </div>

          <div
            style={{
              ...styles.flashcard,
              ...(isCardFlipped ? styles.flashcardFlipped : {})
            }}
            onClick={flipCard}
          >
            {!isCardFlipped ? (
              <div style={styles.flashcardFront}>
                <p style={styles.flashcardFrench}>{selectedDeck.cards[flashcardIndex].french}</p>
                {selectedDeck.cards[flashcardIndex].gender && (
                  <span style={styles.flashcardGender}>
                    {selectedDeck.cards[flashcardIndex].gender === 'm' ? 'masculine' : 'feminine'}
                  </span>
                )}
                <p style={styles.flashcardHint}>Tap to reveal</p>
              </div>
            ) : (
              <div style={styles.flashcardBack}>
                <p style={styles.flashcardEnglish}>{selectedDeck.cards[flashcardIndex].english}</p>
                <p style={styles.flashcardExample}>{selectedDeck.cards[flashcardIndex].example}</p>
              </div>
            )}
          </div>

          <div style={styles.flashcardActions}>
            <button
              style={styles.flashcardNeedPractice}
              onClick={() => markFlashcard('learning')}
            >
              Still Learning
            </button>
            <button
              style={styles.flashcardMastered}
              onClick={() => markFlashcard('mastered')}
            >
              Got It
            </button>
          </div>

          <button
            style={{
              ...styles.speakButton,
              ...(isSpeaking ? styles.speakButtonActive : {}),
              display: 'block',
              margin: '1rem auto 0',
            }}
            onClick={() => speakFrench(selectedDeck.cards[flashcardIndex].french)}
            disabled={isSpeaking}
          >
            {isSpeaking ? 'Playing...' : 'Hear Pronunciation'}
          </button>
        </div>
      )}
    </div>
  )

  const renderConjugation = () => (
    <div style={styles.conjugationContainer}>
      <button style={styles.backButton} onClick={() => {
        if (selectedVerb) {
          resetConjugation()
        } else {
          setMode('home')
          resetConjugation()
        }
      }}>
        ← {selectedVerb ? 'Back to Verbs' : 'Back to Home'}
      </button>

      {!selectedVerb ? (
        <>
          <h2 style={styles.sectionTitle}>Verb Conjugation</h2>
          <p style={styles.sectionSubtitle}>
            Practice conjugating French verbs across tenses
          </p>

          <div style={styles.levelTabs}>
            {VERB_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                style={{
                  ...styles.levelTab,
                  ...(conjugationCategory === cat.id ? styles.levelTabActive : {})
                }}
                onClick={() => setConjugationCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={styles.lessonGrid}>
            {getFilteredVerbs().map(verb => (
              <button
                key={verb.infinitive}
                style={styles.verbCard}
                onClick={() => startVerbPractice(verb)}
              >
                <h3 style={styles.verbInfinitive}>{verb.infinitive}</h3>
                <p style={styles.verbEnglish}>{verb.english}</p>
                <p style={styles.verbCategory}>
                  {VERB_CATEGORIES.find(c => c.id === verb.category)?.label}
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={styles.conjugationPractice}>
          <div style={styles.conjugationVerbHeader}>
            <div>
              <h2 style={styles.currentLessonTitle}>{selectedVerb.infinitive}</h2>
              <p style={styles.verbHeaderEnglish}>{selectedVerb.english}</p>
            </div>
            <div style={styles.conjugationScoreBadge}>
              {conjugationScore.total > 0 && (
                <span>{conjugationScore.correct} / {conjugationScore.total}</span>
              )}
            </div>
          </div>

          <div style={styles.tenseTabs}>
            {TENSES.map(tense => (
              <button
                key={tense.id}
                style={{
                  ...styles.tenseTab,
                  ...(selectedTense === tense.id ? styles.tenseTabActive : {})
                }}
                onClick={() => {
                  setSelectedTense(tense.id)
                  setCurrentPronounIndex(0)
                  setConjugationInput('')
                  setConjugationFeedback(null)
                }}
              >
                <span style={styles.tenseLabel}>{tense.label}</span>
                <span style={styles.tenseEnglish}>{tense.english}</span>
              </button>
            ))}
          </div>

          <div style={styles.conjugationQuizCard}>
            <div style={styles.quizPrompt}>
              <p style={styles.quizTenseLabel}>
                {TENSES.find(t => t.id === selectedTense)?.label}
              </p>
              <p style={styles.quizPronoun}>{PRONOUNS[currentPronounIndex]}</p>
              <p style={styles.quizVerbInfinitive}>{selectedVerb.infinitive}</p>
            </div>

            <div style={styles.quizInputArea}>
              <input
                ref={conjugationInputRef}
                type="text"
                style={{
                  ...styles.conjugationInputField,
                  ...(conjugationFeedback
                    ? conjugationFeedback.correct
                      ? styles.inputCorrect
                      : styles.inputIncorrect
                    : {})
                }}
                value={conjugationInput}
                onChange={(e) => setConjugationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (conjugationFeedback) {
                      nextConjugationQuestion()
                    } else {
                      checkConjugation()
                    }
                  }
                }}
                placeholder="Type the conjugated form..."
                disabled={conjugationFeedback !== null}
                autoComplete="off"
                autoCapitalize="off"
              />

              {!conjugationFeedback ? (
                <button
                  style={styles.checkButton}
                  onClick={checkConjugation}
                  disabled={!conjugationInput.trim()}
                >
                  Check
                </button>
              ) : (
                <button
                  style={styles.nextQuestionButton}
                  onClick={nextConjugationQuestion}
                >
                  Next
                </button>
              )}
            </div>

            {conjugationFeedback && (
              <div style={{
                ...styles.conjugationFeedbackCard,
                ...(conjugationFeedback.correct ? styles.feedbackExcellent : styles.feedbackPoor)
              }}>
                <p style={styles.conjugationFeedbackText}>
                  {conjugationFeedback.correct
                    ? 'Correct! Bien joué!'
                    : `Not quite. The correct answer is:`}
                </p>
                {!conjugationFeedback.correct && (
                  <p style={styles.correctAnswerText}>
                    {conjugationFeedback.correctAnswer}
                  </p>
                )}
              </div>
            )}

            <div style={styles.accentHelper}>
              <span style={styles.accentLabel}>Accents:</span>
              {ACCENT_CHARS.map(char => (
                <button
                  key={char}
                  style={styles.accentButton}
                  onClick={() => insertAccentChar(char)}
                  disabled={conjugationFeedback !== null}
                  type="button"
                >
                  {char}
                </button>
              ))}
            </div>

            <div style={styles.pronounProgress}>
              {PRONOUNS.map((p, i) => (
                <span
                  key={p}
                  style={{
                    ...styles.pronounDot,
                    ...(i === currentPronounIndex ? styles.pronounDotActive : {}),
                    ...(i < currentPronounIndex ? styles.pronounDotDone : {})
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <button
            style={styles.grammarTipToggle}
            onClick={() => setShowTenseTip(!showTenseTip)}
          >
            {showTenseTip ? 'Hide' : 'Show'} Grammar Tip
          </button>

          {showTenseTip && TENSE_TIPS[selectedTense] && (
            <div style={styles.grammarTipCard}>
              <h4 style={styles.grammarTipTitle}>{TENSE_TIPS[selectedTense].title}</h4>
              <p style={styles.grammarTipUsage}>{TENSE_TIPS[selectedTense].usage}</p>
              <div style={styles.grammarTipExample}>
                <p style={styles.grammarTipFrench}>{TENSE_TIPS[selectedTense].example}</p>
                <p style={styles.grammarTipEnglish}>{TENSE_TIPS[selectedTense].exampleEn}</p>
              </div>
              <p style={styles.grammarTipFormation}>
                <strong>Formation:</strong> {TENSE_TIPS[selectedTense].formation}
              </p>
            </div>
          )}

          <button
            style={styles.showTableButton}
            onClick={() => setShowConjugationTable(!showConjugationTable)}
          >
            {showConjugationTable ? 'Hide' : 'Show'} Full Conjugation Table
          </button>

          {showConjugationTable && (
            <div style={styles.conjugationTable}>
              <table style={styles.conjTable}>
                <thead>
                  <tr>
                    <th style={styles.conjTh}>Pronoun</th>
                    {TENSES.map(t => (
                      <th key={t.id} style={{
                        ...styles.conjTh,
                        ...(t.id === selectedTense ? styles.conjThActive : {})
                      }}>
                        {t.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRONOUNS.map(pronoun => (
                    <tr key={pronoun}>
                      <td style={styles.conjTdPronoun}>{pronoun}</td>
                      {TENSES.map(t => (
                        <td key={t.id} style={{
                          ...styles.conjTd,
                          ...(t.id === selectedTense ? styles.conjTdActive : {})
                        }}>
                          {selectedVerb.tenses[t.id][pronoun]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {conjugationScore.total > 0 && (
            <div style={styles.statsBar}>
              <span>Answered: {conjugationScore.total}</span>
              <span>Correct: {conjugationScore.correct}</span>
              <span>
                Accuracy: {Math.round((conjugationScore.correct / conjugationScore.total) * 100)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo} onClick={() => navigateTo('home')}>
            <span style={styles.logoIcon}>🇫🇷</span>
            <span style={styles.logoText}>Parlez</span>
          </div>
          <nav style={styles.headerNav}>
            {[
              { id: 'lessons', label: 'Lessons' },
              { id: 'flashcards', label: 'Vocabulary' },
              { id: 'conversation', label: 'Conversation' },
              { id: 'conjugation', label: 'Conjugation' },
            ].map(tab => (
              <button
                key={tab.id}
                style={{
                  ...styles.headerNavTab,
                  ...(mode === tab.id ? styles.headerNavTabActive : {})
                }}
                onClick={() => navigateTo(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      <div style={styles.content}>
        {mode === 'home' && renderHome()}
        {mode === 'lessons' && renderLessons()}
        {mode === 'flashcards' && renderFlashcards()}
        {mode === 'conversation' && renderConversation()}
        {mode === 'conjugation' && renderConjugation()}
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
    padding: '1rem 2rem',
    borderBottom: '1px solid var(--light-border)',
    background: 'rgba(250, 247, 242, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    width: 'fit-content',
  },
  headerNav: {
    display: 'flex',
    gap: '0.25rem',
  },
  headerNavTab: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '20px',
    background: 'transparent',
    color: 'var(--soft-gray)',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  headerNavTabActive: {
    background: 'var(--deep-blue)',
    color: 'white',
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
  lessonCardCompleted: {
    borderColor: 'rgba(5, 150, 105, 0.3)',
    background: 'rgba(5, 150, 105, 0.03)',
  },
  lessonCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  completedBadge: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--success)',
    background: 'rgba(5, 150, 105, 0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
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

  // Conjugation styles
  conjugationContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  verbCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  verbInfinitive: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.35rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.25rem',
  },
  verbEnglish: {
    color: 'var(--soft-gray)',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  },
  verbCategory: {
    color: 'var(--gold)',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  conjugationPractice: {
    animation: 'fadeIn 0.4s ease-out',
  },
  conjugationVerbHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  verbHeaderEnglish: {
    color: 'var(--soft-gray)',
    fontSize: '1rem',
    marginTop: '0.25rem',
  },
  conjugationScoreBadge: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.25rem',
    color: 'var(--deep-blue)',
    fontWeight: 600,
  },
  tenseTabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tenseTab: {
    padding: '0.6rem 1.25rem',
    border: '1px solid var(--light-border)',
    borderRadius: '30px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
  },
  tenseTabActive: {
    background: 'var(--deep-blue)',
    color: 'white',
    borderColor: 'var(--deep-blue)',
  },
  tenseLabel: {
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  tenseEnglish: {
    fontSize: '0.7rem',
    opacity: 0.7,
  },
  conjugationQuizCard: {
    background: 'white',
    border: '1px solid var(--light-border)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  quizPrompt: {
    marginBottom: '2rem',
  },
  quizTenseLabel: {
    fontSize: '0.9rem',
    color: 'var(--gold)',
    fontWeight: 500,
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  quizPronoun: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.5rem',
    color: 'var(--deep-blue)',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  quizVerbInfinitive: {
    fontSize: '1.1rem',
    color: 'var(--soft-gray)',
    fontStyle: 'italic',
  },
  quizInputArea: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  conjugationInputField: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '1.15rem',
    padding: '0.85rem 1.25rem',
    border: '2px solid var(--light-border)',
    borderRadius: '12px',
    outline: 'none',
    width: '320px',
    maxWidth: '100%',
    textAlign: 'center',
    transition: 'border-color 0.2s',
    color: 'var(--deep-blue)',
  },
  inputCorrect: {
    borderColor: 'var(--success)',
    background: 'rgba(5, 150, 105, 0.05)',
  },
  inputIncorrect: {
    borderColor: 'var(--error)',
    background: 'rgba(220, 38, 38, 0.05)',
  },
  checkButton: {
    background: 'var(--deep-blue)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0.85rem 2rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  nextQuestionButton: {
    background: 'var(--gold)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0.85rem 2rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  conjugationFeedbackCard: {
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '1.5rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  conjugationFeedbackText: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  correctAnswerText: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.35rem',
    color: 'var(--deep-blue)',
    fontWeight: 600,
  },
  pronounProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  pronounDot: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    background: 'rgba(26, 42, 74, 0.04)',
    transition: 'all 0.2s',
  },
  pronounDotActive: {
    background: 'var(--deep-blue)',
    color: 'white',
    fontWeight: 600,
  },
  pronounDotDone: {
    background: 'rgba(5, 150, 105, 0.15)',
    color: 'var(--success)',
  },
  showTableButton: {
    background: 'none',
    border: '1px solid var(--light-border)',
    borderRadius: '30px',
    padding: '0.65rem 1.5rem',
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'block',
    margin: '0 auto 1.5rem',
  },
  conjugationTable: {
    overflowX: 'auto',
    marginBottom: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--light-border)',
  },
  conjTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  conjTh: {
    padding: '0.85rem 1rem',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--deep-blue)',
    borderBottom: '2px solid var(--light-border)',
    background: 'rgba(26, 42, 74, 0.03)',
    whiteSpace: 'nowrap',
  },
  conjThActive: {
    background: 'rgba(26, 42, 74, 0.08)',
  },
  conjTdPronoun: {
    padding: '0.75rem 1rem',
    fontWeight: 600,
    color: 'var(--deep-blue)',
    borderBottom: '1px solid var(--light-border)',
    whiteSpace: 'nowrap',
  },
  conjTd: {
    padding: '0.75rem 1rem',
    color: 'var(--soft-gray)',
    borderBottom: '1px solid var(--light-border)',
    whiteSpace: 'nowrap',
  },
  conjTdActive: {
    color: 'var(--deep-blue)',
    fontWeight: 500,
    background: 'rgba(201, 162, 39, 0.06)',
  },

  // Accent helper
  accentHelper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  accentLabel: {
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
    marginRight: '0.25rem',
  },
  accentButton: {
    background: 'rgba(26, 42, 74, 0.06)',
    border: '1px solid var(--light-border)',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    fontSize: '1rem',
    color: 'var(--deep-blue)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    padding: 0,
  },

  // Grammar tips
  grammarTipToggle: {
    background: 'none',
    border: '1px solid var(--gold)',
    borderRadius: '30px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    color: 'var(--gold)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'block',
    margin: '0 auto 1rem',
  },
  grammarTipCard: {
    background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08), rgba(201, 162, 39, 0.02))',
    border: '1px solid rgba(201, 162, 39, 0.25)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    animation: 'fadeIn 0.3s ease-out',
  },
  grammarTipTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.15rem',
    color: 'var(--deep-blue)',
    marginBottom: '0.5rem',
  },
  grammarTipUsage: {
    fontSize: '0.95rem',
    color: 'var(--soft-gray)',
    marginBottom: '0.75rem',
    lineHeight: 1.5,
  },
  grammarTipExample: {
    background: 'white',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '0.75rem',
  },
  grammarTipFrench: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.05rem',
    color: 'var(--deep-blue)',
    fontStyle: 'italic',
    marginBottom: '0.25rem',
  },
  grammarTipEnglish: {
    fontSize: '0.9rem',
    color: 'var(--soft-gray)',
  },
  grammarTipFormation: {
    fontSize: '0.9rem',
    color: 'var(--deep-blue)',
    lineHeight: 1.5,
  },

  // Progress summary
  progressSummary: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    marginTop: '2rem',
    padding: '1.25rem 2rem',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid var(--light-border)',
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  progressValue: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--deep-blue)',
  },
  progressLabel: {
    fontSize: '0.8rem',
    color: 'var(--soft-gray)',
  },

  // Flashcard styles
  flashcardPractice: {
    animation: 'fadeIn 0.4s ease-out',
  },
  flashcard: {
    background: 'white',
    border: '2px solid var(--light-border)',
    borderRadius: '20px',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minHeight: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    userSelect: 'none',
  },
  flashcardFlipped: {
    background: 'var(--deep-blue)',
    borderColor: 'var(--deep-blue)',
  },
  flashcardFront: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  flashcardBack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  flashcardFrench: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2.5rem',
    color: 'var(--deep-blue)',
    fontWeight: 700,
  },
  flashcardGender: {
    fontSize: '0.8rem',
    color: 'var(--gold)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  flashcardHint: {
    fontSize: '0.85rem',
    color: 'var(--soft-gray)',
    marginTop: '0.5rem',
  },
  flashcardEnglish: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '2rem',
    color: 'white',
    fontWeight: 600,
  },
  flashcardExample: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    maxWidth: '400px',
    lineHeight: 1.5,
  },
  flashcardActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  flashcardNeedPractice: {
    background: 'white',
    border: '2px solid var(--warning)',
    borderRadius: '30px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    color: 'var(--warning)',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  flashcardMastered: {
    background: 'var(--success)',
    border: '2px solid var(--success)',
    borderRadius: '30px',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
  },

  // Dictation
  dictationSection: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
}
