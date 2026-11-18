<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,100:14b8a6&height=170&section=header&text=HAR%20Diff%20Viewer&fontColor=ffffff&fontSize=38&animation=fadeIn" alt="HAR Diff Viewer banner" width="100%"/>
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=19&duration=3000&pause=900&color=14B8A6&center=true&vCenter=true&width=820&lines=Compare%20two%20browser%20network%20captures%20entirely%20in%20your%20browser" alt="Typing title"/>

[![License](https://img.shields.io/github/license/CyberLoop-dev/har-diff-viewer)](LICENSE)
![Language](https://img.shields.io/github/languages/top/CyberLoop-dev/har-diff-viewer)
![Stars](https://img.shields.io/github/stars/CyberLoop-dev/har-diff-viewer?style=flat)
![Last commit](https://img.shields.io/github/last-commit/CyberLoop-dev/har-diff-viewer)

<img src="assets/illustration.svg" alt="HAR Diff Viewer illustration" width="92%"/>
</div>

## :compass: Overview

A privacy-first React tool for comparing two HAR files. It matches requests by method and URL, then highlights added, removed, and changed responses without uploading capture data.

## :sparkles: Features

- :white_check_mark: Loads HAR JSON files locally in the browser
- :white_check_mark: Compares request status, response size, timing, and headers
- :white_check_mark: Filters added, removed, changed, and unchanged requests
- :white_check_mark: Keeps HAR contents in the current browser tab only

## :clapper: Demo

```bash
npm start
```

The example runs locally; no hosted service or upload is required.

## :rocket: Quick Start

```bash
npm install
npm start
```

## :toolbox: Tech Stack

- React, TypeScript, Vite, and Vitest
- Automated tests: Vitest unit tests for HAR matching and change detection
- Local-first processing

## :file_folder: Folder Structure

```text
har-diff-viewer/
├── index.html
├── package.json
├── vite.config.ts
├── src/App.tsx
├── src/diff.ts
├── src/diff.test.ts
├── src/style.css
└── assets/illustration.svg
```

## :world_map: Roadmap

- [x] Core workflow
- [x] Example input and tests
- [ ] Additional report formats
- [ ] Continuous integration on supported platforms

## :handshake: Contributing

Issues and pull requests are welcome. Keep changes focused, document behavior changes, and add tests for new features.

## :page_facing_up: License

MIT - see [LICENSE](LICENSE).

<div align="center"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:14b8a6,100:0f172a&height=100&section=footer" alt="Animated wave footer" width="100%"/></div>
