# AaEx JS — My Personal Framework

### v1.5.0

Major code structure changes and hot reload fixes

# Important:

Iam not sure if the framework in its current state is stable or even able to be built and deployed.
Will be working on that


# Description
AaEx JS is a lightweight framework I created for learning and to potentially speed up my development workflow. It builds on **Vite** with SSR (server-side rendering), uses **Express** as the backend server, and **React** for the frontend. Inspired by **Next.js**, it features file-based routing and a familiar developer experience.

---

## Getting Started

You can quickly scaffold a new AaEx app using:

```bash
npx create-aaex-app
```

Follow the interactive prompts to set up your project.

## Once setup is complete:

```bash
cd <project-name>
npm install
npm run dev
```

Your development server will start and you can begin building!

---

# Features

- ## File-based routing — Create pages by adding files inside the `/src/pages` directory.

- ## Dynamic routes — Use `[param].tsx` syntax to create dynamic routes (e.g. /blog/[id].tsx maps to /blog/:id).

- ## API routes — Build API endpoints similarly inside `/src/api` for backend logic.

- ## SSR + CSR — Supports server-side rendering and client-side hydration out of the box.

- ## Optional Tailwind CSS support — Easily add Tailwind during project creation for utility-first styling.

# How to Create Routes

### Simply create a new .tsx or .jsx file inside /src/pages.

### Files named index.tsx become the root of that folder route (e.g. `/src/pages/index.tsx` -> `/`).

### Dynamic segments are created by wrapping names in brackets: `/src/pages/blog/[id].tsx becomes /blog/:id.`

### Important: The files must include a default export for the page to be rendered

### Example:

```tsx
// src/pages/helloworld.tsx
export default function HelloWorld() {
  return <h1>Hello World!</h1>;
  // here we can later implement server-side data fetching
}
```

## How to Create API Endpoints

### - Add your API files inside /src/api.

### - Each file exports a default handler function similar to Express middleware.

```ts
//src/api/helloworld.ts

// can be asynnc and handle database Queries
export function YourFunction() {
  //this function can be moved outside the /api folder to somewhere like /lib

  //here we can fetch data from our database

  return "Hello world";
}
// this function will behave like an api endpoint and can be used by the client or external services at api/helloworld
export default function handler(req, res) {
  const data = YourFunction(); //here we reuse the datafetching function
  res.status(200).json(data);
}
```

## How to use the API internally with SSR

- ### Data fetching

```tsx
//src/pages/HelloWorld.tsx
import { YourFunction } from "../api/helloworld.ts";
//or import { YourFunction } from "../lib/helloworld.ts"

// the load function will run on the server before rendering the page
// here we could also do external API calls
export async function load() {
  const message = await YourFunction();

  return { message };
}

export default function Home({ message }) {
  return <h1>{message}</h1>; // will render as Hello world
}
```

- ### With Params

```tsx
//src/pages/blog/[id].tsx
import { getBlogById } from "../api/blogs/[id].ts";

// the load function will get params from the url on the server
export async function load({ params }) {
  const blog = await getBlogById(params.id);

  return { blog };
}

export default function Blog({ blog }) {
  return (
    <>
      <h1>{blog.name}</h1>
      <p>{blog.description}</p>
    </>
  );
}
```

### - The file path maps to /api/< filename > automatically.

# Tailwind CSS Support

When creating a new project via `create-aaex-app`, you can choose to enable Tailwind CSS integration. The setup will automatically include Tailwind dependencies and configure the necessary files.

# License

## MIT © TmRAaEx
