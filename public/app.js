$(function () {
    $("#scrape").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function () {
            location.reload();
        });
    });

    $("#delete").on("click", function (e) {
        console.log("HERE HERE HERE");
        $.ajax({
            type: "DELETE",
            url: "/delete"
        }).then(function () {
            console.log("Deleted all articles.");
            location.reload();
        });
    });

    $("#save").on("click", function (e) {
        let id = $(this).attr("value");
        console.log(id);
        $.ajax({
            type: "PUT",
            url: "/saveArticle/" + id
        }).then(function () {
            console.log("Saved article.");
            location.reload();
        });
    });
});