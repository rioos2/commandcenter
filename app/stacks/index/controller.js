import Ember from 'ember';
import C from 'nilavu/utils/constants';
import FilterParmsExtractor from 'nilavu/utils/filter-extractor';
import flat from 'npm:flat';


export default Ember.Controller.extend({
  showLoading: false,

  stacksController: Ember.inject.controller('stacks'),

  categories: Ember.computed.alias('stacksController.which'),

  fullmodel: Ember.computed.alias('model'),

  panels: [],

  //This has be evaluated based on data. So we show the tab that has max
  //number of launches.
  selectedTab: C.CATEGORIES.MACHINE,

  //Returns the queryparms value for the propertie set [os, location, db, status, name]
  //in stacksController
  recvQueryParms: function () {
    let recevd = Ember.Object.create();

    const self = this;
    C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH.forEach(function (f) {
      recevd.set(f.selector, self.get(`stacksController.${f.selector}`));
    });

    return recevd;
  },

  ///Group the assemblys list into
  /// [machine]      -> [assembly1, assembly2, assembly3]
  /// [container]    -> [assembly1, assembly2, assembly3]
  /// [blockchain]   -> [assembly1, assembly2, assembly3]
  groupedStacks: function () {
    this.set('showLoading', true);
    return this.groupBy(this.get('model.stacks.content'),
      "spec.assembly_factory.spec.plan.category");
  }.property('model.stacks.content[]'),

  //Gets call from the transition of applyRule action with the queryParms containing
  //the filter rules.
  //The extractParms, extracts queryParm values and presents
  //as { sentKey: os, sentValue: "ubuntu", accessedBy: assembly_factory.name'}
  //Returns - the filteredStacks  applying the filter (or)
  //        - everything if none matches.
  filteredStacks() {
    let rules = this.extractedParms();
    let filteredStacks = [];
    this.get('categories').forEach(function (category) {
      let stacks = this.get('groupedStacks').findBy('type', category);

      if (!Ember.isEmpty(rules) && stacks) {
        const _stacks = stacks;
        let _contents = _stacks.contents.filter(function (content) {
          let valueSetMatch = true;
          rules.forEach(function (ruleObj) {
            if(`${content.get(ruleObj.accessedBy)}`.includes(ruleObj.sentValue) && valueSetMatch) {
              valueSetMatch = true;
            } else {
              valueSetMatch = false;
            }
          });
          return valueSetMatch;
        });

        const _grouped = this.groupBy(_contents, "spec.assembly_factory.spec.plan.category").findBy('type', category);
        filteredStacks.push(_grouped);
      } else {
        filteredStacks.push(stacks);
      }
    }.bind(this));

    Ember.run.scheduleOnce('afterRender', () => {
      this._maxLaunchedCategory(filteredStacks);
    });

    this.set('showLoading', false);
    return filteredStacks;
  },

  //Returns the extracted parms from the received query parms
  extractedParms: function () {
    // if (!Ember.isEmpty(this.get('search'))) {
    //   return Ember.Object.create(
    //     { C.FILTER_QUERY_PARAMS_SEARCH: [this.get('search').toUpperCase()] }
    //   );
    // }
    return FilterParmsExtractor.create({
      availableParmsHash: C.FILTERS.QUERYPARM_TO_ACCESSOR_HASH,
      sentQueryParms: this.recvQueryParms(),
    }).get('extract');
  },

  allStacks: function () {
    return this.filteredStacks();
  }.property('groupedStacks'),

  //Returns the grouped array based on the groupAccessor
  // eg: group by `plan.category`
  groupBy: function (contentArray, groupAccessor) {
    var result = [];
    contentArray.forEach(function (item) {
      let category = `${item.get(groupAccessor)}`;

      var hasType = result.findBy('type', category);

      if (!hasType) {
        result.pushObject(Ember.Object.create({
          type: category,
          contents: []
        }));
      }
      result.findBy('type', category).get('contents').pushObject(item);
    });

    return result;
  },

  //Returns the tab that has to be selected. This is figured out by the
  //the maximum launched count of [machine, containers, blockchain]
  _maxLaunchedCategory: function (fss) {
    let maxLaunchedCategory = C.CATEGORIES.MACHINE;
    let maxLaunched = 0;
    if (!Ember.isEmpty(fss)) {
      fss.forEach(function (stack) {
        if (!Ember.isEmpty(stack) && stack.length > maxLaunched) {
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
