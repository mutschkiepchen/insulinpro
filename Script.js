// Funktion zur mathematischen Rundung auf 0,5 IE
function rundeAufHalbeEinheit(wert) {
  return Math.round(wert * 2) / 2;
}

// Initialisiere den Verlauf
function ladeVerlauf() {
  const verlauf = JSON.parse(localStorage.getItem("berechnungsVerlauf")) || [];
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = ""; // Verlaufstabelle leeren

  verlauf.forEach((eintrag, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${eintrag.datum}</td>
      <td>${eintrag.kh} g</td>
      <td>${eintrag.bz} mmol/l</td>
      <td>${eintrag.gesamtInsulin} IE</td>
      <td><button class="delete-entry" data-index="${index}">❌ Löschen</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Löschen-Buttons verbinden
  const deleteButtons = document.querySelectorAll(".delete-entry");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      loescheEintrag(index);
    });
  });
}

// Speichere einen neuen Eintrag im Verlauf
function speichereVerlauf(eintrag) {
  const verlauf = JSON.parse(localStorage.getItem("berechnungsVerlauf")) || [];
  verlauf.push(eintrag);
  localStorage.setItem("berechnungsVerlauf", JSON.stringify(verlauf));
}

// Lösche einen bestimmten Eintrag
function loescheEintrag(index) {
  const verlauf = JSON.parse(localStorage.getItem("berechnungsVerlauf")) || [];
  verlauf.splice(index, 1); // Entferne den Eintrag
  localStorage.setItem("berechnungsVerlauf", JSON.stringify(verlauf));
  ladeVerlauf(); // Aktualisiere Tabelle
}

document.getElementById("insulin-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const kh = parseFloat(document.getElementById("kh").value);
  const aktuellerBZ = parseFloat(document.getElementById("aktuellerBZ").value);
  const kiFaktor = 10;
  const optimal = 6.0;
  const korrekturwert = 2.5;

  const aRoh = kh / kiFaktor;
  const aGerundet = rundeAufHalbeEinheit(aRoh);

  const bRoh = (aktuellerBZ - optimal) / korrekturwert;
  const bGerundet = rundeAufHalbeEinheit(bRoh);

  const gesamtInsulin = aGerundet + bGerundet;

  document.getElementById("result").innerHTML = `
    A: ${aGerundet.toFixed(1)} IE<br>B: ${bGerundet.toFixed(1)} IE<br>
    <strong>Gesamt: ${gesamtInsulin.toFixed(1)} IE</strong>
  `;

  const eintrag = {
    datum: new Date().toLocaleString(),
    kh: kh,
    bz: aktuellerBZ,
    gesamtInsulin: gesamtInsulin.toFixed(1),
  };

  speichereVerlauf(eintrag);
  ladeVerlauf();
});

window.addEventListener("load", ladeVerlauf);
