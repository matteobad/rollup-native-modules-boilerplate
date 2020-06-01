import React from 'react';
import { format } from 'date-fns/esm';
import timeOrigin from './utils/timeOrigin';
import CodeBlock from './components/CodeBlock';

import './App.css';
import './Button.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      modules: App.getImportedModules()
    };

    // Bind methods.
    this.importAsyncDeps = this.importAsyncDeps.bind(this);
  }

  static getImportedModules() {
    return performance
      .getEntriesByType('resource')
      .filter((entry) => entry.name.match(/\.m?js$/))
      .map((entry) => {
        const date = new Date(Math.round(entry.responseEnd + timeOrigin));
        const timestamp = format(date, 'hh:mm:ss.SSS');
        return {
          URL: new URL(entry.name, window.location.href).pathname,
          timestamp
        };
      });
  }

  async importAsyncDeps() {
    // `AsyncComponent.mjs` imports `lodash-es` and `rxjs`.
    const module = await import('./components/AsyncComponent.js');
    const AsyncComponent = module.default;

    // Logs an `AsyncComponent` instance, which contains the `debounce`
    // and `Observable` properties imported from `lodash-es` and `rxjs`.
    console.log(new AsyncComponent());

    this.setState({ modules: App.getImportedModules() });
  }

  render() {
    const code = [
      '// `AsyncComponent.mjs` imports `lodash-es` and `rxjs`.',
      `const {AsyncComponent} = await import('./AsyncComponent.mjs');`,
      ``,
      '// Logs an `AsyncComponent` instance, which contains the `debounce`',
      '// and `Observable` properties imported from `lodash-es` and `rxjs`.',
      `console.log(new AsyncComponent());`
    ].join('\n');

    const { modules } = this.state;

    return (
      <div className="App">
        <h2 className="App-heading">JavaScript Modules in Production Demo</h2>
        <p>
          This demo uses real, ES2015 JavaScript modules loaded with module
          scripts and <code>import</code> statements. Everything you see in the
          intial render is done with statically imported modules. To see dynamic
          <code>import()</code> in action, click the button below to run the
          following code:
        </p>
        <CodeBlock code={code} lang="javascript" />
        <p>
          <button
            className="Button"
            type="button"
            onClick={this.importAsyncDeps}
          >
            Run code &nbsp;&rarr;
          </button>
        </p>
        <p>
          Running this code will dynamically <code>import()</code> the{' '}
          <code>AsyncComponent.mjs</code> module, as well as its dependencies (
          <code>lodash-es</code> and
          <code> rxjs</code>
          ). After you run the code, notice how the list of modules below
          changes.{' '}
          <em>(View source or click links below to see the module code.)</em>
        </p>
        <h3 className="App-subHeading">Loaded modules</h3>
        <ul>
          {modules.map(({ timestamp, URL }) => {
            return (
              <li key={URL} className="App-module">
                <time className="App-moduleTimestamp">[{timestamp}]</time>
                <a className="App-moduleURL" href={URL}>
                  {URL}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
