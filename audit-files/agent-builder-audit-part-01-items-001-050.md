# Agent Builder Front-end Audit — فایل 1/8 — موارد 1 تا 50

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


## 1. کل صفحه اصلی client-side شده است

**دسته:** معماری Next/React  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** صفحه اصلی با 'use client' کل editor، toolbar، canvas و modalها را وارد bundle کلاینت می‌کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/001-client-side.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/001-client-side.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 2. ReactFlowProvider بیش از حد وسیع است

**دسته:** معماری Next/React  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** Provider دور کل EditorContent قرار گرفته و همه فرزندان را در context سنگین canvas قرار می‌دهد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/002-reactflowprovider.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/002-reactflowprovider.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 3. Modalها upfront import شده‌اند

**دسته:** Performance/Bundle  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** CodeModal، PreviewModal و DeployModal حتی در حالت بسته نیز داخل chunk اصلی صفحه هستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/003-modal-upfront-import.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/003-modal-upfront-import.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 4. کامپوننت‌های node upfront import شده‌اند

**دسته:** Performance/Bundle  
**محل/شاهد:** `src/components/canvas/EditorCanvas.tsx`  
**مشکل:** همه nodeها در EditorCanvas import شده‌اند و امکان code splitting از دست رفته است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/004-node-upfront-import.unit.test.ts`؛ داده حداقلی مربوط به `src/components/canvas/EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/004-node-upfront-import.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 5. صفحه builder server component نیست

**دسته:** Next Architecture  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** مزیت server rendering برای shell، metadata و کاهش JS اولیه از دست رفته است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/005-builder-server-component.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/005-builder-server-component.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 6. provider زبان از localStorage بعد از mount می‌خواند

**دسته:** i18n/SSR  
**محل/شاهد:** `src/lib/i18n.tsx`  
**مشکل:** زبان اولیه همیشه en است و بعد از mount تغییر می‌کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/006-provider-localstorage-mount.unit.test.ts`؛ داده حداقلی مربوط به `src/lib/i18n.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/006-provider-localstorage-mount.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 7. dir و lang بعد از mount تغییر می‌کنند

**دسته:** i18n/RTL  
**محل/شاهد:** `src/lib/i18n.tsx`  
**مشکل:** RTL layout دیر اعمال می‌شود و در فارسی flash رخ می‌دهد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/007-dir-lang-mount.unit.test.ts`؛ داده حداقلی مربوط به `src/lib/i18n.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/007-dir-lang-mount.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 8. ThemeProvider defaultTheme و enableSystem رفتار مبهم می‌سازد

**دسته:** Theme  
**محل/شاهد:** `src/app/layout.tsx`  
**مشکل:** defaultTheme='dark' همراه enableSystem می‌تواند خروجی اولیه و سیستم کاربر را ناهماهنگ کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/008-themeprovider-defaulttheme-enablesystem.unit.test.ts`؛ داده حداقلی مربوط به `src/app/layout.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/008-themeprovider-defaulttheme-enablesystem.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 9. suppressHydrationWarning مشکل واقعی را پنهان کرده

**دسته:** Hydration  
**محل/شاهد:** `src/app/layout.tsx`  
**مشکل:** روی html اعمال شده و ممکن است اختلاف theme/lang را مخفی کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/009-suppresshydrationwarning.unit.test.ts`؛ داده حداقلی مربوط به `src/app/layout.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/009-suppresshydrationwarning.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 10. Marketplace یک client component بسیار بزرگ است

**دسته:** Architecture  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** فیلتر، modal، toast، compare، nav و cards داخل یک فایل جمع شده‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/010-marketplace-client-component.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/010-marketplace-client-component.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 11. Sonora route مستقل ندارد

**دسته:** Routing  
**محل/شاهد:** `src/app/marketplace/Sonora.tsx`  
**مشکل:** صفحه کامل Sonora به عنوان state داخلی marketplace نمایش داده می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/011-sonora-route.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/Sonora.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/011-sonora-route.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 12. Command Palette داخل marketplace قفل شده

