# Agent Builder Front-end Audit — فایل 6/8 — موارد 251 تا 300

این فایل برای agent اجرایی نوشته شده است. هر مورد باید به همین ترتیب انجام شود: اول تست fail-first، بعد پیاده‌سازی، بعد اجرای QA command. هدف فقط رفع باگ نیست؛ باید ظاهر، نور، رنگ، دکمه‌ها، المان‌ها، accessibility و پایداری فرانت‌اند هم اصلاح شود.

## قانون کلی برای agent

- هیچ رنگ inline جدید ننویس. اول token بساز، بعد از token استفاده کن.
- هیچ `any` جدید اضافه نکن. اگر مجبور شدی، قبل از پایان همان task حذفش کن.
- هر button باید default/hover/focus/active/disabled/loading داشته باشد.
- هر form field باید label واقعی، error state، `aria-invalid` و تست interaction داشته باشد.
- هر modal/dialog باید focus trap، Escape close، overlay behavior کنترل‌شده و تست keyboard داشته باشد.
- هر تغییر باید با حداقل یک تست fail-first همراه باشد.
- بعد از هر ۵۰ مورد، این دستور را اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`.

## پیش‌نیاز تست‌نویسی برای کل پروژه

اگر هنوز setup نشده، agent باید در اولین PR تست این موارد را اضافه کند:

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe axe-core @playwright/test
```

