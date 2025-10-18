# Integrated Courier Logistics System

## Comprehensive Shipping & Delivery Management

The courier logistics system provided seamless integration between the warehouse, multiple shipping carriers, and customers, ensuring transparent tracking, cost optimization, and exceptional delivery experiences.

## Multi-Carrier Integration Platform

### 1. Carrier Network Architecture

#### Integrated Shipping Providers
```yaml
carrier_integrations:
  primary_carriers:
    dhl:
      api_version: "v2.1"
      services: ["Express", "Economy", "Same Day"]
      coverage: "National + International"
      integration_type: "Real-time API"
      features:
        - live_rates
        - label_printing
        - tracking_webhook
        - pod_retrieval
        - address_validation
    
    fedex:
      api_version: "v3.0"
      services: ["Priority", "Standard", "International"]
      coverage: "Global"
      integration_type: "Real-time API"
      features:
        - rate_shopping
        - customs_documentation
        - dangerous_goods
        - delivery_options
        - carbon_neutral
    
    aramex:
      api_version: "v1.8"
      services: ["Domestic", "Regional Africa"]
      coverage: "South Africa + Africa"
      integration_type: "Real-time API"
      features:
        - cash_on_delivery
        - mobile_notifications
        - flexible_delivery
        - returns_management
    
    local_couriers:
      providers: ["Courier Guy", "Pargo", "POSTNET"]
      coverage: "Metro areas"
      integration: "API + Portal hybrid"
      specialization: "Last mile delivery"

  backup_carriers:
    - sapo: "Registered mail fallback"
    - uber_direct: "Same day urgent"
    - custom_fleet: "High value items"
```

### 2. Intelligent Routing System

#### Carrier Selection Algorithm
```javascript
// Intelligent Carrier Selection
const carrierSelectionEngine = {
  selectOptimalCarrier: async (order) => {
    const factors = {
      destination: order.shippingAddress,
      weight: calculatePackageWeight(order.items),
      dimensions: calculatePackageDimensions(order.items),
      value: order.totalValue,
      serviceLevel: order.shippingMethod,
      customerPreference: getCustomerPreferences(order.customerId)
    };
    
    // Get rates from all carriers
    const carrierOptions = await Promise.all([
      getDHLRate(factors),
      getFedExRate(factors),
      getAramexRate(factors),
      getLocalCourierRates(factors)
    ]);
    
    // Score each option
    const scoredOptions = carrierOptions.map(option => ({
      ...option,
      score: calculateScore({
        cost: option.rate,
        deliveryTime: option.transitDays,
        reliability: option.carrierReliability,
        features: option.availableFeatures,
        customerRating: option.customerSatisfaction
      })
    }));
    
    // Select best option
    return scoredOptions.sort((a, b) => b.score - a.score)[0];
  },
  
  businessRules: {
    highValueThreshold: 5000, // Require signature
    internationalRequirements: 'Full customs docs',
    expressUpgrade: 'Auto-upgrade if delay detected',
    costOptimization: 'Balance speed and cost'
  }
};
```

#### Zone-Based Shipping Logic
```sql
-- Shipping Zones Configuration
CREATE TABLE shipping_zones (
    zone_id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100),
    zone_type VARCHAR(50), -- 'local', 'regional', 'national', 'international'
    
    -- Geographic Definition
    provinces TEXT[], -- For South Africa
    cities TEXT[],
    postal_codes TEXT[],
    
    -- Service Levels
    standard_days INTEGER,
    express_days INTEGER,
    economy_days INTEGER,
    
    -- Carrier Preferences
    preferred_carrier VARCHAR(50),
    backup_carriers TEXT[],
    
    -- Pricing
    base_rate DECIMAL(10,2),
    per_kg_rate DECIMAL(10,2),
    
    INDEX idx_postal (postal_codes)
);

-- Rate Calculation
CREATE FUNCTION calculate_shipping_rate(
    p_destination VARCHAR,
    p_weight DECIMAL,
    p_service_level VARCHAR
) RETURNS DECIMAL AS $$
DECLARE
    v_zone_id INTEGER;
    v_base_rate DECIMAL;
    v_weight_rate DECIMAL;
    v_service_multiplier DECIMAL;
BEGIN
    -- Determine zone
    SELECT zone_id, base_rate, per_kg_rate
    INTO v_zone_id, v_base_rate, v_weight_rate
    FROM shipping_zones
    WHERE p_destination = ANY(postal_codes);
    
    -- Service level multiplier
    v_service_multiplier := CASE p_service_level
        WHEN 'express' THEN 1.5
        WHEN 'standard' THEN 1.0
        WHEN 'economy' THEN 0.8
    END;
    
    -- Calculate rate
    RETURN (v_base_rate + (v_weight_rate * p_weight)) * v_service_multiplier;
END;
$$ LANGUAGE plpgsql;
```

