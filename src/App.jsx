import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Download, Copy } from 'lucide-react';

const StateSpaceGenerator = () => {
  const [variables, setVariables] = useState([
    { name: 'userLoggedIn', type: 'boolean', domain: ['true', 'false'] },
    { name: 'theme', type: 'enum', domain: ['light', 'dark'] }
  ]);

  const addVariable = () => {
    setVariables([...variables, { 
      name: '', 
      type: 'boolean', 
      domain: ['true', 'false'] 
    }]);
  };

  const removeVariable = (index) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index, field, value) => {
    const newVariables = [...variables];
    newVariables[index][field] = value;
    
    // Auto-update domain for boolean type
    if (field === 'type' && value === 'boolean') {
      newVariables[index].domain = ['true', 'false'];
    } else if (field === 'type' && value === 'enum') {
      newVariables[index].domain = ['option1', 'option2'];
    }
    
    setVariables(newVariables);
  };

  const updateDomain = (variableIndex, domainIndex, value) => {
    const newVariables = [...variables];
    newVariables[variableIndex].domain[domainIndex] = value;
    setVariables(newVariables);
  };

  const addDomainValue = (variableIndex) => {
    const newVariables = [...variables];
    newVariables[variableIndex].domain.push('');
    setVariables(newVariables);
  };

  const removeDomainValue = (variableIndex, domainIndex) => {
    const newVariables = [...variables];
    newVariables[variableIndex].domain = newVariables[variableIndex].domain.filter((_, i) => i !== domainIndex);
    setVariables(newVariables);
  };

  const states = useMemo(() => {
    if (variables.length === 0 || variables.some(v => !v.name || v.domain.length === 0)) {
      return [];
    }

    // Generate Cartesian product
    const generateStates = (vars) => {
      if (vars.length === 0) return [{}];
      
      const [first, ...rest] = vars;
      const restStates = generateStates(rest);
      
      return first.domain.flatMap(value => 
        restStates.map(state => ({ [first.name]: value, ...state }))
      );
    };

    return generateStates(variables.filter(v => v.name && v.domain.length > 0));
  }, [variables]);

  const exportCSV = () => {
    if (states.length === 0) return;
    
    // Get all variable names as headers
    const headers = Object.keys(states[0]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...states.map(state => 
        headers.map(header => `"${state[header]}"`).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state-space.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(states, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">State Space Generator</h1>
            <p className="opacity-90">Define variables and their domains to generate all possible states</p>
          </div>

          <div className="p-6 grid lg:grid-cols-2 gap-6">
            {/* Variables Definition */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Variables</h2>
                <button
                  onClick={addVariable}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Variable
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {variables.map((variable, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Variable name"
                        value={variable.name}
                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={variable.type}
                        onChange={(e) => updateVariable(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="boolean">Boolean</option>
                        <option value="enum">Enum</option>
                      </select>
                      <button
                        onClick={() => removeVariable(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Domain Values:</label>
                      {variable.domain.map((value, domainIndex) => (
                        <div key={domainIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => updateDomain(index, domainIndex, e.target.value)}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={variable.type === 'boolean'}
                          />
                          {variable.type === 'enum' && variable.domain.length > 1 && (
                            <button
                              onClick={() => removeDomainValue(index, domainIndex)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      {variable.type === 'enum' && (
                        <button
                          onClick={() => addDomainValue(index)}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          + Add value
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Generated States</h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={states.length === 0}
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    disabled={states.length === 0}
                  >
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  Total states: <span className="font-semibold text-blue-600">{states.length}</span>
                </div>
                
                {states.length > 0 ? (
                  <div className="max-h-96 overflow-auto">
                    <div className="space-y-2">
                      {states.map((state, index) => (
                        <div key={index} className="bg-white p-3 rounded border text-sm">
                          <div className="font-mono text-gray-800">
                            State {index + 1}: {JSON.stringify(state)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Add variables with names and domains to generate states
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <p className="text-blue-800 text-sm">
            This tool generates the Cartesian product of all variable domains. For example, 
            2 boolean variables create 2×2 = 4 states, while 3 variables with domains of size 2, 3, and 2 
            would create 2×3×2 = 12 states total.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StateSpaceGenerator;
