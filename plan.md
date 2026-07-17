# План: підсвітка синтаксису в документації та по всьому сайту

## Контекст

Зараз усі блоки коду на сайті рендеряться як монохромний `<pre><code>` — без
підсвітки токенів (див. скріншот з JSON-манфестом у docs). Код показується у двох
місцях:

1. **Docs** — компонент `src/components/docs/CodeBlock.tsx` (`code: string`), який
   викликається ~40 разів на сторінках `src/app/(main)/docs/**` (bash-команди, JSON,
   TOML/manifest, MCP-конфіги). Наразі приймає лише `code`, без мови.
2. **README / markdown** — `src/components/templates/TemplateReadme.tsx` рендерить
   `react-markdown` (v10) з `remarkGfm` + `rehypeRaw` + `rehypeSanitize`. Fenced-блоки
   (```json тощо) теж без підсвітки. README тягнеться клієнтським хуком
   `useTemplateReadme` (react-query), тож рендер **клієнтський і динамічний**.

Мета: єдина, консистентна підсвітка в обох місцях, з коректним світлим/темним
режимом (сайт використовує oklch CSS-змінні + `@custom-variant dark` у
`src/app/globals.css`).

## Підхід: єдиний рушій — highlight.js

Обираю **highlight.js** (а не Shiki), бо:

- `rehype-highlight` синхронний і вставляється прямо в наявний масив `rehypePlugins`
  у `TemplateReadme` — жодних async-проблем, які виникли б із Shiki на клієнтському
  `react-markdown`.
- `hljs.highlight()` теж синхронний → працює і в docs `CodeBlock` без async/flash.
- Обидва шляхи дають однакові класи `hljs-*` → **одна тема через CSS-змінні** для
  світлого й темного режимів.

Тема Shiki була б трохи якіснішою, але потягнула б два різні рушії/потоки для
статичного та клієнтського контенту — зайва складність.

## Зміни

### 1. Залежності
- Додати `highlight.js` та `rehype-highlight` (`npm i highlight.js rehype-highlight`).

### 2. Тема токенів — `src/app/globals.css`
- Додати блок стилів для `.hljs`, `.hljs-keyword`, `.hljs-string`, `.hljs-number`,
  `.hljs-comment`, `.hljs-title`, `.hljs-attr`, `.hljs-literal` тощо, прив'язавши
  кольори до існуючих oklch-змінних (акценти на базі `--primary`, приглушені —
  `--muted-foreground`). Один набір правил, що коректно виглядає і в `.dark`.
- Прибрати дефолтний фон hljs — блоки вже мають свій `bg-muted`.

### 3. Docs `CodeBlock` — `src/components/docs/CodeBlock.tsx`
- Додати проп `lang?: string` (дефолт `"bash"`, бо більшість прикладів — CLI).
- Мемоізовано викликати `hljs.highlight(code, { language })` з fallback на
  `plaintext`, якщо `hljs.getLanguage(lang)` не знайдено; вставляти результат через
  `dangerouslySetInnerHTML` у `<code className="hljs ...">`.
- Використовувати `highlight.js/lib/core` + реєстрація лише потрібних мов
  (bash/shell, json, toml, typescript, yaml) — щоб не роздувати клієнтський бандл.
- Кнопка Copy лишається без змін (копіює сирий `code`).

### 4. Проставити мови на місцях виклику
- У ~40 викликах `<CodeBlock code={...} />` (`src/app/(main)/docs/**/page.tsx`,
  напр. `docs/addons/creating/page.tsx`, `docs/page.tsx`, `docs/ai-agents/page.tsx`,
  `docs/stacks/page.tsx`) додати `lang` там, де це не bash: `lang="json"` для
  manifest/MCP-конфігів, `lang="toml"` за потреби. Bash-приклади лишаються на дефолті.
- `CommandRef` (`src/components/docs/CommandRef.tsx`) використовує `CodeBlock` →
  успадковує підсвітку автоматично (example — bash, дефолт підходить).

### 5. README markdown — `src/components/templates/TemplateReadme.tsx`
- Додати `rehypeHighlight` у `rehypePlugins`. Порядок: `rehypeRaw` →
  `rehypeHighlight` → `rehypeSanitize` (санітизація останньою для безпеки).
- **Важливо (edge case):** `rehype-sanitize` за замовчуванням вирізає `className`.
  Розширити `readmeSanitizeSchema`, дозволивши `className` на `code` та `span`
  (класи `hljs-*`), інакше підсвітка зникне. Existing override компонентів `pre`/
  `code` лишається; додати `[&_.hljs]:bg-transparent`, щоб не було подвійного фону.

### 6. Решта сайту (перевірити, здебільшого поза скоупом)
- `BadgeSnippet`, `AddonCommands`, `CommandCard` — це короткі однорядкові
  сніпети/бейджі, не багаторядковий код; лишаємо без підсвітки (за бажанням пізніше).

## Тести
- `src/test/components/docs/CodeBlock.test.tsx` — тест `getByText('{ "name": "anesis" }')`
  **зламається**, бо highlight розбиває текст на `<span>`. Оновити: перевіряти через
  `container.querySelector("code.hljs")` та `textContent`, а тест copy лишити як є.

## Верифікація
1. `npm run typecheck` — типи чисті.
2. `npm run test` — зокрема оновлений `CodeBlock.test.tsx`.
3. `npm run dev` → відкрити `/docs/templates/creating` (JSON-manifest зі скріншота):
   ключі/рядки/числа підсвічені; перемкнути тему — кольори читабельні в обох.
4. Відкрити сторінку template/addon з README, що має fenced-блоки коду
   (`/templates/...` або `/addons/registry/...`) → підсвітка у markdown працює,
   класи не вирізані санітайзером.

## Примітка щодо plan.md
Ти просив продублювати план у `plan.md` в корені репозиторію. У режимі планування
мені дозволено писати лише в цей файл плану, тож `plan.md` створю першим кроком уже
після перемикання режиму.
