
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';

describe('Unit: Route: authenticated/accounts/index', () => {
  setupTest('route:accounts/index', { needs: [] });

  it('exists', function() {
    let route = this.subject();

    expect(route).to.be.ok;
  });
});
