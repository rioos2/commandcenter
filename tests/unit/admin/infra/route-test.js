import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | admin infra', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let route = this.owner.lookup('route:admin/infra');
    assert.ok(route);
  });
});
