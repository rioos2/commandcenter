const InfraPanel = Component.extend({ classNameBindings: [':modal-tab', 'activeTab::invisible'], });

import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default InfraPanel;

export function buildInfraPanel(tab, extras) {
  return InfraPanel.extend({ activeTab: equal('selectedTab', tab) }, extras || {});
}
