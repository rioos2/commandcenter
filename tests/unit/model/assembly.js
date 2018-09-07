import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: assembly', () => {
  setupTest('assembly', { needs: [] });

  it('has a type of "assembly"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('assembly');
  });


});
