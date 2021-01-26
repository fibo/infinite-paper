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
    width: var(--infinite-canvas-width, 100vw);
    height: var(--infinite-canvas-width, 100vh);
  }
  ::slotted(window-frame) {
    position: absolute;
  }
</style>
<slot></slot>
`;

  this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
}

static get observedAttributes() {
  return ['readonly'];
}

attributeChangedCallback(name, oldValue, newValue) {
}

connectedCallback() {
  this.addEventListener('pointerdown', this.onPointerdown);
  this.addEventListener('pointermove', this.onPointermove);
  this.addEventListener('pointerup', this.onPointerup);
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

get readonly() {
  return this.hasAttribute('readonly')
}
set readonly(value) {
  const isReadonly = Boolean(value);
  if (isReadonly) {
    this.setAttribute('readonly', '')
  } else {
    this.removeAttribute('readonly')
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

<iframe width="375" height="812" frameborder="0" src="pages/welcome.html"></iframe>
`;

  this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));
}

static get observedAttributes() {
  return ['top', 'left', 'width', 'height', 'src'];
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
      const num = Math.round(newValue);

      if (typeof num === 'number' && num >= 0) {
        this.iframe[name] = num;
      }

      break;
    }
    case 'src': {
      this.iframe.src = newValue;
      break;
    }
  }
}

get iframe() {
  return this.shadowRoot.querySelector('iframe');
}
});
