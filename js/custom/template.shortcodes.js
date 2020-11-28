// Init actions
function micro_office_sc_init_actions() {
    "use strict";
    setTimeout(function() {
        micro_office_sc_animation();
    }, 600);

    // MenuItems - init once
    jQuery('body')
        .on('click', '.show_popup_menuitem', function(e) {
            "use strict";
            micro_office_menuitems_show_popup(jQuery(this));
            e.preventDefault();
            return false;
        })
        .on('click', '.close_menuitem, .popup_menuitem', function(e) {
            "use strict";
            var target = jQuery(e.target);
            if (target.hasClass('popup_menuitem') || target.hasClass('close_menuitem') || target.parent().hasClass('close_menuitem')) {
                micro_office_menuitems_hide_popup();
                e.preventDefault();
                return false;
            }
        });

    // Init sc in container
    micro_office_sc_init(jQuery('body').eq(0));
}

// Resize actions
function micro_office_sc_resize_actions() {
    "use strict";
    micro_office_sc_sliders_resize();
    micro_office_sc_equal_height();
}

// Scroll actions
function micro_office_sc_scroll_actions() {
    "use strict";
    micro_office_sc_animation();
}

// Animation
function micro_office_sc_animation() {
    "use strict";
    jQuery('[data-animation^="animated"]:not(.animated)').each(function() {
        "use strict";
        if (jQuery(this).offset().top < jQuery(window).scrollTop() + jQuery(window).height())
            jQuery(this).addClass(jQuery(this).data('animation'));
    });
}

