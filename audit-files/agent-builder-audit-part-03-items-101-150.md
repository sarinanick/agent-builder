# Agent Builder Front-end Audit — فایل 3/8 — موارد 101 تا 150

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


## 101. کنترل‌های canvas فقط zoom/fit هستند

**دسته:** UX  
**محل/شاهد:** `CanvasControls.tsx`  
**مشکل:** lock، reset، grid toggle، minimap toggle، help وجود ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/101-canvas-zoom-fit.unit.test.ts`؛ داده حداقلی مربوط به `CanvasControls.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/101-canvas-zoom-fit.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 102. CanvasControls aria-label ندارد

**دسته:** A11y  
**محل/شاهد:** `CanvasControls.tsx`  
**مشکل:** دکمه‌های zoom فقط title دارند.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/102-canvascontrols-aria-label.unit.test.ts`؛ داده حداقلی مربوط به `CanvasControls.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/102-canvascontrols-aria-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 103. drop preview برای node insertion نیست

**دسته:** UX  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** کاربر قبل از رها کردن node جای دقیق را نمی‌بیند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/103-drop-preview-node-insertion.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/103-drop-preview-node-insertion.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 104. invalid drop feedback ندارد

**دسته:** UX  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** اگر type نامعتبر باشد silent return می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/104-invalid-drop-feedback.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/104-invalid-drop-feedback.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 105. HTML drag برای mobile کافی نیست

**دسته:** Touch UX  
**محل/شاهد:** `Sidebar.tsx + EditorCanvas.tsx`  
**مشکل:** touch/pointer based DnD پیاده نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/105-html-drag-mobile.unit.test.ts`؛ داده حداقلی مربوط به `Sidebar.tsx + EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/105-html-drag-mobile.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 106. nodeTypes بیرون component خوب است اما lazy نیست

**دسته:** Bundle  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** تمام nodeها در chunk canvas می‌مانند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/106-nodetypes-component-lazy.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/106-nodetypes-component-lazy.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 107. defaultNodeData داخل EditorCanvas است

**دسته:** Architecture  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** schema/defaults بهتر است کنار node definitions یا schema مرکزی باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/107-defaultnodedata-editorcanvas.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/107-defaultnodedata-editorcanvas.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 108. defaultNodeData با NODE_DEFINITIONS sync نیست

**دسته:** Data Consistency  
**محل/شاهد:** `EditorCanvas.tsx + constants`  
**مشکل:** label/description/color/defaultها از منابع مختلف می‌آیند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/108-defaultnodedata-node-definitions-sync.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx + constants` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/108-defaultnodedata-node-definitions-sync.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 109. generateNodeId بدون collision test است

**دسته:** Reliability  
**محل/شاهد:** `src/lib/idGenerator`  
**مشکل:** ID generator باید deterministic/tested باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/109-generatenodeid-collision-test.unit.test.ts`؛ داده حداقلی مربوط به `src/lib/idGenerator` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/109-generatenodeid-collision-test.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 110. onNodeClick فقط UI store را set می‌کند

**دسته:** Selection  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** selected state React Flow و UI store sync تضمین‌شده نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/110-onnodeclick-ui-store-set.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/110-onnodeclick-ui-store-set.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 111. onPaneClick فقط selectedNodeId را null می‌کند

**دسته:** Selection  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** node.selected ممکن است باقی بماند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/111-onpaneclick-selectednodeid-null.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/111-onpaneclick-selectednodeid-null.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 112. deleteSelected edgeهای متصل به node حذف‌شده را پاک نمی‌کند

**دسته:** Graph Integrity  
**محل/شاهد:** `flowStore.ts`  
**مشکل:** با حذف node، edges connected ممکن است orphan شوند مگر React Flow خودش مدیریت کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/112-deleteselected-edge-node.unit.test.ts`؛ داده حداقلی مربوط به `flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/112-deleteselected-edge-node.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 113. Condition handles label visual ندارند

