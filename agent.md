# Agent Notes

- When testing a running web project, prefer the public test URL `http://ssh.txyyfj.top:<port>/` instead of only testing `localhost`.
- For this project, the current dev server port is `5100`, so test with `http://ssh.txyyfj.top:5100/`.
- Do not consider the web service ready unless it is reachable through `http://ssh.txyyfj.top:5100/`, not just through `localhost` or `127.0.0.1`.
- Always keep the Astro dev server on port `5100`; do not switch back to the default `4321`.
- Daily paper reading posts should use the blog tag `每日论文精读` in frontmatter, for example `tags: ['每日论文精读']`; they appear under `/daily-paper/`. These posts must include `paper` metadata and `sourceCheckedAt`.
- Use the user-level `daily-paper-pdf` skill for 每日论文精读 posts whenever a PDF/full text must be located, archived, extracted, and read before writing.
- Store `pubDate` and `updatedDate` as Unix timestamps in seconds whenever possible. The site formats `<time data-timestamp>` on the client so readers see timestamps down to seconds in their own local timezone.
- Blog frontmatter supports optional `slug`, `aliases`, `draft`, `category`, `series`, `featured`, `pinned`, `paper`, `seoTitle`, `canonicalUrl`, `ogImage`, `heroImage`, `heroImageAlt`, `heroImageCaption`, `imageCredit`, `createdAt`, `reviewedAt`, and `sourceCheckedAt` metadata. Set `draft: true` to keep a post out of generated public lists and routes.
- Prefer stable lowercase kebab-case `slug` values. When changing a public article URL, keep the old file-derived slug in `aliases` so old links keep working.
- Project cards live in `src/content/projects/*.md`, not inside `src/pages/projects.astro`.
- In this environment, bypass the local HTTP proxy when testing this domain, for example `curl --noproxy '*' http://ssh.txyyfj.top:<port>/`.
- If the dev server uses Vite or Astro, make sure `ssh.txyyfj.top` is included in the dev server allowed hosts before testing through the public URL.
- Keep the server bound to an externally reachable host, for example `0.0.0.0`, unless the environment already provides a port proxy from the public address to `127.0.0.1`.

## Daily Paper Reading Writing Guide

- Audience: write for public blog readers, not as an internal progress report. Avoid phrases like "用户给的信息", "我核验到", "待补充", or "汇报".
- Frontmatter: daily paper reading posts must include `tags: ['每日论文精读']`, `sourceCheckedAt`, and `paper` with `title`, `authors`, `pdfUrl`, `pdfFile`, and at least one source identifier (`doi`, `arxiv`, or `url`). Add additional technical tags such as `PINO`, `LES`, `湍流`, or `神经算子` when appropriate.
- User-provided paper notes are only search clues, not facts. Before writing, locate the real paper from primary sources such as arXiv, DOI publisher pages, journal pages, official project pages, or author-maintained repositories; obtain and archive the PDF or official full text; extract/read the actual abstract, method, experiments, results, limitations, and metadata.
- Do not publish a 每日论文精读 article from abstract-only metadata. If the PDF/full text is unavailable, ask the user to provide it in `E:/yfj_code/sci_pdf`.
- Source discipline: verify bibliographic facts before writing, including title, authors, venue/preprint status, date, DOI/arXiv ID, code/data availability, and whether a DOI belongs to the same paper. Do not repeat AI-provided claims without checking primary sources.
- Academic tone: use neutral, precise, technically defensible language. Do not overclaim performance, novelty, or "first" statements unless the paper explicitly supports them.
- Core purpose: summarize the paper as a relevant research work in its technical lineage. Explain what problem it addresses, what prior methods made the problem possible, what gap remains, and how this paper moves the line forward.
- Recommended structure: bibliographic note; technical background and development history; problem formulation; method overview; key mechanism or equations; experimental setup; main results; comparison with closely related work; limitations; implications for future work.
- Development lineage: include 3-6 directly relevant predecessor or parallel works when possible, and explain their relationship rather than listing them mechanically.
- Figures: prefer original, self-made diagrams or tables that explain mechanisms, pipelines, comparisons, or error corrections. If using paper figures, cite clearly and avoid copying unless license and usage are appropriate.
- Results reporting: preserve experimental context, grids/datasets, baselines, metrics, and hardware assumptions. Convert speedups or errors only when the comparison basis is explicit.
- Writing style: the article should read like an academic technical essay. It should not include conversation-specific context, task history, or implementation notes about the website.
