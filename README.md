# BIO N:OV Premium Website

A responsive, cinematic Next.js website based on the supplied 30-page BIO N:OV presentation. The implementation preserves its blue-cyan-purple-pink identity while using careful educational wording and explicit verification notes.

## Folder structure

- `app/` - Next.js App Router pages, metadata and global design system
- `components/` - interactive page experience and React Three Fiber molecule
- `public/images/` - product, ingredient, medical and researcher imagery extracted/cropped from the supplied PDF
- `CONTENT_VERIFICATION.md` - legal, scientific and regulatory review checklist

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
