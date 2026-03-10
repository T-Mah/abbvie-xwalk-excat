/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-info.
 * Base block: columns
 * Source: https://www.hydroquebec.com/residentiel/
 * Generated: 2026-03-06
 *
 * Source DOM structure variations (from captured HTML):
 *
 *   Section 5 - Statistics (.bloc-statistique .liste-blocs):
 *     ul.liste-blocs > li (×3)
 *       p.statistique — large number (62, 262 474, 4,4)
 *       p — description text
 *
 *   Section 6 - News and Publications (.hq-container.hq-grid.hq-grid-cols-4):
 *     div.hq-grid.hq-grid-cols-4
 *       div (col1 - Dernières nouvelles):
 *         h2.hq-titre3 — section title
 *         .hq-bloc-maillage > ul.js-rss > li — news items (date + title + link)
 *         a.hq-bouton-secondaire — "Voir toutes les nouvelles" link
 *       div (col2 - Dernières publications):
 *         h2.hq-titre3 — section title
 *         ul.hq-tuile-contenant > li — publication items (title + link)
 *         p > a.hq-bouton-texte-corriger — "Voir toutes nos publications" link
 *
 * Block library structure (columns):
 *   Row 1: [col1 content, col2 content, ...] — multiple columns per row
 *   Each cell can contain text, images, or inline elements
 *
 * UE Model: columns block — no field hints required (per hinting Rule 4)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Section 5: Statistics — ul.liste-blocs > li items become columns in a single row
  const statsItems = element.querySelectorAll('ul.liste-blocs > li');
  if (statsItems.length > 0) {
    const row = [];
    statsItems.forEach((item) => {
      const col = [];
      const stat = item.querySelector('p.statistique');
      const label = item.querySelector('p:not(.statistique)');
      if (stat) {
        const h2 = document.createElement('h2');
        h2.textContent = stat.textContent.trim();
        col.push(h2);
      }
      if (label) {
        const p = document.createElement('p');
        p.textContent = label.textContent.trim();
        col.push(p);
      }
      row.push(col);
    });
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
    element.replaceWith(block);
    return;
  }

  // Section 6: News and Publications — 2 column divs become columns in a single row
  const gridCols = element.querySelectorAll(':scope > div.hq-grid > div, :scope > div');
  if (gridCols.length >= 2) {
    const row = [];

    gridCols.forEach((colDiv) => {
      const col = [];

      // Section heading
      const heading = colDiv.querySelector('h2.hq-titre3, h2');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent.trim();
        col.push(h2);
      }

      // News items (ul.js-rss > li > a)
      const newsItems = colDiv.querySelectorAll('.hq-bloc-maillage li a, ul.js-rss li a');
      newsItems.forEach((newsLink) => {
        const dateEl = newsLink.querySelector('time');
        const titleEl = newsLink.querySelector('p.hq-titre4');
        if (dateEl) {
          const p = document.createElement('p');
          const em = document.createElement('em');
          em.textContent = dateEl.textContent.trim();
          p.appendChild(em);
          col.push(p);
        }
        if (titleEl) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = newsLink.getAttribute('href') || '';
          a.textContent = titleEl.textContent.trim();
          p.appendChild(a);
          col.push(p);
        }
      });

      // Publication items (ul.hq-tuile-contenant > li > a.contenu)
      const pubItems = colDiv.querySelectorAll('ul.hq-tuile-contenant li a.contenu, li.hq-tuile a.contenu');
      pubItems.forEach((pubLink) => {
        const titleEl = pubLink.querySelector('p.hq-titre4');
        if (titleEl) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = pubLink.getAttribute('href') || '';
          a.textContent = titleEl.textContent.trim();
          p.appendChild(a);
          col.push(p);
        }
      });

      // CTA link at bottom of column
      const ctaLink = colDiv.querySelector(':scope > a.hq-bouton-secondaire, :scope > p > a');
      if (ctaLink) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaLink.getAttribute('href') || '';
        a.textContent = ctaLink.textContent.trim();
        p.appendChild(a);
        col.push(p);
      }

      if (col.length > 0) {
        row.push(col);
      }
    });

    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