`package.json` باید حداقل این scriptها را داشته باشد:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "qa": "npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e"
  }
}
```

---


## 251. Autoplay progress با setInterval drift دارد

**دسته:** Timing  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** به جای rAF/time based از increment ثابت استفاده شده.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/251-autoplay-progress-setinterval-drift.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/251-autoplay-progress-setinterval-drift.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 252. filmstrip drag mouse-only است

**دسته:** Interaction  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** Pointer events unified نیستند.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/252-filmstrip-drag-mouse-only.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/252-filmstrip-drag-mouse-only.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 253. filmstrip scrollIntoView block فقط nearest است

**دسته:** UX  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** inline/scroll alignment دقیق نیست.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/253-filmstrip-scrollintoview-block-nearest.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/253-filmstrip-scrollintoview-block-nearest.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 254. filmstrip thumbnails img raw هستند

**دسته:** Image  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** Next Image، sizes و dimensions ندارند.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/254-filmstrip-thumbnails-img-raw.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/254-filmstrip-thumbnails-img-raw.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 255. main image zoom فقط scale است

**دسته:** UX  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** pan در zoom وجود ندارد و تصویر از viewport بیرون می‌زند.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/255-main-image-zoom-scale.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/255-main-image-zoom-scale.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 256. zoom state با navigation reset نمی‌شود

**دسته:** UX  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** روی عکس بعدی ممکن است zoomed باقی بماند.

### راه‌حل اجرایی برای agent

1) state mutation را command-based کن. برای هر عمل editor یک action مشخص بساز: `addNodeCommand`, `updateNodeDataCommand`, `connectNodesCommand`, `deleteSelectionCommand`.
2) history را deep-clone یا immutable snapshot کن و drag/typing را batch/debounce کن. selection-only changes نباید وارد undo stack شوند.
3) `selectedNodeId` و `node.selected` را یکی کن یا با یک sync layer قطعی مدیریت کن.
4) برای state مشتق مثل `canUndo/canRedo` getter/selector بساز، نه state دستی که ممکن است stale شود.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/256-zoom-state-navigation-reset.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/256-zoom-state-navigation-reset.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 257. Share button action ندارد

**دسته:** Product  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** Share فقط button نمایشی است.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/257-share-button-action.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/257-share-button-action.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 258. Download 4K action ندارد

**دسته:** Product  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** دکمه دانلود کاری انجام نمی‌دهد.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/258-download-4k-action.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/258-download-4k-action.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 259. Start Collaboration action ندارد

**دسته:** Product  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** CTA فقط visual است.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/259-start-collaboration-action.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/259-start-collaboration-action.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 260. copyPrompt clipboard catch ندارد

**دسته:** Robustness  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** خطای clipboard مدیریت نمی‌شود.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/260-copyprompt-clipboard-catch.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/260-copyprompt-clipboard-catch.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 261. download format روی خروجی اثر ندارد

**دسته:** UX  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** PNG/JPG/WEBP/RAW فقط state هستند.

### راه‌حل اجرایی برای agent

1) برای هر panel یک schema validation اضافه کن؛ پیشنهاد: `zod` یا یک validator سبک داخلی. خطاها باید زیر همان field با متن کوتاه و رنگ semantic danger نمایش داده شوند.
2) componentهای مشترک `Field`, `TextInput`, `Textarea`, `Select`, `SegmentedControl`, `RangeField` بساز و همه labelها را با `htmlFor/id` متصل کن.
3) update store را debounce یا onBlur کن تا هر keypress history نسازد.
4) invalid state باید هم visual باشد هم قابل خواندن توسط screen reader: `aria-invalid`, `aria-describedby`, error id.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/261-download-format.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/261-download-format.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 262. Team member tooltip hover-only است

**دسته:** A11y  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** keyboard/touch tooltip ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/262-team-member-tooltip-hover-only.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/262-team-member-tooltip-hover-only.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 263. Filmstrip z-index با command palette conflict می‌کند

**دسته:** Layering  
**محل/شاهد:** `FilmstripModal.tsx + marketplace`  
**مشکل:** هر دو z-50/65 دارند بدون scale رسمی.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/263-filmstrip-z-index-command-palette-confli.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx + marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/263-filmstrip-z-index-command-palette-confli.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 264. Filmstrip mobile layout panel 340px ممکن است cramped شود

**دسته:** Responsive  
**محل/شاهد:** `FilmstripModal.tsx`  
**مشکل:** w-full md:w-[340px] در h[88vh] ممکن است بد شود.

### راه‌حل اجرایی برای agent

1) برای هر panel یک schema validation اضافه کن؛ پیشنهاد: `zod` یا یک validator سبک داخلی. خطاها باید زیر همان field با متن کوتاه و رنگ semantic danger نمایش داده شوند.
2) componentهای مشترک `Field`, `TextInput`, `Textarea`, `Select`, `SegmentedControl`, `RangeField` بساز و همه labelها را با `htmlFor/id` متصل کن.
3) update store را debounce یا onBlur کن تا هر keypress history نسازد.
4) invalid state باید هم visual باشد هم قابل خواندن توسط screen reader: `aria-invalid`, `aria-describedby`, error id.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/264-filmstrip-mobile-layout-panel-340px-cram.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/264-filmstrip-mobile-layout-panel-340px-cram.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 265. Sonora font Unbounded load نشده

**دسته:** Typography  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** fontFamily inline است اما next/font یا import ندارد.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/265-sonora-font-unbounded-load.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/265-sonora-font-unbounded-load.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 266. Sonora placeholder ghost custom است

**دسته:** Form UX  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** input placeholder واقعی نیست و screen reader آن را نمی‌خواند.

### راه‌حل اجرایی برای agent

1) برای هر panel یک schema validation اضافه کن؛ پیشنهاد: `zod` یا یک validator سبک داخلی. خطاها باید زیر همان field با متن کوتاه و رنگ semantic danger نمایش داده شوند.
2) componentهای مشترک `Field`, `TextInput`, `Textarea`, `Select`, `SegmentedControl`, `RangeField` بساز و همه labelها را با `htmlFor/id` متصل کن.
3) update store را debounce یا onBlur کن تا هر keypress history نسازد.
4) invalid state باید هم visual باشد هم قابل خواندن توسط screen reader: `aria-invalid`, `aria-describedby`, error id.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/266-sonora-placeholder-ghost-custom.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/266-sonora-placeholder-ghost-custom.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 267. Sonora input label ندارد

**دسته:** A11y/Form  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** prompt input accessible name کافی ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/267-sonora-input-label.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/267-sonora-input-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 268. Sonora generate button disabled ندارد

**دسته:** UX  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** هنگام generating فقط guard در handler است، disabled visual نیست.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/268-sonora-generate-button-disabled.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/268-sonora-generate-button-disabled.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 269. Sonora generate بدون prompt هم اجرا می‌شود

**دسته:** Validation  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** empty prompt validation ندارد.

### راه‌حل اجرایی برای agent

1) برای هر panel یک schema validation اضافه کن؛ پیشنهاد: `zod` یا یک validator سبک داخلی. خطاها باید زیر همان field با متن کوتاه و رنگ semantic danger نمایش داده شوند.
2) componentهای مشترک `Field`, `TextInput`, `Textarea`, `Select`, `SegmentedControl`, `RangeField` بساز و همه labelها را با `htmlFor/id` متصل کن.
3) update store را debounce یا onBlur کن تا هر keypress history نسازد.
4) invalid state باید هم visual باشد هم قابل خواندن توسط screen reader: `aria-invalid`, `aria-describedby`, error id.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/269-sonora-generate-prompt.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/269-sonora-generate-prompt.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 270. Sonora genre buttons aria-pressed ندارند

**دسته:** A11y  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** selectedGenre فقط با رنگ مشخص است.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/270-sonora-genre-buttons-aria-pressed.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/270-sonora-genre-buttons-aria-pressed.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 271. Sonora wave bars random بعد mount تولید می‌شوند

**دسته:** Hydration/Visual  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** waveform با random visual jump می‌سازد.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/271-sonora-wave-bars-random-mount.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/271-sonora-wave-bars-random-mount.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 272. Sonora 48 infinite animations دارد

**دسته:** Performance/Motion  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** همه bars animate infinite هستند.

### راه‌حل اجرایی برای agent

1) برای هر panel یک schema validation اضافه کن؛ پیشنهاد: `zod` یا یک validator سبک داخلی. خطاها باید زیر همان field با متن کوتاه و رنگ semantic danger نمایش داده شوند.
2) componentهای مشترک `Field`, `TextInput`, `Textarea`, `Select`, `SegmentedControl`, `RangeField` بساز و همه labelها را با `htmlFor/id` متصل کن.
3) update store را debounce یا onBlur کن تا هر keypress history نسازد.
4) invalid state باید هم visual باشد هم قابل خواندن توسط screen reader: `aria-invalid`, `aria-describedby`, error id.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/272-sonora-48-infinite-animations.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/272-sonora-48-infinite-animations.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 273. Sonora inline style keyframes داخل component است

**دسته:** CSS  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** style tag داخل render برای keyframes استفاده شده است.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/273-sonora-inline-style-keyframes-component.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/273-sonora-inline-style-keyframes-component.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 274. Sonora tracks clickable div هستند

**دسته:** A11y  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** track row باید button/listitem باشد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/274-sonora-tracks-clickable-div.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/274-sonora-tracks-clickable-div.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 275. Sonora play state audio واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** playing فقط visual است.

### راه‌حل اجرایی برای agent

1) state mutation را command-based کن. برای هر عمل editor یک action مشخص بساز: `addNodeCommand`, `updateNodeDataCommand`, `connectNodesCommand`, `deleteSelectionCommand`.
2) history را deep-clone یا immutable snapshot کن و drag/typing را batch/debounce کن. selection-only changes نباید وارد undo stack شوند.
3) `selectedNodeId` و `node.selected` را یکی کن یا با یک sync layer قطعی مدیریت کن.
4) برای state مشتق مثل `canUndo/canRedo` getter/selector بساز، نه state دستی که ممکن است stale شود.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/275-sonora-play-state-audio.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/275-sonora-play-state-audio.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 276. Sonora Start Free action واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** toast نمایشی است.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/276-sonora-start-free-action.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/276-sonora-start-free-action.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 277. Sonora generate فقط timeout شبیه‌سازی است

**دسته:** Product  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** API یا state واقعی ندارد.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/277-sonora-generate-timeout.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/277-sonora-generate-timeout.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 278. Sonora timeout cleanup ندارد

**دسته:** Lifecycle  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** generate setTimeout ذخیره و clear نمی‌شود.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/278-sonora-timeout-cleanup.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/278-sonora-timeout-cleanup.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 279. Sonora copyها i18n نیستند

**دسته:** i18n  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** همه متن‌ها انگلیسی hardcoded هستند.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/279-sonora-copy-i18n.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/279-sonora-copy-i18n.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 280. Sonora Back icon برای RTL نامناسب است

**دسته:** RTL  
**محل/شاهد:** `Sonora.tsx`  
**مشکل:** ArrowRight در زبان انگلیسی/فارسی باید logical باشد.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/280-sonora-back-icon-rtl.unit.test.ts`؛ داده حداقلی مربوط به `Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/280-sonora-back-icon-rtl.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 281. external images policy ناقص است

**دسته:** Image Config  
**محل/شاهد:** `next.config.ts`  
**مشکل:** فقط picsum و pravatar مجازند؛ strategy asset واقعی مشخص نیست.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/281-external-images-policy.unit.test.ts`؛ داده حداقلی مربوط به `next.config.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/281-external-images-policy.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 282. imgهای بدون width/height CLS می‌دهند

**دسته:** Image Performance  
**محل/شاهد:** `marketplace/filmstrip/avatar`  
**مشکل:** ابعاد explicit ندارند.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/282-img-width-height-cls.unit.test.ts`؛ داده حداقلی مربوط به `marketplace/filmstrip/avatar` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/282-img-width-height-cls.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 283. img decoding async خوب است اما fetch priority نیست

