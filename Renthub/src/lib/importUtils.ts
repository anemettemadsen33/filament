import { Property } from '@/lib/types'

interface ValidationError {
  field: string
  message: string
}

export async function parseCSV(file: File): Promise<Partial<Property>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length < 2) {
          reject(new Error('File is empty or has no data rows'))
          return
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
        const data: Partial<Property>[] = []

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i])
          const row: Record<string, string> = {}
          
          headers.forEach((header, index) => {
            if (values[index] !== undefined) {
              row[header] = values[index].trim().replace(/^"|"$/g, '')
            }
          })
          
          data.push(transformRowToProperty(row))
        }

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

export async function parseExcel(file: File): Promise<Partial<Property>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = await parseExcelData(data)
        
        if (!workbook || workbook.length === 0) {
          reject(new Error('No data found in Excel file'))
          return
        }

        const rows = workbook.map(transformRowToProperty)
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

async function parseExcelData(data: Uint8Array): Promise<Record<string, string>[]> {
  const text = new TextDecoder().decode(data)
  const lines = text.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) return []
  
  const headers = lines[0].split('\t').map(h => h.trim())
  const result: Record<string, string>[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t')
    const row: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header] = values[index].trim()
      }
    })
    
    result.push(row)
  }
  
  return result
}

function transformRowToProperty(row: Record<string, string>): Partial<Property> {
  const property: Partial<Property> = {}

  if (row.title) property.title = String(row.title)
  if (row.description) property.description = String(row.description)
  if (row.price) property.price = parseFloat(String(row.price).replace(/[^0-9.]/g, ''))
  if (row.location) property.location = String(row.location)
  
  if (row.type) {
    const type = String(row.type).toLowerCase()
    if (['apartment', 'house', 'studio', 'condo'].includes(type)) {
      property.type = type as Property['type']
    }
  }
  
  if (row.rentalTerm) {
    const term = String(row.rentalTerm).toLowerCase().replace(/[^a-z-]/g, '')
    if (term === 'short-term' || term === 'shortterm') {
      property.rentalTerm = 'short-term'
    } else if (term === 'long-term' || term === 'longterm') {
      property.rentalTerm = 'long-term'
    }
  }

  if (row.bedrooms) property.bedrooms = parseInt(String(row.bedrooms))
  if (row.bathrooms) property.bathrooms = parseFloat(String(row.bathrooms))
  if (row.area) property.area = parseInt(String(row.area).replace(/[^0-9]/g, ''))

  if (row.images) {
    const imagesStr = String(row.images)
    property.images = imagesStr.split(';').map(img => img.trim()).filter(img => img)
  } else {
    property.images = []
  }

  if (row.amenities) {
    const amenitiesStr = String(row.amenities)
    property.amenities = amenitiesStr.split(';').map(a => a.trim()).filter(a => a)
  } else {
    property.amenities = []
  }

  if (row.ownerName) property.ownerName = String(row.ownerName)
  if (row.ownerEmail) property.ownerEmail = String(row.ownerEmail)
  if (row.ownerPhone) property.ownerPhone = String(row.ownerPhone)

  return property
}

export function validatePropertyData(property: Partial<Property>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!property.title || property.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' })
  } else if (property.title.length < 5) {
    errors.push({ field: 'title', message: 'Title must be at least 5 characters' })
  }

  if (!property.description || property.description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (property.description.length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters' })
  }

  if (!property.price || isNaN(property.price)) {
    errors.push({ field: 'price', message: 'Valid price is required' })
  } else if (property.price <= 0) {
    errors.push({ field: 'price', message: 'Price must be greater than 0' })
  }

  if (!property.location || property.location.trim() === '') {
    errors.push({ field: 'location', message: 'Location is required' })
  }

  if (!property.type) {
    errors.push({ field: 'type', message: 'Property type is required' })
  } else if (!['apartment', 'house', 'studio', 'condo'].includes(property.type)) {
    errors.push({ field: 'type', message: 'Type must be: apartment, house, studio, or condo' })
  }

  if (!property.rentalTerm) {
    errors.push({ field: 'rentalTerm', message: 'Rental term is required' })
  } else if (!['short-term', 'long-term'].includes(property.rentalTerm)) {
    errors.push({ field: 'rentalTerm', message: 'Rental term must be: short-term or long-term' })
  }

  if (!property.bedrooms || isNaN(property.bedrooms)) {
    errors.push({ field: 'bedrooms', message: 'Valid number of bedrooms is required' })
  } else if (property.bedrooms < 0 || property.bedrooms > 20) {
    errors.push({ field: 'bedrooms', message: 'Bedrooms must be between 0 and 20' })
  }

  if (!property.bathrooms || isNaN(property.bathrooms)) {
    errors.push({ field: 'bathrooms', message: 'Valid number of bathrooms is required' })
  } else if (property.bathrooms < 0.5 || property.bathrooms > 20) {
    errors.push({ field: 'bathrooms', message: 'Bathrooms must be between 0.5 and 20' })
  }

  if (!property.area || isNaN(property.area)) {
    errors.push({ field: 'area', message: 'Valid area is required' })
  } else if (property.area < 100 || property.area > 50000) {
    errors.push({ field: 'area', message: 'Area must be between 100 and 50,000 sq ft' })
  }

  if (property.ownerEmail && !isValidEmail(property.ownerEmail)) {
    errors.push({ field: 'ownerEmail', message: 'Invalid email format' })
  }

  return errors
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateSampleCSV(): string {
  const headers = [
    'title',
    'description',
    'price',
    'location',
    'type',
    'rentalTerm',
    'bedrooms',
    'bathrooms',
    'area',
    'images',
    'amenities',
    'ownerName',
    'ownerEmail',
    'ownerPhone'
  ]

  const sampleRows = [
    [
      'Modern Downtown Apartment',
      'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views and modern amenities',
      '2500',
      'New York, NY',
      'apartment',
      'long-term',
      '2',
      '2',
      '1200',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800;https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'WiFi;Air Conditioning;Parking;Gym;Pool;Pet Friendly',
      'John Smith',
      'john.smith@example.com',
      '(555) 123-4567'
    ],
    [
      'Cozy Studio Near University',
      'Perfect for students! Cozy studio apartment within walking distance to campus, fully furnished with all utilities included',
      '1200',
      'Boston, MA',
      'studio',
      'short-term',
      '0',
      '1',
      '450',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'WiFi;Laundry;Furnished;Utilities Included',
      'Sarah Johnson',
      'sarah.j@example.com',
      '(555) 234-5678'
    ],
    [
      'Luxury Family Home with Garden',
      'Spacious 4-bedroom family home with large backyard, modern kitchen, and close to top-rated schools',
      '4500',
      'Los Angeles, CA',
      'house',
      'long-term',
      '4',
      '3',
      '2800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800;https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800;https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'WiFi;Air Conditioning;Heating;Parking;Garden;Pet Friendly;Security System;Fireplace',
      'Michael Chen',
      'mike.chen@example.com',
      '(555) 345-6789'
    ]
  ]

  const csvLines = [headers.join(',')]
  
  sampleRows.forEach(row => {
    const escapedRow = row.map(cell => {
      const cellStr = String(cell)
      if (cellStr.includes(',') || cellStr.includes(';') || cellStr.includes('"')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    })
    csvLines.push(escapedRow.join(','))
  })

  return csvLines.join('\n')
}
