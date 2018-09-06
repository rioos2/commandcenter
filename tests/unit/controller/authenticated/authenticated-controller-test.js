import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';
// import { run } from '@ember/runloop';

describe('Unit: Controller: authenticated/project', () => {
  setupTest('controller:authenticated/project', {
  // needs: [     // eslint-disable-line
  //     'controller:application',
  //     'service:settings',
  //     'service:guardian',
  //   ]
  // });
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({
        controller() {},
        service() {},
      }));
    }
  });
});
// Replace this with your real tests.
it('exists', function() {
  let controller = this.subject();

  expect(controller).to.be.ok;
});

//   // Replace this with your real tests.
//   it('hasHosts', function() {
//     let controller = this.subject({ model: EmberObject.create({ hosts: ['test'] }) });
//
//     expect(controller.get('hasHosts')).to.be.ok;
//
//     run(() => {
//       controller.set('model.host', []);
//
//       expect(controller.get('hasHosts')).to.not.be.ok;
//     });
//   });
// });
