import AppBar from './AppBar'

const meta = {
  title: 'Components/AppBar',
  component: AppBar,
  args: {
    onSearch: () => {},
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

export const Default = {
  args: {
    zone: null,
    loading: false,
  },
}

export const WithZone = {
  args: {
    zone: '7b',
    loading: false,
  },
}

export const Loading = {
  args: {
    zone: null,
    loading: true,
  },
}

export const LoadingWithZone = {
  args: {
    zone: '7b',
    loading: true,
  },
}
