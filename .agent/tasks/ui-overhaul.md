# 🎯 PoundTrades Premium UI Overhaul

## Mission
Transform PoundTrades into a multimillion-pound looking app with premium black + gold branding.

---

## 🔥 CRITICAL BLOCKERS (Fix First)

| ID | Issue | Owner | Status |
|----|-------|-------|--------|
| B1 | Web bundling CSS error (lucide-react-native color prop) | Eddie | ⏳ In Progress |
| B2 | `hooks/useTheme.tsx` needs to import from `src/hooks/useTheme.tsx` | Eddie | 🔴 Pending |

---

## 📋 TASK BREAKDOWN

### Phase 1: Foundation (Theme + Icons)
| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| T1.1 | Sync root `hooks/useTheme.tsx` with new `src/hooks/useTheme.tsx` | P0 | 🔴 |
| T1.2 | Create Icon wrapper for web-compatible lucide icons | P0 | ✅ Done |
| T1.3 | Update `_layout.tsx` to use new theme colors | P1 | 🔴 |

### Phase 2: Core Components
| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| T2.1 | Overhaul Login screen - premium black + gold | P1 | 🔴 |
| T2.2 | Overhaul Hero component - bold, elite | P1 | 🔴 |
| T2.3 | Overhaul ListingCard - dark cards, gold accents | P1 | 🔴 |
| T2.4 | Overhaul CategoryGrid - premium feel | P1 | 🔴 |

### Phase 3: Screens
| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| T3.1 | Home screen redesign | P2 | 🔴 |
| T3.2 | Listings screen redesign | P2 | 🔴 |
| T3.3 | Profile screen redesign | P2 | 🔴 |
| T3.4 | Listing detail page redesign | P2 | 🔴 |

### Phase 4: Polish
| Task | Description | Priority | Status |
|------|-------------|----------|--------|
| T4.1 | Tab bar - true black with gold indicators | P2 | 🔴 |
| T4.2 | Splash screen - black + gold logo | P3 | 🔴 |
| T4.3 | Add gold glow animations | P3 | 🔴 |

---

## 🎨 Design Specs (from Brand Guidelines)

**Colors:**
- Background: `#000000` (true black)
- Cards: `#0A0A0A` (charcoal)
- Primary/CTA: `#FFD700` (gold)
- Text: `#FFFFFF` (white)
- Secondary text: `#A3A3A3`

**Typography:**
- Headlines: Extra bold (800-900), tight letter-spacing
- All CAPS for CTAs
- Large, bold price displays

---

## ⏱️ Execution Order

1. **NOW**: Fix theme sync + bundling issues
2. **THEN**: Update login + hero + listing cards
3. **FINALLY**: Polish all screens

---

*Created: 2026-01-29 15:49*
