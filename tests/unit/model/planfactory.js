import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: planfactory', () => {
  setupTest('planfactory', { needs: [] });

  it('has a type of "planfactory"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('planfactory');
  });


});
