# PoundTrades Brand Guidelines
## Premium Surplus Building Materials Marketplace

---

## 🎯 Brand Vision

**PoundTrades** is a multimillion-pound marketplace for surplus building materials. The brand communicates:
- **Trust & Authority**: Established, professional, reliable
- **Premium Value**: High-quality materials at smart prices  
- **Industrial Strength**: Built to last, no-nonsense, gets the job done
- **Modern Excellence**: Cutting-edge tech meets construction industry

---

## 🎨 Color Palette

### Primary Colors (Dark Foundation)
| Token | Hex | Usage |
|-------|-----|-------|
| `black` | `#000000` | True black for deepest backgrounds |
| `richBlack` | `#040404` | Primary app background |
| `charcoal` | `#0A0A0A` | Card backgrounds, elevated surfaces |
| `graphite` | `#141414` | Secondary surfaces, input fields |
| `slate` | `#1A1A1A` | Tertiary surfaces, borders |

### Accent Colors (Gold System)
| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#FFD700` | Primary CTA, important actions |
| `goldLight` | `#FFDF33` | Hover states, highlights |
| `goldDim` | `#B8860B` | Disabled gold elements |
| `amber` | `#FFA500` | Secondary accent, warnings |
| `bronze` | `#CD7F32` | Tertiary accent, badges |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `textPrimary` | `#FFFFFF` | Headings, primary text |
| `textSecondary` | `#A3A3A3` | Body text, descriptions |
| `textMuted` | `#666666` | Placeholders, disabled text |
| `textGold` | `#FFD700` | Accent text, prices |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10B981` | Success states, available |
| `error` | `#EF4444` | Errors, sold out |
| `warning` | `#F59E0B` | Warnings, attention |
| `info` | `#3B82F6` | Information, blue accents |

---

## 📝 Typography

### Font Family
- **Primary**: `Inter` (clean, modern, highly legible)
- **Display**: `Inter Black` / `Inter ExtraBold` for headlines
- **Fallback**: `SF Pro Display`, `Roboto`, `system-ui`

### Type Scale
| Name | Size | Weight | Use |
|------|------|--------|-----|
| `display` | 48px | 900 | Hero headlines |
| `h1` | 32px | 800 | Page titles |
| `h2` | 24px | 700 | Section headings |
| `h3` | 20px | 700 | Card titles |
| `body` | 16px | 400 | Body text |
| `bodyBold` | 16px | 600 | Emphasized body |
| `caption` | 14px | 500 | Captions, metadata |
| `small` | 12px | 400 | Fine print |

### Typography Rules
- Headlines: Tight letter-spacing (-0.5 to -1px)
- All caps for CTAs and badges
- High contrast white text on dark backgrounds

---

## 🔲 Spacing & Layout

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Small gaps |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Hero sections |
| `3xl` | 64px | Major sections |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0 | Sharp edges (industrial feel) |
| `sm` | 4px | Subtle rounding |
| `md` | 8px | Standard corners |
| `lg` | 12px | Cards, buttons |
| `xl` | 16px | Large cards |
| `full` | 9999px | Pills, avatars |

---

## ✨ Visual Effects

### Shadows (Gold Glow)
```css
/* Card Shadow */
box-shadow: 0 4px 24px rgba(255, 215, 0, 0.1);

/* Elevated Shadow */
box-shadow: 0 8px 32px rgba(255, 215, 0, 0.15);

/* CTA Glow */
box-shadow: 0 0 24px rgba(255, 215, 0, 0.4);
```

### Gradients
```css
/* Gold Gradient (CTAs) */
background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);

/* Dark Gradient (Overlays) */
background: linear-gradient(180deg, transparent 0%, #000000 100%);

/* Premium Shimmer */
background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
```

### Borders
```css
/* Subtle Gold Border */
border: 1px solid rgba(255, 215, 0, 0.2);

/* Active Gold Border */
border: 2px solid #FFD700;
```

---

## 🎯 Component Patterns

### Buttons
- **Primary**: Gold background, black text, bold weight
- **Secondary**: Transparent with gold border
- **Ghost**: No border, gold text on hover

### Cards
- Rich black background (#0A0A0A)
- Subtle gold glow on hover
- Sharp or slightly rounded corners
- Gold accent elements (price, badges)

### Inputs
- Graphite background (#141414)
- Slate borders (#1A1A1A)
- White text, muted placeholders
- Gold focus ring

### Navigation
- True black tab bar
- Gold active indicator
- White icons, gold when active

---

## 💎 Brand Voice

### Tone
- **Confident**: We know our industry
- **Direct**: No fluff, straight to the point
- **Premium**: Quality without pretension
- **Trustworthy**: Reliable, professional

### Copy Examples
- "Quality materials. Smart prices."
- "The UK's premium surplus marketplace"
- "Built different."
- "Unlock this deal for just £1"

---

## 📱 App-Specific Guidelines

### Splash/Launch Screen
- True black background
- Gold PoundTrades logo (centered)
- Subtle gold particle animation

### Tab Bar
- True black background
- Gold active indicator (line or fill)
- 5 tabs: Home, Listings, Map, + (Create), Profile

### Listing Cards
- Dark card with gold price badge
- High-quality image taking 60% of card
- Bold white title, muted description
- Gold "£1 to unlock" button

---

*Last updated: January 2026*
*Version: 2.0 - Premium Rebrand*
