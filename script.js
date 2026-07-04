(function () {
  var discordUsername = "a6d9";
  var exampleMessage =
    "Hi, I want to buy RSPS gold.\nServer: Roat PKZ\nAmount: 100M\nWhat is the current rate?";
  var toast = document.getElementById("copy-toast");
  var toastTimer;

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
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          showCopied("Copied");
        })
        .catch(function () {
          fallbackCopy(text);
          showCopied("Copied");
        });
      return;
    }

    fallbackCopy(text);
    showCopied("Copied");
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.pushState) {
        history.pushState(null, "", targetId);
      }
    });
  });

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      var copyType = button.getAttribute("data-copy");
      var text = copyType === "example" ? exampleMessage : discordUsername;
      copyText(text);

      var originalText = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(function () {
        button.textContent = originalText;
      }, 1400);
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
