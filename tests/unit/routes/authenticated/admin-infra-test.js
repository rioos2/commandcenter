
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';

describe('Unit: Route: authenticated/admin/infra', () => {
  setupTest('route:admin/infra', {
    needs: [
      'service:session',
      'service:access',
      'service:intl',
      'service:tab-session',
      'service:organization'
    ]
  });

  it('exists', function(){
    let route = this.subject();

    expect(route).to.be.ok;
  });
});
