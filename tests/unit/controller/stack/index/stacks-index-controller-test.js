import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('stack index controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:stack/index');

    expect(controller).to.be.ok;
  });
});
