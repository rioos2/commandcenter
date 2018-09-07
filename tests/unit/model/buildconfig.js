import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: buildconfig', () => {
  setupTest('buildconfig', { needs: [] });

  it('has a type of "buildconfig"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('buildconfig');
  });


});
