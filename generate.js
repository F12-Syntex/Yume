var PORT = 3023;

$(document).on('keydown', function(event) {
    if (event.key == 'Enter') {
        var content = $('#input').val();

        console.log(content);

        var url = "http://127.0.0.1:" + PORT + "/search?content=" + content;
        console.log("searching: " + url);

        $.get(url, (data) => {
            
            $('.images').empty();

            console.log("working");

            var images = JSON.parse(data).images;
            //death%20note&restrict_sr=1

            //https://getwallpapers.com/"
            for(var i = 0; i < images.length; i++){
                console.log(images[i]);
                $('<img>').attr('src', images[i]).appendTo('.images');
            }

          }).fail((error) => {
              console.error(error); // Log any errors that occur
          });

    }
});
