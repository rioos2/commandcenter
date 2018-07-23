
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Route: wizard/index', function () {
    setupTest('route:wizard/index', {
        needs: [
            'service:session',
            'service:access'
        ]
    });

    it('exists', function () {
        let route = this.subject();
        expect(route).to.be.ok;
    });
});
