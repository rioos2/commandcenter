
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Route: authenticated/project/index', function () {
    setupTest('route:authenticated/project/index', {
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
