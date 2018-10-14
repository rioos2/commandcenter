import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account contact-admin', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let route = this.owner.lookup('route:account/contact-admin');
    assert.ok(route);
  });
});
