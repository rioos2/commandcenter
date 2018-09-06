import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

// describe('stack index controller', () => {
//   setupTest();
//
//   it('exists', function() {
//     let controller = this.owner.lookup('controller:stack/index');
//
//     expect(controller).to.be.ok;
//   });
// });
describe('Unit: Controller: stack/index', () => {
  setupTest('controller:stack/index', {});

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
