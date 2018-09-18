import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | infrastructure-tab data-center', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let controller = this.owner.lookup('controller:infrastructure-tab/data-center');
    assert.ok(controller);
  });
});
