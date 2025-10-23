import { Property, FilterState } from './types'
import { SavedSearch } from '@/components/SavedSearchesPanel'

export function propertyMatchesFilters(property: Property, filters: FilterState): boolean {
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    const searchableText = `${property.title} ${property.description} ${property.location}`.toLowerCase()
    if (!searchableText.includes(query)) {
      return false
    }
  }

  if (filters.propertyType !== 'all' && property.type !== filters.propertyType) {
    return false
  }

  if (filters.rentalTerm !== 'all' && property.rentalTerm !== filters.rentalTerm) {
    return false
  }

  if (property.price < filters.minPrice || property.price > filters.maxPrice) {
    return false
  }

  if (filters.bedrooms !== 'all') {
    const minBedrooms = parseInt(filters.bedrooms)
    if (property.bedrooms < minBedrooms) {
      return false
    }
  }

  return true
}

export function findMatchingSavedSearches(
  property: Property,
  savedSearches: SavedSearch[]
): SavedSearch[] {
  return savedSearches.filter(search => {
    if (!search.alertEnabled) return false
    return propertyMatchesFilters(property, search.filters)
  })
}

export function shouldSendAlert(search: SavedSearch): boolean {
  if (!search.alertEnabled || search.alertFrequency === 'never') {
    return false
  }

  if (search.alertFrequency === 'instant') {
    return true
  }

  const now = Date.now()
  const lastSent = search.lastAlertSent || 0

  if (search.alertFrequency === 'daily') {
    const oneDayMs = 24 * 60 * 60 * 1000
    return now - lastSent >= oneDayMs
  }

  if (search.alertFrequency === 'weekly') {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000
    return now - lastSent >= oneWeekMs
  }

  return false
}
