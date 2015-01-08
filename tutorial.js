function Event(name, cb) {
    this.name = name;
    this.cb = cb;
    this.check = null;
    this.unexpectedEvent = null;
    this.timeout = null;
    this.timer = null;
    this.time = null;
}

window._Tutorial = new(function() {

    this.satProperty = function(id, prop, val) {
        this.event('satProperty', [id, prop, val]);
    }
    this.createdNode = function(parent, child) {
        this.event('createdNode', [parent, child]);
    }
    this.deletedNode = function(nodeid) {
        this.event('deletedNode', nodeid);
    }
    this.createdFire = function() {
        this.event('createdTrap');
        this.event('createdFire');
    }
    this.createdDoor = function() {
        this.event('createdTrap');
        this.event('createdDoor');
    }
    this.createdLaser = function() {
        this.event('createdTrap');
        this.event('createdLaser');
    }
    this.createdWaypoint = function() {
        this.event('createdTrap');
        this.event('createdWaypoint');
    }
    this.createdEnemy = function() {
        this.event('createdTrap');
        this.event('createdEnemy');
    }
    this.played = function() {
        this.event('played');
    }
    this.paused = function() {
        this.event('paused');
    }
    this.cleared = function() {
        this.event('cleared');
    }
    this.undid = function() {
        this.event('undid');
    }
    this.nextClicked = function() {
        this.event('next');
    }
    this.event = function(eventname, param) {
        if (this.nextEvent && this.nextEvent.name == eventname) {
            //if the event has a check function
            if (this.nextEvent.check) {
                //run the check function. if it return true, clear the current event and go to the next
                if (this.nextEvent.check()); {
                    var e = this.nextEvent;
                    this.nextEvent = null;
                    if (e.timer) {
                        window.clearTimeout(e.timer);
                        e.timer = null;
                    }
                    e.cb();
                }
            } else {
                //if the event has no check funciton, just clear this.nextevent and call the callback
                var e = this.nextEvent;
                this.nextEvent = null;
                if (e.timer) {
                    window.clearTimeout(e.timer);
                    e.timer = null;
                }
                e.cb();
            }
        } else {
            if (this.nextEvent && this.nextEvent.unexpectedEvent)
                this.nextEvent.unexpectedEvent();
        }
    }
    //set the next condition the system is waiting for in order
    this.setNextEvent = function(event) {
        this.nextEvent = event;
        if (this.nextEvent.timeout) {
            this.nextEvent.timer = window.setTimeout(function() {
                _Tutorial.nextEvent.timeout();
                this.nextEvent.timer = null;
            }, this.nextEvent.time)
        }
    }
    this.prompt = function(title, text, img, cb) {
      
        if (img.constructor == Function)
            cb = img;
        $('.tutorialprompt').animate({
            top: '30%',
            left: '30%'
        });
        $('.tutorialprompt').fadeIn();
        $('.tutorialprompt .header').text(title);
        $('.tutorialprompt .text').text(text);
        $('.tutorialprompt img').show();
        $('#tutorialNext').unbind('click');
        $('#tutorialNext').click(cb);
        $('.tutorialbackground').fadeIn();

    }
    this.hint = function(title, text, cb) {
        $('.tutorialprompt').animate({
            top: '80%',
            left: '59%'
        });
        $('.tutorialprompt .header').text(title);
        $('.tutorialprompt .text').text(text);
        $('.tutorialprompt img').hide();
        $('#tutorialNext').unbind('click');
        $('#tutorialNext').click(cb);
        $('.tutorialbackground').fadeOut();
    }
    this.runTutorial = function() {
        $('#tutorialRoot').empty();
        $('#tutorialRoot').remove();
        $(document.body).append('<div id="tutorialRoot" />');
        $('#tutorialRoot').load('/vwfdatamanager.svc/datafile/XAPIGame/prompts.html', function() {


            async.series([

                function(cb) {
                    _Tutorial.prompt('Welcome!', 'This breif tutorial will show you how to use the game editor. When you`re done, you can build you own games! If you`ve seen this before, or you already know what to do, click `cancel tutorial` at any time to exit.', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                },
                function(cb) {
                    _Tutorial.hint('The Game Board', 'This game board is where you`ll lay out your level', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                    $('.tutorialbackground').fadeOut();
                    $('#gameEditGUI').parent().hide();
                    window.setTimeout(function(){
                    	_Tutorial.nextClicked();
                    },5000)
                },
                function(cb) {
                    $('.tutorialbackground').fadeIn();
                    $('#gameEditGUI').parent().show();
                     _Tutorial.hint('The Palet', 'This is the palet. Each item in this palet can be dragged and dropped onto the game board', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                    $('.tutorialbackground').fadeOut();
                    $('#gameEditGUI').parent().animate({left:'70%'},7000);
                    window.setTimeout(function(){
                    	_Tutorial.nextClicked();
                    },10000)
                },
                function(cb) {
                    _Tutorial.hint('Create any kind of trap', 'Drag a trap from your palet onto the game board.', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('createdTrap', cb));
                },
                function(cb) {
                    _Tutorial.prompt('You did it!', 'Great! Now you have a trap! Lets tryout the game. Use the WASD keys to move around.', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                },
                function(cb) {
                	$('.tutorialbackground').fadeOut();
                    $('.tutorialprompt').fadeOut();
                    $('#gamePlayButton').click();
                    window.setTimeout(function(){cb();},10000);
                },
                function(cb) {
                	$('#gamePlayButton').click();
                    _Tutorial.prompt('Good Job!', 'Now you see how that works? Drive your truck up to the trap and see if you can get caught.', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                },
                function(cb) {
                	$('#gamePlayButton').click();
                    _Tutorial.hint('Drive until you are caught!', 'Use the WASD keys do drive until you`re caught. Click Next below to skip.', function(ok) {
                        _Tutorial.nextEvent.cb();
                    });
                    _Tutorial.setNextEvent(new Event('died', cb));
                },
                function(cb) {
                    $('#gamePlayButton').click();
                    _Tutorial.prompt('Clear the board', 'You can clear the board with the clear button. This return all the traps to the palet so you can use them again. Since you only have a limited number of traps, you must use the carefully!', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('next', cb));
                },
                function(cb) {
                    _Tutorial.hint('Clear the board', 'You can clear the board with the clear button.', function(ok) {
                        _Tutorial.nextClicked();
                    });
                    _Tutorial.setNextEvent(new Event('cleared', cb));
                },
            ], function(err) {
                alertify.alert('the tutorial is over', function(ok) {
                    _Tutorial.nextClicked();
                });
            })
        })
    }
    this.cancelTutorial = function() {

    }


});