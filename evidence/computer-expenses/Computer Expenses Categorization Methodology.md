# Computer Expenses Categorization Methodology

## Overview

This document outlines the methodology used to categorize the historical computer expense transactions. The categorization process follows a systematic approach aligned with the Computer Expenses Analysis Framework developed previously, ensuring consistency, accuracy, and compliance with SARS audit requirements.

## Data Processing Pipeline

### 1. Data Collection and Extraction

Four CSV files containing historical transaction data were processed:
- AccountTransactionsReport.csv
- AccountTransactionsReport(1).csv
- AccountTransactionsReport(2).csv
- AccountTransactionsReport(3).csv

These files were combined into a single dataset, preserving source information and maintaining data integrity.

### 2. Data Cleaning and Standardization

The combined dataset underwent several cleaning and standardization steps:
- Removal of non-transaction rows (e.g., opening balances, headers)
- Standardization of date formats to YYYY-MM-DD
- Conversion of numeric fields to consistent formats
- Cleaning of description and reference fields to remove excessive whitespace
- Addition of unique transaction IDs and year-month fields
- Identification and marking of potential duplicate transactions

### 3. Categorization Process

The categorization was performed in multiple stages:

#### Stage 1: Initial Categorization

Transactions were initially categorized based on keywords in the Description, Reference, and Bank/Customer/Supplier fields. The primary categories and their associated keywords were:

- **E-commerce Platforms**: shopify, wix, bigcommerce, magento, stock2shop
- **Productivity Software**: intuit, quickbooks, qboo, microsoft, office365, adobe, zoho, freshworks
- **Cloud Services**: digitalocean, aws, amazon web, linode, vultr, heroku, vercel, netlify, cloudflare
- **Development Tools**: github, gitlab, bitbucket, atlassian, jira, confluence, gitpod, jetbrains, visual studio
- **Security Services**: auth0, okta, lastpass, 1password, bitwarden, cloudflare, ssl, certificate
- **Marketing Tools**: facebook, meta, instagram, google ads, mailchimp, sendgrid, hubspot, hootsuite, buffer
- **Communication**: slack, zoom, teams, discord, twilio, mailgun, sendgrid, postmark
- **AI Services**: openai, gpt, chatgpt, anthropic, claude, huggingface, cohere, stability, midjourney, lemsqzy
- **Domain & Hosting**: godaddy, namecheap, domain, dns, hosting, cpanel, plesk
- **Analytics**: google analytics, mixpanel, amplitude, hotjar, fullstory, segment, looker, tableau
- **Payment Processing**: stripe, paypal, square, braintree, adyen, worldpay, checkout

#### Stage 2: Refinement with Additional Categories

Analysis of the "Other Computer Services" category (the largest initial category) revealed additional patterns, leading to the creation of these additional categories:

- **Analytics & Monitoring**: google, analytics, mixpanel, amplitude, hotjar, fullstory, segment, looker, tableau, metabase, looker, datadog, newrelic, sentry
- **Content Management**: wordpress, contentful, strapi, sanity, prismic, webflow, squarespace
- **Design Tools**: figma, sketch, adobe, canva, invision, zeplin, framer
- **Database Services**: mongodb, postgres, mysql, redis, elasticsearch, supabase, fauna, cockroach
- **API Services**: postman, rapidapi, zapier, make, integromat, tray, workato, mulesoft
- **Mobile Development**: firebase, appcenter, expo, testflight, appstore, playstore
- **Collaboration Tools**: notion, airtable, asana, trello, monday, clickup, basecamp, miro, figma
- **Customer Support**: zendesk, intercom, freshdesk, helpscout, crisp, tawk, livechat, drift
- **Email Services**: mailchimp, sendgrid, mailgun, postmark, sparkpost, sendinblue, campaign
- **Subscription Management**: recurly, chargebee, chargify, paddle, fastspring, revenuecat, subscription

#### Stage 3: Validation and Correction

The categorization was validated by:
1. Checking for specific vendors that might be miscategorized
2. Ensuring consistent categorization of similar transactions
3. Applying override rules for specific cases
4. Final review of category distribution

### 4. Business Purpose and SARS Justification

Each category was assigned a clear business purpose and justification for SARS audit purposes:

- **E-commerce Platforms**: Essential for online sales operations, directly contributing to revenue generation
- **Productivity Software**: Necessary for business operations, accounting, and document management
- **Development Tools**: Required for software development and maintenance of digital products
- **AI Services**: Used for content generation, customer service, and product enhancement
- **Analytics & Monitoring**: Essential for tracking business performance and customer behavior
- **Cloud Services**: Required for hosting websites and applications that generate revenue
- **Collaboration Tools**: Necessary for team coordination and project management
- **Communication**: Essential for internal and external business communications
- **Marketing Tools**: Directly related to customer acquisition and revenue generation
- **Security Services**: Required to protect business assets and customer data

## Categorization Rules Logic

The categorization logic follows this decision tree:

1. Check if transaction text contains keywords from primary categories
2. If no match, check for keywords from additional categories
3. If still no match, assign to "Other Computer Services"
4. Apply override rules for specific vendors to ensure consistency

## Quality Assurance

Several quality assurance steps were implemented:

1. **Duplicate Detection**: Identified and marked potential duplicate transactions
2. **Outlier Analysis**: Identified transactions significantly larger than average
3. **Category Validation**: Checked for consistency in vendor categorization
4. **Manual Review**: Sample transactions from each category were manually reviewed

## Limitations and Considerations

- The categorization relies on text matching and may not capture all nuances
- Some transactions may serve multiple business purposes
- Vendor names may change over time, requiring periodic updates to categorization rules
- Some transactions in "Other Computer Services" may benefit from further manual review

## Future Improvements

For future transaction categorization, consider:

1. Machine learning approaches for more nuanced categorization
2. Integration with vendor master data for improved accuracy
3. Regular updates to keyword lists as new vendors emerge
4. User feedback loop to refine categorization rules
5. Integration with accounting system for real-time categorization

## Conclusion

This methodology provides a systematic, transparent approach to categorizing computer expenses, supporting both business analysis and SARS audit preparation. The categorization rules are documented and can be updated as business needs evolve.
