import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | machines new', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let controller = this.owner.lookup('controller:machines/new');
    assert.ok(controller);
  });
});
