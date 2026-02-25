var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-leader-profile.js
  var import_leader_profile_exports = {};
  __export(import_leader_profile_exports, {
    default: () => import_leader_profile_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1.cmp-title__text, h1, .cmp-title h1");
    const subtitle = element.querySelector(".cmp-text p, .cmp-text-xx-large p");
    const imageCell = [];
    const textCell = [];
    const textHint = document.createComment(" field:text ");
    textCell.push(textHint);
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textCell.push(h1);
    }
    if (subtitle) {
      const p = document.createElement("p");
      p.textContent = subtitle.textContent.trim();
      textCell.push(p);
    }
    const cells = [
      imageCell,
      textCell
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const imgEl = element.querySelector(".cmp-image img, .cmp-image__image, img[alt]");
    const col1 = [];
    if (imgEl) {
      const img = document.createElement("img");
      const src = imgEl.getAttribute("data-cmp-src") || imgEl.getAttribute("src") || imgEl.src;
      if (src && !src.startsWith("data:")) {
        img.src = src;
      } else {
        const parent = imgEl.closest(".cmp-image[data-cmp-src]");
        if (parent) {
          img.src = parent.getAttribute("data-cmp-src");
        }
      }
      img.alt = imgEl.alt || "";
      col1.push(img);
    }
    const col2 = [];
    const textContainer = element.querySelector(".grid-row__col-with-5:nth-child(3) .cmp-text, .grid-row__col-with-5:last-of-type .cmp-text");
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll("p");
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) {
          const newP = document.createElement("p");
          newP.textContent = p.textContent.trim();
          col2.push(newP);
        }
      });
    }
    const linkEl = element.querySelector('.external-cta a.cmp-button, a[href*="linkedin.com"]');
    if (linkEl) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = linkEl.href || linkEl.getAttribute("href");
      a.textContent = linkEl.textContent.trim();
      a.target = "_blank";
      p.appendChild(a);
      col2.push(p);
    }
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/abbvie-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        ".optanon-alert-box-wrapper"
      ]);
      const nested = element.querySelectorAll("span > span:only-child");
      nested.forEach((span) => {
        const parent = span.parentElement;
        if (parent && parent.tagName === "SPAN" && parent.childNodes.length === 1) {
          parent.replaceWith(span);
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        '[role="banner"]',
        'nav[aria-label="Primary"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        ".footer-container",
        'button[aria-label="Scroll to top of page"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".breadcrumb",
        '[class*="breadcrumb"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        'img[src*="t.co"]',
        'img[src*="bing.com"]'
      ]);
      element.querySelectorAll("[data-cmp-data-layer]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
      });
      element.querySelectorAll("[data-cmp-clickable]").forEach((el) => {
        el.removeAttribute("data-cmp-clickable");
      });
    }
  }

  // tools/importer/transformers/abbvie-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const doc = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-leader-profile.js
  var parsers = {
    "hero": parse,
    "columns": parse2
  };
  var PAGE_TEMPLATE = {
    name: "leader-profile",
    description: "Leadership team member biography/profile page with executive photo, title, and bio text",
    urls: [
      "https://www.abbvie.com/who-we-are/our-leaders/liz-shea.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          ".container.abbvie-container.cmp-container-full-width",
          ".container.abbvie-container.overlap-predecessor"
        ]
      },
      {
        name: "columns",
        instances: [".grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Leader Header",
        selector: [
          ".container.abbvie-container.cmp-container-full-width",
          ".container.abbvie-container.overlap-predecessor"
        ],
        style: "navy-blue",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Bio Content",
        selector: ".grid",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Separator",
        selector: ".separator.separator-height-96",
        style: null,
        blocks: [],
        defaultContent: [".cmp-separator__horizontal-rule"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_leader_profile_default = {
    /**
     * Main transformation function using transform() pattern
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_leader_profile_exports);
})();
