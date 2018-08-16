import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: origin', () => {
  setupTest('origin', { needs: [] });

  it('has a type of "origin"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('origin');
  });


});
