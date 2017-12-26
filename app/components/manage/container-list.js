import Component from '@ember/component';

export default Component.extend({
    classNames: ['container-list'],


    dummy: function() {
    return {
        name: Math.random().toString(36).substring(7),
        counter: Math.floor(Math.random() * 100)
      }
    }.property('model'),

    updateDummy: function() {
      alert("hai");
        this.set('dummy.counter',Math.floor(Math.random() * 100));
    }.observes('model'),

});
