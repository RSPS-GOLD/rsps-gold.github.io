(function () {
  "use strict";

  var root = document.querySelector("[data-starter-checklist]");
  if (!root) return;

  var items = Array.from(root.querySelectorAll("[data-checklist-item]"));
  var count = root.querySelector("[data-checklist-count]");
  var bar = root.querySelector("[data-checklist-bar]");
  var reset = root.querySelector("[data-checklist-reset]");
  var status = root.querySelector("[data-checklist-status]");
  var storageKey = "rspsGoldHub.spawnpkStarterChecklist.v1";

  function readSaved() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value ? JSON.parse(value) : {};
    } catch (error) {
      return {};
    }
  }

  function writeSaved(value) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function currentState() {
    return items.reduce(function (state, item) {
      state[item.getAttribute("data-checklist-item")] = item.checked;
      return state;
    }, {});
  }

  function render(announce) {
    var completed = items.filter(function (item) {
      return item.checked;
    }).length;
    var total = items.length;
    var percent = total ? Math.round((completed / total) * 100) : 0;

    if (count) count.textContent = completed + " of " + total + " complete";
    if (bar) bar.style.width = percent + "%";

    if (announce && status) {
      status.textContent =
        completed === total
          ? "Checklist complete. You are ready to choose a repeatable route."
          : "Progress saved: " + completed + " of " + total + " actions complete.";
    }
  }

  var saved = readSaved();
  items.forEach(function (item) {
    var key = item.getAttribute("data-checklist-item");
    item.checked = saved[key] === true;
    item.addEventListener("change", function () {
      var persisted = writeSaved(currentState());
      render(true);
      if (!persisted && status) {
        status.textContent = "Progress updated for this visit. Browser storage is unavailable.";
      }
    });
  });

  if (reset) {
    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        item.checked = false;
      });
      writeSaved(currentState());
      render(false);
      if (status) status.textContent = "Checklist reset.";
      items[0]?.focus();
    });
  }

  render(false);
})();
