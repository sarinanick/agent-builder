# Agent Builder Front-end Audit — فایل 8/8 — موارد 351 تا 400

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


## 351. Node registry کامل نیست

**دسته:** Architecture  
**محل/شاهد:** `constants/nodeTypes + nodes + panels`  
**مشکل:** definition/default/component/panel/validation جدا جدا هستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/351-node-registry.unit.test.ts`؛ داده حداقلی مربوط به `constants/nodeTypes + nodes + panels` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/351-node-registry.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 352. Schema validation layer ندارد

**دسته:** Architecture  
**محل/شاهد:** `nodes/panels/export`  
**مشکل:** Zod/Valibot برای node data نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/352-schema-validation-layer.unit.test.ts`؛ داده حداقلی مربوط به `nodes/panels/export` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/352-schema-validation-layer.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 353. Workflow validation report ندارد

**دسته:** Product  
**محل/شاهد:** `flowStore/export`  
**مشکل:** قبل Preview/Deploy validation summary نشان داده نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/353-workflow-validation-report.unit.test.ts`؛ داده حداقلی مربوط به `flowStore/export` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/353-workflow-validation-report.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 354. Export pipeline واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `CodeModal`  
**مشکل:** graph به کد executable تبدیل نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/354-export-pipeline.unit.test.ts`؛ داده حداقلی مربوط به `CodeModal` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/354-export-pipeline.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 355. Deploy pipeline واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `DeployModal`  
**مشکل:** هیچ deployment provider/action پیاده نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/355-deploy-pipeline.unit.test.ts`؛ داده حداقلی مربوط به `DeployModal` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/355-deploy-pipeline.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 356. Preview runner واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `PreviewModal`  
**مشکل:** workflow execution simulator/runner ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/356-preview-runner.unit.test.ts`؛ داده حداقلی مربوط به `PreviewModal` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/356-preview-runner.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 357. Versioning واقعی ندارد

**دسته:** Product  
**محل/شاهد:** `TopToolbar`  
**مشکل:** v1/v2/v3 فقط local state است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/357-versioning.unit.test.ts`؛ داده حداقلی مربوط به `TopToolbar` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/357-versioning.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 358. Project persistence ندارد

**دسته:** Product  
**محل/شاهد:** `stores`  
**مشکل:** workflow و projectName refresh را survive نمی‌کنند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/358-project-persistence.unit.test.ts`؛ داده حداقلی مربوط به `stores` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/358-project-persistence.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 359. Save/restore از React Flow JSON ندارد

**دسته:** Product  
**محل/شاهد:** `stores`  
**مشکل:** ReactFlowJsonObject export/import نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/359-save-restore-react-flow-json.unit.test.ts`؛ داده حداقلی مربوط به `stores` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/359-save-restore-react-flow-json.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 360. Undo/redo command abstraction ندارد

**دسته:** Architecture  
**محل/شاهد:** `flowStore`  
**مشکل:** هر mutation مستقیم snapshot می‌گیرد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/360-undo-redo-command-abstraction.unit.test.ts`؛ داده حداقلی مربوط به `flowStore` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/360-undo-redo-command-abstraction.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 361. History batching ندارد

**دسته:** UX  
**محل/شاهد:** `flowStore`  
**مشکل:** drag/typing batching تعریف نشده.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/361-history-batching.unit.test.ts`؛ داده حداقلی مربوط به `flowStore` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/361-history-batching.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 362. Collaboration/locking strategy ندارد

**دسته:** Product  
**محل/شاهد:** `project`  
**مشکل:** اگر چند کاربر/نسخه بیاید conflict handling نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/362-collaboration-locking-strategy.unit.test.ts`؛ داده حداقلی مربوط به `project` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/362-collaboration-locking-strategy.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 363. Error boundary برای canvas ندارد

