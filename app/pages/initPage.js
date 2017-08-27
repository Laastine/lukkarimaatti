import React from 'react'
import {renderToString} from 'react-dom/server'
import App from './app'

const googleAnalytics = process.env.NODE_ENV === 'production' ? `<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){(i[r].q = i[r].q || []).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','UA-27895073-3','auto');ga('send','pageview');</script>` : ''

export const renderFullPage = (component, initialState, options) => `<!doctype html>
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel='stylesheet' type="text/css" href='/static/${options.cssChecksum}/styles.css'/>
        <link rel='shortcut icon' type='image/png' href='/img/favicon.png'/>
        <meta name="description" content="Lukkarimaatti++ timetable tool for LUT students"/>
        ${googleAnalytics}
        <title>Lukkarimaatti++</title>
      </head>
      <body>
        <div id='root'>${renderToString(<App component={component} state={initialState}></App>)}</div>
      </body>
        <script>
          window.STATE = ${JSON.stringify(initialState)}
          window.OPTIONS = ${JSON.stringify(options)}
        </script>
      <script src='/static/${options.bundleJsChecksum}/bundle.js' ></script>
    </html>`
