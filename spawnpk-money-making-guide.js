(function () {
  "use strict";

  function initMethodFinder() {
    var form = document.querySelector("[data-money-finder]");
    if (!form) return;

    var fields = Array.from(form.querySelectorAll("[data-finder-field]"));
    var methods = Array.from(form.querySelectorAll("[data-money-method]"));
    var status = form.querySelector("[data-finder-status]");
    var empty = form.querySelector("[data-finder-empty]");
    if (!fields.length || !methods.length || !status || !empty) return;

    function allowed(method, field) {
      var selected = field.value;
      if (selected === "any") return true;
      var values = (method.getAttribute("data-" + field.dataset.finderField) || "")
        .split(/\s+/)
        .filter(Boolean);
      return values.indexOf(selected) !== -1;
    }

    function update() {
      var visible = 0;
      methods.forEach(function (method) {
        var matches = fields.every(function (field) {
          return allowed(method, field);
        });
        method.hidden = !matches;
        if (matches) visible += 1;
      });

      status.textContent =
        visible === 1
          ? "Showing 1 matching method group."
          : "Showing " + visible + " matching method groups.";
      empty.hidden = visible !== 0;
    }

    fields.forEach(function (field) {
      field.addEventListener("change", update);
    });

    form.addEventListener("reset", function () {
      window.requestAnimationFrame(update);
    });

    update();
  }

  function initNetProfitCalculator() {
    var form = document.querySelector("[data-money-calculator]");
    if (!form) return;

    var inputs = Array.from(form.querySelectorAll("[data-calc]"));
    var result = document.querySelector("[data-calc-result]");
    var error = form.querySelector("[data-calc-error]");
    var state = result && result.querySelector("[data-calc-state]");
    var summary = result && result.querySelector("[data-calc-summary]");
    if (!inputs.length || !result || !error || !state || !summary) return;

    var outputNames = [
      "costs",
      "net",
      "per-run",
      "per-hour",
      "break-even",
      "margin",
      "merch",
    ];
    var outputs = {};
    outputNames.forEach(function (name) {
      outputs[name] = result.querySelector('[data-calc-output="' + name + '"]');
    });
    if (outputNames.some(function (name) { return !outputs[name]; })) return;

    var multipliers = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
    };
    var compactFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });
    var fullFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });

    function parseInput(input) {
      var raw = input.value.trim().toLowerCase().replace(/,/g, "");
      if (raw === "") return { valid: true, value: 0, empty: true };
      var match = raw.match(/^(?:\d+(?:\.\d*)?|\.\d+)([kmb])?$/);
      if (!match) return { valid: false, value: 0, empty: false };

      var suffix = match[1] || "";
      var numberText = suffix ? raw.slice(0, -1) : raw;
      var value = Number(numberText) * (multipliers[suffix] || 1);
      var valid = Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;

      if (input.dataset.calc === "failures" && valid) {
        valid = Number.isInteger(value);
      }

      return { valid: valid, value: valid ? value : 0, empty: false };
    }

    function valueMap() {
      var values = {};
      inputs.forEach(function (input) {
        values[input.dataset.calc] = parseInput(input);
      });
      return values;
    }

    function formatCoins(value) {
      var safeValue = Math.abs(value) < 0.000001 ? 0 : value;
      var absolute = Math.abs(safeValue);
      var sign = safeValue < 0 ? "-" : "";
      var scale =
        absolute >= 1000000000
          ? { size: 1000000000, suffix: "B" }
          : absolute >= 1000000
            ? { size: 1000000, suffix: "M" }
            : absolute >= 1000
              ? { size: 1000, suffix: "K" }
              : null;

      if (!scale) return sign + fullFormatter.format(absolute) + " coins";
      return sign + compactFormatter.format(absolute / scale.size) + scale.suffix + " coins";
    }

    function formatPercent(value) {
      var safeValue = Math.abs(value) < 0.000001 ? 0 : value;
      return compactFormatter.format(safeValue) + "%";
    }

    function clearOutputs() {
      outputNames.forEach(function (name) {
        outputs[name].textContent = "—";
      });
    }

    function setState(kind, label, message) {
      result.classList.remove("is-positive", "is-neutral", "is-negative");
      result.classList.add("is-" + kind);
      state.textContent = label;
      summary.textContent = message;
    }

    function update() {
      var values = valueMap();
      var invalidInputs = inputs.filter(function (input) {
        return !values[input.dataset.calc].valid;
      });

      inputs.forEach(function (input) {
        var invalid = !values[input.dataset.calc].valid;
        input.setAttribute("aria-invalid", String(invalid));
      });

      if (invalidInputs.length) {
        clearOutputs();
        error.textContent =
          "Use non-negative numbers. Coin fields accept K, M or B; failed attempts must be a whole number.";
        setState("negative", "CHECK THE VALUES", "Correct the highlighted values to calculate a result.");
        return;
      }

      error.textContent = "";
      var gross = values.gross.value;
      var acquisition = values.acquisition.value;
      var supplies = values.supplies.value;
      var deaths = values.deaths.value;
      var fees = values.fees.value;
      var entry = values.entry.value;
      var runs = values.runs.value;
      var hours = values.hours.value;
      var failures = values.failures.value;
      var totalCosts = acquisition + supplies + deaths + fees + entry;
      var net = gross - totalCosts;
      if (Math.abs(net) < 0.000001) net = 0;
      var perRun = runs > 0 ? net / runs : null;
      var perHour = hours > 0 ? net / hours : null;
      var margin = gross > 0 ? (net / gross) * 100 : null;
      var merch = acquisition > 0 ? gross - acquisition - fees : null;
      var computed = [totalCosts, net, perRun, perHour, margin, merch].filter(function (value) {
        return value !== null;
      });

      if (computed.some(function (value) { return !Number.isFinite(value); })) {
        clearOutputs();
        setState("negative", "CHECK THE VALUES", "The calculated result is too large. Reduce the entered values.");
        return;
      }

      outputs.costs.textContent = formatCoins(totalCosts);
      outputs.net.textContent = formatCoins(net);
      outputs["per-run"].textContent = perRun === null ? "—" : formatCoins(perRun);
      outputs["per-hour"].textContent = perHour === null ? "—" : formatCoins(perHour);
      outputs["break-even"].textContent = formatCoins(totalCosts);
      outputs.margin.textContent = margin === null ? "—" : formatPercent(margin);
      outputs.merch.textContent = merch === null ? "—" : formatCoins(merch);

      var sampleText =
        (runs > 0 ? " across " + fullFormatter.format(runs) + " successful runs" : "") +
        (failures > 0 ? " and " + fullFormatter.format(failures) + " failed attempts" : "");

      if (net > 0) {
        setState(
          "positive",
          "POSITIVE ESTIMATE",
          "Estimated revenue exceeds entered costs" + sampleText + ". Repeat the test before treating it as typical.",
        );
      } else if (net < 0) {
        setState(
          "negative",
          "LOSS ESTIMATE",
          "Entered costs exceed revenue" + sampleText + ". Review risk, fees and failed-attempt costs before repeating.",
        );
      } else if (gross === 0 && totalCosts === 0) {
        setState(
          "neutral",
          "READY TO MEASURE",
          "Enter gross value and any known costs. Blank optional fields count as zero.",
        );
      } else {
        setState("neutral", "BREAK EVEN", "Estimated gross value equals the entered costs" + sampleText + ".");
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", update);
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      update();
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(update);
    });
    update();
  }

  function initMoneyGuide() {
    initMethodFinder();
    initNetProfitCalculator();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMoneyGuide);
  } else {
    initMoneyGuide();
  }
})();
