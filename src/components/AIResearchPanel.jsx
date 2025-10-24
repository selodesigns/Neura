import React, { useState, useEffect } from 'react';
import { ai } from '../lib/api';
import { Search, Sparkles, Loader, RefreshCw } from 'lucide-react';

export default function AIResearchPanel({ documentId }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [documentId]);

  const loadHistory = async () => {
    try {
      const response = await ai.getResearchHistory(documentId);
      setHistory(response.data.researchHistory || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleResearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await ai.research(query, ['analytical', 'practical'], documentId);
      setResults(response.data);
      setQuery('');
      await loadHistory();
    } catch (error) {
      console.error('Research failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        AI Research
      </h2>

      {/* Query Input */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
          placeholder="Ask a research question..."
          className="input mb-2"
        />
        <button
          onClick={handleResearch}
          disabled={loading || !query.trim()}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Researching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Research
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mb-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Latest Results</h3>
          {results.responses?.map((response, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-2 capitalize">
                {response.perspective}
              </h4>
              <p className="text-sm text-gray-600">{response.content.substring(0, 200)}...</p>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {history.slice(-5).reverse().map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => setQuery(item.query)}
              >
                <p className="text-sm font-medium text-gray-900">{item.query}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.perspectives?.length || 0} perspectives explored
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!results && history.length === 0 && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Start researching to enhance your document with AI insights
          </p>
        </div>
      )}
    </div>
  );
}
