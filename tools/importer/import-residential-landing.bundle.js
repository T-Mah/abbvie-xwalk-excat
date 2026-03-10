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

  // tools/importer/import-residential-landing.js
  var import_residential_landing_exports = {};
  __export(import_residential_landing_exports, {
    default: () => import_residential_landing_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const bgImg = element.querySelector("img.hq-accueil-hero-img, .hq-accueil-hero-image img");
    const imageCell = [];
    if (bgImg) {
      const imageHint = document.createComment(" field:image ");
      imageCell.push(imageHint);
      const img = document.createElement("img");
      img.src = bgImg.getAttribute("src") || "";
      img.alt = bgImg.getAttribute("alt") || "";
      imageCell.push(img);
    }
    const heading = element.querySelector("p.hq-titre1, .hq-accueil-hero-tuile p.hq-titre1");
    const ctaLink = element.querySelector("a.hq-bouton-primaire, .hq-accueil-hero-tuile a");
    const textCell = [];
    const textHint = document.createComment(" field:text ");
    textCell.push(textHint);
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textCell.push(h1);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.getAttribute("href") || "";
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textCell.push(p);
    }
    const cells = [
      imageCell,
      textCell
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cells = [];
    let cardItems = [];
    const promoItems = element.querySelectorAll("li.hq-promo-tuile");
    if (promoItems.length > 0) {
      promoItems.forEach((item) => {
        const tag = item.querySelector("p.pastille");
        const title = item.querySelector("p.subtitle, p.hq-titre5");
        const ctaEl = item.querySelector("a.hq-bouton-texte");
        const ctaText = ctaEl ? ctaEl.querySelector(".js-bouton-text") || ctaEl : null;
        const imageCell = [];
        const textCell = [];
        const textHint = document.createComment(" field:text ");
        textCell.push(textHint);
        if (tag) {
          const p = document.createElement("p");
          p.textContent = tag.textContent.trim();
          textCell.push(p);
        }
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textCell.push(h3);
        }
        if (ctaEl) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = ctaEl.getAttribute("href") || "";
          a.textContent = ctaText ? ctaText.textContent.trim() : ctaEl.textContent.trim();
          p.appendChild(a);
          textCell.push(p);
        }
        cells.push([imageCell, textCell]);
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
      element.replaceWith(block2);
      return;
    }
    const tuileItems = element.querySelectorAll("li.tuile");
    if (tuileItems.length > 0) {
      tuileItems.forEach((item) => {
        const img = item.querySelector(".tuile-image img, img");
        const linkEl = item.querySelector("a.hq-titre4, a");
        const imageCell = [];
        if (img) {
          const imageHint = document.createComment(" field:image ");
          imageCell.push(imageHint);
          const newImg = document.createElement("img");
          newImg.src = img.getAttribute("src") || "";
          newImg.alt = img.getAttribute("alt") || "";
          imageCell.push(newImg);
        }
        const textCell = [];
        const textHint = document.createComment(" field:text ");
        textCell.push(textHint);
        if (linkEl) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = linkEl.getAttribute("href") || "";
          a.textContent = linkEl.textContent.trim();
          p.appendChild(a);
          textCell.push(p);
        }
        cells.push([imageCell, textCell]);
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
      element.replaceWith(block2);
      return;
    }
    const hqTuiles = element.querySelectorAll(".hq-tuile");
    if (hqTuiles.length > 0) {
      hqTuiles.forEach((item) => {
        const img = item.querySelector(":scope > img, :scope > picture img");
        const title = item.querySelector("h3.hq-titre5, .contenu-text h3");
        const desc = item.querySelector(".contenu-text p");
        const ctaEl = item.querySelector("a.hq-bouton-secondaire, a.hq-bouton-nav-secondaire");
        const imageCell = [];
        if (img) {
          const imageHint = document.createComment(" field:image ");
          imageCell.push(imageHint);
          const newImg = document.createElement("img");
          newImg.src = img.getAttribute("src") || "";
          newImg.alt = img.getAttribute("alt") || "";
          imageCell.push(newImg);
        }
        const textCell = [];
        const textHint = document.createComment(" field:text ");
        textCell.push(textHint);
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textCell.push(h3);
        }
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textCell.push(p);
        }
        if (ctaEl) {
          const ctaHref = ctaEl.getAttribute("href") || "";
          let ctaText = ctaEl.textContent.trim();
          if (!ctaText) ctaText = ctaEl.getAttribute("aria-label") || "";
          if (!ctaText && title) ctaText = title.textContent.trim();
          if (ctaHref) {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = ctaHref;
            a.textContent = ctaText || "En savoir plus";
            p.appendChild(a);
            textCell.push(p);
          }
        }
        cells.push([imageCell, textCell]);
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
      element.replaceWith(block2);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse3(element, { document }) {
    const cells = [];
    const statsItems = element.querySelectorAll("ul.liste-blocs > li");
    if (statsItems.length > 0) {
      const row = [];
      statsItems.forEach((item) => {
        const col = [];
        const stat = item.querySelector("p.statistique");
        const label = item.querySelector("p:not(.statistique)");
        if (stat) {
          const h2 = document.createElement("h2");
          h2.textContent = stat.textContent.trim();
          col.push(h2);
        }
        if (label) {
          const p = document.createElement("p");
          p.textContent = label.textContent.trim();
          col.push(p);
        }
        row.push(col);
      });
      cells.push(row);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
      element.replaceWith(block2);
      return;
    }
    const gridCols = element.querySelectorAll(":scope > div.hq-grid > div, :scope > div");
    if (gridCols.length >= 2) {
      const row = [];
      gridCols.forEach((colDiv) => {
        const col = [];
        const heading = colDiv.querySelector("h2.hq-titre3, h2");
        if (heading) {
          const h2 = document.createElement("h2");
          h2.textContent = heading.textContent.trim();
          col.push(h2);
        }
        const newsItems = colDiv.querySelectorAll(".hq-bloc-maillage li a, ul.js-rss li a");
        newsItems.forEach((newsLink) => {
          const dateEl = newsLink.querySelector("time");
          const titleEl = newsLink.querySelector("p.hq-titre4");
          if (dateEl) {
            const p = document.createElement("p");
            const em = document.createElement("em");
            em.textContent = dateEl.textContent.trim();
            p.appendChild(em);
            col.push(p);
          }
          if (titleEl) {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = newsLink.getAttribute("href") || "";
            a.textContent = titleEl.textContent.trim();
            p.appendChild(a);
            col.push(p);
          }
        });
        const pubItems = colDiv.querySelectorAll("ul.hq-tuile-contenant li a.contenu, li.hq-tuile a.contenu");
        pubItems.forEach((pubLink) => {
          const titleEl = pubLink.querySelector("p.hq-titre4");
          if (titleEl) {
            const p = document.createElement("p");
            const a = document.createElement("a");
            a.href = pubLink.getAttribute("href") || "";
            a.textContent = titleEl.textContent.trim();
            p.appendChild(a);
            col.push(p);
          }
        });
        const ctaLink = colDiv.querySelector(":scope > a.hq-bouton-secondaire, :scope > p > a");
        if (ctaLink) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = ctaLink.getAttribute("href") || "";
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
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
      element.replaceWith(block2);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hydroquebec-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav#mm-hq-header-nav-section",
        "nav.hq-nav-section",
        "header#hq-main-header",
        "nav.hq-nav-desktop",
        "nav.hq-nav-grande-section",
        "nav.hq-nav-utils",
        "footer#hq-main-footer",
        "noscript",
        "iframe",
        "link"
      ]);
      const svgIcons = element.querySelectorAll('img[src^="data:image/svg+xml;base64,"]');
      svgIcons.forEach((img) => {
        if (img.closest("a")) {
          img.remove();
        }
      });
      element.querySelectorAll("[data-track]").forEach((el) => {
        el.removeAttribute("data-track");
      });
      element.querySelectorAll("[onclick]").forEach((el) => {
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/hydroquebec-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-residential-landing.js
  var parsers = {
    "hero-promo": parse,
    "cards-feature": parse2,
    "columns-info": parse3
  };
  var PAGE_TEMPLATE = {
    name: "residential-landing",
    description: "Residential services landing page with service categories, quick links, and promotional content for Hydro-Qu\xE9bec residential customers",
    urls: [
      "https://www.hydroquebec.com/residentiel/"
    ],
    blocks: [
      {
        name: "hero-promo",
        instances: [
          "section.hq-accueil-hero"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          ".hq-promo-bloc",
          "ul.hq-grid.tuile-container",
          ".hq-tuile-contenant",
          ".hq-grid.hq-tuile-contenant"
        ]
      },
      {
        name: "columns-info",
        instances: [
          ".bloc-statistique .liste-blocs",
          ".hq-container.hq-grid.hq-grid-cols-4"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.hq-accueil-hero",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "\xC0 la une",
        selector: "section.hq-section-accueil:has(.hq-promo)",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["h2.hq-titre3"]
      },
      {
        id: "section-3",
        name: "Quick Links",
        selector: "section.hq-section-accueil.hq-bg-bleu-10:has(.tuile-container)",
        style: "light-blue",
        blocks: ["cards-feature"],
        defaultContent: ["h2.hq-titre3", "a.hq-bouton-texte"]
      },
      {
        id: "section-4",
        name: "L'\xE9lectricit\xE9 et vous",
        selector: "section.hq-section-accueil.hq-bg-bleu-80",
        style: "dark-blue",
        blocks: ["cards-feature"],
        defaultContent: ["h2.hq-titre3"]
      },
      {
        id: "section-5",
        name: "Statistics",
        selector: "section.hq-section-accueil.bloc-statistique",
        style: null,
        blocks: ["columns-info"],
        defaultContent: ["h2.hq-titre3"]
      },
      {
        id: "section-6",
        name: "News and Publications",
        selector: [
          "section.hq-section-accueil.hq-bg-bleu-10:has(.hq-bloc-maillage)",
          "section.hq-section-accueil.hq-bg-bleu-10:last-of-type"
        ],
        style: "light-blue",
        blocks: ["columns-info"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Restons en contact",
        selector: "section.hq-section-accueil:last-of-type",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: ["h2.hq-titre3"]
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
  var import_residential_landing_default = {
    /**
     * Main transformation function for residential-landing template
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
  return __toCommonJS(import_residential_landing_exports);
})();
