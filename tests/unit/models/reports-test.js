import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | reports', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let model = this.owner.lookup('model:reports');
    assert.ok(model);
  });
});