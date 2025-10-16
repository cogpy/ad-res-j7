"""
HypergraphQL Resolver for Case 2025-137857
Implements GraphQL resolvers for querying the case hypergraph structure
"""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum

# Load hypergraph data
REPO_ROOT = Path(__file__).parent
with open(REPO_ROOT / "HYPERGRAPH_CASE_STRUCTURE.json") as f:
    HYPERGRAPH_DATA = json.load(f)

with open(REPO_ROOT / "STRATEGIC_DYNAMICS_ANALYSIS.json") as f:
    STRATEGIC_DATA = json.load(f)

# Enums
class NodeType(Enum):
    ACTOR = "actor"
    CATEGORY = "category"
    PARAGRAPH = "paragraph"
    EVIDENCE = "evidence"

class HyperedgeType(Enum):
    CATEGORIZATION = "categorization"
    SUPPORTS = "supports"
    STRATEGIC_CLUSTER = "strategic_cluster"

class CompletionStatus(Enum):
    COMPLETED = "completed"
    IN_PROGRESS = "in_progress"
    PENDING = "pending"
    NOT_STARTED = "not_started"

class EvidenceStatus(Enum):
    COMPREHENSIVE = "comprehensive"  # 10+ evidence items
    PARTIAL = "partial"              # 3-9 evidence items
    MINIMAL = "minimal"              # 1-2 evidence items
    NONE = "none"                    # 0 evidence items

# Data classes
@dataclass
class Node:
    id: str
    type: NodeType
    name: str
    properties: Dict[str, Any]
    
    def get_connections(self) -> List['Hyperedge']:
        """Get all hyperedges connected to this node"""
        return [
            Hyperedge.from_dict(edge)
            for edge in HYPERGRAPH_DATA["hyperedges"]
            if self.id in edge["nodes"]
        ]
    
    def get_degree(self) -> int:
        """Get the degree (number of connections) of this node"""
        return len(self.get_connections())

@dataclass
class ParagraphNode(Node):
    priority: str = ""
    priority_level: int = 0
    priority_weight: int = 0
    topic: str = ""
    claim: str = ""
    completed: bool = False
    evidence_count: int = 0
    
    def __post_init__(self):
        if self.properties:
            self.priority = self.properties.get("priority", "")
            self.priority_level = self.properties.get("priority_level", 0)
            self.priority_weight = self.properties.get("priorityLevel", 0)
            self.topic = self.properties.get("topic", "")
            self.claim = self.properties.get("claim", "")
            self.completed = self.properties.get("completed", False)
            self.evidence_count = self.properties.get("evidence_count", 0)
    
    def get_categories(self) -> List['CategoryNode']:
        """Get all categories this paragraph belongs to"""
        category_ids = [
            node_id for edge in HYPERGRAPH_DATA["hyperedges"]
            if self.id in edge["nodes"] and edge["type"] == "categorization"
            for node_id in edge["nodes"]
            if node_id.startswith("category_")
        ]
        return [get_node_by_id(cid) for cid in category_ids]
    
    def get_evidence(self) -> List['EvidenceNode']:
        """Get all evidence supporting this paragraph"""
        evidence_ids = [
            node_id for edge in HYPERGRAPH_DATA["hyperedges"]
            if self.id in edge["nodes"] and edge["type"] == "supports"
            for node_id in edge["nodes"]
            if node_id.startswith("evidence_")
        ]
        return [get_node_by_id(eid) for eid in evidence_ids]
    
    def get_completion_status(self) -> CompletionStatus:
        """Determine completion status"""
        if self.completed:
            return CompletionStatus.COMPLETED
        elif self.evidence_count > 0:
            return CompletionStatus.IN_PROGRESS
        else:
            return CompletionStatus.NOT_STARTED
    
    def get_evidence_status(self) -> EvidenceStatus:
        """Determine evidence status"""
        if self.evidence_count >= 10:
            return EvidenceStatus.COMPREHENSIVE
        elif self.evidence_count >= 3:
            return EvidenceStatus.PARTIAL
        elif self.evidence_count >= 1:
            return EvidenceStatus.MINIMAL
        else:
            return EvidenceStatus.NONE
    
    def get_strategic_importance(self) -> float:
        """Calculate strategic importance score"""
        # Based on priority weight, category count, and evidence count
        base_score = self.priority_weight * 10
        category_bonus = len(self.get_categories()) * 2
        evidence_penalty = -5 if self.evidence_count == 0 else 0
        return base_score + category_bonus + evidence_penalty

