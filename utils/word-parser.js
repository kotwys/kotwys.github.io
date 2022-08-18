/** Markdown-it module for dictionary facilities in texts. */

const wordre = /{([^}]+)}([^\s]*)/gi;

const inline = (dictionary) => function (state, silent) {
  const pos = state.pos;
  const str = state.src;
  const possible = str.startsWith('{', wordre.lastIndex = pos);
  const match = possible && wordre.exec(str);

  if (match) {
    if (!silent) {
      let [form, initial] = match[1].split('|');
      initial = initial || form.toLowerCase();
      form += match[2];

      const token = state.push('word', 'word', 0);
      token.tag = 'span';
      token.markup = match[0];
      token.content = form;
      token.attrs = [['def', dictionary[initial]], ['initial', initial]];
    }
    state.pos = wordre.lastIndex;
    return true;
  } else {
    return false;
  }
}

/**
 * @typedef WordParserOptions
 * @type {object}
 * @property {object} dictionary - entries to look for.
 */

/** @type {import('markdown-it').PluginWithOptions<WordParserOptions>} */
module.exports = function (md, options) {
  const dictionary = options.dictionary || {};
  md.inline.ruler.after('entity', 'word', inline(dictionary));
  md.renderer.rules.word = (tokens, idx) => {
    const token = tokens[idx];
    return `<span title="${token.attrGet('def')}" data-word="${token.attrGet('initial')}">${token.content}</span>`;
  };
}