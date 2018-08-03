import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('login-index-controller', () => {
  setupTest('controller:login/index', {
      needs: [
          'service:session',
          'service:access',
          'service:intl'
      ]
  });

  
  it('exists', function() {

    let route = this.subject();
    expect(route).to.be.ok;

  });
});
