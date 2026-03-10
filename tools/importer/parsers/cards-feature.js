/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature.
 * Base block: cards (container)
 * Source: https://www.hydroquebec.com/residentiel/
 * Generated: 2026-03-06
 *
 * Source DOM structure variations (from captured HTML):
 *
 *   Section 2 - À la une (.hq-promo-bloc):
 *     ul.hq-promo-bloc > li.hq-promo-tuile
 *       .title-bloc > p.pastille (tag) + p.subtitle.hq-titre5 (title)
 *       a.hq-bouton-texte > span.js-bouton-text (CTA text)
 *     No images in this variant
 *
 *   Section 3 - Quick Links (ul.tuile-container):
 *     ul.hq-grid.tuile-container > li.tuile
 *       .tuile-image > img (icon image)
 *       a.hq-titre4 (link with title text)
 *
 *   Section 4 - L'électricité et vous (.hq-tuile-contenant):
 *     .hq-tuile-contenant > div.hq-tuile
 *       .contenu > .contenu-text > h3.hq-titre5 + p (description)
 *       .contenu > a.hq-bouton-nav-secondaire (CTA)
 *     No images in this variant
 *
 *   Section 7 - Restons en contact (.hq-tuile-contenant):
 *     .hq-tuile-contenant > div.hq-tuile
 *       img (card image)
 *       .contenu > .contenu-text > h3.hq-titre5 + p
 *       .contenu > a.hq-bouton-secondaire (CTA)
 *
 * Block library structure (cards - container):
 *   Each row = 1 card with 2 columns: [image, text]
 *   Cell 1: image (optional)
 *   Cell 2: title + description + CTA links
 *
 * UE Model (card item): image (reference), text (richtext)
 * xwalk: field hints required for image and text cells
 * Collapsed fields (imageAlt) — no hint per Rule 3
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which section variant we're in and extract card items
  let cardItems = [];

  // Section 2: .hq-promo-bloc > li.hq-promo-tuile
  const promoItems = element.querySelectorAll('li.hq-promo-tuile');
  if (promoItems.length > 0) {
    promoItems.forEach((item) => {
      const tag = item.querySelector('p.pastille');
      const title = item.querySelector('p.subtitle, p.hq-titre5');
      const ctaEl = item.querySelector('a.hq-bouton-texte');
      const ctaText = ctaEl ? (ctaEl.querySelector('.js-bouton-text') || ctaEl) : null;

      // Image cell (empty for promo cards)
      const imageCell = [];

      // Text cell
      const textCell = [];
      const textHint = document.createComment(' field:text ');
      textCell.push(textHint);
      if (tag) {
        const p = document.createElement('p');
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      if (ctaEl) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaEl.getAttribute('href') || '';
        a.textContent = ctaText ? ctaText.textContent.trim() : ctaEl.textContent.trim();
        p.appendChild(a);
        textCell.push(p);
      }

      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
    element.replaceWith(block);
    return;
  }

  // Section 3: ul.tuile-container > li.tuile
  const tuileItems = element.querySelectorAll('li.tuile');
  if (tuileItems.length > 0) {
    tuileItems.forEach((item) => {
      const img = item.querySelector('.tuile-image img, img');
      const linkEl = item.querySelector('a.hq-titre4, a');

      // Image cell
      const imageCell = [];
      if (img) {
        const imageHint = document.createComment(' field:image ');
        imageCell.push(imageHint);
        const newImg = document.createElement('img');
        newImg.src = img.getAttribute('src') || '';
        newImg.alt = img.getAttribute('alt') || '';
        imageCell.push(newImg);
      }

      // Text cell
      const textCell = [];
      const textHint = document.createComment(' field:text ');
      textCell.push(textHint);
      if (linkEl) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = linkEl.getAttribute('href') || '';
        a.textContent = linkEl.textContent.trim();
        p.appendChild(a);
        textCell.push(p);
      }

      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
    element.replaceWith(block);
    return;
  }

  // Section 4 & 7: .hq-tuile items (with or without images)
  const hqTuiles = element.querySelectorAll('.hq-tuile');
  if (hqTuiles.length > 0) {
    hqTuiles.forEach((item) => {
      const img = item.querySelector(':scope > img, :scope > picture img');
      const title = item.querySelector('h3.hq-titre5, .contenu-text h3');
      const desc = item.querySelector('.contenu-text p');
      // CTA: try explicit button links, then any link in .contenu (nav-secondaire has SVG-only content)
      const ctaEl = item.querySelector('a.hq-bouton-secondaire, a.hq-bouton-nav-secondaire');

      // Image cell
      const imageCell = [];
      if (img) {
        const imageHint = document.createComment(' field:image ');
        imageCell.push(imageHint);
        const newImg = document.createElement('img');
        newImg.src = img.getAttribute('src') || '';
        newImg.alt = img.getAttribute('alt') || '';
        imageCell.push(newImg);
      }

      // Text cell
      const textCell = [];
      const textHint = document.createComment(' field:text ');
      textCell.push(textHint);
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (ctaEl) {
        const ctaHref = ctaEl.getAttribute('href') || '';
        // CTA text: use visible text, fallback to aria-label, then card title
        let ctaText = ctaEl.textContent.trim();
        if (!ctaText) ctaText = ctaEl.getAttribute('aria-label') || '';
        if (!ctaText && title) ctaText = title.textContent.trim();
        if (ctaHref) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = ctaHref;
          a.textContent = ctaText || 'En savoir plus';
          p.appendChild(a);
          textCell.push(p);
        }
      }

      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback: no recognized structure, create empty block
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
