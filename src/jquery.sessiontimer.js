/*!
 * sessiontimer [ https://github.com/nestisamet/sessiontimer ]
 * requires jquery lib.
 * 
 * Copyright 2014 stemizer.net ~ nestisamet<a>gmail<d>com
 * Licensed under the MIT license
 * http://opensource.org/licenses/mit
 */

(function ($){
	$.extend({
		sessiontimer : function(vars) {
			//
			var defaults = {
				session_period : 600,  // sec
				warning_sec	   : 60,
				url : {
					signout : 'http-your-logout',	// --> logout url
					keepalive : '?'
				},
				func : {
					// keepalive loader
					showloader : function() {},
					// keepalive loader hide
					hideloader : function() {},
					//
					signout: null			  		// --> or logout function
				},
				message : {
					title   : 'Session is about to expire',
					text : 'Your session is going to timeout..<br>Do you want to continue your session?',
					keepworking : 'Yes, Keep Working',
					logout : 'No, Logout'
				},
				countdown_obj : null, // example: $('.session_remain')
				digits : 'type1'
			}
			//
			,options = $.extend({}, defaults, vars)
			,timer = null
			,msg = options.message
			,bs_fw = typeof $().modal === 'function'
			,dialogbox;
			//
			init();
			//
			function clear() {
				clearInterval(timer);
			};
			function reset() {
				var sec = options.session_period;
				clear();
				timer = setInterval(function() {
					--sec;
					if (sec>=0)
					{
						if (options.countdown_obj.prop('tagName')=='INPUT')
							options.countdown_obj.val(sec);
						else options.countdown_obj.text(sec);
						// console.log(sec);
					}
					if (sec==options.warning_sec)
					{
						if (bs_fw) {
							$('*.modal').modal('hide');
							dialogbox.modal("show");
						}
						else dialogbox.fadeIn();
					}
					if (sec<=options.warning_sec)
					{
						$("#session-timeout-counter", dialogbox).html(digit(sec.toString()));
					}
					if (sec<0) signout();
				}, 1000);
			};
			function keepalive() {
				clear();
				options.func.showloader.call();
				if (!bs_fw) {
					dialogbox.fadeOut();
				}
				$.post(options.url.keepalive, {hebele:'hubele'}, function () {
					options.func.hideloader.call();
				});
			};
			function signout() {
				clear();
				if (options.func.signout)
				{
					if (bs_fw) dialogbox.modal("hide");
					else dialogbox.remove();
					//
					if (typeof options.func.signout === 'function') {
						options.func.signout.call();
					}
				}
				else if (options.url.signout)
				{
					window.location.href = options.url.signout;
				}
				else alert('You need an url or func for logout');
			};
			function digit(j)
			{
				var str = '';
				if (j>-1) {
					if (j.length==1) j = '0'+j;
					for (var i=0; i<j.length; i++) {
						 str += '<img style="vertical-align:text-bottom" width="16" height="21" alt="" src="../src/img/digits/'+options.digits+'/'+j.charAt(i)+'.png">';
					}
				}
				return str;
			}
			//
			function init()
			{
				if (!options.countdown_obj) {
					options.countdown_obj = $('<input type="hidden">');
				}
				if (bs_fw)
				{
					dialogbox = $('<div class="modal fade" data-backdrop="static"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+msg.title+' <span id="session-timeout-counter"></span></h4></div><div class="modal-body" style="font-size:12px"><p>'+msg.text+' </p></div><div class="modal-footer"><button id="session-timeout-dialog-logout" type="button" class="btn btn-default">'+msg.logout+'</button><button id="session-timeout-dialog-keepalive" type="button" class="btn btn-primary" data-dismiss="modal">'+msg.keepworking+'</button></div></div></div></div>');
				}
				else
				{
					dialogbox = $('<div class="session-timeout-wrapper"><div class="session-timeout-dialog"><div class="header">'+msg.title+' <span id="session-timeout-counter"></span></div><div class="body"><p>'+msg.text+'</p></div><div class="footer"><button id="session-timeout-dialog-logout" type="button">'+msg.logout+'</button><button id="session-timeout-dialog-keepalive" type="button">'+msg.keepworking+'</button></div></div><div class="session-timeout-bg"></div></div>');
					$("body").prepend(dialogbox);
				}
				$("#session-timeout-dialog-keepalive",dialogbox).click(function() {
					keepalive();
				});
				$("#session-timeout-dialog-logout",dialogbox).click(function() {
					signout();
				});
			}
			//
			$(document).ajaxStart(function() {
				clear();
			})
			.ajaxStop(function() {
				reset();
			});
			$(window).load(function() {
				reset();
			});
		}
	});
})(jQuery);