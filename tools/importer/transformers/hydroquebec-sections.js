/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Hydro-Québec sections.
 * Adds section breaks (<hr>) and Section Metadata blocks from template sections.
 * Selectors from captured DOM of https://www.hydroquebec.com/residentiel/
 *
 * Template sections (from page-templates.json):
 *   section-1: Hero Banner — selector: section.hq-accueil-hero — style: null
 *   section-2: À la une — selector: section.hq-section-accueil:has(.hq-promo) — style: null
 *   section-3: Quick Links — selector: section.hq-section-accueil.hq-bg-bleu-10:has(.tuile-container) — style: light-blue
 *   section-4: L'électricité et vous — selector: section.hq-section-accueil.hq-bg-bleu-80 — style: dark-blue
 *   section-5: Statistics — selector: section.hq-section-accueil.bloc-statistique — style: null
 *   section-6: News and Publications — selector: [array] — style: light-blue
 *   section-7: Restons en contact — selector: section.hq-section-accueil:last-of-type — style: null
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Find the first element matching this section's selector
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Add <hr> section break before non-first sections
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
