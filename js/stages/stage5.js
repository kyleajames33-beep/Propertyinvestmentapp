// STAGE 5: ACQUISITION TRACKER
    // ============================================
    const STORAGE_KEY_STAGE5 = 'investmentApp_stage5';
    let stage5Data = {
      dates: {},
      documents: [
        { id: 1, name: 'Contract of Sale', completed: false },
        { id: 2, name: 'Building Inspection Report', completed: false },
        { id: 3, name: 'Pest Inspection Report', completed: false },
        { id: 4, name: 'Finance Pre-Approval', completed: false },
        { id: 5, name: 'Section 32/Vendor Statement', completed: false },
        { id: 6, name: 'Strata Report (if applicable)', completed: false },
        { id: 7, name: 'Insurance Quote', completed: false },
        { id: 8, name: 'Settlement Statement', completed: false }
      ],
      payments: [
        { id: 1, name: 'Initial Deposit', amount: 0, paid: false },
        { id: 2, name: 'Building Inspection', amount: 0, paid: false },
        { id: 3, name: 'Pest Inspection', amount: 0, paid: false },
        { id: 4, name: 'Conveyancing Fees', amount: 0, paid: false },
        { id: 5, name: 'Stamp Duty', amount: 0, paid: false },
        { id: 6, name: 'Balance at Settlement', amount: 0, paid: false }
      ]
    };

    function loadStage5Data() {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE5);
      if (saved) {
        const savedData = JSON.parse(saved);
        stage5Data = { ...stage5Data, ...savedData };
      }

      // Load dates
      Object.keys(stage5Data.dates).forEach(key => {
        const input = document.getElementById(`date-${key}`);
        if (input) input.value = stage5Data.dates[key];
      });

      renderDocumentChecklist();
      renderPaymentTracker();
    }

    function saveStage5Data() {
      localStorage.setItem(STORAGE_KEY_STAGE5, JSON.stringify(stage5Data));
    }

    function renderDocumentChecklist() {
      const $checklist = document.getElementById('documentChecklist');
      $checklist.innerHTML = stage5Data.documents.map(doc => `
        <label style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--gray-200); cursor: pointer;">
          <input type="checkbox" ${doc.completed ? 'checked' : ''} onchange="toggleDocument(${doc.id})">
          <span style="${doc.completed ? 'text-decoration: line-through; color: var(--gray-500);' : ''}">${doc.name}</span>
        </label>
      `).join('');
    }

    function toggleDocument(id) {
      const doc = stage5Data.documents.find(d => d.id === id);
      if (doc) {
        doc.completed = !doc.completed;
        saveStage5Data();
        renderDocumentChecklist();
      }
    }

    function renderPaymentTracker() {
      const $tracker = document.getElementById('paymentTracker');
      const total = stage5Data.payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const paid = stage5Data.payments.filter(p => p.paid).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

      $tracker.innerHTML = `
        ${stage5Data.payments.map(payment => `
          <div style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border-bottom: 1px solid var(--gray-200);">
            <input type="checkbox" ${payment.paid ? 'checked' : ''} onchange="togglePayment(${payment.id})">
            <div style="flex: 1;">
              <strong style="${payment.paid ? 'text-decoration: line-through; color: var(--gray-500);' : ''}">${payment.name}</strong>
            </div>
            <div style="width: 150px;">
              <input type="number" value="${payment.amount}" placeholder="Amount"
                onchange="updatePaymentAmount(${payment.id}, this.value)"
                style="width: 100%; padding: var(--space-2); border: 1px solid var(--gray-300); border-radius: 4px;">
            </div>
          </div>
        `).join('')}
        <div style="margin-top: var(--space-4); padding: var(--space-4); background: var(--gray-50); border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
            <strong>Total Costs:</strong>
            <strong>$${total.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: var(--success-green);">
            <strong>Paid:</strong>
            <strong>$${paid.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
          </div>
        </div>
      `;
    }

    function togglePayment(id) {
      const payment = stage5Data.payments.find(p => p.id === id);
      if (payment) {
        payment.paid = !payment.paid;
        saveStage5Data();
        renderPaymentTracker();
      }
    }

    function updatePaymentAmount(id, value) {
      const payment = stage5Data.payments.find(p => p.id === id);
      if (payment) {
        payment.amount = parseFloat(value) || 0;
        saveStage5Data();
        renderPaymentTracker();
      }
    }

    window.toggleDocument = toggleDocument;
    window.togglePayment = togglePayment;
    window.updatePaymentAmount = updatePaymentAmount;

    document.getElementById('stage5DatesForm').addEventListener('submit', (e) => {
      e.preventDefault();

      stage5Data.dates = {
        contract: document.getElementById('date-contract').value,
        settlement: document.getElementById('date-settlement').value,
        finance: document.getElementById('date-finance').value,
        inspection: document.getElementById('date-inspection').value
      };

      saveStage5Data();
      alert('Dates saved successfully!');
    });

    // ============================================
