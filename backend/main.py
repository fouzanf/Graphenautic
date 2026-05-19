import os
import sys
import logging

backend_root = os.path.dirname(os.path.abspath(__file__))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

from dotenv import load_dotenv
load_dotenv()
print(f'NEO4J_URI status: {"Loaded" if os.getenv("NEO4J_URI") else "NOT FOUND"}')

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, QueryResponse, GraphState, SourceNode
from services.pipeline import pipeline
from services.retriever import retriever
from services.graph_service import graph_service
import shutil
import uuid
from typing import Optional

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Axiom GraphRAG API")

# PRODUCTION CORS: Allows both local testing AND your live Vercel UI
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://graphenautic.vercel.app",  # Add your frontend Vercel URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), session_id: Optional[str] = Form(None), user_id: str = Form("anonymous")):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        document_id = str(uuid.uuid4())
        stats = pipeline.process_pdf(temp_path, document_id, session_id=session_id or "", user_id=user_id)
        return {"status": "success", "document_id": document_id, "stats": stats}
    except Exception as e:
        logger.error(f"Pipeline error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except PermissionError:
                print("Warning: Could not delete temp file (Windows lock), skipping.")

@app.post("/query", response_model=QueryResponse)
async def query_axiom(request: QueryRequest):
    try:
        answer, source_nodes = retriever.query(request.question, request.document_ids, session_id=request.session_id)
        return QueryResponse(answer=answer, source_nodes=source_nodes)
    except Exception as e:
        logger.error(f"Query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/graph")
async def get_graph(document_ids: Optional[str] = None, session_id: Optional[str] = None):
    try:
        doc_ids_list = document_ids.split(",") if document_ids else None
        state = graph_service.get_graph_state(doc_ids_list, session_id=session_id)
        return state
    except Exception as e:
        logger.error(f"Graph fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions")
async def get_sessions():
    try:
        session_ids = graph_service.get_recent_sessions()
        return {"sessions": session_ids}
    except Exception as e:
        logger.error(f"Sessions fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Enforce standard main string initialization pattern
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)