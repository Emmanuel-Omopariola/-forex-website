;(function($) {

	"use strict";

	$.formInProgressStart = function(form) {
		form.find('.submit, button[type="submit"]').addClass('disabled');
		form.addClass('in-progress');
	};

	$.formInProgressStop = function(form) {
		form.find('.submit, button[type="submit"]').removeClass('disabled');
		form.removeClass('in-progress');
	};

	$.fn.formValidate = function(options, speed) {

		speed = speed || 400;

		var form = $(this),
			success = function () {

				$.formInProgressStart(form);

				var action = form.attr('action'),
					method = form.attr('method'),
					data = form.serialize();

				$.ajax(action, {
					method: method,
					data: data,
					dataType: 'json',
					beforeSend: function () {
						form.find('.has-error').removeClass('has-error');
						form.find('.error-message').remove();
					},
					success: function (res) {
						if (res.status) {
							form.find('.form-block').slideUp(speed);
							form.find('.form-after-sending').slideDown(speed);
						}
					},
					complete: function () {
						$.formInProgressStop(form);
					}
				});
			},
			error = function(errors) {

				var focused = 0;
				form.find('input[name], textarea[name], select[name]').each(function () {

					var self = $(this),
						name = self.attr('name');

					if( typeof(errors[name]) !== 'undefined' ) {

						var el = self.parents('.form-row').first();
						el.addClass('has-error');

						if( !focused ) {
							self.focus();
							focused++;
						}

						if(errors[name] !== '') {

							if (el.find('.error-message').length === 0) {
								el.append('<div class="error-message" style="display:none;">' + errors[name] + '</div>');
							} else {
								el.find('.error-message').html(errors[name]);
							}

							el.find('.error-message').fadeIn(speed);
						}
					}
				});
			},
			onChange = function() {
				$(this).parents('.form-row').first()
					.removeClass('has-error')
					.find('.error-message').fadeOut(speed);
			},
			clean = function() {
				form.find('input').parents('.form-row').first()
					.removeClass('has-error')
					.find('.error-message').hide();
			};

		/*** on form fields change ***/
		form.find('input, textarea, select').on('keyup change', onChange);

		form.find('button.submit').click(function () {
			form.trigger('before-submit');
		});

		/*** submit validator ***/
		form.on('before-submit', function () {

			var errors = {},
				checkRegexp = function(value, regexp) {

					switch(regexp) {
						case 'email': return value.match(/^\s*[a-z0-9][\w.-]*@[a-z0-9][a-z0-9.-]*\.[a-z]{2,}\s*$/i);
						case 'digit': return value.match(/^\d+$/i);
						case 'int': return value.match(/^(?:-?[1-9]\d*|0)$/i);
						case 'float': return value.match(/^-?\d+(?:[.,]\d+)?$/i);
						case 'login': return value.match(/^[a-z]+[\w-]*$/i);
						case 'pass': return value.match(/^[a-z0-9_!@#$%^&*()+=-]+$/i);
						case 'latin': return value.match(/^[a-z]+$/i);
						case 'url': return value.match(/^[a-z0-9._-]+$/i);
						default:
							try {
								return value.match(regexp);
							} catch (err) {
								console.dir(err);
								return false;
							}
					}
				};

			clean();

			options.forEach(function(field) {

				var name = field.name,
					input = form.find('[name="' + field.name + '"]'),
					val = input.val();

				if(typeof field.required !== 'undefined' && $.trim(val) === '') {
					errors[name] = (input.attr('data-msg-required') || '');
					return;
				}

				if(typeof field.checked !== 'undefined' && !input.prop("checked")) {
					errors[name] = (input.attr('data-msg') || '');
					return;
				}

				if(typeof field.min !== 'undefined') {
					if (!((typeof field.required === 'undefined' && val === '')) && val.length < field.min) {
						errors[name] = (input.attr('data-msg-min') || '');
						return;
					}
				}

				if(typeof field.max !== 'undefined') {
					if (!((typeof field.required === 'undefined' && val === '')) && val.length > field.max) {
						errors[name] = (input.attr('data-msg-max') || '');
						return;
					}
				}

				if(typeof field.compare !== 'undefined' && $('[name="' + field.compare + '"]').val() !== val) {
					// if(typeof field.required == 'undefined' && val == '') return;
					errors[name] = (input.attr('data-msg-compare') || '');
					return;
				}

				if(typeof field.regexp !== 'undefined') {
					if(!((typeof field.required === 'undefined' && val === '')) && !checkRegexp(val, field.regexp)) {
						errors[name] = (input.attr('data-msg-regexp') || '');
						return;
					}
				}

				if(typeof field.callback !== 'undefined') {

					if($.isArray(field.callback)) {

						var i = 0;
						field.callback.forEach(function(callback) {
							i++;
							if (typeof callback === "function" && !callback(val)) {
								errors[name] = (input.attr('data-msg-callback-' + i) || input.attr('data-msg-callback') || '');
								return false;
							}
						});

					} else {

						if(typeof field.callback === "function" && !field.callback(val)) {
							errors[name] = (input.attr('data-msg-callback') || '');
						}
					}
				}
			});

			if (Object.keys(errors).length === 0) {
				success();
			} else {
				error(errors);
			}
		});
	};

})(jQuery);