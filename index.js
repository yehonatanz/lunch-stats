$(document).ready(function() {
  $('.js-example-basic-multiple').select2();
});

$('#restaurant-dropdown').on('select2:close', function () {
  const selectedValues = $('#restaurant-dropdown').select2('data');
  const values = selectedValues.map(({text})=> text);
  const traces = values.map(pattern => reportsToTrace(ALL_REPORTS.filter(report => report.resturaunts.toLowerCase().includes(pattern.toLowerCase())), pattern));
  Plotly.react(CHART, traces, LAYOUT, CONFIG);
});

function createDropDown(values) {
  const dropdown = document.getElementById('restaurant-dropdown');
  for(let value of values) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.innerText = value;
    dropdown.appendChild(opt);
  }
}

function reportsToTrace(reports, name) {
  createDropDown(_.uniq(reports.map(x => x.resturaunts)));
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

Plotly.newPlot(CHART, [reportsToTrace(ALL_REPORTS)], LAYOUT, CONFIG);