**دسته:** Image Perf  
**محل/شاهد:** `ArtImage/AvatarImage`  
**مشکل:** hero/above-fold priority تعریف نشده.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/283-img-decoding-async-fetch-priority.unit.test.ts`؛ داده حداقلی مربوط به `ArtImage/AvatarImage` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/283-img-decoding-async-fetch-priority.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 284. alt بعضی تصاویر خالی است بدون decorative marking

**دسته:** A11y/Image  
**محل/شاهد:** `multiple`  
**مشکل:** alt='' برای decorative خوب است اما parent button label ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/284-alt-decorative-marking.unit.test.ts`؛ داده حداقلی مربوط به `multiple` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/284-alt-decorative-marking.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 285. fallback تصویر initial ندارد

**دسته:** UX  
**محل/شاهد:** `AvatarImage`  
**مشکل:** به جای initials/semantic placeholder فقط gradient empty است.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/285-fallback-initial.unit.test.ts`؛ داده حداقلی مربوط به `AvatarImage` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/285-fallback-initial.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 286. Image error state telemetry ندارد

**دسته:** Observability  
**محل/شاهد:** `ArtImage`  
**مشکل:** خطای تصویر فقط fallback می‌دهد، log/report ندارد.

### راه‌حل اجرایی برای agent

1) state mutation را command-based کن. برای هر عمل editor یک action مشخص بساز: `addNodeCommand`, `updateNodeDataCommand`, `connectNodesCommand`, `deleteSelectionCommand`.
2) history را deep-clone یا immutable snapshot کن و drag/typing را batch/debounce کن. selection-only changes نباید وارد undo stack شوند.
3) `selectedNodeId` و `node.selected` را یکی کن یا با یک sync layer قطعی مدیریت کن.
4) برای state مشتق مثل `canUndo/canRedo` getter/selector بساز، نه state دستی که ممکن است stale شود.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/286-image-error-state-telemetry.unit.test.ts`؛ داده حداقلی مربوط به `ArtImage` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/286-image-error-state-telemetry.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 287. remote image privacy/user tracking بررسی نشده

