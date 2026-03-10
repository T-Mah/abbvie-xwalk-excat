/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroPromoParser from './parsers/hero-promo.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsInfoParser from './parsers/columns-info.js';

// TRANSFORMER IMPORTS - Import all Hydro-Québec transformers
import hydroquebecCleanupTransformer from './transformers/hydroquebec-cleanup.js';
import hydroquebecSectionsTransformer from './transformers/hydroquebec-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-feature': cardsFeatureParser,
  'columns-info': columnsInfoParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'residential-landing',
  description: 'Residential services landing page with service categories, quick links, and promotional content for Hydro-Québec residential customers',
  urls: [
    'https://www.hydroquebec.com/residentiel/',
  ],
  blocks: [
    {
      name: 'hero-promo',
      instances: [
        'section.hq-accueil-hero',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '.hq-promo-bloc',
        'ul.hq-grid.tuile-container',
        '.hq-tuile-contenant',
        '.hq-grid.hq-tuile-contenant',
      ],
    },
    {
      name: 'columns-info',
      instances: [
        '.bloc-statistique .liste-blocs',
        '.hq-container.hq-grid.hq-grid-cols-4',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.hq-accueil-hero',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'À la une',
      selector: 'section.hq-section-accueil:has(.hq-promo)',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['h2.hq-titre3'],
    },
    {
      id: 'section-3',
      name: 'Quick Links',
      selector: 'section.hq-section-accueil.hq-bg-bleu-10:has(.tuile-container)',
      style: 'light-blue',
      blocks: ['cards-feature'],
      defaultContent: ['h2.hq-titre3', 'a.hq-bouton-texte'],
    },
    {
      id: 'section-4',
      name: "L'électricité et vous",
      selector: 'section.hq-section-accueil.hq-bg-bleu-80',
      style: 'dark-blue',
      blocks: ['cards-feature'],
      defaultContent: ['h2.hq-titre3'],
    },
    {
      id: 'section-5',
      name: 'Statistics',
      selector: 'section.hq-section-accueil.bloc-statistique',
      style: null,
      blocks: ['columns-info'],
      defaultContent: ['h2.hq-titre3'],
    },
    {
      id: 'section-6',
      name: 'News and Publications',
      selector: [
        'section.hq-section-accueil.hq-bg-bleu-10:has(.hq-bloc-maillage)',
        'section.hq-section-accueil.hq-bg-bleu-10:last-of-type',
      ],
      style: 'light-blue',
      blocks: ['columns-info'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Restons en contact',
      selector: 'section.hq-section-accueil:last-of-type',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['h2.hq-titre3'],
    },
  ],
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, then sections (which needs template data for section breaks)
const transformers = [
  hydroquebecCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [hydroquebecSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function for residential-landing template
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (cookie banners, overlays)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (header/footer removal + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
