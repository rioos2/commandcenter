const AdminInfraPanel = Component.extend({ classNameBindings: [':modal-tab', 'activeTab::invisible'], });

import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default AdminInfraPanel;

export function buildAdminInfraPanel(tab, extras) {
  return AdminInfraPanel.extend({ activeTab: equal('selectedTab', tab) }, extras || {});
}