**دسته:** Security/Privacy  
**محل/شاهد:** `pravatar/picsum`  
**مشکل:** تصاویر third-party بدون proxy/cache می‌آیند.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/287-remote-image-privacy-user-tracking.unit.test.ts`؛ داده حداقلی مربوط به `pravatar/picsum` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/287-remote-image-privacy-user-tracking.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 288. CSP برای images/scripts تعریف نشده

**دسته:** Security  
**محل/شاهد:** `next.config.ts`  
**مشکل:** headers امنیتی در Next config وجود ندارد.

### راه‌حل اجرایی برای agent

1) `<img>` خام را به یک کامپوننت مشترک `AppImage` بر پایه `next/image` تبدیل کن؛ props لازم: `src`, `alt`, `width`, `height`, `sizes`, `priority`, `fallback`, `className`.
2) برای avatarها fallback با initials بساز، نه gradient خالی.
3) aspect-ratio reservation اضافه کن تا CLS کم شود.
4) remote image policy را در `next.config.ts` نگه دار ولی استفاده واقعی را با `Image` انجام بده.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/288-csp-images-scripts.unit.test.ts`؛ داده حداقلی مربوط به `next.config.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/288-csp-images-scripts.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 289. Share/download بدون permission/user feedback است

**دسته:** UX  
**محل/شاهد:** `FilmstripModal`  
**مشکل:** اکشن‌های file/share باید capability detect داشته باشند.

### راه‌حل اجرایی برای agent

1) این بخش را به کامپوننت‌های کوچک تقسیم کن: `MarketplaceShell`, `FilterSidebar`, `ArtworkGrid`, `ArtworkCard`, `CompareBar`, `CommandPalette`, `FilmstripDialog`.
2) state مشتق را با `useMemo` یا URL search params مدیریت کن؛ stateهای تکراری را حذف کن.
3) همه اکشن‌های نمایشی مثل share/download/collaboration باید یا واقعاً کار کنند یا disabled با پیام واضح باشند.
4) hover-only UI را برای touch و keyboard قابل استفاده کن: دکمه‌های دائمی، focus state، و منوی action قابل tab.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/289-share-download-permission-user-feedback.unit.test.ts`؛ داده حداقلی مربوط به `FilmstripModal` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/289-share-download-permission-user-feedback.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 290. modalهای marketplace و builder دو سیستم جدا دارند

