import { useState, useEffect } from 'react';
import { LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

type ClientData = {
  id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
};

export function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', profile?.id)
        .maybeSingle();

      if (error) throw error;
      setClientData(client);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Perfil não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Seu treinador precisa criar seu perfil
          </p>
          <button
            onClick={signOut}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Olá, <span className="font-semibold text-gray-900">{profile?.full_name}</span>
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Progresso</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="text-emerald-600" size={32} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Peso Atual</p>
            <p className="text-3xl font-bold text-gray-900">{clientData.current_weight} kg</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Peso Meta</p>
            <p className="text-3xl font-bold text-gray-900">
              {clientData.goal_weight ? `${clientData.goal_weight} kg` : '-'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Altura</p>
            <p className="text-3xl font-bold text-gray-900">{clientData.height} cm</p>
          </div>
        </div>
      </main>
    </div>
  );
}
