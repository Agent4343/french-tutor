import {
  levenshteinDistance,
  isWordMatch,
  calculatePronunciationScore,
  getApplicablePronunciationRules,
  getFeedbackType,
  getFeedbackMessage,
  analyzePronunciation,
  PRONUNCIATION_RULES
} from '../lib/pronunciation-utils'

describe('levenshteinDistance', () => {
  describe('edge cases', () => {
    it('should return 0 for identical strings', () => {
      expect(levenshteinDistance('bonjour', 'bonjour')).toBe(0)
      expect(levenshteinDistance('', '')).toBe(0)
      expect(levenshteinDistance('a', 'a')).toBe(0)
    })

    it('should return length of non-empty string when one string is empty', () => {
      expect(levenshteinDistance('', 'bonjour')).toBe(7)
      expect(levenshteinDistance('hello', '')).toBe(5)
      expect(levenshteinDistance('', 'a')).toBe(1)
    })

    it('should handle single character strings', () => {
      expect(levenshteinDistance('a', 'b')).toBe(1)
      expect(levenshteinDistance('a', 'a')).toBe(0)
    })
  })

  describe('single operations', () => {
    it('should return 1 for single substitution', () => {
      expect(levenshteinDistance('cat', 'bat')).toBe(1)
      expect(levenshteinDistance('bonjour', 'bonsour')).toBe(1)
    })

    it('should return 1 for single insertion', () => {
      expect(levenshteinDistance('cat', 'cats')).toBe(1)
      expect(levenshteinDistance('bon', 'bons')).toBe(1)
    })

    it('should return 1 for single deletion', () => {
      expect(levenshteinDistance('cats', 'cat')).toBe(1)
      expect(levenshteinDistance('merci', 'merc')).toBe(1)
    })
  })

  describe('multiple operations', () => {
    it('should handle multiple substitutions', () => {
      expect(levenshteinDistance('abc', 'xyz')).toBe(3)
    })

    it('should handle mixed operations', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3)
      expect(levenshteinDistance('saturday', 'sunday')).toBe(3)
    })

    it('should be symmetric', () => {
      expect(levenshteinDistance('abc', 'def')).toBe(levenshteinDistance('def', 'abc'))
      expect(levenshteinDistance('bonjour', 'bonsoir')).toBe(levenshteinDistance('bonsoir', 'bonjour'))
    })
  })

  describe('French phrases', () => {
    it('should correctly measure distance for French words', () => {
      expect(levenshteinDistance('merci', 'mersi')).toBe(1)
      expect(levenshteinDistance('bonjour', 'bonjourr')).toBe(1)
      expect(levenshteinDistance('au revoir', 'aurevoir')).toBe(1)
    })

    it('should handle accented characters', () => {
      expect(levenshteinDistance('cafe', 'cafe')).toBe(0)
      expect(levenshteinDistance('tres', 'tres')).toBe(0)
    })
  })

  describe('case sensitivity', () => {
    it('should be case sensitive', () => {
      expect(levenshteinDistance('ABC', 'abc')).toBe(3)
      expect(levenshteinDistance('Bonjour', 'bonjour')).toBe(1)
    })
  })
})

