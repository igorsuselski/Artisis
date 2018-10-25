$(function () {

    //Subscribe
    $("#sendSub").click(function (e) {

        let name = $(".modal-content #form3").val();
        let mail = $(".modal-content #form2").val();

        let subscriber = 
        {
            SubscriberName: name,
            SubscriberEmail: mail
        }
        $.ajax({
            type: "POST",
            data: JSON.stringify(subscriber),
            url: "http://localhost:50354/api/Subscriber",
            contentType: "application/json",
            success: function (data) {
                alert(data);
                $(".modal-content #form3").val("");
                $(".modal-content #form2").val("");
            }, 
            error: function (error) {
                var err = eval("(" + error.responseText + ")");
                alert(err.Message);
                console.log(error.status);
            }
        });
    });

    //Unsubscribe
    $("#unsubscribe").click(function () {

        let subscriberMail = 
        {
            SubscriberEmail: $(".modal-content #form2").val()
        }

        $.ajax({
            type: "DELETE",
            data: JSON.stringify(subscriberMail),
            url: "http://localhost:50354/api/Subscriber",
            contentType: "application/json",
            success: function (data) {
                alert(data);
                $(".modal-content #form3").val("");
                $(".modal-content #form2").val("");
            }, 
            error: function (error) {
                var err = eval("(" + error.responseText + ")");
                alert(err.Message);
                console.log(error.status);
            }
        });
    });

    
    
});