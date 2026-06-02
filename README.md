🚀 An Intelligent Research Architect that converts unstructured PDFs/text files into interactive, visual Knowledge Graphs using Next.js, FastAPI, Neo4j, Pinecone, and Google Gemini. Features a hybrid RAG architecture and real-time canvas visualization.

What Graphenautic Does?

Graphenautic is an Intelligent Research Architect that converts unstructured documents (like dense PDFs and text files) into interactive, visual Knowledge Graphs. Instead of just chatting with a standard AI text box, Graphenautic uses LLMs to extract deep entity-relationship networks, allowing users to map out, navigate, and visually explore how complex data connects in real-time.

🛠️ Tech Stack

Frontend: Next.js (App Router), Zustand (State Management), React Flow (Graph Visualization), Tailwind CSS & Shadcn UI.

Backend: FastAPI (Python), Uvicorn.

Databases: Neo4j Aura DB (Graph Database), Pinecone (Vector Database for Semantic Search).

AI Engine: Google Gemini API (1.5 Pro / 2.5 Flash).

✨ Key Features
Interactive Graph Workspace: A dynamic canvas powered by React Flow to pan, zoom, filter, and inspect automatically generated node-and-edge relation maps.

Hybrid RAG Architecture: Fuses vector-based semantic search (Pinecone) with structured relational graph queries (Neo4j) to eliminate hallucinations and deliver hyper-accurate context.

Smart Document Ingestion: Upload and process large text files or PDFs, segmenting text and extracting graph properties concurrently.

Workspace Session Isolation: Clean space on initialization with history tracking, ensuring previous analysis graphs don't bleed into new workspaces.

Neural Copilot: An integrated sidebar chat that queries your specific hybrid knowledge base for syntheses, trend analysis, and summaries.

🧠 Engineering Architecture & Wins
Graph Multi-Tenant Isolation: Defeated a data-leakage issue where Neo4j globally merged identical entity nodes across separate user uploads. Enforced absolute session boundaries by dynamically mapping and indexing strict session_id properties across all Cypher search and insertion pipelines.

State Hydration & Caching Triage: Fixed a global state caching bug where graph elements from older sessions would momentarily flicker on the dashboard upon a quick workspace switch. Refactored the UI lifecycle to run explicit state resets (setNodes([]), setEdges([])) during the initial React component mounting phase.

Downstream API Rate Resilience: Accounted for Google Gemini 429 RESOURCE_EXHAUSTED spikes caused by high-throughput parallel document chunking on the free tier. Engineered defensive backend exception wrappers to intercept rate-limit codes, pausing and retrying requests seamlessly without crashing the UI thread.

Canvas Layout Engineering: Resolved layout and CSS scaling conflicts on the main canvas workspace by shifting floating toolboxes to native React Flow <Panel> layouts, keeping active controls pinned precisely regardless of viewport resize adjustments.
