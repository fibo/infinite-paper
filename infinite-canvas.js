'use strict';

(function() {
const infiniteCanvasTemplate = document.createElement('template');
infiniteCanvasTemplate.innerHTML = `
<style>
  :host {
    background-color: var(--infinite-canvas-background-color, #fefefe);
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }
</style>
`;

class InfiniteCanvas extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(infiniteCanvasTemplate.content.cloneNode(true));
  }
  connectedCallback() {
    this.addEventListener('pointerdown', this.handlePointerdown);
    this.addEventListener('pointermove', this.handlePointermove);
    this.addEventListener('pointerup', this.handlePointerup);
  }
  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.handlePointerdown);
    this.removeEventListener('pointermove', this.handlePointermove);
    this.removeEventListener('pointerup', this.handlePointerup);
  }
  handlePointerdown(event) {
    const { clientX, clientY } = event
    const x = Math.round(clientX)
    const y = Math.round(clientY)

    this.isDragging = true
    this.pointerCoordinates = { x, y }
  }
  handlePointermove(event) {
    const {
      isDragging,
      origin = { x: 0, y: 0 },
      pointerCoordinates
    } = this
    const { clientX, clientY } = event
    const x = Math.round(clientX)
    const y = Math.round(clientY)

    if (isDragging) {
      // 1. Translate origin.
      this.origin = {
        x: origin.x - pointerCoordinates.x + x,
        y: origin.y - pointerCoordinates.y + y
      }
      // 2. Update pointer coordinates.
      this.pointerCoordinates = { x, y }
    }
  }
  handlePointerup() {
    this.isDragging = false
  }
}

customElements.define('infinite-canvas', InfiniteCanvas);
})();
