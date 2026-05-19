from neo4j import GraphDatabase
from typing import List
try:
    from config import settings
except ImportError:
    try:
        from ..config import settings
    except (ImportError, ValueError):
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from config import settings
from models import GraphData
import logging

logger = logging.getLogger(__name__)

class GraphService:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.NEO4J_URI, 
            auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
        )

    def close(self):
        self.driver.close()

    def insert_graph_data(self, data: GraphData):
        with self.driver.session() as session:
            session.execute_write(self._create_nodes_and_edges, data)

    @staticmethod
    def _create_nodes_and_edges(tx, data: GraphData):
        # Create Nodes
        for node in data.nodes:
            query = (
                "MERGE (n:Entity {id: $id, session_id: $session_id}) "
                "SET n.label = $label, n.type = $type, n.document_id = $document_id "
                "RETURN n"
            )
            tx.run(query, id=node.id, label=node.label, type=node.type, document_id=node.document_id, session_id=node.session_id)
        
        # Create Edges
        for edge in data.edges:
            query = (
                "MATCH (a:Entity {id: $source, session_id: $session_id}), (b:Entity {id: $target, session_id: $session_id}) "
                "MERGE (a)-[r:RELATED {relation: $relation, document_id: $document_id, session_id: $session_id}]->(b) "
                "RETURN r"
            )
            tx.run(query, source=edge.source, target=edge.target, relation=edge.relation, document_id=edge.document_id, session_id=edge.session_id)

    def get_graph_state(self, document_ids: List[str] | None = None, session_id: str | None = None):
        with self.driver.session() as session:
            if session_id:
                query = """
                MATCH (n:Entity {session_id: $session_id})
                OPTIONAL MATCH (n)-[r:RELATED {session_id: $session_id}]->(m:Entity {session_id: $session_id})
                WITH n, count(r) AS degree
                ORDER BY degree DESC
                LIMIT 100
                WITH collect(n) AS topNodes
                UNWIND topNodes AS n
                OPTIONAL MATCH (n)-[r:RELATED {session_id: $session_id}]->(m)
                WHERE m IN topNodes
                RETURN n, r, m
                """
                result = session.run(query, session_id=session_id)
            elif document_ids:
                query = """
                MATCH (n:Entity)
                WHERE n.document_id IN $document_ids
                OPTIONAL MATCH (n)-[r]->(m:Entity)
                WHERE r.document_id IN $document_ids AND m.document_id IN $document_ids
                WITH n, count(r) AS degree
                ORDER BY degree DESC
                LIMIT 100
                WITH collect(n) AS topNodes
                UNWIND topNodes AS n
                OPTIONAL MATCH (n)-[r]->(m)
                WHERE m IN topNodes AND r.document_id IN $document_ids AND m.document_id IN $document_ids
                RETURN n, r, m
                """
                result = session.run(query, document_ids=document_ids)
            else:
                query = """
                MATCH (n:Entity)
                OPTIONAL MATCH (n)-[r]-()
                WITH n, count(r) AS degree
                ORDER BY degree DESC
                LIMIT 100
                WITH collect(n) AS topNodes
                UNWIND topNodes AS n
                OPTIONAL MATCH (n)-[r]->(m)
                WHERE m IN topNodes
                RETURN n, r, m
                """
                result = session.run(query)
            
            nodes = {}
            edges = []
            for record in result:
                node = record["n"]
                if node and node["id"] not in nodes:
                    nodes[node["id"]] = {
                        "id": node["id"],
                        "label": node["label"],
                        "type": node["type"],
                        "document_id": node.get("document_id"),
                        "session_id": node.get("session_id")
                    }
                
                rel = record["r"]
                target = record["m"]
                if rel and target:
                    edges.append({
                        "source": node["id"],
                        "target": target["id"],
                        "relation": rel["relation"],
                        "document_id": rel.get("document_id"),
                        "session_id": rel.get("session_id")
                    })
            
            return {"nodes": list(nodes.values()), "edges": edges}

    def get_neighborhood(self, terms: List[str], depth: int = 2, document_ids: List[str] | None = None, session_id: str | None = None):
        with self.driver.session() as session:
            records = []
            if terms:
                if session_id:
                    query = (
                        "MATCH (n:Entity {session_id: $session_id}) WHERE (n.id IN $terms OR any(term IN $terms WHERE toLower(n.label) CONTAINS toLower(term))) "
                        "MATCH path = (n)-[*1..2]-(m:Entity) "
                        "WHERE all(node IN nodes(path) WHERE node.session_id = $session_id) "
                        "AND all(rel IN relationships(path) WHERE rel.session_id = $session_id) "
                        "RETURN path LIMIT 100"
                    )
                    result = session.run(query, terms=terms, session_id=session_id)
                elif document_ids:
                    query = (
                        "MATCH (n:Entity) WHERE (n.id IN $terms OR any(term IN $terms WHERE toLower(n.label) CONTAINS toLower(term))) "
                        "AND n.document_id IN $document_ids "
                        "MATCH path = (n)-[*1..2]-(m:Entity) "
                        "WHERE all(node IN nodes(path) WHERE node.document_id IN $document_ids) "
                        "AND all(rel IN relationships(path) WHERE rel.document_id IN $document_ids) "
                        "RETURN path LIMIT 100"
                    )
                    result = session.run(query, terms=terms, document_ids=document_ids)
                else:
                    query = (
                        "MATCH (n:Entity) WHERE n.id IN $terms OR any(term IN $terms WHERE toLower(n.label) CONTAINS toLower(term)) "
                        "MATCH path = (n)-[*1..2]-(m:Entity) "
                        "RETURN path LIMIT 100"
                    )
                    result = session.run(query, terms=terms)
                records = list(result)
            
            if not records:
                # Fallback to general relationships if no exact terms matched
                if session_id:
                    query = (
                        "MATCH path = (n:Entity {session_id: $session_id})-[r:RELATED {session_id: $session_id}]->(m:Entity {session_id: $session_id}) "
                        "RETURN path LIMIT 50"
                    )
                    result = session.run(query, session_id=session_id)
                elif document_ids:
                    query = (
                        "MATCH path = (n:Entity)-[r]->(m:Entity) "
                        "WHERE n.document_id IN $document_ids AND m.document_id IN $document_ids "
                        "RETURN path LIMIT 50"
                    )
                    result = session.run(query, document_ids=document_ids)
                else:
                    result = session.run("MATCH path = (n:Entity)-[r]->(m:Entity) RETURN path LIMIT 50")
                records = list(result)
            
            context_entities = set()
            relationships = []
            
            for record in records:
                path = record["path"]
                for node in path.nodes:
                    context_entities.add(f"{node['label']} ({node['type']})")
                for rel in path.relationships:
                    start_node = rel.start_node
                    end_node = rel.end_node
                    relationships.append(f"{start_node['label']} --{rel['relation']}--> {end_node['label']}")
            
            return {
                "entities": list(context_entities),
                "relationships": list(set(relationships))
            }

    def get_recent_sessions(self):
        with self.driver.session() as session:
            query = "MATCH (n:Entity) WHERE n.session_id IS NOT NULL RETURN DISTINCT n.session_id AS session_id"
            result = session.run(query)
            session_ids = [record["session_id"] for record in result if record["session_id"]]
            return session_ids

graph_service = GraphService()

