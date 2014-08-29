(function() {

    var loadInfo = angular.module('loadInfo', []);
    
    loadInfo.service('getFilesInfo', function($http, $q){
        
        this.urlArtists = "assets/json/artists.txt";
        this.urlAlbums = "assets/json/albums.txt";
        this.urlSongs = "assets/json/songs.txt";
        
        function getArtists(){
            return fetchJSONFile(this.urlArtists);
        }

        function getAlbums(){
            return fetchJSONFile(this.urlAlbums);
        }
        
        function getSongs(){
            return fetchJSONFile(this.urlSongs);
        }
        
        function fetchJSONFile(myURl){
            var request = $http({
                method: 'GET',
                url: myURl
            });
            
            return( request.then( handleSuccess, handleError ) );
        }
        
         function handleError( response ) {
                ! angular.isObject( response.data ) ||
                if (
                    ! response.data.message
                    ) {

                    return( $q.reject( "An unknown error occurred." ) );

                }

                // Otherwise, use expected error message.
                return( $q.reject( response.data.message ) );

        }
 
        function handleSuccess( response ) {

            return( response.data );

        }
        
        return ({
            getArtists: artists,
            getAlbums: albums,
            getSongs: songs
        }); 
    
    });


})();