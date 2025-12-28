import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, UserPlus, Ban, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Admin {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
  is_banned: boolean;
  banned_at: string | null;
  ban_reason: string | null;
  created_at: string;
}

export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    loadAdmins();
    checkSuperAdmin();
  }, []);

  async function checkSuperAdmin() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user?.id)
        .single();

      if (!error && data) {
        setIsSuperAdmin(data.is_super_admin);
      }
    } catch (error) {
      console.error('Error checking super admin:', error);
    }
  }

  async function loadAdmins() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addAdmin() {
    if (!newAdminEmail.trim()) {
      alert('Por favor, insira um email válido');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('email', newAdminEmail.trim())
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          alert('Usuário não encontrado com este email');
        } else {
          throw error;
        }
        return;
      }

      alert('Admin adicionado com sucesso!');
      setNewAdminEmail('');
      setShowAddModal(false);
      loadAdmins();
    } catch (error: any) {
      alert(`Erro ao adicionar admin: ${error.message}`);
    }
  }

  async function removeAdmin(adminId: string) {
    if (!confirm('Tem certeza que deseja remover este admin?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'client' })
        .eq('id', adminId);

      if (error) throw error;

      alert('Admin removido com sucesso!');
      loadAdmins();
    } catch (error: any) {
      alert(`Erro ao remover admin: ${error.message}`);
    }
  }

  async function banAdmin(adminId: string) {
    const reason = prompt('Motivo do banimento:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
          ban_reason: reason
        })
        .eq('id', adminId);

      if (error) throw error;

      alert('Admin banido com sucesso!');
      loadAdmins();
    } catch (error: any) {
      alert(`Erro ao banir admin: ${error.message}`);
    }
  }

  async function unbanAdmin(adminId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_banned: false,
          banned_at: null,
          ban_reason: null
        })
        .eq('id', adminId);

      if (error) throw error;

      alert('Admin desbanido com sucesso!');
      loadAdmins();
    } catch (error: any) {
      alert(`Erro ao desbanir admin: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Admins</h2>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Admin
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Você não tem permissão para gerenciar admins. Apenas super admins podem realizar esta ação.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              {isSuperAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className={admin.is_banned ? 'bg-red-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {admin.full_name}
                        {admin.is_super_admin && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                            SUPER ADMIN
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {admin.is_banned ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <div>
                        <div className="text-sm font-medium">Banido</div>
                        {admin.ban_reason && (
                          <div className="text-xs">{admin.ban_reason}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Ativo</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                </td>
                {isSuperAdmin && (
                  <td className="px-6 py-4">
                    {!admin.is_super_admin && (
                      <div className="flex gap-2">
                        {admin.is_banned ? (
                          <button
                            onClick={() => unbanAdmin(admin.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Desbanir"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => banAdmin(admin.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Banir"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remover Admin"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Adicionar Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email do usuário
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  O usuário deve estar cadastrado no sistema
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addAdmin}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAdminEmail('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}