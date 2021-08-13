# TAO Environment PCI
What this interaction should do:
- gather information about the TAO environment. `information-gatherer.js` already does this
- add the outcome of the above to the textarea that comes with `markup.tpl`

## Files that had already been working on
- `information-gatherer-esm/screen.js`: ready for usage
- `information-gatherer-esm/tao.js`: ready for usage
- `information-gatherer-esm/env.js`: ready for usage
- `taoEnvInteraction/creator/img/icon.svg`: ready for usage
- `taoEnvInteraction/readme.md`: ready for usage
- `taoEnvInteraction/creator/tpl/markup.tpl`: presumably ready for usage
- `taoEnvInteraction/creator/tpl/propertiesForm.tpl`: presumably ready for usage

## Rollup configuration
`npm run pci:build` takes the files under `js` and generates `runtime/js/information-gatherer.js`