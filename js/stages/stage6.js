// STAGE 6: PORTFOLIO DASHBOARD
    // ============================================
    const STORAGE_KEY_STAGE6 = 'investmentApp_stage6';
    let portfolio = [];

    function loadStage6Data() {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE6);
      if (saved) {
        portfolio = JSON.parse(saved);
      }
      renderPortfolio();
    }

    function saveStage6Data() {
      localStorage.setItem(STORAGE_KEY_STAGE6, JSON.stringify(portfolio));
    }

    function renderPortfolio() {
      const $grid = document.getElementById('portfolioGrid');
      const $empty = document.getElementById('portfolioEmpty');

      if (portfolio.length === 0) {
        $grid.style.display = 'none';
        $empty.innerHTML = `
          <p>No properties in your portfolio yet</p>
          <p style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: var(--space-4);">Add your first property to start tracking equity, LVR, and cashflow.</p>
          <button onclick="document.getElementById('addPropertyBtn').click()" class="btn btn-primary btn-small">Add Your First Property</button>
        `;
        $empty.style.display = 'block';
        return;
      }

      $grid.style.display = 'block';
      $empty.style.display = 'none';

      $grid.innerHTML = portfolio.map(property => {
        const equity = property.currentValue - property.loanAmount;
        const lvr = ((property.loanAmount / property.currentValue) * 100).toFixed(1);
        const monthlyPayment = (property.loanAmount * (property.interestRate / 100) / 12).toFixed(0);
        const weeklyRent = property.weeklyRent || 0;
        const monthlyRent = (weeklyRent * 52 / 12).toFixed(0);
        const monthlyCashflow = (monthlyRent - property.monthlyExpenses - monthlyPayment).toFixed(0);
        const cashflowColor = monthlyCashflow >= 0 ? 'var(--success-green)' : 'var(--danger-red)';

        return `
          <div class="card" style="margin-bottom: var(--space-6);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
              <div>
                <h3 style="margin: 0 0 var(--space-2) 0;">${property.address}</h3>
                <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Purchase: $${property.purchasePrice.toLocaleString('en-AU')}</p>
              </div>
              <button onclick="deleteProperty('${property.id}')" class="btn btn-secondary btn-small" style="color: var(--danger-red);">Delete</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
              <div>
                <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Current Value</p>
                <p style="font-size: 1.5rem; font-weight: bold; margin: var(--space-1) 0 0 0;">$${property.currentValue.toLocaleString('en-AU')}</p>
              </div>

              <div>
                <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Equity</p>
                <p style="font-size: 1.5rem; font-weight: bold; margin: var(--space-1) 0 0 0; color: ${equity >= 0 ? 'var(--success-green)' : 'var(--danger-red)'};">
                  $${equity.toLocaleString('en-AU')}
                </p>
                <p style="font-size: 0.75rem; color: var(--gray-500); margin: var(--space-1) 0 0 0;">LVR: ${lvr}%</p>
              </div>

              <div>
                <p style="color: var(--gray-600); font-size: 0.875rem; margin: 0;">Monthly Cashflow</p>
                <p style="font-size: 1.5rem; font-weight: bold; margin: var(--space-1) 0 0 0; color: ${cashflowColor};">
                  $${monthlyCashflow}
                </p>
                <p style="font-size: 0.75rem; color: var(--gray-500); margin: var(--space-1) 0 0 0;">Rent: $${monthlyRent} | Costs: $${(parseFloat(property.monthlyExpenses) + parseFloat(monthlyPayment)).toFixed(0)}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function deleteProperty(id) {
      if (confirm('Delete this property from your portfolio?')) {
        portfolio = portfolio.filter(p => p.id !== id);
        saveStage6Data();
        renderPortfolio();
      }
    }

    window.deleteProperty = deleteProperty;

    document.getElementById('addPropertyBtn').addEventListener('click', () => {
      document.getElementById('addPropertyForm').style.display = 'block';
      document.getElementById('addPropertyBtn').style.display = 'none';
    });

    document.getElementById('cancelPropertyBtn').addEventListener('click', () => {
      document.getElementById('addPropertyForm').style.display = 'none';
      document.getElementById('addPropertyBtn').style.display = 'block';
      document.getElementById('portfolioPropertyForm').reset();
    });

    document.getElementById('portfolioPropertyForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const property = {
        id: Date.now().toString(),
        address: document.getElementById('portfolio-address').value,
        purchasePrice: parseFloat(document.getElementById('portfolio-purchase-price').value),
        currentValue: parseFloat(document.getElementById('portfolio-current-value').value),
        loanAmount: parseFloat(document.getElementById('portfolio-loan-amount').value),
        interestRate: parseFloat(document.getElementById('portfolio-interest-rate').value),
        weeklyRent: parseFloat(document.getElementById('portfolio-rent').value) || 0,
        monthlyExpenses: parseFloat(document.getElementById('portfolio-expenses').value) || 0
      };

      portfolio.push(property);
      saveStage6Data();
      renderPortfolio();

      document.getElementById('addPropertyForm').style.display = 'none';
      document.getElementById('addPropertyBtn').style.display = 'block';
      e.target.reset();
    });

    // ============================================
