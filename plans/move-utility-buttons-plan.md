# Plan Context: Move utility buttons before navbar-toggler

## 🧾 Metadata
- **Status:** `completed`
- **Started:** 2026-06-20
- **Target Branch:** (current working branch)

## 🧠 Summary
ย้ายปุ่ม `theme-toggle` และ `lang-switcher` ออกจากเมนู collapse ไปวางก่อนปุ่ม `navbar-toggler` (hamburger) เพื่อให้ผู้ใช้สามารถสลับธีมและภาษาได้โดยตรงจากแถบนำทาง โดยไม่ต้องกดเปิดเมนูมือถือ

## 🔍 Key Decisions
- **Decision 1:** ใช้ `<div class="navbar-utility">` เป็น wrapper — Rationale: ต้องการ container ที่ไม่ใช่ `<li>` (เพราะย้ายออกจาก `<ul>`) และต้องการ `display: flex` เพื่อจัดเรียง theme + lang ในแนวนอน
- **Decision 2:** ใช้ `margin-left: auto` แทน Bootstrap utility `ms-auto` — Rationale: เพื่อให้ควบคุม margin ใน CSS รวมศูนย์ และเข้ากับ media query ได้ง่าย
- **Decision 3:** เพิ่ม class `dropdown-menu-end` ให้ dropdown menu — Rationale: ตำแหน่งใหม่ของ lang-switcher อยู่ใกล้ขอบขวาจอ เมนูควรชิดขวาเพื่อไม่ให้ล้นจอ
- **Decision 4:** เปลี่ยน `<li class="nav-item dropdown lang-switcher">` → `<div class="dropdown lang-switcher">` — Rationale: `<li>` ใช้ได้ภายใน `<ul>` เท่านั้น เมื่อย้ายออกมาเป็น sibling ของ toggler ต้องเปลี่ยนเป็น `<div>` และใช้ `.dropdown` class เพื่อรักษา `position: relative` ให้ Bootstrap dropdown.js ทำงาน

## 🔗 Related Files
- `index.html` — โครงสร้าง navbar (บรรทัด ~58-122)
- `styles.css` — styles สำหรับ `.aurora-toggler`, `.theme-toggle`, `.lang-switcher`, `.aurora-dropdown`
- `script.js` — handlers สำหรับ `#themeToggle` และ `#langDropdown` (ไม่ต้องแก้ — ใช้ id เดิม)

## 🧩 Architecture / Flow

### โครงสร้างใหม่
```html
<div class="container">
  <a class="navbar-brand aurora-brand">...</a>

  <!-- NEW: utility actions (theme + lang) -->
  <div class="navbar-utility d-flex align-items-center">
    <button id="themeToggle" class="theme-toggle">...</button>
    <div class="dropdown lang-switcher">
      <a id="langDropdown" data-bs-toggle="dropdown">...</a>
      <ul class="dropdown-menu aurora-dropdown dropdown-menu-end">...</ul>
    </div>
  </div>

  <button class="navbar-toggler aurora-toggler">...</button>

  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ms-auto align-items-lg-center">
      <!-- theme + lang ถูกลบออกจากตรงนี้ -->
      <li>Features</li>
      <li>Pricing</li>
      <li>Partners</li>
      <li>Sign up</li>
    </ul>
  </div>
</div>
```

### Visual Layout

**Mobile (≤991.98px) — collapse ปิด:**
```
[Brand] ............ [Theme] [Lang] [Toggler]
```

**Mobile (≤991.98px) — collapse เปิด:**
```
[Brand] ............ [Theme] [Lang] [Toggler]
┌──────────────────────────────────────┐
│  Features / Pricing / Partners / Sign up │
└──────────────────────────────────────┘
```

**Desktop (≥992px):**
```
[Brand] [Features] [Pricing] [Partners] [Sign up] [Theme] [Lang]
```

## ⚠️ Known Risks / Blockers
- **Risk:** Dropdown menu อาจล้นจอทางขวา — Mitigation: ใช้ `dropdown-menu-end`
- **Risk:** บน mobile ปุ่ม utility อาจเบียดกับ toggler — Mitigation: เพิ่ม `margin-right: 0.5rem` ใน mobile media query
- **Risk:** Bootstrap dropdown.js ต้องการ parent `.dropdown` (position: relative) — Mitigation: ใช้ `<div class="dropdown lang-switcher">` เพื่อรักษา class นี้

## 📝 Progress Log
- `[2026-06-20]` — สำรวจโครงสร้างปัจจุบันและ CSS ที่เกี่ยวข้องแล้ว
- `[2026-06-20]` — สร้าง checklist และ plan context files
- `[2026-06-20]` — เริ่มแก้ไข HTML

## 🔮 Next Steps
- [ ] แก้ไข `index.html` — ย้าย theme-toggle + lang-switcher ออกจาก navbar-collapse
- [ ] เพิ่ม CSS สำหรับ `.navbar-utility` ใน `styles.css`
- [ ] ทดสอบบน mobile + desktop
