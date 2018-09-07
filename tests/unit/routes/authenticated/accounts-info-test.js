
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';

describe('Unit: Route: authenticated/accounts/info', () => {
  setupTest('route:accounts/info', {
    needs: [
      'service:session',
      'service:access',
      'service:intl',
      'service:organization',
      'service:tab-session'
    ]
  });

  it('exists', function() {
    let route = this.subject();

    expect(route).to.be.ok;
  });
});
