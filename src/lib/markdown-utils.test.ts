import { describe, it, expect } from 'vitest';
import {
	escapeHtml,
	renderInlineMarkdown,
	parseFrontmatter,
	renderMarkdownToHtml
} from './markdown-utils.js';

// --- escapeHtml ---

describe('escapeHtml', () => {
	it('escapes ampersands', () => {
		expect(escapeHtml('a & b')).toBe('a &amp; b');
	});

	it('escapes angle brackets', () => {
		expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
	});

	it('escapes double quotes', () => {
		expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
	});

	it('escapes single quotes', () => {
		expect(escapeHtml("it's")).toBe('it&#39;s');
	});

	it('leaves plain text unchanged', () => {
		expect(escapeHtml('hello world')).toBe('hello world');
	});

	it('escapes multiple special chars in one string', () => {
		expect(escapeHtml('<b class="x">a & b</b>')).toBe(
			'&lt;b class=&quot;x&quot;&gt;a &amp; b&lt;/b&gt;'
		);
	});
});

// --- renderInlineMarkdown ---

describe('renderInlineMarkdown', () => {
	it('renders bold', () => {
		expect(renderInlineMarkdown('**bold**')).toBe('<strong>bold</strong>');
	});

	it('renders italic', () => {
		expect(renderInlineMarkdown('*italic*')).toBe('<em>italic</em>');
	});

	it('renders inline code', () => {
		expect(renderInlineMarkdown('`code`')).toBe('<code>code</code>');
	});

	it('renders a link', () => {
		expect(renderInlineMarkdown('[text](https://example.com)')).toBe(
			'<a href="https://example.com">text</a>'
		);
	});

	it('escapes HTML before applying markdown', () => {
		expect(renderInlineMarkdown('<script>alert(1)</script>')).toBe(
			'&lt;script&gt;alert(1)&lt;/script&gt;'
		);
	});

	it('handles mixed inline elements', () => {
		expect(renderInlineMarkdown('**bold** and `code`')).toBe(
			'<strong>bold</strong> and <code>code</code>'
		);
	});

	it('leaves plain text unchanged', () => {
		expect(renderInlineMarkdown('just text')).toBe('just text');
	});
});

// --- parseFrontmatter ---

describe('parseFrontmatter', () => {
	it('parses title and summary from frontmatter', () => {
		const input = `---
title: My Session
summary: A short summary
---

Body content here.`;
		const { metadata, body } = parseFrontmatter(input);
		expect(metadata.title).toBe('My Session');
		expect(metadata.summary).toBe('A short summary');
		expect(body).toBe('Body content here.');
	});

	it('strips surrounding quotes from values', () => {
		const input = `---
title: "Quoted Title"
summary: 'Single quoted'
---
Body`;
		const { metadata } = parseFrontmatter(input);
		expect(metadata.title).toBe('Quoted Title');
		expect(metadata.summary).toBe('Single quoted');
	});

	it('returns empty metadata and full string when no frontmatter', () => {
		const input = 'No frontmatter here.';
		const { metadata, body } = parseFrontmatter(input);
		expect(metadata).toEqual({});
		expect(body).toBe('No frontmatter here.');
	});

	it('returns empty metadata when frontmatter delimiter is malformed', () => {
		const input = '---\ntitle: broken';
		const { metadata, body } = parseFrontmatter(input);
		expect(metadata).toEqual({});
		expect(body).toBe(input.trim());
	});

	it('ignores unknown frontmatter keys', () => {
		const input = `---
title: Known
author: Unknown
date: 2026-01-01
---
Body`;
		const { metadata } = parseFrontmatter(input);
		expect(metadata.title).toBe('Known');
		expect((metadata as Record<string, string>).author).toBeUndefined();
	});

	it('handles values containing colons', () => {
		const input = `---
title: Time: 13:00-14:30
---
Body`;
		const { metadata } = parseFrontmatter(input);
		expect(metadata.title).toBe('Time: 13:00-14:30');
	});
});

// --- renderMarkdownToHtml ---

describe('renderMarkdownToHtml', () => {
	it('returns empty string for empty input', () => {
		expect(renderMarkdownToHtml('')).toBe('');
		expect(renderMarkdownToHtml('   ')).toBe('');
	});

	it('renders a paragraph', () => {
		expect(renderMarkdownToHtml('Hello world')).toBe('<p>Hello world</p>');
	});

	it('renders an h2 heading', () => {
		expect(renderMarkdownToHtml('## Section Title')).toBe('<h2>Section Title</h2>');
	});

	it('renders an h3 heading', () => {
		expect(renderMarkdownToHtml('### Sub-section')).toBe('<h3>Sub-section</h3>');
	});

	it('renders an unordered list', () => {
		const html = renderMarkdownToHtml('- Item one\n- Item two\n- Item three');
		expect(html).toBe('<ul><li>Item one</li><li>Item two</li><li>Item three</li></ul>');
	});

	it('renders an ordered list', () => {
		const html = renderMarkdownToHtml('1. First\n2. Second\n3. Third');
		expect(html).toBe('<ol><li>First</li><li>Second</li><li>Third</li></ol>');
	});

	it('renders a blockquote', () => {
		expect(renderMarkdownToHtml('> A quoted line')).toBe(
			'<blockquote>A quoted line</blockquote>'
		);
	});

	it('renders multiple blocks separated by blank lines', () => {
		const html = renderMarkdownToHtml('## Heading\n\nA paragraph.');
		expect(html).toBe('<h2>Heading</h2>\n<p>A paragraph.</p>');
	});

	it('normalises Windows line endings', () => {
		expect(renderMarkdownToHtml('line one\r\nline two')).toBe('<p>line one line two</p>');
	});

	it('applies inline markdown inside block elements', () => {
		expect(renderMarkdownToHtml('- **bold item**')).toBe(
			'<ul><li><strong>bold item</strong></li></ul>'
		);
	});
});
