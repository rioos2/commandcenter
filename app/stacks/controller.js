import Ember from 'ember';
import C from 'nilavu/utils/constants';

//* bit ugly to stamp the filter with their purpose */
export default Ember.Controller.extend({
  queryParams: [C.FILTERS.QUERY_PARAM_OS, C.FILTERS.QUERY_PARAM_LOCATION,
    C.FILTERS.QUERY_PARAM_DB, C.FILTERS.QUERY_PARAM_NETWORK, C.FILTERS.QUERY_PARAM_STATUS,
    C.FILTERS.QUERY_PARAM_SEARCH],
  // / The queryParms sets the value of os="ubuntu", in the below variables.
  os:       '',
  location: '',
  db:       '',
  status:   '',
  network:  '',
  // / [os, location, db, status, network] are set to '' (defaults)
  search:   '',
  which:       C.CATEGORIES_ALL,
  // / Mutually exclusive, which means if you do a manual search then the
});