**دسته:** Architecture  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** cmdk state و UI داخل صفحه بزرگ است و reusable نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/012-command-palette-marketplace.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/012-command-palette-marketplace.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 13. Toast state محلی و پراکنده است

**دسته:** State  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** toastها داخل marketplace نگهداری می‌شوند و سیستم notification مرکزی وجود ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/013-toast-state.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/013-toast-state.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 14. Compare state با data اصلی reference مشترک دارد

**دسته:** State/Mutation  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** compareList itemها را مستقیم از allItems نگه می‌دارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/014-compare-state-data-reference.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/014-compare-state-data-reference.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 15. favorite state دو منبع حقیقت دارد

**دسته:** State  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** liked هم روی item و هم در favoritesList نگهداری می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/015-favorite-state.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/015-favorite-state.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 16. item.liked مستقیماً mutate می‌شود

**دسته:** React State  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** در toggleFavorite مقدار item.liked تغییر می‌کند و سپس map زده می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/016-item-liked-mutate.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/016-item-liked-mutate.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 17. filteredPool و visibleItems derived state تکراری‌اند

**دسته:** State  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** دو state مشتق از allItems باعث sync bug می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/017-filteredpool-visibleitems-derived-state.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/017-filteredpool-visibleitems-derived-state.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 18. allItems client-side generate می‌شود

**دسته:** Data/Performance  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** ۱۵۰ آیتم در mount تولید می‌شود و SSR/streaming ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/018-allitems-client-side-generate.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/018-allitems-client-side-generate.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 19. useEffect اول صفحه template را conditionally load می‌کند

**دسته:** State Lifecycle  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** اگر nodes.length صفر باشد template load می‌شود، اما dependency array خالی است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/019-useeffect-template-conditionally-load.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/019-useeffect-template-conditionally-load.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 20. dependencyهای useEffect loadTemplate ناقص‌اند

**دسته:** React Hooks  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** nodes و loadTemplate در dependency نیستند و lint/hook correctness ضعیف می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/020-dependency-useeffect-loadtemplate.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/020-dependency-useeffect-loadtemplate.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 21. Keyboard shortcuts global هستند

**دسته:** Interaction  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** keydown روی window ثبت شده و scope editor/modal/inputها دقیق کنترل نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/021-keyboard-shortcuts-global.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/021-keyboard-shortcuts-global.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 22. Backspace روی canvas حذف می‌کند

**دسته:** UX/Safety  
**محل/شاهد:** `src/app/page.tsx`  
**مشکل:** Backspace خارج از input نود انتخاب‌شده را حذف می‌کند و ممکن است ناخواسته باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/022-backspace-canvas.unit.test.ts`؛ داده حداقلی مربوط به `src/app/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/022-backspace-canvas.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 23. setState مستقیم در PropertiesPanel استفاده شده

**دسته:** State Encapsulation  
**محل/شاهد:** `src/components/panel/PropertiesPanel.tsx`  
**مشکل:** کامپوننت مستقیم useFlowStore.setState را صدا می‌زند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/023-setstate-propertiespanel.unit.test.ts`؛ داده حداقلی مربوط به `src/components/panel/PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/023-setstate-propertiespanel.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 24. deleteSelected بر selected flag تکیه دارد

**دسته:** State  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** حذف بر اساس selected=true انجام می‌شود، نه selectedNodeId قطعی.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/024-deleteselected-selected-flag.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/024-deleteselected-selected-flag.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 25. دو منبع حقیقت selection وجود دارد

