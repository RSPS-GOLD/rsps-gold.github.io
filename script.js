(function () {
  var discordUsername = "a6d9";
  var exampleMessage =
    "Hi, I want to buy RSPS gold.\nServer: Roat PKZ\nAmount: 100M\nWhat is the current rate?";
  var toast = document.getElementById("copy-toast");
  var toastTimer;
  var impactSlayerTaskTiers = [
    {
      key: "normal",
      name: "Normal",
      min: 1,
      max: 64,
      points: 400,
      next: "Hard tasks unlock at level 65.",
      note: "Use this tier to learn the task loop and build your first point reserve.",
    },
    {
      key: "hard",
      name: "Hard",
      min: 65,
      max: 84,
      points: 700,
      next: "Elite boss tasks unlock at level 85.",
      note: "Check whether the assigned location supports efficient bursting or barraging.",
    },
    {
      key: "elite",
      name: "Elite",
      min: 85,
      max: 99,
      points: 1250,
      next: "Elite is the final Slayer task tier.",
      note: "Confirm boss access, mechanics, supplies and death risk before the trip.",
    },
  ];
  var impactHunterData = {
    stages: [
      {
        min: 1,
        max: 4,
        creature: "Crimson swifts",
        trap: "bird snare",
        location: "the north-east side of Hunter Island",
        access: "Use ::home, then the Spiritual Fairy Tree to Hunter Island.",
        risk: "Non-Wilderness route",
      },
      {
        min: 5,
        max: 8,
        creature: "Golden warblers",
        trap: "bird snare",
        location: "the west side of Hunter Island",
        access: "Use ::home, then the Spiritual Fairy Tree to Hunter Island.",
        risk: "Non-Wilderness route",
      },
      {
        min: 9,
        max: 18,
        creature: "Copper longtails",
        trap: "bird snare",
        location: "the east side of Hunter Island",
        access: "Use ::home, then the Spiritual Fairy Tree to Hunter Island.",
        risk: "Non-Wilderness route",
      },
      {
        min: 19,
        max: 52,
        creature: "Tropical wagtails",
        trap: "bird snare",
        location: "the centre of Hunter Island",
        access: "Use ::home, then the Spiritual Fairy Tree to Hunter Island.",
        risk: "Non-Wilderness route",
      },
      {
        min: 53,
        max: 62,
        creature: "grey chinchompas",
        trap: "box trap",
        location: "the Hunter Island chinchompa area south of the teleport",
        access: "Use the Spiritual Fairy Tree to Hunter Island and run south.",
        risk: "Non-Wilderness route",
      },
      {
        min: 63,
        max: 72,
        creature: "red chinchompas",
        trap: "box trap",
        location: "the Hunter Island chinchompa area south of the teleport",
        access: "Use the Spiritual Fairy Tree to Hunter Island and run south.",
        risk: "Non-Wilderness route",
      },
      {
        min: 73,
        max: 99,
        alternatives: {
          wilderness: {
            creature: "black chinchompas",
            trap: "box trap",
            location: "the ::chins destination",
            access: "Use ::chins after preparing a low-risk Wilderness setup.",
            risk: "Unsafe single-combat Wilderness",
          },
          "avoid-wilderness": {
            creature: "red chinchompas",
            trap: "box trap",
            location: "the Hunter Island chinchompa area south of the teleport",
            access: "Use the Spiritual Fairy Tree to Hunter Island and run south.",
            risk: "Non-Wilderness route",
          },
        },
      },
    ],
    trapLimits: [
      { min: 1, max: 19, count: 1 },
      { min: 20, max: 39, count: 2 },
      { min: 40, max: 59, count: 3 },
      { min: 60, max: 79, count: 4 },
      { min: 80, max: 99, count: 5 },
    ],
  };
  var impactThievingData = {
    stages: [
      {
        minLevel: 1,
        maxLevel: 4,
        target: "Man",
        action: "Pickpocket",
        location: "Home Thieving area",
        access: "Use ::home and run south.",
        section: "home-route",
      },
      {
        minLevel: 5,
        maxLevel: 19,
        target: "Bakery stall",
        action: "Steal from",
        location: "Home Thieving area",
        access: "Use ::home, run south and follow marker 2.",
        section: "home-route",
      },
      {
        minLevel: 20,
        maxLevel: 34,
        target: "Silk stall",
        action: "Steal from",
        location: "Home Thieving area",
        access: "Use ::home, run south and follow marker 3.",
        section: "home-route",
      },
      {
        minLevel: 35,
        maxLevel: 49,
        target: "Fur Stall",
        action: "Steal from",
        location: "Ardougne, south of the teleport",
        access: "Use the Spiritual Fairy Tree at Home and select Ardougne.",
        section: "fur-stall",
        alternative: {
          minLevel: 40,
          text: "Guards are also documented as an optional manual pickpocket route from level 40.",
        },
      },
      {
        minLevel: 50,
        maxLevel: 64,
        target: "Silver Stall",
        action: "Steal from",
        location: "Ardougne, north of the teleport",
        access: "Use the Spiritual Fairy Tree at Home and select Ardougne.",
        section: "silver-stall",
        alternative: {
          minLevel: 40,
          text: "Guards remain the documented optional pickpocket branch before the level-75 stage.",
        },
      },
      {
        minLevel: 65,
        maxLevel: 74,
        target: "highlighted high-level stall",
        action: "Steal from",
        location: "the Thieving stall row at Home",
        access: "Return with ::home and use the highlighted stall shown in the guide.",
        section: "spice-stall",
        alternative: {
          minLevel: 40,
          text: "Guards remain the documented optional pickpocket branch before the level-75 stage.",
        },
      },
      {
        minLevel: 75,
        maxLevel: 84,
        target: "end stall",
        action: "Steal from stall",
        location: "the end of the Thieving stall row at Home",
        access: "Use ::home and move to the stall on the end.",
        section: "gem-stall",
      },
      {
        minLevel: 85,
        maxLevel: 99,
        alternatives: {
          stall: {
            target: "end stall",
            action: "Steal from",
            location: "the end of the Thieving stall row at Home",
            access: "Use ::home and move to the stall on the end.",
            section: "gem-stall",
          },
          pickpocket: {
            target: "Arvel",
            action: "Pickpocket",
            location: "the Thieving stalls at Home",
            access: "Use ::home and find Arvel beside the stall row.",
            section: "arvel",
          },
        },
      },
    ],
  };

  function reportInteraction(action, element) {
    if (!action) return;

    window.dispatchEvent(
      new CustomEvent("rspshub:interaction", {
        detail: {
          action: action,
          page: window.location.pathname,
          label: (element && element.textContent
            ? element.textContent
            : ""
          ).trim(),
        },
      }),
    );
  }

  function showCopied(message) {
    if (!toast) return;
    toast.textContent = message || "Copied";
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function fallbackCopy(text) {
    var textArea = document.createElement("textarea");
    var copied = false;
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(textArea);
    return copied;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard
        .writeText(text)
        .then(function () {
          return true;
        })
        .catch(function () {
          return fallbackCopy(text);
        });
    }

    return Promise.resolve(fallbackCopy(text));
  }

  function getCopyText(button) {
    var targetId = button.getAttribute("data-copy-target");
    if (targetId) {
      var target = document.getElementById(targetId);
      return target ? target.textContent.trim() : "";
    }

    return button.getAttribute("data-copy") === "example"
      ? exampleMessage
      : discordUsername;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      var reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      if (history.pushState) {
        history.pushState(null, "", targetId);
      }
    });
  });

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = getCopyText(button);
      var successMessage = button.getAttribute("data-copy-success") || "Copied";
      reportInteraction(button.getAttribute("data-action"), button);

      var originalText = button.textContent;
      if (!text) {
        showCopied("Copy failed - copy the text manually");
        return;
      }

      copyText(text).then(function (copied) {
        showCopied(copied ? successMessage : "Copy failed - copy the text manually");
        if (!copied) return;

        button.textContent = successMessage;
        window.setTimeout(function () {
          button.textContent = originalText;
        }, 1400);
      });
    });
  });

  document
    .querySelectorAll("[data-action]:not(.copy-btn)")
    .forEach(function (element) {
      element.addEventListener("click", function () {
        reportInteraction(element.getAttribute("data-action"), element);
      });
    });

  document.querySelectorAll(".faq-list details").forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;

      document.querySelectorAll(".faq-list details").forEach(function (other) {
        if (other !== item) {
          other.removeAttribute("open");
        }
      });
    });
  });

  function initImpactRankCalculator() {
    var form = document.getElementById("impax-rank-calculator");
    if (!form) return;

    var impactRanks = {
      knight: {
        name: "Knight",
        requirement: null,
        requirementLabel: "Membership bond",
        icon: "assets/impact-rank-set/impact-rank-knight.png",
      },
      baron: {
        name: "Baron",
        requirement: 500,
        requirementLabel: "500 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-baron.png",
      },
      paladin: {
        name: "Paladin",
        requirement: 2000,
        requirementLabel: "2,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-paladin.png",
      },
      warlord: {
        name: "Warlord",
        requirement: 6000,
        requirementLabel: "6,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-warlord.png",
      },
      governor: {
        name: "Governor",
        requirement: 12500,
        requirementLabel: "12,500 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-governor.png",
      },
      duke: {
        name: "Duke",
        requirement: 25000,
        requirementLabel: "25,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-duke.png",
      },
      prince: {
        name: "Prince",
        requirement: 50000,
        requirementLabel: "50,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-prince.png",
      },
      king: {
        name: "King",
        requirement: 100000,
        requirementLabel: "100,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-king.png",
      },
      emperor: {
        name: "Emperor",
        requirement: 200000,
        requirementLabel: "200,000 Spent Impax",
        icon: "assets/impact-rank-set/impact-rank-emperor.png",
      },
    };

    var currentSpentInput = document.getElementById("current-spent-impax");
    var targetRankSelect = document.getElementById("target-impact-rank");
    var pricePerImpaxInput = document.getElementById("price-per-impax");
    var previewIcon = document.getElementById("calculator-preview-icon");
    var previewName = document.getElementById("calculator-preview-name");
    var previewRequirement = document.getElementById(
      "calculator-preview-requirement",
    );
    var resultIcon = document.getElementById("calculator-result-icon");
    var resultTitle = document.getElementById("calculator-result-title");
    var resultRequirement = document.getElementById(
      "calculator-result-requirement",
    );
    var requiredOutput = document.getElementById("calculator-required");
    var currentOutput = document.getElementById("calculator-current");
    var remainingOutput = document.getElementById("calculator-remaining");
    var costOutput = document.getElementById("calculator-cost");
    var progressLabel = document.getElementById("calculator-progress-label");
    var progressText = document.getElementById("calculator-progress-text");
    var progressBar = document.getElementById("calculator-progress");
    var status = document.getElementById("calculator-status");
    var commercePanel = document.getElementById("rank-calculator-commerce");
    var commerceSummary = document.getElementById(
      "rank-calculator-commerce-summary",
    );
    var integerFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    });
    var maxPricePerImpax = 100000000;
    var billionsFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });

    function formatBillionsGp(value) {
      return billionsFormatter.format(value / 1000000000) + "B GP";
    }

    function updateCommercePanel(calculation) {
      if (!commercePanel || !commerceSummary) return;

      var shouldShow =
        calculation.rank &&
        calculation.rank.requirement !== null &&
        calculation.currentSpent !== null &&
        Number.isFinite(calculation.currentSpent) &&
        calculation.remainingImpax > 0 &&
        calculation.pricePerImpax > 0 &&
        Number.isFinite(calculation.pricePerImpax) &&
        calculation.estimatedCost > 0 &&
        Number.isFinite(calculation.estimatedCost);

      if (!shouldShow) {
        commercePanel.hidden = true;
        return;
      }

      commerceSummary.textContent =
        "Your current estimate for " +
        calculation.rank.name +
        " is " +
        formatBillionsGp(calculation.estimatedCost) +
        ".";
      commercePanel.hidden = false;
    }

    function setCostOutput(displayValue, fullValue) {
      costOutput.textContent = displayValue;
      if (fullValue) {
        costOutput.title = fullValue;
        costOutput.setAttribute("aria-label", fullValue);
      } else {
        costOutput.removeAttribute("title");
        costOutput.removeAttribute("aria-label");
      }
    }

    function parseNonNegative(input, useWholeNumber) {
      var rawValue = input.value.trim();
      if (rawValue === "") return null;

      var parsedValue = Number(rawValue);
      if (!Number.isFinite(parsedValue)) return null;

      var normalizedValue = Math.max(parsedValue, 0);
      return useWholeNumber ? Math.floor(normalizedValue) : normalizedValue;
    }

    function parseGpPrice(input) {
      var rawValue = input.value.trim().toLowerCase();
      if (rawValue === "") return null;
      if (!/^(?:\d+(?:\.\d*)?|\.\d+)m?$/.test(rawValue)) return null;

      var usesMillions = rawValue.endsWith("m");
      var numericPart = usesMillions ? rawValue.slice(0, -1) : rawValue;
      var parsedValue = Number(numericPart);
      if (!Number.isFinite(parsedValue) || parsedValue < 0) return null;

      var gpValue = usesMillions ? parsedValue * 1000000 : parsedValue;
      return Math.min(Math.floor(gpValue), maxPricePerImpax);
    }

    function sanitizeGpPriceInput() {
      var rawValue = pricePerImpaxInput.value.toLowerCase();
      if (rawValue.includes("-") || /[a-ln-z]/i.test(rawValue)) {
        pricePerImpaxInput.value = "";
        return;
      }

      var cleanedValue = rawValue
        .replace(/,/g, "")
        .replace(/[^0-9.m]/g, "");
      var usesMillions = cleanedValue.includes("m");
      cleanedValue = cleanedValue.replace(/m/g, "");

      var decimalIndex = cleanedValue.indexOf(".");
      if (decimalIndex !== -1) {
        cleanedValue =
          cleanedValue.slice(0, decimalIndex + 1) +
          cleanedValue.slice(decimalIndex + 1).replace(/\./g, "");
      }

      if (usesMillions) cleanedValue += "m";
      pricePerImpaxInput.value = cleanedValue;

      var parsedValue = parseGpPrice(pricePerImpaxInput);
      if (parsedValue === maxPricePerImpax) {
        var unclampedValue = Number(
          usesMillions ? cleanedValue.slice(0, -1) : cleanedValue,
        );
        var unclampedGp = usesMillions
          ? unclampedValue * 1000000
          : unclampedValue;
        if (Number.isFinite(unclampedGp) && unclampedGp > maxPricePerImpax) {
          pricePerImpaxInput.value = usesMillions ? "100m" : "100000000";
        }
      }
    }

    function clampNegativeInput(input) {
      if (input.value === "") return;
      var parsedValue = Number(input.value);
      if (Number.isFinite(parsedValue) && parsedValue < 0) {
        input.value = "0";
      }
    }

    function setRankArtwork(rank) {
      var altText = rank.name + " rank icon";
      previewIcon.src = rank.icon;
      previewIcon.alt = altText;
      previewName.textContent = rank.name;
      previewRequirement.textContent = rank.requirementLabel;
      resultIcon.src = rank.icon;
      resultIcon.alt = altText;
      resultTitle.textContent = rank.name;
      resultRequirement.textContent =
        rank.requirement === null
          ? "Membership bond rank"
          : rank.requirementLabel + " required";
    }

    function setProgress(rankName, percent, valueText) {
      var safePercent = Math.min(Math.max(percent, 0), 100);
      progressLabel.textContent = "Progress toward " + rankName;
      progressText.textContent = valueText || Math.round(safePercent) + "%";
      progressBar.style.setProperty("--rank-progress", safePercent + "%");
      progressBar.setAttribute("aria-valuenow", String(Math.round(safePercent)));
      progressBar.setAttribute(
        "aria-valuetext",
        valueText || Math.round(safePercent) + " percent",
      );
    }

    function setStatus(message, state) {
      status.textContent = message;
      status.classList.remove("is-complete", "is-neutral");
      if (state) status.classList.add(state);
    }

    function updateCalculator() {
      clampNegativeInput(currentSpentInput);

      var rank = impactRanks[targetRankSelect.value] || impactRanks.baron;
      var currentSpent = parseNonNegative(currentSpentInput, true);
      var pricePerImpax = parseGpPrice(pricePerImpaxInput);

      setRankArtwork(rank);
      updateCommercePanel({
        rank: rank,
        currentSpent: currentSpent,
        remainingImpax: null,
        pricePerImpax: pricePerImpax,
        estimatedCost: null,
      });

      if (rank.requirement === null) {
        requiredOutput.textContent = "Membership bond";
        currentOutput.textContent = "Not applicable";
        remainingOutput.textContent = "Not applicable";
        setCostOutput("Not applicable");
        setProgress(rank.name, 0, "Not applicable");
        setStatus(
          "Knight is activated with a Membership bond rather than a Spent Impax requirement.",
          "is-neutral",
        );
        return;
      }

      requiredOutput.textContent = integerFormatter.format(rank.requirement);

      if (currentSpent === null) {
        currentOutput.textContent = "\u2014";
        remainingOutput.textContent = "\u2014";
        setCostOutput("\u2014");
        setProgress(rank.name, 0);
        setStatus(
          pricePerImpax === null
            ? "Enter your current Spent Impax and price per Impax to estimate the upgrade cost."
            : "Enter your current Spent Impax to calculate the remaining amount.",
          "is-neutral",
        );
        return;
      }

      var remainingImpax = Math.max(rank.requirement - currentSpent, 0);
      var progressPercent = Math.min(
        (currentSpent / rank.requirement) * 100,
        100,
      );

      currentOutput.textContent = integerFormatter.format(currentSpent);
      remainingOutput.textContent = integerFormatter.format(remainingImpax);
      setProgress(rank.name, progressPercent);

      if (remainingImpax === 0) {
        setCostOutput("0B GP", "0 GP");
        setStatus(
          "You have already reached the " + rank.name + " requirement.",
          "is-complete",
        );
        return;
      }

      if (pricePerImpax === null) {
        setCostOutput("\u2014");
        setStatus(
          "You need " +
            integerFormatter.format(remainingImpax) +
            " more Spent Impax. Enter a price per Impax to estimate the additional cost.",
          "is-neutral",
        );
        return;
      }

      var estimatedCost = remainingImpax * pricePerImpax;
      if (!Number.isFinite(estimatedCost)) {
        setCostOutput("\u2014");
        setStatus(
          "The entered values are too large to produce a reliable estimate.",
          "is-neutral",
        );
        return;
      }

      var fullCost = integerFormatter.format(estimatedCost) + " GP";
      var compactCost = formatBillionsGp(estimatedCost);
      setCostOutput(compactCost, fullCost);
      updateCommercePanel({
        rank: rank,
        currentSpent: currentSpent,
        remainingImpax: remainingImpax,
        pricePerImpax: pricePerImpax,
        estimatedCost: estimatedCost,
      });
      setStatus(
        "You need " +
          integerFormatter.format(remainingImpax) +
          " more Spent Impax to reach " +
          rank.name +
          ". At " +
          integerFormatter.format(pricePerImpax) +
          " GP per Impax, the estimated additional cost is " +
          compactCost +
          ".",
      );
    }

    currentSpentInput.addEventListener("input", updateCalculator);
    pricePerImpaxInput.addEventListener("input", function () {
      sanitizeGpPriceInput();
      updateCalculator();
    });
    targetRankSelect.addEventListener("change", updateCalculator);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(updateCalculator);
    });

    updateCalculator();
  }

  function initImpactProfitCalculator() {
    var form = document.getElementById("impact-profit-calculator");
    if (!form) return;

    var sessionInput = document.getElementById("money-session-minutes");
    var lootInput = document.getElementById("money-loot-value");
    var suppliesInput = document.getElementById("money-supply-costs");
    var lossesInput = document.getElementById("money-loss-costs");
    var result = document.getElementById("money-profit-result");
    var state = document.getElementById("money-profit-state");
    var heading = document.getElementById("money-profit-heading");
    var totalCostsOutput = document.getElementById("money-total-costs");
    var netProfitOutput = document.getElementById("money-net-profit");
    var gpHourOutput = document.getElementById("money-gp-hour");
    var summary = document.getElementById("money-profit-summary");
    var moneyInputs = [lootInput, suppliesInput, lossesInput];
    var multipliers = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000,
    };
    var fullFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    });
    var compactFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });

    function parseImpactNumber(input) {
      var rawValue = input.value.trim().toLowerCase();
      if (rawValue === "") return { value: null, empty: true, valid: true };

      var match = rawValue.match(/^(?:\d+(?:\.\d*)?|\.\d+)([kmbt])?$/);
      if (!match) return { value: null, empty: false, valid: false };

      var suffix = match[1] || "";
      var numericValue = Number(suffix ? rawValue.slice(0, -1) : rawValue);
      var value = numericValue * (multipliers[suffix] || 1);
      var valid =
        Number.isFinite(numericValue) &&
        numericValue >= 0 &&
        Number.isFinite(value) &&
        value <= Number.MAX_SAFE_INTEGER;

      return { value: valid ? value : null, empty: false, valid: valid };
    }

    function parseSessionMinutes() {
      var rawValue = sessionInput.value.trim();
      if (rawValue === "") return { value: null, empty: true, valid: true };
      if (!/^\d+(?:\.\d+)?$/.test(rawValue)) {
        return { value: null, empty: false, valid: false };
      }

      var value = Number(rawValue);
      return {
        value: Number.isFinite(value) && value > 0 ? value : null,
        empty: false,
        valid: Number.isFinite(value) && value > 0,
      };
    }

    function formatCompactGp(value) {
      var absoluteValue = Math.abs(value);
      var units = [
        { threshold: 1000000000000, suffix: "T" },
        { threshold: 1000000000, suffix: "B" },
        { threshold: 1000000, suffix: "M" },
        { threshold: 1000, suffix: "K" },
      ];
      var unit = units.find(function (item) {
        return absoluteValue >= item.threshold;
      });
      var sign = value < 0 ? "-" : "";

      if (!unit) return sign + fullFormatter.format(Math.round(absoluteValue)) + " GP";
      return (
        sign +
        compactFormatter.format(absoluteValue / unit.threshold) +
        unit.suffix +
        " GP"
      );
    }

    function formatFullGp(value) {
      var roundedValue = Math.round(value);
      return fullFormatter.format(roundedValue) + " GP";
    }

    function setOutput(element, value) {
      var compactValue = formatCompactGp(value);
      var fullValue = formatFullGp(value);
      element.textContent = compactValue;
      element.setAttribute("aria-label", fullValue);
      element.title = fullValue;
    }

    function clearOutput(element) {
      element.textContent = "—";
      element.removeAttribute("aria-label");
      element.removeAttribute("title");
    }

    function setResultState(resultState, label, title, message) {
      result.classList.remove("is-positive", "is-neutral", "is-negative");
      result.classList.add("is-" + resultState);
      state.textContent = label;
      heading.textContent = title;
      summary.textContent = message;
    }

    function updateProfitCalculator() {
      var session = parseSessionMinutes();
      var moneyValues = moneyInputs.map(parseImpactNumber);
      var hasInvalidMoney = moneyValues.some(function (item) {
        return !item.valid;
      });

      sessionInput.setAttribute("aria-invalid", String(!session.valid));
      moneyInputs.forEach(function (input, index) {
        input.setAttribute("aria-invalid", String(!moneyValues[index].valid));
      });

      if (!session.valid || hasInvalidMoney) {
        clearOutput(totalCostsOutput);
        clearOutput(netProfitOutput);
        clearOutput(gpHourOutput);
        setResultState(
          "negative",
          "CHECK THE VALUES",
          "Use a valid session and GP values",
          "Session length must be greater than zero. GP values must be non-negative numbers with an optional K, M, B or T suffix.",
        );
        return;
      }

      if (
        session.empty ||
        moneyValues.some(function (item) {
          return item.empty;
        })
      ) {
        clearOutput(totalCostsOutput);
        clearOutput(netProfitOutput);
        clearOutput(gpHourOutput);
        setResultState(
          "neutral",
          "READY TO CALCULATE",
          "Enter a completed session",
          "Enter a session length and values to calculate your result.",
        );
        return;
      }

      var lootValue = moneyValues[0].value;
      var supplies = moneyValues[1].value;
      var lossesAndFees = moneyValues[2].value;
      var totalCosts = supplies + lossesAndFees;
      var netProfit = lootValue - totalCosts;
      var gpPerHour = netProfit * (60 / session.value);

      if (
        !Number.isFinite(totalCosts) ||
        !Number.isFinite(netProfit) ||
        !Number.isFinite(gpPerHour)
      ) {
        clearOutput(totalCostsOutput);
        clearOutput(netProfitOutput);
        clearOutput(gpHourOutput);
        setResultState(
          "negative",
          "CHECK THE VALUES",
          "The result is too large",
          "Reduce the entered values and try again.",
        );
        return;
      }

      setOutput(totalCostsOutput, totalCosts);
      setOutput(netProfitOutput, netProfit);
      setOutput(gpHourOutput, gpPerHour);

      if (netProfit > 0) {
        setResultState(
          "positive",
          "POSITIVE SESSION",
          "The session finished in profit",
          "Your estimated net result is " +
            formatCompactGp(netProfit) +
            " (" +
            formatFullGp(netProfit) +
            "), or approximately " +
            formatCompactGp(gpPerHour) +
            " per hour (" +
            formatFullGp(gpPerHour) +
            " per hour).",
        );
      } else if (netProfit < 0) {
        setResultState(
          "negative",
          "NEGATIVE SESSION",
          "The session finished at a loss",
          "This session lost approximately " +
            formatCompactGp(Math.abs(netProfit)) +
            " (" +
            formatFullGp(Math.abs(netProfit)) +
            ") after supplies and other costs. The hourly equivalent is " +
            formatCompactGp(gpPerHour) +
            ".",
        );
      } else {
        setResultState(
          "neutral",
          "BREAK-EVEN SESSION",
          "The session broke even",
          "Loot value and total costs were equal. The estimated net result is 0 GP.",
        );
      }
    }

    form.addEventListener("input", updateProfitCalculator);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(updateProfitCalculator);
    });

    updateProfitCalculator();
  }

  function initImpactSlayerTierHelper() {
    var form = document.getElementById("slayer-tier-helper");
    if (!form) return;

    var levelInput = document.getElementById("slayer-current-level");
    var result = document.getElementById("slayer-tier-result");
    if (!levelInput || !result) return;

    var numberFormatter = new Intl.NumberFormat("en-US");

    function showDefaultResult() {
      levelInput.setAttribute("aria-invalid", "false");
      result.classList.remove("is-error", "is-result");
      result.textContent =
        "Enter your current level to see the active tier, point payout and next unlock.";
    }

    function updateTierResult() {
      var rawValue = levelInput.value.trim();
      var isInteger = /^\d+$/.test(rawValue);
      var level = isInteger ? Number(rawValue) : NaN;
      var isValid =
        isInteger &&
        Number.isInteger(level) &&
        level >= 1 &&
        level <= 99;

      levelInput.setAttribute("aria-invalid", String(!isValid));
      result.classList.toggle("is-error", !isValid);
      result.classList.toggle("is-result", isValid);

      if (!isValid) {
        result.textContent =
          "Enter a whole Slayer level from 1 through 99.";
        return;
      }

      var tier = impactSlayerTaskTiers.find(function (item) {
        return level >= item.min && level <= item.max;
      });

      if (!tier) {
        result.textContent =
          "The entered level does not match a documented Slayer tier.";
        return;
      }

      result.textContent =
        "At level " +
        level +
        ", you are in the " +
        tier.name +
        " task tier. " +
        tier.name +
        " tasks award " +
        numberFormatter.format(tier.points) +
        " Slayer points per completion. " +
        tier.next +
        " " +
        tier.note;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      updateTierResult();
    });
    levelInput.addEventListener("input", function () {
      if (levelInput.value.trim() === "") {
        showDefaultResult();
      }
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(showDefaultResult);
    });

    showDefaultResult();
  }

  function initImpactSlayerDirectory() {
    var form = document.getElementById("slayer-directory-filters");
    if (!form) return;

    var searchInput = document.getElementById("slayer-monster-search");
    var riskFilter = document.getElementById("slayer-risk-filter");
    var barrageFilter = document.getElementById("slayer-barrage-filter");
    var bossFilter = document.getElementById("slayer-boss-filter");
    var tableWrap = document.getElementById("slayer-directory-table-wrap");
    var count = document.getElementById("slayer-directory-count");
    var emptyState = document.getElementById("slayer-directory-empty");
    var rows = Array.prototype.slice.call(
      document.querySelectorAll("#slayer-directory-body tr"),
    );

    if (
      !searchInput ||
      !riskFilter ||
      !barrageFilter ||
      !bossFilter ||
      !tableWrap ||
      !count ||
      !emptyState ||
      !rows.length
    ) {
      return;
    }

    function selectedTier() {
      var checked = form.querySelector(
        'input[name="slayer-tier-filter"]:checked',
      );
      return checked ? checked.value : "all";
    }

    function updateDirectory() {
      var query = searchInput.value.trim().toLowerCase();
      var tier = selectedTier();
      var risk = riskFilter.value;
      var requiresBarrage = barrageFilter.checked;
      var requiresBoss = bossFilter.checked;
      var visibleCount = 0;

      rows.forEach(function (row) {
        var matchesSearch =
          !query || (row.dataset.search || "").indexOf(query) !== -1;
        var matchesTier = tier === "all" || row.dataset.tier === tier;
        var matchesRisk = risk === "all" || row.dataset.risk === risk;
        var matchesBarrage =
          !requiresBarrage || row.dataset.barrage === "true";
        var matchesBoss = !requiresBoss || row.dataset.boss === "true";
        var matches =
          matchesSearch &&
          matchesTier &&
          matchesRisk &&
          matchesBarrage &&
          matchesBoss;

        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      tableWrap.hidden = visibleCount === 0;
      emptyState.hidden = visibleCount !== 0;
      count.textContent =
        visibleCount === 1
          ? "1 verified task or route entry shown."
          : visibleCount + " verified task or route entries shown.";
    }

    form.hidden = false;
    form.addEventListener("input", updateDirectory);
    form.addEventListener("change", updateDirectory);
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(updateDirectory);
    });

    updateDirectory();
  }

  function initImpactHunterPlanner() {
    var form = document.getElementById("hunter-level-planner");
    if (!form) return;

    var levelInput = document.getElementById("hunter-current-level");
    var result = document.getElementById("hunter-planner-result");
    if (!levelInput || !result) return;

    function showDefaultResult() {
      levelInput.setAttribute("aria-invalid", "false");
      result.classList.remove("is-error", "is-result");
      result.textContent =
        "Enter your level to see the recommended creature, trap limit, location, risk and next unlock.";
    }

    function selectedPreference() {
      var selected = form.querySelector(
        'input[name="hunter-route-preference"]:checked',
      );
      return selected ? selected.value : "avoid-wilderness";
    }

    function nextDocumentedChange(level, stage, trapLimit) {
      var events = [];
      var nextStage = impactHunterData.stages.find(function (item) {
        return item.min > stage.min;
      });
      var nextTrapLimit = impactHunterData.trapLimits.find(function (item) {
        return item.min > trapLimit.min;
      });

      if (nextStage) {
        events.push({
          level: nextStage.min,
          text:
            nextStage.min === 73
              ? "the Wilderness or Hunter Island route decision"
              : "the next recommended creature",
        });
      }
      if (nextTrapLimit) {
        events.push({
          level: nextTrapLimit.min,
          text:
            nextTrapLimit.count +
            " active " +
            (nextTrapLimit.count === 1 ? "trap" : "traps"),
        });
      }

      events.sort(function (a, b) {
        return a.level - b.level;
      });
      if (!events.length) return null;

      var nextLevel = events[0].level;
      var sameLevelEvents = events.filter(function (event) {
        return event.level === nextLevel;
      });
      return {
        level: nextLevel,
        remaining: nextLevel - level,
        text: sameLevelEvents
          .map(function (event) {
            return event.text;
          })
          .join(" and "),
      };
    }

    function updatePlanner() {
      var rawValue = levelInput.value.trim();
      var isInteger = /^\d+$/.test(rawValue);
      var level = isInteger ? Number(rawValue) : NaN;
      var isValid =
        isInteger &&
        Number.isInteger(level) &&
        level >= 1 &&
        level <= 99;

      levelInput.setAttribute("aria-invalid", String(!isValid));
      result.classList.toggle("is-error", !isValid);
      result.classList.toggle("is-result", isValid);

      if (!isValid) {
        result.textContent =
          "Enter a whole Hunter level from 1 through 99.";
        return;
      }

      var stage = impactHunterData.stages.find(function (item) {
        return level >= item.min && level <= item.max;
      });
      var trapLimit = impactHunterData.trapLimits.find(function (item) {
        return level >= item.min && level <= item.max;
      });

      if (!stage || !trapLimit) {
        result.textContent =
          "The entered level does not match the documented Hunter route.";
        return;
      }

      var method = stage.alternatives
        ? stage.alternatives[selectedPreference()]
        : stage;
      var nextChange = nextDocumentedChange(level, stage, trapLimit);
      var trapLabel =
        trapLimit.count +
        " " +
        method.trap +
        (trapLimit.count === 1 ? "" : "s");
      var nextText;

      if (nextChange) {
        nextText =
          " Next change: " +
          nextChange.text +
          " at level " +
          nextChange.level +
          " (" +
          nextChange.remaining +
          " " +
          (nextChange.remaining === 1 ? "level" : "levels") +
          " remaining).";
      } else if (level === 99) {
        nextText = " The documented 1–99 route is complete.";
      } else {
        nextText =
          " No further creature or trap unlock appears in the documented 1–99 route.";
      }

      result.textContent =
        "At level " +
        level +
        ", train " +
        method.creature +
        " at " +
        method.location +
        " using up to " +
        trapLabel +
        ". " +
        method.access +
        " Risk: " +
        method.risk +
        "." +
        nextText;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      updatePlanner();
    });
    form.addEventListener("change", function () {
      if (levelInput.value.trim() !== "") updatePlanner();
    });
    levelInput.addEventListener("input", function () {
      if (levelInput.value.trim() === "") showDefaultResult();
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(showDefaultResult);
    });

    showDefaultResult();
  }

  function initImpactThievingPlanner() {
    var form = document.getElementById("thieving-level-planner");
    if (!form) return;

    var levelInput = document.getElementById("thieving-current-level");
    var result = document.getElementById("thieving-planner-result");
    if (!levelInput || !result) return;

    function showDefaultResult() {
      levelInput.setAttribute("aria-invalid", "false");
      result.classList.remove("is-error", "is-result");
      result.textContent =
        "Enter your level to see the recommended target, action, location, travel route and next unlock.";
    }

    function selectedPreference() {
      var selected = form.querySelector(
        'input[name="thieving-route-preference"]:checked',
      );
      return selected ? selected.value : "both";
    }

    function addResultLink(section, label) {
      var link = document.createElement("a");
      link.href = "#" + section;
      link.textContent = label;
      result.appendChild(document.createTextNode(" "));
      result.appendChild(link);
    }

    function updatePlanner() {
      var rawValue = levelInput.value.trim();
      var isInteger = /^\d+$/.test(rawValue);
      var level = isInteger ? Number(rawValue) : NaN;
      var isValid =
        isInteger &&
        Number.isInteger(level) &&
        level >= 1 &&
        level <= 99;

      levelInput.setAttribute("aria-invalid", String(!isValid));
      result.classList.toggle("is-error", !isValid);
      result.classList.toggle("is-result", isValid);

      if (!isValid) {
        result.textContent =
          "Enter a whole Thieving level from 1 through 99.";
        return;
      }

      var stage = impactThievingData.stages.find(function (item) {
        return level >= item.minLevel && level <= item.maxLevel;
      });
      if (!stage) {
        result.textContent =
          "The entered level does not match the documented Thieving route.";
        return;
      }

      var nextStage = impactThievingData.stages.find(function (item) {
        return item.minLevel > stage.minLevel;
      });
      var nextText = "";
      if (nextStage) {
        var remaining = nextStage.minLevel - level;
        var nextTarget = nextStage.alternatives
          ? "the end-stall or Arvel choice"
          : nextStage.target;
        nextText =
          " " +
          (remaining === 1 ? "1 level remains" : remaining + " levels remain") +
          " until " +
          nextTarget +
          " unlocks at level " +
          nextStage.minLevel +
          ".";
      } else if (level === 99) {
        nextText = " The documented 1–99 route is complete.";
      } else {
        nextText =
          " No further target unlock appears in the documented 1–99 route.";
      }

      result.textContent = "";
      if (stage.alternatives) {
        var preference = selectedPreference();
        if (preference === "both") {
          result.textContent =
            "At level " +
            level +
            ", choose either the end stall at Home or pickpocket Arvel beside the stalls. The official guide presents this as a preference choice and publishes no comparative rate." +
            nextText;
          addResultLink("arvel", "Compare the level-85 routes.");
        } else {
          var method = stage.alternatives[preference];
          var methodTarget =
            method.target === "Arvel" ? method.target : "the " + method.target;
          result.textContent =
            "At level " +
            level +
            ", " +
            method.action.toLowerCase() +
            " " +
            methodTarget +
            " at " +
            method.location +
            ". " +
            method.access +
            nextText;
          addResultLink(method.section, "View this method.");
        }
        return;
      }

      var alternativeText =
        stage.alternative && level >= stage.alternative.minLevel
          ? " " + stage.alternative.text
          : "";
      var stageTarget =
        stage.target === "Arvel" ? stage.target : "the " + stage.target;
      result.textContent =
        "At level " +
        level +
        ", " +
        stage.action.toLowerCase() +
        " " +
        stageTarget +
        " at " +
        stage.location +
        ". " +
        stage.access +
        alternativeText +
        nextText;
      addResultLink(stage.section, "View this stage.");
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      updatePlanner();
    });
    form.addEventListener("change", function () {
      if (levelInput.value.trim() !== "") updatePlanner();
    });
    levelInput.addEventListener("input", function () {
      if (levelInput.value.trim() === "") showDefaultResult();
    });
    form.addEventListener("reset", function () {
      window.requestAnimationFrame(showDefaultResult);
    });

    showDefaultResult();
  }

  function initCompactHeaderMenu() {
    document.querySelectorAll(".site-header").forEach(function (header, index) {
      var inner = header.querySelector(".header__inner");
      var navigation = header.querySelector(".nav");
      if (!inner || !navigation) return;

      if (!navigation.id) {
        navigation.id = "site-navigation-" + (index + 1);
      }

      var menuToggle = document.createElement("button");
      menuToggle.className = "site-menu-toggle";
      menuToggle.type = "button";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-controls", navigation.id);
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.innerHTML =
        '<span class="site-menu-toggle__label">Menu</span>' +
        '<span class="site-menu-toggle__icon" aria-hidden="true"><span></span><span></span><span></span></span>';
      inner.appendChild(menuToggle);
      header.classList.add("has-mobile-menu");

      function setMenuOpen(isOpen, returnFocus) {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
          "aria-label",
          isOpen ? "Close navigation" : "Open navigation",
        );
        navigation.classList.toggle("is-open", isOpen);
        header.classList.toggle("is-menu-open", isOpen);
        if (!isOpen && returnFocus) menuToggle.focus();
      }

      menuToggle.addEventListener("click", function () {
        setMenuOpen(
          menuToggle.getAttribute("aria-expanded") !== "true",
          false,
        );
      });

      navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setMenuOpen(false, false);
        });
      });

      document.addEventListener("keydown", function (event) {
        if (
          event.key === "Escape" &&
          menuToggle.getAttribute("aria-expanded") === "true"
        ) {
          setMenuOpen(false, true);
        }
      });

      document.addEventListener("click", function (event) {
        if (
          menuToggle.getAttribute("aria-expanded") === "true" &&
          !menuToggle.contains(event.target) &&
          !navigation.contains(event.target)
        ) {
          setMenuOpen(false, false);
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 980) setMenuOpen(false, false);
      });
    });
  }

  function initServerProfitCalculators() {
    var forms = document.querySelectorAll("[data-server-profit-calculator]");
    if (!forms.length) return;

    var multipliers = { k: 1000, m: 1000000, b: 1000000000 };
    var fullFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    });
    var compactFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });

    function parseAmount(input, mustBePositive) {
      var rawValue = input.value.trim().toLowerCase();
      if (rawValue === "") return { empty: true, valid: true, value: null };
      var match = rawValue.match(/^(?:\d+(?:\.\d*)?|\.\d+)([kmb])?$/);
      if (!match) return { empty: false, valid: false, value: null };

      var suffix = match[1] || "";
      var numericValue = Number(suffix ? rawValue.slice(0, -1) : rawValue);
      var value = numericValue * (multipliers[suffix] || 1);
      var valid =
        Number.isFinite(value) &&
        value >= 0 &&
        (!mustBePositive || value > 0) &&
        value <= Number.MAX_SAFE_INTEGER;
      return { empty: false, valid: valid, value: valid ? value : null };
    }

    function formatAmount(value, unit) {
      var absoluteValue = Math.abs(value);
      var sign = value < 0 ? "-" : "";
      var scale =
        absoluteValue >= 1000000000
          ? { value: 1000000000, suffix: "B" }
          : absoluteValue >= 1000000
            ? { value: 1000000, suffix: "M" }
            : absoluteValue >= 1000
              ? { value: 1000, suffix: "K" }
              : null;
      if (!scale) {
        return sign + fullFormatter.format(Math.round(absoluteValue)) + " " + unit;
      }
      return (
        sign +
        compactFormatter.format(absoluteValue / scale.value) +
        scale.suffix +
        " " +
        unit
      );
    }

    forms.forEach(function (form) {
      var minutesInput = form.querySelector('[data-profit-field="minutes"]');
      var grossInput = form.querySelector('[data-profit-field="gross"]');
      var suppliesInput = form.querySelector('[data-profit-field="supplies"]');
      var feesInput = form.querySelector('[data-profit-field="fees"]');
      var lossesInput = form.querySelector('[data-profit-field="losses"]');
      var result = form.parentElement.querySelector("[data-profit-result]");
      var state = result && result.querySelector("[data-profit-state]");
      var netOutput = result && result.querySelector("[data-profit-net]");
      var hourlyOutput = result && result.querySelector("[data-profit-hourly]");
      var costsOutput = result && result.querySelector("[data-profit-costs]");
      var summary = result && result.querySelector("[data-profit-summary]");
      var unit = form.getAttribute("data-unit") || "units";
      var inputs = [
        minutesInput,
        grossInput,
        suppliesInput,
        feesInput,
        lossesInput,
      ];
      if (
        inputs.some(function (input) {
          return !input;
        }) ||
        !result ||
        !state ||
        !netOutput ||
        !hourlyOutput ||
        !costsOutput ||
        !summary
      ) {
        return;
      }

      function clearOutputs() {
        [netOutput, hourlyOutput, costsOutput].forEach(function (output) {
          output.textContent = "—";
        });
      }

      function setState(name, label, message) {
        result.classList.remove("is-positive", "is-neutral", "is-negative");
        result.classList.add("is-" + name);
        state.textContent = label;
        summary.textContent = message;
      }

      function update() {
        var values = [
          parseAmount(minutesInput, true),
          parseAmount(grossInput, false),
          parseAmount(suppliesInput, false),
          parseAmount(feesInput, false),
          parseAmount(lossesInput, false),
        ];
        inputs.forEach(function (input, index) {
          input.setAttribute("aria-invalid", String(!values[index].valid));
        });

        if (
          values.some(function (value) {
            return !value.valid;
          })
        ) {
          clearOutputs();
          setState(
            "negative",
            "CHECK THE VALUES",
            "Use non-negative numbers. Currency fields accept an optional K, M or B suffix, and session length must be greater than zero.",
          );
          return;
        }

        if (
          values.some(function (value) {
            return value.empty;
          })
        ) {
          clearOutputs();
          setState(
            "neutral",
            "READY TO CALCULATE",
            "Enter one completed session to calculate its net result and hourly rate.",
          );
          return;
        }

        var totalCosts = values[2].value + values[3].value + values[4].value;
        var net = values[1].value - totalCosts;
        var hourly = net * (60 / values[0].value);
        if (
          !Number.isFinite(totalCosts) ||
          !Number.isFinite(net) ||
          !Number.isFinite(hourly)
        ) {
          clearOutputs();
          setState(
            "negative",
            "CHECK THE VALUES",
            "The result is too large. Reduce the entered values and try again.",
          );
          return;
        }

        costsOutput.textContent = formatAmount(totalCosts, unit);
        netOutput.textContent = formatAmount(net, unit);
        hourlyOutput.textContent = formatAmount(hourly, unit);
        if (net > 0) {
          setState(
            "positive",
            "POSITIVE SESSION",
            "This session finished above the entered costs. Track several sessions before treating the hourly rate as typical.",
          );
        } else if (net < 0) {
          setState(
            "negative",
            "NEGATIVE SESSION",
            "The entered costs exceeded the gross result. Review risk, fees and learning costs before repeating the method.",
          );
        } else {
          setState(
            "neutral",
            "BREAK EVEN",
            "Gross value and total costs are equal for this session.",
          );
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
    });
  }

  function initRoatCommandDirectory() {
    var directory = document.querySelector("[data-roat-command-directory]");
    var controls = document.querySelector("[data-roat-command-controls]");
    var searchInput = document.querySelector("[data-roat-command-search]");
    var categorySelect = document.querySelector("[data-roat-command-category]");
    var countOutput = document.querySelector("[data-roat-command-count]");
    var emptyState = document.querySelector("[data-roat-command-empty]");
    if (
      !directory ||
      !controls ||
      !searchInput ||
      !categorySelect ||
      !countOutput ||
      !emptyState
    ) {
      return;
    }

    var rows = Array.from(directory.querySelectorAll("tbody tr"));
    if (!rows.length) return;

    function normalize(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    }

    function updateDirectory() {
      var query = normalize(searchInput.value);
      var category = categorySelect.value;
      var visibleCount = 0;

      rows.forEach(function (row) {
        var categories = normalize(row.getAttribute("data-command-category"))
          .split(" ")
          .filter(Boolean);
        var matchesCategory =
          category === "all" || categories.indexOf(category) !== -1;
        var matchesQuery = !query || normalize(row.textContent).includes(query);
        var isVisible = matchesCategory && matchesQuery;
        row.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      countOutput.textContent =
        visibleCount === 1
          ? "Showing 1 command"
          : "Showing " + visibleCount + " commands";
      emptyState.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", updateDirectory);
    categorySelect.addEventListener("change", updateDirectory);
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && searchInput.value) {
        searchInput.value = "";
        updateDirectory();
      }
    });

    controls.hidden = false;
    updateDirectory();
  }

  function initRoatMoneyMakingGuide() {
    var finder = document.querySelector("[data-roat-money-finder]");
    var dataElement = document.getElementById("roat-money-methods");
    if (finder && dataElement) {
      var controls = finder.querySelector("[data-roat-money-finder-controls]");
      var results = finder.querySelector("[data-roat-money-results]");
      var emptyState = finder.querySelector("[data-roat-money-empty]");
      var filters = Array.from(finder.querySelectorAll("[data-money-filter]"));
      var methods = [];

      try {
        methods = JSON.parse(dataElement.textContent);
      } catch (error) {
        methods = [];
      }

      function escapeText(value) {
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function getFilter(name) {
        var input = finder.querySelector('[data-money-filter="' + name + '"]');
        return input ? input.value : "";
      }

      function matchesRisk(method, preference) {
        if (preference === "avoid") return method.risk.indexOf("avoid") !== -1;
        if (preference === "some") {
          return method.risk.indexOf("avoid") !== -1 || method.risk.indexOf("some") !== -1;
        }
        return method.risk.indexOf("high") !== -1;
      }

      function matchesAttention(method, preference) {
        var allowed =
          preference === "low"
            ? ["low"]
            : preference === "medium"
              ? ["low", "medium"]
              : ["low", "medium", "high"];
        return method.attention.some(function (value) {
          return allowed.indexOf(value) !== -1;
        });
      }

      function renderFinder() {
        if (!methods.length || !results || !emptyState) return;
        var stage = getFilter("stage");
        var risk = getFilter("risk");
        var attention = getFilter("attention");
        var access = getFilter("access");
        var activity = getFilter("activity");
        var matches = methods
          .filter(function (method) {
            var stageMatch = method.stage.indexOf(stage) !== -1;
            var riskMatch = matchesRisk(method, risk);
            var attentionMatch = matchesAttention(method, attention);
            var accessMatch =
              access === "any" ||
              access === "royal" ||
              (access === "none" && method.access !== "royal");
            var activityMatch = activity === "any" || method.category === activity;
            return stageMatch && riskMatch && attentionMatch && accessMatch && activityMatch;
          })
          .slice(0, 4);

        results.innerHTML = matches
          .map(function (method) {
            return (
              "<article>" +
              '<p class="roat-method-finder__match">MATCHED ROUTE</p>' +
              "<h3>" +
              escapeText(method.name) +
              "</h3>" +
              "<p>" +
              escapeText(method.why) +
              "</p>" +
              '<dl class="roat-method-finder__facts"><div><dt>Requirement</dt><dd>' +
              escapeText(method.requirement) +
              "</dd></div><div><dt>Main risk</dt><dd>" +
              escapeText(method.riskText) +
              "</dd></div></dl>" +
              '<a href="#' +
              escapeText(method.sectionId) +
              '">Review ' +
              escapeText(method.name) +
              "</a>" +
              "</article>"
            );
          })
          .join("");
        results.hidden = matches.length === 0;
        emptyState.hidden = matches.length !== 0;
      }

      if (controls && results && emptyState && filters.length) {
        filters.forEach(function (input) {
          input.addEventListener("change", renderFinder);
        });
        controls.hidden = false;
        renderFinder();
      }
    }

    var calculator = document.querySelector("[data-roat-money-calculator]");
    if (!calculator) return;

    var result = calculator.parentElement.querySelector("[data-roat-calc-result]");
    var state = result && result.querySelector("[data-roat-calc-state]");
    var summary = result && result.querySelector("[data-roat-calc-summary]");
    var fields = {
      minutes: calculator.querySelector('[data-roat-calc="minutes"]'),
      gross: calculator.querySelector('[data-roat-calc="gross"]'),
      supplies: calculator.querySelector('[data-roat-calc="supplies"]'),
      charges: calculator.querySelector('[data-roat-calc="charges"]'),
      scrolls: calculator.querySelector('[data-roat-calc="scrolls"]'),
      fees: calculator.querySelector('[data-roat-calc="fees"]'),
      deaths: calculator.querySelector('[data-roat-calc="deaths"]'),
      lossPerDeath: calculator.querySelector('[data-roat-calc="lossPerDeath"]'),
      other: calculator.querySelector('[data-roat-calc="other"]'),
    };
    var outputs = {
      gross: result && result.querySelector('[data-roat-calc-output="gross"]'),
      costs: result && result.querySelector('[data-roat-calc-output="costs"]'),
      deathLoss: result && result.querySelector('[data-roat-calc-output="deathLoss"]'),
      net: result && result.querySelector('[data-roat-calc-output="net"]'),
      hourly: result && result.querySelector('[data-roat-calc-output="hourly"]'),
    };

    if (
      !result ||
      !state ||
      !summary ||
      Object.keys(fields).some(function (key) {
        return !fields[key];
      }) ||
      Object.keys(outputs).some(function (key) {
        return !outputs[key];
      })
    ) {
      return;
    }

    result.setAttribute("aria-atomic", "true");
    var multipliers = { k: 1000, m: 1000000, b: 1000000000 };
    var compactFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    });
    var fullFormatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    });

    function parseMoney(input, required, positive, allowSuffix) {
      var rawValue = input.value.trim().toLowerCase();
      if (!rawValue) {
        return required
          ? { valid: false, empty: true, value: null }
          : { valid: true, empty: true, value: 0 };
      }
      var match = rawValue.match(
        allowSuffix === false
          ? /^(?:\d+(?:\.\d*)?|\.\d+)$/
          : /^(?:\d+(?:\.\d*)?|\.\d+)([kmb])?$/,
      );
      if (!match) return { valid: false, empty: false, value: null };
      var suffix = allowSuffix === false ? "" : match[1] || "";
      var numeric = Number(suffix ? rawValue.slice(0, -1) : rawValue);
      var value = numeric * (multipliers[suffix] || 1);
      var valid =
        Number.isFinite(value) &&
        value >= 0 &&
        (!positive || value > 0) &&
        value <= Number.MAX_SAFE_INTEGER;
      return { valid: valid, empty: false, value: valid ? value : null };
    }

    function formatPkp(value) {
      var absolute = Math.abs(value);
      var sign = value < 0 ? "-" : "";
      var scale =
        absolute >= 1000000000
          ? { value: 1000000000, suffix: "B" }
          : absolute >= 1000000
            ? { value: 1000000, suffix: "M" }
            : absolute >= 1000
              ? { value: 1000, suffix: "K" }
              : null;
      return scale
        ? sign + compactFormatter.format(absolute / scale.value) + scale.suffix + " PKP"
        : sign + fullFormatter.format(Math.round(absolute)) + " PKP";
    }

    function setCalculatorState(type, label, message) {
      result.classList.remove("is-positive", "is-neutral", "is-negative");
      result.classList.add("is-" + type);
      state.textContent = label;
      summary.textContent = message;
    }

    function clearCalculator() {
      Object.keys(outputs).forEach(function (key) {
        outputs[key].textContent = "—";
      });
    }

    function updateCalculator() {
      var values = {
        minutes: parseMoney(fields.minutes, true, true, false),
        gross: parseMoney(fields.gross, true, false),
        supplies: parseMoney(fields.supplies, false, false),
        charges: parseMoney(fields.charges, false, false),
        scrolls: parseMoney(fields.scrolls, false, false),
        fees: parseMoney(fields.fees, false, false),
        deaths: parseMoney(fields.deaths, false, false),
        lossPerDeath: parseMoney(fields.lossPerDeath, false, false),
        other: parseMoney(fields.other, false, false),
      };

      Object.keys(fields).forEach(function (key) {
        fields[key].setAttribute("aria-invalid", String(!values[key].valid));
      });

      if (
        Object.keys(values).some(function (key) {
          return !values[key].valid;
        })
      ) {
        clearCalculator();
        setCalculatorState(
          "negative",
          "CHECK THE VALUES",
          "Use non-negative numbers. PKP fields accept an optional K, M or B suffix, and session duration must be greater than zero.",
        );
        return;
      }

      var deathLoss = values.deaths.value * values.lossPerDeath.value;
      var totalCosts =
        values.supplies.value +
        values.charges.value +
        values.scrolls.value +
        values.fees.value +
        deathLoss +
        values.other.value;
      var netSession = values.gross.value - totalCosts;
      var netPerHour = netSession * (60 / values.minutes.value);

      if (
        !Number.isFinite(deathLoss) ||
        !Number.isFinite(totalCosts) ||
        !Number.isFinite(netSession) ||
        !Number.isFinite(netPerHour)
      ) {
        clearCalculator();
        setCalculatorState(
          "negative",
          "CHECK THE VALUES",
          "The result is too large. Reduce the entered values and try again.",
        );
        return;
      }

      outputs.gross.textContent = formatPkp(values.gross.value);
      outputs.costs.textContent = formatPkp(totalCosts);
      outputs.deathLoss.textContent = formatPkp(deathLoss);
      outputs.net.textContent = formatPkp(netSession);
      outputs.hourly.textContent = formatPkp(netPerHour);

      if (netSession > 0) {
        setCalculatorState(
          "positive",
          "POSITIVE SESSION",
          "Gross value exceeded the entered costs. Compare several sessions before treating this hourly result as typical.",
        );
      } else if (netSession < 0) {
        setCalculatorState(
          "negative",
          "NEGATIVE SESSION",
          "Entered costs exceeded gross value. Review risk, interruptions and operating costs before repeating the method.",
        );
      } else {
        setCalculatorState(
          "neutral",
          "BREAK EVEN",
          "Gross session value and total costs are equal.",
        );
      }
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener("input", updateCalculator);
    });
    calculator.addEventListener("submit", function (event) {
      event.preventDefault();
      updateCalculator();
    });
    calculator.addEventListener("reset", function () {
      window.requestAnimationFrame(function () {
        Object.keys(fields).forEach(function (key) {
          fields[key].setAttribute("aria-invalid", "false");
        });
        clearCalculator();
        setCalculatorState(
          "neutral",
          "READY TO CALCULATE",
          "Enter a session length and gross value; blank cost fields count as zero.",
        );
      });
    });
  }

  function initRoatDonatorRankFinder() {
    var finder = document.querySelector("[data-roat-rank-finder]");
    var dataElement = document.getElementById("roat-donator-rank-data");
    if (!finder || !dataElement) return;

    var checkboxes = Array.from(
      finder.querySelectorAll('input[type="checkbox"]'),
    );
    var result = finder.querySelector("[data-roat-rank-result]");
    var reset = finder.querySelector("[data-roat-rank-reset]");
    var ranks;

    try {
      ranks = JSON.parse(dataElement.textContent);
    } catch (error) {
      return;
    }

    if (!Array.isArray(ranks) || !result) return;

    function escapeRankText(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function selectedPriorities() {
      return checkboxes
        .filter(function (checkbox) {
          return checkbox.checked;
        })
        .map(function (checkbox) {
          return {
            id: checkbox.value,
            label: checkbox.parentElement.textContent.trim(),
          };
        });
    }

    function rankMatches(rank, priorities) {
      return priorities.every(function (priority) {
        return Boolean(
          rank.priorities &&
            Object.prototype.hasOwnProperty.call(
              rank.priorities,
              priority.id,
            ),
        );
      });
    }

    function renderRank(rank, priorities, heading) {
      var reasons = priorities
        .map(function (priority) {
          return (
            "<li><strong>" +
            escapeRankText(priority.label) +
            ":</strong> " +
            escapeRankText(rank.priorities[priority.id]) +
            "</li>"
          );
        })
        .join("");

      return (
        "<div class=\"roat-rank-finder__recommendation\">" +
        "<h3>" +
        escapeRankText(heading) +
        ": " +
        escapeRankText(rank.name) +
        "</h3><p>" +
        escapeRankText(rank.summary) +
        "</p><ul>" +
        reasons +
        "</ul><a href=\"#" +
        escapeRankText(rank.sectionId) +
        "\">View " +
        escapeRankText(rank.name) +
        " details</a></div>"
      );
    }

    function updateFinder() {
      var priorities = selectedPriorities();
      if (!priorities.length) {
        result.innerHTML =
          "<p>Select one or more priorities to compare the verified cumulative benefits.</p>";
        return;
      }

      var matchIndex = ranks.findIndex(function (rank) {
        return rankMatches(rank, priorities);
      });

      if (matchIndex < 0) {
        result.innerHTML =
          "<p>No single rank matches every selected priority. Review Royal and Divine benefits below.</p>";
        return;
      }

      var recommendation = ranks[matchIndex];
      var alternative = ranks[matchIndex + 1];
      var output = renderRank(
        recommendation,
        priorities,
        "Lowest matching rank",
      );

      if (alternative) {
        output += renderRank(
          alternative,
          priorities,
          "One tier higher",
        );
      } else {
        output +=
          '<p class="roat-rank-finder__highest">Divine Donator is the highest current rank, so there is no higher alternative.</p>';
      }

      result.innerHTML = output;
    }

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", updateFinder);
    });

    if (reset) {
      reset.addEventListener("click", function () {
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
        updateFinder();
      });
    }
  }

  function initPageEnhancements() {
    initImpactRankCalculator();
    initImpactProfitCalculator();
    initImpactSlayerTierHelper();
    initImpactSlayerDirectory();
    initImpactHunterPlanner();
    initImpactThievingPlanner();
    initCompactHeaderMenu();
    initServerProfitCalculators();
    initRoatCommandDirectory();
    initRoatMoneyMakingGuide();
    initRoatDonatorRankFinder();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageEnhancements);
  } else {
    initPageEnhancements();
  }
})();
