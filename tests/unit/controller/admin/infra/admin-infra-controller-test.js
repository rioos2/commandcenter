import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

// import { run } from '@ember/runloop';
// import wait from 'ember-test-helpers/wait';

describe('Unit: Controller: admin/infra', () => {
  setupTest('controller:admin/infra', {
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({
        selectedTab:  {},
        panels:       {},
        modelSpinner: {}
      }));
    }
  });
  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
