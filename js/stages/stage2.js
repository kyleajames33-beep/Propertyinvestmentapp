// STAGE 2: SUBURB COMPARISON - JAVASCRIPT
    // ============================================

    // Stage 2 Constants
    const STORAGE_KEY_STAGE2 = 'investmentApp_stage2';
    const MAX_SUBURBS = 20;

    // Stage 2 State
    let suburbs = [];
    let currentView = 'cards'; // 'cards' or 'table'
    let sortBy = 'autoScore';
    let sortDirection = 'desc';

    // Stage 2 DOM Elements
    const $suburbForm = document.getElementById('suburbForm');
    const $suburbName = document.getElementById('suburbName');
    const $cityTown = document.getElementById('cityTown');
    const $state = document.getElementById('state');
    const $postcode = document.getElementById('postcode');
    const $priceBand = document.getElementById('priceBand');
    const $dateAssessed = document.getElementById('dateAssessed');
    const $includeFlag = document.getElementById('includeFlag');
    const $manualScore = document.getElementById('manualScore');
    const $thesis = document.getElementById('thesis');
    const $medianPrice = document.getElementById('medianPrice');
    const $weeklyRent = document.getElementById('weeklyRent');
    const $annualGrowth = document.getElementById('annualGrowth');
    const $vacancyRate = document.getElementById('vacancyRate');
    const $distanceToCBD = document.getElementById('distanceToCBD');
    const $suburbNotes = document.getElementById('suburbNotes');
    const $advancedMetrics = document.getElementById('advancedMetrics');
    const $emptyState = document.getElementById('emptyState');
    const $suburbControls = document.getElementById('suburbControls');
    const $suburbCount = document.getElementById('suburbCount');
    const $suburbCardsView = document.getElementById('suburbCardsView');
    const $suburbTableView = document.getElementById('suburbTableView');
    const $suburbTableBody = document.getElementById('suburbTableBody');
    const $viewToggleCards = document.getElementById('viewToggleCards');
    const $viewToggleTable = document.getElementById('viewToggleTable');

    const MEETS_TARGET_OPTIONS = ['', 'Yes', 'No', 'N/A'];
    const TREND_OPTIONS = ['', 'Up', 'Flat/Stable', 'Down', 'Unknown'];
    const QUAL_OPTIONS = ['', 'Strong', 'Neutral', 'Weak', 'Unclear'];

    const METRIC_SECTIONS = [
      {
        id: 'p1',
        title: '1-5 year demand & supply (P1)',
        metrics: [
          { id: 'renterProportion', label: 'Renter proportion %', valueType: 'number', trendType: 'trend' },
          { id: 'vacancyRateMetric', label: 'Vacancy rate %', valueType: 'number', trendType: 'trend' },
          { id: 'auctionClearance', label: 'Auction clearance rate %', valueType: 'number', trendType: 'trend' },
          { id: 'daysOnMarket', label: 'Days on market', valueType: 'number', trendType: 'trend' },
          { id: 'vendorDiscount', label: 'Vendor discount %', valueType: 'number', trendType: 'trend' },
          { id: 'stockOnMarket', label: 'Stock on market %', valueType: 'number', trendType: 'trend' },
          { id: 'onlineSearchInterest', label: 'Online search interest (12m)', valueType: 'number', trendType: 'trend' },
          { id: 'grossYieldMetric', label: 'Gross yield %', valueType: 'number', trendType: 'trend' },
          { id: 'demandSupplyRatio', label: 'Demand-to-Supply Ratio (DSR)', valueType: 'number', trendType: 'trend' },
          { id: 'medianGrowth36', label: '36-month median value growth rate %', valueType: 'number', trendType: 'trend' },
          { id: 'rentalGrowth12', label: '12-month rental growth %', valueType: 'number', trendType: 'trend' },
          { id: 'accessibilityInfrastructure', label: 'Accessibility infrastructure', valueType: 'text', trendType: 'qual' },
          { id: 'jobInfrastructure', label: 'Job infrastructure', valueType: 'text', trendType: 'qual' },
          { id: 'approvalsVsDwellings', label: '18m approvals vs total dwellings', valueType: 'number', trendType: 'trend' },
          { id: 'landSupply', label: 'Developable land supply', valueType: 'text', trendType: 'qual' }
        ]
      },
      {
        id: 'p2',
        title: '6-15 year growth foundations (P2)',
        metrics: [
          { id: 'amenityScore', label: 'Amenity (schools/PT/shops/parks)', valueType: 'text', trendType: 'qual' },
          { id: 'jobCentreProximity', label: 'Proximity to job centres', valueType: 'text', trendType: 'qual' },
          { id: 'householdIncomeGrowth', label: 'Household income growth vs State', valueType: 'number', trendType: 'trend' },
          { id: 'professionalOccupations', label: 'Professional occupations % trend', valueType: 'number', trendType: 'trend' },
          { id: 'medianGrowth10yr', label: '10-year median value avg growth %', valueType: 'number', trendType: 'trend' },
          { id: 'rentAffordability', label: 'Affordability headroom (rent <30%)', valueType: 'number', trendType: 'trend' },
          { id: 'mortgageAffordability', label: 'Affordability headroom (mortgage <30%)', valueType: 'number', trendType: 'trend' }
        ]
      },
      {
        id: 'p3',
        title: 'City/Town Macro (P3)',
        metrics: [
          { id: 'cityJobInfrastructure', label: 'Job infrastructure (city)', valueType: 'text', trendType: 'qual' },
          { id: 'cityApprovals', label: '18m approvals (city-level)', valueType: 'number', trendType: 'trend' },
          { id: 'jobAdsTrend', label: '5-year job ads trend', valueType: 'number', trendType: 'trend' }
        ]
      }
    ];

    const FLATTENED_METRICS = [];
    const metricFieldMap = {};

    renderAdvancedMetrics();

    function renderAdvancedMetrics() {
      if (!$advancedMetrics) return;
      $advancedMetrics.innerHTML = '';

      METRIC_SECTIONS.forEach(section => {
        const sectionEl = document.createElement('div');
        sectionEl.className = 'metrics-section';
        sectionEl.innerHTML = `<h4>${section.title}</h4>`;

        const wrapper = document.createElement('div');
        wrapper.className = 'metrics-table-wrapper';

        const table = document.createElement('table');
        table.className = 'metrics-table';
        table.innerHTML = `
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Meets Target</th>
              <th>Trend / Qual</th>
              <th>Notes</th>
              <th>Score<br>(0&ndash;2)</th>
            </tr>
          </thead>
        `;

        const tbody = document.createElement('tbody');
        section.metrics.forEach(metric => {
          FLATTENED_METRICS.push({ ...metric, section: section.title });
          const row = document.createElement('tr');

          const valueInput = document.createElement('input');
          valueInput.className = 'form-input';
          valueInput.type = metric.valueType === 'number' ? 'number' : 'text';
          if (metric.valueType === 'number') {
            valueInput.step = '0.1';
          }

          const meetsSelect = createSelect(MEETS_TARGET_OPTIONS);
          const trendSelect = createSelect(metric.trendType === 'qual' ? QUAL_OPTIONS : TREND_OPTIONS);
          const notesInput = document.createElement('input');
          notesInput.type = 'text';
          notesInput.className = 'form-input';
          const scoreSelect = createSelect(['', '0', '1', '2']);

          const cells = [
            metric.label,
            valueInput,
            meetsSelect,
            trendSelect,
            notesInput,
            scoreSelect
          ];

          cells.forEach(cell => {
            const td = document.createElement('td');
            if (typeof cell === 'string') {
              td.textContent = cell;
            } else {
              td.appendChild(cell);
            }
            row.appendChild(td);
          });

          metricFieldMap[metric.id] = {
            value: valueInput,
            meetsTarget: meetsSelect,
            trend: trendSelect,
            notes: notesInput,
            score: scoreSelect
          };

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        wrapper.appendChild(table);
        sectionEl.appendChild(wrapper);
        $advancedMetrics.appendChild(sectionEl);
      });
    }

    function createSelect(options) {
      const select = document.createElement('select');
      select.className = 'form-input';
      options.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt;
        optionEl.textContent = opt || 'Select';
        select.appendChild(optionEl);
      });
      return select;
    }

    function collectMetricData() {
      const metricsData = {};
      FLATTENED_METRICS.forEach(metric => {
        const fields = metricFieldMap[metric.id];
        metricsData[metric.id] = {
          label: metric.label,
          period: metric.section,
          value: fields.value.value.trim(),
          meetsTarget: fields.meetsTarget.value,
          trendOrQual: fields.trend.value,
          notes: fields.notes.value.trim(),
          score: fields.score.value
        };
      });
      return metricsData;
    }

    function calculateMetricAutoScore(metrics) {
      let sum = 0;
      let count = 0;
      Object.values(metrics).forEach(metric => {
        if (metric && metric.score !== '' && metric.score !== undefined) {
          const numericScore = Number(metric.score);
          if (!Number.isNaN(numericScore)) {
            sum += numericScore;
            count += 1;
          }
        }
      });
      if (count === 0) {
        return null;
      }
      const tenPointScore = (sum / (count * 2)) * 10;
      return Math.round(tenPointScore * 10) / 10;
    }

    function resetMetricFields() {
      Object.values(metricFieldMap).forEach(fields => {
        fields.value.value = '';
        fields.meetsTarget.value = '';
        fields.trend.value = '';
        fields.notes.value = '';
        fields.score.value = '';
      });
    }

    function renderMetricDetails(suburb) {
      if (!suburb.metrics) return '';
      const hasData = Object.values(suburb.metrics).some(metric => {
        if (!metric) return false;
        return metric.value || metric.meetsTarget || metric.trendOrQual || metric.notes || metric.score;
      });
      if (!hasData) return '';
      const rows = FLATTENED_METRICS.map(metric => {
        const data = suburb.metrics[metric.id] || {};
        const value = data.value || '-';
        const meets = data.meetsTarget || '-';
        const trend = data.trendOrQual || '-';
        const notes = data.notes || '-';
        const score = data.score !== undefined && data.score !== '' ? data.score : '-';
        return `
          <tr>
            <td>
              ${metric.label}
              <div class="metric-period">${metric.section}</div>
            </td>
            <td>${value}</td>
            <td>${meets}</td>
            <td>${trend}</td>
            <td>${notes}</td>
            <td>${score}</td>
          </tr>
        `;
      }).join('');

      return `
        <details class="metric-details">
          <summary>Metric breakdown</summary>
          <div class="metric-details-table">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Meets Target</th>
                  <th>Trend / Qual</th>
                  <th>Notes</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>
      `;
    }

    function formatScore(value) {
      return Number.isFinite(value) ? value.toFixed(1) : '--';
    }

    function formatDateLabel(dateStr) {
      if (!dateStr) return 'Not assessed';
      const parsed = new Date(dateStr);
      if (Number.isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // ============================================
    // SUBURB CALCULATIONS
    // ============================================

    /**
     * Calculate rental yield
     */
    function calculateYield(weeklyRent, medianPrice) {
      if (!weeklyRent || !medianPrice || medianPrice === 0) return 0;
      return ((weeklyRent * 52) / medianPrice) * 100;
    }

    /**
     * Legacy scoring model (pre-metrics)
     */
    function calculateLegacySuburbScore(suburb) {
      const strategy = localStorage.getItem('investmentApp_stage1')
        ? JSON.parse(localStorage.getItem('investmentApp_stage1')).investmentStrategy || 'balanced'
        : 'balanced';

      const growth = suburb.annualGrowth || 0;
      const rentalYield = suburb.calculatedYield || 0;
      const price = suburb.medianPrice || 0;
      const vacancy = suburb.vacancyRate || 2;
      const distance = suburb.distanceToCBD || 50;

      let score = 0;

      if (strategy === 'growth') {
        // Growth Strategy: 40% growth, 30% affordability, 30% location
        score = (growth * 4) +
                ((1000000 - price) / 20000 * 3) +
                ((100 - distance) / 2 * 3);
      } else if (strategy === 'cashflow') {
        // Cashflow Strategy: 50% yield, 30% low vacancy, 20% rent
        const rent = suburb.weeklyRent || 0;
        score = (rentalYield * 10 * 5) +
                ((5 - vacancy) * 10 * 3) +
                (rent / 10 * 2);
      } else {
        // Balanced Strategy: Equal weights
        score = (growth * 2.5) +
                (rentalYield * 10 * 2.5) +
                ((1000000 - price) / 20000 * 2.5) +
                ((5 - vacancy) * 10 * 2.5);
      }

      // Normalize to 0-100 scale
      return Math.max(0, Math.min(100, score));
    }

    /**
     * Get score class for color coding
     */
    function getScoreClass(score) {
      if (!Number.isFinite(score)) {
        return 'score-low';
      }
      if (score >= 75) return 'score-high';
      if (score >= 50) return 'score-medium';
      return 'score-low';
    }

    // ============================================
    // SUBURB CRUD OPERATIONS
    // ============================================

    /**
     * Add new suburb
     */
    function addSuburb(suburbData) {
      // Check max limit
      if (suburbs.length >= MAX_SUBURBS) {
        alert(`Maximum of ${MAX_SUBURBS} suburbs reached. Please delete some before adding more.`);
        return false;
      }

      const calculatedYield = calculateYield(suburbData.weeklyRent, suburbData.medianPrice);
      const legacyScore = calculateLegacySuburbScore({ ...suburbData, calculatedYield });
      const autoScore = Number.isFinite(suburbData.autoScore) ? suburbData.autoScore : null;

      const newSuburb = {
        id: generateId(),
        ...suburbData,
        include: suburbData.include !== false,
        calculatedYield,
        autoScore,
        legacyScore,
        score: legacyScore,
        dateAdded: Date.now()
      };

      suburbs.push(newSuburb);
      saveStage2Data();
      renderSuburbs();
      return true;
    }

    /**
     * Delete suburb by ID
     */
    function deleteSuburb(id) {
      if (!confirm('Are you sure you want to delete this suburb?')) {
        return;
      }

      suburbs = suburbs.filter(s => s.id !== id);
      saveStage2Data();
      renderSuburbs();
    }

    /**
     * Generate unique ID
     */
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ============================================
    // RENDERING FUNCTIONS
    // ============================================

    /**
     * Render all suburbs based on current view
     */
    function renderSuburbs() {
      if (suburbs.length === 0) {
      $emptyState.innerHTML = `
        <p style="font-size: var(--text-lg); color: var(--gray-600); margin-bottom: var(--space-2);">No suburbs added yet</p>
        <p style="color: var(--gray-500); margin-bottom: var(--space-4);">Add your first suburb above to start comparing investment opportunities.</p>
        <button onclick="switchToStage(1)" class="btn btn-secondary btn-small">Go to Stage 1 to confirm your budget</button>
      `;
      $emptyState.style.display = 'block';
      $suburbControls.style.display = 'none';
      $suburbCardsView.style.display = 'none';
      $suburbTableView.style.display = 'none';
      return;
      }

      $emptyState.style.display = 'none';
      $suburbControls.style.display = 'block';

      const included = suburbs.filter(suburb => suburb.include !== false).length;
      $suburbCount.textContent =
        `${suburbs.length} suburb${suburbs.length === 1 ? '' : 's'} (${included} included)`;

      // Sort suburbs
      const sortedSuburbs = [...suburbs].sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? -1 : 1;
        const numericFields = ['autoScore', 'manualScore', 'score', 'medianPrice', 'calculatedYield', 'annualGrowth', 'vacancyRate'];
        if (numericFields.includes(sortBy)) {
          const aVal = Number(a[sortBy] ?? 0);
          const bVal = Number(b[sortBy] ?? 0);
          return (aVal - bVal) * multiplier;
        }
        const aValue = (a[sortBy] || '').toString().toLowerCase();
        const bValue = (b[sortBy] || '').toString().toLowerCase();
        if (aValue === bValue) return 0;
        return aValue < bValue ? -1 * multiplier : 1 * multiplier;
      });

      if (currentView === 'cards') {
        renderCardsView(sortedSuburbs);
      } else {
        renderTableView(sortedSuburbs);
      }
    }

    /**
     * Render suburbs as cards
     */
    function renderCardsView(sortedSuburbs) {
      $suburbCardsView.style.display = 'grid';
      $suburbTableView.style.display = 'none';

      $suburbCardsView.innerHTML = sortedSuburbs.map(suburb => renderSuburbCard(suburb)).join('');
    }

    function renderSuburbCard(suburb) {
      const autoScore = Number.isFinite(suburb.autoScore) ? suburb.autoScore : null;
      const manualScore = Number.isFinite(suburb.manualScore) ? suburb.manualScore : null;
      const isIncluded = suburb.include !== false;
      const includeClass = isIncluded ? 'tag-success' : 'tag-warning';
      const includeLabel = isIncluded ? 'Included' : 'Excluded';
      const dateLabel = formatDateLabel(suburb.dateAssessed);
      const strategyScore = Number(suburb.legacyScore);
      const normalizedScore = Number.isFinite(autoScore) ? autoScore * 10 : strategyScore;
      const scoreLabel = Number.isFinite(autoScore) ? 'Auto Score (/10)' : 'Strategy Score (/100)';
      const scoreValue = Number.isFinite(autoScore)
        ? formatScore(autoScore)
        : (Number.isFinite(strategyScore) ? Math.round(strategyScore).toString() : '--');
      const autoScoreHint = Number.isFinite(autoScore)
        ? ''
        : '<p class="suburb-card-hint">Score metrics 0-2 to generate an auto score.</p>';

      return `
        <div class="suburb-card">
          <div class="suburb-card-header">
            <div>
              <div class="suburb-card-title">${suburb.suburbName}</div>
              <div class="suburb-card-location">${suburb.cityTown || ''}, ${suburb.state} ${suburb.postcode}</div>
            </div>
            <span class="tag">${suburb.priceBand || 'N/A'}</span>
          </div>

          <div class="suburb-card-meta">
            <span class="tag">${dateLabel}</span>
            <span class="tag ${includeClass}">${includeLabel}</span>
          </div>

          <div class="suburb-card-score ${getScoreClass(normalizedScore)}">
            <div class="suburb-card-score-label">${scoreLabel}</div>
            <div class="suburb-card-score-value">${scoreValue}</div>
          </div>

          ${autoScoreHint}

          ${manualScore !== null ? `
            <div class="manual-score-badge">
              Manual Score: ${formatScore(manualScore)}
            </div>
          ` : ''}

          <div class="suburb-card-metrics">
            <div class="suburb-metric">
              <span class="suburb-metric-label">Median Price</span>
              <span class="suburb-metric-value">${formatCurrency(suburb.medianPrice)}</span>
            </div>
            <div class="suburb-metric">
              <span class="suburb-metric-label">Weekly Rent</span>
              <span class="suburb-metric-value">$${suburb.weeklyRent}</span>
            </div>
            <div class="suburb-metric">
              <span class="suburb-metric-label">Rental Yield</span>
              <span class="suburb-metric-value">${(suburb.calculatedYield || 0).toFixed(2)}%</span>
            </div>
            ${suburb.annualGrowth ? `
              <div class="suburb-metric">
                <span class="suburb-metric-label">Annual Growth</span>
                <span class="suburb-metric-value">${suburb.annualGrowth.toFixed(1)}%</span>
              </div>
            ` : ''}
            ${suburb.vacancyRate ? `
              <div class="suburb-metric">
                <span class="suburb-metric-label">Vacancy Rate</span>
                <span class="suburb-metric-value">${suburb.vacancyRate.toFixed(1)}%</span>
              </div>
            ` : ''}
            ${suburb.distanceToCBD ? `
              <div class="suburb-metric">
                <span class="suburb-metric-label">Distance to CBD</span>
                <span class="suburb-metric-value">${suburb.distanceToCBD}km</span>
              </div>
            ` : ''}
          </div>

          ${suburb.thesis ? `
            <div class="suburb-thesis">
              <strong>Thesis:</strong> ${suburb.thesis}
            </div>
          ` : ''}

          ${renderMetricDetails(suburb)}

          ${suburb.notes ? `
            <div class="suburb-notes">
              <div class="suburb-notes-label">Notes:</div>
              <div class="suburb-notes-text">${suburb.notes}</div>
            </div>
          ` : ''}

          <div class="suburb-card-actions">
            <button onclick="deleteSuburb('${suburb.id}')" class="btn btn-secondary">
              Delete
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Render suburbs as table
     */
    function renderTableView(sortedSuburbs) {
      $suburbCardsView.style.display = 'none';
      $suburbTableView.style.display = 'block';

      $suburbTableBody.innerHTML = sortedSuburbs.map(suburb => {
        const autoScore = Number.isFinite(suburb.autoScore) ? suburb.autoScore : null;
        const manualScore = Number.isFinite(suburb.manualScore) ? Number(suburb.manualScore).toFixed(1) : '-';
        const isIncluded = suburb.include !== false;
        const includeLabel = isIncluded ? 'Yes' : 'No';
        const dateLabel = formatDateLabel(suburb.dateAssessed);
        const normalizedScore = Number.isFinite(autoScore)
          ? autoScore * 10
          : Number(suburb.legacyScore);
        const autoScoreDisplay = Number.isFinite(autoScore) ? formatScore(autoScore) : '--';
        return `
          <tr>
            <td class="suburb-table-name">${suburb.suburbName}</td>
            <td>${suburb.cityTown || '-'}<br><span style="font-size: 0.75rem; color: var(--gray-600);">${suburb.state} ${suburb.postcode}</span></td>
            <td>${suburb.priceBand || '-'}</td>
            <td>${includeLabel}</td>
            <td>${manualScore}</td>
            <td><span class="suburb-table-score ${getScoreClass(normalizedScore)}">${autoScoreDisplay}</span></td>
            <td>${dateLabel}</td>
            <td class="suburb-table-actions">
              <button onclick="deleteSuburb('${suburb.id}')" class="btn btn-secondary">Delete</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // ============================================
    // VIEW TOGGLE
    // ============================================

    /**
     * Switch between cards and table view
     */
    function switchView(view) {
      currentView = view;

      if (view === 'cards') {
        $viewToggleCards.classList.add('active');
        $viewToggleTable.classList.remove('active');
      } else {
        $viewToggleCards.classList.remove('active');
        $viewToggleTable.classList.add('active');
      }

      renderSuburbs();
      saveStage2Data();
    }

    // ============================================
    // LOCALSTORAGE - STAGE 2
    // ============================================

    /**
     * Save Stage 2 data to localStorage
     */
    function saveStage2Data() {
      try {
        const data = {
          suburbs: suburbs,
          currentView: currentView,
          sortBy: sortBy,
          sortDirection: sortDirection,
          lastUpdated: Date.now()
        };
        localStorage.setItem(STORAGE_KEY_STAGE2, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save Stage 2 data:', error);
      }
    }

    /**
     * Load Stage 2 data from localStorage
     */
    function loadStage2Data() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_STAGE2);
        if (saved) {
          const data = JSON.parse(saved);
          suburbs = data.suburbs || [];
          currentView = data.currentView || 'cards';
          sortBy = data.sortBy || 'autoScore';
          sortDirection = data.sortDirection || 'desc';

          // Update view toggle buttons
          if (currentView === 'table') {
            $viewToggleCards.classList.remove('active');
            $viewToggleTable.classList.add('active');
          }
        }
      } catch (error) {
        console.error('Failed to load Stage 2 data:', error);
      }
    }

    // ============================================
    // FORM VALIDATION & SUBMISSION
    // ============================================

    /**
     * Validate postcode (4 digits)
     */
    function validatePostcode(postcode) {
      return /^\d{4}$/.test(postcode);
    }

    /**
     * Handle suburb form submission
     */
    function handleSuburbSubmit(e) {
      e.preventDefault();

      if (!$suburbName.value.trim()) {
        alert('Please enter a suburb name');
        $suburbName.focus();
        return;
      }

      if (!$cityTown.value.trim()) {
        alert('Please enter the city or town for this suburb');
        $cityTown.focus();
        return;
      }

      if (!validatePostcode($postcode.value)) {
        alert('Please enter a valid 4-digit Australian postcode');
        $postcode.focus();
        return;
      }

      if (!$dateAssessed.value) {
        alert('Please select the assessment date');
        $dateAssessed.focus();
        return;
      }

      const metricsData = collectMetricData();
      const autoScore = calculateMetricAutoScore(metricsData);

      const suburbData = {
        suburbName: $suburbName.value.trim(),
        cityTown: $cityTown.value.trim(),
        state: $state.value,
        postcode: $postcode.value,
        priceBand: $priceBand.value,
        dateAssessed: $dateAssessed.value,
        include: $includeFlag.value === 'Yes',
        manualScore: $manualScore.value ? parseFloat($manualScore.value) : null,
        thesis: $thesis.value.trim(),
        medianPrice: parseFloat($medianPrice.value) || 0,
        weeklyRent: parseFloat($weeklyRent.value) || 0,
        annualGrowth: parseFloat($annualGrowth.value) || null,
        vacancyRate: parseFloat($vacancyRate.value) || null,
        distanceToCBD: parseFloat($distanceToCBD.value) || null,
        notes: $suburbNotes.value.trim(),
        metrics: metricsData,
        autoScore
      };

      if (addSuburb(suburbData)) {
        $suburbForm.reset();
        resetMetricFields();
        $suburbCardsView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // ============================================
    // EVENT LISTENERS - STAGE 2
    // ============================================

    // Suburb form submission
    $suburbForm.addEventListener('submit', handleSuburbSubmit);

    // View toggle
    $viewToggleCards.addEventListener('click', () => switchView('cards'));
    $viewToggleTable.addEventListener('click', () => switchView('table'));

    // Make deleteSuburb available globally for onclick handlers
    window.deleteSuburb = deleteSuburb;

    // ============================================
