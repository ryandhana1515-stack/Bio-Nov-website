# BIO N:OV Premium Website

A responsive, cinematic Next.js website based on the supplied 30-page BIO N:OV presentation. The implementation preserves its blue-cyan-purple-pink identity while using careful educational wording and explicit verification notes.

## Folder structure

- `app/` - Next.js App Router pages, metadata and global design system
- `components/` - interactive page experience and React Three Fiber molecule
- `public/images/` - product, ingredient, medical and researcher imagery extracted/cropped from the supplied PDF
- `CONTENT_VERIFICATION.md` - legal, scientific and regulatory review checklist

## Routes

- `/` — the BIO N:OV site
- `/nomadatoast` — Jo Mendes / Nomadatoast creator site (see below)

## Nomadatoast route

A rebuild of the `skeleton-rebuild` Emergent preview as a pinned, scroll-driven
hero: five cross-fading visual stages, two headline chapters and a right-hand
rail that travels as you scroll.

- `app/nomadatoast/page.tsx` — route and font
- `app/nomadatoast/nomadatoast.css` — styles, all `nt-` prefixed so the BIO N:OV
  design system is untouched
- `components/nomadatoast/` — page component and the procedural stage visuals

**Hero artwork.** The original renders are not in this repo, so each stage falls
back to an SVG stand-in that carries the same beat (portrait → mesh → dissolve →
sculpture → fibre optics). Drop the real files at
`public/images/nomadatoast/stage-1.jpg` … `stage-5.jpg` and they are used
automatically — no code change needed.

**Approximations to check.** The rebuild was made from screenshots, so the
typeface is a stand-in (Plus Jakarta Sans; swap the import in
`app/nomadatoast/page.tsx`) and the background gradient, spacing and type scale
are matched by eye rather than measured. Nav, Subscribe and social links are
placeholders pending real destinations.

To make this the site root, point `app/page.tsx` at `NomadatoastSite`.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Upload this folder to a Git repository.
2. Import the repository in Vercel.
3. Keep the detected framework as Next.js.
4. Build command: `npm run build`.
5. Deploy and add the final public domain to the site metadata if needed.

No environment variables are required for the current static experience. Connect the contact form to an approved form handler or CRM before launch.