// Shortcodes init
var MICRO_OFFICE_STORAGE = micro_office_get_storage();
function micro_office_sc_init(container) {
    "use strict";
    // Call theme specific action (if exists)
    if (window.micro_office_theme_sc_init) micro_office_theme_sc_init(container);

    // Accordion
    if (container.find('.sc_accordion:not(.inited)').length > 0) {
        container.find(".sc_accordion:not(.inited)").each(function() {
            "use strict";
            var init = jQuery(this).data('active');
            if (isNaN(init)) init = 0;
            else init = Math.max(0, init);
            jQuery(this)
                .addClass('inited')
                .accordion({
                    active: init,
                    heightStyle: "content",
                    header: "> .sc_accordion_item > .sc_accordion_title",
                    create: function(event, ui) {
                        "use strict";
                        micro_office_sc_init(ui.panel);
                        if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(ui.panel);
                        ui.header.each(function() {
                            "use strict";
                            jQuery(this).parent().addClass('sc_active');
                        });
                    },
                    activate: function(event, ui) {
                        "use strict";
                        micro_office_sc_init(ui.newPanel);
                        if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(ui.newPanel);
                        ui.newHeader.each(function() {
                            "use strict";
                            jQuery(this).parent().addClass('sc_active');
                        });
                        ui.oldHeader.each(function() {
                            "use strict";
                            jQuery(this).parent().removeClass('sc_active');
                        });
                    }
                });
        });
    }

    // Blogger: style Polaroid
    if (container.find('.sc_blogger.layout_polaroid .photostack:not(.inited)').length > 0) {
        container.find(".sc_blogger.layout_polaroid .photostack:not(.inited)").each(function() {
            "use strict";
            var obj = jQuery(this);
            var id = obj.attr('id');
            if (id == undefined) {
                id = 'photostack_' + Math.random();
                id = id.replace('.', '');
                obj.attr('id', id);
            }
            setTimeout(function() {
                "use strict";
                obj.addClass('inited').parent().height("auto");
                new Photostack(obj.get(0), {
                    callback: function(item) {}
                });
            }, 10);
        });
    }

    // Blogger: Scroll horizontal
    if (container.find('.sc_blogger .sc_scroll_horizontal .sc_scroll_wrapper:not(.inited)').length > 0) {
        container.find(".sc_blogger .sc_scroll_horizontal .sc_scroll_wrapper:not(.inited)").each(function() {
            "use strict";
            var obj = jQuery(this);
            var width = 0;
            obj.find('.isotope_item').each(function() {
                "use strict";
                width += jQuery(this).outerWidth();
            });
            obj.addClass('inited').width(width);
        });
    }

    // Form
    if (container.find('.sc_form:not(.inited) form').length > 0) {
        container.find(".sc_form:not(.inited) form").each(function() {
            "use strict";
            jQuery(this).addClass('inited');
            jQuery(this).submit(function(e) {
                "use strict";
                micro_office_sc_form_validate(jQuery(this));
                e.preventDefault();
                return false;
            });
            if (jQuery(this).find('.js__datepicker').length > 0) {
                jQuery(this).find('.js__datepicker').pickadate({
                    // Work-around for some mobile browsers clipping off the picker.
                    onOpen: function() {
                        "use strict";
                        jQuery('pre').css('overflow', 'hidden');
                    },
                    onClose: function() {
                        "use strict";
                        jQuery('pre').css('overflow', '');
                    },
                    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                    showMonthsShort: true,
                    format: 'dd.mm.yyyy',
                    formatSubmit: 'yyyy-mm-dd',
                    min: true
                });
            }
            if (jQuery(this).find('.js__timepicker').length > 0) {
                jQuery(this).find('.js__timepicker').pickatime();
            }
        });
    }

    //Countdown
    if (container.find('.sc_countdown:not(.inited)').length > 0) {
        container.find('.sc_countdown:not(.inited)')
            .each(function() {
                "use strict";
                jQuery(this).addClass('inited');
                var id = jQuery(this).attr('id');
                var curDate = new Date();
                var curDateTimeStr = curDate.getFullYear() + '-' + (curDate.getMonth() < 9 ? '0' : '') + (curDate.getMonth() + 1) + '-' + (curDate.getDate() < 10 ? '0' : '') + curDate.getDate() + ' ' + (curDate.getHours() < 10 ? '0' : '') + curDate.getHours() + ':' + (curDate.getMinutes() < 10 ? '0' : '') + curDate.getMinutes() + ':' + (curDate.getSeconds() < 10 ? '0' : '') + curDate.getSeconds();
                var interval = 1; //jQuery(this).data('interval');
                var endDateStr = jQuery(this).data('date');
                var endDateParts = endDateStr.split('-');
                var endTimeStr = jQuery(this).data('time');
                var endTimeParts = endTimeStr.split(':');
                if (endTimeParts.length < 3) endTimeParts[2] = '00';
                var endDateTimeStr = endDateStr + ' ' + endTimeStr;
                if (curDateTimeStr < endDateTimeStr) {
                    jQuery(this).find('.sc_countdown_placeholder').countdown({
                        until: new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], endTimeParts[0], endTimeParts[1], endTimeParts[2]),
                        tickInterval: interval,
                        onTick: micro_office_countdown
                    });
                } else {
                    jQuery(this).find('.sc_countdown_placeholder').countdown({
                        since: new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], endTimeParts[0], endTimeParts[1], endTimeParts[2]),
                        tickInterval: interval,
                        onTick: micro_office_countdown
                    });
                }
            });
    }

    // Googlemap init
    if (container.find('.sc_googlemap:not(.inited)').length > 0) {
        container.find('.sc_googlemap:not(.inited)')
            .each(function() {
                "use strict";
                if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
                var map = jQuery(this).addClass('inited');
                var map_id = map.attr('id');
                var map_zoom = map.data('zoom');
                var map_style = map.data('style');
                var map_markers = [];
                map.find('.sc_googlemap_marker').each(function() {
                    "use strict";
                    var marker = jQuery(this);
                    map_markers.push({
                        point: marker.data('point'),
                        address: marker.data('address'),
                        latlng: marker.data('latlng'),
                        description: marker.data('description'),
                        title: marker.data('title')
                    });
                });
                micro_office_googlemap_init(jQuery('#' + map_id).get(0), {
                    style: map_style,
                    zoom: map_zoom,
                    markers: map_markers
                });
            });
    }

    // Infoboxes
    if (container.find('.sc_infobox.sc_infobox_closeable:not(.inited)').length > 0) {
        container.find('.sc_infobox.sc_infobox_closeable:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                "use strict";
                jQuery(this).slideUp();
                e.preventDefault();
                return false;
            });
    }

    // Intro
    if (container.find('.sc_intro[data-href]:not(.inited)').length > 0) {
        container.find('.sc_intro[data-href]:not(.inited)')
            .addClass('inited')
            .on('click', function(e) {
                "use strict";
                var link = jQuery(this).data('href');
                window.location.href = link;
                e.preventDefault();
                return false;
            });
    }

    // Matches
    if (container.find('.sc_matches:not(.inited)').length > 0) {
        container.find('.sc_matches:not(.inited)')
            .each(function() {
                "use strict";
                jQuery(this).find('.sc_matches_next .sc_matches_list .sc_match').on('click', function() {
                    "use strict";
                    jQuery(this).parents('.sc_matches').find('.sc_matches_current .sc_match').hide();
                    var item = jQuery(this).data('item');
                    jQuery(item).fadeIn();
                });
            });
    }

    // Matches & Players: Sort players by points
    if (container.find('.sc_players_table:not(.inited)').length > 0) {
        container.find('.sc_players_table:not(.inited)')
            .addClass('inited')
            .on('click', '.sort', function(e) {
                "use strict";
                
                var table = jQuery(this).parents('.sc_players_table');
                var id = jQuery(table).attr('id')
                var sort = jQuery(table).data('sort') == 'asc' ? 'desc' : 'asc';
                jQuery.post(MICRO_OFFICE_STORAGE['ajax_url'], {
                    action: 'sort_by_points',
                    nonce: MICRO_OFFICE_STORAGE['ajax_nonce'],
                    sort: sort,
                    table: MICRO_OFFICE_STORAGE['ajax_' + id]
                }).done(function(response) {
                    "use strict";
                    var rez = {};
                    try {
                        rez = JSON.parse(response);
                    } catch (e) {
                        rez = {
                            error: MICRO_OFFICE_STORAGE['ajax_error']
                        };
                        console.log(response);
                    }
                    if (rez.error === '') {
                        table
                            .data('sort', sort)
                            .find('.sc_table')
                            .after(rez.data)
                            .remove();
                        micro_office_select_players_category(jQuery(table).find('.sc_players_table_category select'));
                    }
                });
                e.preventDefault();
                return false;
            });
    }

    // Matches & Players: Select category in the points table
    if (container.find('.sc_players_table_category:not(.inited)').length > 0) {
        container.find('.sc_players_table_category:not(.inited)')
            .addClass('inited')
            .on('change', function() {
                "use strict";
                micro_office_select_players_category(jQuery(this));
            });
    }

    // Popup links
    if (container.find('.sc_popup_link:not(.inited)').length > 0) {
        container.find('.sc_popup_link:not(.inited)').each(function() {
            var popup_id = jQuery(this).attr('href');
            jQuery(this)
                .addClass('inited')
                .magnificPopup({
                    type: 'inline',
                    removalDelay: 500,
                    midClick: true,
                    callbacks: {
                        beforeOpen: function() {
                            this.st.mainClass = 'mfp-zoom-in';
                        },
                        open: function() {
                            "use strict";
                            micro_office_sc_init(jQuery(popup_id));
                            micro_office_resize_actions();
                            if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(jQuery(popup_id));
                        },
                        close: function() {}
                    }
                });
        });
    }

    // Recent news widget and sc
    if (container.find('.sc_recent_news_header_category_item_more:not(.inited)').length > 0) {
        container.find('.sc_recent_news_header_category_item_more:not(.inited)').each(function() {
            "use strict";
            jQuery(this)
                .addClass('inited')
                .on('click', function(e) {
                    "use strict";
                    jQuery(this).toggleClass('opened').find('.sc_recent_news_header_more_categories').slideToggle();
                    e.preventDefault();
                    return false;
                });
        });
    }

    // Search form
    if (container.find('.search_wrap:not(.inited)').length > 0) {
        container.find('.search_wrap:not(.inited)').each(function() {
            "use strict";
            
            jQuery(this)
                .addClass('inited')
                .on('click', '.search_submit', function(e) {
                    "use strict";
                    var search_wrap = jQuery(this).parents('.search_wrap');
                    if (!search_wrap.hasClass('search_state_fixed')) {
                        if (search_wrap.hasClass('search_state_opened')) {
                            if (search_wrap.find('.search_field').val() != '')
                                search_wrap.find('form').get(0).submit();
                            else
                                search_wrap.removeClass('search_state_opened').addClass('search_state_closed').find('.search_results').fadeOut();
                        } else
                            search_wrap.removeClass('search_state_closed').addClass('search_state_opened').find('.search_field').get(0).focus();
                    } else {
                        if (search_wrap.find('.search_field').val() != '')
                            search_wrap.find('form').get(0).submit();
                        else {
                            search_wrap.find('.search_field').val('');
                            search_wrap.find('.search_results').fadeOut();
                        }
                    }
                    e.preventDefault();
                    return false;
                })
                .on('click', '.search_close', function(e) {
                    "use strict";
                    jQuery(this).parents('.search_wrap').removeClass('search_state_opened').addClass('search_state_closed').find('.search_results').fadeOut();
                    e.preventDefault();
                    return false;
                })
                .on('click', '.search_results_close', function(e) {
                    "use strict";
                    jQuery(this).parent().fadeOut();
                    e.preventDefault();
                    return false;
                })
                .on('click', '.search_more', function(e) {
                    "use strict";
                    if (jQuery(this).parents('.search_wrap').find('.search_field').val() != '')
                        jQuery(this).parents('.search_wrap').find('form').get(0).submit();
                    e.preventDefault();
                    return false;
                })
                .on('blur', '.search_field', function(e) {
                    if (jQuery(this).val() == '' && !jQuery(this).parents('.search_wrap').hasClass('search_state_fixed'))
                        jQuery(this).parents('.search_wrap').removeClass('search_state_opened').addClass('search_state_closed').find('.search_results').fadeOut();
                });

            if (jQuery(this).hasClass('search_ajax')) {
                var ajax_timer = null;
                jQuery(this).find('.search_field').keyup(function(e) {
                    "use strict";
                    var search_field = jQuery(this);
                    var s = search_field.val();
                    if (ajax_timer) {
                        clearTimeout(ajax_timer);
                        ajax_timer = null;
                    }
                    if (s.length >= MICRO_OFFICE_STORAGE['ajax_search_min_length']) {
                        ajax_timer = setTimeout(function() {
                            "use strict";
                            jQuery.post(MICRO_OFFICE_STORAGE['ajax_url'], {
                                action: 'ajax_search',
                                nonce: MICRO_OFFICE_STORAGE['ajax_nonce'],
                                text: s
                            }).done(function(response) {
                                "use strict";
                                clearTimeout(ajax_timer);
                                ajax_timer = null;
                                var rez = {};
                                try {
                                    rez = JSON.parse(response);
                                } catch (e) {
                                    rez = {
                                        error: MICRO_OFFICE_STORAGE['ajax_error']
                                    };
                                    console.log(response);
                                }
                                if (rez.error === '') {
                                    search_field.parents('.search_ajax').find('.search_results_content').empty().append(rez.data);
                                    search_field.parents('.search_ajax').find('.search_results').fadeIn();
                                } else {
                                    micro_office_message_warning(MICRO_OFFICE_STORAGE['strings']['search_error']);
                                }
                            });
                        }, MICRO_OFFICE_STORAGE['ajax_search_delay']);
                    }
                });
            }
        });
    }


    // Section Pan init
    if (container.find('.sc_pan:not(.inited_pan)').length > 0) {
        container.find('.sc_pan:not(.inited_pan)')
            .each(function() {
                "use strict";
                if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
                var pan = jQuery(this).addClass('inited_pan');
                var cont = pan.parent();
                cont.mousemove(function(e) {
                    "use strict";
                    var anim = {};
                    var tm = 0;
                    var pw = pan.width(),
                        ph = pan.height();
                    var cw = cont.width(),
                        ch = cont.height();
                    var coff = cont.offset();
                    if (pan.hasClass('sc_pan_vertical'))
                        pan.css('top', -Math.floor((e.pageY - coff.top) / ch * (ph - ch)));
                    if (pan.hasClass('sc_pan_horizontal'))
                        pan.css('left', -Math.floor((e.pageX - coff.left) / cw * (pw - cw)));
                });
                cont.mouseout(function(e) {
                    "use strict";
                    pan.css({
                        'left': 0,
                        'top': 0
                    });
                });
            });
    }

    // Scroll
    if (container.find('.sc_scroll:not(.inited)').length > 0) {
        container.find('.sc_scroll:not(.inited)')
            .each(function() {
                "use strict";
                
                if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
                MICRO_OFFICE_STORAGE['scroll_init_counter'] = 0;
                micro_office_sc_init_scroll_area(jQuery(this));
            });
    }


    // Swiper Slider
    if (container.find('.sc_slider_swiper:not(.inited)').length > 0) {
        container.find('.sc_slider_swiper:not(.inited)')
            .each(function() {
                "use strict";
                
                if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
                //if (jQuery(this).parents('.isotope_wrap:not(.inited)').length > 0) return;
                jQuery(this).addClass('inited');
                micro_office_sc_slider_autoheight(jQuery(this));
                if (jQuery(this).parents('.sc_slider_pagination_area').length > 0) {
                    jQuery(this).parents('.sc_slider_pagination_area').find('.sc_slider_pagination .post_item').eq(0).addClass('active');
                }
                var id = jQuery(this).attr('id');
                if (id == undefined) {
                    id = 'swiper_' + Math.random();
                    id = id.replace('.', '');
                    jQuery(this).attr('id', id);
                }
                jQuery(this).addClass(id);
                jQuery(this).find('.slides .swiper-slide').css('position', 'relative');
                var width = jQuery(this).width();
                if (width == 0) width = jQuery(this).parent().width();
                var spv = jQuery(this).data('slides-per-view');
                if (spv == undefined) spv = 1;
                var min_width = jQuery(this).data('slides-min-width');
                if (min_width == undefined) min_width = 50;
                if (width / spv < min_width) spv = Math.max(1, Math.floor(width / min_width));
                var space = jQuery(this).data('slides-space');
                if (space == undefined) space = 0;
                if (MICRO_OFFICE_STORAGE['swipers'] === undefined) MICRO_OFFICE_STORAGE['swipers'] = {};
                MICRO_OFFICE_STORAGE['swipers'][id] = new Swiper('.' + id, {
                    calculateHeight: !jQuery(this).hasClass('sc_slider_height_fixed'),
                    resizeReInit: true,
                    autoResize: true,
                    loop: true,
                    grabCursor: true,
                    nextButton: jQuery(this).hasClass('sc_slider_controls') ? '#' + id + ' .sc_slider_next' : false,
                    prevButton: jQuery(this).hasClass('sc_slider_controls') ? '#' + id + ' .sc_slider_prev' : false,
                    pagination: jQuery(this).hasClass('sc_slider_pagination') ? '#' + id + ' .sc_slider_pagination_wrap' : false,
                    paginationClickable: true,
                    autoplay: jQuery(this).hasClass('sc_slider_noautoplay') ? false : (isNaN(jQuery(this).data('interval')) ? 7000 : jQuery(this).data('interval')),
                    autoplayDisableOnInteraction: false,
                    initialSlide: 0,
                    slidesPerView: spv,
                    loopedSlides: spv,
                    spaceBetween: space,
                    speed: 600,
                    // Autoheight on start
                    onFirstInit: function(slider) {
                        "use strict";
                        var cont = jQuery(slider.container);
                        if (!cont.hasClass('sc_slider_height_auto')) return;
                        var li = cont.find('.swiper-slide').eq(1);
                        var h = li.data('height_auto');
                        if (h > 0) {
                            var pt = parseInt(li.css('paddingTop'), 10),
                                pb = parseInt(li.css('paddingBottom'), 10);
                            li.height(h);
                            cont.height(h + (isNaN(pt) ? 0 : pt) + (isNaN(pb) ? 0 : pb));
                            cont.find('.swiper-wrapper').height(h + (isNaN(pt) ? 0 : pt) + (isNaN(pb) ? 0 : pb));
                        }
                    },
                    // Autoheight on slide change
                    onSlideChangeStart: function(slider) {
                        "use strict";
                        var cont = jQuery(slider.container);
                        if (!cont.hasClass('sc_slider_height_auto')) return;
                        var idx = slider.activeIndex;
                        var li = cont.find('.swiper-slide').eq(idx);
                        var h = li.data('height_auto');
                        if (h > 0) {
                            var pt = parseInt(li.css('paddingTop'), 10),
                                pb = parseInt(li.css('paddingBottom'), 10);
                            li.height(h);
                            cont.height(h + (isNaN(pt) ? 0 : pt) + (isNaN(pb) ? 0 : pb));
                            cont.find('.swiper-wrapper').height(h + (isNaN(pt) ? 0 : pt) + (isNaN(pb) ? 0 : pb));
                        }
                    },
                    // Change current item in 'full' or 'over' pagination wrap
                    onSlideChangeEnd: function(slider, dir) {
                        "use strict";
                        var cont = jQuery(slider.container);
                        if (cont.parents('.sc_slider_pagination_area').length > 0) {
                            var li = cont.parents('.sc_slider_pagination_area').find('.sc_slider_pagination .post_item');
                            var idx = slider.activeIndex > li.length ? 0 : slider.activeIndex - 1;
                            micro_office_sc_change_active_pagination_in_slider(cont, idx);
                        }
                    }
                });

                jQuery(this).data('settings', {
                    mode: 'horizontal'
                }); // VC hook

                var curSlide = jQuery(this).find('.slides').data('current-slide');
                if (curSlide > 0)
                    MICRO_OFFICE_STORAGE['swipers'][id].slideTo(curSlide - 1);

                micro_office_sc_prepare_slider_navi(jQuery(this));

            });

        // Check slides per view
        micro_office_sc_sliders_resize();
    }

    //Islands init
    if (container.find('.sc_islands_item:not(.inited)').length > 0) {
        micro_office_init_islands(container);
        jQuery(window).scroll(function() {
            micro_office_init_islands(container);
        });

        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 1000);
    }

    //Skills init
    if (container.find('.sc_skills_item:not(.inited)').length > 0) {
        micro_office_sc_init_skills(container);
        jQuery(window).scroll(function() {
            micro_office_sc_init_skills(container);
        });

        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 1000);
    }
    //Skills type='arc' init
    if (container.find('.sc_skills_arc:not(.inited)').length > 0) {
        micro_office_sc_init_skills_arc(container);
        jQuery(window).scroll(function() {
            micro_office_sc_init_skills_arc(container);
        });


        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 1000);
    }

    // Tabs
    if (container.find('.sc_tabs:not(.inited):not(.no_jquery_ui),.tabs_area:not(.inited)').length > 0) {
        container.find('.sc_tabs:not(.inited):not(.no_jquery_ui),.tabs_area:not(.inited)').each(function() {
            "use strict";
            var init = jQuery(this).data('active');
            if (isNaN(init)) init = 0;
            else init = Math.max(0, init);
            jQuery(this)
                .addClass('inited')
                .tabs({
                    active: init,
                    show: {
                        effect: 'fadeIn',
                        duration: 300
                    },
                    hide: {
                        effect: 'fadeOut',
                        duration: 300
                    },
                    create: function(event, ui) {
                        "use strict";
                        micro_office_sc_init(ui.panel);
                        if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(ui.panel);
                    },
                    activate: function(event, ui) {
                        "use strict";
                        micro_office_sc_init(ui.newPanel);
                        if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(ui.newPanel);
                    }
                });
        });
    }
    if (container.find('.sc_tabs.no_jquery_ui:not(.inited)').length > 0) {
        container.find('.sc_tabs.no_jquery_ui:not(.inited)').each(function() {
            "use strict";
            jQuery(this)
                .addClass('inited')
                .on('click', '.sc_tabs_titles li a', function(e) {
                    "use strict";
                    if (!jQuery(this).parent().hasClass('sc_tabs_active')) {
                        var id_act = jQuery(this).parent().siblings('.sc_tabs_active').find('a').attr('href');
                        var id = jQuery(this).attr('href');
                        jQuery(this).parent().addClass('sc_tabs_active').siblings().removeClass('sc_tabs_active');
                        jQuery(id_act).fadeOut(function() {
                            "use strict";
                            jQuery(id).fadeIn(function() {
                                "use strict";
                                micro_office_sc_init(jQuery(this));
                                if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(jQuery(this));
                            });
                        });
                    }
                    e.preventDefault();
                    return false;
                });
            jQuery(this).find('.sc_tabs_titles li').eq(0).addClass('sc_tabs_active');
            jQuery(this).find('.sc_tabs_content').eq(0).fadeIn(function() {
                "use strict";
                micro_office_sc_init(jQuery(this));
                if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(jQuery(this));
            });
        });
    }

    // Toggles
    if (container.find('.sc_toggles .sc_toggles_title:not(.inited)').length > 0) {
        container.find('.sc_toggles .sc_toggles_title:not(.inited)')
            .addClass('inited')
            .on('click', function() {
                "use strict";
                jQuery(this).toggleClass('ui-state-active').parent().toggleClass('sc_active');
                jQuery(this).parent().find('.sc_toggles_content').slideToggle(300, function() {
                    "use strict";
                    micro_office_sc_init(jQuery(this).parent().find('.sc_toggles_content'));
                    if (window.micro_office_init_hidden_elements) micro_office_init_hidden_elements(jQuery(this).parent().find('.sc_toggles_content'));
                });
            });
    }

    //Zoom
    if (container.find('.sc_zoom:not(.inited)').length > 0) {
        container.find('.sc_zoom:not(.inited)')
            .each(function() {
                "use strict";
                if (jQuery(this).parents('div:hidden,article:hidden').length > 0) return;
                jQuery(this).addClass('inited');
                jQuery(this).find('img').elevateZoom({
                    zoomType: "lens",
                    lensShape: "round",
                    lensSize: 200,
                    lensBorderSize: 4,
                    lensBorderColour: '#ccc'
                });
            });
    }

    //chart init
    if (jQuery('.sc_chart_diagram:not(.inited)').length > 0) {
        chart_diagram_init(container);
        jQuery(window).scroll(function() {
            chart_diagram_init(container);
        });


        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 1000);
    }

    //icons skills
    if (jQuery('.sc_icons_skills:not(.inited)').length > 0) {
        iconsSkillsInit(container);
        jQuery(window).scroll(function() {
            iconsSkillsInit(container);
        });


        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 1000);
    }

    //icons skills
    if (jQuery('.sc_graph').length > 0) {
        setTimeout(function() {
            "use strict";
            var height = jQuery('.page_content_wrap .content_wrap').outerHeight();
            jQuery('.sidebar_outer, .menu_main_wrap').height(height);
        }, 3000);
    }
}

