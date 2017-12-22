import Component from '@ember/component';

export default Component.extend({
    classNames: ['select-filter'],
    isActive: false,

    actions: {
        clickSelect: function(){
            this.toggleProperty('isActive');
        },
        focusOutSelect: function() {
            if(this.get('isActive')) {
                this.set('isActive', false);
            }
        },
        clickOption: function(data){
            this.set('model.name', data);
        }        
    }
});
