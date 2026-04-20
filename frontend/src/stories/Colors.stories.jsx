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

const PROPOSED_GROUPS = [
  {
    label: 'Semantic — Proposed',
    note: 'New states to complete the palette. Warning has two options — pick the tone that feels most on-brand.',
    tokens: [
      { name: 'Error',              hex: '#9B3B2F', contrast: '6.86:1', level: 'AA'  },
      { name: 'Warning (AA)',       hex: '#8B6914', contrast: '5.09:1', level: 'AA'  },
      { name: 'Warning (AAA)',      hex: '#7A4F0D', contrast: '7.11:1', level: 'AAA' },
      { name: 'Info',               hex: '#3B6E8F', contrast: '5.51:1', level: 'AA'  },
    ],
  },
  {
    label: 'Chip Tints — Proposed',
    note: 'Light fills for chips to differentiate them from buttons. Chip text uses Text Primary (#1A2420) at 10–11:1 AAA on all three.',
    tokens: [
      { name: 'Primary Light',   hex: '#C8D8C9', contrast: '10.72:1 *', level: 'AAA' },
      { name: 'Secondary Light', hex: '#F0D5C4', contrast: '11.40:1 *', level: 'AAA' },
      { name: 'Success Light',   hex: '#C5D9C7', contrast: '10.72:1 *', level: 'AAA' },
    ],
  },
]

const LIGHT_BG = ['#F6F3EE', '#FDFCF9', '#C8D8C9', '#F0D5C4', '#C5D9C7']

function Swatch({ name, hex, contrast, level, proposed }) {
  const isLight = LIGHT_BG.includes(hex)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 160 }}>
      <Box
        sx={{
          height: 80,
          borderRadius: 1,
          backgroundColor: hex,
          border: isLight ? '1px solid rgba(0,0,0,0.1)' : 'none',
          outline: proposed ? '2px dashed rgba(0,0,0,0.2)' : 'none',
          outlineOffset: 2,
          mb: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          p: 0.5,
        }}
      >
        {proposed && (
          <Typography variant="caption" sx={{ fontSize: 9, backgroundColor: 'rgba(255,255,255,0.85)', px: 0.5, borderRadius: 0.5, lineHeight: 1.6 }}>
            proposed
          </Typography>
        )}
      </Box>
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

function ColorSection({ label, tokens, note, proposed }) {
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
          <Swatch key={token.hex} {...token} proposed={proposed} />
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

export const ProposedAdditions = {
  name: 'Proposed Additions',
  render: () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Proposed Additions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Dashed outlines indicate proposed colors not yet in the theme.
      </Typography>
      {PROPOSED_GROUPS.map((group) => (
        <ColorSection key={group.label} {...group} proposed />
      ))}
    </Box>
  ),
}
