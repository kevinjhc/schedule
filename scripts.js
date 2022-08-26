const keys = [
  "Sauce - Thousand Island",
  "Wild Boar - Tenderloin",
  "Goat - Whole Cut"
];

const schedule = [
  {
    title: "Wake",
    time: "06:00"
  },
  {
    title: "Breakfast",
    time: "06:30"
  },
  {
    title: "Snack",
    time: "08:30"
  },
  {
    title: "Lunch",
    time: "10:00"
  },
  {
    title: "Nap",
    time: "12:00"
  },
  {
    title: "Snack",
    time: "14:00"
  },
  {
    title: "Dinner",
    time: "17:00"
  },
  {
    title: "Bath",
    time: "17:45"
  },
  {
    title: "Bedtime",
    time: "18:00"
  },
];

// loop through the data
schedule.forEach((datarecord, id) => {
  let markup = createSeries(datarecord, id);
  let container = document.createElement("div");
  container.classList.add("schedule");
  container.innerHTML = markup;
  document.body.appendChild(container);

  var selector = ".autocomplete" + id;
  const autoCompleteJS = new autoComplete({
    placeHolder: "Notes",
    selector: selector,
    data: {
      src: keys,
      cache: true,
    },
    resultItem: {
      highlight: true
    },
    events: {
      input: {
        selection: (event) => {
          const selection = event.detail.selection.value;
          autoCompleteJS.input.value = selection;
        }
      }
    }
  });
});

function createSeries(datarecord, id) {
  return `
    <li>
      <div class="column-left">
        <div class="row">
          <input name="time" type="time" value="${datarecord.time}">
          <input name="title" class="schedule-title" type="text" value="${datarecord.title}">
        </div>
        <div class="autoComplete_wrapper">
          <input name="notes" class="autocomplete${id}" type="search" dir="ltr" spellcheck=false autocorrect="off" autocomplete="on" autocapitalize="off" placeholder="Notes">
        </div>
      </div>
      <svg onclick="removeParent(this)" class="close" width="24" height="24" role="img"><use xlink:href="#close"></use></svg>
    </li>
  `;
}

function removeParent(e) {
  e.parentElement.parentElement.remove();
}

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

function generateMessage() {
  var message = "";

  var schedules = document.getElementsByClassName("schedule");
  for (var i = 0; i < schedules.length; i++) {
    message += tConvert(schedules[i].querySelector('input[name="time"]').value) + " ";
    message += schedules[i].querySelector('input[name="title"]').value + "%0a";
    if (schedules[i].querySelector('input[name="notes"]').value != "") {
      message += schedules[i].querySelector('input[name="notes"]').value + "%0a";
    }
  }

  location.href = "sms://open?addresses=6177850183,6178332951&body=" + message;
}

function copy() {
  var message = "";

  var schedules = document.getElementsByClassName("schedule");
  for (var i = 0; i < schedules.length; i++) {
    message += tConvert(schedules[i].querySelector('input[name="time"]').value) + " ";
    message += schedules[i].querySelector('input[name="title"]').value + "\r\n";
    if (schedules[i].querySelector('input[name="notes"]').value != "") {
      message += schedules[i].querySelector('input[name="notes"]').value + "\r\n";
    }
  }
  navigator.clipboard.writeText(message);
}
