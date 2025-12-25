import { useState } from 'react';
import { Logo } from './Logo';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <Logo size="lg" />
            <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-4">
              Transforme seu corpo com IA
            </h1>
            <p className="text-xl text-gray-600">
              Treinos e dietas personalizados criados por inteligência artificial
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {authMode === 'login' ? (
              <LoginForm onToggleMode={() => setAuthMode('signup')} />
            ) : (
              <SignupForm onToggleMode={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuth(true);
                }}
                className="px-6 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Forge seu corpo ideal com{' '}
            <span className="text-emerald-600">IA avançada</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma completa de fitness com treinos e dietas gerados por inteligência artificial
          </p>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuth(true);
            }}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg rounded-lg font-semibold transition-all shadow-lg"
          >
            Comece gratuitamente
          </button>
        </div>
      </section>
    </div>
  );
}
