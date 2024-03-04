function formatDuration(ms) {
    var duration = luxon.Duration.fromMillis(ms).shiftTo('hours', 'minutes', 'seconds');
    if (duration.as('hours') >= 1) {
        return duration.toFormat('h \'Hours\'');
    } else if (duration.as('minutes') >= 1) {
        return duration.toFormat('m \'Minutes\'');
    } else {
        return duration.toFormat('s \'Seconds\'');
    }
}
  async function loadData(deployedUrl) {
    var ctx = document.getElementById(deployedUrl).getContext('2d');
  
  var tryGetDataRequest = await fetch("/" + deployedUrl);
  var tryGetUnSmoothData = await tryGetDataRequest.json();
  var chartData = tryGetUnSmoothData.data;
  
  // convert to array format for Chart.js
  var data = {
    labels: chartData.map(function(item) {
        // convert timestamp to date and format it
        var date = luxon.DateTime.fromMillis(Number(item.t)).toISO();
        return date;
    }),
    datasets: [{
        label: 'Seconds Taken',
        backgroundColor: 'rgba(0,123,255,0.5)',
        borderColor: 'rgba(0,123,255,1)',
        data: chartData.map(function(item) {
          
            return item.workers_deploy_lag;
        }),
        fill: true,
    }]
  };
  console.log(deployedUrl);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Workers Deploy Lag: ' + (deployedUrl == "undeployed" ? "Live" : "Smoothed")
        },
        plugins: {
          title: {
              display: true,
              text: 'Workers Deploy Lag: ' + (deployedUrl == "undeployed" ? "Live" : "Smoothed"),
              font: {
                  size: 20,
              }
          },
                tooltip: {
              callbacks: {
                  label: function(context) {
                      var label = context.dataset.label || '';
                      if (label) {
                          label += ': ';
                      }
                      if (context.parsed.y !== null) {
                          label += formatDuration(context.parsed.y);
                      }
                      return label;
                  }
              }
          }
      },
        scales: {
          x: {
            type: 'time',
            title: {
                display: true,
                text: 'Date'
            }
        },
            y: {
                title: {
                    display: true,
                    text: 'Seconds Taken'
                },
                ticks: {
                  callback: function(value, index, values) {
                    console.log(value);
                      return formatDuration(value);
                  }
              }
            }
        }
    }
  });
  }
  loadData("undeployed");
  loadData("deployed");