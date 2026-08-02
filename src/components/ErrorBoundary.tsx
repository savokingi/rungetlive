import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State { return { error } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Что-то пошло не так</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16, fontSize: 14 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            style={{ padding: '12px 24px', borderRadius: 9999, border: 'none', background: 'var(--color-accent)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            На главную
          </button>
        </div>
      )
    }
    return this.props.children
  }
}