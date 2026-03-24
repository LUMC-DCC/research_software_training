# LUMC Coding Cafe Web

## Live Website

[https://lumc-dcc.github.io/research_software_training/](https://lumc-dcc.github.io/research_software_training/)

## About This Website

This website is the public hub for LUMC Research Software Training activities.  
It brings together training opportunities, Coding Cafe sessions, resources, and contact information in one place.

## What You Can Find

- Training Catalogue with internal and external training opportunities in the region
- Coding Cafe overview with upcoming and past sessions
- Session materials pages (including slide links)
- Training Calendar
- Resource Library
- About and contact information

## Maintainer

- dr. ir. Özgün Balaban (LUMC)

## Notes

The website content is maintained to support researchers, data stewards, and research software professionals with practical, up-to-date learning opportunities.

## Updating JSON Content

This project reads content directly from JSON files in `src/lib/content/`.

### Add a Coding Cafe event (`events.json`)

The event source file is:
- `src/lib/content/coding-cafe-events.json`

Add a new object to the JSON array.

Required fields:
- `title`
- `date` (`YYYY-MM-DD`)
- `location`

Optional fields:
- `subtitle`
- `time` (`HH:MM-HH:MM`) (leave empty or omit if unknown)
- `speaker`
- `speaker_link`
- `description`
- `slug` (used for event detail page URL)
- `tags`
- `slides`, `poster`, `repo`, `zenodo`, `calendar`, `image`
- `registrationLink`

Example:

```json
{
  "title": "Building Better Research Software Together",
  "subtitle": "Community session on collaborative practices",
  "date": "2026-04-16",
  "time": "15:00-17:00",
  "location": "LUMC, Building 1",
  "speaker": "Jane Doe",
  "speaker_link": "https://example.org/jane-doe",
  "description": "Hands-on session on reproducible workflows.",
  "slug": "2026-04-16-building-better-research-software-together",
  "tags": ["Open Science", "Reproducibility"],
  "slides": "https://example.org/slides",
  "registrationLink": "https://example.org/register"
}
```

### Add a Resource (`resources.json`)

The resource source file is:
- `src/lib/content/resources.json`

Add a new object to the JSON array.

Required fields:
- `id` (unique)
- `title`
- `abstract`
- `type` (`Tutorial` | `Guide` | `Tool` | `Policy`)
- `source` (`LUMC` | `External`)
- `access` (`Open Access` | `LUMC Only`)
- `tags` (array of strings)
- `url`

Example:

```json
{
  "id": "r10",
  "title": "Research Software Quality Checklist",
  "abstract": "Checklist for improving software quality and reproducibility in research projects.",
  "type": "Guide",
  "source": "LUMC",
  "access": "Open Access",
  "tags": ["FAIR", "Reproducibility", "Quality"],
  "url": "https://example.org/checklist"
}
```

### Validation tips

- Keep valid JSON syntax: double quotes, no trailing commas.
- Use unique `id` values.
- After editing, run:
  - `npm run check`
