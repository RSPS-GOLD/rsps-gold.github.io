(function () {
  var discordUsername = "a6d9";
  var exampleMessage =
    "Hi, I want to buy RSPS gold.\nServer: Roat PKZ\nAmount: 100M\nWhat is the current rate?";
  var toast = document.getElementById("copy-toast");
  var toastTimer;

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
    .querySelectorAll('[data-action="discord-profile"]')
    .forEach(function (link) {
      link.addEventListener("click", function () {
        reportInteraction("discord-profile", link);
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
})();
