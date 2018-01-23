import Component from '@ember/component';

export default Component.extend({
    // classNames: ['select-filter'],
    isActiveA: false,
    isActiveB: false,
    isActiveC: false,
    isActiveD: false,
    isActiveE: false,
    tagName: '',

    actions: {
        clickSelect: function(currentActive){
            this.toggleProperty(currentActive);
        },
        focusOutSelect: function(isActive) {
            if(this.get(isActive)) {
                this.set(isActive, false);
            }
        },
        clickOption: function(id,path,data){
          // this.set('model.name', data)
            this.set(path, data);
            this.sendAction('filterProcess', {type:this.get(id), selected: data})
        }
    }
});