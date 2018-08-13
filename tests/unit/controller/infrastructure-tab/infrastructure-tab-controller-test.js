import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('infrastructure-tab-controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:infrastructure-tab');

    expect(controller).to.be.ok;
  });
});
