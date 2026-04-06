import axios from 'axios'
import { cache, TTL } from '../cache'
import type { WeatherContext } from '../types/weather'

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1'

/**
 * Returns current weather context for a location.
 * Coordinates come from the USDA API response so no separate geocoding is needed.
 * If coordinates are unavailable, returns a safe default (no weather overlay).
 */
export async function getWeather(lat?: number, lon?: number): Promise<WeatherContext> {
  if (lat === undefined || lon === undefined) {
    return DEFAULT_WEATHER
  }

  // Round coords to 2 decimal places for cache key stability
  const latR = Math.round(lat * 100) / 100
  const lonR = Math.round(lon * 100) / 100
  const cacheKey = `weather:${latR},${lonR}`

  const cached = await cache.get<WeatherContext>(cacheKey)
  if (cached) return cached

  try {
    const { data } = await axios.get(`${OPEN_METEO_BASE}/forecast`, {
      params: {
        latitude: latR,
        longitude: lonR,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'precipitation_probability_max',
        ].join(','),
        temperature_unit: 'fahrenheit',
        forecast_days: 1,
        timezone: 'auto',
      },
      timeout: 5000,
    })

    const daily = data.daily as Record<string, number[]>
    const tempMax = daily['temperature_2m_max']?.[0] ?? 65
    const tempMin = daily['temperature_2m_min']?.[0] ?? 50
    const precipPct = daily['precipitation_probability_max']?.[0] ?? 0

    const weather: WeatherContext = {
      tempF: Math.round((tempMax + tempMin) / 2),
      frostRisk: tempMin <= 32,
      precipitationPct: precipPct,
    }

    await cache.set(cacheKey, weather, TTL.WEATHER)
    return weather
  } catch {
    // Open-Meteo unavailable — weather overlay is supplementary, degrade gracefully
    return DEFAULT_WEATHER
  }
}

const DEFAULT_WEATHER: WeatherContext = {
  tempF: 65,
  frostRisk: false,
  precipitationPct: 0,
}
