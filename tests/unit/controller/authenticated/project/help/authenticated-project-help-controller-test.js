import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('authenticated-project-help-controller', () => {
  setupTest('controller:authenticated/project/help', {
      needs: [
          'service:settings',
                ]
  });

  
  it('exists', function() {

    let route = this.subject();
    expect(route).to.be.ok;

  });
});