// Scrolled areas
function micro_office_sc_init_scroll_area(obj) {
    "use strict";
    
    // Wait for images loading
    if (!micro_office_check_images_complete(obj) && MICRO_OFFICE_STORAGE['scroll_init_counter'] ++ < 30) {
        setTimeout(function() {
            micro_office_sc_init_scroll_area(obj);
        }, 200);
        return;
    }

    // Start init scroll area
    obj.addClass('inited');

    var id = obj.attr('id');
    if (id == undefined) {
        id = 'scroll_' + Math.random();
        id = id.replace('.', '');
        obj.attr('id', id);
    }
    obj.addClass(id);

    var parent_obj = obj.parent();
    var parent_id = parent_obj.attr('id');
    if (parent_id == undefined) {
        parent_id = 'scroll_wrap_' + Math.random();
        parent_id = parent_id.replace('.', '');
        parent_obj.attr('id', parent_id);
    }
    parent_obj.addClass(parent_id);

    var bar = obj.find('#' + id + '_bar');
    if (bar.length > 0 && !bar.hasClass(id + '_bar')) {
        bar.addClass(id + '_bar');
    }

    // Correct wrapper width (if scroll dir = horizontal)
    if (obj.hasClass('sc_scroll_horizontal')) {
        obj.find('.sc_scroll_wrapper > .sc_scroll_slide').css('width', 'auto');
        obj.find('.sc_scroll_wrapper').css('width', obj.find('.sc_scroll_wrapper > .sc_scroll_slide').width() + 10);
        obj.find('.sc_scroll_wrapper > .sc_scroll_slide').css('width', '100%')
    }

    // Init Swiper with scroll plugin
    if (MICRO_OFFICE_STORAGE['swipers'] === undefined) MICRO_OFFICE_STORAGE['swipers'] = {};
    MICRO_OFFICE_STORAGE['swipers'][id] = new Swiper('.' + id, {
        calculateHeight: false,
        resizeReInit: true,
        autoResize: true,
        freeMode: true,
        freeModeFluid: true,
        grabCursor: true,
        mode: obj.hasClass('sc_scroll_vertical') ? 'vertical' : 'horizontal',
        direction: obj.hasClass('sc_scroll_vertical') ? 'vertical' : 'horizontal',
        slidesPerView: obj.hasClass('sc_scroll') ? 'auto' : 1,
        nextButton: parent_obj.hasClass('sc_scroll_controls') ? '#' + parent_id + ' .sc_scroll_next' : false,
        prevButton: parent_obj.hasClass('sc_scroll_controls') ? '#' + parent_id + ' .sc_scroll_prev' : false,
        scrollbar: '.' + id + '_bar',
        scrollbarHide: true,
    })

    // VC hook
    obj.data('settings', {
        mode: 'horizontal'
    });
}

