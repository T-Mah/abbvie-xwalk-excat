/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Hydro-Québec cleanup.
 * Removes non-authorable content (nav, header, footer, cookie banner, widgets).
 * Selectors from captured DOM of https://www.hydroquebec.com/residentiel/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove OneTrust cookie consent banner (found: #onetrust-consent-sdk, #onetrust-banner-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove mobile off-canvas navigation menu (found: nav#mm-hq-header-nav-section.mm-menu)
    // Remove site header (found: header#hq-main-header.hq-menu-site-new-bloc)
    // Remove desktop navigation (found: nav.hq-nav-desktop, nav.hq-nav-grande-section, nav.hq-nav-utils)
    // Remove site footer (found: footer#hq-main-footer.container-fluid)
    WebImporter.DOMUtils.remove(element, [
      'nav#mm-hq-header-nav-section',
      'nav.hq-nav-section',
      'header#hq-main-header',
      'nav.hq-nav-desktop',
      'nav.hq-nav-grande-section',
      'nav.hq-nav-utils',
      'footer#hq-main-footer',
      'noscript',
      'iframe',
      'link',
    ]);

    // Remove decorative SVG arrow icons inside links (base64-encoded SVG sprites)
    const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml;base64,"]');
    svgIcons.forEach((img) => {
      if (img.closest('a')) {
        img.remove();
      }
    });

    // Remove data-tracking attributes
    element.querySelectorAll('[data-track]').forEach((el) => {
      el.removeAttribute('data-track');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
  }
}
