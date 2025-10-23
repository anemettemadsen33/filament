import { RoommateProfile, RoommateMatch } from './types'

export function calculateCompatibilityScore(
  profile1: RoommateProfile,
  profile2: RoommateProfile
): {
  score: number
  factors: {
    budget: number
    location: number
    lifestyle: number
    preferences: number
    schedule: number
  }
} {
  const factors = {
    budget: calculateBudgetCompatibility(profile1, profile2),
    location: calculateLocationCompatibility(profile1, profile2),
    lifestyle: calculateLifestyleCompatibility(profile1, profile2),
    preferences: calculatePreferencesCompatibility(profile1, profile2),
    schedule: calculateScheduleCompatibility(profile1, profile2)
  }

  const weights = {
    budget: 0.25,
    location: 0.15,
    lifestyle: 0.25,
    preferences: 0.20,
    schedule: 0.15
  }

  const score = 
    factors.budget * weights.budget +
    factors.location * weights.location +
    factors.lifestyle * weights.lifestyle +
    factors.preferences * weights.preferences +
    factors.schedule * weights.schedule

  return {
    score: Math.round(score),
    factors
  }
}

function calculateBudgetCompatibility(profile1: RoommateProfile, profile2: RoommateProfile): number {
  const overlap = Math.max(
    0,
    Math.min(profile1.budgetMax, profile2.budgetMax) - 
    Math.max(profile1.budgetMin, profile2.budgetMin)
  )
  
  const range1 = profile1.budgetMax - profile1.budgetMin
  const range2 = profile2.budgetMax - profile2.budgetMin
  const avgRange = (range1 + range2) / 2
  
  if (avgRange === 0) return 100
  
  return Math.min(100, (overlap / avgRange) * 100)
}

function calculateLocationCompatibility(profile1: RoommateProfile, profile2: RoommateProfile): number {
  const loc1 = profile1.location.toLowerCase().trim()
  const loc2 = profile2.location.toLowerCase().trim()
  
  if (loc1 === loc2) return 100
  
  const loc1Parts = loc1.split(',').map(p => p.trim())
  const loc2Parts = loc2.split(',').map(p => p.trim())
  
  let matchCount = 0
  const maxParts = Math.max(loc1Parts.length, loc2Parts.length)
  
  for (let i = 0; i < Math.min(loc1Parts.length, loc2Parts.length); i++) {
    if (loc1Parts[i] === loc2Parts[i]) {
      matchCount++
    }
  }
  
  return (matchCount / maxParts) * 100
}

function calculateLifestyleCompatibility(profile1: RoommateProfile, profile2: RoommateProfile): number {
  let score = 0
  let totalFactors = 0

  const commonInterests = profile1.lifestyle.interests.filter(i => 
    profile2.lifestyle.interests.includes(i)
  ).length
  const totalInterests = Math.max(profile1.lifestyle.interests.length, profile2.lifestyle.interests.length)
  if (totalInterests > 0) {
    score += (commonInterests / totalInterests) * 40
  } else {
    score += 20
  }
  totalFactors += 40

  const commonLanguages = profile1.lifestyle.languages.filter(l => 
    profile2.lifestyle.languages.includes(l)
  ).length
  if (commonLanguages > 0) {
    score += 30
  }
  totalFactors += 30

  const cleanlinessScore = Math.max(0, 100 - Math.abs(profile1.preferences.cleanliness - profile2.preferences.cleanliness) * 20)
  score += (cleanlinessScore / 100) * 15
  totalFactors += 15

  const socialScore = Math.max(0, 100 - Math.abs(profile1.preferences.socialLevel - profile2.preferences.socialLevel) * 20)
  score += (socialScore / 100) * 15
  totalFactors += 15

  return (score / totalFactors) * 100
}

