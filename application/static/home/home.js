var home = angular.module('beautystash.home', ['infinite-scroll', 'angularMoment', 'ui.router']);

home.controller('HomeController', function($scope, Feed, Auth, $state){
  $scope.items = [];
  $scope.hashItems = {};
  var photoOptions = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg', 'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg', 'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg', 'photo21.jpg', 'photo22.jpg', 'photo23.jpg', 'photo24.jpg', 'photo25.jpg', 'photo26.jpg', 'photo27.jpg', 'photo28.jpg' ];

  $scope.loadMore = function() {
    Feed.loadEvents()
      .then(function(data) {
        for (var i=0; i < data.length; i++) {
          var timestamp = data[i].time_stamp;

          if (!$scope.hashItems.hasOwnProperty(data[i].time_stamp)) {

            $scope.hashItems[data[i].time_stamp] = data[i];
            var randomPhoto = photoOptions[Math.floor(Math.random()*photoOptions.length)];

            if (data[i].view_type === 'product') {
              var imageUrl = '../photos/' + randomPhoto;
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                // user_photo: data[i].user.profile_pic,
                user_photo: 'photos/cynthia.jpg',
                type: 'product',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageUrl,
                heading: data[i].data.brand_name,
                subheading1: data[i].data.product_name,
                subheading2: data[i].data.product_description,
                subheading3: data[i].data.product_category,
                subheading4: data[i].data.product_color,
                subheading5: data[i].data.product_status,
              });
            } else if (data[i].view_type === 'article') {
              var imageArticle = (data[i].data.image === '' ? '../photos/' + randomPhoto : data[i].data.image);
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                // user_photo: data[i].user.profile_pic,
                user_photo: 'photos/cynthia.jpg',
                type: 'article',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageArticle,
                heading: data[i].data.article_name,
                subheading2: data[i].data.url
              });
            } else if (data[i].view_type === 'blog') {
              var imageBlog = (data[i].data.image === '' ? '../photos/' + randomPhoto : data[i].data.image);
              $scope.items.unshift({
                user_first: data[i].user.name_first,
                user_last: data[i].user.name_last,
                user_id: data[i].user.userid,
                // user_photo: data[i].user.profile_pic,
                user_photo: 'photos/cynthia.jpg',
                type: 'blog',
                location: data[i].user.location,
                time_stamp: timestamp,
                comments: data[i].comments,
                image: imageBlog,
                heading: data[i].data.site_name,
                subheading2: data[i].data.url
              });
            }
          }
        }
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
  };

  $scope.viewUser = function(user_id) {
    if (Auth.userData.userid === user_id) {
      $state.go('profile.stash');
    }
    else {
      $state.go('user.stash', {userId: user_id});
    }
  };
});
