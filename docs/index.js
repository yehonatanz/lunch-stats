$('#restaurant-dropdown').on('select2:close', function () {
  const selectedValues = $('#restaurant-dropdown').select2('data');
  search(selectedValues.map(({ text }) => text));
});

function uniq(arr) {
  return [...new Set(arr)].sort();
}

function search(patterns) {
  const traces = patterns.map((pattern) =>
    reportsToTrace(
      state.allReports.filter((report) =>
        report.resturaunts.toLowerCase().includes(pattern.toLowerCase())
      ),
      pattern
    )
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
    text: reports.map((report) => report.resturaunts),
    x: reports.map((report) => report.date),
    y: reports.map((report) => '1970-01-01 ' + report.time),
  };
}
const CHART = document.getElementById('chart');
const LAYOUT = {
  title: 'מתי דיווחו על הגעה?',
  showlegend: true,
  yaxis: {
    range: ['1970-01-01 11:00:00', '1970-01-01 15:00:00'],
    tickformat: '%H:%M',
  },
};
const CONFIG = { scrollZoom: true };

const state = {};
fetch('./build/reports.json')
  .then((response) => response.json())
  .then((reports) => {
    state.allReports = reports;
    createDropDown(
      uniq(
        state.allReports
          .map((report) => report.resturaunts.split(/\s+/))
          .flat()
          .map((word) => word.trim())
      )
    );
    $('.js-example-basic-multiple').select2({
      createTag: (tag) => ({ id: tag.term, text: tag.term, tag: true }),
      multiple: true,
      tags: true,
    });
    Plotly.newPlot(CHART, [reportsToTrace(state.allReports)], LAYOUT, CONFIG);
  });
