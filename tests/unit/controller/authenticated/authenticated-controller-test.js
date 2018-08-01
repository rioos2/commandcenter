import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('authenticated-controller', () => {
  setupTest();

  
  it('exists', function() {
    let controller = this.owner.lookup('controller:authenticated');

    expect(controller).to.be.ok;
  });
});
