
const weekdays = document.querySelectorAll(".divdays");
let webtoonLink = "https://comic.naver.com/webtoon/list.nhn?titleId=id&weekday=day";

function GetWebToonData(selectedWeekDay){
    chrome.storage.sync.get(
        selectedWeekDay,
        async function(items){
            await openLinks(selectedWeekDay, items)
        }
    )
  }

function openLinks(weekDay, items){
    console.log(items);
    items[weekDay].forEach(element=>{
        console.log(element);
        chrome.tabs.create({
            url: webtoonLink.replace("id", element).replace("day", weekDay)
        })
    })
}

async function onOpenWebtoon() {
    switch (this.innerText) {
        case "월":
            await GetWebToonData("mon");
            break;
        case "화":
            await GetWebToonData("tue");
            break;
        case "수":
            await GetWebToonData("wed");
            break;
        case "목":
            await GetWebToonData("thu");
            break;
        case "금":
            await GetWebToonData("fri");
            break;
        case "토":
            await GetWebToonData("sat");
            break;
        case "일":
            await GetWebToonData("sun");
            break;
    }
}

function RegisterEvent() {
    weekdays.forEach(element => {
        element.addEventListener("click", onOpenWebtoon);
    });
}

function init() {
    RegisterEvent();
}

init();