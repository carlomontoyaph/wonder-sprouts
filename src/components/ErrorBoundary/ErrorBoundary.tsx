import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Wonder Sprouts] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 22,
          background: '#EFE7D8',
          fontFamily: 'Nunito, system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48 }}>🌱</div>
          <div style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: '#4A3A28',
          }}>
            Something went wrong
          </div>
          <div style={{
            fontSize: 14,
            color: '#8A7C68',
            fontWeight: 600,
            maxWidth: 320,
            lineHeight: 1.4,
          }}>
            Wonder Sprouts hit an unexpected issue. Don't worry — your progress
            is saved.
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            style={{
              marginTop: 8,
              border: 0,
              cursor: 'pointer',
              background: '#E8946A',
              color: '#fff',
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              padding: '14px 32px',
              borderRadius: 18,
            }}
          >
            Reload the app
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
