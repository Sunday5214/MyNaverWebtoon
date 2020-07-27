const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";
const CONTEXT_MENU_ID2 = "MY_CONTEXT_MENU2";
const NOTIFICATIONS_ID = "MY_NOTIFICATIONS";
const weekDayRegex = /mon|tue|wed|thu|fri|sat|sun/;
const addOpt = {
  type: "basic",
  title: "추가완료!",
  message: "성공적으로 추가되었습니다",
  iconUrl: "webtoon.png"
}
const deleteOpt = {
  type: "basic",
  title: "삭제완료!",
  message: "성공적으로 삭제되었습니다",
  iconUrl: "webtoon.png"
}
let saveObj = {
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: []
}


function GetId(str) {
  var res;
  res = str.replace(/[^0-9]/g, "");
  return res;
}
function isEmptyObject(param) {
  return Object.keys(param).length === 0 && param.constructor === Object;
}
function getDataDone(items, info, func) {
  if (!isEmptyObject(items)) {
    saveObj = items;
  }
  switch (func) {
    case "ADD":
      let res = saveObj[info.linkUrl.match(weekDayRegex)[0]].find(element => element === GetId(info.linkUrl));
      if (res === undefined) {
        saveObj[info.linkUrl.match(weekDayRegex)[0]].push(GetId(info.linkUrl));
      }
      break;
    case "DELETE":
      let res2 = saveObj[info.linkUrl.match(weekDayRegex)[0]].find(element => element === GetId(info.linkUrl));
      let index = saveObj[info.linkUrl.match(weekDayRegex)[0]].indexOf(res2);
      if (index > -1) {
        saveObj[info.linkUrl.match(weekDayRegex)[0]].splice(index, 1);
      }
      break;
  }

}

function registerWebToon(info, tab) {
  switch (info.menuItemId) {
    case CONTEXT_MENU_ID:
      chrome.storage.sync.get(
        null,
        (items) => {
          getDataDone(items, info, "ADD");
          chrome.storage.sync.set(
            saveObj,
            () => {
              chrome.notifications.create(
                NOTIFICATIONS_ID,
                addOpt
              );
              console.log(saveObj);
            }
          )
        }
      )
      break;
    case CONTEXT_MENU_ID2:
      chrome.storage.sync.get(
        null,
        (items) => {
          getDataDone(items, info, "DELETE");
          chrome.storage.sync.set(
            saveObj,
            () => {
              chrome.notifications.create(
                NOTIFICATIONS_ID,
                deleteOpt
              );
              console.log(saveObj);
            }
          )
        }
      )
      break;


  }


}
chrome.contextMenus.create({
  title: "웹툰 등록하기!",
  contexts: ["link"],
  id: CONTEXT_MENU_ID,
});
chrome.contextMenus.create({
  title: "웹툰 삭제하기!",
  contexts: ["link"],
  id: CONTEXT_MENU_ID2,
});
chrome.contextMenus.onClicked.addListener(registerWebToon)