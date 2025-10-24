import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documents } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import MarkdownEditor from '../components/MarkdownEditor';
import AIResearchPanel from '../components/AIResearchPanel';
import { ArrowLeft, Save, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function DocumentEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResearchPanel, setShowResearchPanel] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const response = await documents.getById(id);
      setDocument(response.data.document);
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (content) => {
    setSaving(true);
    try {
      await documents.update(id, { content });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document not found</h2>
        <Link to="/documents" className="text-primary-600 hover:text-primary-700">
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/documents" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{document.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {format(new Date(document.updatedAt), 'MMM d, yyyy h:mm a')}
              </span>
              {document.collaborators?.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {document.collaborators.length} collaborators
                </span>
              )}
              {saving && (
                <span className="flex items-center gap-1 text-primary-600">
                  <Save className="h-4 w-4" />
                  Saving...
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowResearchPanel(!showResearchPanel)}
          className="btn btn-primary"
        >
          {showResearchPanel ? 'Hide' : 'Show'} AI Research
        </button>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={showResearchPanel ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <MarkdownEditor
            documentId={id}
            initialContent={document.content}
            onUpdate={handleUpdate}
            userId={user.id}
            userName={user.name}
          />
        </div>
        {showResearchPanel && (
          <div className="lg:col-span-1">
            <AIResearchPanel documentId={id} />
          </div>
        )}
      </div>

      {/* Version History */}
      {document.versions?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Version History</h2>
          <div className="space-y-3">
            {document.versions.slice(-5).reverse().map((version, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{version.message}</p>
                  <p className="text-sm text-gray-500">
                    by {version.author?.name || 'Unknown'} •{' '}
                    {format(new Date(version.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
