jQuery(document).ready(function() {
	"use strict";
	initEmojis();
	if (jQuery('.timeline').length > 0) {
		initTimeline()
	};
	if (jQuery('.isotope_filters').length > 0) {
		initFilters()
	};
	if (jQuery('.wpProQuiz_list').length > 0) {
		initQuiz()
	};
});

/* init Emojis function */
function initEmojis() {
	"use strict";
	window._wpemojiSettings = {
		"baseUrl": "https:\/\/s.w.org\/images\/core\/emoji\/2.2.1\/72x72\/",
		"ext": ".png",
		"svgUrl": "https:\/\/s.w.org\/images\/core\/emoji\/2.2.1\/svg\/",
		"svgExt": ".svg",
		"source": {
			"concatemoji": "js/vendor/emoji-release.min.js"
		}
	};
	! function(a, b, c) {
		"use strict";

		function d(a) {
			var b, c, d, e, f = String.fromCharCode;
			if (!k || !k.fillText) return !1;
			switch (k.clearRect(0, 0, j.width, j.height), k.textBaseline = "top", k.font = "600 32px Arial", a) {
				case "flag":
					return k.fillText(f(55356, 56826, 55356, 56819), 0, 0), !(j.toDataURL().length < 3e3) && (k.clearRect(0, 0, j.width, j.height), k.fillText(f(55356, 57331, 65039, 8205, 55356, 57096), 0, 0), b = j.toDataURL(), k.clearRect(0, 0, j.width, j.height), k.fillText(f(55356, 57331, 55356, 57096), 0, 0), c = j.toDataURL(), b !== c);
				case "emoji4":
					return k.fillText(f(55357, 56425, 55356, 57341, 8205, 55357, 56507), 0, 0), d = j.toDataURL(), k.clearRect(0, 0, j.width, j.height), k.fillText(f(55357, 56425, 55356, 57341, 55357, 56507), 0, 0), e = j.toDataURL(), d !== e
			}
			return !1
		}

		function e(a) {
			"use strict";
			var c = b.createElement("script");
			c.src = a, c.defer = c.type = "text/javascript", b.getElementsByTagName("head")[0].appendChild(c)
		}
		var f, g, h, i, j = b.createElement("canvas"),
			k = j.getContext && j.getContext("2d");
		for (i = Array("flag", "emoji4"), c.supports = {
				everything: !0,
				everythingExceptFlag: !0
			}, h = 0; h < i.length; h++) c.supports[i[h]] = d(i[h]), c.supports.everything = c.supports.everything && c.supports[i[h]], "flag" !== i[h] && (c.supports.everythingExceptFlag = c.supports.everythingExceptFlag && c.supports[i[h]]);
		c.supports.everythingExceptFlag = c.supports.everythingExceptFlag && !c.supports.flag, c.DOMReady = !1, c.readyCallback = function() {
			c.DOMReady = !0
		}, c.supports.everything || (g = function() {
			"use strict";
			c.readyCallback()
		}, b.addEventListener ? (b.addEventListener("DOMContentLoaded", g, !1), a.addEventListener("load", g, !1)) : (a.attachEvent("onload", g), b.attachEvent("onreadystatechange", function() {
			"use strict";
			"complete" === b.readyState && c.readyCallback()
		})), f = c.source || {}, f.concatemoji ? e(f.concatemoji) : f.wpemoji && f.twemoji && (e(f.twemoji), e(f.wpemoji)))
	}(window, document, window._wpemojiSettings);
};

/* init Timeline plugin */
function initTimeline() {
	"use strict";
	(function($) {
		var test = false;
		$(window).load(function() {
			if (!test) timeline_init_1($(document));
		});

		function timeline_init_1($this) {
			"use strict";
			$this.find(".scrollable-content").mCustomScrollbar();
			$this.find("a[rel^='prettyPhoto']").prettyPhoto();
			$this.find("#tl1").timeline({
				my_show_years: 9,
				my_del: 130,
				my_is_years: 0,
				my_trigger_width: 800,
				my_sizes: {
					"card": {
						"item_width": "260",
						"item_height": "465",
						"margin": "30"
					},
					"active": {
						"item_width": "260",
						"item_height": "465",
						"image_height": "220"
					}
				},
				my_id: 1,
				my_debug: 0,
				is_mobile: 0,
				autoplay: 0,
				autoplay_mob: 0,
				autoplay_step: 10000,
				itemMargin: 30,
				scrollSpeed: 500,
				easing: "easeOutSine",
				openTriggerClass: '.read_more',
				swipeOn: true,
				startItem: "23/08/2016",
				yearsOn: true,
				hideTimeline: false,
				hideControles: false,
				closeText: "Close",
				closeItemOnTransition: false
			});
			$this.find("#tl1").on("ajaxLoaded.timeline", function(e) {
				"use strict";
				var scrCnt = e.element.find(".scrollable-content");
				scrCnt.height(scrCnt.parent().height() - scrCnt.parent().children("h2").height() - parseInt(scrCnt.parent().children("h2").css("margin-bottom"), 10));
				scrCnt.mCustomScrollbar({
					theme: "light-thin"
				});
				e.element.find("a[rel^='prettyPhoto']").prettyPhoto();
				e.element.find(".timeline_rollover_bottom").timelineRollover("bottom");
			});
		}
	})(jQuery);
};

