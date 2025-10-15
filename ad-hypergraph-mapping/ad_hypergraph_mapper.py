#!/usr/bin/env python3
"""
AD Hypergraph Mapper - Comprehensive Analysis
============================================

Maps Active Directory and Authentication/Authorization components 
across multiple repositories to create a unified hypergraph view.

Repositories analyzed:
- https://github.com/cogpy/ad-res-j7
- https://github.com/EchoCog/analysss
- https://github.com/rzonedevops/avtomaatoctory  
- https://github.com/rzonedevops/analyticase
"""

import json
import logging
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass, field
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class ADComponent:
    """Represents an AD/Auth component found in repositories"""
    component_type: str  # auth, identity, permission, role, token, etc.
    name: str
    description: str
    repository: str
    file_path: str
    line_number: int = 0
    context: str = ""
    references: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)


@dataclass
class ADRelationship:
    """Represents relationships between AD components"""
    source: str  # Component ID
    target: str  # Component ID  
    relationship_type: str  # uses, depends_on, authenticates, authorizes, etc.
    repository: str
    strength: float = 0.5
    evidence: List[str] = field(default_factory=list)


@dataclass 
class ADHypergraphNode:
    """Node in the AD hypergraph"""
    id: str
    node_type: str  # auth_service, identity_provider, permission_system, etc.
    name: str
    repositories: Set[str] = field(default_factory=set)
    components: List[ADComponent] = field(default_factory=list)
    properties: Dict[str, any] = field(default_factory=dict)
    

@dataclass
class ADHypergraphEdge:
    """Hyperedge connecting multiple nodes"""
    id: str
    edge_type: str
    nodes: List[str]  # Node IDs connected by this edge
    repositories: Set[str] = field(default_factory=set)
    relationships: List[ADRelationship] = field(default_factory=list)
    properties: Dict[str, any] = field(default_factory=dict)


