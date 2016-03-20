var fs = require('browserify-fs');
aimlHigh = require('aiml-high');
var interpreter = new aimlHigh({name:'Master Yoda', age:'900'}, 'Goodbye');
var yodaAiml = require('../aiml/yoda.aiml.xml');
interpreter.loadFromString(yodaAiml);

$(document).ready(function () {

    $('#messageForm').submit(function( ) {
      $('.yoda').addClass('js-show-yoda');
      var message2Yoda = $('#message2Yoda').val();

      $('.messageInput').addClass('js-msg-hide');
      $('.messageInput').before( '<li class="messages__msg--sent animated fadeInUp"><blockquote class="msg">' + message2Yoda + '</blockquote></li>' );
      $('.msg__loading').addClass('js-msg-show');

      interpreter.findAnswer(message2Yoda, yodaBotCallback);

      smoothScrollBottom();
    });

    function yodaBotCallback(answer, wildCardArray, input) {
        console.log(answer + ' | ' + wildCardArray + ' | ' + input);

        if(answer == 'I found nothing.') {
          yoda_answer = "Limited, my responses are.  Ask the right question, you must.  Hmmmmmm."; //replace with random Yoda quote

          showResponse(yoda_answer);
        } else {
          $.ajax({
              url: 'https://yoda.p.mashape.com/yoda',
              type: 'GET',
              data: {sentence: answer },
              datatype: 'json',
              success: function (data) {
                  showResponse(data);
              },
              error: function (err) {
                  console.log(err);
              },
              beforeSend: function (xhr) {
                  xhr.setRequestHeader("X-Mashape-Authorization", "KvabR1S411mshQP19qcLAH8SZPHVp1FXBkljsnMGkWUYctty3y");
              }
          });
        }
    };

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
            {name: yodaSounds[4]},
            {name: 'republic_credits'}
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
      ion.sound.play('republic_credits');
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