/* init filters for blog */
function initFilters() {
	"use strict";
	jQuery("#sc_blogger_444 .isotope_filters").append("<a href=\"#\" data-filter=\"*\" class=\"theme_button active\">All</a><a href=\"#\" data-filter=\".flt_64\" class=\"theme_button\">Computer</a><a href=\"#\" data-filter=\".flt_70\" class=\"theme_button\">Finance</a><a href=\"#\" data-filter=\".flt_66\" class=\"theme_button\">HR Management</a><a href=\"#\" data-filter=\".flt_63\" class=\"theme_button\">Marketing and SEO</a><a href=\"#\" data-filter=\".flt_58\" class=\"theme_button\">Social</a><a href=\"#\" data-filter=\".flt_67\" class=\"theme_button\">Technology</a>");
};

/* init proQuiz plugin */
function initQuiz() {
	"use strict";

	window.wpProQuizInitList = window.wpProQuizInitList || [];

	window.wpProQuizInitList.push({
		id: '#wpProQuiz_2',
		init: {
			quizId: 2,
			mode: 3,
			globalPoints: 3,
			timelimit: 360,
			resultsGrade: [0],
			bo: 1024,
			qpp: 0,
			catPoints: [3],
			formPos: 0,
			lbn: "Finish quiz",
			json: {
				"4": {
					"type": "single",
					"id": 4,
					"catId": 0,
					"points": 1,
					"correct": [1, 0, 0]
				},
				"5": {
					"type": "single",
					"id": 5,
					"catId": 0,
					"points": 1,
					"correct": [0, 1, 0]
				},
				"6": {
					"type": "single",
					"id": 6,
					"catId": 0,
					"points": 1,
					"correct": [0, 0, 1]
				}
			}
		}
	});



	window.wpProQuizInitList = window.wpProQuizInitList || [];

	window.wpProQuizInitList.push({
		id: '#wpProQuiz_3',
		init: {
			quizId: 3,
			mode: 3,
			globalPoints: 3,
			timelimit: 360,
			resultsGrade: [0],
			bo: 1024,
			qpp: 0,
			catPoints: [3],
			formPos: 0,
			lbn: "Finish quiz",
			json: {
				"7": {
					"type": "single",
					"id": 7,
					"catId": 0,
					"points": 1,
					"correct": [0, 1, 0]
				},
				"8": {
					"type": "single",
					"id": 8,
					"catId": 0,
					"points": 1,
					"correct": [1, 0, 0]
				},
				"9": {
					"type": "single",
					"id": 9,
					"catId": 0,
					"points": 1,
					"correct": [1, 0, 0]
				}
			}
		}
	});


	window.wpProQuizInitList = window.wpProQuizInitList || [];

	window.wpProQuizInitList.push({
		id: '#wpProQuiz_4',
		init: {
			quizId: 4,
			mode: 3,
			globalPoints: 3,
			timelimit: 360,
			resultsGrade: [0],
			bo: 1024,
			qpp: 0,
			catPoints: [3],
			formPos: 0,
			lbn: "Finish quiz",
			json: {
				"10": {
					"type": "single",
					"id": 10,
					"catId": 0,
					"points": 1,
					"correct": [0, 0, 1]
				},
				"11": {
					"type": "single",
					"id": 11,
					"catId": 0,
					"points": 1,
					"correct": [0, 1, 0]
				},
				"12": {
					"type": "single",
					"id": 12,
					"catId": 0,
					"points": 1,
					"correct": [1, 0, 0]
				}
			}
		}
	});


	window.wpProQuizInitList = window.wpProQuizInitList || [];

	window.wpProQuizInitList.push({
		id: '#wpProQuiz_5',
		init: {
			quizId: 5,
			mode: 3,
			globalPoints: 3,
			timelimit: 360,
			resultsGrade: [0],
			bo: 1024,
			qpp: 0,
			catPoints: [3],
			formPos: 0,
			lbn: "Finish quiz",
			json: {
				"13": {
					"type": "single",
					"id": 13,
					"catId": 0,
					"points": 1,
					"correct": [0, 0, 1]
				},
				"14": {
					"type": "single",
					"id": 14,
					"catId": 0,
					"points": 1,
					"correct": [1, 0, 0]
				},
				"15": {
					"type": "single",
					"id": 15,
					"catId": 0,
					"points": 1,
					"correct": [0, 0, 1]
				}
			}
		}
	});

}