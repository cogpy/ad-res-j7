# AD Hypergraph Analysis Report
Generated: 2025-10-16T04:24:21.135074

## Executive Summary

- **Total AD Components Found**: 11855
- **Hypergraph Nodes**: 8
- **Hypergraph Edges**: 316
- **Repositories Analyzed**: 1

## Component Distribution by Type

- **Directory**: 3835 occurrences
- **Authorization**: 3434 occurrences
- **Identity**: 1930 occurrences
- **Authentication**: 1720 occurrences
- **Security**: 801 occurrences
- **Token**: 81 occurrences
- **Sso**: 36 occurrences
- **Api_Auth**: 18 occurrences

## Repository Analysis

### cogpy/ad-res-j7
- **Components Found**: 11855
- **Node Types**: sso, identity, directory, security, api_auth, authentication, token, authorization

**Top Files with AD Components:**
- `ad-hypergraph-mapping/ad_hypergraph_visualization.md`: 1112 components
- `ad-hypergraph-mapping/ad_hypergraph.json`: 662 components
- `jax-response/analysis-output/comprehensive_reference_index.json`: 295 components
- `docs/models/hypergnn/case-hypergraph.js`: 222 components
- `jax-response/AD/2-High-Priority/STAFF_ADMINISTRATOR_DATA_PROTECTION_CLARIFICATIONS.md`: 205 components

## Hypergraph Structure

### Node Connectivity

- **authorization components in cogpy/ad-res-j7**: 260 connections
- **authentication components in cogpy/ad-res-j7**: 222 connections
- **identity components in cogpy/ad-res-j7**: 218 connections
- **directory components in cogpy/ad-res-j7**: 169 connections
- **security components in cogpy/ad-res-j7**: 168 connections
- **token components in cogpy/ad-res-j7**: 26 connections
- **sso components in cogpy/ad-res-j7**: 10 connections
- **api_auth components in cogpy/ad-res-j7**: 8 connections

## Key Insights

### Cross-Repository Relationships
Found 0 edges connecting multiple repositories:


## Security Recommendations

Based on the AD component analysis:

✅ **Good**: Both authentication and authorization components found
✅ **Good**: Token-based authentication implemented
✅ **Good**: Security utilities and validation found
✅ **Good**: Single Sign-On capabilities detected

## Sample AD Components

### Authentication Examples

**File**: `ad-hypergraph-mapping/ad_hypergraph_mapper.py` (line 6)
**Context**:
```
============================================

Maps Active Directory and Authentication/Authorization components 
across multiple repositories to create a unified hypergraph view.

Repositories analyzed:
```

**File**: `ad-hypergraph-mapping/ad_hypergraph_mapper.py` (line 6)
**Context**:
```
============================================

Maps Active Directory and Authentication/Authorization components 
across multiple repositories to create a unified hypergraph view.

Repositories analyzed:
```

**File**: `ad-hypergraph-mapping/ad_hypergraph_mapper.py` (line 36)
**Context**:
```
@dataclass
class ADComponent:
    """Represents an AD/Auth component found in repositories"""
    component_type: str  # auth, identity, permission, role, token, etc.
    name: str
    description: str
```

### Authorization Examples

**File**: `hypergraph_resolver.py` (line 178)
**Context**:
```
@dataclass
class ActorNode(Node):
    role: str = ""

@dataclass
class Hyperedge:
```

**File**: `hypergraph_resolver.py` (line 236)
**Context**:
```
                    name=node_data["name"],
                    properties=node_data["properties"],
                    role=node_data["properties"].get("role", "")
                )
    return None

```

**File**: `hypergraph_resolver.py` (line 236)
**Context**:
```
                    name=node_data["name"],
                    properties=node_data["properties"],
                    role=node_data["properties"].get("role", "")
                )
    return None

```

### Identity Examples

**File**: `hypergraph_resolver.py` (line 356)
**Context**:
```
                "paragraph": para,
                "priority": para.priority,
                "required_evidence": ["Director loan account records", "Historical payment records", "Expert opinions"],
                "urgency": "HIGH" if para.priority_level == 1 else "MEDIUM"
            })
    
```

**File**: `hypergraph_resolver.py` (line 375)
**Context**:
```
            "Use PARA_7_2-7_5 as template for comprehensive evidence",
            "Obtain expert opinions for Responsible Person duties",
            "Compile director loan account statements"
        ]
    }

```

**File**: `ad-hypergraph-mapping/ad_hypergraph_mapper.py` (line 37)
**Context**:
```
class ADComponent:
    """Represents an AD/Auth component found in repositories"""
    component_type: str  # auth, identity, permission, role, token, etc.
    name: str
    description: str
    repository: str
```
