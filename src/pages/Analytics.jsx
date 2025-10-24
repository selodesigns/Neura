import React, { useEffect, useState } from 'react';
import { analytics } from '../lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Edit, Sparkles } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await analytics.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your knowledge exploration progress and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data?.overview.totalDocuments || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data?.overview.totalViews || 0}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Edits</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data?.overview.totalEdits || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Edit className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Queries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data?.overview.totalAIQueries || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Sparkles className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {data?.activityTimeline?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Activity Over Time (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="edits" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="aiQueries" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Documents */}
      {data?.topDocuments?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Top Performing Documents</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topDocuments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#10b981" />
              <Bar dataKey="edits" fill="#8b5cf6" />
              <Bar dataKey="aiQueries" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Collaboration Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Collaboration Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Documents You Own</span>
                <span className="font-semibold">
                  {data?.collaborationStats.ownedDocuments || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (data?.collaborationStats.ownedDocuments /
                        (data?.overview.totalDocuments || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Documents You Collaborate On</span>
                <span className="font-semibold">
                  {data?.collaborationStats.collaboratingOn || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (data?.collaborationStats.collaboratingOn /
                        (data?.overview.totalDocuments || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Most Active</p>
                <p className="text-sm text-blue-700">
                  You've made {data?.overview.totalEdits || 0} edits across your documents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Eye className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Engagement</p>
                <p className="text-sm text-green-700">
                  Your documents have been viewed {data?.overview.totalViews || 0} times
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
              <Sparkles className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">AI Assisted</p>
                <p className="text-sm text-yellow-700">
                  {data?.overview.totalAIQueries || 0} AI research queries conducted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
