import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement() {
        let _this = this;
        let initValue = this.get('initValue');
        let data = {
            value: initValue,
            min: 1,
            max: 1000,
            parentThis: _this,
            suffix: this.get('resource.suffix'),
            description: this.get('resource.description'),
            title: this.get('resource.title')
        }

        renderChartStorage()
            .container('#chart-'+this.get('resource.name'))
            .data(data)
            .debug(true)
            .run()
    }
});