// Slider navigation
function micro_office_sc_prepare_slider_navi(slider) {
    "use strict";
    var navi = null;
    
    // Prev / Next
    // Remove condition in the line below if you need add click handler to next/prev buttons
    if (false) {
        navi = slider.find('> .sc_slider_controls_wrap, > .sc_scroll_controls_wrap');
        if (navi.length == 0) navi = slider.siblings('.sc_slider_controls_wrap,.sc_scroll_controls_wrap');
        if (navi.length > 0) {
            navi.on('click', '.sc_slider_prev,.sc_scroll_prev', function(e) {
                    "use strict";
                    var swiper = jQuery(this).parents('.swiper-slider-container');
                    if (swiper.length == 0) swiper = jQuery(this).parents('.sc_slider_controls_wrap,.sc_scroll_controls_wrap').siblings('.swiper-slider-container');
                    var id = swiper.attr('id');
                    MICRO_OFFICE_STORAGE['swipers'][id].slidePrev();
                    e.preventDefault();
                    return false;
                })
                .on('click', '.sc_slider_next,.sc_scroll_next', function(e) {
                    "use strict";
                    var swiper = jQuery(this).parents('.swiper-slider-container');
                    if (swiper.length == 0) swiper = jQuery(this).parents('.sc_slider_controls_wrap,.sc_scroll_controls_wrap').siblings('.swiper-slider-container');
                    var id = swiper.attr('id');
                    MICRO_OFFICE_STORAGE['swipers'][id].slideNext();
                    e.preventDefault();
                    return false;
                });
        }
    }

    // Pagination with slide's title
    navi = slider.siblings('.sc_slider_pagination');
    if (navi.length > 0) {
        navi.on('click', '.post_item', function(e) {
            "use strict";
            var swiper = jQuery(this).parents('.sc_slider_pagination_area').find('.swiper-slider-container');
            var id = swiper.attr('id');
            MICRO_OFFICE_STORAGE['swipers'][id].slideTo(jQuery(this).index() + 1);
            e.preventDefault();
            return false;
        });
    }
}

