import { useState } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'

export default function AppBar({ onSearch, zone, loading }) {
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')

  function validate(value) {
    if (!/^\d{5}$/.test(value)) return 'Enter a valid 5-digit zip code'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate(input)
    if (error) {
      setInputError(error)
      return
    }
    setInputError('')
    onSearch(input)
  }

  function handleChange(e) {
    // Strip non-numeric characters and cap at 5 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 5)
    setInput(value)
    if (inputError && /^\d{5}$/.test(value)) setInputError('')
  }

  return (
    <MuiAppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}
    >
      <Toolbar sx={{ gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, py: { xs: 1.5, sm: 0 } }}>
        {/* Wordmark */}
        <Typography
          variant="h6"
          component="h1"
          sx={{ fontFamily: '"Lora", serif', fontWeight: 700, color: 'primary.main', flexShrink: 0 }}
        >
          Cultivate
        </Typography>

        {/* Zip code search form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          role="search"
          aria-label="Find plants by zip code"
          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexGrow: 1, maxWidth: 380 }}
        >
          <TextField
            placeholder="Enter your zip code"
            value={input}
            onChange={handleChange}
            error={!!inputError}
            helperText={inputError}
            inputProps={{
              'aria-label': 'Zip code',
              inputMode: 'numeric',
              maxLength: 5,
            }}
            FormHelperTextProps={{ role: 'alert' }}
            disabled={loading}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            type="submit"
            aria-label="Search"
            disabled={loading}
            color="primary"
            sx={{ mt: '4px' }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Zone pill — live region always in DOM so screen readers register it on mount */}
        <Box aria-live="polite" aria-atomic="true" sx={{ ml: { sm: 'auto' } }}>
          {zone && (
            <Chip
              label={`Zone ${zone}`}
              color="primary"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
      </Toolbar>
    </MuiAppBar>
  )
}
