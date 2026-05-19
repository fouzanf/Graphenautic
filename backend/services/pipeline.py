import fitz
import hashlib
import re
from .ai_service import ai_service
from .graph_service import graph_service
from .vector_service import vector_service
import logging

logger = logging.getLogger(__name__)

class AxiomPipeline:
    def process_pdf(self, file_path: str, document_id: str, session_id: str, user_id: str | None = None):
        # 1. Extract Text
        doc = fitz.open(file_path)
        full_text = ""
        chunks = []
        
        # Compile pattern to match watermark lines
        watermark_pattern = re.compile(r'.*(?:Authorized licensed use limited to|IEEE Xplore).*', re.IGNORECASE)
        
        for i, page in enumerate(doc):
            raw_text = page.get_text()
            # Filter out watermark lines
            clean_lines = [line for line in raw_text.split('\n') if not watermark_pattern.match(line)]
            text = "\n".join(clean_lines).strip()
            
            full_text += text + "\n"
            
            # Create chunk for vector search
            chunk_id = hashlib.md5(f"{file_path}_{i}_{session_id}".encode()).hexdigest()
            chunks.append({
                "id": chunk_id,
                "text": text,
                "metadata": {
                    "source": file_path, 
                    "page": i, 
                    "text": text, 
                    "document_id": document_id,
                    "session_id": session_id,
                    "user_id": user_id or "guest_user"
                }
            })
        
        # 2. Extract Graph Data (process in reasonable size chunks or as a whole if not too large)
        # For simplicity, we'll process the full text if it's within limits, otherwise we'd loop.
        # Gemini 1.5 Pro has a large context window, so we can send a lot.
        graph_data = ai_service.extract_graph_data(full_text[:30000]) # Sample first 30k chars
        
        # Tag graph nodes and edges with document_id and session_id
        for node in graph_data.nodes:
            node.document_id = document_id
            node.session_id = session_id
        for edge in graph_data.edges:
            edge.document_id = document_id
            edge.session_id = session_id
        
        # 3. Insert into Neo4j
        graph_service.insert_graph_data(graph_data)
        
        # 4. Insert into Pinecone
        vector_service.upsert_vectors(chunks)
        
        return {"nodes_count": len(graph_data.nodes), "edges_count": len(graph_data.edges), "chunks_count": len(chunks)}

pipeline = AxiomPipeline()
