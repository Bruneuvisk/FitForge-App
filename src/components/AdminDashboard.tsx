import { useState, useEffect } from 'react';
import { LogOut, Users, UserCog, Shield, TrendingUp, Dumbbell, UtensilsCrossed, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';
import { TrainersManagement } from './admin/TrainersManagement';
import { ClientsManagement } from './admin/ClientsManagement';
import AdminManagement from './admin/AdminManagement';
import DatabaseManagement from './admin/DatabaseManagement';

type TabType = 'overview' | 'trainers' | 'clients' | 'admins' | 'database';

type Stats = {
  totalTrainers: number;
  totalClients: number;
  totalWorkouts: number;
  totalMealPlans: number;
  bannedTrainers: number;
  bannedClients: number;
};

export function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<Stats>({
    totalTrainers: 0,
    totalClients: 0,
    totalWorkouts: 0,
    totalMealPlans: 0,
    bannedTrainers: 0,
    bannedClients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [trainersRes, clientsRes, workoutsRes, mealPlansRes] = await Promise.all([
        supabase.from('profiles').select('id, is_banned').eq('role', 'trainer'),
        supabase.from('clients').select('id, is_banned'),
        supabase.from('workouts').select('id', { count: 'exact' }),
        supabase.from('meal_plans').select('id', { count: 'exact' }),
      ]);

      const trainers = trainersRes.data || [];
      const clients = clientsRes.data || [];

      setStats({
        totalTrainers: trainers.length,
        totalClients: clients.length,
        totalWorkouts: workoutsRes.count || 0,
        totalMealPlans: mealPlansRes.count || 0,
        bannedTrainers: trainers.filter(t => t.is_banned).length,
        bannedClients: clients.filter(c => c.is_banned).length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-red-900/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs font-semibold rounded border border-red-500/30">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                <Shield className="inline-block mr-1 text-red-400" size={16} />
                <span className="font-semibold text-white">{profile?.full_name}</span>
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
        <div className="flex gap-2 mb-8 bg-gray-800/50 p-1 rounded-lg w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <TrendingUp size={18} />
            Visao Geral
          </button>
          <button
            onClick={() => setActiveTab('trainers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'trainers'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <UserCog size={18} />
            Treinadores
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'clients'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Users size={18} />
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'admins'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Shield size={18} />
            Admins
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <Database size={18} />
            Banco de Dados
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
              <p className="text-gray-400">Gerencie treinadores e clientes da plataforma</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <UserCog className="text-blue-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalTrainers}</p>
                <p className="text-sm text-blue-300">Treinadores</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-600/30 rounded-lg">
                    <Users className="text-emerald-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalClients}</p>
                <p className="text-sm text-emerald-300">Clientes</p>
              </div>

              <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/20 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-600/30 rounded-lg">
                    <Dumbbell className="text-orange-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalWorkouts}</p>
                <p className="text-sm text-orange-300">Treinos</p>
              </div>

              <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-600/30 rounded-lg">
                    <UtensilsCrossed className="text-pink-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalMealPlans}</p>
                <p className="text-sm text-pink-300">Dietas</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-rose-600/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/30 rounded-lg">
                    <UserCog className="text-red-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.bannedTrainers}</p>
                <p className="text-sm text-red-300">Treinadores Banidos</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-rose-600/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600/30 rounded-lg">
                    <Users className="text-red-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.bannedClients}</p>
                <p className="text-sm text-red-300">Clientes Banidos</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Acoes Rapidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('trainers')}
                    className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserCog className="text-blue-400" size={20} />
                      <span className="text-white">Gerenciar Treinadores</span>
                    </div>
                    <span className="text-gray-400">{stats.totalTrainers} ativos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className="w-full flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="text-emerald-400" size={20} />
                      <span className="text-white">Gerenciar Clientes</span>
                    </div>
                    <span className="text-gray-400">{stats.totalClients} ativos</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo da Plataforma</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Media de clientes por treinador</span>
                    <span className="text-white font-semibold">
                      {stats.totalTrainers > 0
                        ? (stats.totalClients / stats.totalTrainers).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Treinos por cliente</span>
                    <span className="text-white font-semibold">
                      {stats.totalClients > 0
                        ? (stats.totalWorkouts / stats.totalClients).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Dietas por cliente</span>
                    <span className="text-white font-semibold">
                      {stats.totalClients > 0
                        ? (stats.totalMealPlans / stats.totalClients).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Taxa de banimento</span>
                    <span className="text-white font-semibold">
                      {stats.totalTrainers + stats.totalClients > 0
                        ? (
                            ((stats.bannedTrainers + stats.bannedClients) /
                              (stats.totalTrainers + stats.totalClients)) *
                            100
                          ).toFixed(1)
                        : '0'}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trainers' && <TrainersManagement onStatsUpdate={loadStats} />}

        {activeTab === 'clients' && <ClientsManagement onStatsUpdate={loadStats} />}

        {activeTab === 'admins' && <AdminManagement />}

        {activeTab === 'database' && <DatabaseManagement />}
      </main>
    </div>
  );
}
