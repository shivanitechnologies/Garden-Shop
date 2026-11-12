function initAdminDashboard() {
  const tabs = Array.from(document.querySelectorAll('.admin-tabs button'));
  if (!tabs.length) return;
  const panels = {
    users: document.getElementById('panel-users'),
    orders: document.getElementById('panel-orders'),
    messages: document.getElementById('panel-messages')
  };
  const titles = {
    users: ['Users', 'Sample client and team records'],
    orders: ['Orders', 'Illustrative service orders and statuses'],
    messages: ['Messages', 'Sample customer inquiry inbox']
  };
  const search = document.getElementById('admin-search');
  const noResults = document.getElementById('admin-no-results');
  let activeView = 'users';

  const filterRows = () => {
    const panel = panels[activeView];
    if (!panel) {
      noResults.hidden = true;
      return;
    }
    const query = search.value.trim().toLocaleLowerCase();
    const rows = Array.from(panel.querySelectorAll('tbody tr'));
    let visibleRows = 0;
    rows.forEach((row) => {
      const visible = row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !visible;
      if (visible) visibleRows += 1;
    });
    noResults.hidden = visibleRows > 0;
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    activeView = tab.dataset.view;
    tabs.forEach((item) => item.setAttribute('aria-pressed', String(item === tab)));
    Object.entries(panels).forEach(([name, panel]) => { panel.hidden = name !== activeView; });
    const [heading, description] = titles[activeView];
    document.getElementById('records-heading').textContent = heading;
    document.getElementById('records-description').textContent = description;
    search.value = '';
    filterRows();
    search.placeholder = `Search ${activeView}`;
  }));
  search.addEventListener('input', filterRows);
}

initAdminDashboard();
