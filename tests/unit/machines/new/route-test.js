import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | machines new', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let route = this.owner.lookup('route:machines/new');
    assert.ok(route);
  });
});
