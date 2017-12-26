import Component from '@ember/component';

export default Component.extend({
    tagName: '',
    isSearchVisible: false,

    assemblyLength: function() {
      return this.get('assemblys').length;
    }.property('model'),

    actions: {
      search() {
        this.toggleProperty('isSearchVisible');
      }
    }

});
