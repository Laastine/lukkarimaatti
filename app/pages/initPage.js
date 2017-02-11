import React from 'react'
import {renderToString} from 'react-dom/server'
import App from './app'

const googleAnalytics = process.env.NODE_ENV === 'production' ? `<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject'] = r;i[r]=i[r]||function(){(i[r].q = i[r].q || []).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','UA-27895073-3','auto');ga('send','pageview');</script>` : ''

export const renderFullPage = (initialState, options, renderProps) => {
  return `<!doctype html>
    <html>
      <head>
      <script>
        window.onerror = function (message, file, line, col, error) {
                function serializeError(object) {
                    var alt = {};
                    if (object) {
                      Object.getOwnPropertyNames(object).forEach(function (key) {
                          alt[key] = object[key];
                      }, object);
                    }
                    return alt;
                }
                function sendMessageToServer(message) {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/errors');
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(message));
                }
                function serializeNavigator() {
                    var _navigator = {};
                    for (var i in window.navigator) {_navigator[i] = window.navigator[i];}
    
                    delete _navigator.plugins;
                    delete _navigator.mimeTypes;
                    return _navigator;
                }
                sendMessageToServer({error: {message: message, file: file, line: line, col: col, error: serializeError(error)}, navigator: serializeNavigator()})
                return false;
            }
      </script>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        <link rel='stylesheet' href='/static/${options.cssChecksum}/styles.css'/>
        <link rel='shortcut icon' type='image/png' href='/img/favicon.png'/>
        ${googleAnalytics}
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
