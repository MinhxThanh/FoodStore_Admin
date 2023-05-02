app.controller('category-controller', function ($scope, $http, $window) {
    $scope.form = {
        isDisplay: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username')
    }
    $scope.items = []

    $scope.message = ""
    $scope.error = ""

    $scope.category = {
        itemDelete: {},
        create(){
            let item = angular.copy($scope.form)
            console.log("item: ", item)
            $http.post(`http://localhost:8080/rest/category/create`, item).then(resp =>{
                $scope.items.push(resp.data)
                this.reset()
                // console.log("category1", resp.data)
                $scope.message = "Create category successfully!"
            }).catch(err => $scope.error = "Error create category!")
            this.liveToastBtn()
        },
        update(){
            let item = angular.copy($scope.form)
            $http.put(`http://localhost:8080/rest/category/update`, item).then(resp =>{
                let index = $scope.items.findIndex(item => item.id == resp.data.id)
                $scope.items[index] = item
                this.reset()
                $scope.message = "Update category successfully!"
            }).catch(err => $scope.error = "Error Update category!")
            this.liveToastBtn()
        },
        clickDelete(item){
            this.itemDelete = item
        },
        confirmDelete() {
            $http.delete(`http://localhost:8080/rest/category/delete/${this.itemDelete.id}`).then(resp =>{
                let index = $scope.items.findIndex(item => item.id == item.id)
                $scope.items.splice(index, 1)
                this.reset()
                $scope.message = "Delete category successfully!"
            }).catch(err => $scope.error = "Error Delete category!")
            this.liveToastBtn()
        },
        edit(category){
            this.reset()
            let item = {
                id: category.id,
                name: category.name,
                description: category.description,
                isDisplay: category.isDisplay = 'Yes' ? true:false,
                createDate: category.createDate,
                createBy: category.user.username
            }
            $scope.img = category.imageName
            console.log("isDisplay: ", category.isDisplay)
            $scope.form = angular.copy(item)
        },
        reset(){
            $scope.form = {
                isDisplay: true,
                createDate: new Date(),
                createBy: sessionStorage.getItem('username')
            }
            this.itemDelete = {}
            $scope.message = ""
            $scope.error = ""
        },
        liveToastBtn(){
            var lastMessage = document.querySelector('.toast:last-child');
            new window.bootstrap.Toast(lastMessage).show();
        }
    }

    $scope.pager = {
        page: 0,
        size: 10,
        get count() {
            return Math.ceil(1.0 * $scope.items.length / this.size)
        },
        get length() {
            return $scope.items.length
        },
        first() {
            this.page = 0
        },
        prev() {
            this.page--
            if (this.page < 0)
                this.last()
        },
        next() {
            this.page++
            if (this.page >= this.count)
                this.first()
        },
        last() {
            this.page = this.count - 1
        }
    }

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

    $scope.imageUpload = function (event) {
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
        $scope.imageChanged(files)
       
    }

    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.img = e.target.result;            
        });
    }

    $scope.imageChanged = function (files){
        let dataImage = new FormData()
        dataImage.append('file', files[0])
        $http.post('http://localhost:8080/rest/upload/firebase', dataImage, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(resp =>{
            $scope.form.image = resp.data.name
            console.log("name image: ", resp.data.name)
            console.log("name image: ", $scope.form.image)
        }).catch(err =>{
            $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
            console.log('Error', err)
        })
    }

    $scope.initialize = function (){
        let accessToken = sessionStorage.getItem('accessToken')
        let admin = sessionStorage.getItem('admin')
        if(accessToken == null) {
            location.href = "#!/security/login"
        } else if(accessToken != null) {
            if(admin == 'false') {
                location.href = "#!/security/login"
            }
        }

        $http.get(`http://localhost:8080/rest/category/getAll`).then(resp =>{
            $scope.items = resp.data
        })

    }
    $scope.initialize()

    $scope.isDisabledupdate = true
    
    $scope.exportData = function () {

        // var blob = new Blob([document.getElementById('export').innerHTML], {
        //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        // })
        // saveAs(blob, "Employeereport.xls")

        // sử dụng XLSX.utils.table_to_book() để chuyển đổi dữ liệu bảng sang định dạng book và 
        // sử dụng XLSX.write() để tạo một mảng byte của file Excel. Cuối cùng, 
        // chúng tôi sử dụng thư viện saveAs để tạo và tải xuống file Excel

        var wb = XLSX.utils.table_to_book(document.getElementById('export'), {sheet:"Sheet JS"})
        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'array'})

        saveAs(new Blob([wbout], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"}), "Categories.xlsx")
    }

    $scope.exportPdf = function(){
        const element = document.getElementById('export');
        html2pdf()
        .from(element)
        .set({
            margin: [35, 35],
            pagebreak: {
            mode: ['avoid-all']
            },
            filename: 'Categories.pdf',
            image: { type: 'jpeg', quality: 0.98 }
        })
        .save();
    }
})

