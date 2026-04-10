import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../src/theme'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story) =>
      React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(CssBaseline, null),
        React.createElement(Story, null)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
  },
}

export default preview
