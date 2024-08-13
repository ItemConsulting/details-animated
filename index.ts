import {StateMachine} from "./StateMachine";

type DetailsAnimatedStates = "closed" | "opening" | "open" | "closing";
type Actions = "openWithAnimation"  | "closeWithAnimation" | "removeAttributeOpen";

export default class DetailsAnimated extends HTMLElement {
  declare detailsEl: HTMLDetailsElement | null;
  declare bodyEls: ChildNode[];
  declare stateMachine: StateMachine<DetailsAnimatedStates, Actions>;

  connectedCallback(): void {
    this.detailsEl = this.querySelector(":scope > details");
    const summaryEl = this.detailsEl?.querySelector(":scope > summary") ?? null;

    if (this.detailsEl && summaryEl) {
      this.setupDom();

      this.stateMachine = new StateMachine<DetailsAnimatedStates, Actions>({
        initState: "closed",
        states: {
          closed: {
            click: {
              to: "opening",
              actions: ["openWithAnimation"]
            }
          },
          opening: {
            done: {
              to: "open",
            },
            click: {
              to: "closing",
              actions: ["closeWithAnimation"]
            }
          },
          open: {
            click: {
              to: "closing",
              actions: ["closeWithAnimation"]
            }
          },
          closing: {
            done: {
              to: "closed",
              actions: ["removeAttributeOpen"]
            },
            click: {
              to: "opening",
              actions: ["openWithAnimation"]
            }
          },
        },
        actions: {
          openWithAnimation: this.openWithAnimation.bind(this),
          closeWithAnimation: this.closeWithAnimation.bind(this),
          removeAttributeOpen: this.removeAttributeOpen.bind(this)
        }
      });

      summaryEl.addEventListener("click", (event) => {
        if (this.isOpen()) {
          event.preventDefault();
        }
        this.stateMachine.emit("click");
      });

      this.detailsEl?.addEventListener("transitionend", () => this.stateMachine.emit("done"));

      this.addStylesToPage()
    }
  }

  openWithAnimation(): void {
    // Firefox 126 doesn't animate without the setTimeout
    setTimeout(() => {
      this.detailsEl?.setAttribute("data-animate-open", "");
    }, 0);
  }

  closeWithAnimation(): void {
    this.detailsEl?.removeAttribute("data-animate-open");
  }

  removeAttributeOpen() {
    this.detailsEl?.removeAttribute("open");
  }

  isOpen(): boolean {
    return this.detailsEl?.hasAttribute("open") ?? true;
  }

  setupDom() {
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

    if (this.isOpen()) {
      this.detailsEl?.setAttribute("data-animate-open", "");
    }
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
