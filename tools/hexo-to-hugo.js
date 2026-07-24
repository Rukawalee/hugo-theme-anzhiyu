#!/usr/bin/env node
/**
 * Hexo → Hugo content converter for hugo-theme-anzhiyu
 *
 * Converts:
 *  - Front matter (YAML) keys to Hugo-compatible hybrid contract
 *  - Hexo Content Tags {% tag %} → Hugo shortcodes {{% tag %}} / {{< tag >}}
 *
 * Usage:
 *   node tools/hexo-to-hugo.js <input.md|dir> [-o outDir] [--dry-run] [--inplace]
 *
 * Examples:
 *   node tools/hexo-to-hugo.js ./_posts -o ./content/posts
 *   node tools/hexo-to-hugo.js post.md --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log(`Usage: node tools/hexo-to-hugo.js <input.md|dir> [-o outDir] [--dry-run] [--inplace]
Converts Hexo posts (tags + front matter) toward Hugo + AnZhiYu shortcodes.`);
  process.exit(0);
}

let input = null;
let outDir = null;
let dryRun = false;
let inplace = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-o') outDir = args[++i];
  else if (args[i] === '--dry-run') dryRun = true;
  else if (args[i] === '--inplace') inplace = true;
  else if (!args[i].startsWith('-')) input = args[i];
}
if (!input) {
  console.error('Error: input path required');
  process.exit(1);
}

/** Hexo tag name → Hugo shortcode name (may be identical) */
const TAG_MAP = {
  note: 'note',
  subnote: 'subnote',
  tip: 'tip',
  tabs: 'tabs',
  tab: 'tab',
  folding: 'folding',
  hide: 'hide',
  hideInline: 'hideInline',
  hideBlock: 'hideBlock',
  hideToggle: 'hideToggle',
  button: 'btn',
  btn: 'btn',
  btns: 'btns',
  checkbox: 'checkbox',
  radio: 'radio',
  gallery: 'gallery',
  label: 'label',
  span: 'span',
  p: 'p',
  link: 'link',
  site: 'site',
  flink: 'flink',
  mermaid: 'mermaid',
  timeline: 'timeline',
  media: 'media',
  audio: 'audio',
  video: 'video',
  bilibili: 'bilibili',
  dogeplayer: 'dogeplayer',
  'Introduction-card': 'introduction-card',
  icon: 'icon',
  image: 'image',
  inlineImg: 'inlineImg',
  kbd: 'kbd',
  u: 'u',
  emp: 'emp',
  wavy: 'wavy',
  del: 'del',
  psw: 'psw',
  cell: 'cell',
};

/** Front matter key remaps (Hexo → Hugo hybrid) */
const FM_RENAME = {
  updated: 'lastmod',
  categories: 'categories',
  tags: 'tags',
  // keep theme extension keys as-is: cover, toc, aside, ai, copyright, …
};

/** Page type → Hugo layout type */
const TYPE_TO_LAYOUT = {
  link: 'flink',
  about: 'about',
  essay: 'essay',
  fcircle: 'fcircle',
  album: 'album',
  album_detail: 'album_detail',
  music: 'music',
  equipment: 'equipment',
  room: 'room',
  tags: 'tags',
  categories: 'categories',
};

function splitFrontMatter(src) {
  if (!src.startsWith('---')) return { fm: null, body: src, delim: '---' };
  const end = src.indexOf('\n---', 3);
  if (end === -1) return { fm: null, body: src, delim: '---' };
  const fmRaw = src.slice(4, end).replace(/^\r?\n/, '');
  const body = src.slice(end + 4).replace(/^\r?\n/, '');
  return { fm: fmRaw, body, delim: '---' };
}

