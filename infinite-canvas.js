/**
 * InfiniteCanvas
 */
customElements.define('infinite-canvas', class InfiniteCanvas extends HTMLElement {
constructor() {
  super();

  const template = document.createElement('template');
  template.innerHTML = `
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

  this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
}

static get observedAttributes() {
  return ['readonly'];
}

attributeChangedCallback(name, oldValue, newValue) {
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
  const { clientX, clientY } = event;
  const x = Math.round(clientX);
  const y = Math.round(clientY);

  this.isDragging = true;
  this.pointerCoordinates = { x, y };
}

handlePointermove(event) {
  const {
    isDragging,
    origin = { x: 0, y: 0 },
    pointerCoordinates
  } = this;
  const { clientX, clientY } = event;
  const x = Math.round(clientX);
  const y = Math.round(clientY);

  if (isDragging) {
    // 1. Translate origin.
    this.origin = {
      x: origin.x - pointerCoordinates.x + x,
      y: origin.y - pointerCoordinates.y + y
    };
    // 2. Update pointer coordinates.
    this.pointerCoordinates = { x, y };
  }
}

handlePointerup() {
  this.isDragging = false;
}

get readonly() {
  return this.hasAttribute('readonly')
}

set readonly(value) {
  if (value) {
    this.setAttribute('readonly', '')
  } else {
    this.removeAttribute('readonly')
  }
}
});
