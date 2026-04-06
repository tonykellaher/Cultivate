import { useRef, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'

const TYPE_PALETTE_KEY = {
  vegetable: 'primary',
  herb:      'secondary',
  flower:    'success',
}

const CONTENT_SECTIONS = [
  { key: 'description', label: 'About' },
  { key: 'howToPlant',  label: 'How to Plant' },
  { key: 'careGuide',   label: 'Care Guide' },
  { key: 'harvestTip',  label: 'Harvest Tip' },
]

/**
 * Props:
 *   plant   — Plant object or null (null = drawer closed)
 *   onClose — () => void
 */
export default function DetailDrawer({ plant, onClose }) {
  const theme = useTheme()
  const closeButtonRef = useRef(null)
  const open = !!plant

  const paletteKey = plant ? (TYPE_PALETTE_KEY[plant.type] || 'primary') : 'primary'
  const accentColor = theme.palette[paletteKey].main
  const typeLabel = plant ? plant.type.charAt(0).toUpperCase() + plant.type.slice(1) : ''

  // Move focus to close button when drawer opens
  useEffect(() => {
    if (open && closeButtonRef.current) {
      // Small delay lets the drawer animation start before focus moves
      const id = setTimeout(() => closeButtonRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [open])

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-labelledby="drawer-plant-name"
      PaperProps={{
        sx: { width: { xs: '100%', sm: 440 }, maxWidth: '100vw' },
      }}
    >
      {plant && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Fixed header */}
          <Box
            sx={{
              p: 3,
              pb: 2.5,
              borderBottom: `4px solid ${accentColor}`,
              backgroundColor: 'background.default',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography
                  id="drawer-plant-name"
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700, mb: 0.75 }}
                >
                  {plant.name}
                </Typography>
                <Chip
                  label={typeLabel}
                  size="small"
                  sx={{ backgroundColor: accentColor, color: '#fff', fontWeight: 500 }}
                />
              </Box>
              <IconButton
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close plant details"
                sx={{ mt: -0.5, mr: -1 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable content body */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
            {CONTENT_SECTIONS.map(({ key, label }, index) => (
              <Box key={key}>
                <Typography
                  variant="overline"
                  component="h3"
                  sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                >
                  {label}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.75, mb: 3 }}>
                  {plant[key]}
                </Typography>
                {index < CONTENT_SECTIONS.length - 1 && <Divider sx={{ mb: 3 }} />}
              </Box>
            ))}

            <Divider sx={{ mb: 3 }} />

            {/* Companion Plants */}
            <Box>
              <Typography
                variant="overline"
                component="h3"
                sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
              >
                Companion Plants
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {plant.companionPlants.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: accentColor, color: accentColor }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

        </Box>
      )}
    </Drawer>
  )
}
