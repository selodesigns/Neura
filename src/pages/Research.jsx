import React, { useState } from 'react';
import { ai } from '../lib/api';
import { Search, Sparkles, Loader } from 'lucide-react';

export default function Research() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPerspectives, setSelectedPerspectives] = useState([
    'analytical',
    'creative',
    'critical',
  ]);

  const perspectives = [
    { id: 'analytical', name: 'Analytical', color: 'blue' },
    { id: 'creative', name: 'Creative', color: 'purple' },
    { id: 'critical', name: 'Critical', color: 'red' },
    { id: 'historical', name: 'Historical', color: 'green' },
    { id: 'practical', name: 'Practical', color: 'yellow' },
    { id: 'theoretical', name: 'Theoretical', color: 'indigo' },
  ];

  const handleResearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await ai.research(query, selectedPerspectives);
      setResult(response.data);
    } catch (error) {
      console.error('Research failed:', error);
      alert('Failed to conduct research');
    } finally {
      setLoading(false);
    }
  };

  const togglePerspective = (id) => {
    setSelectedPerspectives((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Research Lab</h1>
        <p className="text-gray-600">
          Explore topics from multiple perspectives with AI-powered research
        </p>
      </div>

      {/* Research Input */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Research Query
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
            placeholder="What would you like to research?"
            className="input flex-1"
          />
          <button
            onClick={handleResearch}
            disabled={loading || !query.trim()}
            className="btn btn-primary flex items-center gap-2"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            Research
          </button>
        </div>

        {/* Perspectives Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Perspectives
          </label>
          <div className="flex flex-wrap gap-2">
            {perspectives.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePerspective(p.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPerspectives.includes(p.id)
                    ? `bg-${p.color}-100 text-${p.color}-700 border-2 border-${p.color}-500`
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Question Variations */}
          {result.questionVariations?.length > 1 && (
            <div className="card">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Alternative Questions
              </h2>
              <div className="space-y-2">
                {result.questionVariations.slice(1).map((q, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Perspective Responses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.responses?.map((response, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-bold mb-3 capitalize flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full bg-${
                      perspectives.find((p) => p.id === response.perspective)?.color || 'gray'
                    }-500`}
                  />
                  {response.perspective} Perspective
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{response.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="card text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start Your Research Journey
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter a research query above and select perspectives to explore your topic from
            multiple angles with AI assistance.
          </p>
        </div>
      )}
    </div>
  );
}
