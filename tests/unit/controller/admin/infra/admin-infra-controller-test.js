import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('admin info controller', () => {
  setupTest();

  it('exists', function() {
    let controller = this.owner.lookup('controller:admin/infra');

    expect(controller).to.be.ok;
  });
});
