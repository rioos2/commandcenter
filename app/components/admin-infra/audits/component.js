import { isEmpty } from '@ember/utils';
import { buildAdminSettingPanel } from '../admin-setting-panel/component';
import { alias } from '@ember/object/computed';
import { get, computed } from '@ember/object';
export default buildAdminSettingPanel('audits', {

  audits: alias('model.audits'),

  emptyLogs: computed('audits.content', function() {
    return isEmpty(get(this, 'audits.content'));
  }),

  tableData: computed('audits.content', function() {
    let data = isEmpty(get(this, 'audits.content')) ? [] : get(this, 'audits.content');

    if (!isEmpty(data)) {
      data.forEach((e) => {
        if (e.envelope.timestamp) {
          e.envelope.timestamp = this.auditedTimestamp(e.envelope.timestamp);
        }
      });
    }

    return data;
  }),

  actions: {
    doReload() {
      this.sendAction('triggerReload');
    },
  },

  auditedTimestamp(date) {
    return moment(date).utcOffset(date).format('MMM DD YYYY, h:mm:ss a').toString();
  },
});
