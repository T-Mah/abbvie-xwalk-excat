/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block.
 * Base block: columns
 * Source: https://www.abbvie.com/who-we-are/our-leaders/liz-shea.html
 * Generated: 2026-02-25
 *
 * Source DOM structure (from captured HTML):
 *   .grid > .grid-container > .grid-row
 *     .grid-row__col-with-5:first-child — headshot image (left column)
 *       .cmp-image img[alt="Liz Shea"]
 *     .grid-row__col-with-5:nth-child(3) — bio text + LinkedIn link (right column)
 *       .cmp-text p (3 paragraphs)
 *       .button.external-cta a.cmp-button — LinkedIn Profile link
 *
 * Block library structure (columns):
 *   Row 1: [col1 content, col2 content] — multiple columns per row
 *   Each cell can contain text, images, or other inline elements.
 *
 * UE Model: columns block — no field hints required (per hinting Rule 4)
 * Image links: left unchanged per project rules
 */
export default function parse(element, { document }) {
  // Column 1: Headshot image — from captured DOM: .cmp-image img
  const imgEl = element.querySelector('.cmp-image img, .cmp-image__image, img[alt]');
  const col1 = [];
  if (imgEl) {
    const img = document.createElement('img');
    // Leave image URL unchanged per project rules (rules/content.md)
    const src = imgEl.getAttribute('data-cmp-src')
      || imgEl.getAttribute('src')
      || imgEl.src;
    // Skip placeholder data URIs
    if (src && !src.startsWith('data:')) {
      img.src = src;
    } else {
      // Fallback: try the parent's data-cmp-src attribute
      const parent = imgEl.closest('.cmp-image[data-cmp-src]');
      if (parent) {
        img.src = parent.getAttribute('data-cmp-src');
      }
    }
    img.alt = imgEl.alt || '';
    col1.push(img);
  }

  // Column 2: Bio text + LinkedIn link — from captured DOM: .cmp-text p, .cmp-button
  const col2 = [];

  // Bio paragraphs
  const textContainer = element.querySelector('.grid-row__col-with-5:nth-child(3) .cmp-text, .grid-row__col-with-5:last-of-type .cmp-text');
  if (textContainer) {
    const paragraphs = textContainer.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        col2.push(newP);
      }
    });
  }

  // LinkedIn Profile link — from captured DOM: .button.external-cta a.cmp-button
  const linkEl = element.querySelector('.external-cta a.cmp-button, a[href*="linkedin.com"]');
  if (linkEl) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = linkEl.href || linkEl.getAttribute('href');
    a.textContent = linkEl.textContent.trim();
    a.target = '_blank';
    p.appendChild(a);
    col2.push(p);
  }

  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
