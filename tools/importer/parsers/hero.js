/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block.
 * Base block: hero
 * Source: https://www.abbvie.com/who-we-are/our-leaders/liz-shea.html
 * Generated: 2026-02-25
 *
 * Source DOM structure (from captured HTML):
 *   .container.abbvie-container.overlap-predecessor
 *     .cmp-title h1.cmp-title__text — person name (heading)
 *     .cmp-text p span — job title (subheading)
 *
 * Block library structure (hero):
 *   Row 1: Background image (optional) — field: image
 *   Row 2: Title + subheading + CTA (richtext) — field: text
 *
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * xwalk: field hints required for image and text rows
 */
export default function parse(element, { document }) {
  // Extract heading (H1 with person name) — from captured DOM: h1.cmp-title__text
  const heading = element.querySelector('h1.cmp-title__text, h1, .cmp-title h1');

  // Extract subtitle (job title) — from captured DOM: .cmp-text p
  const subtitle = element.querySelector('.cmp-text p, .cmp-text-xx-large p');

  // Row 1: Background image (optional — not present on this page, but row must exist for xwalk)
  // Field hint for image row (empty cell, no hint needed per hinting rules)
  const imageCell = [];

  // Row 2: Text content (heading + subtitle)
  const textCell = [];
  const textHint = document.createComment(' field:text ');
  textCell.push(textHint);
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textCell.push(h1);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent.trim();
    textCell.push(p);
  }

  const cells = [
    imageCell,
    textCell,
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
