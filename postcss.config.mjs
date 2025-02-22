export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-prefix-selector': {
      prefix: '#WXT-FIELD',
      transform: transformSelector
    }
  }
}

function transformSelector(prefix, selector, prefixedSelector) {
  // daisyUI: src/base/colors.css
  if (selector.match(/:root/)) {
    return selector.replace(/:root/, prefix);
  }

  // daisyUI: src/base/general.css
  if (selector.match(/html/)) {
    return selector.replace(/html/, prefix);
  }

  return prefixedSelector;
}