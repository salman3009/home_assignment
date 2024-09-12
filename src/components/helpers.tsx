export const chartOptions=(displayList:any)=>{
  return{
      chart: {
        type: "column",
      },
      title: {
        text: "Products in Selected Category",
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        data: [0, 200, 400, 600, 800],
        title: {
          text: "SmartPhones",
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: "{point.y:.1f}%",
          },
        },
      },
      series: [
        {
          name: "Browsers",
          colorByPoint: true,
          data: displayList,
        },
      ],
      drilldown: {
        breadcrumbs: {
          position: {
            align: "right",
          },
        },
      },
    };
}