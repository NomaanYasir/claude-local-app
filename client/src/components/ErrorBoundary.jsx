import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){ super(props); this.state = { hasError:false, error:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, error: err }; }
  componentDidCatch(err, info){
    console.error('Uncaught render error', err, info);
  }
  render(){
    if (this.state.hasError) {
      return (
        <div className="fatal-error" role="alert">
          <h2>Something went wrong</h2>
          <p>We're sorry — the application encountered an error. Try refreshing the page.</p>
          <details style={{whiteSpace:'pre-wrap'}}>
            {String(this.state.error && this.state.error.message || this.state.error)}
          </details>
        </div>
      )
    }
    return this.props.children;
  }
}
