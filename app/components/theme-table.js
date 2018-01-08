import Component from '@ember/component';
import { computed } from '@ember/object';
import Table from 'ember-light-table';

export default Component.extend({
    model: null,
    
    columns: computed(function() {
    return [{
            label: 'Info',
            valuePath: 'info',
            cellClassNames: "info-column",
            sortable: false,
            cellComponent: 'label-info'
        }, {
            label: 'IP Address',
            valuePath: 'ipaddress',
            cellClassNames: "ipaddress-column",
            width: '16%'
        }, {
            label: 'Date',
            valuePath: 'date',
            style: "font-weight:bold",
            cellClassNames: "date-column",
            width: '20%'
            // width: '150px'
        }];
    }),

    table: computed('model', function() {
        return new Table(this.get('columns'), this.get('model'));
    })
});