@dataclass
class CategoryNode(Node):
    theme_type: str = ""
    
    def get_paragraphs(self) -> List[ParagraphNode]:
        """Get all paragraphs in this category"""
        paragraph_ids = [
            node_id for edge in HYPERGRAPH_DATA["hyperedges"]
            if self.id in edge["nodes"] and edge["type"] == "categorization"
            for node_id in edge["nodes"]
            if node_id.startswith("paragraph_")
        ]
        return [get_node_by_id(pid) for pid in paragraph_ids]
    
    def get_paragraph_count(self) -> int:
        """Get count of paragraphs in this category"""
        return len(self.get_paragraphs())
    
    def get_strategic_importance(self) -> float:
        """Calculate strategic importance based on paragraph count and priority"""
        paragraphs = self.get_paragraphs()
        if not paragraphs:
            return 0.0
        avg_priority = sum(p.priority_weight for p in paragraphs) / len(paragraphs)
        return avg_priority * len(paragraphs)

@dataclass
class EvidenceNode(Node):
    evidence_type: str = ""
    
    def get_supported_paragraphs(self) -> List[ParagraphNode]:
        """Get all paragraphs supported by this evidence"""
        paragraph_ids = [
            node_id for edge in HYPERGRAPH_DATA["hyperedges"]
            if self.id in edge["nodes"] and edge["type"] == "supports"
            for node_id in edge["nodes"]
            if node_id.startswith("paragraph_")
        ]
        return [get_node_by_id(pid) for pid in paragraph_ids]
    
    def get_support_count(self) -> int:
        """Get count of paragraphs supported"""
        return len(self.get_supported_paragraphs())

@dataclass
class ActorNode(Node):
    role: str = ""

@dataclass
class Hyperedge:
    nodes: List[str]
    type: HyperedgeType
    weight: float
    name: Optional[str] = None
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Hyperedge':
        return cls(
            nodes=data["nodes"],
            type=HyperedgeType(data["type"]),
            weight=data.get("weight", 1.0),
            name=data.get("name")
        )
    
    def get_node_objects(self) -> List[Node]:
        """Get node objects for all nodes in this hyperedge"""
        return [get_node_by_id(node_id) for node_id in self.nodes]

# Helper functions
def get_node_by_id(node_id: str) -> Optional[Node]:
    """Get a node by its ID"""
    for node_data in HYPERGRAPH_DATA["nodes"]:
        if node_data["id"] == node_id:
            node_type = NodeType(node_data["type"])
            
            if node_type == NodeType.PARAGRAPH:
                return ParagraphNode(
                    id=node_data["id"],
                    type=node_type,
                    name=node_data["name"],
                    properties=node_data["properties"]
                )
            elif node_type == NodeType.CATEGORY:
                return CategoryNode(
                    id=node_data["id"],
                    type=node_type,
                    name=node_data["name"],
                    properties=node_data["properties"],
                    theme_type=node_data["properties"].get("type", "")
                )
            elif node_type == NodeType.EVIDENCE:
                return EvidenceNode(
                    id=node_data["id"],
                    type=node_type,
                    name=node_data["name"],
                    properties=node_data["properties"],
                    evidence_type=node_data["properties"].get("type", "")
                )
            elif node_type == NodeType.ACTOR:
                return ActorNode(
                    id=node_data["id"],
                    type=node_type,
                    name=node_data["name"],
                    properties=node_data["properties"],
                    role=node_data["properties"].get("role", "")
                )
    return None

def get_nodes(node_type: Optional[NodeType] = None, limit: int = 100, offset: int = 0) -> List[Node]:
    """Get all nodes, optionally filtered by type"""
    nodes = []
    for node_data in HYPERGRAPH_DATA["nodes"][offset:offset+limit]:
        if node_type is None or NodeType(node_data["type"]) == node_type:
            node = get_node_by_id(node_data["id"])
            if node:
                nodes.append(node)
    return nodes

def get_paragraphs_by_priority(level: int) -> List[ParagraphNode]:
    """Get all paragraphs at a specific priority level"""
    return [
        node for node in get_nodes(NodeType.PARAGRAPH)
        if isinstance(node, ParagraphNode) and node.priority_level == level
    ]