**دسته:** Design System  
**محل/شاهد:** `Modal.tsx + FilmstripModal`  
**مشکل:** یک Dialog primitive مشترک وجود ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/290-modal-marketplace-builder.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx + FilmstripModal` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/290-modal-marketplace-builder.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 291. Toast system aria-live ندارد

**دسته:** A11y  
**محل/شاهد:** `Marketplace`  
**مشکل:** کاربر screen reader اضافه شدن toast را نمی‌فهمد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/291-toast-system-aria-live.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/291-toast-system-aria-live.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 292. mobile bottom nav aria-current ندارد

**دسته:** A11y  
**محل/شاهد:** `Marketplace`  
**مشکل:** active tab فقط رنگی است.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/292-mobile-bottom-nav-aria-current.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/292-mobile-bottom-nav-aria-current.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 293. loader spinner accessible label ندارد

**دسته:** A11y  
**محل/شاهد:** `Marketplace Loader`  
**مشکل:** role=status/aria-label ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/293-loader-spinner-accessible-label.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace Loader` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/293-loader-spinner-accessible-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 294. تست واحد برای store وجود ندارد

**دسته:** Testing  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** undo/redo/add/delete/connect بدون تست است.

### راه‌حل اجرایی برای agent

1) ابتدا test infrastructure را اضافه کن: Vitest برای unit/component، Testing Library و user-event برای تعامل، jest-axe برای accessibility، و Playwright برای E2E/visual.
2) اسکریپت‌های `test`, `test:watch`, `test:coverage`, `test:e2e`, `typecheck`, `qa` را به package.json اضافه کن.
3) این مورد را به CI gate تبدیل کن تا بدون تست merge نشود.
4) برای هر باگ یک تست fail-first بنویس، سپس implementation را اصلاح کن، سپس تست را سبز کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/294-store.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/294-store.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 295. تست component برای modal وجود ندارد

**دسته:** Testing  
**محل/شاهد:** `src/components/ui/Modal.tsx`  
**مشکل:** focus/escape/overlay/ARIA تست نشده است.

### راه‌حل اجرایی برای agent

