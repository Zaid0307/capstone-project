(function () {
  "use strict";

  function createTraining(now = Date.now, plannedSets = 3, restSeconds = 90) {
    const sets = Array.from({ length: plannedSets }, () => ({ weight: "", reps: "", saved: false }));
    let deadline = null;
    let finished = false;

    const next = () => sets.findIndex(set => !set.saved);
    const secondsLeft = () => deadline === null
      ? 0
      : Math.max(0, Math.ceil((deadline - now()) / 1000));

    return {
      sets,
      next,
      secondsLeft,
      get resting() { return deadline !== null; },
      get finished() { return finished; },
      save(index, weightInput, repsInput) {
        if (finished || index !== next() || index < 0) return "Wähle den nächsten offenen Satz.";
        const weightText = String(weightInput).trim().replace(",", ".");
        const repsText = String(repsInput).trim();
        const weight = Number(weightText);
        const reps = Number(repsText);
        if (!/^\d+(?:\.\d{1,2})?$/.test(weightText) || !Number.isFinite(weight)) {
          return "Gib ein gültiges Gewicht ein, zum Beispiel 12,5 kg.";
        }
        if (!/^\d+$/.test(repsText) || !Number.isSafeInteger(reps) || reps < 1) {
          return "Gib mindestens eine Wiederholung als ganze Zahl ein.";
        }
        sets[index] = { weight, reps, saved: true };
        deadline = next() < 0 ? null : now() + restSeconds * 1000;
        return "";
      },
      skipRest() { deadline = null; },
      finish() {
        if (next() >= 0 || finished) return false;
        deadline = null;
        finished = true;
        return true;
      }
    };
  }

  function mountTraining(document, host) {
    const rows = document.getElementById("sets");
    const status = document.getElementById("saved");
    const form = rows?.closest("form");
    const submit = form?.querySelector("button:not([type]), button[type=submit]");
    if (!rows || !status || !submit || form.dataset.trainingMounted) return;
    form.dataset.trainingMounted = "true";

    const state = createTraining();
    let ticker = null;
    form.onsubmit = null;
    form.noValidate = true;
    status.setAttribute("role", "status");

    const rest = document.createElement("div");
    rest.className = "row";
    rest.hidden = true;
    const timer = document.createElement("span");
    timer.setAttribute("role", "timer");
    timer.setAttribute("aria-label", "Verbleibende Satzpause");
    timer.setAttribute("aria-live", "off");
    const skip = document.createElement("button");
    skip.type = "button";
    skip.textContent = "Pause beenden";
    rest.append(timer, skip);
    submit.before(rest);

    function input(label, mode, placeholder) {
      const element = document.createElement("input");
      element.type = "text";
      element.inputMode = mode;
      element.placeholder = placeholder;
      element.setAttribute("aria-label", label);
      return element;
    }

    const fields = state.sets.map((_, index) => {
      const number = index + 1;
      const row = document.createElement("div");
      row.className = "set";
      const label = document.createElement("span");
      label.textContent = String(number);
      const weight = input("Gewicht Satz " + number + " in Kilogramm", "decimal", "kg");
      const reps = input("Wiederholungen Satz " + number, "numeric", "Wdh.");
      row.append(label, weight, reps);
      return { row, label, weight, reps };
    });
    rows.replaceChildren(...fields.map(field => field.row));

    function refresh() {
      const next = state.next();
      fields.forEach((field, index) => {
        const { saved, weight, reps } = state.sets[index];
        field.label.setAttribute("aria-label", "Satz " + (index + 1) + (saved ? " gespeichert" : ""));
        field.label.textContent = index + 1 + (saved ? " ✓" : "");
        field.weight.readOnly = saved;
        field.reps.readOnly = saved;
        if (saved) {
          field.weight.value = String(weight);
          field.reps.value = String(reps);
        }
      });
      submit.disabled = state.finished;
      submit.textContent = state.finished ? "Training abgeschlossen"
        : next < 0 ? "Training abschließen" : "Satz " + (next + 1) + " speichern";
    }

    function updatePause() {
      const seconds = state.secondsLeft();
      rest.hidden = !state.resting || seconds === 0;
      const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
      const remainder = String(seconds % 60).padStart(2, "0");
      timer.textContent = "Satzpause " + minutes + ":" + remainder;
      if (state.resting && seconds === 0) {
        const restoreFocus = document.activeElement === skip;
        stopPause();
        status.textContent = "Satzpause beendet.";
        if (restoreFocus) submit.focus();
      }
    }

    function stopPause() {
      state.skipRest();
      if (ticker !== null) host.clearInterval(ticker);
      ticker = null;
      rest.hidden = true;
    }

    skip.addEventListener("click", () => {
      stopPause();
      status.textContent = "Satzpause beendet.";
      submit.focus();
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const next = state.next();
      if (next < 0) {
        if (!state.finish()) return;
        stopPause();
        refresh();
        status.textContent = "Training abgeschlossen. " + state.sets.length + " Sätze gespeichert.";
        status.tabIndex = -1;
        status.focus();
        const begin = document.getElementById("begin");
        if (begin) begin.textContent = "Training ansehen";
        return;
      }
      const { weight, reps } = fields[next];
      const error = state.save(next, weight.value, reps.value);
      if (error) {
        status.textContent = error;
        const invalid = error.startsWith("Gib ein gültiges Gewicht") ? weight : reps;
        invalid.setAttribute("aria-invalid", "true");
        invalid.setAttribute("aria-describedby", status.id);
        invalid.focus();
        return;
      }
      [weight, reps].forEach(field => {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      });
      refresh();
      updatePause();
      if (ticker === null && state.resting) ticker = host.setInterval(updatePause, 250);
      if (!state.resting && ticker !== null) {
        host.clearInterval(ticker);
        ticker = null;
      }
      status.textContent = "Satz " + (next + 1) + " gespeichert.";
      const following = fields[state.next()];
      (following ? following.weight : submit).focus();
    });
    refresh();
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { createTraining };
  } else {
    const init = () => mountTraining(document, window);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  }
})();