def get_paragraphs_by_category(category: str) -> List[ParagraphNode]:
    """Get all paragraphs in a specific category"""
    # Find the category node
    category_node = None
    for node in get_nodes(NodeType.CATEGORY):
        if isinstance(node, CategoryNode) and node.name == category:
            category_node = node
            break
    
    if category_node:
        return category_node.get_paragraphs()
    return []

def get_strategic_clusters() -> List[Dict]:
    """Get all strategic clusters"""
    clusters = []
    
    # Find strategic cluster hyperedges
    for edge_data in HYPERGRAPH_DATA["hyperedges"]:
        if edge_data["type"] == "strategic_cluster":
            paragraphs = [get_node_by_id(nid) for nid in edge_data["nodes"] if nid.startswith("paragraph_")]
            
            # Calculate metrics
            completed_count = sum(1 for p in paragraphs if p.completed)
            with_evidence = sum(1 for p in paragraphs if p.evidence_count > 0)
            
            clusters.append({
                "name": edge_data.get("name", "Unnamed Cluster"),
                "paragraphs": paragraphs,
                "weight": edge_data.get("weight", 1.0),
                "completion_rate": completed_count / len(paragraphs) if paragraphs else 0,
                "evidence_coverage": with_evidence / len(paragraphs) if paragraphs else 0
            })
    
    return clusters

def get_network_stats() -> Dict:
    """Calculate network statistics"""
    nodes = HYPERGRAPH_DATA["nodes"]
    edges = HYPERGRAPH_DATA["hyperedges"]
    
    node_types = {"actors": 0, "categories": 0, "paragraphs": 0, "evidence": 0}
    for node in nodes:
        node_type = node["type"]
        if node_type == "actor":
            node_types["actors"] += 1
        elif node_type == "category":
            node_types["categories"] += 1
        elif node_type == "paragraph":
            node_types["paragraphs"] += 1
        elif node_type == "evidence":
            node_types["evidence"] += 1
    
    edge_types = {"categorization": 0, "supports": 0, "strategic_cluster": 0}
    for edge in edges:
        edge_type = edge["type"]
        edge_types[edge_type] = edge_types.get(edge_type, 0) + 1
    
    total_connections = sum(len(edge["nodes"]) for edge in edges)
    avg_degree = total_connections / len(nodes) if nodes else 0
    
    max_possible_edges = len(nodes) * (len(nodes) - 1) / 2
    density = len(edges) / max_possible_edges if max_possible_edges > 0 else 0
    
    return {
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "nodes_by_type": node_types,
        "edges_by_type": edge_types,
        "average_degree": avg_degree,
        "density": density,
        "connected_components": 1,  # Simplified
        "clustering_coefficient": 0.0  # Simplified
    }

def get_evidence_coverage() -> Dict:
    """Analyze evidence coverage"""
    paragraphs = get_nodes(NodeType.PARAGRAPH)
    
    with_evidence = sum(1 for p in paragraphs if p.evidence_count > 0)
    without_evidence = len(paragraphs) - with_evidence
    
    # Coverage by priority
    coverage_by_priority = {}
    for level in range(1, 6):
        level_paras = [p for p in paragraphs if p.priority_level == level]
        if level_paras:
            level_with_evidence = sum(1 for p in level_paras if p.evidence_count > 0)
            coverage_by_priority[level] = level_with_evidence / len(level_paras)
        else:
            coverage_by_priority[level] = 0.0
    
    # Identify evidence gaps
    evidence_gaps = []
    for para in paragraphs:
        if para.evidence_count == 0 and para.priority_level <= 2:
            evidence_gaps.append({
                "paragraph": para,
                "priority": para.priority,
                "required_evidence": ["Director loan account records", "Historical payment records", "Expert opinions"],
                "urgency": "HIGH" if para.priority_level == 1 else "MEDIUM"
            })
    
    return {
        "overall_coverage": with_evidence / len(paragraphs) if paragraphs else 0,
        "coverage_by_priority": {
            "critical": coverage_by_priority.get(1, 0),
            "high": coverage_by_priority.get(2, 0),
            "medium": coverage_by_priority.get(3, 0),
            "low": coverage_by_priority.get(4, 0)
        },
        "paragraphs_with_evidence": with_evidence,
        "paragraphs_without_evidence": without_evidence,
        "evidence_gaps": evidence_gaps,
        "recommendations": [
            "Prioritize evidence gathering for critical paragraphs",
            "Use PARA_7_2-7_5 as template for comprehensive evidence",
            "Obtain expert opinions for Responsible Person duties",
            "Compile director loan account statements"
        ]
    }

