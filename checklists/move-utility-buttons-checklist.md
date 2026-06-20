# Scope Checklist: Move utility buttons before navbar-toggler

## 🎯 เป้าหมาย (Goal)
ย้ายปุ่ม `theme-toggle` และ `lang-switcher` ออกจาก `<div class="collapse navbar-collapse">` ไปไว้ในตำแหน่ง "ก่อน" ปุ่ม `navbar-toggler` (hamburger) ในแถบ navbar เพื่อให้ผู้ใช้เข้าถึงได้โดยไม่ต้องเปิดเมนู collapse

## ✅ Scope Checklist

### Phase 1: เตรียมการ (Preparation)
- [x] Task 1.1 — อ่านโครงสร้างปัจจุบันของ navbar ใน `index.html`
- [x] Task 1.2 — ตรวจสอบ CSS ที่เกี่ยวข้อง (`.aurora-toggler`, `.theme-toggle`, `.lang-switcher`, `.aurora-dropdown`)

### Phase 2: แก้ไข HTML (`index.html`)
- [x] Task 2.1 — เพิ่ม `<div class="navbar-utility d-flex align-items-center">` ก่อน `<button class="navbar-toggler aurora-toggler">`
- [x] Task 2.2 — ย้าย theme-toggle button เข้าไปใน utility wrapper
- [x] Task 2.3 — ย้าย lang-switcher เข้าไปใน utility wrapper (เปลี่ยน `<li>` → `<div class="dropdown lang-switcher">`)
- [x] Task 2.4 — ลบ `<li>` ของ theme-toggle และ lang-switcher ออกจาก `<ul class="navbar-nav">`
- [x] Task 2.5 — เพิ่ม class `dropdown-menu-end` ให้ dropdown menu เพื่อให้เมนู dropdown ชิดขวา

### Phase 3: เพิ่ม CSS (`styles.css`)
- [x] Task 3.1 — เพิ่ม base styles สำหรับ `.navbar-utility` (flex, gap, `order: 3`)
- [x] Task 3.2 — เพิ่ม `order: 4` ให้ `.aurora-toggler` เพื่อให้ toggler อยู่ขวาสุด
- [x] Task 3.3 — เพิ่ม mobile media query: `margin-left: auto`, `margin-right: 0.5rem`
- [x] Task 3.4 — เพิ่ม desktop media query: `margin-left: 0.5rem` (gap จาก menu items)

### Phase 4: ตรวจสอบผลลัพธ์
- [x] Task 4.1 — เปิดหน้าเว็บ ตรวจ mobile view (≤991.98px) — utility อยู่ระหว่าง brand กับ toggler ✓
- [x] Task 4.2 — ตรวจ desktop view (≥992px) — utility อยู่ขวาสุด ถัดจากเมนู ✓
- [x] Task 4.3 — ตรวจการทำงานของ theme toggle และ language dropdown — ทั้งคู่ทำงานปกติ ✓
- [x] Task 4.4 — ตรวจ floating pill state (is-scrolled) — layout ยังคงถูกต้อง ✓

## 🚫 Out of Scope
- การเปลี่ยน visual design ของปุ่ม theme-toggle หรือ lang-switcher
- การ refactor โครงสร้าง navbar ทั้งหมด
- การเปลี่ยน behavior ของ dropdown (ยังคงใช้ Bootstrap dropdown)

## 📌 Notes
- การย้าย lang-switcher ออกจาก `.navbar-nav` ต้องเปลี่ยน `<li>` → `<div>` เพราะ `<li>` ใช้ภายใน `<ul>` เท่านั้น
- `aria-labelledby="langDropdown"` และ `id="langDropdown"` ต้องคงไว้เพื่อให้ a11y ทำงานถูกต้อง
- `data-bs-toggle="dropdown"` ทำงานได้กับ parent ที่เป็น `.dropdown` เท่านั้น — ต้องใช้ `<div class="dropdown lang-switcher">` แทน `<li>`
- ใช้ `margin-left: auto` เพื่อ push utility (และ toggler ที่อยู่ถัดไป) ไปทางขวา
