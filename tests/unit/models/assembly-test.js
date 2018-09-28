import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | assembly', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let model = this.owner.lookup('model:assembly');
    assert.ok(model);
  });
});