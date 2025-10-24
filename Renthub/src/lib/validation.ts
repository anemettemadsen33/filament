/**
 * Comprehensive Zod validation schemas for the entire application
 * Includes schemas for Auth, Vehicles, Messages, Purchases, and File Uploads
 */

import { z } from 'zod';

// ============================================================================
// Common/Shared Schemas
// ============================================================================

/**
 * Email validation with comprehensive checks
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim();

/**
 * Password validation with strong security requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

/**
 * URL validation
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must be less than 2048 characters')
  .optional();

/**
 * Positive number validation
 */
export const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Price validation (allows decimals, must be positive)
 */
export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .max(999999999, 'Price exceeds maximum value')
  .multipleOf(0.01, 'Price must have at most 2 decimal places');

// ============================================================================
// Authentication Schemas
// ============================================================================

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: z.string(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  phone: phoneSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url().optional(),
});

// ============================================================================
// Vehicle/Property CRUD Schemas
// ============================================================================

/**
 * Property/Vehicle type enum
 */
export const propertyTypeSchema = z.enum([
  'apartment',
  'house',
  'condo',
  'studio',
  'room',
  'loft',
  'townhouse',
  'villa',
]);

/**
 * Property status enum
 */
export const propertyStatusSchema = z.enum([
  'available',
  'rented',
  'pending',
  'maintenance',
  'unavailable',
]);

/**
 * Create vehicle/property schema
 */
export const createPropertySchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  type: propertyTypeSchema,
  price: priceSchema,
  priceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  address: z.object({
    street: z.string().min(1, 'Street is required').max(200).trim(),
    city: z.string().min(1, 'City is required').max(100).trim(),
    state: z.string().min(1, 'State is required').max(100).trim(),
    zipCode: z.string().min(1, 'ZIP code is required').max(20).trim(),
    country: z.string().min(1, 'Country is required').max(100).trim(),
  }),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  area: z.number().positive('Area must be positive').max(100000),
  amenities: z.array(z.string()).max(50, 'Maximum 50 amenities allowed'),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(20),
  availability: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
  }),
  rules: z.string().max(2000).optional(),
  petFriendly: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
});

/**
 * Update property schema (all fields optional)
 */
export const updatePropertySchema = createPropertySchema.partial();

/**
 * Delete property schema
 */
export const deletePropertySchema = z.object({
  id: z.string().uuid('Invalid property ID'),
  confirmDeletion: z.boolean().refine((val) => val === true, {
    message: 'You must confirm deletion',
  }),
});

// ============================================================================
// Messages & Chat Schemas
// ============================================================================

/**
 * Create message schema
 */
export const createMessageSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient ID'),
  propertyId: z.string().uuid().optional(),
  subject: z.string().min(1).max(200).trim().optional(),
  content: z
    .string()
    .min(1, 'Message content is required')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments').optional(),
});

/**
 * Chat room schema
 */
export const chatRoomSchema = z.object({
  participants: z.array(z.string().uuid()).min(2, 'At least 2 participants required').max(10),
  propertyId: z.string().uuid().optional(),
  name: z.string().max(100).optional(),
});

/**
 * Message filter schema
 */
export const messageFilterSchema = z.object({
  status: z.enum(['unread', 'read', 'archived', 'all']).optional(),
  propertyId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================================================
// Purchase & Leasing Schemas
// ============================================================================

/**
 * Booking/Purchase schema
 */
export const createBookingSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  checkInDate: z.string().datetime('Invalid check-in date'),
  checkOutDate: z.string().datetime('Invalid check-out date'),
  guests: z.number().int().min(1, 'At least 1 guest required').max(20),
  specialRequests: z.string().max(1000).optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
  totalPrice: priceSchema,
}).refine(
  (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }
);

/**
 * Leasing agreement schema
 */
export const createLeaseSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  monthlyRent: priceSchema,
  securityDeposit: priceSchema,
  tenants: z.array(
    z.object({
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      email: emailSchema,
      phone: phoneSchema,
    })
  ).min(1).max(10),
  terms: z.string().min(50, 'Terms must be at least 50 characters').max(10000),
  signatureRequired: z.boolean(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Payment schema
 */
export const paymentSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  amount: priceSchema,
  currency: z.string().length(3, 'Currency must be 3-letter code (e.g., USD)'),
  method: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto']),
  cardNumber: z.string().regex(/^\d{13,19}$/, 'Invalid card number').optional(),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry (MM/YY)').optional(),
  cardCVV: z.string().regex(/^\d{3,4}$/, 'Invalid CVV').optional(),
  billingAddress: z.object({
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    zipCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  }).optional(),
});

// ============================================================================
// File Upload Validation Schemas
// ============================================================================

/**
 * Allowed file types
 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 8;

/**
 * Single file upload validation
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: `File type must be one of: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    })
    .refine((file) => {
      // Sanitize filename
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      return sanitizedName.length > 0 && sanitizedName.length <= 255;
    }, {
      message: 'Invalid filename',
    }),
});

/**
 * Multiple file upload validation
 */
export const multipleFileUploadSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(MAX_FILES, `Maximum ${MAX_FILES} files allowed`)
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      {
        message: `Each file must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    )
    .refine(
      (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
      {
        message: `All files must be one of: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      }
    ),
});

// ============================================================================
// Search & Filter Schemas
// ============================================================================

/**
 * Property search schema with debounced API calls
 */
export const propertySearchSchema = z.object({
  query: z.string().max(200).trim().optional(),
  type: propertyTypeSchema.optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  amenities: z.array(z.string()).max(20).optional(),
  petFriendly: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  availableFrom: z.string().datetime().optional(),
  availableUntil: z.string().datetime().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'date_asc', 'date_desc', 'relevance']).optional(),
  page: z.number().int().min(1).optional(),
  perPage: z.number().int().min(1).max(100).optional(),
}).refine(
  (data) => {
    if (data.minPrice && data.maxPrice) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than or equal to minimum price',
    path: ['maxPrice'],
  }
);

// ============================================================================
// Export Type Inference
// ============================================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type DeletePropertyInput = z.infer<typeof deletePropertySchema>;

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type ChatRoomInput = z.infer<typeof chatRoomSchema>;
export type MessageFilterInput = z.infer<typeof messageFilterSchema>;

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateLeaseInput = z.infer<typeof createLeaseSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;

export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type MultipleFileUploadInput = z.infer<typeof multipleFileUploadSchema>;

export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
