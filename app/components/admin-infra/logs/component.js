import { isEmpty } from '@ember/utils';
import { buildAdminSettingPanel } from '../admin-setting-panel/component';
export default buildAdminSettingPanel('logs', {

  emptyLogs: function() {
    return isEmpty(this.get('model.logs.content'));
  }.property('model.logs.content'),

  tableData: function() {
    let data = isEmpty(this.get('model.logs.content')) ? [] : this.get('model.logs.content');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.time) {
          e.time = this.auditedTimestamp(e.time);
        }
      });
    }

    return data;
  }.property('model'),



  actions: {
    doReload() {
      this.sendAction('triggerReload');
    },
  },

  auditedTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },
});
