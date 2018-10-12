/*eslint-disable */
import Application from '../../app';
import config from '../../config/environment';
<<<<<<< HEAD
import registerClipboardHelpers from '../helpers/ember-cli-clipboard';
import { merge } from '@ember/polyfills';
=======
import { assign } from '@ember/polyfills';
>>>>>>> 2-0-stable
import { run } from '@ember/runloop';

import './sign-in-user';
import './wait-for-element';

<<<<<<< HEAD
registerClipboardHelpers();

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  let clearStorage = (storage) => {
    storage.removeItem('token');
    storage.removeItem('user');
  };

  clearStorage(localStorage);
  clearStorage(sessionStorage);

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
=======
  let attributes = assign({}, config.APP);

  attributes = assign(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();

    return application;

  });

>>>>>>> 2-0-stable
}
