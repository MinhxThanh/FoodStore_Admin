app.controller('blog-controller', function ($scope, $http, $window) {
    $scope.form = {
        isDisplay: true,
        createDate: new Date(),
        createBy: sessionStorage.getItem('username'),
        viewCount: 1,
        status: 1
    }
    $scope.items = []


    $scope.message = ""
    $scope.error = ""

    
    $scope.imageUpload = function (event) {
        var files = event.target.files;

        $scope.imageBlog.imageChanged(files)
    }

    $scope.imageBlog = {
        images: [],
        blog: {},

        findAllByBlogId(blog){
            this.blog = blog
            console.log('getBlog:', this.blog)

            $http.get(`http://localhost:8080/rest/imageBlog/findAllByBlogId/${blog.id}`).then(resp =>{
                this.images = angular.copy(resp.data)
            })
        },
        imageChanged(files){
            let dataImage = new FormData()
            dataImage.append('file', files[0])
            $http.post('http://localhost:8080/rest/upload/firebase', dataImage, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(resp =>{
               this.createImageBlog(resp.data.name)
            }).catch(err =>{
                $scope.error = "The field file exceeds its maximum permitted size of 1048576 bytes!"
                console.log('Error', err)
            })
        },
        deleteImage(image){
            $http.delete(`http://localhost:8080/rest/imageBlog/deleteById/${image.id}`).then(resp =>{
                let index = this.images.findIndex(item => item.id == image.id)
                this.images.splice(index, 1)
                $scope.message = "Delete image blog successfully!"
                $scope.blog.liveToastBtn()
            })
        },
        createImageBlog(imageName){
            let item = {
                imageName: imageName,
                blog: this.blog
            }
            $http.post(`http://localhost:8080/rest/imageBlog/create`, item).then(resp =>{
                this.images.push(resp.data)
                $scope.message = "Add image blog successfully!"
                $scope.blog.liveToastBtn()
            })
        }
    }


    $scope.categoryFood = {
        categories: [],
        categoryFood: [],
        cate_of(category, blog) {
            return this.categoryFood.find(item => item.category.id === category.id && item.blog.id === blog.id);
        },
        cate_changed(cate, blog) {
            let category = this.cate_of(cate, blog)
            if (category) {
                this.revoke_cate(blog.id, cate.id)
            } else {
                item = {
                    blog: blog,
                    category: cate
                }
                this.grant_cate(item)
            }
        },
        grant_cate(item) {
            $http.post('http://localhost:8080/rest/categoryBlog/create', item).then(resp => {
                this.categoryFood.push(resp.data)
                $scope.message = "Give authority success!"
                $scope.blog.liveToastBtn()
            }).catch(err => {
                console.log("Error", err)
            })
        },
        revoke_cate(blogId, categoryId) {
            $http.delete(`http://localhost:8080/rest/categoryBlog/deleteByBlogIdAndCategoryId/${blogId}/${categoryId}`, ).then(resp => {

                $scope.message = "Delete category of blog success!"
                $scope.blog.liveToastBtn()
            }).catch(err => {
                console.log("Error", err)
            })
        }

    }


    $scope.blog = {
        itemDelete: {},
        create() {
            $scope.form.content = tinymce.get("myTextarea").getContent();
            $scope.form.viewCount = 1
            $scope.form.status = 1
            let item = angular.copy($scope.form)
            console.log("item: ", item)
            $http.post(`http://localhost:8080/rest/blog/create`, item).then(resp => {
                //lấy id của blog vừa tạo=> tạo
                $scope.items.push(resp.data)
                this.reset()
                console.log("category1", resp.data)
                $scope.message = "Create blog successfully!"
            }).catch(err => {
                $scope.error = "Error create blog!"
                console.log("create error:", err)
            })
            this.liveToastBtn()
        },
        update() {
            $scope.form.content = tinymce.get("myTextarea").getContent();
            let item = angular.copy($scope.form)

            $http.put(`http://localhost:8080/rest/blog/update`, item).then(resp => {
                let index = $scope.items.findIndex(t => t.id == resp.data.id)
                $scope.items[index] = resp.data
                this.reset()
                $scope.message = "Update blog successfully!"
                // $window.location.reset()
            }).catch(err => $scope.error = "Error update blog!")
            this.liveToastBtn()
        },
        clickDelete(item) {
            this.itemDelete = item
        },
        confirmDelete() {
            $http.delete(`http://localhost:8080/rest/blog/delete/${this.itemDelete.id}`).then(resp => {
                let index = $scope.items.findIndex(item => item.id == this.itemDelete.id)
                $scope.items.splice(index, 1)
                this.reset()
                $scope.message = "Delete blog successfully!"
            }).catch(err => $scope.error = "Error blog category!")
            this.liveToastBtn()
        },
        edit(blog) {
            this.reset()
            $scope.form = {}
            let item = {
                id: blog.id,
                title: blog.title,
                content: tinymce.get("myTextarea").setContent(blog.content),
                isDisplay: blog.isDisplay,
                createBy: blog.user.username,
                viewCount: blog.viewCount,

                createDate: new Date(blog.createDate), // can format

                status: blog.status,
            }
            $scope.form = angular.copy(item)

            $scope.imageBlog.findAllByBlogId($scope.form)
            $('#nav-home-tab').click()
        },
        reset() {
            $scope.form = {
                isDisplay: true,
                isFixed: true,
                createDate: new Date(),
                createBy: sessionStorage.getItem('username'),
                viewCount: 1,
                status: 1
            }
            $scope.imageBlog.images = []
            tinymce.get("myTextarea").setContent("<p></p>")
            this.itemDelete = {}
            $scope.message = ""
            $scope.error = ""
        },
        liveToastBtn() {
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
        last() {
            this.page = this.count - 1
        },
        next() {
            this.incrementLimit(true)
        },
        prev() {
            this.incrementLimit(false)
        },
        incrementLimit(up) {
            if (up) {
                (this.page <= ($scope.items.length - this.size)) ? this.page += 10: this.page = 0;
            } else {
                this.page > 10 ? this.page -= 10 : this.page = 0;

            }
        }
    }

    $scope.initialize = function () {
        
        $http.get(`http://localhost:8080/rest/blog/getAll`).then(resp => {
            $scope.items = resp.data
        })
        $http.get(`http://localhost:8080/rest/category/getAll`).then(resp => {
            $scope.categoryFood.categories = resp.data
        })

        $http.get(`http://localhost:8080/rest/categoryBlog/findAll`).then(resp => {
            $scope.categoryFood.categoryFood = resp.data
        }).catch(err => console.log('err: ', err))

        tinymce.init({
            selector: "#myTextarea",
            menubar: false,
            toolbar_location: "bottom",
            plugins: "autoresize link lists emoticons image",
            autoresize_bottom_margin: 70,
            max_height: 500,
            placeholder: "Enter content here . . .",
            toolbar: "bold italic strikethrough link numlist bullist blockquote emoticons image"
        });
    }
    $scope.initialize()
})