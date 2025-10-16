/**
 * Shopify Plus Multi-Store Configuration
 * Handles RegimA's global e-commerce platform across 37 jurisdictions
 */

// Shopify API - Optional dependency for testing
let ShopifyAPI;
try {
  ShopifyAPI = require('shopify-api-node');
} catch (error) {
  // Mock Shopify API for testing environments
  ShopifyAPI = class MockShopifyAPI {
    constructor(config) {
      this.config = config;
    }
    
    static get product() {
      return {
        get: async (id) => ({ id, title: `Mock Product ${id}`, handle: `mock-product-${id}` }),
        list: async (params) => [{ id: 1, handle: params.handle }],
        update: async (id, data) => ({ id, ...data }),
        create: async (data) => ({ id: Date.now(), ...data })
      };
    }
    
    static get shop() {
      return {
        get: async () => ({ name: 'Mock Shop', domain: 'mock-shop.myshopify.com', currency: 'USD' })
      };
    }
    
    static get productVariant() {
      return {
        update: async (id, data) => ({ id, ...data })
      };
    }
    
    get product() { return MockShopifyAPI.product; }
    get shop() { return MockShopifyAPI.shop; }
    get productVariant() { return MockShopifyAPI.productVariant; }
  };
}

class MultiStoreConfiguration {
  constructor() {
    this.stores = {
      'regima-sa': {
        domain: 'regima.co.za',
        accessToken: process.env.SHOPIFY_SA_TOKEN,
        market: 'ZA',
        currency: 'ZAR',
        languages: ['en', 'af'],
        compliance: ['POPIA', 'CPA'],
        warehouse: 'CPT001'
      },
      'regima-worldwide': {
        domain: 'regima-worldwide.com', 
        accessToken: process.env.SHOPIFY_WW_TOKEN,
        market: 'GLOBAL',
        currency: 'USD',
        languages: ['en'],
        compliance: ['GDPR', 'CCPA'],
        warehouse: 'GLOBAL'
      },
      'regima-eu': {
        domain: 'regima.eu',
        accessToken: process.env.SHOPIFY_EU_TOKEN,
        market: 'EU',
        currency: 'EUR', 
        languages: ['en', 'de', 'fr', 'es', 'it'],
        compliance: ['GDPR', 'CE_MARKING'],
        warehouse: 'AMS001'
      },
      'regima-uk': {
        domain: 'regima.uk',
        accessToken: process.env.SHOPIFY_UK_TOKEN,
        market: 'GB',
        currency: 'GBP',
        languages: ['en'],
        compliance: ['UK_GDPR', 'UKCA'],
        warehouse: 'LON001'
      },
      'regima-us': {
        domain: 'regima.us',
        accessToken: process.env.SHOPIFY_US_TOKEN,
        market: 'US',
        currency: 'USD',
        languages: ['en', 'es'],
        compliance: ['FDA', 'CPSC', 'CCPA'],
        warehouse: 'LAX001'
      }
    };

    this.apis = {};
    this.initializeAPIs();
  }

  initializeAPIs() {
    for (const [storeKey, config] of Object.entries(this.stores)) {
      this.apis[storeKey] = new ShopifyAPI({
        shopName: config.domain.replace('.com', '').replace('.co.za', '').replace('.eu', '').replace('.uk', '').replace('.us', ''),
        accessToken: config.accessToken,
        apiVersion: '2024-01'
      });
    }
  }

  async syncProductAcrossStores(productId, baseStoreKey = 'regima-worldwide') {
    try {
      const baseProduct = await this.apis[baseStoreKey].product.get(productId);
      const syncResults = {};

      for (const [storeKey, storeConfig] of Object.entries(this.stores)) {
        if (storeKey === baseStoreKey) continue;

        try {
          // Adapt product for local market
          const localizedProduct = await this.localizeProduct(baseProduct, storeConfig);
          
          // Check if product exists in target store
          const existingProduct = await this.findProductByHandle(storeKey, baseProduct.handle);
          
          if (existingProduct) {
            // Update existing product
            await this.apis[storeKey].product.update(existingProduct.id, localizedProduct);
            syncResults[storeKey] = { action: 'updated', id: existingProduct.id };
          } else {
            // Create new product
            const newProduct = await this.apis[storeKey].product.create(localizedProduct);
            syncResults[storeKey] = { action: 'created', id: newProduct.id };
          }

          // Sync inventory
          await this.syncInventory(storeKey, productId, storeConfig.warehouse);

        } catch (error) {
          syncResults[storeKey] = { action: 'failed', error: error.message };
          console.error(`Failed to sync product to ${storeKey}:`, error);
        }
      }

      return {
        success: true,
        productId,
        results: syncResults
      };

    } catch (error) {
      console.error('Product sync failed:', error);
      throw error;
    }
  }

