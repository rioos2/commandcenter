import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Route: wizard/index', () => {
  setupTest('route:wizard/index', {

    beforeEach() {
      let route = this.subject();

      route.set('session', EmberObject.create({ queryParams: {}, }));
    }
  });

  // Replace this with your real tests.
  it('exists', function() {
    let route = this.subject();

    expect(route).to.be.ok;
  });
});
