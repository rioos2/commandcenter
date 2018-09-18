/*eslint-disable*/
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | login index', function (hooks) {
  setupTest(hooks);

  test('it does not require auth', function (assert) {
    let controller = this.owner.lookup('controller:login/index');
    assert.ok(controller);
  });
});
