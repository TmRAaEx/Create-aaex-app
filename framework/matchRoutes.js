import pkg from "path-to-regexp";
const { match } = pkg;

export default function matchRoute(url, routes) {
  const urlLower = `/${url.toLowerCase().replace(/^\/+/, "")}`;


  for (const { route, fullPath } of routes) {
    const routeLower = `/${route.toLowerCase().replace(/^\/+/, "")}`;

    const matcher = match(routeLower, { decode: decodeURIComponent });

    const matched = matcher(urlLower);

    if (matched) {
      return { fullPath, params: matched.params };
    }
  }
  return null;
}
