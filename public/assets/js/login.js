$('#oauth-connect button').click(function(e) {
    e.preventDefault();

    OAuth.initialize('W1kMk1OMfXFAeCWEcItX6YPilq4');
    OAuth.popup('github', function(error, result) {
        if (error) {
            $('#error-text').show().find('span').html('github');
        }
        else {
            $('#success-text').show().find('span').html('github')
            $.cookie("access_token", result.access_token, { expires: 7, path: '/' });
            window.location.href = "/list"

        }

    });
})



