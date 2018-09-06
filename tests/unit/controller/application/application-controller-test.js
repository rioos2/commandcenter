import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Controller: application', () => {
  setupTest('controller:application', {
  //   needs: [
  //     'service:settings',
  //     'service:tooltipService',
  //     'service:resourceActions',
  //   ]
  // });
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({
        settings() {},

        tooltipService() {},
        resourceActions() {}

      }));
    }
  });
});
// Replace this with your real tests.
it('exists', function() {
  let controller = this.subject();

  expect(controller).to.be.ok;
});
