/**
 * HypergraphQL with Link Tuples
 * 
 * A query system for legal frameworks using hypergraph structures
 * with link tuples representing relationships between entities.
 * 
 * Link Tuple Format: [source, relation, target, metadata]
 */

class HypergraphQL {
  constructor() {
    this.entities = new Map(); // entity_id -> entity
    this.linkTuples = []; // array of [source, relation, target, metadata]
    this.relations = new Set(); // set of relation types
  }

  /**
   * Add an entity to the hypergraph
   * @param {string} id - Unique identifier
   * @param {string} type - Entity type (Person, Event, Evidence, Company, Date)
   * @param {object} properties - Additional properties
   */
  addEntity(id, type, properties = {}) {
    this.entities.set(id, {
      id,
      type,
      ...properties
    });
    return this;
  }

  /**
   * Add a link tuple representing a relationship
   * @param {string} source - Source entity ID
   * @param {string} relation - Relation type
   * @param {string} target - Target entity ID
   * @param {object} metadata - Optional metadata (date, evidence, confidence, etc.)
   */
  addLinkTuple(source, relation, target, metadata = {}) {
    this.linkTuples.push({
      source,
      relation,
      target,
      metadata
    });
    this.relations.add(relation);
    return this;
  }

  /**
   * Query entities by type
   * @param {string} type - Entity type to filter
   */
  queryEntitiesByType(type) {
    return Array.from(this.entities.values())
      .filter(entity => entity.type === type);
  }

  /**
   * Query link tuples by source entity
   * @param {string} sourceId - Source entity ID
   */
  queryLinksBySource(sourceId) {
    return this.linkTuples.filter(link => link.source === sourceId);
  }

  /**
   * Query link tuples by target entity
   * @param {string} targetId - Target entity ID
   */
  queryLinksByTarget(targetId) {
    return this.linkTuples.filter(link => link.target === targetId);
  }

  /**
   * Query link tuples by relation type
   * @param {string} relation - Relation type
   */
  queryLinksByRelation(relation) {
    return this.linkTuples.filter(link => link.relation === relation);
  }

  /**
   * Find all entities connected to a given entity
   * @param {string} entityId - Entity ID
   * @param {string} relation - Optional relation filter
   */
  findConnected(entityId, relation = null) {
    const links = [
      ...this.queryLinksBySource(entityId),
      ...this.queryLinksByTarget(entityId)
    ];

    if (relation) {
      return links
        .filter(link => link.relation === relation)
        .map(link => {
          const connectedId = link.source === entityId ? link.target : link.source;
          return {
            entity: this.entities.get(connectedId),
            link
          };
        });
    }

    return links.map(link => {
      const connectedId = link.source === entityId ? link.target : link.source;
      return {
        entity: this.entities.get(connectedId),
        link
      };
    });
  }

  /**
   * Find path between two entities
   * @param {string} startId - Starting entity ID
   * @param {string} endId - Ending entity ID
   * @param {number} maxDepth - Maximum search depth
   */
  findPath(startId, endId, maxDepth = 5) {
    const visited = new Set();
    const queue = [[startId]];

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === endId) {
        return this.constructPathDetails(path);
      }

      if (path.length >= maxDepth) {
        continue;
      }

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      const connected = this.findConnected(current);
      for (const { entity } of connected) {
        if (entity && !visited.has(entity.id)) {
          queue.push([...path, entity.id]);
        }
      }
    }

    return null; // No path found
  }

  /**
   * Construct detailed path information
   * @param {Array} entityIds - Array of entity IDs in path
   */
  constructPathDetails(entityIds) {
    const details = [];
    for (let i = 0; i < entityIds.length - 1; i++) {
      const source = entityIds[i];
      const target = entityIds[i + 1];
      
      const link = this.linkTuples.find(
        l => (l.source === source && l.target === target) ||
             (l.target === source && l.source === target)
      );

      details.push({
        from: this.entities.get(source),
        to: this.entities.get(target),
        link
      });
    }
    return details;
  }

  /**
   * Execute a complex query with filters
   * @param {object} query - Query object with filters
   */
  query(query) {
    const { entityType, relation, filters = {} } = query;
    
    let results = [];

    // Start with entity type filter if provided
    if (entityType) {
      results = this.queryEntitiesByType(entityType);
    } else {
      results = Array.from(this.entities.values());
    }

    // Apply property filters
    if (filters.properties) {
      results = results.filter(entity => {
        return Object.entries(filters.properties).every(([key, value]) => {
          return entity[key] === value;
        });
      });
    }

    // If relation is specified, filter by connected entities
    if (relation) {
      results = results.map(entity => {
        const connected = this.findConnected(entity.id, relation);
        return {
          entity,
          connected
        };
      });
    }

    return results;
  }

  /**
   * Export hypergraph to JSON
   */
  toJSON() {
    return {
      entities: Array.from(this.entities.entries()).map(([id, entity]) => entity),
      linkTuples: this.linkTuples,
      relations: Array.from(this.relations)
    };
  }

  /**
   * Import hypergraph from JSON
   * @param {object} data - JSON data
   */
  fromJSON(data) {
    // Clear existing data
    this.entities.clear();
    this.linkTuples = [];
    this.relations.clear();

    // Import entities
    if (data.entities) {
      data.entities.forEach(entity => {
        this.entities.set(entity.id, entity);
      });
    }

    // Import link tuples
    if (data.linkTuples) {
      this.linkTuples = data.linkTuples;
      data.linkTuples.forEach(link => {
        this.relations.add(link.relation);
      });
    }

    // Import relations if provided separately
    if (data.relations) {
      data.relations.forEach(rel => this.relations.add(rel));
    }

    return this;
  }

  /**
   * Get statistics about the hypergraph
   */
  getStats() {
    const typeCount = {};
    for (const entity of this.entities.values()) {
      typeCount[entity.type] = (typeCount[entity.type] || 0) + 1;
    }

    const relationCount = {};
    for (const link of this.linkTuples) {
      relationCount[link.relation] = (relationCount[link.relation] || 0) + 1;
    }

    return {
      totalEntities: this.entities.size,
      totalLinkTuples: this.linkTuples.length,
      totalRelations: this.relations.size,
      entitiesByType: typeCount,
      linksByRelation: relationCount
    };
  }
}

module.exports = HypergraphQL;