**دسته:** Reliability  
**محل/شاهد:** `EditorCanvas`  
**مشکل:** خرابی یک node کل editor را می‌شکند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/363-error-boundary-canvas.unit.test.ts`؛ داده حداقلی مربوط به `EditorCanvas` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/363-error-boundary-canvas.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Canvas/E2E: با Playwright مسیر drag/drop/connect/select/delete را تست کن؛ برای jsdom هم ResizeObserver و DOMRect mock لازم است.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 364. Node rendering memoization ندارد

**دسته:** Performance  
**محل/شاهد:** `nodes`  
**مشکل:** node components React.memo نشده‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/364-node-rendering-memoization.unit.test.ts`؛ داده حداقلی مربوط به `nodes` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/364-node-rendering-memoization.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 365. Selectors shallow equality ندارند

**دسته:** Performance  
**محل/شاهد:** `stores/components`  
**مشکل:** چند selector جدا خوب است اما بعضی derived محاسبات memo نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/365-selectors-shallow-equality.unit.test.ts`؛ داده حداقلی مربوط به `stores/components` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/365-selectors-shallow-equality.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 366. Sidebar filteredCategories memo نیست

**دسته:** Performance  
**محل/شاهد:** `Sidebar.tsx`  
**مشکل:** هر render map/filter دوباره اجرا می‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/366-sidebar-filteredcategories-memo.unit.test.ts`؛ داده حداقلی مربوط به `Sidebar.tsx` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/366-sidebar-filteredcategories-memo.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 367. Marketplace filterItems state-effect pattern پیچیده است

**دسته:** Architecture  
**محل/شاهد:** `Marketplace`  
**مشکل:** به جای useMemo/URL state از effect setter استفاده شده.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/367-marketplace-filteritems-state-effect-pat.unit.test.ts`؛ داده حداقلی مربوط به `Marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/367-marketplace-filteritems-state-effect-pat.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 368. URL-driven state وجود ندارد

**دسته:** UX  
**محل/شاهد:** `builder/marketplace`  
**مشکل:** selected node/view/filter/version shareable نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/368-url-driven-state.unit.test.ts`؛ داده حداقلی مربوط به `builder/marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/368-url-driven-state.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 369. Search debounce ندارد

**دسته:** Performance  
**محل/شاهد:** `sidebar/marketplace`  
**مشکل:** هر keypress filter فوری است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/369-search-debounce.unit.test.ts`؛ داده حداقلی مربوط به `sidebar/marketplace` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/369-search-debounce.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 370. Virtualization وجود ندارد

**دسته:** Performance  
**محل/شاهد:** `marketplace/sidebar maybe`  
**مشکل:** لیست کارت‌ها/نودها در scale بالا virtual نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/370-virtualization.unit.test.ts`؛ داده حداقلی مربوط به `marketplace/sidebar maybe` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/370-virtualization.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 371. Large workflow performance strategy ندارد

**دسته:** Performance  
**محل/شاهد:** `canvas`  
**مشکل:** hundreds nodes/edges با minimap/animated edges کنترل نشده.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/371-large-workflow-performance-strategy.unit.test.ts`؛ داده حداقلی مربوط به `canvas` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/371-large-workflow-performance-strategy.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 372. Accessibility design spec نوشته نشده

**دسته:** Process  
**محل/شاهد:** `docs/design`  
**مشکل:** agent نمی‌داند حداقل‌های aria/focus/keyboard چیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/372-accessibility-design-spec.unit.test.ts`؛ داده حداقلی مربوط به `docs/design` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/372-accessibility-design-spec.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 373. Color system spec نوشته نشده

**دسته:** Process  
**محل/شاهد:** `docs/design`  
**مشکل:** نور، رنگ، elevation، semantic tokens مستند نیستند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/373-color-system-spec.unit.test.ts`؛ داده حداقلی مربوط به `docs/design` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/373-color-system-spec.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 374. Component acceptance criteria ندارید

**دسته:** Process  
**محل/شاهد:** `docs/testing`  
**مشکل:** تعریف done برای button/modal/node مشخص نیست.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/374-component-acceptance-criteria.unit.test.ts`؛ داده حداقلی مربوط به `docs/testing` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/374-component-acceptance-criteria.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 375. Migration plan برای تغییر رنگ/نور وجود ندارد

