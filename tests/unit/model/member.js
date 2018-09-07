import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: member', () => {
  setupTest('member', { needs: [] });

  it('has a type of "member"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('member');
  });


});
