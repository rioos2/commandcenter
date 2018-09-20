import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | object meta builder', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let model = this.owner.lookup('model:object-meta-builder');
    assert.ok(model);
  });
});
