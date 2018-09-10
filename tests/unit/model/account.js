import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: account', () => {
  setupTest('account', { needs: [] });

  it('has a type of "account"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('account');
  });
});
