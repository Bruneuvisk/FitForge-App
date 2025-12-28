import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database, Trash2, Eye, RefreshCw } from 'lucide-react';

interface TableData {
  name: string;
  count: number;
  data: any[];
}

export default function DatabaseManagement() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tableNames = ['profiles', 'clients', 'workouts', 'exercises', 'meal_plans', 'meals', 'measurements'];

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    setLoading(true);
    const tablesData: TableData[] = [];

    for (const tableName of tableNames) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          tablesData.push({
            name: tableName,
            count: count || 0,
            data: []
          });
        }
      } catch (error) {
        console.error(`Error loading ${tableName}:`, error);
      }
    }

    setTables(tablesData);
    setLoading(false);
  }

  async function loadTableData(tableName: string) {
    setLoading(true);
    setSelectedTable(tableName);

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTableData(data || []);
    } catch (error) {
      console.error(`Error loading ${tableName} data:`, error);
    }

    setLoading(false);
  }

  async function deleteRecord(tableName: string, id: string) {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Registro deletado com sucesso!');
      if (selectedTable) {
        loadTableData(selectedTable);
      }
      loadTables();
    } catch (error: any) {
      alert(`Erro ao deletar: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Banco de Dados</h2>
        </div>
        <button
          onClick={loadTables}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <button
            key={table.name}
            onClick={() => loadTableData(table.name)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedTable === table.name
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-400'
            }`}
          >
            <div className="text-sm font-medium text-gray-600 capitalize">
              {table.name}
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {table.count}
            </div>
            <div className="text-xs text-gray-500 mt-1">registros</div>
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
            Tabela: {selectedTable}
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum registro encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(tableData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {Object.entries(row).map(([key, value]) => (
                        <td key={key} className="px-4 py-3 text-sm text-gray-900">
                          {typeof value === 'boolean' ? (
                            value ? 'Sim' : 'Não'
                          ) : value === null ? (
                            <span className="text-gray-400">null</span>
                          ) : typeof value === 'object' ? (
                            JSON.stringify(value)
                          ) : (
                            String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '')
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => deleteRecord(selectedTable, row.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}