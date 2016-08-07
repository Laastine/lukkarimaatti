import React from 'react'
import {renderToString} from 'react-dom/server'
import App from './app' // eslint-disable-line
// eslint-disable-line

export const renderFullPage = (initialState, options, renderProps) => {
  return `<!doctype html>
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel='stylesheet' href='/static/${options.cssChecksum}/style.css'/>
        <link rel='shortcut icon' type='image/png' href='/img/favicon.png'/>
      </head>
      <body>
        <div id='root'>${renderToString(<App state={initialState} renderProps={renderProps}></App>)}</div>
      </body>
        <script>
          window.STATE = ${JSON.stringify(initialState)}
          window.OPTIONS = ${JSON.stringify(options)}
        </script>
      <script src='/static/${options.bundleJsChecksum}/bundle.js' ></script>
    </html>`
}