class ADHypergraphMapper:
    """Main class for AD hypergraph mapping"""
    
    # AD/Auth related patterns to search for
    AD_PATTERNS = {
        'authentication': r'\b(auth[a-z]*|login|signin|logout|signout|credential|password)\b',
        'authorization': r'\b(authoriz[a-z]*|permission|role|access|grant|deny|policy)\b',
        'identity': r'\b(identity|user|account|profile|principal|subject)\b',
        'token': r'\b(token|jwt|oauth|bearer|session|cookie)\b',
        'directory': r'\b(ldap|active.?directory|ad|directory.?service)\b',
        'sso': r'\b(sso|single.?sign.?on|saml|openid|oidc)\b',
        'security': r'\b(security|encrypt|decrypt|hash|salt|verify|validate)\b',
        'api_auth': r'\b(api.?key|api.?token|api.?auth|api.?credential)\b'
    }
    
    def __init__(self, workspace_dir: str = "/workspace/ad-hypergraph-mapping"):
        self.workspace_dir = Path(workspace_dir)
        self.repos_dir = self.workspace_dir / "repos"
        
        # Repository information
        self.repositories = {
            "cogpy/ad-res-j7": self.repos_dir / "ad-res-j7",
            "EchoCog/analysss": self.repos_dir / "analysss",
            "rzonedevops/avtomaatoctory": self.repos_dir / "avtomaatoctory",
            "rzonedevops/analyticase": self.repos_dir / "analyticase"
        }
        
        # Hypergraph components
        self.nodes: Dict[str, ADHypergraphNode] = {}
        self.edges: Dict[str, ADHypergraphEdge] = {}
        self.components: List[ADComponent] = []
        self.relationships: List[ADRelationship] = []
        
    def analyze_all_repositories(self):
        """Analyze all repositories for AD components"""
        logger.info("Starting AD hypergraph analysis...")
        
        for repo_key, repo_path in self.repositories.items():
            if repo_path.exists():
                logger.info(f"Analyzing repository: {repo_key}")
                self._analyze_repository(repo_key, repo_path)
            else:
                logger.warning(f"Repository not found: {repo_key}")
                
        # Build hypergraph from components
        self._build_hypergraph()
        
        logger.info(f"Analysis complete. Found {len(self.components)} AD components")
        
    def _analyze_repository(self, repo_key: str, repo_path: Path):
        """Analyze a single repository for AD components"""
        
        # Search for AD patterns in various file types
        for file_pattern in ["*.py", "*.js", "*.ts", "*.json", "*.md", "*.yml", "*.yaml"]:
            for file_path in repo_path.rglob(file_pattern):
                # Skip hidden and vendor directories
                if any(part.startswith('.') or part in ['node_modules', 'vendor', '__pycache__'] 
                       for part in file_path.parts):
                    continue
                    
                self._analyze_file(repo_key, file_path)
                
    def _analyze_file(self, repo_key: str, file_path: Path):
        """Analyze a single file for AD components"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Search for AD patterns
            for pattern_type, pattern in self.AD_PATTERNS.items():
                matches = list(re.finditer(pattern, content, re.IGNORECASE))
                
                for match in matches:
                    # Get line number
                    line_num = content[:match.start()].count('\n') + 1
                    
                    # Extract context (surrounding lines)
                    lines = content.split('\n')
                    start_line = max(0, line_num - 3)
                    end_line = min(len(lines), line_num + 3)
                    context = '\n'.join(lines[start_line:end_line])
                    
                    # Create AD component
                    component = ADComponent(
                        component_type=pattern_type,
                        name=match.group(0),
                        description=f"{pattern_type} component found in {file_path.name}",
                        repository=repo_key,
                        file_path=str(file_path.relative_to(self.repos_dir)),
                        line_number=line_num,
                        context=context
                    )
                    
                    # Extract additional information based on file type
                    if file_path.suffix == '.json':
                        self._enhance_component_from_json(component, content, match)
                    elif file_path.suffix in ['.py', '.js', '.ts']:
                        self._enhance_component_from_code(component, content, match)
                        
                    self.components.append(component)
                    
        except Exception as e:
            logger.debug(f"Error analyzing file {file_path}: {e}")
            
    def _enhance_component_from_json(self, component: ADComponent, content: str, match):
        """Enhance component information from JSON context"""
        try:
            data = json.loads(content)
            # Look for related configuration
            if isinstance(data, dict):
                for key, value in data.items():
                    if component.name.lower() in key.lower():
                        component.properties = {"config": value}
                        break
        except:
            pass
            
    def _enhance_component_from_code(self, component: ADComponent, content: str, match):
        """Enhance component information from code context"""
        # Extract function/class context if available
        lines = content.split('\n')
        line_idx = content[:match.start()].count('\n')
        
        # Look for function or class definition
        for i in range(line_idx, max(-1, line_idx - 10), -1):
            line = lines[i].strip()
            if line.startswith(('def ', 'function ', 'class ', 'const ', 'let ', 'var ')):
                component.description = f"{component.component_type} in {line}"
                break
                
    def _build_hypergraph(self):
        """Build hypergraph from discovered components"""
        logger.info("Building AD hypergraph...")
        
        # Group components by type and repository
        component_groups = {}
        for component in self.components:
            key = (component.component_type, component.repository)
            if key not in component_groups:
                component_groups[key] = []
            component_groups[key].append(component)
            
        # Create nodes for each component type/repo combination
        for (comp_type, repo), components in component_groups.items():
            node_id = f"{repo}:{comp_type}"
            
            node = ADHypergraphNode(
                id=node_id,
                node_type=comp_type,
                name=f"{comp_type} components in {repo}",
                repositories={repo},
                components=components,
                properties={
                    "count": len(components),
                    "files": list(set(c.file_path for c in components))
                }
            )
            
            self.nodes[node_id] = node
            
        # Create edges based on co-occurrence and relationships
        self._create_hypergraph_edges()
        
    def _create_hypergraph_edges(self):
        """Create hyperedges based on component relationships"""
        
        # Group components by file to find co-occurrences
        file_components = {}
        for component in self.components:
            file_key = (component.repository, component.file_path)
            if file_key not in file_components:
                file_components[file_key] = []
            file_components[file_key].append(component)
            
        # Create edges for components that appear together
        edge_id = 0
        for (repo, file_path), components in file_components.items():
            if len(components) > 1:
                # Get unique component types
                comp_types = set(c.component_type for c in components)
                
                if len(comp_types) > 1:
                    # Create hyperedge connecting these component types
                    node_ids = [f"{repo}:{ct}" for ct in comp_types]
                    
                    edge = ADHypergraphEdge(
                        id=f"edge_{edge_id}",
                        edge_type="co_occurrence",
                        nodes=node_ids,
                        repositories={repo},
                        properties={
                            "file": file_path,
                            "strength": len(components) / 10.0  # Normalize
                        }
                    )
                    
                    self.edges[edge.id] = edge
                    edge_id += 1
                    
        # Create edges based on known relationships
        self._create_semantic_edges()
        
    def _create_semantic_edges(self):
        """Create edges based on semantic relationships between AD components"""
        
        # Known relationships between component types
        semantic_relationships = [
            ("authentication", "identity", "authenticates"),
            ("authentication", "token", "generates"),
            ("authorization", "permission", "enforces"),
            ("authorization", "role", "manages"),
            ("identity", "directory", "stored_in"),
            ("sso", "authentication", "provides"),
            ("token", "api_auth", "used_for"),
            ("security", "authentication", "secures"),
            ("security", "authorization", "secures")
        ]
        
        edge_id = len(self.edges)
        
        for source_type, target_type, rel_type in semantic_relationships:
            # Find nodes of these types
            source_nodes = [n for n in self.nodes.values() if n.node_type == source_type]
            target_nodes = [n for n in self.nodes.values() if n.node_type == target_type]
            
            if source_nodes and target_nodes:
                # Create edge connecting all instances
                node_ids = [n.id for n in source_nodes] + [n.id for n in target_nodes]
                repos = set()
                for n in source_nodes + target_nodes:
                    repos.update(n.repositories)
                    
                edge = ADHypergraphEdge(
                    id=f"semantic_edge_{edge_id}",
                    edge_type=rel_type,
                    nodes=list(set(node_ids)),
                    repositories=repos,
                    properties={
                        "relationship": f"{source_type} {rel_type} {target_type}",
                        "semantic": True
                    }
                )
                
                self.edges[edge.id] = edge
                edge_id += 1
                
    def generate_visualization(self, output_path: str = None):
        """Generate Mermaid diagram visualization of the hypergraph"""
        if output_path is None:
            output_path = str(self.workspace_dir / "ad_hypergraph_visualization.md")
            
        mermaid_lines = [
            "# AD Hypergraph Visualization",
            "",
            "```mermaid",
            "graph TB"
        ]
        
        # Define node styles by type
        node_styles = {
            "authentication": "fill:#ff9999",
            "authorization": "fill:#99ff99", 
            "identity": "fill:#9999ff",
            "token": "fill:#ffff99",
            "directory": "fill:#ff99ff",
            "sso": "fill:#99ffff",
            "security": "fill:#ffcc99",
            "api_auth": "fill:#cc99ff"
        }
        
        # Add nodes
        for node in self.nodes.values():
            node_label = f"{node.name}<br/>({len(node.components)} components)"
            style = node_styles.get(node.node_type, "fill:#cccccc")
            mermaid_lines.append(f'    {node.id.replace(":", "_")}["{node_label}"]')
            mermaid_lines.append(f'    style {node.id.replace(":", "_")} {style}')
            
        # Add edges
        for edge in self.edges.values():
            if len(edge.nodes) == 2:
                # Simple edge
                source = edge.nodes[0].replace(":", "_")
                target = edge.nodes[1].replace(":", "_")
                label = edge.edge_type.replace("_", " ")
                mermaid_lines.append(f'    {source} -->|{label}| {target}')
            else:
                # Hyperedge - create a connector node
                connector_id = f"conn_{edge.id}"
                mermaid_lines.append(f'    {connector_id}(("{edge.edge_type}"))')
                mermaid_lines.append(f'    style {connector_id} fill:#ffffff,stroke:#333333')
                
                for node_id in edge.nodes:
                    safe_id = node_id.replace(":", "_")
                    mermaid_lines.append(f'    {safe_id} --- {connector_id}')
                    
        mermaid_lines.append("```")
        
        # Add legend
        mermaid_lines.extend([
            "",
            "## Legend",
            "",
            "- **Authentication** (Red): Login, credentials, authentication services",
            "- **Authorization** (Green): Permissions, roles, access control",
            "- **Identity** (Blue): User management, profiles, principals",
            "- **Token** (Yellow): JWT, OAuth, session management",
            "- **Directory** (Magenta): LDAP, Active Directory services",
            "- **SSO** (Cyan): Single Sign-On implementations",
            "- **Security** (Orange): Encryption, validation, security utilities",
            "- **API Auth** (Purple): API keys, API authentication"
        ])
        
        with open(output_path, 'w') as f:
            f.write('\n'.join(mermaid_lines))
            
        logger.info(f"Visualization saved to: {output_path}")
        return output_path
        
    def generate_report(self, output_path: str = None):
        """Generate comprehensive analysis report"""
        if output_path is None:
            output_path = str(self.workspace_dir / "ad_hypergraph_report.md")
            
        report_lines = [
            "# AD Hypergraph Analysis Report",
            f"Generated: {datetime.now().isoformat()}",
            "",
            "## Executive Summary",
            "",
            f"- **Total AD Components Found**: {len(self.components)}",
            f"- **Hypergraph Nodes**: {len(self.nodes)}",
            f"- **Hypergraph Edges**: {len(self.edges)}",
            f"- **Repositories Analyzed**: {len(self.repositories)}",
            "",
            "## Component Distribution by Type",
            ""
        ]
        
        # Count components by type
        type_counts = {}
        for component in self.components:
            type_counts[component.component_type] = type_counts.get(component.component_type, 0) + 1
            
        for comp_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
            report_lines.append(f"- **{comp_type.title()}**: {count} occurrences")
            
        report_lines.extend([
            "",
            "## Repository Analysis",
            ""
        ])
        
        # Analyze each repository
        for repo_key in self.repositories:
            repo_components = [c for c in self.components if c.repository == repo_key]
            repo_nodes = [n for n in self.nodes.values() if repo_key in n.repositories]
            
            report_lines.extend([
                f"### {repo_key}",
                f"- **Components Found**: {len(repo_components)}",
                f"- **Node Types**: {', '.join(set(n.node_type for n in repo_nodes))}",
                ""
            ])
            
            # Top files with AD components
            file_counts = {}
            for comp in repo_components:
                file_counts[comp.file_path] = file_counts.get(comp.file_path, 0) + 1
                
            report_lines.append("**Top Files with AD Components:**")
            for file_path, count in sorted(file_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
                report_lines.append(f"- `{file_path}`: {count} components")
                
            report_lines.append("")
            
        # Hypergraph structure analysis
        report_lines.extend([
            "## Hypergraph Structure",
            "",
            "### Node Connectivity",
            ""
        ])
        
        # Calculate node connectivity
        node_connections = {}
        for edge in self.edges.values():
            for node_id in edge.nodes:
                if node_id not in node_connections:
                    node_connections[node_id] = 0
                node_connections[node_id] += 1
                
        for node_id, connections in sorted(node_connections.items(), key=lambda x: x[1], reverse=True):
            node = self.nodes.get(node_id)
            if node:
                report_lines.append(f"- **{node.name}**: {connections} connections")
                
        # Key insights
        report_lines.extend([
            "",
            "## Key Insights",
            ""
        ])
        
        # Find cross-repository patterns
        cross_repo_edges = [e for e in self.edges.values() if len(e.repositories) > 1]
        
        report_lines.append(f"### Cross-Repository Relationships")
        report_lines.append(f"Found {len(cross_repo_edges)} edges connecting multiple repositories:")
        report_lines.append("")
        
        for edge in cross_repo_edges[:5]:
            repos = ', '.join(edge.repositories)
            report_lines.append(f"- {edge.edge_type}: connects {repos}")
            
        # Security recommendations
        report_lines.extend([
            "",
            "## Security Recommendations",
            "",
            "Based on the AD component analysis:",
            ""
        ])
        
        if "authentication" in type_counts and "authorization" in type_counts:
            report_lines.append("✅ **Good**: Both authentication and authorization components found")
        else:
            report_lines.append("⚠️ **Warning**: Missing authentication or authorization components")
            
        if "token" in type_counts:
            report_lines.append("✅ **Good**: Token-based authentication implemented")
            
        if "security" in type_counts:
            report_lines.append("✅ **Good**: Security utilities and validation found")
            
        if "sso" in type_counts:
            report_lines.append("✅ **Good**: Single Sign-On capabilities detected")
            
        # Sample components for reference
        report_lines.extend([
            "",
            "## Sample AD Components",
            ""
        ])
        
        for comp_type in ["authentication", "authorization", "identity"]:
            type_components = [c for c in self.components if c.component_type == comp_type][:3]
            
            if type_components:
                report_lines.append(f"### {comp_type.title()} Examples")
                report_lines.append("")
                
                for comp in type_components:
                    report_lines.extend([
                        f"**File**: `{comp.file_path}` (line {comp.line_number})",
                        f"**Context**:",
                        "```",
                        comp.context,
                        "```",
                        ""
                    ])
                    
        with open(output_path, 'w') as f:
            f.write('\n'.join(report_lines))
            
        logger.info(f"Report saved to: {output_path}")
        return output_path
        
    def export_hypergraph(self, output_path: str = None):
        """Export hypergraph to JSON format"""
        if output_path is None:
            output_path = str(self.workspace_dir / "ad_hypergraph.json")
            
        hypergraph_data = {
            "metadata": {
                "generated": datetime.now().isoformat(),
                "total_components": len(self.components),
                "total_nodes": len(self.nodes),
                "total_edges": len(self.edges),
                "repositories": list(self.repositories.keys())
            },
            "nodes": {
                node_id: {
                    "id": node.id,
                    "type": node.node_type,
                    "name": node.name,
                    "repositories": list(node.repositories),
                    "component_count": len(node.components),
                    "properties": node.properties
                }
                for node_id, node in self.nodes.items()
            },
            "edges": {
                edge.id: {
                    "id": edge.id,
                    "type": edge.edge_type,
                    "nodes": edge.nodes,
                    "repositories": list(edge.repositories),
                    "properties": edge.properties
                }
                for edge in self.edges.values()
            },
            "components": [
                {
                    "type": comp.component_type,
                    "name": comp.name,
                    "repository": comp.repository,
                    "file": comp.file_path,
                    "line": comp.line_number,
                    "description": comp.description
                }
                for comp in self.components[:100]  # Limit to first 100 for brevity
            ]
        }
        
        with open(output_path, 'w') as f:
            json.dump(hypergraph_data, f, indent=2)
            
        logger.info(f"Hypergraph exported to: {output_path}")
        return output_path


def main():
    """Main entry point"""
    logger.info("Starting AD Hypergraph Mapping...")
    
    # Create mapper instance
    mapper = ADHypergraphMapper()
    
    # Analyze all repositories
    mapper.analyze_all_repositories()
    
    # Generate outputs
    visualization_path = mapper.generate_visualization()
    report_path = mapper.generate_report()
    hypergraph_path = mapper.export_hypergraph()
    
    print("\n🎯 AD Hypergraph Mapping Complete!")
    print(f"📊 Found {len(mapper.components)} AD components")
    print(f"🔗 Created {len(mapper.nodes)} nodes and {len(mapper.edges)} edges")
    print(f"\n📄 Outputs generated:")
    print(f"  - Visualization: {visualization_path}")
    print(f"  - Report: {report_path}")
    print(f"  - Hypergraph JSON: {hypergraph_path}")


if __name__ == "__main__":
    main()