**دسته:** Graph UX  
**محل/شاهد:** `ConditionNode.tsx`  
**مشکل:** true/false handleها رنگ دارند اما برچسب handle/edge ندارند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/113-condition-handles-label-visual.unit.test.ts`؛ داده حداقلی مربوط به `ConditionNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/113-condition-handles-label-visual.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 114. Condition body substring ساده دارد

**دسته:** UI  
**محل/شاهد:** `ConditionNode.tsx`  
**مشکل:** expression با substring بریده می‌شود و tooltip/monospace wrapping ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/114-condition-body-substring.unit.test.ts`؛ داده حداقلی مربوط به `ConditionNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/114-condition-body-substring.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 115. Condition layout با inline style radius دارد

**دسته:** CSS  
**محل/شاهد:** `ConditionNode.tsx`  
**مشکل:** border radius به جای class/token inline شده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/115-condition-layout-inline-style-radius.unit.test.ts`؛ داده حداقلی مربوط به `ConditionNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/115-condition-layout-inline-style-radius.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 116. Condition duplicate wrapper logic دارد

**دسته:** Maintainability  
**محل/شاهد:** `ConditionNode.tsx`  
**مشکل:** به جای NodeWrapper خاص، markup خودش را تکرار کرده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/116-condition-duplicate-wrapper-logic.unit.test.ts`؛ داده حداقلی مربوط به `ConditionNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/116-condition-duplicate-wrapper-logic.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 117. NodeWrapper onClick event bubbling را کنترل نمی‌کند

**دسته:** Interaction  
**محل/شاهد:** `NodeWrapper.tsx`  
**مشکل:** کلیک روی children ممکن است selection را ناخواسته تغییر دهد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/117-nodewrapper-onclick-event-bubbling.unit.test.ts`؛ داده حداقلی مربوط به `NodeWrapper.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/117-nodewrapper-onclick-event-bubbling.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 118. NodeWrapper interactive div است

**دسته:** A11y  
**محل/شاهد:** `NodeWrapper.tsx`  
**مشکل:** div کلیک‌پذیر role/tabIndex ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/118-nodewrapper-interactive-div.unit.test.ts`؛ داده حداقلی مربوط به `NodeWrapper.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/118-nodewrapper-interactive-div.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 119. NodeWrapper keyboard selection ندارد

**دسته:** A11y  
**محل/شاهد:** `NodeWrapper.tsx`  
**مشکل:** Enter/Space برای انتخاب node کار نمی‌کند.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/119-nodewrapper-keyboard-selection.unit.test.ts`؛ داده حداقلی مربوط به `NodeWrapper.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/119-nodewrapper-keyboard-selection.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 120. NodeWrapper handles aria-label ندارند

**دسته:** A11y  
**محل/شاهد:** `NodeWrapper.tsx`  
**مشکل:** Handleها برای screen reader توضیح ندارند.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/120-nodewrapper-handles-aria-label.unit.test.ts`؛ داده حداقلی مربوط به `NodeWrapper.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/120-nodewrapper-handles-aria-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 121. NodeWrapper data generic است

**دسته:** Type Safety  
**محل/شاهد:** `NodeWrapper.tsx`  
**مشکل:** داده‌ها Record<string, unknown> هستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/121-nodewrapper-data-generic.unit.test.ts`؛ داده حداقلی مربوط به `NodeWrapper.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/121-nodewrapper-data-generic.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 122. Node body برای اکثر nodeها خالی است

