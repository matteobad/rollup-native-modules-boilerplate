import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import React from 'react';
import PropTypes from 'prop-types';

import 'highlight.js/styles/atom-one-dark.css';
import './CodeBlock.css';

// Only JavaScript is needed at the momemnt.
hljs.registerLanguage('javascript', javascript);

/**
 * A component that renders highlighted code blocks.
 */
export default class CodeBlock extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { lang, code } = this.props;
    return !(code === nextProps.code && lang === nextProps.lang);
  }

  render() {
    const { lang, code } = this.props;
    return (
      <pre
        className="hljs"
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(lang, code).value
        }}
      />
    );
  }
}

CodeBlock.propTypes = {
  lang: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired
};
