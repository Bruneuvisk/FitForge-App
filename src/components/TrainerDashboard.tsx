import { useState, useEffect } from 'react';
import { Users, LogOut, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { AddClientModal } from './trainer/AddClientModal';
import { ClientDetails } from './trainer/ClientDetails';

type Client = {
  id: string;
  user_id: string | null;
  trainer_id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
  activity_level: string;
  gender: string | null;
  medical_conditions: string | null;
  dietary_restrictions: string | null;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
};

export function TrainerDashboard() {
  const { profile, signOut } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientAdded = () => {
    loadClients();
    setShowAddClient(false);
  };

  if (selectedClient) {
    return (
      <ClientDetails
        client={selectedClient}
        onBack={() => setSelectedClient(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fadeIn">
      <header className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Olá, <span className="font-semibold text-white">{profile?.full_name}</span>
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel do Treinador
          </h1>
          <p className="text-gray-400">
            Gerencie seus clientes, treinos e dietas
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600/20 rounded-xl">
                <Users className="text-emerald-400" size={32} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total de Clientes</p>
                <p className="text-3xl font-bold text-white">{clients.length}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddClient(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-emerald-900/50"
            >
              <Plus size={18} />
              Adicionar Cliente
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Nenhum cliente ainda</p>
              <p className="text-sm text-gray-500">Clique em "Adicionar Cliente" para começar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-700/30 transition-all text-left group"
                >
                  <div>
                    <p className="font-semibold text-white text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                      {client.profiles?.full_name || 'Cliente sem perfil'}
                    </p>
                    <p className="text-sm text-gray-400">{client.profiles?.email || '-'}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Peso: <span className="font-medium text-emerald-400">{client.current_weight} kg</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Altura: <span className="font-medium text-blue-400">{client.height} cm</span>
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={20} />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onClientAdded={handleClientAdded}
        />
      )}
    </div>
  );
}
