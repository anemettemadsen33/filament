/**
 * Security utilities for sanitizing user input and preventing XSS attacks
 * Uses DOMPurify to clean HTML content before rendering
 */

import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify with strict security settings
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SAFE_FOR_TEMPLATES: true,
  WHOLE_DOCUMENT: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  FORCE_BODY: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Potentially unsafe HTML string
 * @param config - Optional custom DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (
  dirty: string, 
  config?: DOMPurify.Config
): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  const mergedConfig = config ? { ...SANITIZE_CONFIG, ...config } : SANITIZE_CONFIG;
  return DOMPurify.sanitize(dirty, mergedConfig);
};

/**
 * Sanitize plain text by stripping all HTML tags
 * Use this for user-generated content that should not contain any HTML
 * @param dirty - Potentially unsafe string
 * @returns Plain text with all HTML removed
 */
export const sanitizeText = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(dirty, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 * @param url - Potentially unsafe URL string
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const trimmedUrl = url.trim();
  
  // Block javascript:, data:, and vbscript: protocols
  const dangerousProtocols = /^(javascript|data|vbscript):/i;
  if (dangerousProtocols.test(trimmedUrl)) {
    return '';
  }
  
  // Allow only http:, https:, mailto:, and tel: protocols
  const allowedProtocols = /^(https?|mailto|tel):/i;
  const hasProtocol = /^[a-z]+:/i.test(trimmedUrl);
  
  if (hasProtocol && !allowedProtocols.test(trimmedUrl)) {
    return '';
  }
  
  return trimmedUrl;
};

/**
 * Sanitize filename to prevent directory traversal and unsafe characters
 * @param filename - Original filename
 * @returns Safe filename with dangerous characters removed
 */
export const sanitizeFilename = (filename: string): string => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '');
  
  // Remove null bytes and control characters
  safe = safe.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  
  // Remove special characters except dots, dashes, underscores
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length to 255 characters (filesystem limit)
  safe = safe.substring(0, 255);
  
  // Ensure filename is not empty after sanitization
  if (!safe || safe === '.') {
    return 'file';
  }
  
  return safe;
};

/**
 * Sanitize object by sanitizing all string values
 * Useful for sanitizing form data or API responses
 * @param obj - Object with potentially unsafe string values
 * @param stripHtml - If true, strips all HTML; if false, sanitizes HTML
 * @returns Object with sanitized string values
 */
export const sanitizeObject = <T extends Record<string, any>>(
  obj: T, 
  stripHtml: boolean = true
): T => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = (stripHtml ? sanitizeText(value) : sanitizeHtml(value)) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' 
          ? (stripHtml ? sanitizeText(item) : sanitizeHtml(item))
          : item
      ) as T[keyof T];
    } else if (value && typeof value === 'object') {
      sanitized[key as keyof T] = sanitizeObject(value, stripHtml) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
};

/**
 * React hook-friendly sanitizer for use in components
 * Returns sanitized content ready for dangerouslySetInnerHTML
 * @param dirty - Potentially unsafe HTML string
 * @returns Object with __html property containing sanitized HTML
 */
export const useSanitizedHtml = (dirty: string): { __html: string } => {
  return { __html: sanitizeHtml(dirty) };
};

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeFilename,
  sanitizeObject,
  useSanitizedHtml,
};
