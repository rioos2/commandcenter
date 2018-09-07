const AdminSettingPanel = Component.extend({ classNameBindings: [':modal-tab', 'activeTab::invisible'], });

import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default AdminSettingPanel;

export function buildAdminSettingPanel(tab, extras) {
  return AdminSettingPanel.extend({ activeTab: equal('selectedTab', tab) }, extras || {});
}
