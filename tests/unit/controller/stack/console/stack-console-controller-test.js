import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Controller: stack/console', () => {
  setupTest('controller:stack/console', {
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({
        queryParams:    {},
        host:           {},
        port:           {},
        name:           {},
        sendCtrlAltDel: {}
      }));
    }
  });
  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
