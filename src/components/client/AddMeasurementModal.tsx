import { useState } from 'react';
import { X, Scale } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AddMeasurementModalProps {
  clientId: string;
  onClose: () => void;
  onMeasurementAdded: () => void;
}

export function AddMeasurementModal({ clientId, onClose, onMeasurementAdded }: AddMeasurementModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    leftArm: '',
    rightArm: '',
    leftThigh: '',
    rightThigh: '',
    leftCalf: '',
    rightCalf: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: measurementError } = await supabase
        .from('measurements')
        .insert({
          client_id: clientId,
          weight: parseFloat(formData.weight),
          body_fat_percentage: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
          chest: formData.chest ? parseFloat(formData.chest) : null,
          waist: formData.waist ? parseFloat(formData.waist) : null,
          hips: formData.hips ? parseFloat(formData.hips) : null,
          left_arm: formData.leftArm ? parseFloat(formData.leftArm) : null,
          right_arm: formData.rightArm ? parseFloat(formData.rightArm) : null,
          left_thigh: formData.leftThigh ? parseFloat(formData.leftThigh) : null,
          right_thigh: formData.rightThigh ? parseFloat(formData.rightThigh) : null,
          left_calf: formData.leftCalf ? parseFloat(formData.leftCalf) : null,
          right_calf: formData.rightCalf ? parseFloat(formData.rightCalf) : null,
          notes: formData.notes || null,
        });

      if (measurementError) throw measurementError;

      onMeasurementAdded();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar medição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <Scale className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Registrar Medições</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Scale size={20} className="text-emerald-400" />
              Peso e Composição
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="75.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  % Gordura Corporal
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="15.5"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Medidas Corporais (cm)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peito
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="95.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cintura
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="80.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quadril
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="95.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Braço Esquerdo
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftArm}
                  onChange={(e) => setFormData({ ...formData, leftArm: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="35.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Braço Direito
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightArm}
                  onChange={(e) => setFormData({ ...formData, rightArm: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="35.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Coxa Esquerda
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftThigh}
                  onChange={(e) => setFormData({ ...formData, leftThigh: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="55.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Coxa Direita
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightThigh}
                  onChange={(e) => setFormData({ ...formData, rightThigh: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="55.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Panturrilha Esquerda
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftCalf}
                  onChange={(e) => setFormData({ ...formData, leftCalf: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="38.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Panturrilha Direita
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightCalf}
                  onChange={(e) => setFormData({ ...formData, rightCalf: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  placeholder="38.0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              placeholder="Como você está se sentindo? Alguma observação importante..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all disabled:opacity-50 font-semibold shadow-lg shadow-emerald-900/50"
            >
              {loading ? 'Salvando...' : 'Salvar Medições'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
