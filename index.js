$(document).ready(function () {
  $('.js-example-basic-multiple').select2();
});

$('#restaurant-dropdown').on('select2:close', function () {
  const selectedValues = $('#restaurant-dropdown').select2('data');
  search(selectedValues.map(({ text }) => text));
});

function uniq(arr) {
  return [...new Set(arr)].sort();
}

function search(patterns) {
  const traces = patterns.map(pattern =>
    reportsToTrace(
      ALL_REPORTS.filter(report => report.resturaunts.toLowerCase().includes(pattern.toLowerCase())),
      pattern,
    ),
  );
  Plotly.react(CHART, traces, LAYOUT, CONFIG);
}

function createDropDown(values) {
  const dropdown = document.getElementById('restaurant-dropdown');
  for (let value of values) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.innerText = value;
    dropdown.appendChild(opt);
  }
}

function reportsToTrace(reports, name) {
  return {
    type: 'scatter',
    mode: 'markers',
    name: name || 'הכל',
    text: reports.map(report => report.resturaunts),
    x: reports.map(report => report.date),
    y: reports.map(report => '1970-01-01 ' + report.time),
  };
}
const CHART = document.getElementById('chart');
const LAYOUT = {
  title: 'מתי דיווחו על הגעה?',
  showlegend: true,
  yaxis: { range: ['1970-01-01 11:00:00', '1970-01-01 15:00:00'], tickformat: '%H:%M' },
};
const CONFIG = { scrollZoom: true };

createDropDown(
uniq(
  ALL_REPORTS
    .map(report => report.resturaunts.split(/\s+/))
    .flat()
    .map(word => word.trim()),
),
);
Plotly.newPlot(CHART, [reportsToTrace(ALL_REPORTS)], LAYOUT, CONFIG);
