# Agent Builder Front-end Audit — فایل 4/8 — موارد 151 تا 200

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


## 151. PropertiesPanel data casts any دارد

**دسته:** Type Safety  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** هر panel با data={selectedNode.data as any} فراخوانی می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/151-propertiespanel-data-casts-any.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/151-propertiespanel-data-casts-any.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 152. label input id/htmlFor ندارد

**دسته:** A11y/Form  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** label به input متصل نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/152-label-input-id-htmlfor.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/152-label-input-id-htmlfor.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 153. description input validation ندارد

**دسته:** Form UX  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** طول، empty، sanitize و helper text ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/153-description-input-validation.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/153-description-input-validation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 154. delete node destructive confirmation ندارد

**دسته:** Safety UX  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** حذف فوری است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/154-delete-node-destructive-confirmation.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/154-delete-node-destructive-confirmation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 155. close/delete buttons aria-label ندارند

**دسته:** A11y  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** فقط title/delete icon است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/155-close-delete-buttons-aria-label.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/155-close-delete-buttons-aria-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 156. panel header overflow کنترل نشده

**دسته:** UI  
**محل/شاهد:** `PropertiesPanel.tsx`  
**مشکل:** labelهای بلند header را می‌شکنند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/156-panel-header-overflow.unit.test.ts`؛ داده حداقلی مربوط به `PropertiesPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/156-panel-header-overflow.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 157. AgentPanel model list hardcoded است

**دسته:** Data/Library  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** لیست مدل‌ها از config/versioned registry نمی‌آید.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/157-agentpanel-model-list-hardcoded.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/157-agentpanel-model-list-hardcoded.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 158. AgentPanel مدل‌های قدیمی دارد

**دسته:** Product Accuracy  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** gpt-3.5-turbo/gpt-4-turbo برای UX فعلی گیج‌کننده‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/158-agentpanel.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/158-agentpanel.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 159. AgentPanel tools با node types sync نیست

**دسته:** Data Consistency  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** webSearch/codeInterpreter در node definitions نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/159-agentpanel-tools-node-types-sync.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/159-agentpanel-tools-node-types-sync.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 160. AgentPanel tool button aria-pressed ندارد

**دسته:** A11y  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** toggle state فقط رنگی است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/160-agentpanel-tool-button-aria-pressed.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/160-agentpanel-tool-button-aria-pressed.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 161. AgentPanel clipboard/validation ندارد

**دسته:** Form UX  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** instructions طول، required و helper ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/161-agentpanel-clipboard-validation.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/161-agentpanel-clipboard-validation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 162. Temperature helper فقط دقیق/خلاقانه است

**دسته:** UX  
**محل/شاهد:** `AgentPanel.tsx`  
**مشکل:** مقدار واقعی و presetها توضیح کافی ندارند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/162-temperature-helper.unit.test.ts`؛ داده حداقلی مربوط به `AgentPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/162-temperature-helper.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 163. ConditionPanel CEL validation ندارد

**دسته:** Validation  
**محل/شاهد:** `ConditionPanel.tsx`  
**مشکل:** syntax و empty state بررسی نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/163-conditionpanel-cel-validation.unit.test.ts`؛ داده حداقلی مربوط به `ConditionPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/163-conditionpanel-cel-validation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 164. Condition true/false labels محدودیت ندارند

**دسته:** Form UX  
**محل/شاهد:** `ConditionPanel.tsx`  
**مشکل:** label خالی یا خیلی بلند ممکن است canvas را خراب کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/164-condition-true-false-labels.unit.test.ts`؛ داده حداقلی مربوط به `ConditionPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/164-condition-true-false-labels.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 165. While condition validation ندارد

**دسته:** Validation  
**محل/شاهد:** `WhilePanel.tsx`  
**مشکل:** شرط empty یا invalid پذیرفته می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/165-while-condition-validation.unit.test.ts`؛ داده حداقلی مربوط به `WhilePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/165-while-condition-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 166. While maxIterations NaN/حد کنترل ضعیف دارد

**دسته:** Validation  
**محل/شاهد:** `WhilePanel.tsx`  
**مشکل:** parseInt fallback ساده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/166-while-maxiterations-nan.unit.test.ts`؛ داده حداقلی مربوط به `WhilePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/166-while-maxiterations-nan.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 167. Transform schema JSON validation ندارد