def get_critical_path() -> Dict:
    """Analyze critical path for case preparation"""
    all_paragraphs = get_nodes(NodeType.PARAGRAPH)
    
    critical = [p for p in all_paragraphs if p.priority_level == 1]
    high = [p for p in all_paragraphs if p.priority_level == 2]
    
    # Bottlenecks: incomplete critical/high priority paragraphs
    bottlenecks = [p for p in critical + high if not p.completed]
    
    # Evidence gaps: critical/high priority without evidence
    evidence_gaps = [p for p in critical + high if p.evidence_count == 0]
    
    # Recommended sequence: by priority, then by evidence count
    recommended = sorted(
        all_paragraphs,
        key=lambda p: (p.priority_level, -p.evidence_count, not p.completed)
    )
    
    completed = sum(1 for p in all_paragraphs if p.completed)
    pending = len(all_paragraphs) - completed
    
    # Estimate effort (hours per paragraph based on priority)
    effort_map = {1: 8, 2: 6, 3: 4, 4: 2, 5: 1}
    estimated_hours = sum(effort_map.get(p.priority_level, 4) for p in all_paragraphs if not p.completed)
    
    return {
        "critical_paragraphs": critical,
        "high_priority_paragraphs": high,
        "completion_bottlenecks": bottlenecks,
        "evidence_gaps": evidence_gaps,
        "recommended_sequence": recommended,
        "estimated_effort": {
            "total_paragraphs": len(all_paragraphs),
            "completed_paragraphs": completed,
            "pending_paragraphs": pending,
            "estimated_hours": estimated_hours,
            "estimated_days": estimated_hours / 8,
            "priority_breakdown": {
                "critical": sum(1 for p in all_paragraphs if p.priority_level == 1 and not p.completed),
                "high": sum(1 for p in all_paragraphs if p.priority_level == 2 and not p.completed),
                "medium": sum(1 for p in all_paragraphs if p.priority_level == 3 and not p.completed),
                "low": sum(1 for p in all_paragraphs if p.priority_level >= 4 and not p.completed)
            }
        }
    }

# GraphQL Resolvers
class Query:
    @staticmethod
    def case_metadata():
        return HYPERGRAPH_DATA["metadata"]
    
    @staticmethod
    def nodes(type=None, limit=100, offset=0):
        return get_nodes(type, limit, offset)
    
    @staticmethod
    def node(id):
        return get_node_by_id(id)
    
    @staticmethod
    def paragraphs_by_priority(level):
        return get_paragraphs_by_priority(level)
    
    @staticmethod
    def paragraphs_by_category(category):
        return get_paragraphs_by_category(category)
    
    @staticmethod
    def strategic_clusters():
        return get_strategic_clusters()
    
    @staticmethod
    def network_stats():
        return get_network_stats()
    
    @staticmethod
    def evidence_coverage():
        return get_evidence_coverage()
    
    @staticmethod
    def critical_path():
        return get_critical_path()

# Example usage
if __name__ == "__main__":
    print("=== Case Metadata ===")
    print(json.dumps(Query.case_metadata(), indent=2))
    
    print("\n=== Network Statistics ===")
    print(json.dumps(Query.network_stats(), indent=2))
    
    print("\n=== Critical Paragraphs ===")
    critical = Query.paragraphs_by_priority(1)
    for para in critical:
        print(f"- {para.name}: {para.topic} (Completed: {para.completed}, Evidence: {para.evidence_count})")
    
    print("\n=== Evidence Coverage ===")
    coverage = Query.evidence_coverage()
    print(f"Overall: {coverage['overall_coverage']*100:.1f}%")
    print(f"Critical: {coverage['coverage_by_priority']['critical']*100:.1f}%")
    print(f"High: {coverage['coverage_by_priority']['high']*100:.1f}%")
    
    print("\n=== Critical Path Analysis ===")
    critical_path = Query.critical_path()
    print(f"Estimated effort: {critical_path['estimated_effort']['estimated_hours']:.0f} hours ({critical_path['estimated_effort']['estimated_days']:.1f} days)")
    print(f"Bottlenecks: {len(critical_path['completion_bottlenecks'])} paragraphs")
    print(f"Evidence gaps: {len(critical_path['evidence_gaps'])} paragraphs")
