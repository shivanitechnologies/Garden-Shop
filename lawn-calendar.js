(() => {
  const buttons = document.querySelectorAll('.season-tabs [data-season]');
  const panel = document.getElementById('season-panel');
  if (!buttons.length || !panel) return;

  const seasons = {
    spring: { months: 'March — May', title: 'Wake the lawn gently', description: 'As growth returns, focus on clearing winter debris and rebuilding healthy soil without stressing tender new shoots.', tasks: ['Rake away leaves and thatch once the ground is dry.', 'Aerate compacted areas and overseed bare patches.', 'Apply a slow-release feed suited to your grass type.', 'Begin mowing high, removing no more than one-third of the blade.'] },
    summer: { months: 'June — August', title: 'Protect roots through the heat', description: 'Help the lawn conserve moisture and recover from heavy use with thoughtful watering and a slightly taller cut.', tasks: ['Water deeply in the early morning when rainfall is low.', 'Raise mower height to shade the soil and protect roots.', 'Avoid heavy feeding during periods of extreme heat.', 'Check irrigation coverage and address dry or waterlogged spots.'] },
    autumn: { months: 'September — November', title: 'Build strength for the cooler months', description: 'Cooler temperatures are ideal for repair work. Restore thin areas and clear leaves before they smother the grass.', tasks: ['Scarify lightly to remove excess thatch where needed.', 'Overseed worn patches while soil remains warm.', 'Feed with an autumn formulation appropriate to the lawn.', 'Keep leaves cleared and reduce mowing as growth slows.'] },
    winter: { months: 'December — February', title: 'Let the lawn rest', description: 'Growth slows in winter. Minimize traffic on soft or frozen ground and use the quieter season to plan ahead.', tasks: ['Avoid mowing frozen, waterlogged or heavily frosted grass.', 'Clear branches and leaves when conditions are dry.', 'Check mower blades and service equipment for spring.', 'Plan drainage, edging and lawn renovation projects.'] }
  };
  const month = document.getElementById('season-label');
  const title = document.getElementById('season-title');
  const description = document.getElementById('season-description');
  const tasks = document.getElementById('season-tasks');

  function select(button) {
    const season = button.dataset.season;
    const content = seasons[season];
    buttons.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', button.id);
    month.textContent = content.months;
    title.textContent = content.title;
    description.textContent = content.description;
    tasks.replaceChildren(...content.tasks.map((task) => {
      const li = document.createElement('li');
      li.textContent = task;
      return li;
    }));
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      select(buttons[next]);
    });
  });
  select(buttons[0]);
})();
