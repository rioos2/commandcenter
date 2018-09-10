import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

// describe('stack-container-console controller', () => {
//   setupTest();
//
//
//   it('exists', function() {
//     let controller = this.owner.lookup('controller:stack/container-console');
//
//     expect(controller).to.be.ok;
//   });
// });
describe('Unit: Controller: stack/container-console', () => {
  setupTest('controller:stack/container-console', {
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({ queryParams() {}, }));
    }
  });


  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
