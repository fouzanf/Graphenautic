import { Node, Edge } from 'reactflow';

export type EntityCategory = 'Person' | 'Concept' | 'Organization' | 'Location' | 'Technology' | 'Event' | 'Other';

export interface EntityNodeData {
  label: string;
  category: EntityCategory;
  documentSources?: string[];
  hideLabel?: boolean;
}

export interface RelationEdgeData {
  label: string;
}

export type AxiomNode = Node<EntityNodeData>;
export type AxiomEdge = Edge<RelationEdgeData>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ProcessedDocument {
  id: string;
  name: string;
  size: string;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: number;
  selected?: boolean;
}
