/*eslint-disable*/
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | login index', function (hooks) {
  setupTest(hooks);

  test('it does not require auth', function (assert) {
    let route = this.owner.lookup('route:login/index');
    assert.ok(route);
  });
});
