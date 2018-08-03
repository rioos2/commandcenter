const AdminInfraPanel = Ember.Component.extend({ classNameBindings: [':modal-tab', 'activeTab::invisible'], });

export default AdminInfraPanel;

export function buildAdminInfraPanel(tab, extras) {
  return AdminInfraPanel.extend({ activeTab: Ember.computed.equal('selectedTab', tab) }, extras || {});
}