**دسته:** Validation  
**محل/شاهد:** `TransformPanel.tsx`  
**مشکل:** input/output schema textarea بدون parse/error است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/167-transform-schema-json-validation.unit.test.ts`؛ داده حداقلی مربوط به `TransformPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/167-transform-schema-json-validation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 168. Transform code editor خام است

**دسته:** DX/UI  
**محل/شاهد:** `TransformPanel.tsx`  
**مشکل:** کد transformation داخل textarea بدون highlighting/lint است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/168-transform-code-editor.unit.test.ts`؛ داده حداقلی مربوط به `TransformPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/168-transform-code-editor.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 169. SetStatePanel key=index دارد

**دسته:** React List  
**محل/شاهد:** `SetStatePanel.tsx`  
**مشکل:** حذف/جابجایی variable ممکن است state input را اشتباه نگه دارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/169-setstatepanel-key-index.unit.test.ts`؛ داده حداقلی مربوط به `SetStatePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/169-setstatepanel-key-index.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 170. SetStatePanel variable validation ندارد

**دسته:** Validation  
**محل/شاهد:** `SetStatePanel.tsx`  
**مشکل:** نام متغیر، scope و value اعتبارسنجی نمی‌شوند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/170-setstatepanel-variable-validation.unit.test.ts`؛ داده حداقلی مربوط به `SetStatePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/170-setstatepanel-variable-validation.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 171. SetStatePanel remove aria-label ندارد

**دسته:** A11y  
**محل/شاهد:** `SetStatePanel.tsx`  
**مشکل:** دکمه trash فقط icon است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/171-setstatepanel-remove-aria-label.unit.test.ts`؛ داده حداقلی مربوط به `SetStatePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/171-setstatepanel-remove-aria-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 172. FileSearch vectorStoreId validation ندارد

**دسته:** Validation  
**محل/شاهد:** `FileSearchPanel.tsx`  
**مشکل:** فرمت vs_ چک نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/172-filesearch-vectorstoreid-validation.unit.test.ts`؛ داده حداقلی مربوط به `FileSearchPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/172-filesearch-vectorstoreid-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 173. FileSearch scoreThreshold NaN می‌شود

**دسته:** Validation  
**محل/شاهد:** `FileSearchPanel.tsx`  
**مشکل:** parseFloat بدون guard انجام می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/173-filesearch-scorethreshold-nan.unit.test.ts`؛ داده حداقلی مربوط به `FileSearchPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/173-filesearch-scorethreshold-nan.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 174. Guardrails regex validation ندارد

**دسته:** Validation  
**محل/شاهد:** `GuardrailsPanel.tsx`  
**مشکل:** pattern invalid ممکن است بعداً runtime crash بدهد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/174-guardrails-regex-validation.unit.test.ts`؛ داده حداقلی مربوط به `GuardrailsPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/174-guardrails-regex-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 175. Guardrails segmented buttons aria-pressed ندارند

**دسته:** A11y  
**محل/شاهد:** `GuardrailsPanel.tsx`  
**مشکل:** input/output/both فقط رنگی‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/175-guardrails-segmented-buttons-aria-presse.unit.test.ts`؛ داده حداقلی مربوط به `GuardrailsPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/175-guardrails-segmented-buttons-aria-presse.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 176. Mcp serverUrl validation ندارد

**دسته:** Validation  
**محل/شاهد:** `McpPanel.tsx`  
**مشکل:** URL خالی/invalid پذیرفته می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/176-mcp-serverurl-validation.unit.test.ts`؛ داده حداقلی مربوط به `McpPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/176-mcp-serverurl-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 177. Mcp parameters JSON validation ندارد

**دسته:** Validation  
**محل/شاهد:** `McpPanel.tsx`  
**مشکل:** JSON با textarea خام ذخیره می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/177-mcp-parameters-json-validation.unit.test.ts`؛ داده حداقلی مربوط به `McpPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/177-mcp-parameters-json-validation.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 178. HumanApproval timeout فقط range دارد

**دسته:** UX  
**محل/شاهد:** `HumanApprovalPanel.tsx`  
**مشکل:** input عددی مستقیم/preset/validation ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/178-humanapproval-timeout-range.unit.test.ts`؛ داده حداقلی مربوط به `HumanApprovalPanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/178-humanapproval-timeout-range.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 179. NotePanel color buttons aria-label ندارند

