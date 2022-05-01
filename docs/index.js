$('#restaurant-dropdown').on('select2:close', function () {
  const selectedValues = $('#restaurant-dropdown').select2('data');
  onSearch(selectedValues.map(({ text }) => text));
});

function uniq(arr) {
  return [...new Set(arr)].sort();
}

const state = {};
function search(reports, patterns) {
  return patterns.map((pattern) => ({
    pattern,
    reports: reports.filter((report) =>
      report.resturaunts.toLowerCase().includes(pattern.toLowerCase())
    ),
  }));
}

function onSearch(patterns) {
  const searchResults = search(state.allReports, patterns);
  updateChart(searchResults);
  updateStats(searchResults);
}

const resultToTrace = ({ pattern, reports }) => ({
  type: 'scatter',
  mode: 'markers',
  name: pattern || 'הכל',
  text: reports.map((report) => report.resturaunts),
  x: reports.map((report) => report.date),
  y: reports.map((report) => '1970-01-01 ' + report.time),
});
function updateChart(searchResults) {
  Plotly.react(CHART, searchResults.map(resultToTrace), LAYOUT, CONFIG);
}

function updateStats(searchResults) {
  for (const oldRow of [...STATS_BODY.childNodes]) {
    STATS_BODY.removeChild(oldRow);
  }
  for (const { pattern, reports } of searchResults) {
    const row = document.createElement('tr');
    const stats = calculateStats(reports);
    for (const cellContent of [pattern || 'הכל', ...Object.values(stats)]) {
      const cell = document.createElement('td');
      cell.textContent = cellContent;
      row.appendChild(cell);
    }
    STATS_BODY.appendChild(row);
  }
}
function calculateStats(reports) {
  const times = reports
    .map((report) => report.time.replace(/:\d\d$/, ''))
    .sort();
  return {
    median: times[Math.floor(times.length * 0.5)],
    p75: times[Math.floor(times.length * 0.75)],
  };
}

const CHART = document.getElementById('chart');
const STATS_BODY = document.getElementById('stats-body');
const LAYOUT = {
  title: 'מתי דיווחו על הגעה?',
  showlegend: true,
  yaxis: {
    range: ['1970-01-01 11:00:00', '1970-01-01 15:00:00'],
    tickformat: '%H:%M',
  },
};
const CONFIG = { scrollZoom: true };

function createDropDown(values) {
  const dropdown = document.getElementById('restaurant-dropdown');
  for (let value of values) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.innerText = value;
    dropdown.appendChild(opt);
  }
}

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
    Plotly.newPlot(
      CHART,
      [resultToTrace({ reports: state.allReports })],
      LAYOUT,
      CONFIG
    );
    onSearch(['']);
  });
