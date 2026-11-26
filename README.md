# Cinematic Birthday — Interactive 3D Celebration Experience

> **Zero-database, statically exported Next.js 16 + React Three Fiber 3D celebration web experience deployed on Cloudflare Pages.**

**Live Demo:** **[cinematic-birthday-3ou.pages.dev](https://cinematic-birthday-3ou.pages.dev/)**

---

## Architecture & Tech Stack

- **Static Edge Delivery:** Built with Next.js 16 (`output: "export"`) for zero-server, instant global delivery on Cloudflare Pages.
- **3D & Motion Pipeline:** Combines `three`, `@react-three/fiber`, and `@react-three/drei` with `gsap`, `framer-motion`, and `lenis` smooth scrolling for choreographed 60fps camera and particle transitions.
- **Stateless Client-Side Payloads:** Celebration messages and personalization parameters are encoded client-side in URL state with zero backend database dependency.
- **Strict Type Safety:** Written in TypeScript 5 (`src/app`, `src/components`, `src/lib`) with Tailwind CSS v4 (`@tailwindcss/postcss`) and ESLint 9.

---

## Run & Build Locally

```bash
npm install
npm run dev      # Start local dev server at http://localhost:3000
```

### Verification Commands

```bash
npx tsc --noEmit # TypeScript type check
npm run lint     # ESLint check
npm run build    # Generates static export in ./out
```

---

## License

MIT License — see [`LICENSE`](./LICENSE).
