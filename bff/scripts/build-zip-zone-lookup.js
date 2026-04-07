/**
 * build-zip-zone-lookup.js
 *
 * One-time script to fetch USDA hardiness zone data for all US zip codes
 * from phzmapi.org and write a comprehensive lookup JSON to src/data/.
 *
 * Usage:
 *   node scripts/build-zip-zone-lookup.js
 *
 * Output:
 *   src/data/zip-zone-lookup.json  (~43k entries, ~2MB)
 *
 * Runtime: ~5–10 minutes depending on network speed.
 * Run locally and commit the output — do not run on Railway.
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

const OUTPUT_PATH = path.join(__dirname, '../src/data/zip-zone-lookup.json')
const CONCURRENCY = 25   // parallel requests at a time — stay polite to phzmapi.org
const RETRY_LIMIT = 2

// ── Zip code list ────────────────────────────────────────────────────────────

// US zip codes range from 00501 to 99950. We generate the full numeric range
// and the API will 404 on invalid ones — those are simply skipped.
function allZipCandidates() {
  const zips = []
  for (let i = 501; i <= 99950; i++) {
    zips.push(String(i).padStart(5, '0'))
  }
  return zips
}

// ── HTTP fetch ───────────────────────────────────────────────────────────────

function fetchZip(zip, attempt = 0) {
  return new Promise((resolve) => {
    const url = `https://phzmapi.org/${zip}.json`
    const req = https.get(url, { timeout: 8000 }, (res) => {
      if (res.statusCode === 404) { resolve(null); return }
      if (res.statusCode !== 200) {
        res.resume()
        if (attempt < RETRY_LIMIT) {
          setTimeout(() => fetchZip(zip, attempt + 1).then(resolve), 500)
        } else {
          resolve(null)
        }
        return
      }

      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        try {
          const data = JSON.parse(body)
          const zone = data.zone
          const coords = data.coordinates || {}
          const lat = coords.lat != null ? parseFloat(coords.lat) : null
          const lon = coords.lon != null ? parseFloat(coords.lon) : null
          if (zone && lat != null && lon != null) {
            resolve({ zone, lat, lon })
          } else {
            resolve(null)
          }
        } catch {
          resolve(null)
        }
      })
    })

    req.on('error', () => {
      if (attempt < RETRY_LIMIT) {
        setTimeout(() => fetchZip(zip, attempt + 1).then(resolve), 500)
      } else {
        resolve(null)
      }
    })

    req.on('timeout', () => {
      req.destroy()
      if (attempt < RETRY_LIMIT) {
        setTimeout(() => fetchZip(zip, attempt + 1).then(resolve), 500)
      } else {
        resolve(null)
      }
    })
  })
}

// ── Batch runner ─────────────────────────────────────────────────────────────

async function runBatch(zips) {
  return Promise.all(zips.map(zip => fetchZip(zip).then(result => ({ zip, result }))))
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const candidates = allZipCandidates()
  const lookup = {}
  let found = 0
  let processed = 0
  const total = candidates.length

  console.log(`Fetching ${total} zip code candidates from phzmapi.org...`)
  console.log(`Concurrency: ${CONCURRENCY} — estimated time: 5–10 minutes\n`)

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY)
    const results = await runBatch(batch)

    for (const { zip, result } of results) {
      if (result) {
        lookup[zip] = result
        found++
      }
    }

    processed += batch.length
    if (processed % 1000 === 0 || processed === total) {
      const pct = ((processed / total) * 100).toFixed(1)
      process.stdout.write(`\r  ${pct}% — ${processed}/${total} processed, ${found} zones found`)
    }
  }

  console.log(`\n\nDone. Writing ${found} entries to ${OUTPUT_PATH}`)
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(lookup, null, 2))
  console.log('Complete.')
}

main().catch(err => { console.error(err); process.exit(1) })
