import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit: Model: sensei', () => {
  setupTest('sensei', { needs: [] });

  it('senseiRetryInstallOption check', function() {
    let model = this.subject();

    model.set('status.phase', 'INSTALLFAILURE');
    expect(model.get('senseiRetryInstallOption')).to.be.true;
  });


});
