import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
// import EmberObject from '@ember/object';
// import { run } from '@ember/runloop';

describe('Unit: Controller: authenticated/project', () => {
  setupTest('controller:authenticated', {
    needs: [
      'controller:application',
      'service:settings',
      'service:guardian',
    ]
  });
  //   beforeEach() {
  //     let controller = this.subject();
  //
  //     controller.set('session', EmberObject.create({
  //       controller: {},
  //       service:    {},
  //     }));
  //   }
  // });

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    // expect(controller).to.be.ok;

    expect(controller.get('hasHosts')).to.be.true;

    controller.set('hasHosts', 'test');
  });
});
