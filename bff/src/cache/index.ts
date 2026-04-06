/**
 * Cache layer — in-memory Map for development, Redis for production.
 *
 * The interface is async throughout so the backing store can be swapped
 * transparently. Set REDIS_URL in the environment to activate Redis.
 *
 * TTL constants (seconds):
 *   ZONE    = 30 days  — USDA zones update annually at most
 *   PLANTS  = 24 hours — Seasonal data stable within a day
 *   SPECIES = 7 days   — Trefle species records are very stable
 *   WEATHER = 2 hours  — Conditions change but not minute-to-minute
 */

import Redis from 'ioredis'

export const TTL = {
  ZONE:    60 * 60 * 24 * 30,
  PLANTS:  60 * 60 * 24,
  SPECIES: 60 * 60 * 24 * 7,
  WEATHER: 60 * 60 * 2,
} as const

// ---------------------------------------------------------------------------
// Shared interface
// ---------------------------------------------------------------------------

interface Cache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
  del(key: string): Promise<void>
}

// ---------------------------------------------------------------------------
// In-memory implementation (development / no REDIS_URL)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class InMemoryCache implements Cache {
  private store = new Map<string, CacheEntry<unknown>>()

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.value as T
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }
}

// ---------------------------------------------------------------------------
// Redis implementation (production — REDIS_URL set)
// ---------------------------------------------------------------------------

class RedisCache implements Cache {
  constructor(private client: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key)
    return raw ? (JSON.parse(raw) as T) : null
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
}

// ---------------------------------------------------------------------------
// Factory — selects implementation based on environment
// ---------------------------------------------------------------------------

function createCache(): Cache {
  if (process.env.REDIS_URL) {
    console.log('Cache: Redis')
    return new RedisCache(new Redis(process.env.REDIS_URL))
  }
  console.log('Cache: in-memory (set REDIS_URL to enable Redis)')
  return new InMemoryCache()
}

export const cache = createCache()
