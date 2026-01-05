# GSM Flow Design System: Cyan Technical Brand
This document outlines the visual identity and structural patterns used in the GSM Flow SaaS platform.
## 1. Color Palette (HSL)
The design system is built on a high-contrast Cyan scale optimized for both light and dark modes.
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `primary` | `181 100% 25%` | Brand color, primary actions, active states. |
| `background` | `0 0% 100%` / `222 47% 3%` | Page surface. |
| `foreground` | `222 47% 11%` / `210 40% 98%` | Primary text. |
| `muted` | `210 40% 96%` / `217 33% 10%` | Secondary backgrounds, dividers. |
## 2. Custom CSS Utilities
We extend Tailwind CSS with technical aesthetic utilities defined in `src/index.css`:
### Gradients
- `.btn-gradient`: `linear-gradient(135deg, #0891b2 0%, #0e7490 100%)` - Used for primary call-to-action buttons.
- `.text-gradient`: `linear-gradient(90deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)` - For hero headlines and emphasis.
### Surfaces & Depth
- `.glass`: Backdrop-blur effect (`50%` opacity background with `md` blur) for cards and overlays.
- `.shadow-glow`: Cyan outer glow (`0 0 20px -5px rgba(6, 182, 212, 0.4)`) to highlight active technical components.
## 3. Motion & Keyframes
GSM Flow uses subtle micro-interactions to convey system vitality:
- `float`: Vertical translation (10px) for floating icons.
- `fade-in`: `0.4s` entry transition with a small `Y` offset (8px).
- `cyan-glow`: A `3s` pulsing box-shadow for background indicators.
## 4. Layout Patterns
### Main Container
All public pages must wrap content in:
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
  {/* Content */}
</div>
```
### Grid Strategy
- **Mobile First**: Use single-column layouts.
- **Data Density**: Transition to `grid-cols-2` at `md` and `grid-cols-4` at `lg` for stat cards.
- **Dashboard Sidebar**: Collapses to an icon-only rail on desktop and shifts to a bottom/side mobile overlay.
## 5. Component Usage
- **Icons**: Strictly `lucide-react`. Use consistent sizes: `w-4 h-4` for inline text, `w-5 h-5` for headers.
- **Badges**: Use `variant="outline"` with uppercase `text-[10px]` for technical metadata.