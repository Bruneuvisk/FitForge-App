import { useState, useEffect } from 'react';
import { Search, Plus, Ban, Trash2, CheckCircle, Users, MoreVertical, X, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AddTrainerModal } from './AddTrainerModal';

type Trainer = {
  id: string;
  full_name: string;
  email: string;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  client_count: number;
};

interface TrainersManagementProps {
  onStatsUpdate: () => void;
}

export function TrainersManagement({ onStatsUpdate }: TrainersManagementProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [banModal, setBanModal] = useState<{ trainerId: string; trainerName: string } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ trainerId: string; trainerName: string } | null>(null);
  const [promoteModal, setPromoteModal] = useState<{ trainerId: string; trainerName: string } | null>(null);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const { data: trainersData, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, is_banned, ban_reason, created_at')
        .eq('role', 'trainer')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const trainersWithClients = await Promise.all(
        (trainersData || []).map(async (trainer) => {
          const { count } = await supabase
            .from('clients')
            .select('id', { count: 'exact', head: true })
            .eq('trainer_id', trainer.id);

          return {
            ...trainer,
            client_count: count || 0,
          };
        })
      );

      setTrainers(trainersWithClients);
    } catch (error) {
      console.error('Error loading trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanTrainer = async () => {
    if (!banModal) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
          ban_reason: banReason || 'Sem motivo especificado',
        })
        .eq('id', banModal.trainerId);

      if (error) throw error;

      await loadTrainers();
      onStatsUpdate();
      setBanModal(null);
      setBanReason('');
    } catch (error) {
      console.error('Error banning trainer:', error);
      alert('Erro ao banir treinador');
    }
  };

  const handleUnbanTrainer = async (trainerId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: false,
          banned_at: null,
          ban_reason: null,
        })
        .eq('id', trainerId);

      if (error) throw error;

      await loadTrainers();
      onStatsUpdate();
    } catch (error) {
      console.error('Error unbanning trainer:', error);
      alert('Erro ao desbanir treinador');
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!promoteModal) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', promoteModal.trainerId);

      if (error) throw error;

      await loadTrainers();
      onStatsUpdate();
      setPromoteModal(null);
    } catch (error) {
      console.error('Error promoting trainer:', error);
      alert('Erro ao promover treinador');
    }
  };

  const handleDeleteTrainer = async () => {
    if (!deleteModal) return;

    try {
      const { data: clients } = await supabase
        .from('clients')
        .select('id')
        .eq('trainer_id', deleteModal.trainerId);

      if (clients && clients.length > 0) {
        const clientIds = clients.map(c => c.id);

        await supabase.from('measurements').delete().in('client_id', clientIds);

        const { data: workouts } = await supabase
          .from('workouts')
          .select('id')
          .in('client_id', clientIds);

        if (workouts && workouts.length > 0) {
          await supabase.from('exercises').delete().in('workout_id', workouts.map(w => w.id));
          await supabase.from('workouts').delete().in('client_id', clientIds);
        }

        const { data: mealPlans } = await supabase
          .from('meal_plans')
          .select('id')
          .in('client_id', clientIds);

        if (mealPlans && mealPlans.length > 0) {
          await supabase.from('meals').delete().in('meal_plan_id', mealPlans.map(m => m.id));
          await supabase.from('meal_plans').delete().in('client_id', clientIds);
        }

        await supabase.from('clients').delete().eq('trainer_id', deleteModal.trainerId);
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteModal.trainerId);

      if (error) throw error;

      await loadTrainers();
      onStatsUpdate();
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting trainer:', error);
      alert('Erro ao excluir treinador');
    }
  };

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Treinadores</h2>
          <p className="text-gray-400">Cadastre, edite ou remova treinadores da plataforma</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <Plus size={18} />
          Novo Treinador
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Treinador</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Clientes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Cadastrado em</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{trainer.full_name}</p>
                      <p className="text-sm text-gray-400">{trainer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400" size={16} />
                      <span className="text-white">{trainer.client_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {trainer.is_banned ? (
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
                    {new Date(trainer.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === trainer.id ? null : trainer.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {actionMenu === trainer.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                          {trainer.is_banned ? (
                            <button
                              onClick={() => {
                                handleUnbanTrainer(trainer.id);
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
                                setBanModal({ trainerId: trainer.id, trainerName: trainer.full_name });
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
                              setPromoteModal({ trainerId: trainer.id, trainerName: trainer.full_name });
                              setActionMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-gray-700 transition-colors text-left"
                          >
                            <Shield size={16} />
                            Promover a Admin
                          </button>
                          <button
                            onClick={() => {
                              setDeleteModal({ trainerId: trainer.id, trainerName: trainer.full_name });
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

        {filteredTrainers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Nenhum treinador encontrado</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddTrainerModal
          onClose={() => setShowAddModal(false)}
          onTrainerAdded={() => {
            loadTrainers();
            onStatsUpdate();
            setShowAddModal(false);
          }}
        />
      )}

      {banModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Banir Treinador</h3>
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
              Tem certeza que deseja banir <span className="text-white font-semibold">{banModal.trainerName}</span>?
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
                onClick={handleBanTrainer}
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
              <h3 className="text-xl font-bold text-white">Excluir Treinador</h3>
              <button onClick={() => setDeleteModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Tem certeza que deseja excluir <span className="text-white font-semibold">{deleteModal.trainerName}</span>?
              <br />
              <span className="text-red-400 text-sm">Esta acao ira excluir todos os clientes, treinos e dietas associados.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTrainer}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {promoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Promover a Administrador</h3>
              <button onClick={() => setPromoteModal(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Tem certeza que deseja promover <span className="text-white font-semibold">{promoteModal.trainerName}</span> a administrador?
              <br />
              <span className="text-blue-400 text-sm">Este usuario tera acesso total ao painel administrativo.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPromoteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handlePromoteToAdmin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Promover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
