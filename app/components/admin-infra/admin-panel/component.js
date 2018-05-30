const AdminPanel = Ember.Component.extend({
  classNameBindings: [':modal-tab', 'activeTab::invisible'],
});

export default AdminPanel;

export function buildAdminPanel(tab, extras) {
    return AdminPanel.extend({
      activeTab: Ember.computed.equal('selectedTab', tab)
  }, extras || {});
}
