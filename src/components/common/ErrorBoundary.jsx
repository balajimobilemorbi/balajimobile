import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL REACT RENDER ERROR CAUGHT BY BOUNDARY:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#F8F8F8] flex flex-col items-center justify-center p-6 text-center font-mono space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-2xl font-bold">
            📱
          </div>
          <h2 className="font-display font-black text-2xl text-[#F8F8F8]">Balaji Mobile — Store Recovery</h2>
          <p className="text-xs text-[#B8BDC8] max-w-md">
            The store catalog is updating live across devices. Click below to reload the flagship showroom catalog.
          </p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="px-6 py-3 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold text-xs hover:bg-[#D4AF37] transition shadow-lg"
          >
            🔄 Reload Balaji Mobile Store
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