**دسته:** Process  
**محل/شاهد:** `CSS/UI`  
**مشکل:** تعویض گسترده رنگ بدون breaking plan خطرناک است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/375-migration-plan.unit.test.ts`؛ داده حداقلی مربوط به `CSS/UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/375-migration-plan.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 376. No visual inventory

**دسته:** Process  
**محل/شاهد:** `UI`  
**مشکل:** لیست همه button/input/card/modal/node قبل تغییر وجود ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/376-no-visual-inventory.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/376-no-visual-inventory.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 377. No regression checklist برای ۸ دسته

**دسته:** Process  
**محل/شاهد:** `QA`  
**مشکل:** بعد هر ۵۰ تغییر checklist جدا نیاز است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/377-no-regression-checklist.unit.test.ts`؛ داده حداقلی مربوط به `QA` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/377-no-regression-checklist.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 378. No PR slicing strategy

**دسته:** Process  
**محل/شاهد:** `Repo`  
**مشکل:** ۴۰۰ تغییر باید در PRهای کوچک تقسیم شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/378-no-pr-slicing-strategy.unit.test.ts`؛ داده حداقلی مربوط به `Repo` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/378-no-pr-slicing-strategy.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 379. No codemod/refactor guide

**دسته:** Process  
**محل/شاهد:** `Repo`  
**مشکل:** تبدیل inline styles به tokens باید دستورالعمل داشته باشد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/379-no-codemod-refactor-guide.unit.test.ts`؛ داده حداقلی مربوط به `Repo` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/379-no-codemod-refactor-guide.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 380. No lint rules برای no-inline-style/no-any

**دسته:** Quality Gate  
**محل/شاهد:** `ESLint`  
**مشکل:** هر تغییری دوباره inline style و any وارد می‌کند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/380-no-lint-rules-no-inline-style-no-any.unit.test.ts`؛ داده حداقلی مربوط به `ESLint` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/380-no-lint-rules-no-inline-style-no-any.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 381. No import boundary rules

**دسته:** Quality Gate  
**محل/شاهد:** `Architecture`  
**مشکل:** components می‌توانند آزادانه store/lib را mix کنند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/381-no-import-boundary-rules.unit.test.ts`؛ داده حداقلی مربوط به `Architecture` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/381-no-import-boundary-rules.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 382. No dependency hygiene policy

**دسته:** Quality Gate  
**محل/شاهد:** `package`  
**مشکل:** dependency بلااستفاده enforce نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/382-no-dependency-hygiene-policy.unit.test.ts`؛ داده حداقلی مربوط به `package` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/382-no-dependency-hygiene-policy.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 383. No mock/service abstraction

**دسته:** Architecture  
**محل/شاهد:** `marketplace/Sonora`  
**مشکل:** mock data با UI قاطی است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/383-no-mock-service-abstraction.unit.test.ts`؛ داده حداقلی مربوط به `marketplace/Sonora` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/383-no-mock-service-abstraction.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 384. No analytics/telemetry events

**دسته:** Observability  
**محل/شاهد:** `UX`  
**مشکل:** copy/deploy/preview/error events ثبت نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/384-no-analytics-telemetry-events.unit.test.ts`؛ داده حداقلی مربوط به `UX` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/384-no-analytics-telemetry-events.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 385. No error/toast design for failed actions

**دسته:** Reliability  
**محل/شاهد:** `UI`  
**مشکل:** clipboard/share/download/deploy failure UI ندارد.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/385-no-error-toast-design-for-failed-actions.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/385-no-error-toast-design-for-failed-actions.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 386. No loading/skeleton design system

**دسته:** Design System  
**محل/شاهد:** `UI`  
**مشکل:** Loader فقط spinner generic است.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/386-no-loading-skeleton-design-system.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/386-no-loading-skeleton-design-system.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 387. No empty state design system

**دسته:** Design System  
**محل/شاهد:** `UI`  
**مشکل:** empty states پراکنده و hardcoded هستند.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/387-no-empty-state-design-system.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/387-no-empty-state-design-system.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 388. No responsive breakpoint spec

