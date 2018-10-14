import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | account contact-admin', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let controller = this.owner.lookup('controller:account/contact-admin');
    assert.ok(controller);
  });
});
