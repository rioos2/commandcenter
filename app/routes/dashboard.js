import Ember from 'ember';

export default Ember.Route.extend({
    activate: function() {
        this.send('unfixedTop');
        this.send('unfixedBottom');
    },
    deactivate: function() {
        this.send('unfixedTop');
        this.send('unfixedBottom');
    }
});
