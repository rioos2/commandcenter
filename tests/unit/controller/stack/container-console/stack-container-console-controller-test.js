import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

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
