/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo.
 * Base block: hero
 * Source: https://www.hydroquebec.com/residentiel/
 * Generated: 2026-03-06
 *
 * Source DOM structure (from captured HTML):
 *   section.hq-accueil-hero
 *     .hq-accueil-hero-tuile-grid
 *       .hq-accueil-hero-tuile.hq-bg-blanc
 *         p.hq-titre1.hq-couleur-gris-95 — promo headline
 *         a.hq-bouton-primaire — CTA link
 *     .hq-accueil-hero-image
 *       picture > img.hq-accueil-hero-img — background image
 *
 * Block library structure (hero):
 *   Row 1: Background image (optional) — field: image
 *   Row 2: Title + subheading + CTA (richtext) — field: text
 *
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * xwalk: field hints required for image and text rows
 * imageAlt is a collapsed field (suffix Alt) — no hint per Rule 3
 */
export default function parse(element, { document }) {
  // Extract background image — from captured DOM: img.hq-accueil-hero-img inside picture
  const bgImg = element.querySelector('img.hq-accueil-hero-img, .hq-accueil-hero-image img');

  // Row 1: Background image with field hint
  const imageCell = [];
  if (bgImg) {
    const imageHint = document.createComment(' field:image ');
    imageCell.push(imageHint);
    const img = document.createElement('img');
    img.src = bgImg.getAttribute('src') || '';
    img.alt = bgImg.getAttribute('alt') || '';
    imageCell.push(img);
  }

  // Extract headline — from captured DOM: p.hq-titre1
  const heading = element.querySelector('p.hq-titre1, .hq-accueil-hero-tuile p.hq-titre1');

  // Extract CTA link — from captured DOM: a.hq-bouton-primaire
  const ctaLink = element.querySelector('a.hq-bouton-primaire, .hq-accueil-hero-tuile a');

  // Row 2: Text content (heading + CTA) with field hint
  const textCell = [];
  const textHint = document.createComment(' field:text ');
  textCell.push(textHint);
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textCell.push(h1);
  }
  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.getAttribute('href') || '';
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textCell.push(p);
  }

  const cells = [
    imageCell,
    textCell,
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
