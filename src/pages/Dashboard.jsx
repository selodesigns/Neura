import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analytics } from '../lib/api';
import { FileText, Eye, Edit, Sparkles, Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await analytics.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
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

  const stats = [
    {
      name: 'Total Documents',
      value: data?.overview.totalDocuments || 0,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Total Views',
      value: data?.overview.totalViews || 0,
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      name: 'Total Edits',
      value: data?.overview.totalEdits || 0,
      icon: Edit,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      name: 'AI Queries',
      value: data?.overview.totalAIQueries || 0,
      icon: Sparkles,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/documents" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Document
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
        {data?.recentDocuments?.length > 0 ? (
          <div className="space-y-3">
            {data.recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                to={`/document/${doc.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-500">
                      Updated {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {doc.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    {doc.edits}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No documents yet. Create your first one!</p>
        )}
      </div>

      {/* Top Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Top Documents
          </h2>
          {data?.topDocuments?.length > 0 ? (
            <div className="space-y-3">
              {data.topDocuments.map((doc, index) => (
                <div key={doc.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Link to={`/document/${doc.id}`} className="font-medium hover:text-primary-600">
                      {doc.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {doc.views} views • {doc.edits} edits
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Collaboration Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Documents Owned</span>
                <span className="font-semibold">{data?.collaborationStats.ownedDocuments || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{
                    width: `${(data?.collaborationStats.ownedDocuments / (data?.overview.totalDocuments || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Collaborating On</span>
                <span className="font-semibold">{data?.collaborationStats.collaboratingOn || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${(data?.collaborationStats.collaboratingOn / (data?.overview.totalDocuments || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
