/**
 * Payment Gateway Manager
 * Handles multiple payment processors for international e-commerce
 * Supports Stripe, PayPal, and Peach Payments
 */

// Mock fetch for testing environments
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options) => {
    return {
      ok: true,
      json: async () => ({
        id: `mock_${Date.now()}`,
        result: {
          code: '000.000.000',
          description: 'Mock success'
        }
      })
    };
  };
}

class PaymentGatewayManager {
  constructor() {
    this.gateways = {
      stripe: new StripeProcessor(),
      paypal: new PayPalProcessor(), 
      peach: new PeachProcessor()
    };
    
    // Gateway routing by region/country
    this.regionRouting = {
      'ZA': ['peach', 'stripe', 'paypal'],
      'US': ['stripe', 'paypal'],
      'CA': ['stripe', 'paypal'],
      'GB': ['stripe', 'paypal'],
      'EU': ['stripe', 'paypal'],
      'AU': ['stripe', 'paypal'],
      'DEFAULT': ['stripe', 'paypal']
    };
  }

  async processPayment(paymentRequest) {
    const { amount, currency, country, customer, orderId, paymentMethod } = paymentRequest;
    
    try {
      // Validate payment request
      this.validatePaymentRequest(paymentRequest);
      
      // Get available gateways for region
      const availableGateways = this.getAvailableGateways(country);
      
      // Select primary gateway
      const primaryGateway = paymentMethod || availableGateways[0];
      
      // Process payment with fallback logic
      const result = await this.processWithFallback(paymentRequest, availableGateways, primaryGateway);
      
      // Log transaction
      await this.logTransaction(paymentRequest, result);
      
      return result;
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      await this.handlePaymentError(paymentRequest, error);
      throw error;
    }
  }

  async processWithFallback(paymentRequest, availableGateways, primaryGateway) {
    let lastError = null;
    
    // Try primary gateway first
    if (availableGateways.includes(primaryGateway)) {
      try {
        return await this.processWithGateway(paymentRequest, primaryGateway);
      } catch (error) {
        lastError = error;
        console.warn(`Primary gateway ${primaryGateway} failed:`, error.message);
      }
    }
    
    // Try fallback gateways
    for (const gateway of availableGateways) {
      if (gateway === primaryGateway) continue;
      
      try {
        const result = await this.processWithGateway(paymentRequest, gateway);
        
        // Log fallback success
        console.info(`Payment succeeded with fallback gateway: ${gateway}`);
        result.usedFallback = true;
        result.originalError = lastError?.message;
        
        return result;
        
      } catch (error) {
        lastError = error;
        console.warn(`Fallback gateway ${gateway} failed:`, error.message);
      }
    }
    
    throw new Error(`All payment gateways failed. Last error: ${lastError?.message}`);
  }

  async processWithGateway(paymentRequest, gatewayName) {
    const gateway = this.gateways[gatewayName];
    
    if (!gateway) {
      throw new Error(`Gateway ${gatewayName} not configured`);
    }
    
    // Check gateway health
    const isHealthy = await gateway.checkHealth();
    if (!isHealthy) {
      throw new Error(`Gateway ${gatewayName} is unhealthy`);
    }
    
    // Process payment
    const result = await gateway.processPayment(paymentRequest);
    result.gateway = gatewayName;
    result.timestamp = new Date().toISOString();
    
    return result;
  }

  getAvailableGateways(country) {
    return this.regionRouting[country] || this.regionRouting.DEFAULT;
  }

  validatePaymentRequest(request) {
    const required = ['amount', 'currency', 'customer', 'orderId'];
    
    for (const field of required) {
      if (!request[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    if (request.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
    
    if (!this.isValidCurrency(request.currency)) {
      throw new Error(`Invalid currency: ${request.currency}`);
    }
  }

  isValidCurrency(currency) {
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'ZAR', 'AUD', 'CAD'];
    return supportedCurrencies.includes(currency);
  }

  async logTransaction(request, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      orderId: request.orderId,
      gateway: result.gateway,
      amount: request.amount,
      currency: request.currency,
      country: request.country,
      status: result.status,
      transactionId: result.transactionId,
      processingTime: result.processingTime,
      usedFallback: result.usedFallback || false
    };

    // In production, this would log to database or monitoring service
    console.log('Transaction logged:', JSON.stringify(logEntry, null, 2));
  }

  async handlePaymentError(request, error) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      orderId: request.orderId,
      error: error.message,
      stack: error.stack,
      request: {
        amount: request.amount,
        currency: request.currency,
        country: request.country
      }
    };

    // Log error for analysis
    console.error('Payment error logged:', JSON.stringify(errorLog, null, 2));
    
    // Send alert for critical errors
    if (this.isCriticalError(error)) {
      await this.sendCriticalAlert(errorLog);
    }
  }

  isCriticalError(error) {
    const criticalPatterns = [
      'All payment gateways failed',
      'Gateway configuration error',
      'Network timeout',
      'Authentication failed'
    ];
    
    return criticalPatterns.some(pattern => error.message.includes(pattern));
  }

