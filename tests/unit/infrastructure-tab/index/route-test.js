import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | infrastructure-tab index', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let route = this.owner.lookup('route:infrastructure-tab/index');
    assert.ok(route);
  });
});
