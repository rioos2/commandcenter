import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: sensei', () => {
  setupTest('sensei', { needs: [] });

  it('has a type of "sensei"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('node');
  });


});
