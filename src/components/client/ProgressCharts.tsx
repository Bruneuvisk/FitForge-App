import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface Measurement {
  id: string;
  weight: number;
  body_fat_percentage: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  measured_at: string;
}

interface ProgressChartsProps {
  measurements: Measurement[];
  goalWeight?: number | null;
}

export function ProgressCharts({ measurements, goalWeight }: ProgressChartsProps) {
  const chartData = measurements
    .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime())
    .map(m => ({
      date: new Date(m.measured_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      peso: m.weight,
      gordura: m.body_fat_percentage,
      peito: m.chest,
      cintura: m.waist,
      quadril: m.hips,
    }));

  if (measurements.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
        <p className="text-gray-400">Nenhuma medição registrada ainda</p>
        <p className="text-sm text-gray-500 mt-2">Adicione sua primeira medição para ver os gráficos de evolução</p>
      </div>
    );
  }

  const latestWeight = measurements[measurements.length - 1].weight;
  const firstWeight = measurements[0].weight;
  const weightChange = latestWeight - firstWeight;
  const weightChangePercent = ((weightChange / firstWeight) * 100).toFixed(1);

  const latestBodyFat = measurements[measurements.length - 1].body_fat_percentage;
  const firstBodyFat = measurements[0].body_fat_percentage;
  const bodyFatChange = latestBodyFat && firstBodyFat ? latestBodyFat - firstBodyFat : null;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="text-red-400" size={20} />;
    if (change < 0) return <TrendingDown className="text-emerald-400" size={20} />;
    return <Minus className="text-gray-400" size={20} />;
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(1)} {entry.name === 'peso' ? 'kg' : entry.name === 'gordura' ? '%' : 'cm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-emerald-300">Variação de Peso</p>
            {getTrendIcon(weightChange)}
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
          </p>
          <p className="text-sm text-emerald-400">
            {weightChange > 0 ? '+' : ''}{weightChangePercent}%
          </p>
          {goalWeight && (
            <p className="text-xs text-gray-400 mt-2">
              Meta: {goalWeight} kg ({(latestWeight - goalWeight).toFixed(1)} kg restantes)
            </p>
          )}
        </div>

        {bodyFatChange !== null && (
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-blue-300">Variação de Gordura</p>
              {getTrendIcon(bodyFatChange)}
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {bodyFatChange > 0 ? '+' : ''}{bodyFatChange.toFixed(1)}%
            </p>
            <p className="text-sm text-blue-400">
              Atual: {latestBodyFat?.toFixed(1)}%
            </p>
          </div>
        )}

        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-orange-300">Total de Medições</p>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {measurements.length}
          </p>
          <p className="text-sm text-orange-400">
            Última: {new Date(measurements[measurements.length - 1].measured_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Evolução de Peso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={customTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="peso"
              name="Peso"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 8 }}
            />
            {goalWeight && (
              <Line
                type="monotone"
                data={chartData.map(d => ({ ...d, meta: goalWeight }))}
                dataKey="meta"
                name="Meta"
                stroke="#6b7280"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {chartData.some(d => d.gordura) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Evolução de Gordura Corporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={customTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="gordura"
                name="% Gordura"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.some(d => d.peito || d.cintura || d.quadril) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Evolução de Medidas Corporais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={customTooltip} />
              <Legend />
              {chartData.some(d => d.peito) && (
                <Line
                  type="monotone"
                  dataKey="peito"
                  name="Peito"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
              )}
              {chartData.some(d => d.cintura) && (
                <Line
                  type="monotone"
                  dataKey="cintura"
                  name="Cintura"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                />
              )}
              {chartData.some(d => d.quadril) && (
                <Line
                  type="monotone"
                  dataKey="quadril"
                  name="Quadril"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