**دسته:** A11y  
**محل/شاهد:** `NotePanel.tsx`  
**مشکل:** دایره‌های رنگ بدون نام هستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/179-notepanel-color-buttons-aria-label.unit.test.ts`؛ داده حداقلی مربوط به `NotePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/179-notepanel-color-buttons-aria-label.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 180. NotePanel selected color فقط borderColor foreground دارد

**دسته:** Visual  
**محل/شاهد:** `NotePanel.tsx`  
**مشکل:** برای تم dark/light و color-blind کافی نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/180-notepanel-selected-color-bordercolor-for.unit.test.ts`؛ داده حداقلی مربوط به `NotePanel.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/180-notepanel-selected-color-bordercolor-for.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 181. Modal focus trap ندارد

**دسته:** A11y/Dialog  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** کاربر با Tab می‌تواند از dialog بیرون برود.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/181-modal-focus-trap.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/181-modal-focus-trap.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 182. Modal role و aria-modal ندارد

**دسته:** A11y/Dialog  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** semantics dialog ناقص است.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/182-modal-role-aria-modal.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/182-modal-role-aria-modal.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 183. Modal portal ندارد

**دسته:** Layering  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** داخل tree parent render می‌شود و stacking context ممکن است مشکل شود.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/183-modal-portal.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/183-modal-portal.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 184. Modal close focus restore ندارد

**دسته:** A11y/Dialog  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** بعد از بستن focus به trigger برنمی‌گردد.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/184-modal-close-focus-restore.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/184-modal-close-focus-restore.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 185. Modal overlay click accidental close دارد

**دسته:** UX  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** برای فرم‌های طولانی confirm/disableOverlayClose لازم است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/185-modal-overlay-click-accidental-close.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/185-modal-overlay-click-accidental-close.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 186. Modal body overflow قبلی را ذخیره نمی‌کند

**دسته:** UX  
**محل/شاهد:** `Modal.tsx`  
**مشکل:** document.body.style.overflow همیشه '' می‌شود.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/186-modal-body-overflow.unit.test.ts`؛ داده حداقلی مربوط به `Modal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/186-modal-body-overflow.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 187. CodeModal generated dependencies نصب نیستند

