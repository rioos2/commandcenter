
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import EmberObject from '@ember/object';

describe('Unit: Route: authenticated/admin/infra', () => {
  setupTest('route:admin/infra', {
    // needs: [
    //   'service:session',
    //   'service:access',
    //   'service:intl',
    //   'service:tab-session',
    //   'service:organization'
    // ]
    beforeEach() {
      let controller = this.subject();

      controller.set('session', EmberObject.create({ service() {}, }));
    }
  });

  // Replace this with your real tests.
  it('exists', function() {
    let controller = this.subject();

    expect(controller).to.be.ok;
  });
});
