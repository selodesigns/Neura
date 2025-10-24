import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import * as Y from 'yjs';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import { Sparkles } from 'lucide-react';

export default function MarkdownEditor({ documentId, initialContent, onUpdate, userId, userName }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const ydocRef = useRef(null);
  const providerRef = useRef(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    // Initialize Yjs
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;
    const type = ydoc.getXmlFragment('prosemirror');

    // Initialize WebSocket provider for collaboration
    const provider = new WebsocketProvider(
      'ws://localhost:4000',
      documentId,
      ydoc
    );
    providerRef.current = provider;

    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: getRandomColor(),
      userId,
    });

    // Create editor state
    const state = EditorState.create({
      schema: basicSchema,
      plugins: [
        ySyncPlugin(type),
        yCursorPlugin(provider.awareness),
        yUndoPlugin(),
        history(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
        }),
        keymap(baseKeymap),
      ],
    });

    // Create editor view
    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        if (transaction.docChanged && onUpdate) {
          const content = getMarkdownFromDoc(newState.doc);
          onUpdate(content);
        }
      },
    });

    viewRef.current = view;

    // Set initial content if provided
    if (initialContent && !type.length) {
      const contentNode = DOMParser.fromSchema(basicSchema).parse(
        createHTMLElement(initialContent)
      );
      const tr = state.tr.replaceWith(0, state.doc.content.size, contentNode.content);
      view.dispatch(tr);
    }

    return () => {
      provider.destroy();
      view.destroy();
    };
  }, [documentId, userId, userName]);

  return (
    <div className="relative">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Editor</h3>
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className="btn btn-outline text-sm flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Assist
          </button>
        </div>
        <div
          ref={editorRef}
          className="prose prose-slate max-w-none min-h-[400px] border border-gray-200 rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent"
        />
      </div>
    </div>
  );
}

function getRandomColor() {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getMarkdownFromDoc(doc) {
  // Simple markdown conversion
  let markdown = '';
  doc.content.forEach((node) => {
    if (node.type.name === 'paragraph') {
      markdown += node.textContent + '\n\n';
    } else if (node.type.name === 'heading') {
      const level = node.attrs.level;
      markdown += '#'.repeat(level) + ' ' + node.textContent + '\n\n';
    }
  });
  return markdown;
}

function createHTMLElement(markdown) {
  const div = document.createElement('div');
  // Simple markdown to HTML (in production, use a proper markdown parser)
  div.innerHTML = markdown.replace(/\n/g, '<br>');
  return div;
}