**دسته:** Design System  
**محل/شاهد:** `UI`  
**مشکل:** md/lg arbitrary و بدون spec محصول است.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/388-no-responsive-breakpoint-spec.unit.test.ts`؛ داده حداقلی مربوط به `UI` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/388-no-responsive-breakpoint-spec.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 389. No RTL layout contract

**دسته:** Design System  
**محل/شاهد:** `i18n`  
**مشکل:** logical properties و آیکون جهت‌دار policy ندارند.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/389-no-rtl-layout-contract.unit.test.ts`؛ داده حداقلی مربوط به `i18n` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/389-no-rtl-layout-contract.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 390. No final release gate

**دسته:** Process  
**محل/شاهد:** `CI/QA`  
**مشکل:** قبل deploy باید lint/type/test/e2e/a11y/visual/build همگی gate شوند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/390-no-final-release-gate.unit.test.ts`؛ داده حداقلی مربوط به `CI/QA` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/390-no-final-release-gate.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 391. No design token migration tests

**دسته:** Testing/Design  
**محل/شاهد:** `src/styles/tokens.css`  
**مشکل:** تبدیل رنگ‌ها به token بدون تست regression انجام می‌شود.

### راه‌حل اجرایی برای agent

1) این مورد را به design-system منتقل کن، نه اینکه patch موضعی بزنی. یک فایل token مرکزی بساز: `src/styles/tokens.css` و رنگ‌ها را به semantic token تبدیل کن: `--surface-canvas`, `--surface-panel`, `--surface-card`, `--text-primary`, `--text-muted`, `--accent-primary`, `--accent-danger`, `--focus-ring`, `--border-subtle`, `--shadow-raised`.
2) همه inline colorها و hex/oklch پراکنده را با token جایگزین کن. دکمه‌ها را از کامپوننت مشترک `Button` با variantهای `primary`, `secondary`, `ghost`, `danger`, `icon`, `soft`, `link` بساز.
3) نور و سایه را بازطراحی کن: پس‌زمینه canvas باید مات و آرام باشد؛ panel/card باید یک درجه روشن‌تر از canvas باشد؛ CTA اصلی فقط یک رنگ accent داشته باشد؛ hover نباید فقط opacity باشد، باید background/border/elevation کنترل‌شده داشته باشد.
4) برای reduced motion یک media query عمومی اضافه کن و animationهای غیرضروری را خاموش کن.

### دستور UI / نور / رنگ / دکمه / المان

- ظاهر را با design system جدید هماهنگ کن: هیچ رنگ inline جدید اضافه نکن؛ از token و component مشترک استفاده کن.
- فاصله‌ها را با scale 4px/8px تنظیم کن؛ border-radius و shadow را از token بگیر.
- برای هر interaction حالت‌های default/hover/focus/active/disabled/loading را تعریف کن.
- برای فارسی و RTL از logical properties استفاده کن، مثل `ps-*`, `pe-*`, `start`, `end` به جای left/right تا UI نشکند.

### تست‌نویسی اجباری

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/391-no-design-token-migration-tests.unit.test.ts`؛ داده حداقلی مربوط به `src/styles/tokens.css` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/391-no-design-token-migration-tests.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 392. No button inventory codemod

**دسته:** Refactor  
**محل/شاهد:** `components`  
**مشکل:** دکمه‌های پراکنده بدون برنامه مهاجرت به Button مشترک می‌مانند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/392-no-button-inventory-codemod.unit.test.ts`؛ داده حداقلی مربوط به `components` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/392-no-button-inventory-codemod.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 393. No inline style audit

**دسته:** Quality Gate  
**محل/شاهد:** `src`  
**مشکل:** inline styleها بعد refactor دوباره وارد کد می‌شوند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/393-no-inline-style-audit.unit.test.ts`؛ داده حداقلی مربوط به `src` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/393-no-inline-style-audit.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 394. No no-any enforcement

