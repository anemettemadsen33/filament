/**
 * Debounce and rate limiting utilities for API calls
 * Prevents excessive API requests and improves performance
 */

/**
 * Debounce function - delays execution until after wait time has passed since last call
 * Useful for search inputs, scroll events, resize events
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @param immediate - If true, trigger on leading edge instead of trailing
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait period
 * Useful for scroll events, window resize, continuous API calls
 * @param func - Function to throttle
 * @param limit - Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: any;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    return lastResult;
  };
}

/**
 * Rate limiter class for API calls
 * Implements token bucket algorithm for rate limiting
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  /**
   * @param maxTokens - Maximum number of tokens (max burst size)
   * @param refillRate - Number of tokens to add per second
   */
  constructor(maxTokens: number = 10, refillRate: number = 1) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on time elapsed
   */
  private refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000; // convert to seconds
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  /**
   * Try to consume tokens for an API call
   * @param tokens - Number of tokens to consume (default 1)
   * @returns true if tokens were consumed, false if rate limit exceeded
   */
  public tryConsume(tokens: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  /**
   * Get time until next token is available (in milliseconds)
   */
  public getTimeUntilNextToken(): number {
    this.refill();
    
    if (this.tokens >= 1) {
      return 0;
    }
    
    const tokensNeeded = 1 - this.tokens;
    return (tokensNeeded / this.refillRate) * 1000;
  }

  /**
   * Reset the rate limiter
   */
  public reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

/**
 * Create a rate-limited version of a function
 * @param func - Function to rate limit
 * @param maxCalls - Maximum number of calls allowed
 * @param perMilliseconds - Time window in milliseconds
 * @returns Rate-limited function
 */
export function rateLimit<T extends (...args: any[]) => any>(
  func: T,
  maxCalls: number = 10,
  perMilliseconds: number = 1000
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  const limiter = new RateLimiter(maxCalls, maxCalls / (perMilliseconds / 1000));

  return async function rateLimitedFunction(...args: Parameters<T>): Promise<ReturnType<T> | null> {
    if (limiter.tryConsume()) {
      return func(...args);
    } else {
      const waitTime = limiter.getTimeUntilNextToken();
      console.warn(`Rate limit exceeded. Try again in ${waitTime}ms`);
      return null;
    }
  };
}

/**
 * Debounced search hook for React
 * Usage: const debouncedSearch = useDebouncedSearch(searchFunction, 300);
 */
export function createDebouncedSearch<T extends (...args: any[]) => any>(
  searchFunc: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  return debounce(searchFunc, delay);
}

/**
 * Create a rate-limited API call wrapper
 * Useful for search filters, autocomplete, etc.
 */
export class ApiRateLimiter {
  private limiters: Map<string, RateLimiter>;
  
  constructor() {
    this.limiters = new Map();
  }

  /**
   * Get or create a rate limiter for a specific endpoint
   */
  private getLimiter(endpoint: string, maxTokens: number, refillRate: number): RateLimiter {
    if (!this.limiters.has(endpoint)) {
      this.limiters.set(endpoint, new RateLimiter(maxTokens, refillRate));
    }
    return this.limiters.get(endpoint)!;
  }

  /**
   * Execute an API call with rate limiting
   * @param endpoint - API endpoint identifier
   * @param apiCall - Function that makes the API call
   * @param maxCallsPerSecond - Maximum calls allowed per second (default: 2)
   * @param maxBurst - Maximum burst size (default: 5)
   */
  async execute<T>(
    endpoint: string,
    apiCall: () => Promise<T>,
    maxCallsPerSecond: number = 2,
    maxBurst: number = 5
  ): Promise<T | null> {
    const limiter = this.getLimiter(endpoint, maxBurst, maxCallsPerSecond);

    if (limiter.tryConsume()) {
      try {
        return await apiCall();
      } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        throw error;
      }
    } else {
      const waitTime = limiter.getTimeUntilNextToken();
      console.warn(`Rate limit for ${endpoint} exceeded. Try again in ${waitTime}ms`);
      return null;
    }
  }

  /**
   * Reset rate limiter for a specific endpoint
   */
  reset(endpoint: string): void {
    const limiter = this.limiters.get(endpoint);
    if (limiter) {
      limiter.reset();
    }
  }

  /**
   * Reset all rate limiters
   */
  resetAll(): void {
    this.limiters.forEach(limiter => limiter.reset());
  }
}

/**
 * Global API rate limiter instance
 */
export const apiRateLimiter = new ApiRateLimiter();

/**
 * Debounced API call wrapper for search/filter operations
 * Combines debouncing with rate limiting
 */
export function createDebouncedApiCall<T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  debounceMs: number = 300,
  endpoint: string = 'default'
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  let abortController: AbortController | null = null;

  const debouncedCall = debounce(
    async (...args: Parameters<T>) => {
      // Cancel previous request if it exists
      if (abortController) {
        abortController.abort();
      }

      // Create new abort controller
      abortController = new AbortController();

      // Execute with rate limiting
      return apiRateLimiter.execute(
        endpoint,
        () => apiCall(...args),
        2, // 2 calls per second
        5  // burst of 5
      );
    },
    debounceMs
  );

  return debouncedCall as (...args: Parameters<T>) => Promise<ReturnType<T> | null>;
}

/**
 * Hook-friendly debounced value
 * Returns a debounced version of the input value
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// React import for the hook
import React from 'react';

export default {
  debounce,
  throttle,
  rateLimit,
  RateLimiter,
  ApiRateLimiter,
  apiRateLimiter,
  createDebouncedSearch,
  createDebouncedApiCall,
  useDebouncedValue,
};