function convertFrontMatter(fmRaw) {
  if (fmRaw == null) return null;
  const lines = fmRaw.split(/\r?\n/);
  const out = [];
  let typeValue = null;
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!m) {
      out.push(line);
      continue;
    }
    let key = m[1];
    let val = m[2];
    if (FM_RENAME[key] && FM_RENAME[key] !== key) {
      key = FM_RENAME[key];
    }
    if (key === 'type') {
      typeValue = val.replace(/^['"]|['"]$/g, '').trim();
      // Map special page type → layout; keep type for cascade if useful
      if (TYPE_TO_LAYOUT[typeValue]) {
        out.push(`layout: ${TYPE_TO_LAYOUT[typeValue]}`);
        out.push(`type: ${TYPE_TO_LAYOUT[typeValue]}`);
        continue;
      }
    }
    if (key === 'date' || key === 'lastmod') {
      // Hugo accepts ISO; leave as-is
    }
    // permalink → url
    if (key === 'permalink') {
      out.push(`url: ${val}`);
      continue;
    }
    // comments: false stays
    out.push(`${key}: ${val}`);
  }
  // Ensure title present hint is not required
  return out.join('\n');
}

/**
 * Convert a single {% tag args %}…{% endtag %} or self-closing {% tag args %}
 * Handles nested tags poorly on purpose — run multiple passes if needed.
 */
function convertTags(body) {
  let s = body;

  // Block tags: {% name args %} ... {% endname %}
  // Prefer known TAG_MAP names; also catch end-tags generically.
  const blockRe =
    /\{%\s*([A-Za-z0-9_-]+)((?:\s+[^%]*?)?)\s*%\}([\s\S]*?)\{%\s*end\1\s*%\}/g;

  // Multiple passes for nesting
  for (let pass = 0; pass < 8; pass++) {
    let changed = false;
    s = s.replace(blockRe, (full, name, args, inner) => {
      changed = true;
      const sc = TAG_MAP[name] || name;
      const a = (args || '').trim();
      // Use {{% %}} so markdown inside shortcodes is processed
      if (a) return `{{% ${sc} ${a} %}}\n${inner}{{% /${sc} %}}`;
      return `{{% ${sc} %}}\n${inner}{{% /${sc} %}}`;
    });
    if (!changed) break;
  }

  // Self-closing: {% name args %} — skip already-converted {{% … %}} / {{< … >}}
  s = s.replace(/(?<![{<])\{%\s*([A-Za-z0-9_-]+)((?:\s+[^%]*?)?)\s*%\}(?![}>])/g, (full, name, args) => {
    if (name.startsWith('end')) return full;
    const sc = TAG_MAP[name] || name;
    const a = (args || '').trim();
    if (a) return `{{< ${sc} ${a} >}}`;
    return `{{< ${sc} >}}`;
  });

  return s;
}

function convertFile(srcPath, destPath) {
  const raw = fs.readFileSync(srcPath, 'utf8');
  const { fm, body, delim } = splitFrontMatter(raw);
  const newFm = convertFrontMatter(fm);
  const newBody = convertTags(body);
  let out;
  if (newFm != null) {
    out = `${delim}\n${newFm}\n${delim}\n${newBody}`;
  } else {
    out = convertTags(raw);
  }
  if (dryRun) {
    console.log(`--- ${srcPath} → ${destPath || '(stdout)'} ---`);
    console.log(out.slice(0, 2000) + (out.length > 2000 ? '\n…\n' : ''));
    return;
  }
  if (destPath) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, out, 'utf8');
    console.log(`wrote ${destPath}`);
  } else {
    process.stdout.write(out);
  }
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(md|markdown|mdx)$/i.test(ent.name)) files.push(p);
  }
  return files;
}

const abs = path.resolve(input);
const st = fs.statSync(abs);
if (st.isDirectory()) {
  const files = walk(abs);
  for (const f of files) {
    const rel = path.relative(abs, f);
    let dest = null;
    if (inplace) dest = f;
    else if (outDir) dest = path.join(path.resolve(outDir), rel);
    else dest = path.join(path.resolve(outDir || path.join(abs, '..', 'hugo-content')), rel);
    convertFile(f, dest);
  }
  console.log(`Converted ${files.length} file(s).`);
} else {
  let dest = null;
  if (inplace) dest = abs;
  else if (outDir) dest = path.join(path.resolve(outDir), path.basename(abs));
  convertFile(abs, dest);
}
