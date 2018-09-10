
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

// describe('Unit: Route: authenticated/project/index', () => {
//   setupTest('route:authenticated/project/index', {
//     needs: [
//       'service:session',
//       'service:settings',
//       'service:access',
//       'service:user-language',
//       'service:storeReset'
//     ]
//   });
//
//   it('exists', function() {
//     let route = this.subject();
//
//     expect(route).to.be.ok;
//   });
// });
describe('Unit: Controller: stack/console', () => {
  setupTest('controller:stack/console', {
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({ service: {}, }));
    }
  });
  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
