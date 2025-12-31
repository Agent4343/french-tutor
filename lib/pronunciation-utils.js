/**
 * Pronunciation utility functions for the French Tutor app
 */

// French pronunciation rules and common mistakes
export const PRONUNCIATION_RULES = {
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

/**
 * Calculate the Levenshtein distance between two strings.
 * This is used for fuzzy matching of spoken words against target words.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} The edit distance between the two strings
 */
export function levenshteinDistance(a, b) {
  // Handle edge cases
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

/**
 * Check if a spoken word matches a target word within an acceptable edit distance.
 * The threshold is 30% of the word length or 1 character, whichever is larger.
 *
 * @param {string} spokenWord - The word that was spoken
 * @param {string} targetWord - The target word to match against
 * @returns {boolean} True if the words match within the threshold
 */
export function isWordMatch(spokenWord, targetWord) {
  if (!spokenWord || !targetWord) return false

  const normalizedSpoken = spokenWord.toLowerCase().trim()
  const normalizedTarget = targetWord.toLowerCase().trim()

  // Exact match
  if (normalizedSpoken === normalizedTarget) return true

  // Fuzzy match with Levenshtein distance
  const threshold = Math.max(1, Math.floor(normalizedTarget.length * 0.3))
  const distance = levenshteinDistance(normalizedSpoken, normalizedTarget)

  return distance <= threshold
}

/**
 * Calculate pronunciation score based on spoken text vs target phrase.
 * Returns a score from 0-100 representing how well the spoken text matches the target.
 *
 * @param {string} spokenText - The text that was spoken
 * @param {string} targetPhrase - The target phrase to match against
 * @returns {number} Score from 0-100
 */
export function calculatePronunciationScore(spokenText, targetPhrase) {
  if (!spokenText || !targetPhrase) return 0

  const normalizedSpoken = spokenText.toLowerCase().trim()
  const normalizedTarget = targetPhrase.toLowerCase().trim()

  // Handle exact match
  if (normalizedSpoken === normalizedTarget) return 100

  // Word-level comparison
  const spokenWords = normalizedSpoken.split(/\s+/).filter(w => w.length > 0)
  const targetWords = normalizedTarget.split(/\s+/).filter(w => w.length > 0)

  if (targetWords.length === 0) return 0
  if (spokenWords.length === 0) return 0

  let matchedWords = 0
  targetWords.forEach((word, i) => {
    if (spokenWords[i] && isWordMatch(spokenWords[i], word)) {
      matchedWords++
    }
  })

  return Math.round((matchedWords / targetWords.length) * 100)
}

/**
 * Get applicable pronunciation rules for a given phrase.
 * Checks which pronunciation patterns appear in the phrase and returns relevant tips.
 *
 * @param {string} phrase - The French phrase to analyze
 * @returns {Array<{rule: string, examples: string[]}>} Array of applicable rules
 */
export function getApplicablePronunciationRules(phrase) {
  if (!phrase) return []

  const tips = []

  Object.entries(PRONUNCIATION_RULES).forEach(([key, ruleData]) => {
    // Reset regex lastIndex for global patterns
    if (ruleData.pattern.global) {
      ruleData.pattern.lastIndex = 0
    }

    if (ruleData.pattern.test(phrase)) {
      tips.push({
        rule: ruleData.rule,
        examples: ruleData.examples
      })
    }
  })

  return tips
}

/**
 * Determine feedback type based on score.
 *
 * @param {number} score - Score from 0-100
 * @returns {'excellent' | 'good' | 'fair' | 'poor'} Feedback type
 */
export function getFeedbackType(score) {
  if (score >= 90) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

/**
 * Get feedback message based on score.
 *
 * @param {number} score - Score from 0-100
 * @returns {string} Feedback message
 */
export function getFeedbackMessage(score) {
  if (score >= 90) return "Excellent! Tres bien!"
  if (score >= 70) return "Good job! Bon travail! Keep practicing."
  if (score >= 50) return "Getting there! Let's try again."
  return "Let's practice this one more. Listen and try again."
}

/**
 * Analyze pronunciation and generate complete feedback.
 *
 * @param {string} spokenText - The text that was spoken
 * @param {string} targetPhrase - The target phrase to match against
 * @returns {Object} Complete feedback object
 */
export function analyzePronunciation(spokenText, targetPhrase) {
  const score = calculatePronunciationScore(spokenText, targetPhrase)
  const feedbackType = getFeedbackType(score)
  const message = getFeedbackMessage(score)
  const tips = getApplicablePronunciationRules(targetPhrase)

  return {
    type: feedbackType,
    score,
    message,
    spoken: spokenText,
    target: targetPhrase,
    tips: tips.slice(0, 2) // Show max 2 tips
  }
}
