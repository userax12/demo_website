function ajax(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    // If specified, responseType must be empty string or "text"
    xhr.responseType = "text";
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                callback(xhr.responseText, xhr.response);
            }
        }
    };
    xhr.send();
}

function openArticle(number) {
    const articles = window.index;
    const article = articles[number - 1];
    if (article != undefined) {
        const modal = document.getElementsByClassName("modal")[0];
        if (modal != undefined) {
            modal.classList.add("opened");
            modal.innerHTML = "<div class='title'>" + article.title
                + "<button class='close float-right' onclick='closeModal()'>Close</button></div>";
            document.body.classList.add("modal-opened");
            ajax(article.route, function (text) {
                modal.innerHTML += "<div class='text'>" + text + "</div>";
            });
        }
    }
}

function closeModal() {
    const modal = document.getElementsByClassName("modal")[0];
    modal.classList.remove("opened");
    modal.innerHTML = "";
    document.body.classList.remove("modal-opened");
}

window.onload = function () {
    const articles = window.index;

    const container = document.getElementById("articles");

    let counter = 1;

    for (let article of articles) {
        article.number = counter++;
        let div = document.createElement("div");
        div.classList = ["article"];
        div.id = "article-" + article.number;
        div.innerHTML = "<div>" + article.title + "</div><div class='text'></div>";
        div.setAttribute("onclick", "openArticle('" + article.number + "')");
        container.append(div);

        (function (article) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", article.route, true);
            // If specified, responseType must be empty string or "text"
            xhr.responseType = "text";
            xhr.onload = function () {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200) {
                        // console.log(xhr.response);
                        container.querySelector("#article-" + article.number + " > .text").innerText = xhr.responseText;
                    }
                }
            };
            xhr.send();
        })(article);
    }
}