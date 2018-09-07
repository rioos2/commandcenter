import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Stacks Controller', () => {
  setupTest();


  it('exists', function() {
    let controller = this.owner.lookup('controller:stacks');

    expect(controller).to.be.ok;
  });
});
