app.controller('report-controller', function ($scope, $http, $window) {



  // ------------

  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    
    var data = google.visualization.arrayToDataTable(
      [

      ['Year', 'Sales', 'Expenses'],
      ['2099', 12000, 400],
      ['2014', 21170, 460],
      ['2015', 3660, 1120],
      ['2016', 41030, 2240]
    ]
    
    
    );

    var options = {
      title: 'Company Performance',
      hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      vAxis: { minValue: 0 }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    
    chart.draw(data, options);
  }

  //----------------

  $scope.form = {
    createBy: sessionStorage.getItem('username')
  }
  $scope.items = []
  $scope.categoryFood = []

  $scope.message = ""
  $scope.error = ""



  // $scope.blog = {
  //     itemDelete: {},
  //     create(){
  //         let item = angular.copy($scope.form)
  //         console.log("item: ", item)
  //         $http.post(`http://localhost:8080/rest/blog/create`, item).then(resp =>{
  //             //lấy id của blog vừa tạo=> tạo
  //             $scope.items.push(resp.data)
  //             this.reset()
  //             console.log("category1", resp.data)
  //             $scope.message = "Create blog successfully!"
  //         }).catch(err => {
  //             $scope.error = "Error create blog!"
  //             console.log("create error:", err)
  //         })
  //         this.liveToastBtn()
  //     },
  //     update(){
  //         let item = angular.copy($scope.form)

  //         $http.put(`http://localhost:8080/rest/blog/update`, item).then(resp =>{
  //             let index = $scope.items.findIndex(item => item.id == resp.data.id)
  //             $scope.items[index] = item
  //             this.reset()
  //             $scope.message = "Update blog successfully!"
  //             $window.location.reset()
  //         }).catch(err => $scope.error = "Error blog category!")
  //         this.liveToastBtn()
  //     },
  //     clickDelete(item){
  //         this.itemDelete = item
  //     },
  //     confirmDelete() {
  //         $http.delete(`http://localhost:8080/rest/blog/delete/${this.itemDelete.id}`).then(resp =>{
  //             let index = $scope.items.findIndex(item => item.id == this.itemDelete.id)
  //             $scope.items.splice(index, 1)
  //             this.reset()
  //             $scope.message = "Delete blog successfully!"
  //         }).catch(err => $scope.error = "Error blog category!")
  //         this.liveToastBtn()
  //     },
  //     edit(blog){
  //         this.reset()
  //         $scope.form= {}
  //         let item = {
  //             id: blog.id,
  //             title: blog.title,
  //             content: blog.content,
  //             isDisplay: blog.isDisplay,
  //             createBy: blog.user.username,
  //             viewCount: blog.viewCount,

  //             createDate: new Date(blog.createDate), // can format

  //             status: blog.status,
  //         }
  //         console.log("isDisplay: ", blog.isDisplay)
  //         // console.log('12',item)
  //         $scope.form = angular.copy(item)
  //     },
  //     reset(){
  //         $scope.form = {
  //             isDisplay: true,
  //             isFixed: true,
  //             createDate: new Date(),
  //             createBy: sessionStorage.getItem('username')
  //         }
  //         this.itemDelete = {}
  //         $scope.message = ""
  //         $scope.error = ""
  //     },
  //     liveToastBtn(){
  //         var lastMessage = document.querySelector('.toast:last-child');
  //         new window.bootstrap.Toast(lastMessage).show();
  //     }
  // }

  // $scope.pager = {
  //     page: 0,
  //     size: 10,
  //     get count(){
  //         return Math.ceil(1.0 * $scope.items.length / this.size)
  //     },
  //     get length(){
  //         return $scope.items.length
  //     },
  //     first(){
  //         this.page = 0
  //     },
  //     last(){
  //         this.page = this.count - 1
  //     },
  //     next() {
  //         this.incrementLimit(true)
  //     },
  //     prev() {
  //         this.incrementLimit(false)
  //     },
  //     incrementLimit(up) {
  //         if (up) {
  //           (this.page <= ($scope.items.length - this.size)) ? this.page += 10: this.page = 0;
  //         } else {
  //           this.page > 10 ? this.page -= 10 : this.page = 0;

  //         }
  //     }
  // }

  // $scope.initialize = function (){
  //     $http.get(`http://localhost:8080/rest/blog/getAll`).then(resp =>{
  //         $scope.items = resp.data
  //         console.log('list: ', resp.data)
  //     })

  //     $http.get(`http://localhost:8080/rest/category/getAll`).then(resp =>{
  //         $scope.categoryFood = resp.data
  //         console.log('listCate: ', resp.data)
  //     })


  // }
  // $scope.initialize()
})

