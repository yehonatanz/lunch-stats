function debounce(func, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  }
}
const onSearch = debounce((ev) => {
  const patterns = ev.target.value.split(',').map(part => part.trim()).filter(pattern => pattern);
  if (patterns.length === 0) {
    patterns.push('');
  }
  const traces = patterns.map(pattern => reportsToTrace(ALL_REPORTS.filter(report => report.resturaunts.toLowerCase().includes(pattern.toLowerCase())), pattern));
  Plotly.react(CHART, traces, LAYOUT, CONFIG);
}, 300);

function reportsToTrace(reports, name) {
  return {
    type: 'scatter',
    mode: 'markers',
    name: name || 'הכל',
    text: reports.map(report => report.resturaunts),
    x: reports.map(report => report.date),
    y: reports.map(report => '1970-01-01 ' + report.time),
  };
};
const CHART = document.getElementById('chart');
const LAYOUT = { title: 'מתי דיווחו על הגעה?', showlegend: true, yaxis: { range: ['1970-01-01 11:00:00', '1970-01-01 15:00:00'], tickformat: '%H:%M' } };
const CONFIG = { scrollZoom: true };
const patternInput = document.getElementById('pattern');
patternInput.addEventListener('change', ev => onSearch(ev));
patternInput.addEventListener('keypress', ev => onSearch(ev));
Plotly.newPlot(CHART, [reportsToTrace(ALL_REPORTS)], LAYOUT, CONFIG);
