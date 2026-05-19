import os
from pinecone import Pinecone, ServerlessSpec
from google import genai
from google.genai import types
from config import settings
import logging

logger = logging.getLogger(__name__)

class VectorService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        
        # Ensure index exists
        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=3072, # Dimension for gemini-embedding-2
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region=settings.PINECONE_ENVIRONMENT or "us-east-1"
                )
            )
        self.index = self.pc.Index(self.index_name)

    def upsert_vectors(self, chunks: list[dict]):
        """
        chunks: List of {'id': str, 'text': str, 'metadata': dict}
        """
        for chunk in chunks:
            response = self.client.models.embed_content(
                model="gemini-embedding-2",
                contents=chunk['text']
            )
            embedding = response.embeddings[0].values
            
            # Sanity check: Ensure metadata exists and user_id is a clean, non-null string primitive
            metadata = chunk.get('metadata') or {}
            if metadata.get('user_id') is None or not isinstance(metadata.get('user_id'), str):
                metadata['user_id'] = "anonymous"
            
            self.index.upsert(vectors=[(chunk['id'], embedding, metadata)])

    def query_vectors(self, query: str, top_k: int = 25, document_ids: list[str] | None = None, session_id: str | None = None, user_id: str | None = None):
        response = self.client.models.embed_content(
            model="gemini-embedding-2",
            contents=query
        )
        embedding = response.embeddings[0].values
        
        filter_dict = {}
        if session_id:
            filter_dict["session_id"] = session_id
        if user_id:
            filter_dict["user_id"] = user_id
        if document_ids:
            filter_dict["document_id"] = {"$in": document_ids}
        
        results = self.index.query(
            vector=embedding,
            top_k=top_k,
            filter=filter_dict if filter_dict else None,
            include_metadata=True
        )
        return results

vector_service = VectorService()
