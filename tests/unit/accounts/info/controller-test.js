import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | accounts info', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let controller = this.owner.lookup('controller:accounts/info');
    assert.ok(controller);
  });
});
