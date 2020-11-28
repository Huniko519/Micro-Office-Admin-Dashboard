/**
 * Init scripts
 *
 * @package WordPress
 * @subpackage ThemeREX Utilities
 * @since v3.0
 */
jQuery(document).ready(function() {
    "use strict";

    // Login form
    jQuery('.popup_form.login_form').submit(function(e) {
        "use strict";
        var rez = trx_utils_login_validate(jQuery(this));

        if (!rez)
            e.preventDefault();
        return rez;
    });

    // Registration form
    jQuery('.popup_form.registration_form').submit(function(e) {
        "use strict";
        var rez = trx_utils_registration_validate(jQuery(this));
        if (!rez)
            e.preventDefault();
        return rez;
    });

    // Comment form
    jQuery("form#commentform").submit(function(e) {
        "use strict";
        var rez = trx_utils_comments_validate(jQuery(this));
        if (!rez)
            e.preventDefault();
        return rez;
    });

});


// Forms validation
//-------------------------------------------------------
function trx_utils_form_validate(form, opt) {
    "use strict";
    var error_msg = '';
    form.find(":input").each(function() {
        "use strict";
        if (error_msg != '' && opt.exit_after_first_error) return;
        for (var i = 0; i < opt.rules.length; i++) {
            if (jQuery(this).attr("name") == opt.rules[i].field) {
                var val = jQuery(this).val();
                var error = false;
                if (typeof(opt.rules[i].min_length) == 'object') {
                    if (opt.rules[i].min_length.value > 0 && val.length < opt.rules[i].min_length.value) {
                        if (error_msg == '') jQuery(this).get(0).focus();
                        error_msg += '<p class="error_item">' + (typeof(opt.rules[i].min_length.message) != 'undefined' ? opt.rules[i].min_length.message : opt.error_message_text) + '</p>'
                        error = true;
                    }
                }
                if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].max_length) == 'object') {
                    if (opt.rules[i].max_length.value > 0 && val.length > opt.rules[i].max_length.value) {
                        if (error_msg == '') jQuery(this).get(0).focus();
                        error_msg += '<p class="error_item">' + (typeof(opt.rules[i].max_length.message) != 'undefined' ? opt.rules[i].max_length.message : opt.error_message_text) + '</p>'
                        error = true;
                    }
                }
                if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].mask) == 'object') {
                    if (val.length > 0 && opt.rules[i].mask.value != '') {
                        var regexp = new RegExp(opt.rules[i].mask.value);
                        if (!regexp.test(val)) {
                            if (error_msg == '') jQuery(this).get(0).focus();
                            error_msg += '<p class="error_item">' + (typeof(opt.rules[i].mask.message) != 'undefined' ? opt.rules[i].mask.message : opt.error_message_text) + '</p>'
                            error = true;
                        }
                    }
                }
                if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].state) == 'object') {
                    if (opt.rules[i].state.value == 'checked' && !jQuery(this).get(0).checked) {
                        if (error_msg == '') jQuery(this).get(0).focus();
                        error_msg += '<p class="error_item">' + (typeof(opt.rules[i].state.message) != 'undefined' ? opt.rules[i].state.message : opt.error_message_text) + '</p>'
                        error = true;
                    }
                }
                if ((!error || !opt.exit_after_first_error) && typeof(opt.rules[i].equal_to) == 'object') {
                    if (opt.rules[i].equal_to.value != '' && val != jQuery(jQuery(this).get(0).form[opt.rules[i].equal_to.value]).val()) {
                        if (error_msg == '') jQuery(this).get(0).focus();
                        error_msg += '<p class="error_item">' + (typeof(opt.rules[i].equal_to.message) != 'undefined' ? opt.rules[i].equal_to.message : opt.error_message_text) + '</p>'
                        error = true;
                    }
                }
                if (opt.error_fields_class != '') jQuery(this).toggleClass(opt.error_fields_class, error);
            }
        }
    });
    if (error_msg != '' && opt.error_message_show) {
        var error_message_box = form.find(".result");
        if (error_message_box.length == 0) error_message_box = form.parent().find(".result");
        if (error_message_box.length == 0) {
            form.append('<div class="result"></div>');
            error_message_box = form.find(".result");
        }
        if (opt.error_message_class) error_message_box.toggleClass(opt.error_message_class, true);
        error_message_box.html(error_msg).fadeIn();
        setTimeout(function() {
            error_message_box.fadeOut();
        }, opt.error_message_time);
    }
    return error_msg != '';
}


