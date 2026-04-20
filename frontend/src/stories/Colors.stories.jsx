import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const meta = {
  title: 'Styles/Colors',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
}

export default meta

const PALETTE_GROUPS = [
  {
    label: 'Brand',
    tokens: [
      { name: 'Primary',        hex: '#2D4A32', contrast: '7.2:1',  level: 'AAA' },
      { name: 'Secondary',      hex: '#B85C2C', contrast: '4.6:1',  level: 'AA'  },
      { name: 'Success',        hex: '#4A7850', contrast: '4.8:1',  level: 'AA'  },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { name: 'Text Primary',   hex: '#1A2420', contrast: '16.1:1', level: 'AAA' },
      { name: 'Text Secondary', hex: '#4A5E4D', contrast: '5.1:1',  level: 'AA'  },
    ],
  },
  {
    label: 'Background',
    tokens: [
      { name: 'Default',        hex: '#F6F3EE', contrast: null,      level: null  },
      { name: 'Paper',          hex: '#FDFCF9', contrast: null,      level: null  },
    ],
  },
]

const LIGHT_BG = ['#F6F3EE', '#FDFCF9']

function Swatch({ name, hex, contrast, level }) {
  const isLight = LIGHT_BG.includes(hex)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 160 }}>
      <Box
        sx={{
          height: 80,
          borderRadius: 1,
          backgroundColor: hex,
          border: isLight ? '1px solid rgba(0,0,0,0.1)' : 'none',
          mb: 1,
        }}
      />
      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
        {hex}
      </Typography>
      {contrast && (
        <Typography variant="caption" color="text.secondary">
          {contrast} on white · <strong>{level}</strong>
        </Typography>
      )}
    </Box>
  )
}

function ColorSection({ label, tokens, note }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
        {label}
      </Typography>
      {note && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, maxWidth: 560 }}>
          * {note}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {tokens.map((token) => (
          <Swatch key={token.hex} {...token} />
        ))}
      </Box>
    </Box>
  )
}

export const CurrentPalette = {
  name: 'Current Palette',
  render: () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Current Palette
      </Typography>
      {PALETTE_GROUPS.map((group) => (
        <ColorSection key={group.label} {...group} />
      ))}
    </Box>
  ),
}