**دسته:** State  
**محل/شاهد:** `src/store/uiStore.ts + React Flow state`  
**مشکل:** selectedNodeId و node.selected جدا نگه داشته شده‌اند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/025-selection.unit.test.ts`؛ داده حداقلی مربوط به `src/store/uiStore.ts + React Flow state` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/025-selection.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 26. setNodes/setEdges history را دور می‌زنند

**دسته:** Undo/Redo  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** تغییرات مستقیم بدون past/future ثبت می‌شوند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/026-setnodes-setedges-history.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/026-setnodes-setedges-history.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 27. loadTemplate deep clone نمی‌کند

**دسته:** State Safety  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** nodes/edges template همان reference اصلی وارد store می‌شوند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/027-loadtemplate-deep-clone.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/027-loadtemplate-deep-clone.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 28. pushToHistory shallow snapshot می‌گیرد

**دسته:** Undo/Redo  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** node.data و nested arrays clone نمی‌شوند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/028-pushtohistory-shallow-snapshot.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/028-pushtohistory-shallow-snapshot.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 29. هر drag/change یک history entry می‌سازد

**دسته:** Undo/Redo/Performance  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** onNodesChange هر micro-change را push می‌کند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/029-drag-change-history-entry.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/029-drag-change-history-entry.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 30. هر keypress در panel history می‌سازد

**دسته:** Undo/Redo UX  
**محل/شاهد:** `src/store/flowStore.ts + panels`  
**مشکل:** updateNodeData برای هر onChange history push می‌کند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/030-keypress-panel-history.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts + panels` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/030-keypress-panel-history.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 31. future stack محدود نشده

**دسته:** Memory  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** past slice دارد اما future cap ندارد.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/031-future-stack.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/031-future-stack.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 32. canUndo/canRedo derived نیستند

**دسته:** State Consistency  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** canUndo/canRedo دستی نگه داشته شده‌اند و امکان ناسازگاری وجود دارد.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/032-canundo-canredo-derived.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/032-canundo-canredo-derived.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 33. redo past cap ندارد

**دسته:** Memory  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** redo past را بدون slice به انتها اضافه می‌کند.

### راه‌حل اجرایی برای agent

1) تغییر را در سطح graph/canvas حل کن، نه فقط UI. یک `nodeRegistry` بساز که برای هر node شامل `type`, `defaults`, `component`, `panel`, `icon`, `colorToken`, `validate`, `handles` باشد.
2) برای connectionها `isValidConnection` و validation مرکزی اضافه کن: self-loop، duplicate، source/target اشتباه، تعداد ورودی/خروجی و branchهای condition را کنترل کن.
3) nodeها را از رنگ hardcoded جدا کن و از tokenها/registry بخوان. روی خود node summary مفید نمایش بده: status، model، tool، condition، timeout یا تعداد variables.
4) controls canvas را کامل کن: zoom in/out/reset/fit، grid toggle، minimap toggle، lock canvas و help shortcuts.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/033-redo-past-cap.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/033-redo-past-cap.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 34. onEdgesChange برای selection هم history می‌سازد

**دسته:** Undo/Redo  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** حتی تغییر انتخاب edge به عنوان عمل قابل undo ثبت می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/034-onedgeschange-selection-history.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/034-onedgeschange-selection-history.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 35. onConnect duplicate edge را جلوگیری نمی‌کند

**دسته:** Graph Validation  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** اتصال تکراری بین دو handle ممکن است ساخته شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/035-onconnect-duplicate-edge.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/035-onconnect-duplicate-edge.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 36. onConnect self-loop را جلوگیری نمی‌کند

**دسته:** Graph Validation  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** node می‌تواند به خودش وصل شود مگر React Flow محدود کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/036-onconnect-self-loop.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/036-onconnect-self-loop.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 37. Graph semantic validation ندارد

**دسته:** Workflow Validation  
**محل/شاهد:** `src/store/flowStore.ts`  
**مشکل:** نوع node و تعداد ورودی/خروجی هنگام اتصال چک نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/037-graph-semantic-validation.unit.test.ts`؛ داده حداقلی مربوط به `src/store/flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/037-graph-semantic-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 38. Start/End data با typeها ناسازگار است

**دسته:** Type Safety  
**محل/شاهد:** `src/types/nodes.ts + EditorCanvas.tsx`  
**مشکل:** StartNodeData inputs و EndNodeData outputs اجباری‌اند ولی default data ندارند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/038-start-end-data-type.unit.test.ts`؛ داده حداقلی مربوط به `src/types/nodes.ts + EditorCanvas.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/038-start-end-data-type.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 39. AllNodeData union در updateNodeData enforce نمی‌شود

