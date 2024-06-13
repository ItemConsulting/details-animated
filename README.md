# Custom component for animating details/summary elements

## Usage

Register the custom element with JavaScript.

```javascript
import DetailsAnimated from "@itemconsulting/details-animated";

if (!window.customElements.get("details-animated")) {
  window.customElements.define("details-animated", DetailsAnimated);
}
```

Use the custom element to wrap a `<details>`/`<summary`.

```html
<details-animated>
  <details>
    <summary>Open this nice animated disclosure</summary>
    
    This part here will animate in nicely!
  </details>
</details-animated>
```