### 3. Real-Time Tracking Integration

#### Unified Tracking System
```javascript
// Tracking Integration Platform
const trackingSystem = {
  // Webhook endpoints for carrier updates
  webhookEndpoints: {
    dhl: '/webhooks/dhl/tracking',
    fedex: '/webhooks/fedex/tracking',
    aramex: '/webhooks/aramex/tracking',
    generic: '/webhooks/tracking/:carrier'
  },
  
  // Process tracking update
  processTrackingUpdate: async (carrier, trackingData) => {
    const normalizedEvent = normalizeTrackingEvent(carrier, trackingData);
    
    // Update database
    await updateTrackingStatus(normalizedEvent);
    
    // Notify stakeholders
    await notifyStakeholders(normalizedEvent);
    
    // Handle special events
    if (normalizedEvent.type === 'DELIVERY_EXCEPTION') {
      await handleDeliveryException(normalizedEvent);
    }
    
    return normalizedEvent;
  },
  
  // Tracking event normalization
  normalizeTrackingEvent: (carrier, rawEvent) => {
    const eventMappings = {
      dhl: {
        'PU': 'PICKED_UP',
        'AR': 'ARRIVED_AT_FACILITY',
        'DP': 'DEPARTED_FACILITY',
        'OH': 'ON_HOLD',
        'OK': 'DELIVERED'
      },
      fedex: {
        'OC': 'ORDER_CREATED',
        'PU': 'PICKED_UP',
        'IT': 'IN_TRANSIT',
        'DL': 'DELIVERED',
        'DE': 'EXCEPTION'
      }
      // ... more mappings
    };
    
    return {
      trackingNumber: rawEvent.trackingNumber,
      carrier: carrier,
      timestamp: new Date(rawEvent.timestamp),
      status: eventMappings[carrier][rawEvent.statusCode],
      location: rawEvent.location,
      description: rawEvent.description,
      estimatedDelivery: rawEvent.estimatedDelivery,
      proof: rawEvent.proofOfDelivery
    };
  }
};
```

#### Customer Tracking Portal
```yaml
tracking_portal:
  url: "https://track.regima.zone"
  
  features:
    real_time_updates:
      - current_status
      - location_history
      - estimated_delivery
      - delivery_instructions
    
    notifications:
      channels:
        - email: "Default on"
        - sms: "Opt-in"
        - whatsapp: "Opt-in"
      
      events:
        - order_shipped
        - out_for_delivery
        - delivery_attempted
        - delivered
        - exception_occurred
    
    self_service:
      - delivery_preferences
      - address_updates
      - delivery_scheduling
      - signature_waiver
      - neighbor_delivery
    
    visual_tracking:
      - interactive_map
      - delivery_route
      - driver_location
      - stop_sequence
```

### 4. Shipping Label Generation

