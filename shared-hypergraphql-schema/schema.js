/**
 * Unified HyperGraphQL Schema for Cross-Repository Data Integration
 * 
 * This schema supports data models from:
 * - ad-res-j7: Advertisement and resource management
 * - analysss: Analysis systems
 * - analysis: General analysis framework
 * - avtomaatoctory: Automation factory patterns
 * - analyticase: Analytics case management
 */

const HyperGraphQLSchema = {
  // Core Entity Types
  entityTypes: {
    // Data & Analytics Entities
    Dataset: {
      description: "A collection of data points for analysis",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        source: { type: "string" },
        format: { type: "string", enum: ["csv", "json", "xml", "parquet", "avro"] },
        size: { type: "number" },
        created: { type: "datetime" },
        updated: { type: "datetime" },
        schema: { type: "object" },
        tags: { type: "array", items: "string" },
        quality: { type: "object", properties: {
          completeness: { type: "number", min: 0, max: 1 },
          accuracy: { type: "number", min: 0, max: 1 },
          consistency: { type: "number", min: 0, max: 1 }
        }}
      }
    },

    Analysis: {
      description: "An analytical process or study",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        type: { type: "string", enum: ["statistical", "ml", "exploratory", "diagnostic", "predictive", "prescriptive"] },
        status: { type: "string", enum: ["planned", "running", "completed", "failed", "cancelled"] },
        methodology: { type: "string" },
        created: { type: "datetime" },
        completed: { type: "datetime" },
        runtime: { type: "number" },
        results: { type: "object" },
        confidence: { type: "number", min: 0, max: 1 },
        parameters: { type: "object" }
      }
    },

    Model: {
      description: "A computational or analytical model",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        type: { type: "string", enum: ["regression", "classification", "clustering", "neural_network", "time_series", "nlp", "custom"] },
        version: { type: "string" },
        accuracy: { type: "number" },
        framework: { type: "string" },
        hyperparameters: { type: "object" },
        training_data: { type: "string" },
        validation_metrics: { type: "object" },
        deployment_status: { type: "string", enum: ["development", "staging", "production", "deprecated"] }
      }
    },

    // Automation Entities
    Workflow: {
      description: "An automated workflow or process",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        description: { type: "string" },
        type: { type: "string", enum: ["etl", "data_pipeline", "ml_pipeline", "orchestration", "integration"] },
        schedule: { type: "string" },
        status: { type: "string", enum: ["active", "paused", "disabled", "error"] },
        steps: { type: "array", items: "object" },
        triggers: { type: "array", items: "string" },
        dependencies: { type: "array", items: "string" },
        config: { type: "object" }
      }
    },

    Task: {
      description: "An individual task or job",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        type: { type: "string" },
        status: { type: "string", enum: ["pending", "running", "completed", "failed", "cancelled"] },
        priority: { type: "number", min: 1, max: 10 },
        created: { type: "datetime" },
        started: { type: "datetime" },
        completed: { type: "datetime" },
        duration: { type: "number" },
        retries: { type: "number" },
        error: { type: "string" },
        input: { type: "object" },
        output: { type: "object" }
      }
    },

    // Resource Management Entities
    Resource: {
      description: "A computational or data resource",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        type: { type: "string", enum: ["compute", "storage", "network", "api", "database", "service"] },
        provider: { type: "string" },
        location: { type: "string" },
        capacity: { type: "object" },
        utilization: { type: "number", min: 0, max: 1 },
        cost: { type: "number" },
        status: { type: "string", enum: ["available", "busy", "maintenance", "offline"] },
        metadata: { type: "object" }
      }
    },

    Service: {
      description: "A service or API endpoint",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        type: { type: "string", enum: ["rest", "graphql", "grpc", "websocket", "message_queue"] },
        endpoint: { type: "string" },
        version: { type: "string" },
        authentication: { type: "string" },
        rate_limit: { type: "object" },
        sla: { type: "object" },
        health_status: { type: "string", enum: ["healthy", "degraded", "unhealthy", "unknown"] },
        documentation: { type: "string" }
      }
    },

    // Analytics Case Management
    Case: {
      description: "An analytics or investigation case",
      properties: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        description: { type: "string" },
        type: { type: "string" },
        status: { type: "string", enum: ["open", "in_progress", "resolved", "closed", "archived"] },
        priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        created: { type: "datetime" },
        updated: { type: "datetime" },
        resolved: { type: "datetime" },
        findings: { type: "array", items: "object" },
        recommendations: { type: "array", items: "string" },
        tags: { type: "array", items: "string" }
      }
    },

    Metric: {
      description: "A measurable metric or KPI",
      properties: {
        id: { type: "string", required: true },
        name: { type: "string", required: true },
        description: { type: "string" },
        type: { type: "string", enum: ["counter", "gauge", "histogram", "summary"] },
        unit: { type: "string" },
        value: { type: "number" },
        timestamp: { type: "datetime" },
        dimensions: { type: "object" },
        aggregation: { type: "string", enum: ["sum", "avg", "min", "max", "count"] },
        target: { type: "number" },
        threshold: { type: "object" }
      }
    },

    // Cross-cutting Entities
    User: {
      description: "A system user or actor",
      properties: {
        id: { type: "string", required: true },
        username: { type: "string", required: true },
        email: { type: "string" },
        role: { type: "string" },
        permissions: { type: "array", items: "string" },
        department: { type: "string" },
        created: { type: "datetime" },
        last_active: { type: "datetime" },
        preferences: { type: "object" }
      }
    },

    Event: {
      description: "A system or domain event",
      properties: {
        id: { type: "string", required: true },
        type: { type: "string", required: true },
        source: { type: "string" },
        timestamp: { type: "datetime", required: true },
        severity: { type: "string", enum: ["info", "warning", "error", "critical"] },
        category: { type: "string" },
        message: { type: "string" },
        data: { type: "object" },
        correlation_id: { type: "string" }
      }
    },

    Report: {
      description: "A generated report or document",
      properties: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        type: { type: "string" },
        format: { type: "string", enum: ["pdf", "html", "excel", "powerpoint", "markdown"] },
        generated: { type: "datetime" },
        period: { type: "object", properties: {
          start: { type: "datetime" },
          end: { type: "datetime" }
        }},
        sections: { type: "array", items: "object" },
        distribution: { type: "array", items: "string" },
        schedule: { type: "string" }
      }
    }
  },

  // Relationship Types
  relationTypes: {
    // Data relationships
    "derives-from": {
      description: "Dataset derives from another dataset",
      source: ["Dataset", "Analysis"],
      target: ["Dataset"],
      properties: {
        transformation: { type: "string" },
        lineage: { type: "array", items: "string" }
      }
    },

    "analyzes": {
      description: "Analysis analyzes a dataset",
      source: ["Analysis"],
      target: ["Dataset"],
      properties: {
        sample_size: { type: "number" },
        features_used: { type: "array", items: "string" }
      }
    },

    "produces": {
      description: "Process produces output",
      source: ["Analysis", "Model", "Workflow", "Task"],
      target: ["Dataset", "Report", "Metric"],
      properties: {
        timestamp: { type: "datetime" },
        quality: { type: "object" }
      }
    },

    "uses": {
      description: "Entity uses another entity",
      source: ["Analysis", "Model", "Workflow", "Service"],
      target: ["Dataset", "Model", "Resource", "Service"],
      properties: {
        purpose: { type: "string" },
        frequency: { type: "string" }
      }
    },

    // Workflow relationships
    "triggers": {
      description: "Entity triggers another entity",
      source: ["Event", "Task", "Workflow", "Metric"],
      target: ["Task", "Workflow", "Analysis"],
      properties: {
        condition: { type: "string" },
        delay: { type: "number" }
      }
    },

    "depends-on": {
      description: "Entity depends on another",
      source: ["Task", "Workflow", "Analysis", "Service"],
      target: ["Task", "Workflow", "Resource", "Service"],
      properties: {
        type: { type: "string", enum: ["hard", "soft"] },
        timeout: { type: "number" }
      }
    },

    "orchestrates": {
      description: "Workflow orchestrates tasks",
      source: ["Workflow"],
      target: ["Task", "Analysis"],
      properties: {
        order: { type: "number" },
        parallel: { type: "boolean" }
      }
    },

    // Resource relationships
    "runs-on": {
      description: "Process runs on resource",
      source: ["Task", "Analysis", "Model", "Service"],
      target: ["Resource"],
      properties: {
        allocation: { type: "object" },
        duration: { type: "number" }
      }
    },

    "stores-in": {
      description: "Data stored in resource",
      source: ["Dataset", "Model", "Report"],
      target: ["Resource"],
      properties: {
        path: { type: "string" },
        size: { type: "number" },
        replication: { type: "number" }
      }
    },

    // User relationships
    "created-by": {
      description: "Entity created by user",
      source: ["Dataset", "Analysis", "Model", "Workflow", "Case", "Report"],
      target: ["User"],
      properties: {
        timestamp: { type: "datetime" },
        version: { type: "string" }
      }
    },

    "assigned-to": {
      description: "Entity assigned to user",
      source: ["Task", "Case", "Analysis"],
      target: ["User"],
      properties: {
        assigned_date: { type: "datetime" },
        due_date: { type: "datetime" },
        priority: { type: "string" }
      }
    },

    "reviewed-by": {
      description: "Entity reviewed by user",
      source: ["Analysis", "Model", "Report", "Case"],
      target: ["User"],
      properties: {
        review_date: { type: "datetime" },
        status: { type: "string" },
        comments: { type: "string" }
      }
    },

    // Case relationships
    "relates-to": {
      description: "Case relates to entities",
      source: ["Case"],
      target: ["Dataset", "Analysis", "Event", "Report"],
      properties: {
        relevance: { type: "string", enum: ["primary", "supporting", "reference"] },
        description: { type: "string" }
      }
    },

    "references": {
      description: "Entity references another",
      source: ["Report", "Analysis", "Case"],
      target: ["Dataset", "Model", "Metric", "Event"],
      properties: {
        section: { type: "string" },
        citation: { type: "string" }
      }
    },

    // Metric relationships
    "measures": {
      description: "Metric measures entity performance",
      source: ["Metric"],
      target: ["Service", "Resource", "Workflow", "Model"],
      properties: {
        dimension: { type: "string" },
        aggregation_window: { type: "string" }
      }
    },

    "alerts-on": {
      description: "Metric alerts on threshold",
      source: ["Metric"],
      target: ["Event"],
      properties: {
        threshold: { type: "object" },
        severity: { type: "string" }
      }
    },

    // Version relationships
    "version-of": {
      description: "Entity is version of another",
      source: ["Dataset", "Model", "Workflow"],
      target: ["Dataset", "Model", "Workflow"],
      properties: {
        version: { type: "string" },
        changes: { type: "array", items: "string" },
        backwards_compatible: { type: "boolean" }
      }
    },

    // Hierarchical relationships
    "parent-of": {
      description: "Parent-child relationship",
      source: ["Workflow", "Case", "Dataset"],
      target: ["Task", "Case", "Dataset"],
      properties: {
        relationship_type: { type: "string" },
        inheritance: { type: "object" }
      }
    }
  },

  // Query Templates
  queryTemplates: {
    // Data lineage queries
    dataLineage: {
      description: "Trace data lineage through transformations",
      parameters: ["dataset_id"],
      query: `
        MATCH path = (d:Dataset {id: $dataset_id})-[:derives-from*]->(source:Dataset)
        RETURN path
      `
    },

    // Impact analysis
    impactAnalysis: {
      description: "Find all entities impacted by a change",
      parameters: ["entity_id", "entity_type"],
      query: `
        MATCH (e:$entity_type {id: $entity_id})-[:uses|depends-on|derives-from*]->(impacted)
        RETURN DISTINCT impacted
      `
    },

    // Workflow dependencies
    workflowDependencies: {
      description: "Get all dependencies for a workflow",
      parameters: ["workflow_id"],
      query: `
        MATCH (w:Workflow {id: $workflow_id})-[:depends-on|uses*]->(dep)
        RETURN dep
      `
    },

    // Resource utilization
    resourceUtilization: {
      description: "Find resource utilization by type",
      parameters: ["resource_type", "time_window"],
      query: `
        MATCH (r:Resource {type: $resource_type})<-[:runs-on]-(t:Task)
        WHERE t.started >= $time_window.start AND t.completed <= $time_window.end
        RETURN r, COUNT(t) as task_count, AVG(t.duration) as avg_duration
      `
    },

    // Case investigation
    caseInvestigation: {
      description: "Get all entities related to a case",
      parameters: ["case_id"],
      query: `
        MATCH (c:Case {id: $case_id})-[:relates-to|references*1..2]-(related)
        RETURN related, TYPE(relationship) as rel_type
      `
    },

    // Model performance
    modelPerformance: {
      description: "Track model performance over time",
      parameters: ["model_id", "metric_type"],
      query: `
        MATCH (m:Model {id: $model_id})<-[:measures]-(metric:Metric {type: $metric_type})
        RETURN metric.timestamp, metric.value
        ORDER BY metric.timestamp
      `
    },

    // User activity
    userActivity: {
      description: "Get user activity summary",
      parameters: ["user_id", "time_window"],
      query: `
        MATCH (u:User {id: $user_id})<-[:created-by|assigned-to|reviewed-by]-(entity)
        WHERE entity.created >= $time_window.start
        RETURN TYPE(entity) as entity_type, COUNT(entity) as count
      `
    },

    // Failed tasks analysis
    failedTasks: {
      description: "Analyze failed tasks and their causes",
      parameters: ["time_window", "workflow_id"],
      query: `
        MATCH (w:Workflow {id: $workflow_id})-[:orchestrates]->(t:Task {status: 'failed'})
        WHERE t.created >= $time_window.start
        RETURN t, t.error, COUNT(*) as failure_count
        ORDER BY failure_count DESC
      `
    }
  },

  // Indexes for performance
  indexes: [
    { entity: "Dataset", properties: ["id", "name", "created"] },
    { entity: "Analysis", properties: ["id", "type", "status"] },
    { entity: "Model", properties: ["id", "type", "version"] },
    { entity: "Workflow", properties: ["id", "status"] },
    { entity: "Task", properties: ["id", "status", "created"] },
    { entity: "Resource", properties: ["id", "type", "status"] },
    { entity: "Service", properties: ["id", "endpoint", "health_status"] },
    { entity: "Case", properties: ["id", "status", "priority"] },
    { entity: "Metric", properties: ["id", "type", "timestamp"] },
    { entity: "User", properties: ["id", "username", "email"] },
    { entity: "Event", properties: ["id", "type", "timestamp", "severity"] },
    { entity: "Report", properties: ["id", "type", "generated"] }
  ],

  // Constraints
  constraints: {
    unique: [
      { entity: "Dataset", property: "id" },
      { entity: "Analysis", property: "id" },
      { entity: "Model", property: "id" },
      { entity: "Workflow", property: "id" },
      { entity: "Task", property: "id" },
      { entity: "Resource", property: "id" },
      { entity: "Service", property: "endpoint" },
      { entity: "Case", property: "id" },
      { entity: "Metric", property: "id" },
      { entity: "User", property: "username" },
      { entity: "User", property: "email" },
      { entity: "Event", property: "id" },
      { entity: "Report", property: "id" }
    ],
    required: [
      { entity: "*", properties: ["id"] },
      { entity: "Event", properties: ["timestamp"] },
      { entity: "User", properties: ["username"] }
    ]
  }
};

module.exports = HyperGraphQLSchema;