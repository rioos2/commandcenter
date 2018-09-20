const SettingPanel = Component.extend({ classNameBindings: [':modal-tab', 'activeTab::invisible'], });

import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default SettingPanel;

export function buildSettingPanel(tab, extras) {
  return SettingPanel.extend({ activeTab: equal('selectedTab', tab) }, extras || {});
}
