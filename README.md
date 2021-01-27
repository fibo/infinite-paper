# infinite-paper

> is a Web Component

[Usage](#usage) |
[API](#api) |
[License](#license) |

## Usage

Import it, for instance using a CDN

```html
<script src="https://unpkg.com/infinite-paper"></script>
```

Add a single *infinite-paper*: it will disable scroll and fill the whole viewport.
Put also some *window-frame*, for example

```html
<infinite-paper>
  <window-frame
    top="10"
    left="10"
    width="200"
    height="400"
    src="https://www.npmjs.com/package/infinite-paper"
  ></window-frame>
</infinite-paper>
```

## API

### `<infinite-paper>`

HTML attributes:

* *scale*: `Number`

CSS variables:

* *--infinite-paper-background-color*: `#fefefe`

### `<window-frame>`

HTML attributes:

* *top*: `Number`
* *left*: `Number`
* *width*: `Number`
* *height*: `Number`
* *src*: `String`

CSS variables:

* *--window-frame-box-shadow-color*: `rgba(0, 0, 0, 0.17)`

## License

[MIT](http://g14n.info/mit-license)
