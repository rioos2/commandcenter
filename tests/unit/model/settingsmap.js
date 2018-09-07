import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: settingsmap', () => {
  setupTest('settingsmap', { needs: [] });

  it('has a type of "settingsmap"', function() {
    let model = this.subject();

    expect(model.get('type')).to.equal('settingsmap');
  });


});
