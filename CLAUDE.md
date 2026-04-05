# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VitePress-based personal knowledge base (wiki) for Chinese language content. It uses a date-based note organization system with automatic sidebar generation.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build locally
npm run docs:preview
```

## Architecture

### Note Organization System

Notes are organized in a three-level hierarchy at `docs/notes/YYYY/MM-DD/NN-标题.md`:
- Year folder: `docs/notes/YYYY/` (e.g., `docs/notes/2026/`)
- Date folder: `MM-DD/` (e.g., `04-05/`)
- Note files: `NN-标题.md` where NN is a sequence number (e.g., `01-笔记.md`, `02-随笔.md`)

This structure allows multiple notes per day, organized sequentially.

### Sidebar Generation Logic

The `generateSidebar()` function in `docs/.vitepress/sidebar.mjs`:
- Scans `docs/notes/` for year folders (4-digit names)
- For each year, scans for date folders (`MM-DD` format)
- For each date, scans for `.md` files
- Extracts titles by stripping the numeric prefix (`01-标题.md` → `标题`)
- Sorts years and dates in reverse chronological order (newest first)
- Sorts files within each date by sequence number
- Auto-collapses previous years, keeps current year expanded
- Groups into a three-level sidebar: Year → Date → Notes

### Non-Markdown File Support

PDF, HTML, DOCX, and XLSX files are supported alongside markdown files:
- **Location**: Store non-md files in `docs/public/notes/YYYY/MM-DD/` (mirrors the notes structure)
- **Icons**: Files get type-specific icons in the sidebar (📄 PDF, 🌐 HTML, 📝 DOCX, 📊 XLSX)
- **Links**: Non-md files use absolute URLs (`https://qwer555888.github.io/wiki/notes/...`) with `target: '_blank'` to open in new tabs
- **Storage separation**: Markdown files live in `docs/notes/`, while other file types go in `docs/public/notes/`

### VitePress Configuration

Key settings in `docs/.vitepress/config.mjs`:
- `base: '/wiki/'` — Deployed under `/wiki/` subdirectory on GitHub Pages
- `lang: 'zh-CN'` — Chinese language content
- Sidebar is dynamically generated at build time via `generateSidebar()`
- Edit links point to GitHub repository for easy editing

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`):
- Triggers on pushes to `main` branch
- Builds with `npm run docs:build`
- Deploys `docs/.vitepress/dist` to GitHub Pages
- Uses Node.js 20

### Theme Customization

- Custom theme extends default VitePress theme at `docs/.vitepress/theme/index.mjs`
- Custom styles in `docs/.vitepress/theme/style.css`

## File Templates

When creating new notes, use the template at `docs/notes/template/01-示例标题.md`:
- Filename format: `NN-描述.md` (e.g., `01-建站笔记.md`)
- The numeric prefix determines display order in the sidebar
- Sections: 今日主题, 笔记内容, 个人思考, 待跟进
