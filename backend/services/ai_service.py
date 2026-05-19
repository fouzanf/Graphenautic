from google import genai
from google.genai import types
from config import settings
from models import GraphData
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)

    def extract_graph_data(self, text: str) -> GraphData:
        prompt = f"""
        Extract entities and relationships from the following text and return them in a strict JSON format.

        Text:
        {text}

        Schema:
        {{
          "nodes": [{{"id": "unique_id", "label": "name_or_label", "type": "Person/Org/Concept/etc"}}],
          "edges": [{{"source": "node_id_1", "target": "node_id_2", "relation": "how_they_are_connected"}}]
        }}

        Only return the JSON. No markdown formatting.
        """
        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            content = response.text.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()
            data = json.loads(content)
            return GraphData(**data)
        except Exception as e:
            logger.error(f"Failed to extract graph data: {e}")
            return GraphData(nodes=[], edges=[])

    def synthesize_answer(self, question: str, context: str) -> str:
        prompt = f"""
        You are Axiom, a GraphRAG research assistant. Answer the user question based on the provided hybrid context (Text chunks + Graph relationships).

        Context:
        {context}

        Question:
        {question}

        Synthesize a clear, professional, and cited answer.
        """
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text

ai_service = AIService()