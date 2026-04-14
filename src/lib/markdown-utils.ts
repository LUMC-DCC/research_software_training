export type SessionMetadata = {
	title?: string;
	summary?: string;
};

export const escapeHtml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

export const renderInlineMarkdown = (value: string) => {
	const escaped = escapeHtml(value);

	return escaped
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>');
};

export const parseFrontmatter = (source: string) => {
	if (!source.startsWith('---')) {
		return { metadata: {} as SessionMetadata, body: source.trim() };
	}

	const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

	if (!match) {
		return { metadata: {} as SessionMetadata, body: source.trim() };
	}

	const [, rawMetadata, body] = match;
	const metadata: SessionMetadata = {};

	for (const line of rawMetadata.split('\n')) {
		const separatorIndex = line.indexOf(':');
		if (separatorIndex === -1) continue;

		const key = line.slice(0, separatorIndex).trim();
		const rawValue = line.slice(separatorIndex + 1).trim();
		const value = rawValue.replace(/^['"]|['"]$/g, '');

		if (key === 'title' || key === 'summary') {
			metadata[key] = value;
		}
	}

	return { metadata, body: body.trim() };
};

export const renderMarkdownToHtml = (markdown: string) => {
	const normalized = markdown.replace(/\r\n/g, '\n').trim();

	if (!normalized) {
		return '';
	}

	const blocks = normalized.split(/\n\s*\n/);

	return blocks
		.map((block) => {
			const lines = block
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean);

			if (!lines.length) return '';

			if (lines.every((line) => /^- /.test(line))) {
				const items = lines
					.map((line) => line.replace(/^- /, ''))
					.map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
					.join('');
				return `<ul>${items}</ul>`;
			}

			if (lines.every((line) => /^\d+\. /.test(line))) {
				const items = lines
					.map((line) => line.replace(/^\d+\. /, ''))
					.map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
					.join('');
				return `<ol>${items}</ol>`;
			}

			const firstLine = lines[0];

			if (/^## /.test(firstLine)) {
				return `<h2>${renderInlineMarkdown(firstLine.replace(/^## /, ''))}</h2>`;
			}

			if (/^### /.test(firstLine)) {
				return `<h3>${renderInlineMarkdown(firstLine.replace(/^### /, ''))}</h3>`;
			}

			if (/^> /.test(firstLine)) {
				return `<blockquote>${renderInlineMarkdown(
					lines.map((line) => line.replace(/^> /, '')).join(' ')
				)}</blockquote>`;
			}

			return `<p>${renderInlineMarkdown(lines.join(' '))}</p>`;
		})
		.join('\n');
};