// Sliders: Pagination
function micro_office_sc_change_active_pagination_in_slider(slider, idx) {
    "use strict";
    var pg = slider.parents('.sc_slider_pagination_area').find('.sc_slider_pagination');
    if (pg.length == 0) return;
    pg.find('.post_item').removeClass('active').eq(idx).addClass('active');
    var h = pg.height();
    var off = pg.find('.active').offset().top - pg.offset().top;
    var off2 = pg.find('.sc_scroll_wrapper').offset().top - pg.offset().top;
    var h2 = pg.find('.active').height();
    if (off < 0) {
        pg.find('.sc_scroll_wrapper').css({
            'transform': 'translate3d(0px, 0px, 0px)',
            'transition-duration': '0.3s'
        });
    } else if (h <= off + h2) {
        pg.find('.sc_scroll_wrapper').css({
            'transform': 'translate3d(0px, -' + (Math.abs(off2) + off - h / 4) + 'px, 0px)',
            'transition-duration': '0.3s'
        });
    }
}

// Sliders: Autoheight
function micro_office_sc_slider_autoheight(slider) {
    "use strict";
    if (slider.hasClass('.sc_slider_height_auto')) {
        slider.find('.swiper-slide').each(function() {
            "use strict";
            if (jQuery(this).data('height_auto') == undefined) {
                jQuery(this).attr('data-height_auto', jQuery(this).height());
            }
        });
    }
}

// Sliders: Resize
function micro_office_sc_sliders_resize() {
    "use strict";
    var slider = arguments[0] !== undefined ? arguments[0] : '.sc_slider_swiper.inited';
    var resize = arguments[1] !== undefined ? arguments[1] : true;
    jQuery(slider).each(function() {
        "use strict";
        var id = jQuery(this).attr('id');
        jQuery(this).width(0);
        var width = jQuery(this).parent().width();
        jQuery(this).width(width);
        var last_width = jQuery(this).data('last-width');
        if (isNaN(last_width)) last_width = 0;

        // Change slides_per_view
        if (last_width == 0 || last_width != width) {
            var spv = jQuery(this).data('slides-per-view');
            if (spv == undefined) spv = 1;
            var min_width = jQuery(this).data('slides-min-width');
            if (min_width == undefined) min_width = 50;
            if (width / spv < min_width) spv = Math.max(1, Math.floor(width / min_width));
            jQuery(this).data('last-width', width);
            if (MICRO_OFFICE_STORAGE['swipers'][id].params.slidesPerView != spv) {
                MICRO_OFFICE_STORAGE['swipers'][id].params.slidesPerView = spv;
                MICRO_OFFICE_STORAGE['swipers'][id].params.loopedSlides = spv;
                //MICRO_OFFICE_STORAGE['swipers'][id].reInit();
            }
            MICRO_OFFICE_STORAGE['swipers'][id].onResize();
        }

        // Resize slider
        if (resize && !jQuery(this).hasClass('sc_slider_height_fixed')) {
            var h = 0;
            if (jQuery(this).find('.swiper-slide > img').length > 0) {
                jQuery(this).find('.swiper-slide > img').each(function() {
                    "use strict";
                    if (jQuery(this).height() > h) h = jQuery(this).height();
                });
                jQuery(this).height(h);
            } else if (jQuery(this).find('.swiper-slide').css('backgroundImage') != 'none') {
                h = Math.floor(width / 16 * 9);
                jQuery(this).height(h).find('.swiper-slide').height(h);
                //alert(width);
            }
        }
    });

    // Resize slider pagination area
    jQuery('.sc_slider_pagination_area').each(function() {
        "use strict";
        var h = jQuery(this).find('.sc_slider').height();
        if (h) {
            jQuery(this).height(h);
            jQuery(this).find('.sc_slider_pagination').height(h);
            jQuery(this).find('.sc_slider_pagination .sc_scroll_vertical').height(h);
        }
    });
}

// Equal height for items in the row
function micro_office_sc_equal_height() {
    "use strict";
    jQuery('[data-equal-height]').each(function() {
        "use strict";
        var eh_wrap = jQuery(this);
        var eh_items_selector = eh_wrap.data('equal-height');
        if (eh_items_selector) {
            var max_h = 0;
            var items = [];
            var row_y = 0;
            var i = 0;
            eh_wrap.find(eh_items_selector).each(function() {
                "use strict";
                var el = jQuery(this);
                el.height('auto');
                var el_height = el.height();
                var el_offset = el.offset().top;
                if (row_y == 0) row_y = el_offset;
                if (row_y < el_offset) {
                    if (items.length > 0) {
                        if (max_h > 0) {
                            for (i = 0; i < items.length; i++)
                                items[i].height(max_h);
                        }
                        items = [];
                        max_h = 0;
                    }
                    row_y = el_offset;
                }
                if (el_height > max_h) max_h = el_height;
                items.push(el);
            });
            if (items.length > 0 && max_h > 0) {
                for (i = 0; i < items.length; i++)
                    items[i].height(max_h);
            }
        }
    });
}

// Islands init
function micro_office_init_islands(container) {
    "use strict";
    if (arguments.length == 0) var container = jQuery('body');
    var scrollPosition = jQuery(window).scrollTop() + jQuery(window).height();

    container.find('.sc_islands_item:not(.inited)').each(function() {
        var skillsItem = jQuery(this);
        var scrollSkills = skillsItem.offset().top;
        if (scrollPosition > scrollSkills) {
            skillsItem.addClass('inited');
        }
    });
}

// Skills init
function micro_office_sc_init_skills(container) {
    "use strict";
    if (arguments.length == 0) var container = jQuery('body');
    var scrollPosition = jQuery(window).scrollTop() + jQuery(window).height();

    container.find('.sc_skills_item:not(.inited)').each(function() {
        "use strict";
        var skillsItem = jQuery(this);
        var scrollSkills = skillsItem.offset().top;
        if (scrollPosition > scrollSkills) {
            skillsItem.addClass('inited');
            var skills = skillsItem.parents('.sc_skills').eq(0);
            var type = skills.data('type');
            var total = (type == 'pie' && skills.hasClass('sc_skills_compact_on')) ? skillsItem.find('.sc_skills_data .pie') : skillsItem.find('.sc_skills_total').eq(0);
            var start = parseInt(total.data('start'), 10);
            var stop = parseInt(total.data('stop'), 10);
            var maximum = parseInt(total.data('max'), 10);
            var startPercent = Math.round(start / maximum * 100);
            var stopPercent = Math.round(stop / maximum * 100);
            var ed = total.data('ed');
            var duration = parseInt(total.data('duration'), 10);
            var speed = parseInt(total.data('speed'), 10);
            var step = parseInt(total.data('step'), 10);
            if (type == 'bar') {
                var dir = skills.data('dir');
                var count = skillsItem.find('.sc_skills_count').eq(0);
                if (dir == 'horizontal')
                    count.css('width', startPercent + '%').animate({
                        width: stopPercent + '%'
                    }, duration);
                else if (dir == 'vertical')
                    count.css('height', startPercent + '%').animate({
                        height: stopPercent + '%'
                    }, duration);
                micro_office_sc_animate_skills_counter(start, stop, speed - (dir != 'unknown' ? 5 : 0), step, ed, total);
            } else if (type == 'counter') {
                micro_office_sc_animate_skills_counter(start, stop, speed - 5, step, ed, total);
            } else if (type == 'pie') {
                var steps = parseInt(total.data('steps'), 10);
                var bg_color = total.data('bg_color');
                var border_color = total.data('border_color');
                var cutout = parseInt(total.data('cutout'), 10);
                var easing = total.data('easing');
                var options = {
                    segmentShowStroke: true,
                    segmentStrokeColor: border_color,
                    segmentStrokeWidth: 2,
                    percentageInnerCutout: cutout,
                    animationSteps: steps,
                    animationEasing: easing,
                    animateRotate: true,
                    animateScale: false,
                };
                var pieData = [];
                total.each(function() {
                    "use strict";
                    var color = jQuery(this).data('color');
                    var stop = parseInt(jQuery(this).data('stop'), 10);
                    var stopPercent = Math.round(stop / maximum * 100);
                    pieData.push({
                        value: stopPercent,
                        color: color
                    });
                });
                if (total.length == 1) {
                    micro_office_sc_animate_skills_counter(start, stop, Math.round(1500 / steps), step, ed, total);
                    pieData.push({
                        value: 100 - stopPercent,
                        color: bg_color
                    });
                }
                var canvas = skillsItem.find('canvas');
                canvas.attr({
                    width: skillsItem.width(),
                    height: skillsItem.width()
                }).css({
                    width: skillsItem.width(),
                    height: skillsItem.height()
                });
                new Chart(canvas.get(0).getContext("2d")).Doughnut(pieData, options);
            }
        }
    });
}

