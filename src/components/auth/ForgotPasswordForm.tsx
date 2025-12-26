import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Email enviado!</h2>
          <p className="text-gray-400 mb-6">
            Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
          </p>
          <button
            onClick={onBack}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={onBack}
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <h2 className="text-3xl font-bold text-white mb-2">Esqueceu a senha?</h2>
      <p className="text-gray-400 mb-8">
        Digite seu email e enviaremos instrucoes para redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-500"
            placeholder="seu@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/50"
        >
          {loading ? 'Enviando...' : 'Enviar email de recuperacao'}
        </button>
      </form>
    </div>
  );
}