// Comments form
function trx_utils_comments_validate(form) {
    "use strict";
    var TRX_UTILS_STORAGE = {
        "ajax_url": "/",
        "ajax_nonce": "0ae88bf3ea",
        "site_url": "/",
        "user_logged_in": "0",
        "email_mask": "^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
        "msg_ajax_error": "Invalid server answer!",
        "msg_error_global": "Invalid field's value!",
        "msg_name_empty": "The name can't be empty",
        "msg_email_empty": "Too short (or empty) email address",
        "msg_email_not_valid": "E-mail address is invalid",
        "msg_text_empty": "The message text can't be empty",
        "msg_send_complete": "Send message complete!",
        "msg_send_error": "Transmit failed!",
        "login_via_ajax": "1",
        "msg_login_empty": "The Login field can't be empty",
        "msg_login_long": "The Login field is too long",
        "msg_password_empty": "The password can't be empty and shorter then 4 characters",
        "msg_password_long": "The password is too long",
        "msg_login_success": "Login success! The page will be reloaded in 3 sec.",
        "msg_login_error": "Login failed!",
        "msg_not_agree": "Please, read and check 'Terms and Conditions'",
        "msg_email_long": "E-mail address is too long",
        "msg_password_not_equal": "The passwords in both fields are not equal",
        "msg_registration_success": "Registration success! Please log in!",
        "msg_registration_error": "Registration failed!"
    };
    form.find('input').removeClass('error_fields_class');
    var rules = {
        error_message_text: TRX_UTILS_STORAGE['msg_error_global'], // Global error message text (if don't write in checked field)
        error_message_show: true, // Display or not error message
        error_message_time: 4000, // Error message display time
        error_message_class: 'sc_infobox sc_infobox_style_error', // Class appended to error message block
        error_fields_class: 'error_fields_class', // Class appended to error fields
        exit_after_first_error: false, // Cancel validation and exit after first error
        rules: [{
            field: 'comment',
            min_length: {
                value: 1,
                message: TRX_UTILS_STORAGE['msg_text_empty']
            },
            max_length: {
                value: TRX_UTILS_STORAGE['comments_maxlength'],
                message: TRX_UTILS_STORAGE['msg_text_long']
            }
        }]
    };
    if (form.find('.comments_author input[aria-required="true"]').length > 0) {
        rules.rules.push({
            field: 'author',
            min_length: {
                value: 1,
                message: TRX_UTILS_STORAGE['msg_name_empty']
            },
            max_length: {
                value: 60,
                message: TRX_UTILS_STORAGE['msg_name_long']
            }
        });
    }
    if (form.find('.comments_email input[aria-required="true"]').length > 0) {
        rules.rules.push({
            field: 'email',
            min_length: {
                value: 7,
                message: TRX_UTILS_STORAGE['msg_email_empty']
            },
            max_length: {
                value: 60,
                message: TRX_UTILS_STORAGE['msg_email_long']
            },
            mask: {
                value: TRX_UTILS_STORAGE['email_mask'],
                message: TRX_UTILS_STORAGE['msg_email_not_valid']
            }
        });
    }
    var error = trx_utils_form_validate(form, rules);
    return !error;
}


