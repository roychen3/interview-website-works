var allHolidayData;

function filterHoliday(allHolidayData, year) {
  let tableTitle = "";
  let content = "";
  let showData = "";
  tableTitle += "<tr><th>日期</th><th>放假名稱</th><th>放假類型</th><th>其他資訊</th></tr>";

  for (let i = 0; i < allHolidayData.length; i++) {
    if (new Date(allHolidayData[i].date) >= new Date('1/1/' + year) && new Date(allHolidayData[i].date) <= new Date('12/31/' + year) && allHolidayData[i].holidayCategory != "星期六、星期日") {
      if (allHolidayData[i].holidayCategory === "補行上班日") {
        content += '<tr class="work-day"><td>' + allHolidayData[i].date + '</td><td>' + allHolidayData[i].name + '</td><td>' + allHolidayData[i].holidayCategory + '</td><td>' + allHolidayData[i].description + "</td></tr>";
      } else
      {
        content += '<tr><td>' + allHolidayData[i].date + '</td><td>' + allHolidayData[i].name + '</td><td>' + allHolidayData[i].holidayCategory + '</td><td>' + allHolidayData[i].description + "</td></tr>";
      }
    }
  }

  let messagModel = document.getElementsByClassName("message-model");
  let message = document.getElementById("message");
  if (content === "") {
    message.innerHTML = "<i class='far fa-file'></i> 無資料";
    messagModel[0].classList.add("show");
  } else
  {
    if (messagModel[0].classList.contains("show")) {
      message.innerHTML = "";
      messagModel[0].classList.remove("show");
    }
    showData += tableTitle;
    showData += content;
  }

  return showData;
}

function getHolidays() {
  test = 'inner';
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    let messagModel = document.getElementsByClassName("message-model");
    let message = document.getElementById("message");

    if (this.readyState == 4 && this.status == 200) {
      message.innerHTML = "";
      messagModel[0].classList.remove("show");

      let table = document.getElementById("holidays-table");
      let resultDatas = JSON.parse(this.responseText);
      let d = new Date();
      let year = d.getFullYear();
      allHolidayData = resultDatas.result.records;
      table.innerHTML += filterHoliday(allHolidayData, year);
    } else
    if (this.readyState == 1) {
      message.innerHTML = "<i class='fas fa-spinner'></i> 載入中";
      messagModel[0].classList.add("show");
    } else
    if (this.status != 200) {
      message.innerHTML = "<i class='fas fa-exclamation-triangle'></i> 伺服器發生問題";
      messagModel[0].classList.add("show");
    }
  };

  //在 api 網址前面加上 https://cors-anywhere.herokuapp.com/ 解決 CORS 問題
  xhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://data.ntpc.gov.tw/api/v1/rest/datastore/382000000A-000077-002", true);
  xhttp.send();
}

function selectYear(year) {
  if (year.length !== 4) {
    if (year === "") {
      let d = new Date();
      year = d.getFullYear();
    } else
    {
      return;
    }
  }

  let table = document.getElementById("holidays-table");
  table.innerHTML = filterHoliday(allHolidayData, year);
}

getHolidays();

let el = document.getElementById("select-year");
el.addEventListener("keyup", () => selectYear(el.value), false);Ｆ;