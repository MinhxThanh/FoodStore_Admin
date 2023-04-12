app.controller('report-controller', function ($scope, $http, $window) {


    $scope.form = {
      createBy: sessionStorage.getItem('username')
    }
    $scope.items = []
    $scope.categoryFood = []
  
    $scope.message = ""
    $scope.error = ""
  
    var report1 = [];
    var report_month = [];
    var report_year = [];
    var report2 = [];
    var report3 = [];
  
    var report_brand=[];
  
    var report_month1 = [];
    var report_year1 = [];
    var report_product = [];
    var product_name = [];
    $scope.month_re = null,
      $scope.month_re1 = null,
      $scope.data69 = null,
      $scope.customer = null,
      $scope.sum_money = 0,
      $scope.sum_order = 0,
      $scope.sum_food = 0,
      $scope.sum_customer = 0,
  
  
      $scope.initialize = function () {
  
        $http.get(`http://localhost:8080/rest/food`).then(resp => {
          $scope.sum_food = resp.data;
        })
  
        $http.get(`http://localhost:8080/rest/customer/getAll`).then(resp => {
          $scope.sum_customer = resp.data;
        })
  
  
        //lay doanh thu san pham theo thang va nam
        $http.get('http://localhost:8080/rest/reports/revenue/month').then(resp => {
          $scope.month_re1 = resp.data;
          console.log($scope.month_re1)
          for (let i = 0; i < $scope.month_re1.length; i++) {
            report_month1.push($scope.month_re1[i].month)
            report_year1.push($scope.month_re1[i].year)
          }
          console.log(report_month1, report_year1)
          $http.get('http://localhost:8080/rest/reports/revenue/product').then(resp => {
            $scope.products = resp.data;
            console.log($scope.products)
            report_product.push("Month of year")
  
            for (let i = 0; i < 5 ; i++) {
  
              report_product.push($scope.products[i])
              console.log(report_product[i])
              product_name.push($scope.products[i].name)
            }
            console.log(product_name) //string month of year + console ra 5 san pham
  
            for (let i = 0; i < report_month1.length; i++) {
              report2[i] = [new Date(report_year1[i], report_month1[i], 0)]
              console.log(report2[i])
              for (let j = 1; j < 6; j++) {
                $http.get(`http://localhost:8080/rest/reports/revenue/product/${report_product[j].count}/month/${report_month1[i]}/year/${report_year1[i]}`).then(resp => {
                  $scope.data69 = resp.data;
                  //console.log($scope.data69[0]);
                  if ($scope.data69[0] == null) {
                    report2[i][j] = 0
                  } else {
                    report2[i][j] = $scope.data69[0].sum
  
                  }
                })
  
              }
            }
            console.log(report2)
  
  
            //load bieu do san pham
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChartProduct);
  
            function drawChartProduct() {
              setTimeout(() => {
                var data = google.visualization.arrayToDataTable([]);
                data.addColumn('date', 'Tháng / Năm')
                for (let i = 0; i < product_name.length; i++) {
                  data.addColumn('number', product_name[i]);
                }
                data.addRow(report2[0])
                for (let i = 1; i < report2.length; i++) {
                  data.addRow(report2[i]);
                }
  
                var options = {
                  title: 'Company Performance',
                  curveType: 'function',
                  legend: { position: 'right' },
                  height: 500,
                  vAxis: {
                    scaleType: 'log'
                  },
                  //lineWidth: 5,
                  pointSize: 10,
                  series: {
                    0: { pointShape: 'circle' },
                    1: { pointShape: 'triangle' },
                    2: { pointShape: 'square' },
                    3: { pointShape: 'diamond' },
                    4: { pointShape: 'star' },
                    5: { pointShape: 'polygon' }
                  }
                };
  
                var chart = new google.visualization.LineChart(document.getElementById('curve_chart_product'));
                var formatter3 = new google.visualization.DateFormat({ pattern: "MM / yyyy" });
                formatter3.format(data, 0);
                chart.draw(data, options);
                //load table theo product
                google.charts.load('current', { 'packages': ['table'] });
                google.charts.setOnLoadCallback(drawTable);
  
                function drawTable() {
  
  
                  var table = new google.visualization.Table(document.getElementById('table_div_product'));
  
  
                  table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                }
              }, 1)
            }
  
          });
        });
  
        //doanh thu theo thang
        $http.get(`http://localhost:8080/rest/reports/revenue/month`).then(resp => {
          $scope.month_re = resp.data;
          console.log(resp.data)
          for (let i = 0; i < $scope.month_re.length; i++) {
            $scope.sum_money += $scope.month_re[i].sum;
            report_month.push($scope.month_re[i].month)
            report_year.push($scope.month_re[i].year)
            // var dateStr = $scope.month_re[i].year + '-' + $scope.month_re[i].month
            // $scope.date = $filter('date')(new Date(dateStr.split('-').join('/')), "MM/yyyy");
            // console.log($scope.date);
            report1.push([new Date($scope.month_re[i].year, $scope.month_re[i].month, 0), $scope.month_re[i].sum])
          }
          console.log($scope.sum_money)
          google.charts.load('current', { 'packages': ['corechart'] });
          google.charts.setOnLoadCallback(drawChart);
  
          function drawChart() {
  
            var data = google.visualization.arrayToDataTable(
              []
  
            );
            data.addColumn('date', 'THÁNG / NĂM')
            data.addColumn('number', 'DOANH THU')
            // data.addColumn('number', 'SO luot mua')
  
            for (let i = 0; i < report1.length; i++) {
              data.addRow(report1[i]);
            }
  
            var options = {
              title: 'Doanh thu',
              hAxis: { title: 'Tháng / Năm', titleTextStyle: { color: '#333' } },
              vAxis: { minValue: 0 },
              series: {
                0: { color: '#fb86d7' },
  
              },
              pointSize: 10,
              pointShape: { type: 'circle', rotation: 180 }
            };
  
            var chart = new google.visualization.AreaChart(document.getElementById('chart_div1'));
  
            chart.draw(data, options);
            //load table doanh thu
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);
  
            function drawTable() {
              var table = new google.visualization.Table(document.getElementById('table_div'));
              table.draw(data, { allowHtml: true, showRowNumber: true, width: '100%', height: '100%' });
            }
  
          }
  
          console.log(report1)
  
          //doanh thu theo loai san pham
          $http.get('http://localhost:8080/rest/reports/revenue/category').then(resp => {
            $scope.brand = resp.data;
            report_brand.push("Tháng / Năm")
            for (let i = 0; i < $scope.brand.length; i++) {
              report_brand.push($scope.brand[i].name)
            }
            console.log(report_brand)
            
            for (let i = 0; i < report_month.length; i++) {
              report3[i] = [report_month[i] + '/' + report_year[i]]
              for (let j = 1; j < report_brand.length; j++) {
                $http.get(`http://localhost:8080/rest/reports/revenue/category/${report_brand[j]}/month/${report_month[i]}/year/${report_year[i]}`).then(resp => {
                  $scope.datata = resp.data;
                  if ($scope.datata[0]== null) {
                    report3[i][j] = 0
                  } else {
                    report3[i][j] = $scope.datata[0].sum
                  }
                })
              }
  
            }
            console.log(report3)
            //load bieu do theo brand
            google.charts.load('current', { 'packages': ['bar'] });
            google.charts.setOnLoadCallback(drawChart);
  
            function drawChart() {
              setTimeout(() => {
                var data = google.visualization.arrayToDataTable([]);
                data.addColumn('string', report_brand[0])
                for (let i = 1; i < report_brand.length; i++) {
                  data.addColumn('number', report_brand[i])
                }
                console.log(report3)
                for (let i = 0; i < report3.length; i++) {
                  data.addRow(report3[i]);
                }
                var options = {
                  chart: {
                    title: 'Loại sản phẩm có doanh thu cao nhất ',
                    subtitle: '2021 , 2022',
                  },
                  height:500
                };
  
                var chart = new google.charts.Bar(document.getElementById('chart_div_brand'));
  
                chart.draw(data, google.charts.Bar.convertOptions(options));
                //load table theo brand
                google.charts.load('current', { 'packages': ['table'] });
                google.charts.setOnLoadCallback(drawTableBrand);
  
                function drawTableBrand() {
                  var table = new google.visualization.Table(document.getElementById('table_div_brand'));
                  table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                }
  
  
              }, 1)
            }
          });
  
        })
  
  
  
        //load bieu do don hang theo khach hang
        $http.get('http://localhost:8080/rest/reports/revenue/customer').then(resp => {
          $scope.customer = resp.data;
          console.log($scope.customer)
  
          //lay tong so don hang
          for (let i = 0; i < $scope.customer.length; i++) {
            $scope.sum_order += $scope.customer[i].count
          }
          console.log($scope.sum_order)
          google.charts.load('current', { 'packages': ['corechart', 'controls'] });
          google.charts.setOnLoadCallback(drawDashboard);
          function drawDashboard() {
  
            // Create our data table.
            var data = google.visualization.arrayToDataTable([
              ['Tên khách hàng', 'Số đơn hàng'],
              [$scope.customer[0].name, $scope.customer[0].count]
            ]);
            for (let i = 1; i < $scope.customer.length; i++) {
              data.addRow([$scope.customer[i].name, $scope.customer[i].count])
  
            }
  
            // Create a dashboard.
            var dashboard = new google.visualization.Dashboard(
              document.getElementById('dashboard_div'));
  
            // Create a range slider, passing some options
            var donutRangeSlider = new google.visualization.ControlWrapper({
              'controlType': 'NumberRangeFilter',
              'containerId': 'filter_div',
              'options': {
                'filterColumnLabel': 'Số đơn hàng'
              }
            });
  
            // Create a pie chart, passing some options
            var pieChart = new google.visualization.ChartWrapper({
              'chartType': 'PieChart',
              'containerId': 'chart_div',
              'options': {
                'width': 1200,
                'height': 500,
                'pieSliceText': 'value',
                'legend': 'right'
              }
            });
  
            dashboard.bind(donutRangeSlider, pieChart);
  
            // Draw the dashboard.
            dashboard.draw(data);
            //load table theo khach hang
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTableCustomer);
  
            function drawTableCustomer() {
  
  
              var table = new google.visualization.Table(document.getElementById('table_div_cus'));
  
  
              table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
            }
  
          }
  
        });
  
      }
    $scope.initialize()
  })
  
  