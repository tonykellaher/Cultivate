import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const meta = {
  title: 'Styles/Typography',
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
}

export default meta

const TYPOGRAPHY_VARIANTS = [
  {
    label: 'Headings',
    variants: [
      { name: 'h1', sample: 'Heading 1 — Page Title' },
      { name: 'h2', sample: 'Heading 2 — Section Title' },
      { name: 'h3', sample: 'Heading 3 — Subsection Title' },
      { name: 'h4', sample: 'Heading 4 — Component Title' },
      { name: 'h5', sample: 'Heading 5 — Small Title' },
      { name: 'h6', sample: 'Heading 6 — Smallest Title' },
    ],
  },
  {
    label: 'Body Text',
    variants: [
      { name: 'body1', sample: 'Body 1 — Primary body text for readable content. This is the default body text size used for most content areas and descriptions.' },
      { name: 'body2', sample: 'Body 2 — Secondary body text, slightly smaller than Body 1. Useful for supporting text or content in smaller spaces.' },
    ],
  },
  {
    label: 'Supporting Text',
    variants: [
      { name: 'subtitle1', sample: 'Subtitle 1 — Larger subtitle for grouping content' },
      { name: 'subtitle2', sample: 'Subtitle 2 — Smaller subtitle for component descriptions' },
      { name: 'caption', sample: 'Caption — Small text for labels, hints, and metadata' },
      { name: 'overline', sample: 'Overline — Uppercase labels for categories' },
    ],
  },
  {
    label: 'Interactive',
    variants: [
      { name: 'button', sample: 'Button Text — Text used in buttons and clickable elements' },
    ],
  },
]

function TypographyExample({ variant, sample }) {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <Box sx={{ width: 120, flexShrink: 0 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            fontFamily: 'monospace', 
            color: 'text.secondary',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {variant}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant={variant} component="div">
          {sample}
        </Typography>
      </Box>
    </Box>
  )
}

function TypographySection({ label, variants }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 3, color: 'text.secondary' }}>
        {label}
      </Typography>
      {variants.map((variant) => (
        <TypographyExample key={variant.name} variant={variant.name} sample={variant.sample} />
      ))}
    </Box>
  )
}

export const TypographyShowcase = {
  name: 'Typography Showcase',
  render: () => (
    <Box sx={{ p: 2, maxWidth: 900 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
        Typography System
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Headings use Lora serif, body text uses Inter sans-serif. All variants are optimized for accessibility and readability.
      </Typography>
      
      {TYPOGRAPHY_VARIANTS.map((section) => (
        <TypographySection key={section.label} {...section} />
      ))}
    </Box>
  ),
}

export const FontStacks = {
  name: 'Font Stacks',
  render: () => (
    <Box sx={{ p: 2, maxWidth: 900 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Font Families
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Serif — Lora
        </Typography>
        <Typography variant="h3" sx={{ mb: 2 }}>
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          Used for headings (h1–h6) — weight 600–700
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Sans-serif — Inter
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontSize: '1.25rem' }}>
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          Used for body text, buttons, and UI elements — weight 400–600
        </Typography>
      </Box>
    </Box>
  ),
}

export const ColorExamples = {
  name: 'Text Colors',
  render: () => (
    <Box sx={{ p: 2, maxWidth: 900 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Text Colors
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Text Colors
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
            Primary Text — #1A2420
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            16.1:1 contrast ratio on white (AAA) — Used for main content and headings
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Secondary Text — #4A5E4D
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            5.1:1 contrast ratio on white (AA) — Used for supporting text and captions
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Brand Colors on Text
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" color="primary">
            Primary Brand Color — #2D4A32
          </Typography>
          <Typography variant="h6" color="secondary">
            Secondary Brand Color — #B85C2C  
          </Typography>
          <Typography variant="h6" color="success">
            Success Color — #4A7850
          </Typography>
        </Box>
      </Box>
    </Box>
  ),
}