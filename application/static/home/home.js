var home = angular.module('beautystash.home', ['infinite-scroll', 'angularMoment'])

home.controller('HomeController', function($scope, Feed){
  $scope.items = [];
  $scope.hashItems = {}

  $scope.loadMore = function() {
    Feed.loadEvents()
      .then(function(data) {
        console.log(data)
        for (var i=0; i < data.length; i++) {
          var timestamp = data[i].time_stamp

          if (!$scope.hashItems.hasOwnProperty(data[i].time_stamp)) {

            $scope.hashItems[data[i].time_stamp] = data[i]

            if (data[i].view_type === 'product') {
              var imageUrl = (data[i].data.image_url === '' ? '../photos/sample2.jpg' : 'www.sephora.com' + data[i].image_url)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'product',
                time_stamp: timestamp,
                comments: 'comments',
                image: imageUrl,
                heading: data[i].data.brand,
                subheading1: data[i].data.name,
                subheading2: data[i].data.category
              })
            } else if (data[i].view_type === 'article') {
              var imageArticle = (data[i].data.image === ''? '../photos/sample2.jpg' : data[i].data.image)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'article',
                time_stamp: timestamp,
                comments: 'comments',
                image: imageArticle,
                heading: data[i].data.article_name,
                subheading1: data[i].data.url
              })
            } else if (data[i].view_type === 'blog') {
              var imageBlog = (data[i].data.image === ''? '../photos/sample2.jpg' : data[i].data.image)
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                type: 'blog',
                time_stamp: timestamp,
                comments: 'comments',
                image: imageBlog,
                heading: data[i].data.site_name,
                subheading1: data[i].data.url
              })
            }
          }
        }
        console.log($scope.items)
      })
      .catch(function(error) {
        console.error('Error:', error)
      })
  }
}); 
