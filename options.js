document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start").addEventListener("click", start);
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("copy").addEventListener("click", copy_result);
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("download").addEventListener("click", download);
});

function copy_result() {
    chrome.storage.local.get(({
        save_array
    }) => {
        copy(unique(save_array).join(",").replace(/,/g, "\n"));
        alert(`已经复制: ${save_array.length}个`);
    })
}

function unique(get_data) {
    return Array.from(new Set(get_data))
}

async function start() {
    chrome.storage.local.clear();
    var get_select = document.getElementById("gender");
    var index = get_select.selectedIndex;
    if (index == 0) {
        var gender_str = "";
    } else if (index == 1) {
        var gender_str = "gender=male";
    } else if (index == 2) {
        var gender_str = "gender=female";
    }
    var min_age = document.getElementById("min_age").value;
    if (min_age == "") {
        var min_age_str = "";
    } else {
        var min_age_str = "&minimum_age=" + min_age;
    }
    var max_age = document.getElementById("max_age").value;
    if (max_age == "") {
        var max_age_str = "";
    } else {
        var max_age_str = "&maximum_age=" + max_age;
    }
    var avatar_count = document.getElementById("avatar_count").value;
    if (avatar_count == "") {
        return;
    }
    var url = [];
    for (var k = 0; k < avatar_count; k++) {
        let response = await fetch(`https://fakeface.rest/face/json?${gender_str}${min_age_str}${max_age_str}`)
        let text = await response.text()
        var image_url = JSON.parse(text).image_url;
        url.push(image_url);
        document.getElementById("count").innerText = k+1;
        chrome.storage.local.set({
            save_array: url
        })
    }
    let speechInstance = new window.SpeechSynthesisUtterance("头像生成完成");
    window.speechSynthesis.speak(speechInstance);
}

function copy(str) {
    var input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value = str;
    input.focus();
    input.select();
    document.execCommand("Copy");
    input.remove();
}

async function download() {
    var get_select = document.getElementById("gender");
    var index = get_select.selectedIndex;
    if (index == 0) {
        var gender_str = "";
    } else if (index == 1) {
        var gender_str = "gender=male";
    } else if (index == 2) {
        var gender_str = "gender=female";
    }
    var min_age = document.getElementById("min_age").value;
    if (min_age == "") {
        var min_age_str = "";
    } else {
        var min_age_str = "&minimum_age=" + min_age;
    }
    var max_age = document.getElementById("max_age").value;
    if (max_age == "") {
        var max_age_str = "";
    } else {
        var max_age_str = "&maximum_age=" + max_age;
    }
    var avatar_count = document.getElementById("avatar_count").value;
    if (avatar_count == "") {
        return;
    }
    for (var i = 0; i < avatar_count; i++) {
        let response = await fetch(`https://fakeface.rest/face/json?${gender_str}${min_age_str}${max_age_str}`)
        let text = await response.text()
        var image_url = JSON.parse(text).image_url;
        const elt = document.createElement("a");
        elt.setAttribute("href", image_url);
        elt.setAttribute("download", "file.png");
        elt.style.display = "none";
        document.body.appendChild(elt);
        elt.click();
        document.body.removeChild(elt);
    }
    let speechInstance = new window.SpeechSynthesisUtterance("头像下载完成");
    window.speechSynthesis.speak(speechInstance);
}
