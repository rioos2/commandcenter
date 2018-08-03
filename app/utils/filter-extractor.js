import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default EmberObject.extend({
  extract: computed('availableParmsHash.[]', 'sentQueryParms', function() {
    const qp = this.get('sentQueryParms');

    return this.get('availableParmsHash').map((parmObj) => {
      if (!isEmpty(qp)) {
        let _filterQueryKey = `${ parmObj.selector }`;
        let _filterValueAccessor = `${ parmObj.accessor }`;
        let _sentValueForKey = qp[_filterQueryKey];

        return EmberObject.create({
          sentKey:    _filterQueryKey,
          sentValue:  _sentValueForKey,
          accessedBy: _filterValueAccessor
        });
      }
    }).filter((e) => !isEmpty(e.sentValue) && !isEmpty(e.accessedBy));
  })
});
