$(function () {
    $("ul").hide();
    $("p").hide();
    $("#goto").hide();
    $("#wait").hide();
    $("#load").hide();
    $("#sort").hide();
    $("#search").hide();
    $("#mag").hide();
    $("#counter").hide();
    $("#note").hide();
    const parAlbums = "/+albums";
    //let parBiography = "/+wiki";
    let pageStart = 0; let pageEnd = 0;
    //pagination [index] of pages 

    $("a").click((e) => {
        let id = e.target.id;
        switch (id) {
            case "p1":
                pageStart = 0; pageEnd = 50;
                return pageStart, pageEnd;
            case "p2":
                pageStart = 50; pageEnd = 100;
                return pageStart, pageEnd;
            case "p3":
                pageStart = 100; pageEnd = 150;
                return pageStart, pageEnd;
            case "p4":
                pageStart = 150; pageEnd = 200;
                return pageStart, pageEnd;
            case "p5":
                pageStart = 200; pageEnd = 250;
                return pageStart, pageEnd;
            default:
                pageStart = 0; pageEnd = 50;
                return pageStart, pageEnd;
        }
    });

    //default click
    $("button").click((e) => {
        let id = e.target.id;
        switch (id) {
            case "pull":
                pageStart = 0; pageEnd = 50;
                return pageStart, pageEnd;
        }
    });

    //user coice of selected genre
    function Genre() {
        let pickedValue = $("#genre option:selected").text();
        const def = "Music genre...";
        $("#pull").css("background-color", "rgb(74, 87, 99)");
        if (pickedValue !== "") {
            if (pickedValue === def) {
                alert("Pick a music genre, haw about Jazz");
                $("#genre").val("5");
                let result = "jazz";
                return result;
            }
            else
                return pickedValue;
        }
    }

    //create table 
    function DataList(list) {
        this.tBody = $("#tbody");
        this.listOfArtists = list;
        this.InfoTextOfSelectedGenre;

        //fill the table body 
        this.PopulateDataTable = function () {
            $("#tbody").html("");
            $("#tbody").hide();
            for (let index = pageStart; index < pageEnd; index++) {
                let row = $("<tr>");
                let artistName = $(`<span id=n${index}>${this.listOfArtists.topartists.artist[index].name}</span>`);
                let artistImage = $(`<img id=p${index} class=portrait src=${this.listOfArtists.topartists.artist[index].image["4"]["#text"]} alt="${this.listOfArtists.topartists.artist[index].name}">`);
                let urlAlbums = $(`<a href=${this.listOfArtists.topartists.artist[index].url}${parAlbums} target=_blank><img class=albums src=img/Album02.jpg /></a>`);
                let ArtistBiography = $(`<span id=b${index} class=biograph>Biography</span>`)//$(`<a href=${this.listOfArtists.topartists.artist[index].url}${parBiography} target=_blank>Biography</a>`);
                $("<td>").text(this.listOfArtists.topartists.artist[index]["@attr"].rank).appendTo(row);
                $("<td>").html(artistImage).appendTo(row);
                $("<td>").html(artistName).appendTo(row);
                $("<td>").html(ArtistBiography).appendTo(row);
                $("<td>").html(urlAlbums).appendTo(row);
                this.tBody.append(row);
            }
            pageStart, pageEnd = 0; //reset [indexsers]
            $("ul").show();
            $("#search").show();
            $("#sort").show();
            $("#goto").show();
            $("#note").show();
            $("#search").val("");
            $("#pull").css("background-color", "#132231");
            $("#1pagin").addClass("active");
            $("#tbody").show();
            $("#pull").removeAttr('disabled');
        }

        // Artist data
        this.ListOfData = function (dataList) {
            this.listOfArtists = dataList;
        }

        //Genre Info Data
        this.GetGenreInfoText = function (text) {
            this.InfoTextOfSelectedGenre = text.tag.wiki.content;

        }
    }

    //validate data length, paging
    function CheckDataLength(receivedData) {
        let length = receivedData.length;
        if (length < 250) {
            alert(`Sorry, we can get only Top${length} artists for ${Genre()} genre this time`);
        }
    }

    //new table
    let listOfDataReceived = new DataList([]);

    //calling for data
    function GetData(genre) {
        //get artists
        $.ajax({
            method: "GET",
            url: `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${genre}&limit=250&page=5&api_key=7db173b36ce660f0661d3e66229fae90&format=json`,
            success: function (data) {
                console.log(data); //log results
                listOfDataReceived.ListOfData(data); //pass results   
                CheckDataLength(data);//validate the number of data received
                $("#gen").html(`${genre} music`);   //attr("href", `https://en.wikipedia.org/wiki/${genre}_music`).
                listOfDataReceived.PopulateDataTable();//show results  
            },
            error: function (error) {
                this.ErrorMessage(error);
            }
        });

        //get genre info
        $.ajax({
            method: "GET",
            url: `http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${genre}&api_key=7db173b36ce660f0661d3e66229fae90&format=json`,
            success: function (data) {
                console.log(data);
                listOfDataReceived.GetGenreInfoText(data);
            },
            error: function (error) {
                this.ErrorMessage(error);
            }
        });

        this.ErrorMessage = function (error) {
            switch (error.status) {
                case 408:
                    alert("Timeout [408] Retry");
                    GetData();
                    break;
                case 400:
                    alert("Bad request [400].");
                    break;
                case 404:
                    console.log(`Requested page not found [404] .`);
                    break;
                case 500:
                    console.log(`Internal Server Error [500].`);
                    break;
                default:
                    console.log(`${error}`);
                    break;
            }
        }
    }

    //search
    function CountResultsFromSearching() {
        let rowCount = $("#tbody > tr:visible ").length;
        let input = $("#search").val();
        $("#counter").text(`${rowCount}`);
        if (input !== "")
            $("#counter").show();
        else if (input === "")
            $("#counter").hide();
    }

    //searching matching results
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
        CountResultsFromSearching();

        //show "not found"
        if ($("#tbody tr").is(":visible") == false)
            $("p").show();
        else
            $("p").hide();
    }

    //start request
    $("#pull").on("click", function () {
        var btn = $(this);
        btn.attr('disabled', 'disabled');
        GetData(Genre());
    });

    $("#genre").change(function () {
        $("#pull").trigger("click");
    });

    //setting the selected value of genre list
    $("#genre").on("change", Genre);

    //searching table<tr> 
    $("#search").keyup(() => {
        SearchTable($("#search").val());
    });

    //select * from artists
    $("#search").focus(() => {
        input = $("#search").val();
        if (input === "") {
            pageStart = 0; pageEnd = 250;
            listOfDataReceived.PopulateDataTable();
            $(".page-item").addClass("active");
            $("#mag").show();
            $("#counter").hide();
        }
    });

    $("#search").focusout(() => {
        input = $("#search").val();
        if (input === "") {
            pageStart = 0; pageEnd = 50;
            listOfDataReceived.PopulateDataTable();
            $("li").removeClass("active");
            $("#1").addClass("active");
            $("#mag").hide();
            $("#counter").hide();
            $('footer').show();
        }
    });

    //pagination <a> events 
    $(document).on("click", "#p1, #p2, #p3, #p4, #p5", function () {
        listOfDataReceived.PopulateDataTable();
        $("#search").val("");
    });

    //reset the pagination active list 
    $(document).on('click', 'li', function () {
        $("li").removeClass("active");
        $(this).addClass("active");
    });

    $(document).on('click', '#pull', function () {
        $("li").removeClass("active");
        $("#1").addClass("active");
    });

    //loader .gif
    $(document).ajaxStart(() => {
        $("#wait").show();
        $("#load").show();
    }).ajaxStop(() => {
        $("#wait").hide();
        $("#load").hide();
    });

    //take the index number from id
    function GetNumberInId(id) {
        let index = id.substring(1);
        return index;
    }

    // Modal class
    function ModalBoxLoad() {

        this.modal = document.getElementById('myModal');
        this.modalImg = document.getElementById("img01");
        this.captionText = document.getElementById("caption");

        this.ShowModalPicture = function (id) {
            this.ClearAttrib();
            let artistImage = $(`#${id}`).attr('src');
            let artistName = $(`#n${GetNumberInId(id)}`).html();
            this.modal.style.display = "block";
            this.modalImg.src = artistImage;
            $("#caption").css("font-family", "Parisienne");
            this.captionText.innerHTML = artistName;
            $(".page-item").hide();
            $('footer').hide();
        };

        this.ShowModalGenreInfo = function () {
            this.ClearAttrib();
            this.modal.style.display = "block";
            $("#caption").css("font-family", "Verdana");
            this.captionText.innerHTML = listOfDataReceived.InfoTextOfSelectedGenre;
            $("#caption a").attr("target", "_blank");
            $(".page-item").hide();
            $('footer').hide();
        };

        this.ShowModalArtistBio = function (data) {
            this.ClearAttrib();
            this.modal.style.display = "block";
            this.modalImg.src = data.artist.image[4]["#text"];
            $("#caption").css("font-family", "Verdana");
            this.captionText.innerHTML = data.artist.bio.content;
            $(".page-item").hide();
            $('footer').hide();
        };

        this.ClearAttrib = function () {
            this.modalImg.src = "";
            this.captionText.innerHTML = "";
            this.modal.style.display = "";
        };
    }


    let modalDialogue = new ModalBoxLoad();


    $(document).on('click', '.portrait', function (e) {
        let id = e.target.id;
        let artistName = $(`#n${GetNumberInId(id)}`).html();
        modalDialogue.ShowModalPicture(id);
    });

    $(document).on("click", "#gen", function () {
        modalDialogue.ShowModalGenreInfo();
    });

    //modal link
    $(document).on('click', '#caption a', (e) => {
        $("#caption a").attr("target", "_blank");
    });

    //get data from artist biography
    $(document).on('click', '.biograph', (e) => {
        let id = e.target.id;
        let artistName = $(`#n${GetNumberInId(id)}`).html();
        $.ajax({
            method: "GET",
            url: `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=7db173b36ce660f0661d3e66229fae90&format=json`,
            success: function (result) {
                modalDialogue.ShowModalArtistBio(result);
            }, 
            error: function (error) {
                console.log(error);
            }
        });
    });

    //close the modal
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modalDialogue.modal.style.display = "none";
        $(".page-item").show();
        $('footer').show();
    }
    

});