#### Automated Label System
```javascript
// Label Generation Service
const labelGenerator = {
  createShippingLabel: async (order, carrier, service) => {
    // Prepare shipment data
    const shipmentData = {
      shipper: {
        name: 'RegimA Fulfillment',
        company: 'RegimA (Pty) Ltd',
        address: getWarehouseAddress(order.warehouse),
        phone: '+27 21 XXX XXXX',
        email: 'shipping@regima.zone'
      },
      
      recipient: {
        name: order.customerName,
        company: order.companyName || '',
        address: order.shippingAddress,
        phone: order.customerPhone,
        email: order.customerEmail
      },
      
      package: {
        weight: order.totalWeight,
        dimensions: order.packageDimensions,
        value: order.declaredValue,
        description: 'E-commerce goods',
        reference: order.orderNumber
      },
      
      service: {
        type: service,
        signature: order.value > 1000,
        insurance: order.value > 5000,
        saturdayDelivery: order.shippingPreferences.saturday
      }
    };
    
    // Generate label based on carrier
    let label;
    switch(carrier) {
      case 'dhl':
        label = await dhlAPI.createLabel(shipmentData);
        break;
      case 'fedex':
        label = await fedexAPI.shipment(shipmentData);
        break;
      case 'aramex':
        label = await aramexAPI.createShipment(shipmentData);
        break;
    }
    
    // Store label information
    await storeLabel({
      orderId: order.id,
      trackingNumber: label.trackingNumber,
      labelUrl: label.labelUrl,
      carrier: carrier,
      service: service,
      cost: label.cost,
      createdAt: new Date()
    });
    
    return label;
  },
  
  bulkLabelGeneration: async (orders) => {
    const labels = await Promise.all(
      orders.map(order => 
        createShippingLabel(order, order.selectedCarrier, order.selectedService)
      )
    );
    
    // Generate consolidated manifest
    const manifest = await generateManifest(labels);
    
    return { labels, manifest };
  }
};
```

### 5. Customs & International Shipping

#### International Documentation
```sql
-- Customs Documentation System
CREATE TABLE customs_declarations (
    declaration_id SERIAL PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    
    -- Shipment Details
    origin_country VARCHAR(2) DEFAULT 'ZA',
    destination_country VARCHAR(2) NOT NULL,
    
    -- Commercial Invoice
    invoice_number VARCHAR(50),
    invoice_date DATE,
    terms_of_sale VARCHAR(3), -- 'DDP', 'DAP', etc.
    
    -- Customs Values
    total_value DECIMAL(10,2),
    currency VARCHAR(3),
    
    -- Documentation
    commercial_invoice_url TEXT,
    packing_list_url TEXT,
    certificate_origin_url TEXT,
    other_documents JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP,
    cleared_at TIMESTAMP,
    
    INDEX idx_order (order_id),
    INDEX idx_tracking (tracking_number)
);

-- Customs Items Detail
CREATE TABLE customs_items (
    id SERIAL PRIMARY KEY,
    declaration_id INTEGER REFERENCES customs_declarations(declaration_id),
    
    -- Item Information
    description VARCHAR(500),
    hs_code VARCHAR(10),
    country_of_origin VARCHAR(2),
    
    -- Values
    quantity INTEGER,
    unit_price DECIMAL(10,2),
    total_value DECIMAL(10,2),
    
    -- Additional Info
    material_composition TEXT,
    end_use VARCHAR(200)
);
```

#### Automated Customs Processing
```yaml
customs_automation:
  document_generation:
    commercial_invoice:
      template: "Standard RegimA format"
      data_source: "Order + Product master"
      language: "English"
      copies: 3
    
    packing_list:
      format: "Detailed with dimensions"
      weight_units: "Kilograms"
      dimension_units: "Centimeters"
    
    certificates:
      origin: "Chamber of Commerce certified"
      conformity: "As required by destination"
      phytosanitary: "For applicable products"
  
  hs_code_management:
    database: "Maintained with products"
    validation: "Annual review"
    updates: "Regulatory changes tracked"
  
  duty_calculation:
    integrated_service: "DHL Trade Automation"
    pre_calculation: "At checkout"
    customer_options:
      - prepaid_duties: "DDP pricing"
      - customer_pays: "DAP pricing"
```

### 6. Delivery Management

