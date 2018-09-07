
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Route: authenticated/project', function () {
    setupTest('route:authenticated/project', {
        needs: [
          'service:session',
          'service:settings',
          'service:access',
          'service:user-language',
          'service:storeReset'
        ]
    });

    it('exists', function () {
        let route = this.subject();
        expect(route).to.be.ok;
    });
});
