(() => {
  "use strict";

  const DRINKS = [
    { no: "01", name: "MATCHA SAN", price: "$8.0", desc: "classic matcha latte", img: "assets/images/drinks/drink-1.jpg" },
    { no: "02", name: "COCONUT CLOUD SAN", price: "$8.0", desc: "refreshing coconut water + soft matcha cloud", img: "assets/images/drinks/drink-2.jpg" },
    { no: "03", name: "DOUBLE MATCHA SAN", price: "$8.5", desc: "matcha latte + matcha cream foam", img: "assets/images/drinks/drink-3.jpg" },
    { no: "04", name: "STRAWBERRY MATCHA SAN", price: "$8.5", desc: "homemade strawberry jam + matcha latte", img: "assets/images/drinks/drink-4.jpg" },
    { no: "05", name: "SHIO SAN", price: "$8.0", desc: "special brew coffee + sea salt cream foam", img: "assets/images/drinks/drink-5.jpg" },
  ];

  const TRANSPORT_NOTE = "Transportation to and from the event (15KM from Melbourne CBD). Long distance fee applies for farther areas.";

  const PACKAGES = [
    {
      name: "Classic Matcha Bar",
      desc: "Perfect for small teams, studio events and intimate gatherings.",
      price: "$1,000",
      hours: "2 hours service",
      items: [
        "Up to 70 drinks of ceremonial Japanese matcha",
        "2 drink flavours (Matcha Latte + 1 Flavor Choice)",
        "1 professional matcharista",
        "Full seamless setup and pack down",
        "Minimalistic birch plywood mobile matcha bar",
        TRANSPORT_NOTE,
      ],
    },
    {
      name: "Signature Experience",
      desc: "Our most popular package. Ideal for corporate wellness days & event activations.",
      price: "$1,600",
      hours: "3 hours service",
      items: [
        "Up to 120 drinks of ceremonial Japanese matcha",
        "3 drink flavours (Classic Matcha Latte + 2 Flavor Choices)",
        "2 professional matcharista",
        "Full event set up and pack down",
        "Premium birch plywood mobile matcha bar",
        "Menu board with your company branding",
        TRANSPORT_NOTE,
      ],
    },
    {
      name: "Premium Activation",
      desc: "Designed for large offices, product launches & high-volume traffic.",
      price: "$2,400",
      hours: "4 hours service",
      items: [
        "Up to 200 drinks of ceremonial grade Japanese matcha",
        "Full menu (5 flavors)",
        "2 professional matcharista",
        "Full event set up and pack down",
        "Premium birch plywood mobile matcha bar",
        "Menu board with your company branding",
        "Custom cup branding",
        TRANSPORT_NOTE,
      ],
    },
    {
      name: "Full Scale Activation",
      desc: "For conferences, large corporate campuses & brand-led activations.",
      price: "$3,600",
      hours: "5 hours service",
      items: [
        "Up to 350 drinks of ceremonial grade Japanese matcha",
        "Full menu (5 flavors)",
        "3 professional matcharista",
        "Full event set up and pack down",
        "Premium birch plywood mobile matcha bar",
        "Menu board with your company branding",
        "Custom cup branding",
        TRANSPORT_NOTE,
      ],
    },
  ];

  const EVENT_TYPES = [...PACKAGES.map((p) => p.name), "Not sure yet"];

  const state = {
    activePackage: 0,
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

  function initImgSlots() {
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

  function renderPackageTabs() {
    const target = document.getElementById("package-tabs");
    if (!target) return;
    target.innerHTML = "";
    PACKAGES.forEach((pkg, i) => {
      const tab = el("button", "package-tab" + (i === state.activePackage ? " active" : ""), [
        el("span", "tab-name", [pkg.name]),
        el("span", "tab-price", [pkg.price]),
      ]);
      tab.type = "button";
      tab.addEventListener("click", () => {
        state.activePackage = i;
        renderPackageTabs();
        renderPackageBody();
      });
      target.appendChild(tab);
    });
  }

  function renderPackageBody() {
    const target = document.getElementById("package-body");
    if (!target) return;
    const pkg = PACKAGES[state.activePackage];
    target.innerHTML = "";

    const main = el("div", "package-main");
    main.appendChild(el("span", "pkg-name", [pkg.name]));
    main.appendChild(el("span", "pkg-desc", [pkg.desc]));
    main.appendChild(el("span", "pkg-price", [`${pkg.price} — ${pkg.hours}`]));
    const enquireBtn = el("button", "btn btn-dark", ["Enquire about this package"]);
    enquireBtn.type = "button";
    enquireBtn.addEventListener("click", () => {
      setEventType(pkg.name);
      const formWrap = document.getElementById("enquiry-form-wrap");
      if (formWrap) {
        window.scrollTo({ top: formWrap.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
      }
    });
    main.appendChild(enquireBtn);

    const included = el("div", "package-included");
    included.appendChild(el("span", "included-label", ["What's included"]));
    pkg.items.forEach((item) => {
      included.appendChild(
        el("div", "included-item", [el("span", "dot"), el("span", "", [item])])
      );
    });

    target.appendChild(main);
    target.appendChild(included);
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

      try {
        const res = await fetch("php/enquiry-handler.php", {
          method: "POST",
          body: payload,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || data.ok !== true) {
          throw new Error((data && data.error) || "Something went wrong sending your enquiry.");
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
    renderPackageTabs();
    renderPackageBody();
    renderTypeChips();
    initImgSlots();
    initEnquiryForm();
    renderRoute();
  });
})();