**دسته:** UX  
**محل/شاهد:** `node components`  
**مشکل:** Nodeها روی canvas اطلاعات وضعیت را نشان نمی‌دهند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/122-node-body-node.unit.test.ts`؛ داده حداقلی مربوط به `node components` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/122-node-body-node.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 123. AgentNode مدل و ابزارها را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `AgentNode.tsx`  
**مشکل:** فقط label و sublabel Agent نمایش داده می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/123-agentnode.unit.test.ts`؛ داده حداقلی مربوط به `AgentNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/123-agentnode.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 124. FileSearchNode vector store را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `FileSearchNode.tsx`  
**مشکل:** تنظیمات مهم پنهان‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/124-filesearchnode-vector-store.unit.test.ts`؛ داده حداقلی مربوط به `FileSearchNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/124-filesearchnode-vector-store.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 125. GuardrailsNode pattern/checkType را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `GuardrailsNode.tsx`  
**مشکل:** کاربر بدون بازکردن panel نمی‌فهمد guardrail چیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/125-guardrailsnode-pattern-checktype.unit.test.ts`؛ داده حداقلی مربوط به `GuardrailsNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/125-guardrailsnode-pattern-checktype.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 126. McpNode toolName/serverUrl را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `McpNode.tsx`  
**مشکل:** تشخیص ابزار MCP روی canvas سخت است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/126-mcpnode-toolname-serverurl.unit.test.ts`؛ داده حداقلی مربوط به `McpNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/126-mcpnode-toolname-serverurl.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 127. WhileNode condition/maxIterations را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `WhileNode.tsx`  
**مشکل:** ریسک loop بدون visibility است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/127-whilenode-condition-maxiterations.unit.test.ts`؛ داده حداقلی مربوط به `WhileNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/127-whilenode-condition-maxiterations.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 128. HumanApprovalNode timeout را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `HumanApprovalNode.tsx`  
**مشکل:** مهلت approval روی نود دیده نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/128-humanapprovalnode-timeout.unit.test.ts`؛ داده حداقلی مربوط به `HumanApprovalNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/128-humanapprovalnode-timeout.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 129. TransformNode schema/code summary ندارد

**دسته:** Canvas UX  
**محل/شاهد:** `TransformNode.tsx`  
**مشکل:** تبدیل داده مشخص نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/129-transformnode-schema-code-summary.unit.test.ts`؛ داده حداقلی مربوط به `TransformNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/129-transformnode-schema-code-summary.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 130. SetStateNode تعداد variables را نشان نمی‌دهد

**دسته:** Canvas UX  
**محل/شاهد:** `SetStateNode.tsx`  
**مشکل:** اثر state mutation روی canvas مشخص نیست.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/130-setstatenode-variables.unit.test.ts`؛ داده حداقلی مربوط به `SetStateNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/130-setstatenode-variables.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 131. NoteNode به data.color بی‌توجه است

**دسته:** UI Bug  
**محل/شاهد:** `NoteNode.tsx`  
**مشکل:** رنگ انتخابی کاربر هیچ خروجی ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/131-notenode-data-color.unit.test.ts`؛ داده حداقلی مربوط به `NoteNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/131-notenode-data-color.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 132. NoteNode textarea داخل node history spam می‌سازد

**دسته:** State/UX  
**محل/شاهد:** `NoteNode.tsx`  
**مشکل:** هر تایپ updateNodeData می‌زند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/132-notenode-textarea-node-history-spam.unit.test.ts`؛ داده حداقلی مربوط به `NoteNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/132-notenode-textarea-node-history-spam.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 133. NoteNode textarea drag conflict دارد

**دسته:** Interaction  
**محل/شاهد:** `NoteNode.tsx`  
**مشکل:** textarea داخل node ممکن است با drag/selection React Flow تداخل داشته باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/133-notenode-textarea-drag-conflict.unit.test.ts`؛ داده حداقلی مربوط به `NoteNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/133-notenode-textarea-drag-conflict.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 134. NodeResizer فقط هنگام selected است اما accessibility ندارد

**دسته:** A11y  
**محل/شاهد:** `NoteNode.tsx`  
**مشکل:** resize handles keyboard accessible نیستند.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Nodeها باید کارت‌های واضح با header، icon، label، summary و validation/status badge باشند.
- رنگ node از semantic category token بیاید؛ Logic نارنجی، Agent بنفش، Tool زرد/amber، Data آبی، Start/End سبز اما با contrast کافی.
- Edgeها arrowhead و label داشته باشند؛ edge فعال/selected باید ضخیم‌تر و با halo دیده شود، نه فقط تغییر رنگ.
- Canvas controls باید یک toolbar شناور خوانا با buttonهای 36-40px باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/134-noderesizer-selected-accessibility.unit.test.ts`؛ داده حداقلی مربوط به `NoteNode.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/134-noderesizer-selected-accessibility.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 135. node minWidth/minHeight عمومی ندارد

**دسته:** Layout  
**محل/شاهد:** `node styles`  
**مشکل:** به جز note، nodeها اندازه استاندارد ندارند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/135-node-minwidth-minheight.unit.test.ts`؛ داده حداقلی مربوط به `node styles` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/135-node-minwidth-minheight.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 136. node status indicator ندارد