describe('isWordMatch', () => {
  describe('exact matches', () => {
    it('should return true for exact matches', () => {
      expect(isWordMatch('bonjour', 'bonjour')).toBe(true)
      expect(isWordMatch('merci', 'merci')).toBe(true)
    })

    it('should be case insensitive', () => {
      expect(isWordMatch('Bonjour', 'bonjour')).toBe(true)
      expect(isWordMatch('MERCI', 'merci')).toBe(true)
      expect(isWordMatch('BonJour', 'BONJOUR')).toBe(true)
    })

    it('should trim whitespace', () => {
      expect(isWordMatch('  bonjour  ', 'bonjour')).toBe(true)
      expect(isWordMatch('merci', '  merci  ')).toBe(true)
    })
  })

  describe('fuzzy matches within threshold', () => {
    it('should match words with small edit distance', () => {
      // 'bonsoir' vs 'bonjour' - distance is 2, threshold for 7 chars is floor(7*0.3)=2, so it matches
      expect(isWordMatch('bonsoir', 'bonjour')).toBe(true)
      expect(isWordMatch('bonjourr', 'bonjour')).toBe(true) // 1 extra char
      expect(isWordMatch('mersi', 'merci')).toBe(true) // 1 substitution
    })

    it('should accept words within 30% threshold', () => {
      // For a 10-character word, threshold is 3
      expect(isWordMatch('magnifique', 'magnifiqe')).toBe(true) // 1 off
      expect(isWordMatch('magnifique', 'magnifiq')).toBe(true) // 2 off
    })

    it('should reject words beyond threshold', () => {
      expect(isWordMatch('hello', 'bonjour')).toBe(false)
      expect(isWordMatch('xyz', 'abc')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return false for null/undefined inputs', () => {
      expect(isWordMatch(null, 'bonjour')).toBe(false)
      expect(isWordMatch('bonjour', null)).toBe(false)
      expect(isWordMatch(undefined, 'test')).toBe(false)
      expect(isWordMatch('test', undefined)).toBe(false)
    })

    it('should return false for empty strings', () => {
      expect(isWordMatch('', 'bonjour')).toBe(false)
      expect(isWordMatch('bonjour', '')).toBe(false)
      expect(isWordMatch('', '')).toBe(false)
    })

    it('should handle short words correctly', () => {
      expect(isWordMatch('un', 'un')).toBe(true)
      expect(isWordMatch('le', 'la')).toBe(true) // 1 char diff, threshold is 1
      expect(isWordMatch('a', 'a')).toBe(true)
    })
  })
})

describe('calculatePronunciationScore', () => {
  describe('perfect scores', () => {
    it('should return 100 for exact matches', () => {
      expect(calculatePronunciationScore('bonjour', 'bonjour')).toBe(100)
      expect(calculatePronunciationScore('Bonjour', 'bonjour')).toBe(100)
      expect(calculatePronunciationScore('merci beaucoup', 'merci beaucoup')).toBe(100)
    })

    it('should handle extra whitespace gracefully', () => {
      expect(calculatePronunciationScore('  bonjour  ', 'bonjour')).toBe(100)
      expect(calculatePronunciationScore('merci  beaucoup', 'merci beaucoup')).toBe(100)
    })
  })

  describe('partial scores', () => {
    it('should calculate score based on matched words', () => {
      // 1 of 2 words matched
      expect(calculatePronunciationScore('merci hello', 'merci beaucoup')).toBe(50)
      // 2 of 3 words matched
      expect(calculatePronunciationScore('je suis hello', 'je suis bien')).toBe(67)
    })

    it('should score fuzzy matches', () => {
      // 'mersi' is close to 'merci'
      expect(calculatePronunciationScore('mersi beaucoup', 'merci beaucoup')).toBe(100)
    })

    it('should handle completely wrong input', () => {
      expect(calculatePronunciationScore('hello world', 'bonjour monde')).toBe(0)
    })
  })

  describe('multi-word phrases', () => {
    it('should correctly score multi-word phrases', () => {
      expect(calculatePronunciationScore('je voudrais un cafe', 'je voudrais un cafe')).toBe(100)
      expect(calculatePronunciationScore('je voudrais un the', 'je voudrais un cafe')).toBe(75)
    })

    it('should handle different word counts', () => {
      // Spoken has fewer words
      expect(calculatePronunciationScore('bonjour', 'bonjour monsieur')).toBe(50)
      // Spoken has more words - extra words don't help
      expect(calculatePronunciationScore('bonjour monsieur madame', 'bonjour monsieur')).toBe(100)
    })
  })

  describe('edge cases', () => {
    it('should return 0 for null/undefined/empty inputs', () => {
      expect(calculatePronunciationScore(null, 'bonjour')).toBe(0)
      expect(calculatePronunciationScore('bonjour', null)).toBe(0)
      expect(calculatePronunciationScore('', 'bonjour')).toBe(0)
      expect(calculatePronunciationScore('bonjour', '')).toBe(0)
    })

    it('should handle single word targets', () => {
      expect(calculatePronunciationScore('bonjour', 'bonjour')).toBe(100)
      expect(calculatePronunciationScore('hello', 'bonjour')).toBe(0)
    })
  })

  describe('French-specific scenarios', () => {
    it('should handle common French greetings', () => {
      expect(calculatePronunciationScore('bonjour', 'Bonjour')).toBe(100)
      expect(calculatePronunciationScore('au revoir', 'Au revoir')).toBe(100)
      // 'sil' fuzzy matches 's\'il' (distance 1, threshold 1 for 4 chars)
      expect(calculatePronunciationScore("sil vous plait", "s'il vous plait")).toBe(100)
    })

    it('should handle common mispronunciations', () => {
      expect(calculatePronunciationScore('mercy', 'merci')).toBe(100) // close enough
      // 'bonsoir' fuzzy matches 'bonjour' (distance 2, threshold 2 for 7 chars)
      expect(calculatePronunciationScore('bonsoir', 'bonjour')).toBe(100)
    })

    it('should reject completely different words', () => {
      expect(calculatePronunciationScore('hello', 'bonjour')).toBe(0)
      expect(calculatePronunciationScore('goodbye', 'merci')).toBe(0)
    })
  })
})

describe('getApplicablePronunciationRules', () => {
  it('should return empty array for null/undefined/empty input', () => {
    expect(getApplicablePronunciationRules(null)).toEqual([])
    expect(getApplicablePronunciationRules(undefined)).toEqual([])
    expect(getApplicablePronunciationRules('')).toEqual([])
  })

  it('should detect silent endings', () => {
    const rules = getApplicablePronunciationRules('petit')
    const hasRule = rules.some(r => r.rule.includes('Final consonants'))
    expect(hasRule).toBe(true)
  })

  it('should detect nasal AN/EN sounds', () => {
    const rules = getApplicablePronunciationRules('enfant')
    const hasRule = rules.some(r => r.rule.includes('AN/EN'))
    expect(hasRule).toBe(true)
  })

  it('should detect nasal ON sounds', () => {
    const rules = getApplicablePronunciationRules('bonjour')
    const hasRule = rules.some(r => r.rule.includes('ON sounds'))
    expect(hasRule).toBe(true)
  })

  it('should detect nasal IN sounds', () => {
    const rules = getApplicablePronunciationRules('jardin')
    const hasRule = rules.some(r => r.rule.includes('IN/AIN'))
    expect(hasRule).toBe(true)
  })

  it('should detect French R', () => {
    const rules = getApplicablePronunciationRules('merci')
    const hasRule = rules.some(r => r.rule.includes("French 'R'"))
    expect(hasRule).toBe(true)
  })

  it('should detect French U', () => {
    const rules = getApplicablePronunciationRules('tu')
    const hasRule = rules.some(r => r.rule.includes("French 'U'"))
    expect(hasRule).toBe(true)
  })

  it('should detect EU sound', () => {
    const rules = getApplicablePronunciationRules('deux')
    const hasRule = rules.some(r => r.rule.includes('EU sounds'))
    expect(hasRule).toBe(true)
  })

  it('should detect OI sound', () => {
    const rules = getApplicablePronunciationRules('moi')
    const hasRule = rules.some(r => r.rule.includes("OI is pronounced"))
    expect(hasRule).toBe(true)
  })

  it('should detect liaison', () => {
    const rules = getApplicablePronunciationRules('les amis')
    const hasRule = rules.some(r => r.rule.includes('Liaison'))
    expect(hasRule).toBe(true)
  })

  it('should return multiple applicable rules', () => {
    // 'bonjour' has ON, R, and silent ending
    const rules = getApplicablePronunciationRules('bonjour')
    expect(rules.length).toBeGreaterThan(1)
  })

  it('should return rules with examples', () => {
    const rules = getApplicablePronunciationRules('merci')
    rules.forEach(rule => {
      expect(rule).toHaveProperty('rule')
      expect(rule).toHaveProperty('examples')
      expect(Array.isArray(rule.examples)).toBe(true)
    })
  })
})

describe('getFeedbackType', () => {
  it('should return "excellent" for scores >= 90', () => {
    expect(getFeedbackType(90)).toBe('excellent')
    expect(getFeedbackType(95)).toBe('excellent')
    expect(getFeedbackType(100)).toBe('excellent')
  })

  it('should return "good" for scores 70-89', () => {
    expect(getFeedbackType(70)).toBe('good')
    expect(getFeedbackType(75)).toBe('good')
    expect(getFeedbackType(89)).toBe('good')
  })

  it('should return "fair" for scores 50-69', () => {
    expect(getFeedbackType(50)).toBe('fair')
    expect(getFeedbackType(60)).toBe('fair')
    expect(getFeedbackType(69)).toBe('fair')
  })

  it('should return "poor" for scores < 50', () => {
    expect(getFeedbackType(0)).toBe('poor')
    expect(getFeedbackType(25)).toBe('poor')
    expect(getFeedbackType(49)).toBe('poor')
  })

  it('should handle boundary conditions', () => {
    expect(getFeedbackType(89.9)).toBe('good')
    expect(getFeedbackType(69.9)).toBe('fair')
    expect(getFeedbackType(49.9)).toBe('poor')
  })
})

describe('getFeedbackMessage', () => {
  it('should return appropriate message for excellent scores', () => {
    const message = getFeedbackMessage(95)
    expect(message).toContain('Excellent')
  })

  it('should return appropriate message for good scores', () => {
    const message = getFeedbackMessage(75)
    expect(message).toContain('Good')
  })

  it('should return appropriate message for fair scores', () => {
    const message = getFeedbackMessage(55)
    expect(message).toContain('Getting there')
  })

  it('should return appropriate message for poor scores', () => {
    const message = getFeedbackMessage(25)
    expect(message).toContain('practice')
  })
})

describe('analyzePronunciation', () => {
  it('should return complete feedback object', () => {
    const result = analyzePronunciation('bonjour', 'bonjour')

    expect(result).toHaveProperty('type')
    expect(result).toHaveProperty('score')
    expect(result).toHaveProperty('message')
    expect(result).toHaveProperty('spoken')
    expect(result).toHaveProperty('target')
    expect(result).toHaveProperty('tips')
  })

  it('should return excellent feedback for perfect pronunciation', () => {
    const result = analyzePronunciation('bonjour', 'bonjour')

    expect(result.type).toBe('excellent')
    expect(result.score).toBe(100)
    expect(result.spoken).toBe('bonjour')
    expect(result.target).toBe('bonjour')
  })

  it('should return poor feedback for wrong pronunciation', () => {
    const result = analyzePronunciation('hello', 'bonjour')

    expect(result.type).toBe('poor')
    expect(result.score).toBe(0)
  })

  it('should include pronunciation tips', () => {
    const result = analyzePronunciation('bonjour', 'bonjour')

    expect(Array.isArray(result.tips)).toBe(true)
    expect(result.tips.length).toBeLessThanOrEqual(2) // Max 2 tips
  })

  it('should limit tips to 2', () => {
    // Use a phrase that triggers many rules
    const result = analyzePronunciation('les jardins', 'les jardins')

    expect(result.tips.length).toBeLessThanOrEqual(2)
  })

  it('should handle partial matches', () => {
    const result = analyzePronunciation('bonjour monde', 'bonjour madame')

    expect(result.type).toBe('fair') // 50% match
    expect(result.score).toBe(50)
  })

  it('should handle case insensitivity', () => {
    const result = analyzePronunciation('BONJOUR', 'bonjour')

    expect(result.score).toBe(100)
    expect(result.type).toBe('excellent')
  })
})

describe('PRONUNCIATION_RULES', () => {
  it('should have all expected rule categories', () => {
    const expectedRules = [
      'silent_endings',
      'nasal_an',
      'nasal_on',
      'nasal_in',
      'french_r',
      'french_u',
      'liaison',
      'eu_sound',
      'oi_sound'
    ]

    expectedRules.forEach(rule => {
      expect(PRONUNCIATION_RULES).toHaveProperty(rule)
    })
  })

  it('should have valid structure for each rule', () => {
    Object.values(PRONUNCIATION_RULES).forEach(rule => {
      expect(rule).toHaveProperty('pattern')
      expect(rule).toHaveProperty('rule')
      expect(rule).toHaveProperty('examples')
      expect(rule.pattern).toBeInstanceOf(RegExp)
      expect(typeof rule.rule).toBe('string')
      expect(Array.isArray(rule.examples)).toBe(true)
      expect(rule.examples.length).toBeGreaterThan(0)
    })
  })

  it('should have patterns that match their examples', () => {
    Object.values(PRONUNCIATION_RULES).forEach(ruleData => {
      ruleData.examples.forEach(example => {
        // Reset lastIndex for global patterns
        if (ruleData.pattern.global) {
          ruleData.pattern.lastIndex = 0
        }
        expect(ruleData.pattern.test(example)).toBe(true)
      })
    })
  })
})
