# Poster API (`@poster/core`)

Components are provided inside the sandbox runtime (`public/sandbox/runtime.js`). Import them in your poster code:

```tsx
import { Poster, Box, Text, Stack, Grid } from "@poster/core";
```

## Layout

| Component | Description                                |
| --------- | ------------------------------------------ |
| `Poster`  | Root canvas wrapper                        |
| `Box`     | Generic container                          |
| `Stack`   | Flex column/row stack (`gap`, `direction`) |
| `Grid`    | CSS grid (`cols`, `gap`)                   |
| `Divider` | Horizontal rule                            |

## Typography & media

| Component | Description                             |
| --------- | --------------------------------------- |
| `Text`    | Styled text (`size`, `weight`, `color`) |
| `Image`   | `<img>` with object-fit helpers         |
| `Logo`    | Brand mark from the project logo asset  |
| `Icon`    | Lucide-style icon placeholder           |
| `Badge`   | Small label chip                        |
| `Button`  | Styled button                           |

### Brand logo

Upload a logo from the header **Logo** control. By default the sandbox overlays it in a corner (`logoSlot`: TL / TR / BL / BR + max height).

For in-layout placement, import `Logo` (or use `assets.logo`):

```tsx
import { Poster, Logo } from "@poster/core";

export default function App() {
  return (
    <Poster>
      <div className="absolute top-10 left-10">
        <Logo maxHeight={48} />
      </div>
      {/* ... */}
    </Poster>
  );
}
```

When `<Logo` appears in your code, the automatic corner overlay is skipped so the mark is not drawn twice. The compile scope also exposes an `assets` object (`assets.logo?.dataUrl`) for custom `<Image src={assets.logo.dataUrl} />` usage.


### Default fonts

The sandbox loads **IBM Plex Sans** (Latin) and **Kantumruy Pro** (Khmer). Khmer characters use Kantumruy Pro by default unless you set your own `font-family` via `style`, a Tailwind `font-*` class, or a custom `@font-face`.

```tsx
{/* Uses default stack (Kantumruy Pro for Khmer) */}
<Text>សួស្តី · Hello</Text>

{/* Override */}
<p style={{ fontFamily: '"Noto Sans Khmer", sans-serif' }}>សួស្តី</p>
```

## Shapes

| Component | Description                |
| --------- | -------------------------- |
| `Shape`   | Rectangle with fill/stroke |
| `Circle`  | Circle/ellipse             |
| `Line`    | SVG line                   |

## Data visualization

| Component   | Description                         |
| ----------- | ----------------------------------- |
| `BarChart`  | Bar chart from `{ label, value }[]` |
| `LineChart` | Line chart                          |
| `PieChart`  | Pie/donut chart                     |
| `Progress`  | Progress bar                        |
| `Metric`    | Large number + label                |
| `Table`     | Simple data table                   |

## Utilities

| Component | Description               |
| --------- | ------------------------- |
| `QRCode`  | Decorative QR placeholder |

Plain HTML elements and Tailwind classes also work inside the poster root.