**دسته:** Type Safety  
**محل/شاهد:** `src/types/nodes.ts + flowStore.ts`  
**مشکل:** هر partial data ممکن است روی هر node اعمال شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/039-allnodedata-union-updatenodedata-enforce.unit.test.ts`؛ داده حداقلی مربوط به `src/types/nodes.ts + flowStore.ts` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/039-allnodedata-union-updatenodedata-enforce.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 40. NodeTypeDefinition رنگ دارد اما UI خودش رنگ hardcode دارد

**دسته:** Design System  
**محل/شاهد:** `src/constants/nodeTypes.ts + nodes`  
**مشکل:** color/bgColor/borderColor/headerColor منبع حقیقت نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/040-nodetypedefinition-ui-hardcode.unit.test.ts`؛ داده حداقلی مربوط به `src/constants/nodeTypes.ts + nodes` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/040-nodetypedefinition-ui-hardcode.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 41. allowJs=true در TS config فعال است

**دسته:** TypeScript  
**محل/شاهد:** `tsconfig.json`  
**مشکل:** برای پروژه TS strict، allowJs باعث ورود JS کنترل‌نشده می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/041-allowjs-true-ts-config.unit.test.ts`؛ داده حداقلی مربوط به `tsconfig.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/041-allowjs-true-ts-config.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 42. skipLibCheck=true خطاهای library را پنهان می‌کند

**دسته:** TypeScript  
**محل/شاهد:** `tsconfig.json`  
**مشکل:** برای پروژه حساس بهتر است حداقل در CI strict pass جدا داشته باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/042-skiplibcheck-true-library.unit.test.ts`؛ داده حداقلی مربوط به `tsconfig.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/042-skiplibcheck-true-library.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 43. script typecheck وجود ندارد

**دسته:** DX/CI  
**محل/شاهد:** `package.json`  
**مشکل:** فقط lint/build/start/dev تعریف شده‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/043-script-typecheck.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/043-script-typecheck.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 44. تست framework نصب/تنظیم نشده

**دسته:** Testing  
**محل/شاهد:** `package.json`  
**مشکل:** Vitest/Testing Library/Playwright در dependencyها نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/044-framework.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/044-framework.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 45. lint script فقط eslint است

**دسته:** DX  
**محل/شاهد:** `package.json`  
**مشکل:** lint هیچ مسیر، max-warnings یا CI mode مشخصی ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/045-lint-script-eslint.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/045-lint-script-eslint.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 46. shadcn به عنوان dependency runtime نصب شده

**دسته:** Library Hygiene  
**محل/شاهد:** `package.json`  
**مشکل:** shadcn معمولاً CLI/tooling است نه runtime UI primitive.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/046-shadcn-dependency-runtime.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/046-shadcn-dependency-runtime.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 47. Base UI dependency هست ولی مصرف واضحی دیده نمی‌شود

**دسته:** Bundle Hygiene  
**محل/شاهد:** `package.json`  
**مشکل:** @base-ui/react نصب شده اما در فایل‌های بررسی‌شده استفاده نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/047-base-ui-dependency.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/047-base-ui-dependency.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 48. Radix Slot dependency هست ولی مصرف واضحی دیده نمی‌شود

**دسته:** Bundle Hygiene  
**محل/شاهد:** `package.json`  
**مشکل:** @radix-ui/react-slot نصب شده اما در فایل‌های بررسی‌شده استفاده نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/048-radix-slot-dependency.unit.test.ts`؛ داده حداقلی مربوط به `package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/048-radix-slot-dependency.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 49. next/image config هست ولی Image component استفاده نشده

**دسته:** Image Performance  
**محل/شاهد:** `next.config.ts + marketplace`  
**مشکل:** remotePatterns تنظیم شده اما img خام استفاده می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/049-next-image-config-image-component.unit.test.ts`؛ داده حداقلی مربوط به `next.config.ts + marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/049-next-image-config-image-component.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 50. metadata عمومی و ضعیف است

**دسته:** SEO/Brand  
**محل/شاهد:** `src/app/layout.tsx`  
**مشکل:** title/description فقط Agent Builder است و marketplace/sonora را پوشش نمی‌دهد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/050-metadata.unit.test.ts`؛ داده حداقلی مربوط به `src/app/layout.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/050-metadata.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---
