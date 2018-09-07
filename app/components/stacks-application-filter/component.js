import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';
import { debounce } from '@ember/runloop';
import EmberObject from '@ember/object';


export default Component.extend({
  showLoading: false,

  isActive: false,

  selector: alias('filter.selector'),

  accessor: alias('filter.accessor'),

  initSelected: alias('filter._default'),

  group: alias('category'),

  _init: function() {
    this.set('isActive', false);
    this.set('selectedFilter', this.get('initSelected'));
  }.on('init'),

  currentSelection: function() {
    return this.get('selectedFilter');
  }.property('selectedFilter'),

  showDropDown: function() {
    return this.get('isActive') ? 'active' : '';
  }.property('isActive'),

  hasa: function() {
    const _selected = this.get('selectedFilter');

    if (this.get('selectedFilter') === this.get('initSelected')) {
      return '';
    }

    return _selected;
  }.property('selectedFilter'),

  filterSelectionChanged: function() {
    const _selector = this.get('selector');
    const _selected = this.get('hasa');

    return EmberObject.create({
      selector: _selector,
      selected: _selected,
    });
  }.observes('selectedFilter'),

  // An example accessor can be `plan.name`
  syncedData: function() {
    var selectionData = [];

    if (!isEmpty(this.get('accessor'))) {
      let m = this.get('fullmodel');

      selectionData = m.map((f) => {
        if (!isEmpty(f)) {
          return f.get(this.get('accessor'))
        }
      }).uniq();

      // Make sure the initSelected appears at the top.
      if (!isEmpty(this.get('hasa'))) {
        selectionData.unshiftObject(this.get('initSelected'));
      }
    }

    this.set('model.data', selectionData);

    return this.get('model.data');
  }.property('fullmodel.@each', 'accessor'),

  // group by just the accessor.
  test: function() {
    return isEmpty(this.get('syncedData')) ? 'disable' : '';
  }.property('model', 'syncedData'),

  // So what we are trying to do here is take the first element and
  disableFilter: function() {
    return isEmpty(this.get('syncedData')) ? 'disable' : '';
  }.property('model', 'syncedData'),

  didInsertElement() {
    this._super();
    scheduleOnce('afterRender', this, this._addToCollection);
  },

  // The data needs to be filtered using the accessor.
  actions: {
    resetFilter() {
      this.sendAction('propagateFilter', this.get('initSelected'));
    },

    selectFilter() {
      this.toggleProperty('isActive');
    },

    doneFilter() {
      if (this.get('isActive')) {
        this.set('isActive', false);
      }
    },

    propagateFilter(opt) {
      this.set('selectedFilter', opt);
      const self = this;

      debounce(this, self.fireChanged, self.get('group'), 100);
    },


  },
  _addToCollection() {
    this.get('panel').addObject(this);
  },

  // /This sync function syncs the data with the view
});