#### Last Mile Optimization
```javascript
// Delivery Optimization Engine
const deliveryOptimization = {
  routePlanning: {
    algorithm: 'Vehicle Routing Problem solver',
    constraints: [
      'Delivery time windows',
      'Vehicle capacity',
      'Driver working hours',
      'Traffic patterns',
      'Customer preferences'
    ],
    
    optimization_goals: {
      primary: 'Minimize total distance',
      secondary: 'Maximize on-time delivery',
      tertiary: 'Balance driver workload'
    }
  },
  
  deliveryOptions: {
    standard: {
      window: 'Business hours',
      attempts: 2,
      alternateDelivery: 'Neighbor/Collection point'
    },
    
    scheduled: {
      slots: ['Morning', 'Afternoon', 'Evening'],
      confirmation: 'SMS day before',
      rescheduling: 'Online up to 2 hours before'
    },
    
    premium: {
      timeSlot: '1-hour window',
      realTimeTracking: true,
      directContact: 'Driver phone number',
      whiteGlove: 'Inside delivery + setup'
    }
  },
  
  collectionPoints: {
    partners: ['Pick n Pay', 'Checkers', 'PostNet'],
    locations: 500,
    holdingPeriod: '7 days',
    notification: 'Immediate on arrival',
    identification: 'ID + Collection code'
  }
};
```

### 7. Performance Analytics

#### Logistics KPIs Dashboard
```yaml
logistics_metrics:
  delivery_performance:
    on_time_delivery:
      target: "> 95%"
      current: "96.3%"
      by_carrier:
        dhl: "97.1%"
        fedex: "96.8%"
        aramex: "95.2%"
        local: "94.9%"
    
    first_attempt_success:
      target: "> 90%"
      current: "91.5%"
      failure_reasons:
        - "Address issue: 35%"
        - "Not home: 40%"
        - "Refused: 10%"
        - "Other: 15%"
    
    delivery_speed:
      same_day: "15% of orders"
      next_day: "45% of orders"
      two_day: "30% of orders"
      three_plus: "10% of orders"
  
  cost_metrics:
    average_shipping_cost:
      per_order: "R 45.00"
      as_percentage_of_order: "4.5%"
      trend: "Decreasing"
    
    carrier_performance:
      cost_efficiency:
        best: "Local couriers (-15% avg)"
        worst: "Express international (+45% avg)"
      
      negotiated_discounts:
        dhl: "35% off retail"
        fedex: "40% off retail"
        volume_bonuses: "Quarterly rebates"
  
  customer_satisfaction:
    delivery_nps: 72
    tracking_satisfaction: "4.6/5"
    delivery_complaints: "0.8%"
    damaged_in_transit: "0.3%"
```

### 8. Exception Management

#### Delivery Exception Handling
```javascript
// Exception Management System
const exceptionHandler = {
  exceptionTypes: {
    ADDRESS_ISSUE: {
      actions: ['Contact customer', 'Verify address', 'Update if needed'],
      sla: '2 hours',
      escalation: 'Customer service manager'
    },
    
    DAMAGED_IN_TRANSIT: {
      actions: ['Photo evidence', 'Carrier claim', 'Customer notification'],
      sla: 'Same day',
      escalation: 'Operations manager'
    },
    
    DELIVERY_REFUSED: {
      actions: ['Understand reason', 'Return authorization', 'Process refund'],
      sla: '24 hours',
      escalation: 'Customer service'
    },
    
    LOST_IN_TRANSIT: {
      actions: ['Carrier investigation', 'Insurance claim', 'Replacement order'],
      sla: '48 hours',
      escalation: 'Senior management'
    }
  },
  
  automatedResponses: {
    customerNotification: true,
    replacementOrder: 'Auto-create if value < R500',
    refundProcessing: 'Pre-authorize for quick resolution',
    carrierClaim: 'Auto-file with documentation'
  }
};
```

### 9. Integration Benefits Summary

#### Achieved Outcomes

1. **Cost Optimization**
   - 25% reduction in shipping costs through intelligent routing
   - Volume discounts negotiated across carriers
   - Reduced failed delivery costs

2. **Customer Experience**
   - Real-time tracking for 100% of orders
   - Flexible delivery options
   - 96%+ on-time delivery rate

3. **Operational Efficiency**
   - Automated label generation
   - Bulk processing capabilities
   - Exception handling workflows

4. **Scalability**
   - Handle 10,000+ shipments daily
   - Peak season ready
   - Easy carrier additions

5. **Visibility & Control**
   - Complete shipment lifecycle tracking
   - Performance analytics
   - Cost transparency

This integrated logistics system was essential for competitive e-commerce operations and must be restored to maintain service quality and customer satisfaction.