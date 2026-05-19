from pydantic import BaseModel, Field
from typing import List, Optional

class Node(BaseModel):
    id: str
    label: str
    type: str
    document_id: Optional[str] = None
    session_id: Optional[str] = None

class Edge(BaseModel):
    source: str
    target: str
    relation: str
    document_id: Optional[str] = None
    session_id: Optional[str] = None

class GraphData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class QueryRequest(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class SourceNode(BaseModel):
    id: str
    label: str
    type: str
    score: Optional[float] = None
    document_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    source_nodes: List[SourceNode]

class GraphState(BaseModel):
    nodes: List[dict]
    edges: List[dict]
