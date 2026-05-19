from .vector_service import vector_service
from .graph_service import graph_service
from .ai_service import ai_service
from models import SourceNode
import logging

logger = logging.getLogger(__name__)

class HybridRetriever:
    def query(self, question: str, document_ids: list[str] | None = None, session_id: str | None = None):
        # 1. Vector Search
        vector_results = vector_service.query_vectors(question, top_k=5, document_ids=document_ids, session_id=session_id)
        
        text_context = ""
        source_entities = []
        
        for match in vector_results.matches:
            meta = match.metadata or {}
            chunk = meta.get('text', '')
            if chunk:
                text_context += f"Text Segment: {chunk}\n"
            # Try to identify entities in the text or use the metadata if we had entity tags
            # For now, we'll rely on the graph service to expand based on the broad question if needed
            # or extract entities from the question
            pass

        # 2. Extract entities from question to seed graph search
        extraction = ai_service.extract_graph_data(question)
        search_terms = [node.id for node in extraction.nodes] + [node.label for node in extraction.nodes]
        
        # 3. Graph Expansion (2-hop)
        graph_context_data = graph_service.get_neighborhood(search_terms, document_ids=document_ids, session_id=session_id)
        
        graph_context = "Knowledge Graph Relationships:\n" + "\n".join(graph_context_data["relationships"])
        
        # 4. Combine Context
        full_context = f"--- Semantic Vector Search Context ---\n{text_context}\n\n--- Knowledge Graph Context ---\n{graph_context}"
        
        # 5. Synthesis
        answer = ai_service.synthesize_answer(question, full_context)
        
        # 6. Source Nodes for UI
        source_nodes = []
        for entity_desc in graph_context_data["entities"]:
            # entity_desc is "Label (Type)"
            parts = entity_desc.split(" (")
            label = parts[0]
            type_str = parts[1][:-1] if len(parts) > 1 else "Unknown"
            source_nodes.append(SourceNode(id=label, label=label, type=type_str))
            
        return answer, source_nodes

retriever = HybridRetriever()
