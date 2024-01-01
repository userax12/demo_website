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

function openFile(filename, url) {
    if (url == undefined) {
        url = filename;
    }
    const modal = document.getElementsByClassName("modal")[0];
    if (modal != undefined) {
        modal.classList.add("opened");
        modal.innerHTML = "<div class='scroll'><div class='centered'>" +
            "<div class='title'>" + filename +
            "<button class='close float-right' onclick='closeModal()'>Close</button></div>" +
            "<div class='article-content'></div></div></div>";
        document.body.classList.add("modal-opened");
        ajax(url, function (text) {
            let content = "";
            for (let line of text.split("\n")) {
                let parsedLine = parse(line);
                if (parsedLine == "") {
                    parsedLine = "<br>";
                }
                content += "<pre class=\"line\">" + parsedLine + "</pre>";
            }
            modal.querySelector(".article-content").innerHTML = content;
        });
    }
}

function openArticle(bookName, number) {
    const articles = window.books[bookName].index;
    const article = articles[number - 1];
    if (article != undefined) {
        openFile(article.title, article.route);
    }
}

function closeModal() {
    const modal = document.getElementsByClassName("modal")[0];
    modal.classList.remove("opened");
    modal.innerHTML = "";
    document.body.classList.remove("modal-opened");
}

function openBook(bookName) {
    const books = document.querySelectorAll(".book");
    for (const book of books) {
        book.classList.remove("opened");
        if (book.getAttribute("book-name") == bookName) {
            book.classList.add("opened");
        }
    }

    const articles = window.books[bookName].index;
    const container = document.getElementById("articles");
    container.innerHTML = "";
    let counter = 1;
    for (let article of articles) {
        article.number = counter++;
        let div = document.createElement("div");
        div.classList = ["article"];
        div.id = "article-" + article.number;
        div.innerHTML = "<div>" + article.title + "</div><div class='text'></div>";
        div.setAttribute("onclick", "openArticle('" + bookName + "','" + article.number + "')");
        container.append(div);

        ajax(article.route, function (responseText) {
            container.querySelector("#article-" + article.number + " > .text").innerText = responseText;
        });
    }
}

window.onload = function () {
    const container = document.getElementById("books");
    for (const [key, value] of Object.entries(window.books)) {
        let div = document.createElement("div");
        div.classList.add("book");
        div.innerText = key;
        div.setAttribute("book-name", key);
        div.setAttribute("onclick", "openBook('" + key + "')");
        container.append(div);
    }
    openBook("book-1");
}