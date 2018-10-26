$(function () {

    $("#tblAccess").hide();
    $("#Status").hide();
    $("#search").hide();
    let count = 1;

    //Authorized Login
    $("#Access").click(function () {
        let tBody = $("#tbody");
        let username = $(".modal-content #orangeForm-name").val();
        let password = $(".modal-content #orangeForm-pass").val();

        $.ajax({
            type: 'GET',
            url: "http://localhost:50354/api/Subscriber",
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ':' + password)
            },
            success: function (data) {
                if (data == 401) {
                    alert(`Unauthorized [${data}] - Attempt: [${count}]`)
                    count++;
                    if (count > 3) {
                        $("h1").append("ACCESS DENIED");
                        $("#modalRegisterForm").modal('hide');
                    }
                }
                else {
                    $.each(data, function (index, val) {
                        let row = $("<tr>");
                        $("<td>").html(val.Id).appendTo(row);
                        $("<td>").html(val.SubscriberEmail).appendTo(row);
                        $("<td>").html(val.SubscriberName).appendTo(row);
                        $("<td>").html(val.SubscribtionDateCreated).appendTo(row);
                        tBody.append(row);
                    });
                    $("#tblAccess").show();
                    $("#search").show();
                    $("#modalRegisterForm").modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
            },
            complete: function (jqXHR) {
                console.log(`${jqXHR.status} : ${jqXHR.statusText}`);
            }
        });
    });

    function SearchTable(value) {
        input = value.toLowerCase();

        if (value === "")
            $("p").hide();

        $("#tbody tr").each(function () {
            let found = "false";
            //matching index 
            $(this).each(function () {
                if ($(this).text().indexOf(input) >= 0) {
                    found = "true";
                }
            });
            //show the curent found table row
            if (found === "true") {
                $(this).show();
            }
            else {
                $(this).hide();
                $("footer").hide();
            }
        });
    }

    $("#search").keyup(() => {
        SearchTable($("#search").val());
    });

});