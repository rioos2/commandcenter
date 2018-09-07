import Ember from 'ember';
import C from 'nilavu/utils/constants';

export default Ember.Component.extend({
  showLoading: false,

  isActive: false,

  selector: Ember.computed.alias('filter.selector'),

  accessor: Ember.computed.alias('filter.accessor'),

  initSelected: Ember.computed.alias('filter._default'),

  group: Ember.computed.alias('category'),

  _init: function() {
    this.set('isActive', false);
    this.set('selectedFilter', this.get('initSelected'));
  }.on('init'),

  currentSelection: function() {
    return this.get('selectedFilter');
  }.property('selectedFilter'),

  didInsertElement() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this._addToCollection);
  },

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  _addToCollection: function() {
    this.get('panel').addObject(this);
  },

  hasa: function() {
    const _selected = this.get('selectedFilter');

    if (this.get('selectedFilter') === this.get('initSelected')) {
      return "";
    }
    return _selected;
  }.property('selectedFilter'),

  filterSelectionChanged: function() {
    const _selector = this.get('selector');
    const _selected = this.get('hasa');
    return Ember.Object.create({
      selector: _selector,
      selected: _selected,
    });
  }.observes('selectedFilter'),

  ///This sync function syncs the data with the view
  // The data needs to be filtered using the accessor.
  // So what we are trying to do here is take the first element and
  // group by just the accessor.
  // An example accessor can be `plan.name`
  syncedData: function() {
    var selectionData = [];
    if (!Ember.isEmpty(this.get('accessor'))) {
      let m = this.get('fullmodel');
      selectionData = m.map((f) => {
        if (!Ember.isEmpty(f)) {
          return f.get(this.get('accessor'))
        }
      }).uniq();

      //Make sure the initSelected appears at the top.
      if (!Ember.isEmpty(this.get('hasa'))) {
        selectionData.unshiftObject(this.get('initSelected'));
      }
    }

    this.set('model.data', selectionData);
    return this.get('model.data');
  }.property('fullmodel.@each', 'accessor'),

  test: function() {
    return Ember.isEmpty(this.get('syncedData')) ? "disable": "";
  }.property('model', 'syncedData'),

  disableFilter: function() {
    return Ember.isEmpty(this.get('syncedData')) ? "disable": "";
  }.property('model', 'syncedData'),

  actions: {
    resetFilter: function() {
      this.sendAction('propagateFilter', this.get('initSelected'));
    },

    selectFilter: function(show) {
      this.toggleProperty('isActive');
    },

    doneFilter: function() {
      if (this.get('isActive')) {
        this.set('isActive', false);
      }
    },

    propagateFilter: function(opt) {
      this.set('selectedFilter', opt);
      const self = this;
      Ember.run.debounce(this, self.fireChanged, self.get('group'), 100);
    },


  }
});