// Skills counter animation
function micro_office_sc_animate_skills_counter(start, stop, speed, step, ed, total) {
    "use strict";
    start = Math.min(stop, start + step);
    total.text(start + ed);
    if (start < stop) {
        setTimeout(function() {
            "use strict";
            micro_office_sc_animate_skills_counter(start, stop, speed, step, ed, total);
        }, speed);
    }
}

// Skills arc init
function micro_office_sc_init_skills_arc(container) {
    "use strict";
    if (arguments.length == 0) var container = jQuery('body');
    container.find('.sc_skills_arc:not(.inited)').each(function() {
        "use strict";
        
        var arc = jQuery(this);
        arc.addClass('inited');
        var items = arc.find('.sc_skills_data .arc');
        var canvas = arc.find('.sc_skills_arc_canvas').eq(0);
        var legend = arc.find('.sc_skills_legend').eq(0);
        var w = Math.round(arc.width() - legend.width());
        var c = Math.floor(w / 2);
        var o = {
            random: function(l, u) {
                "use strict";
                return Math.floor((Math.random() * (u - l + 1)) + l);
            },
            diagram: function() {
                "use strict";
                var r = Raphael(canvas.attr('id'), w, w),
                    hover = Math.round(w / 2 / items.length),
                    rad = hover,
                    step = Math.round(((w - 20) / 2 - rad) / items.length),
                    stroke = Math.round(w / 9 / items.length),
                    speed = 400;


                r.circle(c, c, Math.round(w / 2)).attr({
                    stroke: 'none',
                    fill: MICRO_OFFICE_STORAGE['theme_bg_color'] ? MICRO_OFFICE_STORAGE['theme_bg_color'] : '#ffffff'
                });

                var title = r.text(c, c, arc.data('caption')).attr({
                    font: Math.round(rad * 0.75) + 'px "' + MICRO_OFFICE_STORAGE['theme_font'] + '"',
                    fill: MICRO_OFFICE_STORAGE['theme_color'] ? MICRO_OFFICE_STORAGE['theme_color'] : '#909090'
                }).toFront();

                rad -= Math.round(step / 2);

                r.customAttributes.arc = function(value, color, rad) {
                    "use strict";
                    var v = 3.6 * value,
                        alpha = v == 360 ? 359.99 : v,
                        rand = o.random(91, 240),
                        a = (rand - alpha) * Math.PI / 180,
                        b = rand * Math.PI / 180,
                        sx = c + rad * Math.cos(b),
                        sy = c - rad * Math.sin(b),
                        x = c + rad * Math.cos(a),
                        y = c - rad * Math.sin(a),
                        path = [
                            ['M', sx, sy],
                            ['A', rad, rad, 0, +(alpha > 180), 1, x, y]
                        ];
                    return {
                        path: path,
                        stroke: color
                    }
                }

                items.each(function(i) {
                    "use strict";
                    var t = jQuery(this),
                        color = t.find('.color').val(),
                        value = t.find('.percent').val(),
                        text = t.find('.text').text();

                    rad += step;
                    var z = r.path().attr({
                        arc: [value, color, rad],
                        'stroke-width': stroke
                    });

                    z.mouseover(function() {
                        "use strict";
                        this.animate({
                            'stroke-width': hover,
                            opacity: .75
                        }, 1000, 'elastic');
                        if (Raphael.type != 'VML') //solves IE problem
                            this.toFront();
                        title.stop().animate({
                            opacity: 0
                        }, speed, '>', function() {
                            "use strict";
                            this.attr({
                                text: (text ? text + '\n' : '') + value + '%'
                            }).animate({
                                opacity: 1
                            }, speed, '<');
                        });
                    }).mouseout(function() {
                        "use strict";
                        this.stop().animate({
                            'stroke-width': stroke,
                            opacity: 1
                        }, speed * 4, 'elastic');
                        title.stop().animate({
                            opacity: 0
                        }, speed, '>', function() {
                            "use strict";
                            title.attr({
                                text: arc.data('caption')
                            }).animate({
                                opacity: 1
                            }, speed, '<');
                        });
                    });

                });

            }
        }
        o.diagram();
    });
}

// Countdown update
function micro_office_countdown(dt) {
    "use strict";
    var counter = jQuery(this).parent();
    for (var i = 3; i < dt.length; i++) {
        var v = (dt[i] < 10 ? '0' : '') + dt[i];
        counter.find('.sc_countdown_item').eq(i - 3).find('.sc_countdown_digits span').addClass('hide');
        for (var ch = v.length - 1; ch >= 0; ch--) {
            counter.find('.sc_countdown_item').eq(i - 3).find('.sc_countdown_digits span').eq(ch + (i == 3 && v.length < 3 ? 1 : 0)).removeClass('hide').text(v.substr(ch, 1));
        }
    }
}

