import { useState, useEffect } from 'react';
import { Search, Ban, Trash2, CheckCircle, Users, MoreVertical, X, UserCog } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type Client = {
  id: string;
  user_id: string | null;
  trainer_id: string;
  height: number;
  current_weight: number;
  goal_weight: number | null;
  fitness_goal: string;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  trainer: {
    full_name: string;
  } | null;
};

interface ClientsManagementProps {
  onStatsUpdate: () => void;
}

const goalLabels: Record<string, string> = {
  lose_weight: 'Perder Peso',
  gain_muscle: 'Ganhar Massa',
  maintain: 'Manutencao',
  improve_endurance: 'Melhorar Resistencia',
};

export function ClientsManagement({ onStatsUpdate }: ClientsManagementProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [banModal, setBanModal] = useState<{ clientId: string; clientName: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ clientId: string; clientName: string } | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          user_id,
          trainer_id,
          height,
          current_weight,
          goal_weight,
          fitness_goal,
          is_banned,
          ban_reason,
          created_at,
          profiles:user_id (full_name, email),
          trainer:trainer_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients((clientsData as unknown as Client[]) || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanClient = async () => {
    if (!banModal) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
          ban_reason: banReason || 'Sem motivo especificado',
        })
        .eq('id', banModal.clientId);

      if (error) throw error;

      await loadClients();
      onStatsUpdate();
      setBanModal(null);
      setBanReason('');
    } catch (error) {
      console.error('Error banning client:', error);
      alert('Erro ao banir cliente');
    }
  };

  const handleUnbanClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          is_banned: false,
          banned_at: null,
          ban_reason: null,
        })
        .eq('id', clientId);

      if (error) throw error;

      await loadClients();
      onStatsUpdate();
    } catch (error) {
      console.error('Error unbanning client:', error);
      alert('Erro ao desbanir cliente');
    }
  };

  const handleDeleteClient = async () => {
    if (!deleteModal) return;

    try {
      await supabase.from('measurements').delete().eq('client_id', deleteModal.clientId);

      const { data: workouts } = await supabase
        .from('workouts')
        .select('id')
        .eq('client_id', deleteModal.clientId);

      if (workouts && workouts.length > 0) {
        await supabase.from('exercises').delete().in('workout_id', workouts.map(w => w.id));
        await supabase.from('workouts').delete().eq('client_id', deleteModal.clientId);
      }

      const { data: mealPlans } = await supabase
        .from('meal_plans')
        .select('id')
        .eq('client_id', deleteModal.clientId);

      if (mealPlans && mealPlans.length > 0) {
        await supabase.from('meals').delete().in('meal_plan_id', mealPlans.map(m => m.id));
        await supabase.from('meal_plans').delete().eq('client_id', deleteModal.clientId);
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', deleteModal.clientId);

      if (error) throw error;

      await loadClients();
      onStatsUpdate();
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter((client) => {
    const name = client.profiles?.full_name || '';
    const email = client.profiles?.email || '';
    const trainerName = client.trainer?.full_name || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Gerenciar Clientes</h2>
        <p className="text-gray-400">Visualize, edite ou remova clientes da plataforma</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, email ou treinador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Treinador</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Objetivo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Cadastrado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {client.profiles?.full_name || 'Sem conta'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {client.profiles?.email || `${client.current_weight}kg | ${client.height}cm`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UserCog className="text-blue-400" size={16} />
                      <span className="text-white">{client.trainer?.full_name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">
                      {goalLabels[client.fitness_goal] || client.fitness_goal}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {client.is_banned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 text-sm rounded-full border border-red-500/30">
                        <Ban size={14} />
                        Banido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600/20 text-emerald-400 text-sm rounded-full border border-emerald-500/30">
                        <CheckCircle size={14} />
                        Ativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === client.id ? null : client.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {actionMenu === client.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                          {client.is_banned ? (
                            <button
                              onClick={() => {
                                handleUnbanClient(client.id);
                                setActionMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-gray-700 transition-colors text-left"
                            >
                              <CheckCircle size={16} />
                              Desbanir
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setBanModal({
                                  clientId: client.id,
                                  clientName: client.profiles?.full_name || 'Cliente',
                                });
                                setActionMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-orange-400 hover:bg-gray-700 transition-colors text-left"
                            >
                              <Ban size={16} />
                              Banir
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setDeleteModal({
                                clientId: client.id,
                                clientName: client.profiles?.full_name || 'Cliente',
                              });
                              setActionMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors text-left"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {banModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Banir Cliente</h3>
              <button
                onClick={() => {
                  setBanModal(null);
                  setBanReason('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Tem certeza que deseja banir <span className="text-white font-semibold">{banModal.clientName}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Motivo do banimento</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Descreva o motivo..."
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBanModal(null);
                  setBanReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleBanClient}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Banir
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Excluir Cliente</h3>
              <button onClick={() => setDeleteModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Tem certeza que deseja excluir <span className="text-white font-semibold">{deleteModal.clientName}</span>?
              <br />
              <span className="text-red-400 text-sm">Esta acao ira excluir todas as medicoes, treinos e dietas do cliente.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteClient}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
