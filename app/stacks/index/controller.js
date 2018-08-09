import Ember from 'ember';
import C from 'nilavu/utils/constants';
import FilterParmsExtractor from 'nilavu/utils/filter-extractor';
import flat from 'npm:flat';


export default Ember.Controller.extend({
  stacksController: Ember.inject.controller('stacks'),

  showLoading: false,

  panels: [],

  categories: Ember.computed.alias('stacksController.which'),

  fullmodel: Ember.computed.alias('model'),

  // This has be evaluated based on data. So we show the tab that has max
  search: function() {
    return this.recvQueryParms()[C.FILTERS.QUERY_PARAM_SEARCH];
  }.property('model'),

  // / [blockchain]   -> [assembly1, assembly2, assembly3]
  groupedStacks: function() {
    return this.groupBy(this.get('model.stacks.content'),
      'spec.assembly_factory.spec.plan.category');
  }.property('model.stacks.content.[]'),

  allStacks: function() {
    return this.filteredStacks();
  }.property('groupedStacks', 'model.stacks.content.@each'),

  actions: {
    search() {
      this.toggleProperty('isSearchVisible');
    },

  },
  // in stacksController
  recvQueryParms() {
    let recevd = Ember.Object.create();
    const self = this;

    C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH.forEach((f) => {
      recevd.set(f.selector, self.get(`stacksController.${ f.selector }`));
    });

    return recevd;
  },

  // Returns the queryparms value for the propertie set [os, location, db, status, name]
  findByFilter(rules, content) {
    let valueSetMatch = true;

    rules.forEach((ruleObj) => {
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

  //        - everything if none matches.
  filteredStacks() {
    var self = this;

    this.spinnerCheck();
    let rules = this.extractedParms();
    let filteredStacks = [];

    this.get('categories').forEach((category) => {
      let stacks = this.get('groupedStacks').findBy('type', category);

      if (!Ember.isEmpty(rules) && stacks) {
        const _stacks = stacks;
        let _contents = _stacks.contents.filter((content) => {
          if (!Ember.isEmpty(this.get('search'))) {
            return this.findBySearch(rules, content);
          } else {
            return this.findByFilter(rules, content);
          }
        });

        const _grouped = this.groupBy(_contents, 'spec.assembly_factory.spec.plan.category').findBy('type', category);

        filteredStacks.push(_grouped);
      } else {
        filteredStacks.push(stacks);
      }
    });

    Ember.run.scheduleOnce('afterRender', () => {
      this._maxLaunchedCategory(filteredStacks);
    });

    Em.run.later(() => {
      self.spinnerCheck();
    }, 500);

    return filteredStacks;
  },

  // Returns the extracted parms from the received query parms
  extractedParms() {

    if (!Ember.isEmpty(this.get('search'))) {
      return Ember.Object.create({
        sentKey:    C.FILTERS.QUERY_PARAM_SEARCH,
        sentValue:  this.get('search'),
        accessedBy: C.FILTERS_SEARCH_ACCESSORS
      });
    }

    return FilterParmsExtractor.create({
      availableParmsHash: C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH,
      sentQueryParms:     this.recvQueryParms(),
    }).get('extract');
  },

  // Returns - the filteredStacks  applying the filter (or)
  spinnerCheck() {
    this.toggleProperty('showLoading');
  },

  // eg: group by `plan.category`
  groupBy(contentArray, groupAccessor) {
    var result = [];

    contentArray.forEach((item) => {
      let category = `${ item.get(groupAccessor) }`;

      var hasType = result.findBy('type', category);

      if (!hasType) {
        result.pushObject(Ember.Object.create({
          type:     category,
          contents: []
        }));
      }
      result.findBy('type', category).get('contents').pushObject(item);
    });

    return result;
  },

  // the maximum launched count of [machine, containers, blockchain]
  _maxLaunchedCategory(fss) {
    let maxLaunchedCategory = C.CATEGORIES.MACHINE;
    let maxLaunched = 0;

    if (!Ember.isEmpty(fss)) {
      fss.forEach((stack) => {
        if (!Ember.isEmpty(stack) && stack.length > maxLaunched) {
          maxLaunchedCategory = stack.type;
          maxLaunched = stack.length;
        }
      });
    }
    this.set('selectedTab', maxLaunchedCategory);
  },



  // number of launches.
  selectedTab: C.CATEGORIES.MACHINE,

  // /Group the assemblys list into
  // / [machine]      -> [assembly1, assembly2, assembly3]
  // / [container]    -> [assembly1, assembly2, assembly3]
  // Gets call from the transition of applyRule action with the queryParms containing
  // the filter rules.
  // The extractParms, extracts queryParm values and presents
  // as { sentKey: os, sentValue: "ubuntu", accessedBy: assembly_factory.name'}
  // Returns the grouped array based on the groupAccessor
  // Returns the tab that has to be selected. This is figured out by the
});
