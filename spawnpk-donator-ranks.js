(() => {
  const ranks = [
    { key: "normal", name: "Normal Donator", minimum: 10 },
    { key: "super", name: "Super Donator", minimum: 50 },
    { key: "elite", name: "Elite Donator", minimum: 100 },
    { key: "vip", name: "VIP Donator", minimum: 500 },
    { key: "legendary", name: "Legendary Donator", minimum: 1000 },
    { key: "sponsor", name: "Sponsor Donator", minimum: 2500 },
    { key: "mythic", name: "Mythic Donator", minimum: 5000 },
    { key: "cosmic", name: "Cosmic Donator", minimum: 10000 }
  ];

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  const calculator = document.querySelector("[data-spawnpk-rank-calculator]");
  if (calculator) {
    const form = calculator.querySelector("[data-rank-form]");
    const input = calculator.querySelector("#current-total-donated");
    const targetSelect = calculator.querySelector("[data-rank-target]");
    const error = calculator.querySelector("[data-rank-error]");
    const remaining = calculator.querySelector("[data-rank-remaining]");
    const status = calculator.querySelector("[data-rank-status]");
    const next = calculator.querySelector("[data-rank-next]");
    const progress = calculator.querySelector("[data-rank-progress]");
    const progressBar = calculator.querySelector("[data-rank-progress-bar]");

    const rankForAmount = (amount) => {
      return [...ranks].reverse().find((rank) => amount >= rank.minimum) || null;
    };

    const nextRankForAmount = (amount) => ranks.find((rank) => amount < rank.minimum) || null;

    const selectedTarget = () => {
      return ranks.find((rank) => rank.key === targetSelect.value) || ranks[3];
    };

    const setProgress = (value) => {
      const safeValue = Math.max(0, Math.min(100, value));
      const accessibleValue = safeValue >= 100 ? 100 : Math.floor(safeValue);
      progress.setAttribute("aria-valuenow", String(accessibleValue));
      progressBar.style.width = `${safeValue}%`;
    };

    const showPrompt = () => {
      const target = selectedTarget();
      error.textContent = "";
      remaining.textContent = `${money.format(target.minimum)} remaining`;
      status.textContent = `Enter your current total to calculate progress toward ${target.name}.`;
      next.textContent = "Next rank from $0: Normal Donator at $10.";
      setProgress(0);
    };

    const update = () => {
      const raw = input.value.trim();
      if (raw === "") {
        showPrompt();
        return;
      }

      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount < 0) {
        error.textContent = "Enter a valid total of $0 or more.";
        remaining.textContent = "Unable to calculate";
        status.textContent = "The current total must be a non-negative number.";
        next.textContent = "";
        setProgress(0);
        return;
      }

      error.textContent = "";
      const target = selectedTarget();
      const amountRemaining = Math.max(0, target.minimum - amount);
      const currentRank = rankForAmount(amount);
      const upcomingRank = nextRankForAmount(amount);
      const percentage = target.minimum === 0 ? 100 : (amount / target.minimum) * 100;

      if (amountRemaining === 0) {
        remaining.textContent = `${target.name} reached`;
        status.textContent = `${money.format(amount)} meets the documented ${money.format(target.minimum)} minimum.`;
      } else {
        remaining.textContent = `${money.format(amountRemaining)} remaining`;
        status.textContent = currentRank
          ? `Current documented tier: ${currentRank.name}. Target: ${target.name} at ${money.format(target.minimum)}.`
          : `No documented Donator tier reached yet. Target: ${target.name} at ${money.format(target.minimum)}.`;
      }

      next.textContent = upcomingRank
        ? `Next documented rank: ${upcomingRank.name} at ${money.format(upcomingRank.minimum)} (${money.format(upcomingRank.minimum - amount)} remaining).`
        : "All eight documented rank thresholds have been reached.";
      setProgress(percentage);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      update();
    });

    form.addEventListener("reset", () => {
      window.requestAnimationFrame(showPrompt);
    });

    input.addEventListener("input", update);
    targetSelect.addEventListener("change", update);
    showPrompt();
  }

})();
