/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AbbVie cleanup.
 * Removes non-authorable content (header, footer, breadcrumbs, cookie/consent, tracking).
 * Selectors from captured DOM of abbvie.com leader profile pages.
 * Generated: 2026-02-25
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (OneTrust) — found in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.optanon-alert-box-wrapper',
    ]);

    // Unwrap nested spans that wrap single text nodes (found in captured DOM: span.light-font > span.body-unica-32-reg)
    const nested = element.querySelectorAll('span > span:only-child');
    nested.forEach((span) => {
      const parent = span.parentElement;
      if (parent && parent.tagName === 'SPAN' && parent.childNodes.length === 1) {
        parent.replaceWith(span);
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable: header/nav banner — from captured DOM: banner[ref=e14]
    WebImporter.DOMUtils.remove(element, [
      'header',
      '[role="banner"]',
      'nav[aria-label="Primary"]',
    ]);

    // Non-authorable: footer — from captured DOM: generic[ref=e239] with scroll-to-top, footer links
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer-container',
      'button[aria-label="Scroll to top of page"]',
    ]);

    // Non-authorable: breadcrumb — from captured DOM: .breadcrumb.abbvie-breadcrumb
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumb',
      '[class*="breadcrumb"]',
    ]);

    // Cleanup: iframes, noscript, link tags, tracking pixels
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'img[src*="t.co"]',
      'img[src*="bing.com"]',
    ]);

    // Cleanup: data attributes used for AEM tracking
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
    element.querySelectorAll('[data-cmp-clickable]').forEach((el) => {
      el.removeAttribute('data-cmp-clickable');
    });
  }
}
