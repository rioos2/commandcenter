import Controller from '@ember/controller';

export default Controller.extend({
    isSearchVisible : false,

    assemblyLength: function() {
      return this.get('model.content').length;
    }.property('model'),

    actions: {
        search() {
            this.toggleProperty('isSearchVisible');
        }
    }
});