**دسته:** Workflow UX  
**محل/شاهد:** `nodes`  
**مشکل:** draft/error/valid/running state نمایش داده نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/136-node-status-indicator.unit.test.ts`؛ داده حداقلی مربوط به `nodes` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/136-node-status-indicator.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 137. node validation badge ندارد

**دسته:** Validation UX  
**محل/شاهد:** `nodes`  
**مشکل:** نود ناقص روی canvas هشدار ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/137-node-validation-badge.unit.test.ts`؛ داده حداقلی مربوط به `nodes` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/137-node-validation-badge.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 138. edge label برای condition branch وجود ندارد

**دسته:** Workflow UX  
**محل/شاهد:** `edges`  
**مشکل:** true/false روی edgeها نمایش داده نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/138-edge-label-condition-branch.unit.test.ts`؛ داده حداقلی مربوط به `edges` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/138-edge-label-condition-branch.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 139. edge marker/arrowhead تعریف نشده

**دسته:** Graph Readability  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** جهت workflow فقط از اتصال قابل حدس است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/139-edge-marker-arrowhead.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/139-edge-marker-arrowhead.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 140. connection mode/strictness مشخص نیست

**دسته:** Graph Validation  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** رفتار اتصال نامعتبر explicit نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/140-connection-mode-strictness.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/140-connection-mode-strictness.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 141. node drag boundaries ندارد

**دسته:** Canvas UX  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** نودها می‌توانند خیلی دور شوند و گم شوند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/141-node-drag-boundaries.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/141-node-drag-boundaries.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 142. fitView padding ثابت است

**دسته:** UX  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** برای تعداد node زیاد/کم adaptive نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/142-fitview-padding.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/142-fitview-padding.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 143. snap grid قابل تغییر نیست

**دسته:** UX  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** toggle/sizing برای grid وجود ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/143-snap-grid.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/143-snap-grid.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 144. Background dots contrast ضعیف است

**دسته:** Visual  
**محل/شاهد:** `EditorCanvas.tsx + CSS`  
**مشکل:** color var(--border) روی dark ممکن است خیلی کم‌رنگ باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/144-background-dots-contrast.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx + CSS` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/144-background-dots-contrast.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 145. MiniMap همیشه visible است

**دسته:** Responsive/Performance  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** در صفحه کوچک/موبایل کنترل hide ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/145-minimap-visible.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/145-minimap-visible.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 146. MiniMap فاقد aria-hidden یا label است

**دسته:** A11y  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** اگر تعاملی است باید قابل فهم باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/146-minimap-aria-hidden-label.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/146-minimap-aria-hidden-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 147. React Flow validation examples استفاده نشده

**دسته:** Library Best Practice  
**محل/شاهد:** `EditorCanvas.tsx`  
**مشکل:** isValidConnection یا onBeforeDelete تعریف نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/147-react-flow-validation-examples.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/147-react-flow-validation-examples.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 148. React Flow useViewport/useOnViewportChange استفاده نشده

**دسته:** Library Best Practice  
**محل/شاهد:** `CanvasControls.tsx`  
**مشکل:** برای UI زنده viewport باید hook مناسب استفاده شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/148-react-flow-useviewport-useonviewportchan.unit.test.ts`؛ داده حداقلی مربوط به `CanvasControls.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/148-react-flow-useviewport-useonviewportchan.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 149. PropertiesPanel start/end پیام انگلیسی ثابت دارد

**دسته:** i18n  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** متن No additional configuration ترجمه نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/149-propertiespanel-start-end.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/149-propertiespanel-start-end.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 150. PropertiesPanel component map ندارد

**دسته:** Maintainability  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** برای هر nodeType شرط جدا نوشته شده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/150-propertiespanel-component-map.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/150-propertiespanel-component-map.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---
