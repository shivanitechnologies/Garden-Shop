(() => {
  const content = document.getElementById('workspace-content');
  const title = document.getElementById('workspace-title');
  const nav = document.querySelectorAll('.workspace-nav');
  if (!content || !title || !nav.length) return;
  const isCustomer = Boolean(document.querySelector('.customer-workspace'));
  const adminTitles = {
    overview: 'Overview', customers: 'Customers', bookings: 'Service Bookings', projects: 'Garden Projects',
    services: 'Services', employees: 'Employees', pricing: 'Pricing', gallery: 'Gallery Management',
    reviews: 'Reviews', payments: 'Payments', reports: 'Reports & Analytics', notifications: 'Notifications', settings: 'Profile Settings'
  };
  const customerTitles = {
    overview: 'Good morning, Garden owner.', 'book-service': 'Book a Service', 'my-bookings': 'My Bookings',
    'my-projects': 'My Garden Projects', history: 'Service History', addresses: 'My Addresses',
    payments: 'Payments', notifications: 'Notifications', profile: 'Profile Settings'
  };

  const table = (heads, rows) => `<div class="table-scroll"><table><thead><tr>${heads.map((head) => `<th>${head}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const status = (value) => `<span class="status-pill status-${value.toLowerCase().replace(/\s+/g, '-')}">${value}</span>`;
  const metric = (label, value, note) => `<article class="workspace-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
  const adminViews = {
    overview: () => `<div class="workspace-metrics">${metric('Total customers','1,284','+8.2% this month')}${metric('Total bookings','246','31 awaiting review')}${metric('Pending bookings','31','Across 6 service types')}${metric('Completed projects','89','+12 this quarter')}${metric('Total revenue','$84,290','Sample data · this year')}${metric('Active projects','14','4 nearing completion')}</div>
      <div class="workspace-columns"><section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Performance</span><h2>Revenue overview</h2></div><select aria-label="Revenue period"><option>Last 7 months</option><option>This year</option></select></div><div class="revenue-chart" role="img" aria-label="Sample monthly revenue chart"><div style="--bar:42%"><span>$8.2k</span><i></i><small>Jan</small></div><div style="--bar:55%"><span>$10.4k</span><i></i><small>Feb</small></div><div style="--bar:48%"><span>$9.1k</span><i></i><small>Mar</small></div><div style="--bar:72%"><span>$13.7k</span><i></i><small>Apr</small></div><div style="--bar:64%"><span>$12.1k</span><i></i><small>May</small></div><div style="--bar:88%"><span>$16.6k</span><i></i><small>Jun</small></div><div style="--bar:100%"><span>$18.9k</span><i></i><small>Jul</small></div></div></section><section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Latest updates</span><h2>Recent activity</h2></div></div><ul class="activity-list"><li><i></i><span><strong>New consultation request</strong><small>Garden Design · 18 minutes ago</small></span></li><li><i></i><span><strong>Project marked complete</strong><small>Willow Crest Courtyard · 2 hours ago</small></span></li><li><i></i><span><strong>Payment received</strong><small>Invoice #V-1024 · Yesterday</small></span></li></ul></section></div>
      <section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Operations</span><h2>Recent bookings</h2></div><button class="btn btn-secondary" data-go="bookings">View all bookings</button></div>${table(['Customer','Service','Date','Status'],[['Leah Morris','Garden landscaping','Nov 12, 2026',status('Confirmed')],['Owen Clark','Lawn maintenance','Nov 14, 2026',status('Pending')],['Amara Chen','Garden design','Nov 18, 2026',status('In Progress')]])}</section>`,
    customers: () => listView('Customers', ['Customer','Email','Garden location','Bookings'], [['Leah Morris','leah@example.com','Willow District','8'],['Owen Clark','owen@example.com','North Ridge','3'],['Amara Chen','amara@example.com','River Quarter','5']]),
    bookings: () => listView('Service bookings', ['Customer','Service','Requested date','Status'], [['Leah Morris','Garden landscaping','Nov 12, 2026',status('Confirmed')],['Owen Clark','Lawn maintenance','Nov 14, 2026',status('Pending')],['Amara Chen','Garden design','Nov 18, 2026',status('In Progress')],['Noah Patel','Irrigation installation','Nov 21, 2026',status('Pending')]]),
    projects: () => listView('Garden projects', ['Project','Customer','Lead','Progress'], [['Willow Crest Courtyard','Leah Morris','Marcus Wells','82%'],['Riverbend Renewal','Amara Chen','Amelia Hart','46%'],['Harbor View Offices','Northstar Group','Daniel Ross','100%']]),
    services: () => listView('Services catalog', ['Service','Category','Typical duration','Availability'], [['Garden landscaping','Design & build','3–5 weeks','Active'],['Lawn installation','Lawn care','1–3 weeks','Active'],['Outdoor lighting','Features','1–2 weeks','Active']]),
    employees: () => listView('Team directory', ['Team member','Role','Current projects','Status'], [['Marcus Wells','Landscape Architect','4','Available'],['Amelia Hart','Horticultural Designer','3','Available'],['Daniel Ross','Project Supervisor','5','On site']]),
    pricing: () => listView('Pricing packages', ['Package','Starting price','Billing','Status'], [['Basic Garden Care','$499','Monthly','Published'],['Standard Landscaping','$1,290','Per project','Published'],['Premium Garden Design','$2,900','Per project','Published']]),
    gallery: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Content library</span><h2>Gallery management</h2></div><button class="btn btn-primary" data-action="add">Add image</button></div><p>Manage project photography and inspiration shown in the public gallery. Upload integration is not configured in this prototype.</p>${table(['Image','Collection','Alt text','Status'],[['Woodland path','Gardens','Garden path framed by trees','Published'],['Courtyard detail','Outdoor living','Stone courtyard with layered planting','Published'],['Reflecting pool','Water & detail','Quiet pool surrounded by greenery','Draft']])}</section>`,
    reviews: () => listView('Customer reviews', ['Customer','Rating','Review','Status'], [['Leah Morris','★★★★★','“A beautiful outdoor retreat.”','Published'],['Alicia Reed','★★★★★','“Thoughtful from concept to finish.”','Published'],['Daniel Park','★★★★★','“Elegant and easy to maintain.”','Needs review']]),
    payments: () => listView('Payments', ['Reference','Customer','Date','Amount','Status'], [['V-1024','Leah Morris','Nov 05, 2026','$1,290','Paid'],['V-1025','Owen Clark','Nov 06, 2026','$499','Pending'],['V-1026','Amara Chen','Nov 06, 2026','$2,900','Paid']]),
    reports: () => `<div class="workspace-metrics">${metric('Revenue','$84,290','Jan–Nov 2026')}${metric('Avg. booking','$1,120','Across all services')}${metric('Repeat clients','68%','Returning customers')}${metric('Completion rate','96%','Projects delivered')}</div><section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Business health</span><h2>Reports &amp; analytics</h2></div><button class="btn btn-secondary" data-action="export">Export summary</button></div><p>Operational figures shown here are sample data for layout demonstration and are not connected to a live reporting system.</p></section>`,
    notifications: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Inbox</span><h2>Notifications</h2></div></div><ul class="activity-list"><li><i></i><span><strong>Booking requires confirmation</strong><small>Owen Clark · Lawn maintenance · 18 minutes ago</small></span></li><li><i></i><span><strong>New customer inquiry</strong><small>Garden Design consultation · 2 hours ago</small></span></li><li><i></i><span><strong>Project milestone reached</strong><small>Willow Crest Courtyard · Yesterday</small></span></li></ul></section>`,
    settings: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Workspace preferences</span><h2>Profile settings</h2></div></div><form class="workspace-form"><label class="field"><span>Studio name</span><input value="VERDANT Garden & Landscape Studio" /></label><label class="field"><span>Contact email</span><input type="email" value="hello@verdantstudio.com" /></label><button class="btn btn-primary" type="submit">Save changes</button><p class="workspace-message" aria-live="polite"></p></form></section>`
  };

  function listView(heading, heads, rows) {
    const tableRows = isCustomer ? rows : rows.map((row) => [...row, '<span class="record-actions"><button type="button" data-action="edit">Edit</button><button type="button" data-action="delete">Delete</button></span>']);
    return `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Workspace records</span><h2>${heading}</h2></div><div class="panel-actions">${isCustomer ? '' : '<input class="table-search" type="search" placeholder="Search..." aria-label="Search records" /><button class="btn btn-primary" data-action="add">Add new</button>'}</div></div>${table(isCustomer ? heads : [...heads, 'Actions'], tableRows)}<div class="record-entry" hidden><form><label class="field"><span>Record name</span><input required maxlength="100" /></label><button class="btn btn-primary" type="submit">Add record</button><button class="btn btn-ghost" type="button" data-action="cancel-add">Cancel</button></form></div><p class="workspace-message" aria-live="polite"></p></section>`;
  }
  const customerViews = {
    overview: () => `<div class="welcome-card"><div><span class="kicker">Your outdoor space</span><h2>A little progress, a lot of green.</h2><p>Your courtyard renewal is taking shape. Here’s what’s happening next.</p><a class="btn btn-primary" href="../contact.html">Plan another service</a></div><img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80" alt="Layered courtyard garden" /></div><div class="workspace-metrics">${metric('Upcoming visit','Nov 12','Garden landscaping')}${metric('Project progress','82%','Courtyard renewal')}${metric('Garden health','Excellent','Last reviewed Nov 04')}</div><div class="workspace-columns"><section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Next appointment</span><h2>Garden care visit</h2></div>${status('Confirmed')}</div><p><strong>Thursday, November 12 · 9:00 AM</strong></p><p>Garden landscaping · Willow District</p><a href="../contact.html">Need to make a change?</a></section><section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Project update</span><h2>Courtyard renewal</h2></div><strong>82%</strong></div><p>Stone edging is complete. The planting team is scheduled for next week.</p><div class="progress-bar"><span style="width:82%"></span></div></section></div>`,
    'book-service': () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Tell us what you need</span><h2>Request a garden service</h2></div></div><form class="workspace-form" data-booking-form><label class="field"><span>Service</span><select required><option value="">Choose a service</option><option>Garden landscaping</option><option>Lawn installation</option><option>Lawn maintenance</option><option>Garden design</option><option>Tree &amp; shrub care</option><option>Irrigation installation</option></select></label><label class="field"><span>Preferred date</span><input type="date" required /></label><label class="field"><span>Tell us about your garden</span><textarea rows="4" placeholder="Share a few details about your project." required></textarea></label><button class="btn btn-primary" type="submit">Send service request</button><p class="workspace-message" aria-live="polite">Requests are saved for this demo only; no booking is sent.</p></form></section>`,
    'my-bookings': () => listView('My bookings', ['Service','Date','Team','Status'], [['Garden landscaping','Nov 12, 2026','Marcus Wells',status('Confirmed')],['Lawn maintenance','Oct 21, 2026','Daniel Ross',status('Completed')],['Design consultation','Sep 08, 2026','Amelia Hart',status('Completed')]]),
    'my-projects': () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">In progress</span><h2>Courtyard renewal</h2></div><span>82%</span></div><img class="customer-project-image" src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85" alt="Garden pathway and planting" /><p>Stone edging is complete. Planting installation is planned for November 14, followed by a final walkthrough.</p><div class="progress-bar"><span style="width:82%"></span></div></section>`,
    history: () => listView('Service history', ['Service','Completed','Notes','Status'], [['Lawn maintenance','Oct 21, 2026','Autumn feed and edging',status('Completed')],['Garden design','Sep 08, 2026','Concept plan approved',status('Completed')],['Tree & shrub care','Aug 16, 2026','Seasonal pruning',status('Completed')]]),
    addresses: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Service locations</span><h2>My addresses</h2></div><button class="btn btn-secondary" data-action="save">Add address</button></div><article class="address-card"><strong>Home garden</strong><p>118 Riverstone Ave<br />Willow District · Primary address</p><button class="text-button" data-action="edit">Edit details</button></article><p class="workspace-message" aria-live="polite"></p></section>`,
    payments: () => listView('Payments & invoices', ['Invoice','Date','Description','Amount','Status'], [['V-1024','Nov 05, 2026','Standard Landscaping','$1,290','Paid'],['V-1018','Oct 21, 2026','Lawn Maintenance','$499','Paid']]),
    notifications: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Garden updates</span><h2>Notifications</h2></div></div><ul class="activity-list"><li><i></i><span><strong>Your visit is confirmed</strong><small>Garden landscaping · Nov 12 at 9:00 AM</small></span></li><li><i></i><span><strong>Project milestone complete</strong><small>Stone edging is finished · Nov 04</small></span></li><li><i></i><span><strong>New garden care notes</strong><small>Autumn lawn recommendations · Oct 21</small></span></li></ul></section>`,
    profile: () => `<section class="workspace-panel"><div class="panel-heading"><div><span class="kicker">Your details</span><h2>Profile settings</h2></div></div><form class="workspace-form"><label class="field"><span>Name</span><input value="Garden owner" required /></label><label class="field"><span>Email</span><input type="email" value="you@example.com" required /></label><label class="field"><span>Phone</span><input type="tel" placeholder="Add a phone number" /></label><button class="btn btn-primary" type="submit">Save profile</button><p class="workspace-message" aria-live="polite"></p></form></section>`
  };

  function render(view) {
    const views = isCustomer ? customerViews : adminViews;
    title.textContent = (isCustomer ? customerTitles : adminTitles)[view] || 'Overview';
    content.innerHTML = views[view] ? views[view]() : views.overview();
    nav.forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
    content.querySelectorAll('.table-search').forEach((input) => input.addEventListener('input', () => {
      const query = input.value.toLocaleLowerCase();
      content.querySelectorAll('tbody tr').forEach((row) => row.hidden = !row.textContent.toLocaleLowerCase().includes(query));
    }));
    content.querySelectorAll('.workspace-form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = form.querySelector('.workspace-message');
      if (message) message.textContent = 'Changes are reflected in this demonstration only; no data was sent or saved.';
    }));
    content.querySelectorAll('[data-booking-form]').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector('.workspace-message').textContent = 'Your request is ready for a booking service. This demo did not submit or store it.';
    }));
    content.querySelectorAll('[data-action], [data-go]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.go) {
        render(button.dataset.go);
        return;
      }
      if (button.dataset.action === 'add') {
        const entry = content.querySelector('.record-entry');
        if (entry) {
          entry.hidden = false;
          entry.querySelector('input').focus();
          return;
        }
      }
      if (button.dataset.action === 'cancel-add') {
        const entry = button.closest('.record-entry');
        if (entry) entry.hidden = true;
        return;
      }
      if (button.dataset.action === 'delete') {
        const row = button.closest('tr');
        if (row) row.remove();
        return;
      }
      if (button.dataset.action === 'edit') {
        const cell = button.closest('tr').cells[0];
        if (cell.querySelector('input')) return;
        const previous = cell.textContent;
        cell.replaceChildren();
        const input = document.createElement('input');
        input.value = previous;
        input.setAttribute('aria-label', 'Edit record name');
        const save = document.createElement('button');
        save.type = 'button';
        save.textContent = 'Save';
        save.addEventListener('click', () => {
          cell.textContent = input.value.trim() || previous;
        });
        cell.append(input, save);
        input.focus();
        return;
      }
      let message = content.querySelector('.workspace-message');
      if (!message) {
        message = document.createElement('p');
        message.className = 'workspace-message';
        const panel = button.closest('.workspace-panel');
        if (panel) panel.append(message);
      }
      if (button.dataset.action === 'export') {
        if (message) message.textContent = 'Report export is not connected in this sample workspace.';
      } else if (message) {
        message.textContent = button.dataset.action === 'add' ? 'Add and upload controls are a visual prototype; connect a data service to save records.' : 'This action is not connected to a data service.';
      }
    }));
    content.querySelectorAll('.record-entry form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = form.querySelector('input').value.trim();
      if (!value) return;
      const tbody = content.querySelector('tbody');
      const row = document.createElement('tr');
      const columns = content.querySelectorAll('thead th').length;
      for (let index = 0; index < columns; index += 1) {
        const cell = document.createElement('td');
        if (index === 0) cell.textContent = value;
        else if (index === columns - 1) {
          const actions = document.createElement('span');
          actions.className = 'record-actions';
          actions.innerHTML = '<button type="button" data-action="edit">Edit</button><button type="button" data-action="delete">Delete</button>';
          cell.append(actions);
        } else cell.textContent = '—';
        row.append(cell);
      }
      tbody.prepend(row);
      form.reset();
      form.closest('.record-entry').hidden = true;
      const message = content.querySelector('.workspace-message');
      if (message) message.textContent = 'Record added in this sample view only; it is not saved to a database.';
      row.querySelectorAll('[data-action]').forEach((action) => action.addEventListener('click', () => {
        if (action.dataset.action === 'delete') row.remove();
        if (action.dataset.action === 'edit') {
          const cell = row.cells[0];
          const input = document.createElement('input');
          input.value = cell.textContent;
          cell.replaceChildren(input);
          const save = document.createElement('button');
          save.type = 'button';
          save.textContent = 'Save';
          save.addEventListener('click', () => cell.textContent = input.value.trim() || 'New record');
          cell.append(save);
        }
      }));
    }));
  }

  nav.forEach((button) => button.addEventListener('click', () => render(button.dataset.view)));
  render(nav[0].dataset.view);
})();
