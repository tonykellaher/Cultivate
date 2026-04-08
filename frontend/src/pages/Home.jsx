import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

import AppBar from '../components/AppBar'
import FilterTabs from '../components/FilterTabs'
import PlantCard from '../components/PlantCard'
import DetailDrawer from '../components/DetailDrawer'
import LawnCard from '../components/LawnCard'
import SkeletonGrid from '../components/SkeletonGrid'
import apiClient from '../api/client'

// Matches FilterTabs tab order: index 0 = All, 1 = vegetable, 2 = herb, 3 = flower
const TAB_TYPES = ['all', 'vegetable', 'herb', 'flower']

function EmptyState() {
  return (
    <Box sx={{ textAlign: 'center', py: 14, px: 2 }}>
      <Typography
        variant="h4"
        component="p"
        sx={{ fontFamily: '"Lora", serif', mb: 1.5, color: 'text.primary' }}
      >
        Grow something great.
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Enter your zip code above to discover what to plant this month.
      </Typography>
    </Box>
  )
}

export default function Home() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  async function handleSearch(zip) {
    setLoading(true)
    setError(null)
    setActiveTab(0)
    try {
      const { data } = await apiClient.get('/api/recommendations', { params: { zip } })
      setResult(data)
    } catch {
      setError('Unable to load recommendations. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredPlants = result
    ? result.plants.filter((p) => activeTab === 0 || p.type === TAB_TYPES[activeTab])
    : []

  return (
    <>
      <AppBar onSearch={handleSearch} zone={result?.zone ?? null} loading={loading} />

      <Box component="main" sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 10 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>

          {/* Error */}
          {error && (
            <Alert severity="error" role="alert" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Pre-search empty state */}
          {!loading && !result && !error && <EmptyState />}

          {/* Loading skeleton */}
          {loading && (
            <Box sx={{ pt: 4 }}>
              <SkeletonGrid />
            </Box>
          )}

          {/* Results */}
          {result && !loading && (
            <>
              {/* ── Plant recommendations ─────────────────────────────── */}
              <Box component="section" aria-labelledby="plants-heading" sx={{ pt: 4 }}>
                <Typography id="plants-heading" variant="h5" component="h2" sx={{ mb: 2 }}>
                  Plant Now
                </Typography>

                <FilterTabs activeTab={activeTab} onChange={setActiveTab} />

                <Box
                  id="tabpanel-plants"
                  role="tabpanel"
                  aria-labelledby={`tab-${TAB_TYPES[activeTab]}`}
                  sx={{ pt: 3 }}
                >
                  {filteredPlants.length > 0 ? (
                    <Grid container spacing={2}>
                      {filteredPlants.map((plant) => (
                        <Grid item xs={12} sm={6} md={3} key={plant.id}>
                          <PlantCard plant={plant} onClick={setSelected} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                      No {TAB_TYPES[activeTab]}s recommended for your zone this month.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* ── Lawn care ─────────────────────────────────────────── */}
              {result.lawnTasks?.length > 0 && (
                <Box component="section" aria-labelledby="lawn-heading" sx={{ pt: 7 }}>
                  <Typography
                    id="lawn-heading"
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2, color: 'text.secondary' }}
                  >
                    Lawn Care This Month
                  </Typography>
                  <Grid container spacing={2}>
                    {result.lawnTasks.map((task) => (
                      <Grid item xs={12} sm={4} key={task.id}>
                        <LawnCard task={task} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}

        </Container>
      </Box>

      <DetailDrawer plant={selected} onClose={() => setSelected(null)} />
    </>
  )
}