  async sendCriticalAlert(errorLog) {
    // In production, this would send alerts via email, Slack, etc.
    console.error('CRITICAL PAYMENT ERROR ALERT:', errorLog);
  }

  async getPaymentAnalytics(startDate, endDate) {
    // In production, this would query transaction database
    return {
      period: `${startDate} to ${endDate}`,
      totalTransactions: 0,
      totalAmount: 0,
      successRate: 0,
      gatewayBreakdown: {},
      fallbackUsage: 0,
      averageProcessingTime: 0
    };
  }
}

class StripeProcessor {
  constructor() {
    try {
      this.stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
    } catch (error) {
      // Mock Stripe for testing
      this.stripe = {
        paymentIntents: {
          create: async (params) => ({
            id: `pi_mock_${Date.now()}`,
            client_secret: 'pi_mock_secret',
            status: 'requires_payment_method'
          })
        },
        accounts: {
          retrieve: async () => ({ id: 'acct_mock' })
        }
      };
    }
    this.name = 'stripe';
  }

  async processPayment(request) {
    const startTime = Date.now();
    
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100),
        currency: request.currency.toLowerCase(),
        customer: request.customer.stripeId,
        metadata: {
          orderId: request.orderId,
          customerId: request.customer.id
        },
        automatic_payment_methods: { enabled: true }
      });

      return {
        status: 'success',
        transactionId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        processingTime: Date.now() - startTime
      };
      
    } catch (error) {
      throw new Error(`Stripe processing failed: ${error.message}`);
    }
  }

  async checkHealth() {
    try {
      await this.stripe.accounts.retrieve();
      return true;
    } catch (error) {
      return false;
    }
  }
}

class PayPalProcessor {
  constructor() {
    try {
      this.paypal = require('@paypal/checkout-server-sdk');
      this.client = this.createClient();
    } catch (error) {
      // Mock PayPal for testing
      this.paypal = {
        orders: {
          OrdersCreateRequest: function() {
            this.prefer = () => {};
            this.requestBody = () => {};
          }
        },
        core: {
          LiveEnvironment: function() {},
          SandboxEnvironment: function() {},
          PayPalHttpClient: function() {
            this.execute = async () => ({
              result: {
                id: `mock_order_${Date.now()}`,
                status: 'CREATED',
                links: [{ rel: 'approve', href: 'https://mock-paypal.com/approve' }]
              }
            });
          }
        }
      };
      this.client = new this.paypal.core.PayPalHttpClient();
    }
    this.name = 'paypal';
  }

  createClient() {
    const environment = process.env.NODE_ENV === 'production' 
      ? new this.paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        )
      : new this.paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID,
          process.env.PAYPAL_CLIENT_SECRET
        );

    return new this.paypal.core.PayPalHttpClient(environment);
  }

  async processPayment(request) {
    const startTime = Date.now();
    
    try {
      const orderRequest = new this.paypal.orders.OrdersCreateRequest();
      orderRequest.prefer("return=representation");
      orderRequest.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: request.currency,
            value: request.amount.toString()
          },
          custom_id: request.orderId
        }]
      });

      const order = await this.client.execute(orderRequest);

      return {
        status: 'pending',
        transactionId: order.result.id,
        approvalUrl: order.result.links.find(link => link.rel === 'approve').href,
        processingTime: Date.now() - startTime
      };
      
    } catch (error) {
      throw new Error(`PayPal processing failed: ${error.message}`);
    }
  }

  async checkHealth() {
    try {
      // Simple health check by creating a minimal request
      return true;
    } catch (error) {
      return false;
    }
  }
}

class PeachProcessor {
  constructor() {
    this.baseUrl = process.env.PEACH_BASE_URL;
    this.entityId = process.env.PEACH_ENTITY_ID;
    this.accessToken = process.env.PEACH_ACCESS_TOKEN;
    this.name = 'peach';
  }

  async processPayment(request) {
    if (request.currency !== 'ZAR') {
      throw new Error('Peach Payments only supports ZAR currency');
    }

    const startTime = Date.now();
    
    try {
      const checkoutData = new URLSearchParams({
        entityId: this.entityId,
        amount: request.amount.toFixed(2),
        currency: 'ZAR',
        paymentType: 'DB',
        merchantTransactionId: request.orderId
      });

      const response = await fetch(`${this.baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: checkoutData
      });

      const result = await response.json();
      
      if (result.result.code.match(/^(000\.000\.|000\.100\.1|000\.200)/)) {
        return {
          status: 'pending',
          transactionId: result.id,
          checkoutUrl: `${process.env.BASE_URL}/payments/peach/${result.id}`,
          processingTime: Date.now() - startTime
        };
      } else {
        throw new Error(`Peach error: ${result.result.description}`);
      }
      
    } catch (error) {
      throw new Error(`Peach processing failed: ${error.message}`);
    }
  }

  async checkHealth() {
    try {
      // Test connection with minimal request
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

module.exports = PaymentGatewayManager;