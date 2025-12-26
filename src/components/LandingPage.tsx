import { useState } from 'react';
import { Sparkles, TrendingUp, Dumbbell, UtensilsCrossed, Check, Star, Zap, Crown } from 'lucide-react';
import { Logo } from './Logo';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 animate-fadeIn">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block animate-slideUp">
            <Logo size="lg" />
            <h1 className="text-4xl font-bold text-white mt-8 mb-4">
              Transforme seu corpo com IA
            </h1>
            <p className="text-xl text-gray-400">
              Treinos e dietas personalizados criados por inteligência artificial
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-emerald-600/20 rounded-lg">
                  <Sparkles className="text-emerald-400" size={20} />
                </div>
                <span>IA avançada para planos personalizados</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Dumbbell className="text-blue-400" size={20} />
                </div>
                <span>Treinos adaptados ao seu objetivo</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <UtensilsCrossed className="text-orange-400" size={20} />
                </div>
                <span>Dietas balanceadas e calculadas</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl animate-scaleIn">
            {authMode === 'login' && (
              <LoginForm
                onToggleMode={() => setAuthMode('signup')}
                onForgotPassword={() => setAuthMode('forgot')}
              />
            )}
            {authMode === 'signup' && (
              <SignupForm onToggleMode={() => setAuthMode('login')} />
            )}
            {authMode === 'forgot' && (
              <ForgotPasswordForm onBack={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuth(true);
                }}
                className="px-6 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/50"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full text-emerald-400 mb-8 animate-slideDown">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slideUp">
            Forge seu corpo ideal com{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              IA avançada
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slideUp">
            Plataforma completa de fitness com treinos e dietas gerados por inteligência artificial.
            Acompanhe sua evolução com gráficos detalhados.
          </p>
          <button
            onClick={() => {
              setAuthMode('signup');
              setShowAuth(true);
            }}
            className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg rounded-lg font-semibold transition-all shadow-2xl shadow-emerald-900/50 hover:scale-105 animate-scaleIn"
          >
            Comece gratuitamente
          </button>
        </div>

        <div className="max-w-7xl mx-auto mt-20 grid md:grid-cols-3 gap-8 animate-slideUp">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:scale-105 transition-transform">
            <div className="p-3 bg-emerald-600/20 rounded-xl w-fit mb-4">
              <Sparkles className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">IA Inteligente</h3>
            <p className="text-gray-400">
              Algoritmos avançados criam treinos e dietas personalizados baseados em seus objetivos e características
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:scale-105 transition-transform">
            <div className="p-3 bg-blue-600/20 rounded-xl w-fit mb-4">
              <TrendingUp className="text-blue-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Acompanhamento</h3>
            <p className="text-gray-400">
              Registre suas medições e veja gráficos detalhados da sua evolução ao longo do tempo
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:scale-105 transition-transform">
            <div className="p-3 bg-orange-600/20 rounded-xl w-fit mb-4">
              <Dumbbell className="text-orange-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Personalização Total</h3>
            <p className="text-gray-400">
              Planos adaptados ao seu nível, preferências, restrições e metas específicas
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Planos e Preços
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Escolha o plano ideal para alcançar seus objetivos fitness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-600/30 rounded-lg">
                  <Star className="text-gray-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Básico</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$49</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Até 5 clientes</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Treinos gerados por IA</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Dietas básicas</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Acompanhamento de medidas</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check className="text-gray-600 flex-shrink-0" size={20} />
                  <span className="line-through">Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check className="text-gray-600 flex-shrink-0" size={20} />
                  <span className="line-through">Relatórios avançados</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="w-full py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Começar agora
              </button>
            </div>

            <div className="bg-gradient-to-b from-emerald-900/30 to-gray-800/50 border-2 border-emerald-500/50 rounded-2xl p-8 relative scale-105 shadow-2xl shadow-emerald-900/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-full">
                Mais popular
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-600/30 rounded-lg">
                  <Zap className="text-emerald-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Profissional</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$99</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Até 25 clientes</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Treinos avançados por IA</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Dietas personalizadas completas</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Gráficos de evolução detalhados</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-emerald-400 flex-shrink-0" size={20} />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Check className="text-gray-600 flex-shrink-0" size={20} />
                  <span className="line-through">Marca personalizada</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Escolher plano
              </button>
            </div>

            <div className="bg-gradient-to-b from-amber-900/20 to-gray-800/50 border border-amber-500/30 rounded-2xl p-8 hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-600/30 rounded-lg">
                  <Crown className="text-amber-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white">Premium</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">R$199</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>Clientes ilimitados</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>IA premium com modelos avançados</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>Dietas com plano nutricional completo</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>Relatórios e analytics avançados</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>Suporte 24/7 dedicado</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="text-amber-400 flex-shrink-0" size={20} />
                  <span>Marca personalizada (white label)</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setShowAuth(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Escolher plano
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Todos os planos incluem:</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="text-emerald-400" size={16} />
                <span>7 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-emerald-400" size={16} />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-emerald-400" size={16} />
                <span>Atualizações gratuitas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-emerald-400" size={16} />
                <span>Suporte por email</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <Logo size="md" />
          <p className="mt-4 text-gray-500">
            Transformando vidas através da tecnologia e fitness.
          </p>
          <p className="mt-4 text-gray-600 text-sm">
            2024 ForgeFit. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
