angular.module('healthy.controllers', [])


.controller('loginCtrl', function($scope , Auth ,$state ,$location ,$timeout) {


	 $timeout(function(){
	 		  Auth.$onAuth(function (authData) {
            if (authData) {
                $location.path("/dash/pasien");
            } 
    });
	 },1000)

	function makeToast(text){
		 var snackbarContainer = document.querySelector('#demo-toast-example');
		  var data = {message: text };
   		 snackbarContainer.MaterialSnackbar.showSnackbar(data);
	}
	$scope.user ={};
  	$scope.doLogin = function(user){
		if(!user.email || !user.pass){
			if(!user.email){
					makeToast("Masukkan Email");
			}
			if(!user.pass){
				makeToast("Masukkan Password");
			}
		}
		else{
			$scope.showspin = true;
			loginApp(user);
		}
	};

	function loginApp(user){
		     
      Auth.$authWithPassword({
                email: user.email,
                password: user.pass
      }).then(function (authData) {
          
         if(authData.uid == '016e39d6-d8e3-430c-a531-be1234ad96cf'){
           window.localStorage.setItem("adminemail", user.email);
        	 $state.go('dash.pasien');
         }
         else{
         	$scope.showspin = false;
         	 Auth.$unauth();
         	 makeToast("Email salah,periksa kembali email anda");
         	 makeToast("Password salah,periksa kembali password anda");
         }
        
         
       }).catch(function (error) {
  				$scope.showspin = false;
                if (error) {
                    switch (error.code) {
                      case "INVALID_PASSWORD":
                        makeToast("Password salah,periksa kembali password anda");
                        break;
                      case "NETWORK_ERROR":
                       makeToast("Tidak terkoneksi dengan jaringan");
                        break;
                      case "INVALID_EMAIL":
                         
                        makeToast("Email salah,periksa kembali email anda");
                        break;
                      case "INVALID_USER":
                         
                         makeToast("User belum terdaftar");
                        break;
                      case "UNKNOWN_ERROR":
                        
                         makeToast("Terjadi kesalahan yang tidak diketahui");
                        break;
                      default:
                        makeToast("Terjadi kesalahan yang tidak diketahui");
                    }
                  } 
        });
	};

})

.controller('AplCtrl', function($scope ,Auth ,$ionicPopup , $state ,$location ,$timeout , User) {
   	
    //check internet connection 
    var connectedRef = new Firebase("https://easyhealthy.firebaseio.com/.info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
           $scope.showsnackbar = false;
      } else {
           $scope.showsnackbar = true;
      }
    });

     $scope.setCari = function(cari){
      $scope.search = cari;
     }

    $scope.allUser = User;

      $scope.judul = "Pasien";

    $scope.changejud = function(judul){
      $scope.judul = judul;
    };

    function makeToast(text){
     var snackbarContainer = document.querySelector('#demo-toast-example');
      var data = {
        message: text 
      };
       snackbarContainer.MaterialSnackbar.showSnackbar(data);
  };
    Auth.$onAuth(function (authData) {
            if (authData) {
               
            }else{
            	 $location.path("/login");
            } 
    });

    function showAlert(){
        var dialog = document.querySelector('#dialog3');
        dialog.showModal();
        $timeout(function(){
          dialog.close();
       },3000);
     };
    
    $scope.emailAmin =window.localStorage.getItem("adminemail");
    $scope.ubahemailadmin = function(baru,pass){
      if(!baru || !pass){
        if(!baru){
          makeToast("Masukkan email baru admin");
        }
        if(!pass){
           makeToast("Masukkan password saat ini");
        }
      }
      else{
        $scope.showspin = true;
        $scope.textberhasil = "Email administrator berhasil diperbarui.";
          var ref = new Firebase("https://easyhealthy.firebaseio.com/users/");
           ref.changeEmail({
          oldEmail : window.localStorage.getItem("adminemail"),
          newEmail : baru,
          password : pass
        },  function(error) {
            $scope.showspin = false;
          if (error === null) {
               window.localStorage.setItem("adminemail", baru);
               $scope.emailAmin = baru;
              
             $scope.hideUbahemail();
             showAlert();
          } else {
            switch(error.code){
              case 'INVALID_PASSWORD' : makeToast("Kata sandi anda salah");
                                        break;
              case 'EMAIL_TAKEN' : makeToast("Email sudah digunakan orang lain");
                                  break;
              default :
                      makeToast("Terjadi kesalahan yang tidak diketahui");
            }
            
            
          }
          });
      }
    };

    $scope.ubahpasswordadmin = function(item){
      if(!item.lama || !item.baru || !item.lagi){
        if(!item.lama){
           makeToast("Masukkan kata sandi lama");
        }
        if(!item.baru){
           makeToast("Masukkan kata sandi baru");
        }
        if(!item.lagi){
           makeToast("Ulangi kata sandi baru lagi");
        }
      }
      else{
        if(item.baru != item.lagi){
           makeToast("kata sandi baru tidak cocok");
        }
        else{
          $scope.showspin = true;
          $scope.textberhasil = "Password administrator berhasil diperbarui.";
          var ref = new Firebase("https://easyhealthy.firebaseio.com/");
          ref.changePassword({
          email       : window.localStorage.getItem("adminemail"),
          oldPassword : item.lama,
          newPassword : item.baru
          }, function(error) {
            $scope.showspin = false;
          if (error === null) {
           $scope.hideUbahpassword();
           showAlert();
          } else {
            if(error.code == 'INVALID_PASSWORD'){
              makeToast("Kata sandi lama anda salah");
            }
            else{
             makeToast("Terjadi kesalahan yang tidak diketahui");
            }
            
          }
          });
        }
      }

    };

   $scope.clickOutapp = function(){
     var dialog = document.querySelector('#dialog');
     dialog.showModal();
   };

   $scope.showUbahemail = function(){
     $scope.newItem = {};
     var dialog = document.querySelector('#dialog2');
     dialog.showModal();

   };

   $scope.hideUbahemail = function(){
      $scope.showspin = false;
     var dialog = document.querySelector('#dialog2');
     dialog.close();
   };

      $scope.showUbahpassword = function(){
     $scope.newItem = {};
     var dialog = document.querySelector('#dialog4');
     dialog.showModal();

   };

     $scope.hideUbahpassword = function(){
      $scope.showspin = false;
     var dialog = document.querySelector('#dialog4');
     dialog.close();
   };

    $scope.hideDialog = function(){
     var dialog = document.querySelector('#dialog');
     dialog.close();
   };


  $scope.keluarApp = function(){
  	 Auth.$unauth();
  	 $state.go('login');
  }
})

.controller('BlahCtrl', function($scope ,Auth , $state ) {
  	
  	$scope.goBack = function(){
  		Auth.$onAuth(function (authData) {
            if (authData) {
               $state.go('dash.pasien');
            }else{
            	$state.go('login');
            } 
  	   });
  	}
});