// Login form
function trx_utils_login_validate(form) {
    "use strict";
    var TRX_UTILS_STORAGE = {
        "ajax_url": "/",
        "ajax_nonce": "0ae88bf3ea",
        "site_url": "/",
        "user_logged_in": "0",
        "email_mask": "^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
        "msg_ajax_error": "Invalid server answer!",
        "msg_error_global": "Invalid field's value!",
        "msg_name_empty": "The name can't be empty",
        "msg_email_empty": "Too short (or empty) email address",
        "msg_email_not_valid": "E-mail address is invalid",
        "msg_text_empty": "The message text can't be empty",
        "msg_send_complete": "Send message complete!",
        "msg_send_error": "Transmit failed!",
        "login_via_ajax": "1",
        "msg_login_empty": "The Login field can't be empty",
        "msg_login_long": "The Login field is too long",
        "msg_password_empty": "The password can't be empty and shorter then 4 characters",
        "msg_password_long": "The password is too long",
        "msg_login_success": "Login success! The page will be reloaded in 3 sec.",
        "msg_login_error": "Login failed!",
        "msg_not_agree": "Please, read and check 'Terms and Conditions'",
        "msg_email_long": "E-mail address is too long",
        "msg_password_not_equal": "The passwords in both fields are not equal",
        "msg_registration_success": "Registration success! Please log in!",
        "msg_registration_error": "Registration failed!"
    };
    form.find('input').removeClass('error_fields_class');
    var error = trx_utils_form_validate(form, {
        error_message_show: true,
        error_message_time: 4000,
        error_message_class: 'sc_infobox sc_infobox_style_error',
        error_fields_class: 'error_fields_class',
        exit_after_first_error: true,
        rules: [{
            field: "log",
            min_length: {
                value: 1,
                message: TRX_UTILS_STORAGE['msg_login_empty']
            },
            max_length: {
                value: 60,
                message: TRX_UTILS_STORAGE['msg_login_long']
            }
        }, {
            field: "pwd",
            min_length: {
                value: 4,
                message: TRX_UTILS_STORAGE['msg_password_empty']
            },
            max_length: {
                value: 30,
                message: TRX_UTILS_STORAGE['msg_password_long']
            }
        }]
    });
    if (TRX_UTILS_STORAGE['login_via_ajax'] && !error) {
        jQuery.post(TRX_UTILS_STORAGE['ajax_url'], {
            action: 'trx_utils_login_user',
            nonce: TRX_UTILS_STORAGE['ajax_nonce'],
            remember: form.find('#rememberme').val(),
            user_log: form.find('#log').val(),
            user_pwd: form.find('#password').val()
        }).done(function(response) {
            "use strict";
            var rez = {};
            try {
                rez = JSON.parse(response);
            } catch (e) {
                rez = {
                    error: TRX_UTILS_STORAGE['ajax_error']
                };
                console.log(response);
            }
            var result_box = form.find('.result');
            if (result_box.length == 0) result_box = form.siblings('.result');
            if (result_box.length == 0) result_box = form.after('<div class="result"></div>').next('.result');
            result_box.toggleClass('sc_infobox_style_error', false).toggleClass('sc_infobox_style_success', false);
            if (rez.error === '') {
                result_box.addClass('sc_infobox sc_infobox_style_success').html(TRX_UTILS_STORAGE['msg_login_success']);
                setTimeout(function() {
                    location.reload();
                }, 3000);
            } else {
                result_box.addClass('sc_infobox sc_infobox_style_error').html(TRX_UTILS_STORAGE['msg_login_failed'] + '<br>' + rez.error);
            }
            result_box.fadeIn().delay(3000).fadeOut();
        });
    }
    return !TRX_UTILS_STORAGE['login_via_ajax'] && !error;
}


