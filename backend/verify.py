import sys
import os

# Add parent directory to sys.path to allow relative imports in services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def verify_imports():
    try:
        from backend.config import settings
        print("✅ Config imported")
        from backend.models import QueryRequest, GraphData
        print("✅ Models imported")
        from backend.services.ai_service import ai_service
        print("✅ AI Service imported")
        from backend.services.graph_service import graph_service
        print("✅ Graph Service imported")
        from backend.services.vector_service import vector_service
        print("✅ Vector Service imported")
        from backend.services.pipeline import pipeline
        print("✅ Pipeline imported")
        from backend.services.retriever import retriever
        print("✅ Retriever imported")
        from backend.main import app
        print("✅ FastAPI App imported")
        print("\nAll core modules verified! (Note: API connections were not tested)")
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_imports()
