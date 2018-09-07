# Rio/OS UI - CommandCenter

This DEVELOPMENT outlines the details of developer focus.

## packages.js

 ember-source is not working for "ember test" versions above 3.3.* . Need to keep 3.2.2 alone for a moment of period. Hope upcoming version will work.

## eslint

 eslint can be disable while doing yarn test. It can be done by set property on EmberApp object in ember-cli-build.js (enable this line "hinting: !isTesting")
