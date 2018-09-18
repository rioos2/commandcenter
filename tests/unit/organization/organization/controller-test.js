import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | organization organization', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let controller = this.owner.lookup('controller:organization/organization');
    assert.ok(controller);
  });
});