// Contact form handlers
function micro_office_sc_form_validate(form) {
    "use strict";
    
    var url = form.attr('action');
    if (url == '') return false;
    form.find('input').removeClass('error_fields_class');
    var error = false;
    var form_custom = form.data('formtype') == 'form_custom';
    if (!form_custom) {

        var rules = [],
            rule = {};

        if (form.find('[name="username"]').length > 0) {
            rule = {
                field: "username",
                max_length: {
                    value: 60,
                    message: MICRO_OFFICE_STORAGE['strings']['name_long']
                }
            };
            if (form.find('[name="username"][aria-required="true"]').length > 0)
                rule['min_length'] = {
                    value: 1,
                    message: MICRO_OFFICE_STORAGE['strings']['name_empty']
                };
            rules.push(rule);
        }

        if (form.find('[name="email"]').length > 0) {
            rule = {
                field: "email",
                max_length: {
                    value: 60,
                    message: MICRO_OFFICE_STORAGE['strings']['email_long']
                },
                mask: {
                    value: MICRO_OFFICE_STORAGE['email_mask'],
                    message: MICRO_OFFICE_STORAGE['strings']['email_not_valid']
                }
            };
            if (form.find('[name="email"][aria-required="true"]').length > 0)
                rule['min_length'] = {
                    value: 7,
                    message: MICRO_OFFICE_STORAGE['strings']['email_empty']
                };
            rules.push(rule);
        }

        if (form.find('[name="subject"]').length > 0) {
            rule = {
                field: "subject",
                max_length: {
                    value: 100,
                    message: MICRO_OFFICE_STORAGE['strings']['subject_long']
                }
            };
            if (form.find('[name="subject"][aria-required="true"]').length > 0)
                rule['min_length'] = {
                    value: 1,
                    message: MICRO_OFFICE_STORAGE['strings']['subject_empty']
                };
            rules.push(rule);
        }

        if (form.find('[name="message"]').length > 0) {
            rule = {
                field: "message",
                max_length: {
                    value: MICRO_OFFICE_STORAGE['contacts_maxlength'],
                    message: MICRO_OFFICE_STORAGE['strings']['text_long']
                }
            };
            if (form.find('[name="message"][aria-required="true"]').length > 0)
                rule['min_length'] = {
                    value: 1,
                    message: MICRO_OFFICE_STORAGE['strings']['text_empty']
                };
            rules.push(rule);
        }

        error = micro_office_form_validate(form, {
            error_message_show: true,
            error_message_time: 4000,
            error_message_class: "sc_infobox sc_infobox_style_error",
            error_fields_class: "error_fields_class",
            exit_after_first_error: false,
            rules: rules
        });
    }
    if (!error && url != '#') {
        jQuery.post(url, {
            action: "send_form",
            nonce: MICRO_OFFICE_STORAGE['ajax_nonce'],
            type: form.data('formtype'),
            data: form.serialize()
        }).done(function(response) {
            "use strict";
            var rez = {};
            try {
                rez = JSON.parse(response);
            } catch (e) {
                rez = {
                    error: MICRO_OFFICE_STORAGE['ajax_error']
                };
                console.log(response);
            }
            var result = form.find(".result").toggleClass("sc_infobox_style_error", false).toggleClass("sc_infobox_style_success", false);
            if (rez.error === '') {
                form.get(0).reset();
                result.addClass("sc_infobox_style_success").html(MICRO_OFFICE_STORAGE['strings']['send_complete']);
                var return_url = form.find('input[name="return_url"]');
                if (return_url.length > 0 && return_url.val() != '') {
                    setTimeout(function() {
                        "use strict";
                        window.location.href = return_url.val();
                    }, 3300);
                }
            } else {
                result.addClass("sc_infobox_style_error").html(MICRO_OFFICE_STORAGE['strings']['send_error'] + ' ' + rez.error);
            }
            result.fadeIn().delay(3000).fadeOut();
        });
    }
    return !error;
}

// Get players by category
function micro_office_select_players_category(sel) {
    "use strict";
    var value = sel.find(':selected').data('cat');
    var table = sel.parents('.sc_players_table');
    if (value == 'all')
        jQuery(table).find('.sc_table tr:nth-child(n+2)').show();
    else {
        jQuery(table).find('.sc_table tr:nth-child(n+2)').hide();
        jQuery(table).find('.sc_table tr').each(function() {
            var cat = jQuery(this).data('cat');
            if (cat != null && cat.indexOf(value) != -1)
                jQuery(this).show();
        });
    }
}

// Display menuitem in the popup
function micro_office_menuitems_show_popup(obj) {
    "use strict";
    
    // First init vars
    if (typeof MICRO_OFFICE_STORAGE['menuitem_load'] == 'undefined') {
        MICRO_OFFICE_STORAGE['menuitem_load'] = false;
        MICRO_OFFICE_STORAGE['menuitems_list'] = [];

        // If busy - return
    } else if (MICRO_OFFICE_STORAGE['menuitem_load']) {
        return;
    }

    // Show preloader
    jQuery('#page_preloader').data('bg-color', jQuery('#page_preloader').css('background-color')).css({
        display: 'block',
        opacity: 0,
        backgroundColor: 'transparent'
    }).animate({
        opacity: 0.8
    }, 300);

    // Get items list on first click
    if (MICRO_OFFICE_STORAGE['menuitems_list'].length == 0) {
        var menuitems_list_id = obj.parents('.sc_menuitems').attr("id");
        MICRO_OFFICE_STORAGE['menuitems_list'] = MICRO_OFFICE_STORAGE['menuitems'][menuitems_list_id].split(",");
    }

    var menuitem_id = obj.attr('rel');

    MICRO_OFFICE_STORAGE['menuitem_load'] = true;

    jQuery.post(MICRO_OFFICE_STORAGE['ajax_url'], {
        action: 'ajax_menuitem',
        nonce: MICRO_OFFICE_STORAGE['ajax_nonce'],
        text: menuitem_id
    }).done(function(response) {
        "use strict";
        MICRO_OFFICE_STORAGE['menuitem_load'] = false;
        var rez = {};
        try {
            rez = JSON.parse(response);
        } catch (e) {
            rez = {
                error: MICRO_OFFICE_STORAGE['ajax_error'] + '<br>' + response
            };
        }
        jQuery('#page_preloader').animate({
            opacity: 0
        }, 500, function() {
            jQuery(this).css({
                display: 'none',
                backgroundColor: jQuery(this).data('bg-color')
            });
        });
        if (rez.error === '') {
            var delay = 0;
            // Create popup
            if (jQuery('.popup_menuitem').length == 0) {
                jQuery('body').append('<div id="overlay"></div><div class="popup_menuitem"></div>');
                jQuery('#overlay').fadeIn(500);
            } else {
                delay = 500;
                jQuery('.popup_menuitem').fadeOut(delay);
            }
            // Add new content in the popup
            setTimeout(function() {
                "use strict";
                jQuery('.popup_menuitem').html(rez.data);
                jQuery('.popup_menuitem .sc_menuitems_wrap').append("<a class='close_menuitem' href='#'><span class='icon-cancel'></span></a>");
                if (MICRO_OFFICE_STORAGE['menuitems_list'].length > 1) {
                    var idx = 0;
                    for (var i = 0; i < MICRO_OFFICE_STORAGE['menuitems_list'].length; i++) {
                        if (MICRO_OFFICE_STORAGE['menuitems_list'][i] === menuitem_id) {
                            idx = i;
                            break;
                        }
                    }
                    var prev = (idx - 1 + MICRO_OFFICE_STORAGE['menuitems_list'].length) % MICRO_OFFICE_STORAGE['menuitems_list'].length;
                    var next = (idx + 1) % MICRO_OFFICE_STORAGE['menuitems_list'].length;
                    jQuery('.popup_menuitem .sc_menuitems_wrap .sc_menuitem_content').append(
                        "<a class='prev_menuitem prevnext_menuitem show_popup_menuitem' rel='" + MICRO_OFFICE_STORAGE['menuitems_list'][prev] + "'  href='#'><span class='icon-left'></span></a>" + "<a class='next_menuitem prevnext_menuitem show_popup_menuitem' rel='" + MICRO_OFFICE_STORAGE['menuitems_list'][next] + "'  href='#'><span class='icon-right'></span></a>"
                    );
                }
                jQuery('.popup_menuitem').fadeIn(500);
            }, delay);
        } else {
            micro_office_message_warning(MICRO_OFFICE_STORAGE['strings']['search_error']);
        }
    });
}

// Hide popup with menuitem
function micro_office_menuitems_hide_popup() {
    "use strict";
    jQuery('#overlay').fadeOut();
    jQuery('.popup_menuitem').fadeOut(function() {
        "use strict";
        
        MICRO_OFFICE_STORAGE['menuitem_load'] = false;
        MICRO_OFFICE_STORAGE['menuitems_list'] = [];
        jQuery('#overlay').remove();
        jQuery(this).remove();
    });
}

function chart_anim(id, doughnutData) {
    "use strict";
    var chart_flag = false;
    var inner_cutout = 87;
    var id = id;
    var doughnutData = doughnutData;
    var oft = jQuery('#' + id).offset().top;
    var scrt = jQuery(window).scrollTop();
    var hgt = jQuery(window).height();
    if (chart_flag === false) {

        var options = {
            segmentShowStroke: 0,
            percentageInnerCutout: inner_cutout,
            segmentShowStroke: false
        };
        var myDoughnut = new Chart(document.getElementById('canvas_' + id).getContext("2d")).Doughnut(doughnutData, options);
        chart_flag = true;

    }
    chart_flag = false;
}

