export default class DetailsAnimated extends HTMLElement {
  declare detailsEl: HTMLDetailsElement | null;
  declare bodyEls: ChildNode[];

  connectedCallback(): void {
    this.detailsEl = this.querySelector(":scope > details");
    const summaryEl = this.detailsEl?.querySelector(":scope > summary") ?? null;

    this.bodyEls = Array.from(this.detailsEl?.childNodes ?? []).filter((node: ChildNode) => {
      return node instanceof HTMLElement ? node.tagName !== "SUMMARY" : true;
    });

    const transformEl = document.createElement("div");
    transformEl.classList.add("animated-disclosure--transform");
    this.bodyEls.forEach((bodyEl) => transformEl.appendChild(bodyEl));

    const animationBoxEl = document.createElement("div");
    animationBoxEl.classList.add("animated-disclosure--animation");
    animationBoxEl.appendChild(transformEl);

    const accordionBody = document.createElement("div");
    accordionBody.classList.add("animated-disclosure--body");
    accordionBody.appendChild(animationBoxEl);

    this.detailsEl?.appendChild(accordionBody);

    if (this.detailsEl && summaryEl) {
      if (this.isOpen()) {
        this.detailsEl?.setAttribute("data-animate-open", "");
      }

      const observer = new MutationObserver(this.openWithAnimation.bind(this));
      observer.observe(this.detailsEl, {
        attributes: true,
        attributeFilter: ["open"],
      })

      summaryEl.addEventListener("click", this.handleSummaryClick.bind(this));
      this.addStylesToPage()
    }
  }

  handleSummaryClick(event: Event): void {
    if (this.isOpen()) {
      event.preventDefault();
      this.closeWithAnimation();
    }
  }

  openWithAnimation(): void {
    if (this.isOpen()) {
      // Firefox 126 doesn't animate without the setTimeout
      setTimeout(() => this.detailsEl?.setAttribute("data-animate-open", ""), 0)
    }
  }

  closeWithAnimation(): void {
    this.detailsEl?.addEventListener(
        "transitionend",
        () => {
          this.detailsEl?.removeAttribute("open");
        },
        {
          once: true,
        },
    );

    this.detailsEl?.removeAttribute("data-animate-open");
  }

  isOpen(): boolean {
    return this.detailsEl?.hasAttribute("open") ?? true;
  }

  addStylesToPage(): void {
    // language=css
    const css: string = `
      :root {
        --animated-disclosure--transition-length: 0.2s;
        --animated-disclosure--transition-timing: ease;
      }

      .animated-disclosure--body {
        display: grid;
        grid-template-rows: 0fr;
        overflow: hidden;
        transition: grid-template-rows var(--animated-disclosure--transition-length) var(--animated-disclosure--transition-timing);
      }

      [data-animate-open] .animated-disclosure--body {
        grid-template-rows: 1fr;
      }

      .animated-disclosure--transform {
        transform: translateY(-100%);
        transition: transform var(--animated-disclosure--transition-length) var(--animated-disclosure--transition-timing), visibility 0s var(--animated-disclosure--transition-length) var(--animated-disclosure--transition-timing);
      }

      [data-animate-open] .animated-disclosure--transform {
        transform: translateY(0);
        transition: transform var(--animated-disclosure--transition-length) var(--animated-disclosure--transition-timing), visibility 0s linear;
      }

      .animated-disclosure--animation {
        min-height: 0;
      }
    `

    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(css)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
  }
}
