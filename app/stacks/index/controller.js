import C from 'nilavu/utils/constants';
import FilterParmsExtractor from 'nilavu/utils/filter-extractor';
import Controller from '@ember/controller';
import { inject } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop'
import EmberObject from '@ember/object';
import { later } from '@ember/runloop';

export default Controller.extend({
  showLoading: false,

  stacksController: inject.controller('stacks'),

  categories: alias('stacksController.which'),

  fullmodel: alias('model'),

  panels: [],

  //  This has be evaluated based on data. So we show the tab that has max
  //  number of launches.
  selectedTab: function() {
    return C.CATEGORIES.MACHINE;
  }.property(),

  //  Returns the queryparms value for the propertie set [os, location, db, status, name]
  //  in stacksController
  recvQueryParms() {
    let recevd = EmberObject.create();

    const self = this;

    C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH.forEach(-function(f) {

      recevd.set(f.selector, self.get(`stacksController.${ f.selector }`));
    });

    return recevd;
  },

  findByFilter(rules, content) {
    let valueSetMatch = true;

    rules.forEach(-function(ruleObj) {
      if (`${ content.get(ruleObj.accessedBy) }`.includes(ruleObj.sentValue) && valueSetMatch) {
        valueSetMatch = true;
      } else {
        valueSetMatch = false;
      }
    });

    return valueSetMatch;
  },

  findBySearch(rules, content) {
    let valueSetMatch = false;

    for (let ruleObj of rules.accessedBy) {
      if (ruleObj) {
        if (`${ content.get(ruleObj) }`.toLowerCase().includes(rules.sentValue.toLowerCase())) {
          valueSetMatch = true;
          break;
        }
      }
    }

    return valueSetMatch;
  },

  search: function() {
    return this.recvQueryParms()[C.FILTERS.QUERY_PARAM_SEARCH];
  }.property('model'),

  // Group the assemblys list into
  // [machine]      -> [assembly1, assembly2, assembly3]
  // [container]    -> [assembly1, assembly2, assembly3]
  // [blockchain]   -> [assembly1, assembly2, assembly3]
  groupedStacks: function() {
    return this.groupBy(this.get('model.stacks.content'),
      'spec.assembly_factory.spec.plan.category');
  }.property('model.stacks.content.[]'),

  //  Gets call from the transition of applyRule action with the queryParms containing
  //  the filter rules.
  //  The extractParms, extracts queryParm values and presents
  //  as { sentKey: os, sentValue: "ubuntu", accessedBy: assembly_factory.name'}
  //  Returns - the filteredStacks  applying the filter (or)
  //        - everything if none matches.
  filteredStacks() {
    var self = this;

    this.spinnerCheck();
    let rules = this.extractedParms();
    let filteredStacks = [];
    this.get('categories').forEach(-function(category) {
      let stacks = this.get('groupedStacks').findBy('type', category);

      if (!isEmpty(rules) && stacks) {
        const _stacks = stacks;
        let _contents = _stacks.contents.filter(-function(content) {
          if (!isEmpty(this.get('search'))) {
            return this.findBySearch(rules, content);
          } else {
            return this.findByFilter(rules, content);
          }
        }.bind(this));

        const _grouped = this.groupBy(_contents, 'spec.assembly_factory.spec.plan.category').findBy('type', category);

        filteredStacks.push(_grouped);
      } else {
        filteredStacks.push(stacks);
      }
    }.bind(this));

    scheduleOnce('afterRender', () => {
      this._maxLaunchedCategory(filteredStacks);
    });

    later(-function() {
      self.spinnerCheck();
    }, 500);

    return filteredStacks;
  },

  //  Returns the extracted parms from the received query parms
  extractedParms() {

    if (!isEmpty(this.get('search'))) {
      return EmberObject.create({
        sentKey:              C.FILTERS.QUERY_PARAM_SEARCH,
        sentValue:            this.get('search'),
        accessedBy:           C.FILTERS_SEARCH_ACCESSORS
      });
    }

    return FilterParmsExtractor.create({
      availableParmsHash:           C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH,
      sentQueryParms:               this.recvQueryParms(),
    }).get('extract');
  },

  allStacks: function() {
    return this.filteredStacks();
  }.property('groupedStacks', 'model.stacks.content.@each'),

  spinnerCheck() {
    this.toggleProperty('showLoading');
  },

  // Returns the grouped array based on the groupAccessor
  // eg: group by `plan.category`
  groupBy(contentArray, groupAccessor) {
    var result = [];

    contentArray.forEach(-function(item) {
      let category = `${ item.get(groupAccessor) }`;

      var hasType = result.findBy('type', category);

      if (!hasType) {
        result.pushObject(EmberObject.create({
          type:          category,
          contents:       []
        }));
      }
      result.findBy('type', category).get('contents').pushObject(item);
    });

    return result;
  },

  //  Returns the tab that has to be selected. This is figured out by the
  //  the maximum launched count of [machine, containers, blockchain]
  _maxLaunchedCategory(fss) {
    let maxLaunchedCategory = C.CATEGORIES.MACHINE;
    let maxLaunched = 0;

    if (!isEmpty(fss)) {
      fss.forEach(-function(stack) {
        if (!isEmpty(stack) && stack.length > maxLaunched) {
          maxLaunchedCategory = stack.type;
          maxLaunched = stack.length;
        }
      });
    }
    this.set('selectedTab', maxLaunchedCategory);
  },



  actions: {
    search() {
      this.toggleProperty('isSearchVisible');
    },

  }
});