//chart diagram init
function chart_diagram_init(container) {
    "use strict";
    if (arguments.length == 0) var container = jQuery('body');
    var scrollPosition = jQuery(window).scrollTop() + jQuery(window).height();

    container.find('.sc_chart_diagram:not(.inited)').each(function() {
        "use strict";
        var chart = jQuery(this);
        var scrollSkills = chart.offset().top + 300;
        if (scrollPosition > scrollSkills) {
            chart.addClass('inited');
            var chart_flag = false;
            var chart_invise = false;
            var init_attempts = 0;
            var inner_cutout = 87;

            var parent_width = jQuery(chart).find('.sc_chart_item_canvas').width();
            jQuery(chart).find('.sc_chart_item_canvas canvas').attr('width', parent_width).attr('height', parent_width);
            var marg = jQuery(chart).find('.sc_chart_item_canvas').width() * 0.1171875 / (-2);
            var i = marg;
            var S = 0;


            var sl_width = jQuery(chart).find('canvas').css('width');

            if (jQuery(chart).attr('data-cutout') != '' && jQuery(chart).attr('data-cutout')) {
                inner_cutout = jQuery(chart).attr('data-cutout');
            }

            var Count = -1;
            jQuery(chart).find('.sc_chart_item').each(function() {
                "use strict";
                var dt_percent = jQuery(this).find('canvas').attr('data-percent');
                var dt_color = jQuery(this).find('canvas').attr('data-color');
                var dt_color_1 = jQuery(this).find('canvas').attr('data-darkcolor');

                var WH = 100 - dt_percent;
                var SA = 100 - WH;
                var FR = 0;
                var SC = 0;

                if (dt_percent <= 12) {
                    FR = SA;
                    SA = 0;
                }
                if (dt_percent > 12) {
                    FR = 12;
                    SA = SA - 12;
                }
                if (dt_percent > 62) {
                    SC = SA - 50;
                    SA = 50;
                }

                var doughnutData = [{
                    value: FR, //12
                    color: dt_color_1
                }, {
                    value: SA, //63
                    color: dt_color
                }, {
                    value: SC,
                    color: dt_color_1
                }, {
                    value: WH,
                    color: "transparent"
                }];
                Count++;
                i = i - marg;
                inner_cutout = inner_cutout - Count;

                var id = jQuery(this).attr('id');
                chart_anim(id, doughnutData);
            });

            setTimeout(function() {
                "use strict";
                jQuery(chart).find('.sc_chart_item_value').css('opacity', 1);
            }, 1500);

        }

    });
}

//icons skills
function iconsSkillsInit(container) {
    "use strict";
    if (arguments.length == 0) var container = jQuery('body');
    var scrollPosition = jQuery(window).scrollTop() + jQuery(window).height();

    container.find('.sc_icons_skills:not(.inited)').each(function() {
        "use strict";
        var item = jQuery(this);
        var scrollSkills = item.offset().top + 200;

        if (scrollPosition > scrollSkills) {
            item.addClass('inited');
            var x = jQuery(this).find('.sc_icons_item.active').length;
            var color = jQuery(this).find('.sc_icons_item.active').data('color');
            var i = 1;
            step(jQuery(this), i, x, color);
        }
    });
}

function step(item, i, x, color) {
    "use strict";
    jQuery(item).find('.sc_icons_item.active:nth-child(' + i + ')').css({
        'color': color
    });
    i++;
    if (i <= x) {
        setTimeout(function() {
            step(item, i, x, color);
        }, 200);
    }
}

// Return template messages
function micro_office_get_storage() {
    "use strict";
    var micro_office_storage = {
        "system_message": {
            "message": "",
            "status": "",
            "header": ""
        },
        "theme_font": "Open Sans",
        "theme_color": "#2A3342",
        "theme_bg_color": "#E9E9E9",
        "strings": {
            "ajax_error": "Invalid server answer",
            "bookmark_add": "Add the bookmark",
            "bookmark_added": "Current page has been successfully added to the bookmarks. You can see it in the right panel on the tab &#039;Bookmarks&#039;",
            "bookmark_del": "Delete this bookmark",
            "bookmark_title": "Enter bookmark title",
            "bookmark_exists": "Current page already exists in the bookmarks list",
            "search_error": "Error occurs in AJAX search! Please, type your query and press search icon for the traditional search way.",
            "email_confirm": "On the e-mail address &quot;%s&quot; we sent a confirmation email. Please, open it and click on the link.",
            "reviews_vote": "Thanks for your vote! New average rating is:",
            "reviews_error": "Error saving your vote! Please, try again later.",
            "error_like": "Error saving your like! Please, try again later.",
            "error_global": "Global error text",
            "name_empty": "The name can&#039;t be empty",
            "name_long": "Too long name",
            "email_empty": "Too short (or empty) email address",
            "email_long": "Too long email address",
            "email_not_valid": "Invalid email address",
            "subject_empty": "The subject can&#039;t be empty",
            "subject_long": "Too long subject",
            "text_empty": "The message text can&#039;t be empty",
            "text_long": "Too long message text",
            "send_complete": "Send message complete!",
            "send_error": "Transmit failed!",
            "not_agree": "Please, check &#039;I agree with Terms and Conditions&#039;",
            "login_empty": "The Login field can&#039;t be empty",
            "login_long": "Too long login field",
            "login_success": "Login success! The page will be reloaded in 3 sec.",
            "login_failed": "Login failed!",
            "password_empty": "The password can&#039;t be empty and shorter then 4 characters",
            "password_long": "Too long password",
            "password_not_equal": "The passwords in both fields are not equal",
            "registration_success": "Registration success! Please log in!",
            "registration_failed": "Registration failed!",
            "geocode_error": "Geocode was not successful for the following reason:",
            "googlemap_not_avail": "Google map API not available!",
            "editor_save_success": "Post content saved!",
            "editor_save_error": "Error saving post data!",
            "editor_delete_post": "You really want to delete the current post?",
            "editor_delete_post_header": "Delete post",
            "editor_delete_success": "Post deleted!",
            "editor_delete_error": "Error deleting post!",
            "editor_caption_cancel": "Cancel",
            "editor_caption_close": "Close"
        },
        "ajax_url": "http:\/\/microoffice.themerex.net\/wp-admin\/admin-ajax.php",
        "ajax_nonce": "0ae88bf3ea",
        "site_url": "http:\/\/microoffice.themerex.net",
        "site_protocol": "http",
        "vc_edit_mode": "",
        "accent1_color": "#2A3342",
        "accent1_hover": "#1EBEB4",
        "slider_height": "100",
        "user_logged_in": "",
        "toc_menu": null,
        "toc_menu_home": "",
        "toc_menu_top": "",
        "menu_fixed": "",
        "menu_mobile": "0",
        "menu_hover": "",
        "menu_cache": "",
        "button_hover": "",
        "input_hover": "default",
        "demo_time": "0",
        "media_elements_enabled": "1",
        "ajax_search_enabled": "1",
        "ajax_search_min_length": "3",
        "ajax_search_delay": "200",
        "css_animation": "1",
        "menu_animation_in": "",
        "menu_animation_out": "",
        "popup_engine": "magnific",
        "email_mask": "^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
        "contacts_maxlength": "1000",
        "comments_maxlength": "1000",
        "remember_visitors_settings": "",
        "admin_mode": "",
        "isotope_resize_delta": "0.3",
        "error_message_box": null,
        "viewmore_busy": "",
        "video_resize_inited": "",
        "top_panel_height": "0"
    };
    return micro_office_storage;
}