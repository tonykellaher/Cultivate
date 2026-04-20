import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

/**
 * Props:
 *   task — LawnTask object from BFF/mock response
 */
export default function LawnCard({ task }) {
  const theme = useTheme()

  return (
    <Card
      component="article"
      tabIndex={0}
      sx={{
        height: '100%',
        '&:focus-visible': {
          outline: `0px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  )
}
