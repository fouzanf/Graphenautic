import { create } from 'zustand';
import {
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { AxiomNode, AxiomEdge, ChatMessage, ProcessedDocument } from '@/types/graph';
import { v4 as uuidv4 } from 'uuid';

interface GraphState {
  nodes: AxiomNode[];
  edges: AxiomEdge[];
  messages: ChatMessage[];
  documents: ProcessedDocument[];
  isThinking: boolean;
  focusedNodeId: string | null;

  // Actions
  setNodes: (nodes: AxiomNode[]) => void;
  setEdges: (edges: AxiomEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addDocument: (doc: ProcessedDocument) => void;
  setDocuments: (documents: ProcessedDocument[]) => void;
  toggleDocumentSelection: (id: string) => void;
  setThinking: (isThinking: boolean) => void;
  setFocusedNodeId: (id: string | null) => void;

  activeSessionId: string;
  setActiveSessionId: (id: string) => void;

  simulateGraphExtraction: (text: string) => Promise<void>;
  submitQuery: (text: string) => Promise<void>;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // --- INITIAL STATE ---
  nodes: [] as AxiomNode[],
  edges: [] as AxiomEdge[],
  messages: [],
  activeSessionId: '',
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  documents: [],
  isThinking: false,
  focusedNodeId: null,

  // --- ACTIONS ---
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as AxiomNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as AxiomEdge[],
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges) as AxiomEdge[],
    });
  },

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: uuidv4(), timestamp: Date.now() }]
  })),

  setMessages: (messages) => set({ messages }),

  addDocument: (doc) => set((state) => ({
    documents: [{ ...doc, selected: true }, ...state.documents]
  })),

  setDocuments: (documents) => set({ documents }),

  toggleDocumentSelection: (id) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, selected: doc.selected !== false ? false : true } : doc
    )
  })),

  setThinking: (isThinking) => set({ isThinking }),
  
  setFocusedNodeId: (id) => set({ focusedNodeId: id }),

  simulateGraphExtraction: async (_text: string) => {
    set({ isThinking: true });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const newNodes: AxiomNode[] = [
      { id: 'n1', type: 'entityNode', position: { x: 250, y: 50 }, data: { label: 'Quantum Computing', category: 'Technology' } },
      { id: 'n2', type: 'entityNode', position: { x: 100, y: 200 }, data: { label: 'Superposition', category: 'Concept' } },
      { id: 'n3', type: 'entityNode', position: { x: 400, y: 200 }, data: { label: 'Entanglement', category: 'Concept' } },
      { id: 'n4', type: 'entityNode', position: { x: 250, y: 350 }, data: { label: 'IBM Research', category: 'Organization' } },
    ];

    const newEdges: AxiomEdge[] = [
      { id: 'e1-2', source: 'n1', target: 'n2', label: 'UTILIZES', animated: true },
      { id: 'e1-3', source: 'n1', target: 'n3', label: 'UTILIZES', animated: true },
      { id: 'e4-1', source: 'n4', target: 'n1', label: 'DEVELOPING', animated: true },
    ];

    set({
      nodes: newNodes,
      edges: newEdges,
      isThinking: false,
      messages: [
        ...get().messages,
        {
          id: uuidv4(),
          role: 'assistant',
          content: `I've analyzed the text and generated a new Knowledge Graph. You can see the relationships between **Quantum Computing** and **IBM Research** now.`,
          timestamp: Date.now(),
        }
      ]
    });
  },

  submitQuery: async (text: string) => {
    if (!text.trim() || get().isThinking) return;

    set((state) => ({
      messages: [...state.messages, { id: uuidv4(), role: 'user', content: text, timestamp: Date.now() }]
    }));

    const selectedDocs = get().documents.filter(d => d.selected !== false);
    const documentIds = selectedDocs.map(d => d.id);

    set({ isThinking: true });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: text,
          document_ids: documentIds.length > 0 ? documentIds : null,
          session_id: get().activeSessionId || null
        }),
      });
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          messages: [...state.messages, { id: uuidv4(), role: 'assistant', content: data.answer, timestamp: Date.now() }],
          isThinking: false
        }));
      } else {
        const err = await res.json();
        set((state) => ({
          messages: [...state.messages, { id: uuidv4(), role: 'assistant', content: `Error: ${err.detail || 'Failed to execute query.'}`, timestamp: Date.now() }],
          isThinking: false
        }));
      }
    } catch (error) {
      console.error("Query error:", error);
      set((state) => ({
        messages: [...state.messages, { id: uuidv4(), role: 'assistant', content: "Network error: Failed to connect to backend.", timestamp: Date.now() }],
        isThinking: false
      }));
    }
  },
}));