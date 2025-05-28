import React from 'react';
import ReactDOMServer from 'react-dom/server';

export default async function render(url, data, pageModule) {
  const PageComponent = pageModule.default;
  const appHtml = ReactDOMServer.renderToString(<PageComponent {...data} />);
  return appHtml;
}
