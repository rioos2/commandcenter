import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('login-index-controller', () => {
  setupTest('controller:login/index', {
    // needs: [
    //   'service:session',
    //   'service:access',
    //   'service:intl'
    // ]
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({
        service() {},
        // tooltipService() {},
        // resourceActions() {}

      }));
    }
  });
});
// Replace this with your real tests.
it('exists', function() {
  let controller = this.subject();

  expect(controller).to.be.ok;
});


//   it('exists', function() {
//     let route = this.subject();
//
//     expect(route).to.be.ok;
//
//   });
// });
