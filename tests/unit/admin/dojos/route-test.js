import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | admin dojos', function (hooks) {
  setupTest(hooks);

  test('it does not require access', function (assert) {
    let route = this.owner.lookup('route:admin/dojos');
    assert.ok(route);
  });
});
