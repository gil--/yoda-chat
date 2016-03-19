$(document).ready(function () {

    $('#messageForm').submit(function( ) {
      //  playYodaSound(); // Play a Yoda sound
      $('.yoda').addClass('js-show-yoda');
      var message2Yoda = $('#message2Yoda').val();

      $('.messageInput').addClass('js-msg-hide');
      $('.messageInput').before( '<li class="messages__msg--sent animated fadeInUp"><blockquote class="msg">' + message2Yoda + '</blockquote></li>' );
      $('.msg__loading').addClass('js-msg-show');

      smoothScrollBottom();

        $.ajax({
            url: 'https://yoda.p.mashape.com/yoda',
            type: 'GET',
            data: {sentence: message2Yoda },
            datatype: 'json',
            success: function (data) {
                showResponse(data);
            },
            error: function (err) {
                console.log(err);
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "INSERT MASHAPE KEY HERE");
            }
        });
    });

    function showResponse(data) {
      $('.msg__loading').removeClass('js-msg-show');
      $('#message2Yoda').val('');
      $('.messageInput').before( '<li class="messages__msg--reply animated fadeInUp"><blockquote class="msg">' + data + '</blockquote></li>' );

      smoothScrollBottom();

      setTimeout(function() {
        $('.messageInput').removeClass('js-msg-hide');
      }, 750);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *
     *  Smoothly Scroll to Bottom of Messages -- keep last message always in view
     *
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    function smoothScrollBottom() {
      $("html,body").animate({
        scrollTop:$(document).height()
      });
    }


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *
     *  Yoda Logo Sounds
     *
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    // init bunch of sounds
    var yodaSounds = ["yoda_yawn", "yoda_laugh1", "yoda_laugh2", "yoda_laugh3", "you_seek_yoda"];

    ion.sound({
        sounds: [
            {name: yodaSounds[0]},
            {name: yodaSounds[1]},
            {name: yodaSounds[2]},
            {name: yodaSounds[3]},
            {name: yodaSounds[4]}
        ],

        // main config
        path: "sounds/",
        preload: true,
        multiplay: false,
        volume: 0.6
    });

    function playYodaSound() {
      var randomSound = Math.floor(Math.random() * (4 + 1));
      ion.sound.play(yodaSounds[randomSound]);
    }

    // Play Yoda Sounds on Logo Click
    $('.logo').on('click', function( ) {
      playYodaSound();
    });

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     *
     *  Credits Modal
     *
     * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     */
    // Show Credits Modal
    $(document).on('click', '.open-credits', function( ) {
      $('.credits').toggleClass('js-hide').addClass('animated fadeIn');
    });

    // Hide Credits Modal
    $(document).on('click', '.credits button', function( ) {
      $('.credits ul').removeClass('fadeInUpBig').toggleClass('animated fadeOutUp');
      $('.credits').removeClass('fadeIn').addClass('fadeOut');

      setTimeout(function() {
        $('.credits').addClass('js-hide').removeClass('fadeOut').addClass('fadeIn');
        $('.credits ul').toggleClass('animated fadeOutUp');
      }, 250);
    });
});

console.log("Do or do not, there is no try.");

// console.log("There have always been ghosts in the machine.");
// console.log("I'm sorry, my responses are limited. You must ask the right question.");
// console.log("Program terminated.");