function calculatePreferencesCompatibility(profile1: RoommateProfile, profile2: RoommateProfile): number {
  let score = 0
  let totalFactors = 0

  const commonPropertyTypes = profile1.preferences.propertyType.filter(t => 
    profile2.preferences.propertyType.includes(t)
  ).length
  if (commonPropertyTypes > 0) {
    score += 25
  }
  totalFactors += 25

  const commonBedrooms = profile1.preferences.bedrooms.filter(b => 
    profile2.preferences.bedrooms.includes(b)
  ).length
  if (commonBedrooms > 0) {
    score += 20
  }
  totalFactors += 20

  if (profile1.preferences.pets === profile2.preferences.pets) {
    score += 20
  }
  totalFactors += 20

  if (profile1.preferences.smoking === profile2.preferences.smoking) {
    score += 15
  }
  totalFactors += 15

  if (profile1.preferences.workFromHome === profile2.preferences.workFromHome) {
    score += 10
  }
  totalFactors += 10

  if (profile1.preferences.guestsFrequency === profile2.preferences.guestsFrequency) {
    score += 10
  }
  totalFactors += 10

  return (score / totalFactors) * 100
}

function calculateScheduleCompatibility(profile1: RoommateProfile, profile2: RoommateProfile): number {
  if (profile1.preferences.sleepSchedule === 'flexible' || profile2.preferences.sleepSchedule === 'flexible') {
    return 75
  }
  
  if (profile1.preferences.sleepSchedule === profile2.preferences.sleepSchedule) {
    return 100
  }
  
  return 40
}

export function generateMatches(
  userProfile: RoommateProfile,
  allProfiles: RoommateProfile[],
  existingMatches: RoommateMatch[]
): RoommateMatch[] {
  const matches: RoommateMatch[] = []
  
  const existingMatchIds = new Set(existingMatches.map(m => m.matchedProfileId))
  
  const compatibleProfiles = allProfiles.filter(profile => 
    profile.id !== userProfile.id && 
    profile.active &&
    !existingMatchIds.has(profile.id) &&
    meetsLookingForCriteria(userProfile, profile) &&
    meetsLookingForCriteria(profile, userProfile)
  )
  
  for (const profile of compatibleProfiles) {
    const { score, factors } = calculateCompatibilityScore(userProfile, profile)
    
    if (score >= 50) {
      matches.push({
        id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        profileId: userProfile.id,
        matchedProfileId: profile.id,
        matchScore: score,
        compatibilityFactors: factors,
        status: 'pending',
        createdAt: Date.now()
      })
    }
  }
  
  return matches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

function meetsLookingForCriteria(
  seeker: RoommateProfile,
  target: RoommateProfile
): boolean {
  if (seeker.lookingFor.genderPreference && 
      seeker.lookingFor.genderPreference !== 'any' &&
      target.gender !== seeker.lookingFor.genderPreference) {
    return false
  }
  
  if (target.age) {
    const minAge = seeker.lookingFor.ageRangeMin || 18
    const maxAge = seeker.lookingFor.ageRangeMax || 100
    
    if (target.age < minAge || target.age > maxAge) {
      return false
    }
  }
  
  return true
}

export async function generateAIRoommateRecommendation(
  profile1: RoommateProfile,
  profile2: RoommateProfile,
  compatibilityScore: number
): Promise<string> {
  const promptText = `You are a roommate matching expert. Based on these two profiles, provide a brief 2-3 sentence recommendation about their compatibility.

Profile 1: ${profile1.userName}, ${profile1.age} years old, ${profile1.occupation || 'occupation not specified'}
Bio: ${profile1.bio}
Interests: ${profile1.lifestyle.interests.join(', ')}
Cleanliness: ${profile1.preferences.cleanliness}/5, Social: ${profile1.preferences.socialLevel}/5
Budget: $${profile1.budgetMin}-${profile1.budgetMax}

Profile 2: ${profile2.userName}, ${profile2.age} years old, ${profile2.occupation || 'occupation not specified'}
Bio: ${profile2.bio}
Interests: ${profile2.lifestyle.interests.join(', ')}
Cleanliness: ${profile2.preferences.cleanliness}/5, Social: ${profile2.preferences.socialLevel}/5
Budget: $${profile2.budgetMin}-${profile2.budgetMax}

Compatibility Score: ${compatibilityScore}%

Provide a personalized, friendly recommendation highlighting key compatibility factors or potential areas to discuss.`

  try {
    const recommendation = await window.spark.llm(promptText, 'gpt-4o-mini')
    return recommendation
  } catch (error) {
    return `You have a ${compatibilityScore}% compatibility match! You both share similar lifestyle preferences and budget ranges.`
  }
}
