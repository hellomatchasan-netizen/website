(() => {
  "use strict";

  const DRINKS = [
    { no: "01", name: "MATCHA SAN", price: "$8.0", desc: "classic matcha latte", img: "assets/images/drinks/drink-1.jpg" },
    { no: "02", name: "COCONUT CLOUD SAN", price: "$8.0", desc: "refreshing coconut water + soft matcha cloud", img: "assets/images/drinks/drink-2.jpg" },
    { no: "03", name: "DOUBLE MATCHA SAN", price: "$8.5", desc: "matcha latte + matcha cream foam", img: "assets/images/drinks/drink-3.jpg" },
    { no: "04", name: "STRAWBERRY MATCHA SAN", price: "$8.5", desc: "homemade strawberry jam + matcha latte", img: "assets/images/drinks/drink-4.jpg" },
    { no: "05", name: "SHIO SAN", price: "$8.0", desc: "special brew coffee + sea salt cream foam", img: "assets/images/drinks/drink-5.jpg" },
  ];

  const PACKAGES = [
    {
      name: "Classic",
      desc: "Small teams, studio events and intimate gatherings.",
      price: "$750",
      stats: [["60", "drinks"], ["2 hrs", "service"], ["1", "matcharista"]],
      lead: "",
      items: [
        "2 flavours: Matcha Latte plus 1 choice",
        "Ceremonial Japanese matcha",
      ],
    },
    {
      name: "Signature",
      desc: "Corporate wellness days and event activations.",
      price: "$1,300",
      stats: [["110", "drinks"], ["3 hrs", "service"], ["2", "matcharistas"]],
      lead: "Everything in Classic, plus",
      popular: true,
      items: [
        "3 flavours: Classic Matcha Latte plus 2 choices",
        "Menu board with your company branding",
      ],
    },
    {
      name: "Premium",
      desc: "Large offices, product launches and high-volume traffic.",
      price: "$2,300",
      stats: [["200", "drinks"], ["5 hrs", "service"], ["3", "matcharistas"]],
      lead: "Everything in Signature, plus",
      items: [
        "Full menu, all 5 flavours",
        "Custom cup branding",
        "Third matcharista to greet guests",
      ],
    },
  ];

  const ADDONS = ["Extra hour +$300", "Extra matcharista +$250", "Custom cups +$250"];

  const EVENT_TYPES = [...PACKAGES.map((p) => p.name), "Not sure yet"];

  const state = {
    eventType: "",
  };

  function el(tag, className, children) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (children) {
      children.forEach((child) => {
        if (typeof child === "string") node.appendChild(document.createTextNode(child));
        else if (child) node.appendChild(child);
      });
    }
    return node;
  }

  function renderImgSlot(slot) {
    const src = slot.dataset.src;
    const placeholder = slot.dataset.placeholder || "";
    if (!src) return;
    const img = new Image();
    img.alt = placeholder;
    img.onload = () => {
      slot.innerHTML = "";
      slot.appendChild(img);
    };
    img.onerror = () => {
      slot.innerHTML = "";
      const label = el("span", "img-slot-label", [placeholder || "Photo coming soon"]);
      slot.appendChild(label);
    };
    img.src = src;
  }

  function renderRotatingSlot(slot) {
    const imgs = slot.dataset.srcs.split(",").map((src, i) => {
      const img = new Image();
      img.alt = slot.dataset.placeholder || "";
      img.className = "rotate-img" + (i === 0 ? " active" : "");
      img.src = src;
      return img;
    });
    slot.innerHTML = "";
    imgs.forEach((img) => slot.appendChild(img));
    let current = 0;
    setInterval(() => {
      imgs[current].classList.remove("active");
      current = (current + 1) % imgs.length;
      imgs[current].classList.add("active");
    }, 5000);
  }

  function initImgSlots() {
    document.querySelectorAll(".img-slot[data-srcs]").forEach(renderRotatingSlot);
    document.querySelectorAll(".img-slot[data-src]").forEach(renderImgSlot);
  }

  function drinkCard(d) {
    const card = el("div", "drink-card");
    const photo = el("div", "img-slot");
    photo.dataset.src = d.img;
    photo.dataset.placeholder = d.name;
    const row = el("div", "drink-card-row", [
      el("span", "name", [d.name]),
      el("span", "price", [d.price]),
    ]);
    card.appendChild(photo);
    card.appendChild(row);
    card.appendChild(el("span", "drink-desc", [d.desc]));
    renderImgSlot(photo);
    return card;
  }

  function renderFeaturedDrinks() {
    const target = document.getElementById("featured-drinks");
    if (!target) return;
    const featured = [DRINKS[0], DRINKS[3], DRINKS[4]];
    target.innerHTML = "";
    featured.forEach((d) => target.appendChild(drinkCard(d)));
  }

  function menuItem(d) {
    const row = el("div", "menu-item");
    row.appendChild(el("span", "no", [d.no]));
    row.appendChild(el("span", "name", [d.name]));
    row.appendChild(el("span", "price", [d.price]));
    row.appendChild(el("span", ""));
    row.appendChild(el("span", "desc", [d.desc]));
    return row;
  }

  function renderMenu() {
    const target = document.getElementById("menu-sections");
    if (!target) return;
    const sections = [
      { title: "MATCHA", items: DRINKS.slice(0, 4) },
      { title: "COFFEE", items: DRINKS.slice(4) },
    ];
    target.innerHTML = "";
    sections.forEach((sec) => {
      const wrap = el("div", "menu-section");
      wrap.appendChild(
        el("div", "menu-section-head", [
          el("span", "", [sec.title]),
          el("span", "rule"),
        ])
      );
      sec.items.forEach((d) => wrap.appendChild(menuItem(d)));
      target.appendChild(wrap);
    });
  }

  function goToEnquiry(type) {
    setEventType(type);
    const formWrap = document.getElementById("enquiry-form-wrap");
    if (formWrap) {
      window.scrollTo({ top: formWrap.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
    }
  }

  function packageCard(pkg) {
    const card = el("article", "pkg-card" + (pkg.popular ? " featured" : ""));
    if (pkg.popular) card.appendChild(el("span", "pkg-badge", ["Most popular"]));
    card.appendChild(el("h3", "pkg-name", [pkg.name]));
    card.appendChild(el("p", "pkg-desc", [pkg.desc]));
    card.appendChild(el("div", "pkg-price-row", [
      el("span", "pkg-price", [pkg.price]),
    ]));
    card.appendChild(el("div", "pkg-stats", pkg.stats.map(([num, label]) =>
      el("div", "pkg-stat", [el("span", "pkg-stat-num", [num]), el("span", "pkg-stat-label", [label])])
    )));
    const features = el("div", "pkg-features");
    if (pkg.lead) features.appendChild(el("span", "pkg-lead", [pkg.lead]));
    features.appendChild(el("ul", "pkg-list", pkg.items.map((item) => el("li", "", [item]))));
    card.appendChild(features);
    const btn = el("button", "btn pkg-btn", ["Enquire about " + pkg.name]);
    btn.type = "button";
    btn.addEventListener("click", () => goToEnquiry(pkg.name));
    card.appendChild(btn);
    return card;
  }

  function renderPackages() {
    const target = document.getElementById("package-grid");
    if (!target) return;
    target.innerHTML = "";
    PACKAGES.forEach((pkg) => target.appendChild(packageCard(pkg)));

    const addons = document.getElementById("package-addons");
    if (addons) {
      addons.innerHTML = "";
      ADDONS.forEach((label) => addons.appendChild(el("span", "addon-pill", [label])));
    }
    const unsure = document.getElementById("package-unsure");
    if (unsure) unsure.addEventListener("click", () => goToEnquiry("Not sure yet"));
  }

  function renderTypeChips() {
    const target = document.getElementById("type-chips");
    if (!target) return;
    target.innerHTML = "";
    EVENT_TYPES.forEach((type) => {
      const chip = el("button", "chip" + (state.eventType === type ? " on" : ""), [
        el("span", "chip-dot", [el("span")]),
        type,
      ]);
      chip.type = "button";
      chip.addEventListener("click", () => setEventType(type));
      target.appendChild(chip);
    });
  }

  function setEventType(type) {
    state.eventType = type;
    renderTypeChips();
    clearError();
  }

  function clearError() {
    const errorEl = document.getElementById("form-error");
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
  }

  function showError(message) {
    const errorEl = document.getElementById("form-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  }

  // FormSubmit relays the form to this inbox; works from a static host (GitHub Pages).
  const ENQUIRY_ENDPOINT = "https://formsubmit.co/ajax/hello.matchasan@gmail.com";

  function initEnquiryForm() {
    const form = document.getElementById("enquiry-form");
    const sentPanel = document.getElementById("enquiry-sent");
    const sendAnother = document.getElementById("send-another");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();

      if (!name || !/\S+@\S+\.\S+/.test(email)) {
        showError("Please add your name and a valid email.");
        return;
      }
      if (!state.eventType) {
        showError("Please choose an event type.");
        return;
      }
      clearError();

      const submitBtn = form.querySelector(".btn-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const payload = new FormData(form);
      payload.set("eventType", state.eventType);
      payload.set("_subject", "Matcha San: new event enquiry from " + name);
      payload.set("_replyto", email);
      payload.set("_template", "table");
      payload.set("_captcha", "false");

      try {
        const res = await fetch(ENQUIRY_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || String(data.success) !== "true") {
          throw new Error((data && data.message) || "Something went wrong sending your enquiry.");
        }
        document.getElementById("sent-name").textContent = name;
        document.getElementById("sent-email").textContent = email;
        form.hidden = true;
        sentPanel.hidden = false;
      } catch (err) {
        showError(err.message || "Something went wrong sending your enquiry. Please email us directly.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send enquiry";
      }
    });

    if (sendAnother) {
      sendAnother.addEventListener("click", () => {
        form.reset();
        setEventType("");
        form.hidden = false;
        sentPanel.hidden = true;
      });
    }
  }

  const PAGES = ["home", "menu", "about", "events"];

  function currentPage() {
    const hash = window.location.hash.replace("#", "");
    return PAGES.includes(hash) ? hash : "home";
  }

  function renderRoute() {
    const page = currentPage();
    PAGES.forEach((p) => {
      const section = document.getElementById(`page-${p}`);
      if (section) section.hidden = p !== page;
    });
    document.querySelectorAll(".site-nav a").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === page);
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", renderRoute);

  document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedDrinks();
    renderMenu();
    renderPackages();
    renderTypeChips();
    initImgSlots();
    initEnquiryForm();
    renderRoute();
  });
})();