1) ابتدا test infrastructure را اضافه کن: Vitest برای unit/component، Testing Library و user-event برای تعامل، jest-axe برای accessibility، و Playwright برای E2E/visual.
2) اسکریپت‌های `test`, `test:watch`, `test:coverage`, `test:e2e`, `typecheck`, `qa` را به package.json اضافه کن.
3) این مورد را به CI gate تبدیل کن تا بدون تست merge نشود.
4) برای هر باگ یک تست fail-first بنویس، سپس implementation را اصلاح کن، سپس تست را سبز کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/295-component-modal.unit.test.ts`؛ داده حداقلی مربوط به `src/components/ui/Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/295-component-modal.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 296. تست React Flow integration وجود ندارد

**دسته:** Testing  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** drag/drop/connect/delete تست نشده است.

### راه‌حل اجرایی برای agent

1) ابتدا test infrastructure را اضافه کن: Vitest برای unit/component، Testing Library و user-event برای تعامل، jest-axe برای accessibility، و Playwright برای E2E/visual.
2) اسکریپت‌های `test`, `test:watch`, `test:coverage`, `test:e2e`, `typecheck`, `qa` را به package.json اضافه کن.
3) این مورد را به CI gate تبدیل کن تا بدون تست merge نشود.
4) برای هر باگ یک تست fail-first بنویس، سپس implementation را اصلاح کن، سپس تست را سبز کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/296-react-flow-integration.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/296-react-flow-integration.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 297. تست accessibility خودکار ندارد

**دسته:** Testing/A11y  
**محل/شاهد:** `all UI`  
**مشکل:** jest-axe/axe playwright تنظیم نشده است.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/297-accessibility.unit.test.ts`؛ داده حداقلی مربوط به `all UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/297-accessibility.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 298. تست visual regression ندارد

**دسته:** Testing/Visual  
**محل/شاهد:** `UI`  
**مشکل:** رنگ/نور/دکمه‌ها بعد تغییر قابل کنترل نیست.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- رنگ‌ها را به palette جدید منتقل کن: Canvas `#0B1020` یا token معادل، Panel `#111827`، Card `#172033`، Border `rgba(148,163,184,.18)`, Text primary نزدیک سفید، Text muted خاکستری آبی، Accent اصلی آبی/بنفش کنترل‌شده.
- دکمه primary باید ارتفاع حداقل 36px در desktop و 44px در touch داشته باشد؛ border-radius ثابت 12px؛ hover = کمی روشن‌تر + border قوی‌تر؛ active = scale بسیار کم فقط وقتی reduced-motion خاموش است.
- از opacity-only برای hover/disabled استفاده نکن؛ disabled باید cursor، color، background و aria-disabled/disabled واقعی داشته باشد.
- المان‌های interactive باید focus ring واضح 2px با offset 2px داشته باشند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/298-visual-regression.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/298-visual-regression.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 299. Playwright نصب نیست

**دسته:** Testing  
**محل/شاهد:** `package.json`  
**مشکل:** E2E browser tests ندارید.

### راه‌حل اجرایی برای agent

1) ابتدا test infrastructure را اضافه کن: Vitest برای unit/component، Testing Library و user-event برای تعامل، jest-axe برای accessibility، و Playwright برای E2E/visual.
2) اسکریپت‌های `test`, `test:watch`, `test:coverage`, `test:e2e`, `typecheck`, `qa` را به package.json اضافه کن.
3) این مورد را به CI gate تبدیل کن تا بدون تست merge نشود.
4) برای هر باگ یک تست fail-first بنویس، سپس implementation را اصلاح کن، سپس تست را سبز کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/299-playwright.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/299-playwright.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 300. Vitest نصب نیست

**دسته:** Testing  
**محل/شاهد:** `package.json`  
**مشکل:** Unit/component test runner نیست.

### راه‌حل اجرایی برای agent

1) ابتدا test infrastructure را اضافه کن: Vitest برای unit/component، Testing Library و user-event برای تعامل، jest-axe برای accessibility، و Playwright برای E2E/visual.
2) اسکریپت‌های `test`, `test:watch`, `test:coverage`, `test:e2e`, `typecheck`, `qa` را به package.json اضافه کن.
3) این مورد را به CI gate تبدیل کن تا بدون تست merge نشود.
4) برای هر باگ یک تست fail-first بنویس، سپس implementation را اصلاح کن، سپس تست را سبز کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/300-vitest.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/300-vitest.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---
