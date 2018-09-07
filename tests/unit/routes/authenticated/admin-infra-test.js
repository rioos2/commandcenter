
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Route: authenticated/admin/infra', function () {
    setupTest('route:admin/infra', {
        needs: [
          'service:session',
          'service:access',
          'service:intl'
        ]
    });

    it('exists', function () {
        let route = this.subject();
        expect(route).to.be.ok;
    });
});
