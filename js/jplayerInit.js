// jPlayer Initialization (GitHub Pages-safe)
// Converts the old auto-run IIFE into a callable function: window.initJPlayers()

(function ($) {
  // ensure we don't start multiple intervals if init is called more than once
  var timeAlignIntervalStarted = false;

  window.initJPlayers = function () {
    initSinglePlayer();
    bindTransportButtons();
    startTimeAlignOnce();
  };

  function initSinglePlayer() {
    var players = $('.jplayer');

    players.each(function () {
      var $player = $(this);

      // prevent initializing the same player twice
      if ($player.data('_bound')) return;
      $player.data('_bound', true);

      var ancestor = $player.data('ancestor');
      // force HTTPS for GitHub Pages (avoid mixed-content block)
      var rawUrl = String($player.data('url') || '');
      var songUrl = rawUrl.replace(/^http:\/\//i, 'https://');

      $player.jPlayer({
        ready: function () {
          $(this).jPlayer('setMedia', { mp3: songUrl });
        },
        play: function () { // To avoid multiple jPlayers playing together.
          $(this).jPlayer('pauseOthers');
          try {
            // your original code referenced wavesurfer; keep the safety guard
            wavesurfer.pause();
          } catch (err) { /* ignore if wavesurfer isn't present */ }
        },
        swfPath: 'jPlayer',
        supplied: 'mp3',
        cssSelectorAncestor: ancestor,
        wmode: 'window',
        globalVolume: false,
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        solution: 'html',
        preload: 'metadata',
        volume: 0.8,
        muted: false,
        backgroundColor: '#000000',
        errorAlerts: false,
        warningAlerts: false
      });
    });
  }

  function currentTimeAlign() {
    $('.jp-progress').each(function () {
      var $progress = $(this);
      var playBarW = $progress.find('.jp-play-bar').innerWidth();
      if (playBarW > 40) {
        $progress.addClass('middle');
      } else {
        $progress.removeClass('middle');
      }
    });
  }

  function startTimeAlignOnce() {
    if (!timeAlignIntervalStarted) {
      setInterval(currentTimeAlign, 10);
      timeAlignIntervalStarted = true;
    }
  }

  function bindTransportButtons() {
    $('.single_player').each(function () {
      var thisItem = $(this);
      var player = thisItem.find('.jplayer');

      thisItem.find('.jp-next').on('click', function () {
        fastforwardTrack();
      });

      thisItem.find('.jp-prev').on('click', function () {
        rewindTrack();
      });

      function getPlayerProgress() {
        // use closest seek bar in this player block to avoid cross-player math
        var $seek = thisItem.find('.jp-seek-bar');
        var $play = thisItem.find('.jp-play-bar');
        var pct = ($play.width() / $seek.width()) * 100;
        return isFinite(pct) ? pct : 0;
      }

      function rewindTrack() {
        var current = getPlayerProgress();
        var future = current - 5;
        if (future <= 0) {
          player.jPlayer('pause', 0);
        } else {
          player.jPlayer('playHead', parseInt(future, 10));
        }
      }

      function fastforwardTrack() {
        var current = getPlayerProgress();
        var future = current + 5;
        if (future >= 100) {
          // jump to end
          player.jPlayer('playHead', 100);
        } else {
          player.jPlayer('playHead', parseInt(future, 10));
        }
      }
    });
  }
})(jQuery);
