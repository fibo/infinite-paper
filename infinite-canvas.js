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
  ::slotted(window-frame) {
    position: absolute;
  }
</style>
<slot></slot>
`;

  this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
}

static get scalePrecision () {
  return 3;
}

static get observedAttributes() {
  return ['scale'];
}

attributeChangedCallback(name, oldValue, newValue) {
  switch (name) {
    case 'scale': {
      this.querySelectorAll(':scope > window-frame').forEach((element) => {
        const width = element.getAttribute('width');
        const height = element.getAttribute('height');

        element.style.width = `${Math.round(width * newValue)}px`;
        element.style.height = `${Math.round(height * newValue)}px`;
      })
      break;
    }
  }
}

connectedCallback() {
  // Disable scroll.
  document.body.style.overflow = 'hidden';

  this.addEventListener('pointerdown', this.onPointerdown);
  this.addEventListener('pointermove', this.onPointermove);
  this.addEventListener('pointerup', this.onPointerup);
  this.addEventListener('wheel', this.onWheel);
}

disconnectedCallback() {
  this.removeEventListener('pointerdown', this.onPointerdown);
  this.removeEventListener('pointermove', this.onPointermove);
  this.removeEventListener('pointerup', this.onPointerup);
}

onPointerdown(event) {
  const { clientX, clientY } = event;
  const x = Math.round(clientX);
  const y = Math.round(clientY);

  this.isDragging = true;
  this.pointerCoordinates = { x, y };
}

onPointermove(event) {
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

onPointerup() {
  this.isDragging = false;
}

onWheel(event) {
  this.scale = this.scale - event.deltaY * Math.pow(10, -InfiniteCanvas.scalePrecision);
}

get scale() {
  return Number(this.getAttribute('scale')) || 1;
}

set scale(value) {
  if (value > 0) {
    this.setAttribute('scale', Number(value.toFixed(InfiniteCanvas.scalePrecision)));
  }
}
});

/**
 * WindowFrame
 */
customElements.define('window-frame', class WindowFrame extends HTMLElement {
constructor() {
  super();

  const template = document.createElement('template');
  template.innerHTML = `
<style>
  :host {
    box-shadow: 1px 1px 7px 1px var(
      --window-frame-box-shadow-color, rgba(0, 0, 0, 0.17)
    );
  }
</style>

<iframe width="100%" height="100%" frameborder="0"></iframe>
`;

  this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
}

static get observedAttributes() {
  return [
    /* position */
    'top', 'left',
    /* dimension */
    'width', 'height',
    /* iframe URL */
    'src'
  ];
}

attributeChangedCallback(name, oldValue, newValue) {
  switch (name) {
    case 'top':
    case 'left': {
      const num = Math.round(newValue);

      if (typeof num === 'number') {
        this.style[name] = `${num}px`;
      }

      break;
    }

    case 'width':
    case 'height': {
      const { scale } = this;

      const num = Math.round(newValue * scale);

      if (typeof num === 'number' && num >= 0) {
        this.style[name] = `${num}px`;
      }

      break;
    }

    case 'src': {
      this.iframe.src = newValue;
      break;
    }
  }
}

get canvas() {
  const { parentNode } = this;

  if (parentNode) {
    if (parentNode.tagName === 'INFINITE-CANVAS') {
      return parentNode;
    }
  }
}

get iframe() {
  return this.shadowRoot.querySelector('iframe');
}

get scale() {
  const { canvas } = this;

  if (canvas) {
    return Number(canvas.getAttribute('scale')) || 1;
  } else {
    return 1;
  }
}
});