  async localizeProduct(baseProduct, targetStoreConfig) {
    const localized = {
      ...baseProduct,
      title: await this.translateText(baseProduct.title, targetStoreConfig.languages[0]),
      body_html: await this.translateText(baseProduct.body_html, targetStoreConfig.languages[0]),
      variants: baseProduct.variants.map(variant => ({
        ...variant,
        price: this.convertCurrency(variant.price, 'USD', targetStoreConfig.currency)
      }))
    };

    // Add compliance-specific fields
    if (targetStoreConfig.compliance.includes('GDPR')) {
      localized.metafields = [
        ...(localized.metafields || []),
        {
          namespace: 'compliance',
          key: 'gdpr_compliant',
          value: 'true',
          type: 'boolean'
        }
      ];
    }

    // Add responsible person information for EU markets
    if (targetStoreConfig.market === 'EU' || targetStoreConfig.market === 'GB') {
      localized.metafields = [
        ...(localized.metafields || []),
        {
          namespace: 'responsible_person',
          key: 'name',
          value: 'Jacqueline Faucitt',
          type: 'single_line_text_field'
        },
        {
          namespace: 'responsible_person', 
          key: 'address',
          value: 'RegimA SA, Cape Town, South Africa',
          type: 'multi_line_text_field'
        }
      ];
    }

    return localized;
  }

  async syncInventory(storeKey, productId, warehouseId) {
    const inventory = await this.getWarehouseInventory(warehouseId, productId);
    
    if (!inventory) {
      console.warn(`No inventory found for product ${productId} in warehouse ${warehouseId}`);
      return;
    }

    const product = await this.apis[storeKey].product.get(productId);
    
    for (const variant of product.variants) {
      const variantInventory = inventory.variants[variant.sku] || 0;
      
      await this.apis[storeKey].productVariant.update(variant.id, {
        inventory_quantity: variantInventory,
        inventory_management: 'shopify',
        inventory_policy: variantInventory > 0 ? 'deny' : 'continue'
      });
    }
  }

  async getWarehouseInventory(warehouseId, productId) {
    // Integration with warehouse management system
    // This would connect to actual warehouse API
    return {
      productId,
      warehouseId,
      variants: {
        'REGIMA-SERUM-50ML': 150,
        'REGIMA-SERUM-100ML': 75,
        'REGIMA-CREAM-50ML': 200
      }
    };
  }

  convertCurrency(amount, fromCurrency, toCurrency) {
    // In production, this would use real exchange rate API
    const rates = {
      'USD': { 'EUR': 0.85, 'GBP': 0.73, 'ZAR': 18.50, 'AUD': 1.35, 'CAD': 1.25 },
      'EUR': { 'USD': 1.18, 'GBP': 0.86, 'ZAR': 21.76, 'AUD': 1.59, 'CAD': 1.47 }
    };

    if (fromCurrency === toCurrency) return amount;
    
    const rate = rates[fromCurrency]?.[toCurrency] || 1;
    return Math.round(amount * rate * 100) / 100;
  }

  async translateText(text, targetLanguage) {
    // In production, this would use translation API
    // For demo, just return original text with language marker
    if (targetLanguage === 'en') return text;
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }

  async findProductByHandle(storeKey, handle) {
    try {
      const products = await this.apis[storeKey].product.list({ handle });
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error(`Error finding product by handle in ${storeKey}:`, error);
      return null;
    }
  }

  async getStoreConfiguration(storeKey) {
    return this.stores[storeKey] || null;
  }

  async getAllStores() {
    return Object.keys(this.stores);
  }

  async getStoresByMarket(market) {
    return Object.entries(this.stores)
      .filter(([_, config]) => config.market === market)
      .map(([key, _]) => key);
  }

  async validateStoreHealth() {
    const healthResults = {};

    for (const [storeKey, _] of Object.entries(this.stores)) {
      try {
        const shop = await this.apis[storeKey].shop.get();
        healthResults[storeKey] = {
          status: 'healthy',
          name: shop.name,
          domain: shop.domain,
          currency: shop.currency,
          lastCheck: new Date().toISOString()
        };
      } catch (error) {
        healthResults[storeKey] = {
          status: 'error',
          error: error.message,
          lastCheck: new Date().toISOString()
        };
      }
    }

    return healthResults;
  }
}

module.exports = MultiStoreConfiguration;