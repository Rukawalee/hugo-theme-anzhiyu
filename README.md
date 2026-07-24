# hugo-theme-anzhiyu

Hugo port of the [Hexo theme AnZhiYu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu) (安知鱼).

This is a **Theme Port**, not a clean-room reimplementation. Layouts, CSS, icons, and client scripts are adapted from upstream **hexo-theme-anzhiyu 1.7.1** under **GPL-3.0**.

## Requirements

- [Hugo Extended](https://gohugo.io/installation/) **0.120+**
- No Node/Stylus required for consumers — CSS ships precompiled

## Install

### Hugo Modules (recommended)

```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "github.com/Rukawalee/hugo-theme-anzhiyu"
```

```bash
hugo mod get github.com/Rukawalee/hugo-theme-anzhiyu
```

Local development with a clone:

```toml
[module]
  [[module.imports]]
    path = "github.com/Rukawalee/hugo-theme-anzhiyu"
  replacements = "github.com/Rukawalee/hugo-theme-anzhiyu -> ../hugo-theme-anzhiyu"
```

### Git clone

```bash
git clone https://github.com/Rukawalee/hugo-theme-anzhiyu.git themes/anzhiyu
```

```toml
theme = "anzhiyu"
```

## Example site

```bash
cd exampleSite
hugo server --themesDir ../..
# or with modules:
hugo server
```

Default language is **zh-CN**.

## Phase roadmap

| Phase | Focus |
|-------|--------|
| 1 | Reading loop: chrome, home, post, archives, taxonomies, core sidebar, dark mode, local search |
| 2 | Content Tags → shortcodes |
| 3 | Special pages (friends, about, album, …) |
| 4 | Integrations (Giscus first) |
| 5 | Client runtime / pjax |
| 6 | Content converter, PWA, polish |

See `CONTEXT.md` and `docs/port-map.md`.

## Configuration

Hugo-idiomatic `params` / `menus` (not a 1:1 Hexo YAML mirror). Start from `exampleSite/hugo.toml` and the theme defaults documented there.

## License

GPL-3.0 — see [LICENSE](LICENSE).

Upstream copyright: [anzhiyu-c/hexo-theme-anzhiyu](https://github.com/anzhiyu-c/hexo-theme-anzhiyu).
