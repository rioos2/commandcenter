import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

setResolver(resolver);

mocha.setup({ // eslint-disable-line
  timeout: 15000,
  slow:    500
});
