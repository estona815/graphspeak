# GraphSpeak

A local chart-reading learning prototype: compare a chart with the same recorded values as a table and explicit text. Built for consideration under AccessED Hacks. Local preparation is not event registration or submission.

Three original synthetic lessons cover a cropped bar-chart axis, percentage points versus relative percent change, and missing observations versus zero. Choose an answer to receive a specific explanation, change the chart presentation, or reset the current lesson. A hypothetical zero is labeled and never replaces the recorded missing value.

## Run

No packages, backend, account, AI runtime or paid API are required. Use Python 3 to serve static files:

```sh
python3 -m http.server 0 --bind 127.0.0.1 --directory web
```

Open the localhost address and port printed by the server. A fresh port avoids stale service-worker caches left by unrelated local apps; this project installs no service worker. The page's CSP forbids application connections. No learner records are collected; state remains in the current tab and is not persisted. Static hosting still requests application assets from its host.

Run deterministic arithmetic/representation checks with a current Node.js:

```sh
node test_engine.mjs
```

## Honest scope

This is a working educational prototype, not a measurement instrument or proof of learning improvement. The lessons use newly authored synthetic examples. The chart does not turn missing data into a genuine zero; its optional hypothetical comparison is explicitly labeled. Percentage-point subtraction and relative percent change are explained separately.

Keyboard-operable controls, semantic tables, SVG descriptions, live text feedback and responsive styles are implemented. Browser, keyboard, screen-reader and learner evaluation results must be reported only after actual checks; no accessibility certification or learning gain is claimed.

Codex generated the new source, tests, lesson copy and documentation. Image Gen supplied a design reference; UI, text, chart and controls are implemented as HTML/CSS/JavaScript. No code or assets from another contest project were copied. There is no speech feature despite the descriptive project name; the chart communicates through explicit readable text and a semantic table.
