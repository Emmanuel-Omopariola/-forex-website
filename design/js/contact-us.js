$(function () {
	$('.feedback-form').formValidate([
		{
			name: 'name',
			required: true
		},
		{
			name: 'email',
			required: true,
			regexp: 'email'
		},
		{
			name: 'message',
			required: true
		}
	]);
});