**دسته:** Quality Gate  
**محل/شاهد:** `tsconfig/eslint`  
**مشکل:** استفاده از any در nodeها و panelها با lint gate ممنوع نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/394-no-no-any-enforcement.unit.test.ts`؛ داده حداقلی مربوط به `tsconfig/eslint` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/394-no-no-any-enforcement.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 395. No route-level metadata strategy

**دسته:** SEO/Architecture  
**محل/شاهد:** `src/app`  
**مشکل:** هر route title/description و social metadata خودش را ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/395-no-route-level-metadata-strategy.unit.test.ts`؛ داده حداقلی مربوط به `src/app` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/395-no-route-level-metadata-strategy.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 396. No browser support matrix

**دسته:** QA  
**محل/شاهد:** `docs/qa`  
**مشکل:** Safari/Firefox/Chrome/mobile تفاوت‌های scrollbar/drag/drop تست نشده‌اند.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/396-no-browser-support-matrix.unit.test.ts`؛ داده حداقلی مربوط به `docs/qa` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/396-no-browser-support-matrix.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 397. No performance budget

**دسته:** Performance  
**محل/شاهد:** `next/bundle`  
**مشکل:** حداکثر JS/CSS/animation budget تعریف نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/397-no-performance-budget.unit.test.ts`؛ داده حداقلی مربوط به `next/bundle` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/397-no-performance-budget.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 398. No accessibility acceptance checklist per component

**دسته:** A11y Process  
**محل/شاهد:** `docs/qa`  
**مشکل:** برای Button/Dialog/Field/Card/Node چک‌لیست دسترسی‌پذیری جدا وجود ندارد.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/398-no-accessibility-acceptance-checklist-pe.unit.test.ts`؛ داده حداقلی مربوط به `docs/qa` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: با Testing Library فایل `src/__tests__/audit/398-no-accessibility-acceptance-checklist-pe.component.test.tsx` بساز؛ component مربوط را render کن، با `userEvent` تعامل واقعی انجام بده، role/name/focus/disabled/error را assert کن.
- A11y: با `jest-axe` assert کن `expect(await axe(container)).toHaveNoViolations()`؛ همچنین keyboard-only path را با Tab/Enter/Escape تست کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 399. No visual QA before/after screenshots

**دسته:** Visual QA  
**محل/شاهد:** `docs/qa`  
**مشکل:** برای تغییر نور و رنگ baseline قبل/بعد ذخیره نمی‌شود.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/399-no-visual-qa-before-after-screenshots.unit.test.ts`؛ داده حداقلی مربوط به `docs/qa` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/399-no-visual-qa-before-after-screenshots.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Visual: با Playwright screenshot برای dark و light و RTL بگیر؛ threshold کوچک بگذار و تغییر رنگ/نور را intentional snapshot update کن.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---


## 400. No rollback plan for massive UI rewrite

**دسته:** Release Process  
**محل/شاهد:** `docs/release`  
**مشکل:** اگر بازطراحی رنگ/دکمه/المان‌ها خراب شد، rollback scoped تعریف نشده است.

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

- Unit/Type: یک تست fail-first بساز: `src/__tests__/audit/400-no-rollback-plan-for-massive-ui-rewrite.unit.test.ts`؛ داده حداقلی مربوط به `docs/release` را بساز و assert کن که رفتار جدید بدون mutation و با خروجی deterministic کار می‌کند.
- Component: اگر UI دارد، تست render و interaction در `src/__tests__/audit/400-no-rollback-plan-for-massive-ui-rewrite.component.test.tsx` بنویس؛ اگر UI ندارد، test را روی public API همان module نگه دار.
- Regression: تستی بنویس که قبل از fix fail شود و بعد از fix سبز شود؛ فقط snapshot بزرگ قبول نیست.
- QA command: بعد از پیاده‌سازی اجرا کن: `npm run typecheck && npm run lint && npm run test -- --run && npm run test:e2e`؛ اگر visual test اضافه شد `npm run test:visual` را هم اجرا کن.

### معیار پذیرش

- مشکل بدون regression رفع شده باشد.
- هیچ inline color/style غیرضروری اضافه نشده باشد.
- تست‌های مرتبط fail-first بوده و بعد از fix سبز شوند.
- UI در dark، light، mobile و RTL قابل استفاده باشد.

---