**دسته:** Export  
**محل/شاهد:** `CodeModal.tsx + package.json`  
**مشکل:** @openai/chatkit-react و openai در package نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/187-codemodal-generated-dependencies.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal.tsx + package.json` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/187-codemodal-generated-dependencies.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 188. CodeModal workflowJson در active code مصرف نمی‌شود

**دسته:** Export Correctness  
**محل/شاهد:** `CodeModal.tsx`  
**مشکل:** workflow export فقط نمایش داده می‌شود، نه تبدیل واقعی.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/188-codemodal-workflowjson-active-code.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/188-codemodal-workflowjson-active-code.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 189. CodeModal Date.now در render code دارد

**دسته:** Determinism  
**محل/شاهد:** `CodeModal.tsx`  
**مشکل:** هر render workflowId جدید داخل snippet تولید می‌کند.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/189-codemodal-date-now-render-code.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/189-codemodal-date-now-render-code.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 190. CodeModal tabs ARIA ندارند

**دسته:** A11y  
**محل/شاهد:** `CodeModal.tsx`  
**مشکل:** tablist/tab/tabpanel semantics نیست.

### راه‌حل اجرایی برای agent

1) این مورد را به عنوان blocker دسترسی‌پذیری اصلاح کن. برای هر کنترل interactive از element semantic واقعی (`button`, `input`, `dialog`, `nav`) استفاده کن؛ اگر مجبور به `div` شدی `role`, `tabIndex`, `aria-*` و keyboard handler کامل اضافه کن.
2) برای dialogها focus trap، focus restore، `role="dialog"`، `aria-modal="true"`، `aria-labelledby` و close با Escape را استاندارد کن.
3) برای icon-only buttonها حتماً `aria-label` فارسی/انگلیسی قابل ترجمه اضافه کن و `title` را به عنوان تنها منبع accessible name استفاده نکن.
4) هر state انتخابی را علاوه بر رنگ، با متن، آیکون، checkmark یا `aria-pressed/aria-current` مشخص کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/190-codemodal-tabs-aria.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/190-codemodal-tabs-aria.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 191. CodeModal clipboard error ندارد

**دسته:** Robustness  
**محل/شاهد:** `CodeModal.tsx`  
**مشکل:** navigator.clipboard failure catch نشده است.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/191-codemodal-clipboard-error.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/191-codemodal-clipboard-error.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 192. PreviewModal timeout cleanup ندارد

**دسته:** React Lifecycle  
**محل/شاهد:** `PreviewModal.tsx`  
**مشکل:** اگر modal بسته شود، setTimeout می‌تواند بعداً state update کند.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/192-previewmodal-timeout-cleanup.unit.test.ts`؛ داده حداقلی مربوط به `PreviewModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/192-previewmodal-timeout-cleanup.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 193. PreviewModal chat auto-scroll ندارد

**دسته:** UX  
**محل/شاهد:** `PreviewModal.tsx`  
**مشکل:** پیام جدید تضمین‌شده visible نیست.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/193-previewmodal-chat-auto-scroll.unit.test.ts`؛ داده حداقلی مربوط به `PreviewModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/193-previewmodal-chat-auto-scroll.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 194. PreviewModal response workflow-aware نیست

**دسته:** Product  
**محل/شاهد:** `PreviewModal.tsx`  
**مشکل:** پاسخ شبیه‌سازی‌شده به graph واقعی ربطی ندارد.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/194-previewmodal-response-workflow-aware.unit.test.ts`؛ داده حداقلی مربوط به `PreviewModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/194-previewmodal-response-workflow-aware.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 195. DeployModal optionها action ندارند

**دسته:** Product/UI  
**محل/شاهد:** `DeployModal.tsx`  
**مشکل:** همه گزینه‌ها button نمایشی هستند.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/195-deploymodal-option-action.unit.test.ts`؛ داده حداقلی مربوط به `DeployModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/195-deploymodal-option-action.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 196. DeployModal external link icon فریبنده است

**دسته:** UX  
**محل/شاهد:** `DeployModal.tsx`  
**مشکل:** ExternalLink نمایش داده می‌شود اما لینک/اکشن خارجی نیست.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/196-deploymodal-external-link-icon.unit.test.ts`؛ داده حداقلی مربوط به `DeployModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/196-deploymodal-external-link-icon.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 197. DeployModal publish dependency fake است

**دسته:** Product  
**محل/شاهد:** `DeployModal.tsx`  
**مشکل:** می‌گوید قبل deploy نسخه منتشر کنید اما publish flow وجود ندارد.

### راه‌حل اجرایی برای agent

1) این مشکل را با refactor کوچک و قابل تست حل کن؛ فقط patch سطحی نزن. ابتدا مسئولیت فایل را جدا کن، سپس API کامپوننت یا store را واضح کن.
2) هر مقدار hardcoded را به config/registry/token منتقل کن.
3) behavior را با acceptance criteria مشخص کن و قبل از تغییر UI، تست fail-first بنویس.
4) بعد از تغییر، lint، typecheck، unit/component و E2E مربوط را اجرا کن.

### دستور UI / نور / رنگ / دکمه / المان

- Dialog باید center یا sheet responsive باشد: desktop مرکز با max-width مشخص، mobile bottom-sheet یا full-screen.
- Overlay باید تاریک اما نه خفه‌کننده باشد؛ blur را محدود کن.
- Header شامل title، optional description، close button 40x40 و divider subtle باشد.
- Footer actionها باید primary/secondary واضح داشته باشند و دکمه destructive جدا باشد.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/197-deploymodal-publish-dependency-fake.unit.test.ts`؛ داده حداقلی مربوط به `DeployModal.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/197-deploymodal-publish-dependency-fake.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 198. Marketplace page بیش از حد طولانی است

**دسته:** Maintainability  
**محل/شاهد:** `src/app/marketplace/page.tsx`  
**مشکل:** یک فایل صدها خط UI و logic را با هم دارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/198-marketplace-page.unit.test.ts`؛ داده حداقلی مربوط به `src/app/marketplace/page.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/198-marketplace-page.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 199. ArtImage از img خام استفاده می‌کند

**دسته:** Image Performance  
**محل/شاهد:** `Marketplace page`  
**مشکل:** Next Image و sizes/placeholder استفاده نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/199-artimage-img.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace page` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/199-artimage-img.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 200. AvatarImage تکراری تعریف شده

**دسته:** DRY  
**محل/شاهد:** `Marketplace page + AvatarGroup`  
**مشکل:** دو fallback avatar image جداگانه وجود دارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/200-avatarimage.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace page + AvatarGroup` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/200-avatarimage.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---
