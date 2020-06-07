## Gravity Flow Blocks - Feature Plugin

This is the development version of the Gravity Flow editor blocks.

## Packaging for Release

You can use the following command to package up the repository into an installable plugin:

```
 zip -r gravityflowblocks_0.3-dev.zip gravityflowblocks -x '*.git' '*.jsx*' '*.babelrc*' '*.DS_Store*' '*node_modules*' '*.scss' '*package-lock.json' '*README.md' '*webpack.config.js'
```