import ArrayProxy from '@ember/array/proxy';
import { once } from '@ember/runloop';
import { sort } from '@ember/object/computed';

export default ArrayProxy.extend({
  sourceContent:  null,
  sortProperties: null,

  // Override this and return true/false for items that should/n't be included
  filterFn: null,

  // Override this with the keys the filterFn needs, as an array of single properties
  // e.g  'sourceContent.@each.thing
  dependentKeys: null,

  _boundFn: null,

  init() {
    if (!this.get('sortProperties')) {
      this.set('sortProperties', ['displayName', 'name', 'id']);
    }

    if (!this.get('filterFn')) {
      this.set('filterFn', () => {
        return true;
      });
    }

    (this.get('dependentKeys') || []).forEach((key) => {
      this.addObserver(key, this, 'sourceContentChanged');
    });

    this.set('_boundFn', this.get('filterFn').bind(this));
    this.updateContent();
    this._super();
  },

  sourceContentChanged() {
    once(this, 'updateContent');
  },

  updateContent() {
    var neu = (this.get('sourceContent') || []).filter(this.get('_boundFn'));

    this.set('content', neu);
  },

  // The array proxy reads this property
  arrangedContent: sort('content', 'sortProperties'),
});
