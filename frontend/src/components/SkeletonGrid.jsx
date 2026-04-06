import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'

function SkeletonCard() {
  return (
    <Card sx={{ height: '100%' }}>
      {/* Accent bar placeholder */}
      <Box sx={{ height: 4, backgroundColor: 'action.hover' }} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Skeleton variant="text" width="55%" height={28} />
          <Skeleton variant="rounded" width={72} height={22} sx={{ borderRadius: '16px' }} />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="75%" />
      </CardContent>
    </Card>
  )
}

export default function SkeletonGrid() {
  return (
    <Box aria-busy="true" aria-label="Loading plant recommendations">
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <SkeletonCard />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
