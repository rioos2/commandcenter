import Ember from 'ember';

export default Ember.Object.extend({
  extract: Ember.computed('availableParmsHash.[]', 'sentQueryParms', function() {
    const qp = this.get('sentQueryParms');

    return this.get('availableParmsHash').map((parmObj, index) => {
      if (!Ember.isEmpty(qp)) {
        let _filterQueryKey = `${ parmObj.selector }`;
        let _filterValueAccessor = `${ parmObj.accessor }`;
        let _sentValueForKey = qp[_filterQueryKey];

        return Ember.Object.create({
          sentKey:    _filterQueryKey,
          sentValue:  _sentValueForKey,
          accessedBy: _filterValueAccessor
        });
      }
    }).filter((e) => !Ember.isEmpty(e.sentValue) && !Ember.isEmpty(e.accessedBy));
  })
});