// Registration form 
function trx_utils_registration_validate(form) {
    "use strict";
    var TRX_UTILS_STORAGE = {
        "ajax_url": "/",
        "ajax_nonce": "0ae88bf3ea",
        "site_url": "/",
        "user_logged_in": "0",
        "email_mask": "^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
        "msg_ajax_error": "Invalid server answer!",
        "msg_error_global": "Invalid field's value!",
        "msg_name_empty": "The name can't be empty",
        "msg_email_empty": "Too short (or empty) email address",
        "msg_email_not_valid": "E-mail address is invalid",
        "msg_text_empty": "The message text can't be empty",
        "msg_send_complete": "Send message complete!",
        "msg_send_error": "Transmit failed!",
        "login_via_ajax": "1",
        "msg_login_empty": "The Login field can't be empty",
        "msg_login_long": "The Login field is too long",
        "msg_password_empty": "The password can't be empty and shorter then 4 characters",
        "msg_password_long": "The password is too long",
        "msg_login_success": "Login success! The page will be reloaded in 3 sec.",
        "msg_login_error": "Login failed!",
        "msg_not_agree": "Please, read and check 'Terms and Conditions'",
        "msg_email_long": "E-mail address is too long",
        "msg_password_not_equal": "The passwords in both fields are not equal",
        "msg_registration_success": "Registration success! Please log in!",
        "msg_registration_error": "Registration failed!"
    };
    form.find('input').removeClass('error_fields_class');
    var error = trx_utils_form_validate(form, {
        error_message_show: true,
        error_message_time: 4000,
        error_message_class: "sc_infobox sc_infobox_style_error",
        error_fields_class: "error_fields_class",
        exit_after_first_error: true,
        rules: [{
            field: "registration_agree",
            state: {
                value: 'checked',
                message: TRX_UTILS_STORAGE['msg_not_agree']
            },
        }, {
            field: "registration_username",
            min_length: {
                value: 1,
                message: TRX_UTILS_STORAGE['msg_login_empty']
            },
            max_length: {
                value: 60,
                message: TRX_UTILS_STORAGE['msg_login_long']
            }
        }, {
            field: "registration_email",
            min_length: {
                value: 7,
                message: TRX_UTILS_STORAGE['msg_email_empty']
            },
            max_length: {
                value: 60,
                message: TRX_UTILS_STORAGE['msg_email_long']
            },
            mask: {
                value: TRX_UTILS_STORAGE['email_mask'],
                message: TRX_UTILS_STORAGE['msg_email_not_valid']
            }
        }, {
            field: "registration_pwd",
            min_length: {
                value: 4,
                message: TRX_UTILS_STORAGE['msg_password_empty']
            },
            max_length: {
                value: 30,
                message: TRX_UTILS_STORAGE['msg_password_long']
            }
        }, {
            field: "registration_pwd2",
            equal_to: {
                value: 'registration_pwd',
                message: TRX_UTILS_STORAGE['msg_password_not_equal']
            }
        }]
    });
    if (!error) {
        jQuery.post(TRX_UTILS_STORAGE['ajax_url'], {
            action: 'trx_utils_registration_user',
            nonce: TRX_UTILS_STORAGE['ajax_nonce'],
            user_name: form.find('#registration_username').val(),
            user_email: form.find('#registration_email').val(),
            user_pwd: form.find('#registration_pwd').val()
        }).done(function(response) {
            "use strict";
            var rez = {};
            try {
                rez = JSON.parse(response);
            } catch (e) {
                rez = {
                    error: TRX_UTILS_STORAGE['ajax_error']
                };
                console.log(response);
            }
            var result_box = form.find('.result');
            if (result_box.length == 0) result_box = form.siblings('.result');
            if (result_box.length == 0) result_box = form.after('<div class="result"></div>').next('.result');
            result_box.toggleClass('sc_infobox_style_error', false).toggleClass('sc_infobox_style_success', false);
            if (rez.error === '') {
                result_box.addClass('sc_infobox sc_infobox_style_success').html(TRX_UTILS_STORAGE['msg_registration_success']);
                setTimeout(function() {
                    jQuery('.popup_login_link').trigger('click');
                }, 3000);
            } else {
                result_box.addClass('sc_infobox sc_infobox_style_error').html(TRX_UTILS_STORAGE['msg_registration_failed'] + ' ' + rez.error);
            }
            result_box.fadeIn().delay(3000).fadeOut();
        });
    }
    return false;
}