// Mock worker data (replace with real fetch later)
const state = {
  history: ["Diabetes", "Hypertension"],
  vaccinations: [
    { name: "COVID-19", status: "Completed" },
    { name: "Tetanus", status: "Due" },
    { name: "Influenza", status: "Upcoming" }
  ],
  treatments: ["Metformin 500mg – BID", "Amlodipine 5mg – OD"],
  prescriptions: [
    { title: "Rx – 2025-08-29", type: "PDF" },
    { title: "Rx – 2025-06-12", type: "Photo" }
  ],
  notes: ["Diagnosed with Type 2 DM in 2022", "BP controlled with Amlodipine"],
  labs: [
    { title: "FBS – 102 mg/dL", type: "Report" },
    { title: "Lipid Profile", type: "Report" }
  ],
  vitals: [
    { k: 'BP', v: '122/78', t: 'mmHg' },
    { k: 'Pulse', v: '76', t: 'bpm' },
    { k: 'Temp', v: '98.6', t: '°F' },
    { k: 'SpO₂', v: '98', t: '%' },
    { k: 'BMI', v: '24.1', t: '' }
  ],
  visits: [
    { date: '2025-09-01', title: 'Consultation', desc: 'Routine check-up, medicines reviewed' },
    { date: '2025-07-10', title: 'Lab Results', desc: 'Lipid profile normal' },
    { date: '2025-05-20', title: 'Prescription', desc: 'Metformin continued' }
  ],
  contacts: [
    { role: 'Emergency', name: 'Anita Kumar', phone: '98765 43210' },
    { role: 'Primary', name: 'Rajesh Kumar', phone: '98765 00000' }
  ]
};

function $(sel, root=document){return root.querySelector(sel)}
function $all(sel, root=document){return Array.from(root.querySelectorAll(sel))}

function renderChips(){
  const wrap = $("#historyChips");
  wrap.innerHTML = state.history.map(h => `<span class="chip">${h}</span>`).join("")
}

function renderVax(){
  const wrap = $("#vaxStatus");
  wrap.innerHTML = state.vaccinations.map(v => {
    const cls = v.status === "Completed" ? "done" : v.status === "Due" ? "due" : "upcoming";
    return `<div class="vax-row"><span>${v.name}</span><span class="status ${cls}">${v.status}</span></div>`
  }).join("")
}

function renderTreatments(){
  const ul = $("#ongoingTreatments");
  ul.innerHTML = state.treatments.map(t => `<li>${t}</li>`).join("")
}

function renderFiles(){
  const files = $("#prescriptionFiles");
  files.innerHTML = state.prescriptions.map(p => `
    <div class="file">
      <div class="thumb">${p.type}</div>
      <div class="name">${p.title}</div>
    </div>`).join("");
  const labs = $("#labResults");
  labs.innerHTML = state.labs.map(l => `
    <div class="file">
      <div class="thumb">${l.type}</div>
      <div class="name">${l.title}</div>
    </div>`).join("");
}

function renderNotes(){
  const notes = $("#doctorNotes");
  notes.innerHTML = state.notes.map(n => `<li class="note">${n}</li>`).join("")
}

function renderVitals(){
  const tiles = document.querySelector('#vitalsTiles');
  tiles.innerHTML = state.vitals.map(v => `
    <div class="tile">
      <div class="k">${v.k}</div>
      <div class="v">${v.v}</div>
      <div class="t">${v.t}</div>
    </div>
  `).join('');
}

function renderTimeline(){
  const tl = document.querySelector('#visitsTimeline');
  tl.innerHTML = state.visits.map(it => `
    <li>
      <div class="date">${it.date}</div>
      <div class="title">${it.title}</div>
      <div class="desc">${it.desc}</div>
    </li>
  `).join('');
}

function renderContacts(){
  const c = document.querySelector('#contacts');
  c.innerHTML = state.contacts.map(x => `
    <div class="contact">
      <div class="role">${x.role}</div>
      <div class="name">${x.name}</div>
      <div class="phone">${x.phone}</div>
    </div>
  `).join('');
}

function setupTabs(){
  const tabs = $all('.tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    $all('.panel').forEach(p => p.classList.remove('active'));
    $(`#tab-${target}`).classList.add('active');
  }));
}

function openModal(id){ $(id).hidden = false }
function closeModal(el){ el.closest('.modal').hidden = true }

function setupModals(){
  $all('[data-close]').forEach(btn => btn.addEventListener('click', e => closeModal(e.target)));
  $('#addPrescription').addEventListener('click', () => openModal('#modal-prescription'));
  $('#addDiagnosis').addEventListener('click', () => openModal('#modal-diagnosis'));
  $('#setReminder').addEventListener('click', () => openModal('#modal-reminder'));

  $('#savePrescription').addEventListener('click', () => {
    const val = $('#prescriptionInput').value.trim();
    if (val){
      state.prescriptions.unshift({ title: `Rx – ${new Date().toISOString().slice(0,10)}`, type: 'Text' });
      renderFiles();
    }
    closeModal($('#savePrescription'));
  });

  $('#saveDiagnosis').addEventListener('click', () => {
    const val = $('#diagnosisInput').value.trim();
    if (val){ state.notes.unshift(val); renderNotes(); }
    closeModal($('#saveDiagnosis'));
  });

  $('#saveReminder').addEventListener('click', () => {
    const t = $('#reminderType').value; const when = $('#reminderWhen').value;
    if (when){ alert(`Reminder set: ${t} @ ${when}`); }
    closeModal($('#saveReminder'));
  });
}

function setupToolbar(){
  const typeSel = document.querySelector('#filterType');
  const search = document.querySelector('#searchRecords');
  const from = document.querySelector('#filterFrom');
  const to = document.querySelector('#filterTo');
  const apply = () => {
    // Demo-only: just switch active tab by type and do a simple client filter in future
    const t = typeSel.value;
    if (t !== 'all') {
      document.querySelectorAll('.tab').forEach(tb => tb.classList.remove('active'));
      document.querySelector(`#tab-${t === 'prescriptions' ? 'prescriptions' : t}`).previousElementSibling?.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelector(`#tab-${t}`).classList.add('active');
    }
    // search/from/to can be wired to real filtering of lists later
  };
  [typeSel, search, from, to].forEach(el => el && el.addEventListener('input', apply));
}

function setupMoreButtons(){
  const alertBtn = (id, msg) => { const b=document.querySelector(id); if(b){ b.addEventListener('click', ()=>alert(msg)); }};
  alertBtn('#uploadReport','Upload flow coming soon');
  alertBtn('#orderLabTest','Lab order flow coming soon');
  alertBtn('#requestFollowup','Follow-up request recorded');
  alertBtn('#downloadPDF','Generating PDF...');
  alertBtn('#shareRecord','Share link copied');
}

// Extend init
const oldInit = init;
function extendedInit(){
  oldInit();
  renderVitals();
  renderTimeline();
  renderContacts();
  setupToolbar();
  setupMoreButtons();
}

document.removeEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', extendedInit);
