import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: node', () => {
  setupTest('node', { needs: [] });

  it('nodeInstallOption', function() {
    let model = this.subject();

    model.set('status.phase', '');
    expect(model.get('nodeInstallOption')).to.be.true;

    model.set('status.phase', 'INSTALLFAILURE');
    expect(model.get('nodeInstallOption')).to.be.false;

  });



});
