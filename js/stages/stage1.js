// ============================================
    // CONSTANTS
    // ============================================
    const LVR_TARGET = 0.8; // 80% Loan-to-Value Ratio
    const BORROWING_MULTIPLIER = 6; // Conservative multiplier for borrowing capacity
    const STORAGE_KEY = 'investmentApp_stage1';

    const STRATEGY_DETAILS = {
      balanced: {
        label: 'Balanced (growth + income)',
        description: 'Blends capital growth and rental yield for steady, long-term progress.'
      },
      growth: {
        label: 'Growth focus',
        description: 'Prioritises capital gains. Accepts tighter cashflow for higher upside.'
      },
      cashflow: {
        label: 'Cashflow focus',
        description: 'Targets higher rental yields and buffers to support holding costs.'
      }
    };

    const EXPENSE_CATEGORIES = [
      { id: 'expenseHousing', label: 'Housing' },
      { id: 'expenseUtilities', label: 'Utilities' },
      { id: 'expenseTransport', label: 'Transport' },
      { id: 'expenseFood', label: 'Food & Groceries' },
      { id: 'expenseInsurance', label: 'Insurance' },
      { id: 'expensePersonal', label: 'Personal' },
      { id: 'expenseOther', label: 'Other' }
    ];

    const validationRules = {
      propertyValue: { label: 'Current property value', min: 0, max: 100000000 },
      loanAmount: { label: 'Outstanding loan amount', min: 0, max: 100000000 },
      annualIncome: { label: 'Annual income', min: 0, max: 10000000, required: true },
      partnerIncome: { label: 'Partner income', min: 0, max: 10000000 },
      monthlyExpenses: { label: 'Monthly expenses', min: 0, max: 100000 },
      otherDebts: { label: 'Other debts', min: 0, max: 100000000 },
      cashSavings: { label: 'Cash savings', min: 0, max: 100000000 },
      hecsBalance: { label: 'HECS/HELP balance', min: 0, max: 1000000 },
      hecsMonthlyRepayment: { label: 'HECS/HELP monthly repayment', min: 0, max: 2000 }
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const $propertyValue = document.getElementById('propertyValue');
    const $loanAmount = document.getElementById('loanAmount');
    const $annualIncome = document.getElementById('annualIncome');
    const $partnerIncome = document.getElementById('partnerIncome');
    const $monthlyExpenses = document.getElementById('monthlyExpenses');
    const $otherDebts = document.getElementById('otherDebts');
    const $cashSavings = document.getElementById('cashSavings');
    const $strategy = document.getElementById('investmentStrategy');
    const $hasHecs = document.getElementById('hasHecs');
    const $hecsBalance = document.getElementById('hecsBalance');
    const $hecsMonthlyRepayment = document.getElementById('hecsMonthlyRepayment');
    const $hecsFields = document.getElementById('hecsFields');
    const $calculateBtn = document.getElementById('calculateBtn');
    const $summaryCard = document.getElementById('summaryCard');
    const $summaryLoading = document.getElementById('summaryLoading');
    const $financialForm = document.getElementById('financialForm');

    const $totalEquityValue = document.getElementById('totalEquityValue');
    const $usableEquityValue = document.getElementById('usableEquityValue');
    const $borrowingCapacityValue = document.getElementById('borrowingCapacityValue');
    const $depositValue = document.getElementById('depositValue');
    const $depositBreakdown = document.getElementById('depositBreakdown');
    const $purchaseRangeValue = document.getElementById('purchaseRangeValue');
    const $purchaseRangeNote = document.getElementById('purchaseRangeNote');
    const $lvrValue = document.getElementById('lvrValue');
    const $lmiMessage = document.getElementById('lmiMessage');
    const $lmiValue = document.getElementById('lmiValue');
    const $lmiNote = document.getElementById('lmiNote');
    const $strategySummary = document.getElementById('strategySummary');
    const $strategySummaryNote = document.getElementById('strategySummaryNote');
    const $insightBorrowing = document.getElementById('insightBorrowing');
    const $insightDeposit = document.getElementById('insightDeposit');
    const $insightStrategy = document.getElementById('insightStrategy');
    const $insightStrategyNote = document.getElementById('insightStrategyNote');
    const $insightHouseholdIncome = document.getElementById('insightHouseholdIncome');
    const $insightPrimaryIncome = document.getElementById('insightPrimaryIncome');
    const $insightPartnerIncome = document.getElementById('insightPartnerIncome');
    const $insightIndividualCapacity = document.getElementById('insightIndividualCapacity');
    const $insightHouseholdCapacity = document.getElementById('insightHouseholdCapacity');
    const $hecsSummaryValue = document.getElementById('hecsSummaryValue');
    const $hecsSummaryNote = document.getElementById('hecsSummaryNote');
    const $statusBadge = document.getElementById('statusBadge');
    const $householdBorrowingNote = document.getElementById('householdBorrowingNote');
    const $individualBorrowingValue = document.getElementById('individualBorrowingValue');
    const $individualBorrowingNote = document.getElementById('individualBorrowingNote');
    const $expenseToggleBtn = document.getElementById('expenseToggleBtn');
    const $expenseBreakdown = document.getElementById('expenseBreakdown');
    const $expenseTotalValue = document.getElementById('expenseTotalValue');
    const $expenseQuickSummary = document.getElementById('expenseQuickSummary');
    const $expenseBreakdownSummary = document.getElementById('expenseBreakdownSummary');

    // Lead capture & print report elements
    const $leadModal = document.getElementById('leadModal');
    const $leadModalClose = document.getElementById('leadModalClose');
    const $leadForm = document.getElementById('leadForm');
    const $leadName = document.getElementById('leadName');
    const $leadEmail = document.getElementById('leadEmail');
    const $leadSuccess = document.getElementById('leadSuccess');
    const $emailResultsBtn = document.getElementById('emailResultsBtn');
    const $printReportBtn = document.getElementById('printReportBtn');

    const expenseInputs = EXPENSE_CATEGORIES.reduce((acc, category) => {
      acc[category.id] = document.getElementById(category.id);
      return acc;
    }, {});

    toggleHecsFields($hasHecs.checked);
    updateExpenseTotals({ triggerSummary: false });

    if ($expenseToggleBtn && $expenseBreakdown) {
      $expenseToggleBtn.addEventListener('click', () => {
        const expanded = $expenseToggleBtn.getAttribute('aria-expanded') === 'true';
        const nextState = !expanded;
        $expenseToggleBtn.setAttribute('aria-expanded', String(nextState));
        $expenseBreakdown.classList.toggle('hidden', !nextState);
        $expenseBreakdown.setAttribute('aria-hidden', String(!nextState));
        $expenseToggleBtn.textContent = nextState ? 'Hide breakdown' : 'Show breakdown';
      });
    }

    const SUMMARY_STATUS_CLASSES = ['success', 'warning', 'danger'];
    const SUMMARY_UPDATE_DELAY = 280;
    const SUMMARY_LOADING_DELAY = 120;
    const AUTO_SAVE_DELAY = 800;

    let summaryLoadingTimeoutId = null;
    let pendingSummaryOptions = {};

    const scheduleSummaryUpdate = createDebouncedFunction(() => {
      updateSummaryCard(pendingSummaryOptions);
    }, SUMMARY_UPDATE_DELAY);

    const scheduleStage1Save = createDebouncedFunction(() => {
      saveToLocalStorage();
    }, AUTO_SAVE_DELAY);

    function startSummaryLoading() {
      if (!$summaryCard || $summaryCard.classList.contains('hidden')) {
        return;
      }
      if (summaryLoadingTimeoutId || $summaryCard.classList.contains('calculating')) {
        return;
      }
      summaryLoadingTimeoutId = setTimeout(() => {
        summaryLoadingTimeoutId = null;
        $summaryCard.classList.add('calculating');
        if ($summaryLoading) {
          $summaryLoading.setAttribute('aria-hidden', 'false');
        }
      }, SUMMARY_LOADING_DELAY);
    }

    function stopSummaryLoading() {
      if (summaryLoadingTimeoutId) {
        clearTimeout(summaryLoadingTimeoutId);
        summaryLoadingTimeoutId = null;
      }
      if ($summaryCard) {
        $summaryCard.classList.remove('calculating');
      }
      if ($summaryLoading) {
        $summaryLoading.setAttribute('aria-hidden', 'true');
      }
    }

    function getExpenseEntries() {
      return EXPENSE_CATEGORIES.map(category => {
        const field = expenseInputs[category.id];
        return {
          id: category.id,
          label: category.label,
          value: field ? getInputValue(field) : 0
        };
      });
    }

    function getExpenseSummaryData() {
      const entries = getExpenseEntries();
      const total = entries.reduce((sum, entry) => sum + entry.value, 0);
      return { entries, total };
    }

    function renderExpenseChips(entries) {
      const chips = (entries || []).filter(entry => entry.value > 0);
      if (chips.length === 0) {
        return '<p class="summary-subtext">Add a breakdown to see category insights.</p>';
      }
      const markup = chips.map(entry => `
        <span class="expense-chip">
          <span>${entry.label}</span>
          <strong>${formatCurrency(entry.value)}</strong>
        </span>
      `).join('');
      return `<div class="expense-chip-grid">${markup}</div>`;
    }

    function updateExpenseSummaryElements(entries, total) {
      if ($expenseTotalValue) {
        $expenseTotalValue.textContent = formatCurrency(total);
      }

      if ($expenseQuickSummary) {
        if (total <= 0) {
          $expenseQuickSummary.textContent = 'Add amounts above to reveal your true monthly burn.';
          $expenseQuickSummary.classList.add('expense-summary-inline--empty');
        } else if (entries.some(entry => entry.value > 0)) {
          $expenseQuickSummary.innerHTML = renderExpenseChips(entries);
          $expenseQuickSummary.classList.remove('expense-summary-inline--empty');
        } else {
          $expenseQuickSummary.textContent = 'Break this total into categories to uncover savings buffers.';
          $expenseQuickSummary.classList.remove('expense-summary-inline--empty');
        }
      }

      if ($expenseBreakdownSummary) {
        if (total <= 0) {
          $expenseBreakdownSummary.innerHTML = '<p class="summary-subtext">Add monthly expenses to see category insights.</p>';
        } else if (entries.some(entry => entry.value > 0)) {
          $expenseBreakdownSummary.innerHTML = renderExpenseChips(entries);
        } else {
          $expenseBreakdownSummary.innerHTML = '<p class="summary-subtext">Add a breakdown to see where the money goes.</p>';
        }
      }
    }

    function updateExpenseTotals({ triggerSummary = true } = {}) {
      const { entries, total } = getExpenseSummaryData();
      $monthlyExpenses.value = total > 0 ? total.toString() : '';
      updateExpenseSummaryElements(entries, total);

      if (triggerSummary) {
        if (isFormReadyForCalculation() && !formHasErrors()) {
          triggerSummaryUpdate();
        } else {
          stopSummaryLoading();
        }
      }

      return { entries, total };
    }

    function triggerSummaryUpdate({ immediate = false, scrollIntoView = false } = {}) {
      pendingSummaryOptions = { scrollIntoView };
      if (immediate) {
        updateSummaryCard(pendingSummaryOptions);
        return;
      }
      if ($summaryCard && $summaryCard.dataset.visible === 'true') {
        startSummaryLoading();
      }
      scheduleSummaryUpdate();
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Display an inline validation error
     * @param {HTMLInputElement} element - Field to annotate
     * @param {string} message - Error text
     */
    function showFieldError(element, message) {
      if (!element) {
        return;
      }
      const group = element.closest('.form-group');
      if (!group) {
        return;
      }
      let errorEl = group.querySelector(`.form-error-text[data-error-for="${element.id}"]`);
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error-text';
        errorEl.dataset.errorFor = element.id;
        group.appendChild(errorEl);
      }
      errorEl.textContent = message;
      element.classList.add('form-input-error');
      element.setAttribute('aria-invalid', 'true');
    }

    /**
     * Remove validation message for a field
     * @param {HTMLInputElement} element - Field to clear
     */
    function clearFieldError(element) {
      if (!element) {
        return;
      }
      const group = element.closest('.form-group');
      if (!group) {
        return;
      }
      const errorEl = group.querySelector(`.form-error-text[data-error-for="${element.id}"]`);
      if (errorEl) {
        errorEl.remove();
      }
      element.classList.remove('form-input-error');
      element.removeAttribute('aria-invalid');
    }

    /**
     * Validate a single input field
     * @param {HTMLInputElement} element - Field to validate
     * @returns {boolean}
     */
    function validateField(element) {
      if (!element) {
        return true;
      }
      const rules = validationRules[element.id];
      if (!rules) {
        return true;
      }
      const rawValue = element.value.trim();
      if (rawValue === '') {
        if (rules.required) {
          showFieldError(element, `${rules.label} is required`);
          return false;
        }
        clearFieldError(element);
        return true;
      }

      const numericValue = Number(rawValue);
      if (Number.isNaN(numericValue)) {
        showFieldError(element, `${rules.label} must be a valid number`);
        return false;
      }

      if (numericValue < rules.min) {
        showFieldError(element, `${rules.label} cannot be negative`);
        return false;
      }

      if (rules.max && numericValue > rules.max) {
        showFieldError(element, `${rules.label} seems unreasonably high`);
        return false;
      }

      clearFieldError(element);
      return true;
    }

    /**
     * Validate loan amount relative to property value
     * @returns {boolean}
     */
    function validateLoanAgainstProperty() {
      const propertyRaw = parseFloat($propertyValue.value);
      const loanRaw = parseFloat($loanAmount.value);

      if (Number.isNaN(loanRaw) || loanRaw <= 0) {
        clearFieldError($loanAmount);
        return true;
      }

      if (Number.isNaN(propertyRaw) || propertyRaw <= 0) {
        showFieldError($loanAmount, 'Enter your property value before adding a loan amount');
        return false;
      }

      if (loanRaw > propertyRaw) {
        showFieldError($loanAmount, 'Outstanding loan cannot exceed the property value');
        return false;
      }

      clearFieldError($loanAmount);
      return true;
    }

    /**
     * Determine if any validation errors are visible
     * @returns {boolean}
     */
    function formHasErrors() {
      return document.querySelectorAll('.form-error-text').length > 0;
    }

    /**
     * Check if minimum fields are ready for calculations
     * @returns {boolean}
     */
    function isFormReadyForCalculation() {
      return (getInputValue($annualIncome) + getInputValue($partnerIncome)) > 0 && getInputValue($monthlyExpenses) > 0;
    }

    /**
     * Show or hide HECS input fields based on toggle
     * @param {boolean} [forceState]
     */
    function toggleHecsFields(forceState) {
      const isActive = typeof forceState === 'boolean' ? forceState : $hasHecs.checked;
      if (isActive) {
        $hecsFields.classList.remove('hidden');
      } else {
        $hecsFields.classList.add('hidden');
        $hecsBalance.value = '';
        $hecsMonthlyRepayment.value = '';
      }
    }

    // ============================================
    // CALCULATION FUNCTIONS
    // ============================================

    /**
     * Calculate equity from property value and loan
     * @param {number} propertyValue - Current property value
     * @param {number} loanAmount - Outstanding loan amount
     * @returns {{totalEquity: number, usableEquity: number}}
     */
    function calculateEquity(propertyValue, loanAmount) {
      const totalEquity = propertyValue - loanAmount;
      const maxLoanAt80LVR = propertyValue * LVR_TARGET;
      const usableEquity = Math.max(0, maxLoanAt80LVR - loanAmount);
      return {
        totalEquity,
        usableEquity
      };
    }

    /**
     * Calculate borrowing capacity based on income and expenses
     * @param {number} annualIncome - Gross annual income
     * @param {number} monthlyExpenses - Monthly expenses
     * @param {number} otherDebts - Other debt commitments
     * @returns {number}
     */
    function calculateBorrowingCapacity(annualIncome, monthlyExpenses, otherDebts, hecsMonthlyRepayment = 0) {
      const totalMonthlyExpenses = monthlyExpenses + hecsMonthlyRepayment;
      const annualExpenses = totalMonthlyExpenses * 12;
      const totalAnnualCommitments = annualExpenses + otherDebts;
      const serviceableIncome = annualIncome - totalAnnualCommitments;
      const borrowingCapacity = serviceableIncome * BORROWING_MULTIPLIER;
      return Math.max(0, borrowingCapacity);
    }

    /**
     * Estimate LMI cost based on loan amount and LVR
     * @param {number} loanAmount - Proposed loan amount
     * @param {number} lvr - Loan-to-value ratio (0-1)
     * @returns {{required: boolean, amount: number, rate: number}}
     */
    function estimateLmiCost(loanAmount, lvr) {
      if (!loanAmount || !Number.isFinite(lvr) || lvr <= 0.8) {
        return { required: false, amount: 0, rate: 0 };
      }

      let rate = 0.01;
      if (lvr <= 0.85) {
        rate = 0.01;
      } else if (lvr <= 0.9) {
        rate = 0.0175;
      } else if (lvr <= 0.95) {
        rate = 0.025;
      } else {
        rate = 0.035;
      }

      return {
        required: true,
        amount: Math.round(loanAmount * rate),
        rate
      };
    }

    /**
     * Determine purchase power, deposit, and LVR details
     * @param {object} params - Calculation inputs
     * @param {number} params.usableEquity - Usable equity at 80% LVR
     * @param {number} params.borrowingCapacity - Maximum borrowing amount
     * @param {number} params.cashSavings - Cash savings available
     * @param {boolean} params.hasExistingProperty - True if user owns property
     * @returns {object}
     */
    function calculatePurchaseDetails({ usableEquity, borrowingCapacity, cashSavings, hasExistingProperty }) {
      const equity = Math.max(0, usableEquity);
      const savings = Math.max(0, cashSavings);
      let depositContribution = 0;
      let maxPurchase = 0;
      let scenario = hasExistingProperty ? 'existingProperty' : 'firstTimer';

      if (hasExistingProperty) {
        depositContribution = equity + savings;
        maxPurchase = Math.max(0, usableEquity + borrowingCapacity);
        if (maxPurchase === 0 && depositContribution > 0) {
          maxPurchase = depositContribution;
        }
      } else {
        depositContribution = savings;
        const depositLimited = depositContribution > 0 ? depositContribution / 0.2 : 0;
        const borrowingLimited = borrowingCapacity > 0 ? borrowingCapacity / 0.8 : 0;
        if (depositLimited > 0 && borrowingLimited > 0) {
          maxPurchase = Math.min(depositLimited, borrowingLimited);
        } else {
          maxPurchase = 0;
        }
      }

      const depositUsed = Math.min(maxPurchase, depositContribution);
      const loanAmount = Math.max(0, maxPurchase - depositUsed);
      const lvr = maxPurchase > 0 ? (loanAmount / maxPurchase) : 0;
      const lmi = estimateLmiCost(loanAmount, lvr);
      const minRecommended = Math.round(maxPurchase * 0.7);
      const maxRecommended = Math.round(maxPurchase * 0.9);

      return {
        min: Math.max(0, minRecommended),
        max: Math.max(0, maxRecommended),
        absolute: Math.max(0, Math.round(maxPurchase)),
        depositContribution: Math.round(depositContribution),
        depositUsed: Math.round(depositUsed),
        loanAmount: Math.round(loanAmount),
        lvr,
        lmi,
        scenario
      };
    }

    /**
     * Summarise deposit sources for display
     * @param {object} options - Deposit sources
     * @param {number} options.equity - Equity contribution
     * @param {number} options.savings - Savings contribution
     * @param {string} options.scenario - Scenario identifier
     * @returns {string}
     */
    function getDepositBreakdownText({ equity, savings, scenario }) {
      const parts = [];
      if (equity > 0) {
        parts.push(`${formatCurrency(equity)} equity`);
      }
      if (savings > 0) {
        parts.push(`${formatCurrency(savings)} savings`);
      }
      if (parts.length === 0) {
        return scenario === 'firstTimer'
          ? 'Build cash savings to create a 20% deposit.'
          : 'Build usable equity or savings to boost your deposit.';
      }
      return parts.join(' + ');
    }

    /**
     * Build contextual note for purchase range
     * @param {object} details - Purchase calculation results
     * @returns {string}
     */
    function getPurchaseRangeNote(details) {
      if (!details.absolute) {
        return 'Enter your income, expenses, and deposit to reveal a purchase range.';
      }
      if (details.scenario === 'firstTimer') {
        return details.lmi.required
          ? 'Deposit is just under 20%. Increase savings to avoid LMI.'
          : 'Based on a 20% cash deposit. Extra savings widen this range.';
      }
      return details.lmi.required
        ? 'Equity is backing the deposit but LMI applies. Extra savings reduce this cost.'
        : 'Usable equity covers a 20% deposit. Keep a buffer for costs and contingencies.';
    }

    /**
     * Determine readiness messaging
     * @param {number} borrowingCapacity - Available borrowing amount
     * @param {number} totalEquity - Total equity position
     * @param {number} lvr - Proposed LVR
     * @param {number} purchaseAbsolute - Maximum purchase estimate
     * @returns {{level: string, message: string}}
     */
    function determineStatus(borrowingCapacity, totalEquity, lvr, purchaseAbsolute) {
      if (totalEquity < 0) {
        return {
          level: 'danger',
          message: 'Negative equity - focus on debt reduction before investing'
        };
      }

      if (!purchaseAbsolute) {
        return {
          level: 'warning',
          message: 'Add deposit or savings details to unlock recommendations'
        };
      }

      if (borrowingCapacity < 100000) {
        return {
          level: 'warning',
          message: 'Limited borrowing capacity - build savings and reduce expenses'
        };
      }

      if (lvr > 0.9) {
        return {
          level: 'warning',
          message: 'High LVR - grow your deposit to reduce LMI'
        };
      }

      if (borrowingCapacity < 300000) {
        return {
          level: 'success',
          message: 'Moderate capacity - proceed with conservative targets'
        };
      }

      return {
        level: 'success',
        message: 'Strong position - ready to start suburb research'
      };
    }

    // ============================================
    // DISPLAY FUNCTIONS
    // ============================================

    /**
     * Update the summary card with calculated results
     * @param {object} [options]
     * @param {boolean} [options.scrollIntoView=false] - Scroll to the summary card
     */
    function updateSummaryCard({ scrollIntoView = false } = {}) {
      if (!isFormReadyForCalculation() || formHasErrors()) {
        stopSummaryLoading();
        $summaryCard.classList.add('hidden');
        $summaryCard.dataset.visible = 'false';
        return;
      }

      const profileStart = getNow();

      const propertyValue = getInputValue($propertyValue);
      const loanAmount = getInputValue($loanAmount);
      const annualIncome = getInputValue($annualIncome);
      const partnerIncome = getInputValue($partnerIncome);
      const householdIncome = Math.max(0, annualIncome + partnerIncome);
      const monthlyExpenses = getInputValue($monthlyExpenses);
      const otherDebts = getInputValue($otherDebts);
      const cashSavings = getInputValue($cashSavings);
      const hecsMonthly = $hasHecs.checked ? getInputValue($hecsMonthlyRepayment) : 0;
      const hecsBalanceValue = $hasHecs.checked ? getInputValue($hecsBalance) : 0;
      const strategyValue = $strategy.value || 'balanced';
      const hasExistingProperty = propertyValue > 0;

      const { totalEquity, usableEquity } = calculateEquity(propertyValue, loanAmount);
      const individualBorrowingCapacity = calculateBorrowingCapacity(
        annualIncome,
        monthlyExpenses,
        otherDebts,
        hecsMonthly
      );
      const borrowingCapacity = calculateBorrowingCapacity(
        householdIncome,
        monthlyExpenses,
        otherDebts,
        hecsMonthly
      );

      const purchaseDetails = calculatePurchaseDetails({
        usableEquity,
        borrowingCapacity,
        cashSavings,
        hasExistingProperty
      });

      const status = determineStatus(
        borrowingCapacity,
        totalEquity,
        purchaseDetails.lvr,
        purchaseDetails.absolute
      );
      const strategyDetails = STRATEGY_DETAILS[strategyValue] || STRATEGY_DETAILS.balanced;

      $totalEquityValue.textContent = formatCurrency(totalEquity);
      $usableEquityValue.textContent = formatCurrency(usableEquity);
      $borrowingCapacityValue.textContent = formatCurrency(borrowingCapacity);
      if ($householdBorrowingNote) {
        $householdBorrowingNote.textContent = partnerIncome > 0
          ? `You ${formatCurrency(annualIncome)} + Partner ${formatCurrency(partnerIncome)}`
          : 'All servicing currently based on your income only.';
      }
      if ($individualBorrowingValue) {
        $individualBorrowingValue.textContent = formatCurrency(individualBorrowingCapacity);
      }
      if ($individualBorrowingNote) {
        $individualBorrowingNote.textContent = partnerIncome > 0
          ? 'Solo capacity if you applied without a partner.'
          : 'Matches household amount until partner income is added.';
      }
      $depositValue.textContent = formatCurrency(purchaseDetails.depositUsed);
      $depositBreakdown.textContent = getDepositBreakdownText({
        equity: hasExistingProperty ? Math.max(0, usableEquity) : 0,
        savings: Math.max(0, cashSavings),
        scenario: purchaseDetails.scenario
      });
      $insightBorrowing.textContent = formatCurrency(borrowingCapacity);
      if ($insightIndividualCapacity) {
        $insightIndividualCapacity.textContent = `Individual ${formatCurrency(individualBorrowingCapacity)}`;
        if (partnerIncome > 0) {
          $insightIndividualCapacity.classList.add('insight-pill--muted');
        } else {
          $insightIndividualCapacity.classList.remove('insight-pill--muted');
        }
      }
      if ($insightHouseholdCapacity) {
        $insightHouseholdCapacity.textContent = `Household ${formatCurrency(borrowingCapacity)}`;
      }
      if ($insightHouseholdIncome) {
        $insightHouseholdIncome.textContent = formatCurrency(householdIncome);
      }
      if ($insightPrimaryIncome) {
        $insightPrimaryIncome.textContent = `You ${formatCurrency(annualIncome)}`;
      }
      if ($insightPartnerIncome) {
        $insightPartnerIncome.textContent = `Partner ${formatCurrency(partnerIncome)}`;
        if (partnerIncome > 0) {
          $insightPartnerIncome.classList.remove('insight-pill--muted');
        } else {
          $insightPartnerIncome.classList.add('insight-pill--muted');
        }
      }
      $insightDeposit.textContent = formatCurrency(purchaseDetails.depositUsed);
      $insightStrategy.textContent = strategyDetails.label;
      $insightStrategyNote.textContent = strategyDetails.description;

      if (purchaseDetails.absolute > 0) {
        $purchaseRangeValue.textContent = `${formatCurrency(purchaseDetails.min)} - ${formatCurrency(purchaseDetails.max)}`;
      } else {
        $purchaseRangeValue.textContent = '$0 - $0';
      }
      $purchaseRangeNote.textContent = getPurchaseRangeNote(purchaseDetails);

      $lvrValue.textContent = formatPercent(purchaseDetails.lvr);
      if (purchaseDetails.lmi.required) {
        $lmiValue.textContent = formatCurrency(purchaseDetails.lmi.amount);
        $lmiValue.classList.add('warning');
        $lmiMessage.textContent = 'LVR above 80% - budget for lender\'s mortgage insurance.';
        $lmiNote.textContent = `Approx ${Math.round(purchaseDetails.lmi.rate * 100)}% of the loan.`;
      } else {
        $lmiValue.textContent = '$0';
        $lmiValue.classList.remove('warning');
        $lmiMessage.textContent = 'No LMI because deposit covers at least 20%.';
        $lmiNote.textContent = 'Keep savings aside for costs (stamp duty, legals, buffers).';
      }

      if ($hasHecs.checked && hecsMonthly > 0) {
        $hecsSummaryValue.textContent = `${formatCurrency(hecsMonthly)} / month`;
        $hecsSummaryNote.textContent = hecsBalanceValue > 0
          ? `Balance ${formatCurrency(hecsBalanceValue)} factored into servicing.`
          : 'Monthly repayment included in servicing.';
      } else {
        $hecsSummaryValue.textContent = 'Not applied';
        $hecsSummaryNote.textContent = 'Toggle HECS/HELP if you have a student debt.';
      }

      $strategySummary.textContent = strategyDetails.label;
      $strategySummaryNote.textContent = strategyDetails.description;

      $statusBadge.textContent = status.message;
      $statusBadge.className = `status-badge ${status.level}`;
      SUMMARY_STATUS_CLASSES.forEach(cls => $summaryCard.classList.remove(cls));
      $summaryCard.classList.add(status.level);
      $summaryCard.classList.remove('hidden');

      // Populate print report
      populatePrintReport({
        totalEquity,
        usableEquity,
        borrowingCapacity,
        individualBorrowingCapacity,
        depositUsed: purchaseDetails.depositUsed,
        purchaseRange: purchaseDetails.absolute > 0 ? `${formatCurrency(purchaseDetails.min)} - ${formatCurrency(purchaseDetails.max)}` : '$0 - $0',
        lvr: formatPercent(purchaseDetails.lvr),
        lmi: purchaseDetails.lmi.required ? formatCurrency(purchaseDetails.lmi.amount) : '$0',
        strategy: strategyDetails.label,
        hecs: $hasHecs.checked && hecsMonthly > 0 ? `${formatCurrency(hecsMonthly)} / month` : 'Not applied'
      });

      if (scrollIntoView || $summaryCard.dataset.visible !== 'true') {
        $summaryCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      $summaryCard.dataset.visible = 'true';

      const elapsed = getNow() - profileStart;
      if (elapsed > 12) {
        console.debug(`[Performance] Stage 1 summary update took ${elapsed.toFixed(1)}ms`);
      }
      stopSummaryLoading();
    }

    /**
     * Populate the hidden print-only report section
     */
    function populatePrintReport(data) {
      const map = {
        printTotalEquity: data.totalEquity,
        printUsableEquity: data.usableEquity,
        printBorrowingCapacity: data.borrowingCapacity,
        printIndividualBorrowing: data.individualBorrowingCapacity,
        printDeposit: data.depositUsed,
        printPurchaseRange: data.purchaseRange,
        printLvr: data.lvr,
        printLmi: data.lmi,
        printStrategy: data.strategy,
        printHecs: data.hecs
      };
      Object.entries(map).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = typeof value === 'number' ? formatCurrency(value) : value;
        }
      });
    }

    /**
     * Show the lead capture modal
     */
    function showLeadModal() {
      if (!$leadModal) return;
      $leadModal.classList.remove('hidden');
      $leadModal.setAttribute('aria-hidden', 'false');
      if ($leadSuccess) $leadSuccess.classList.add('hidden');
      if ($leadForm) $leadForm.classList.remove('hidden');
      if ($leadName) $leadName.focus();
    }

    /**
     * Hide the lead capture modal
     */
    function hideLeadModal() {
      if (!$leadModal) return;
      $leadModal.classList.add('hidden');
      $leadModal.setAttribute('aria-hidden', 'true');
      if ($leadForm) $leadForm.reset();
      if ($leadSuccess) $leadSuccess.classList.add('hidden');
      if ($leadForm) $leadForm.classList.remove('hidden');
    }

    /**
     * Handle lead form submission
     */
    function handleLeadSubmit(event) {
      event.preventDefault();
      if (!$leadName || !$leadEmail) return;

      const leadData = {
        name: $leadName.value.trim(),
        email: $leadEmail.value.trim(),
        submittedAt: new Date().toISOString(),
        // Include a summary of their financial position
        summary: {
          borrowingCapacity: $borrowingCapacityValue ? $borrowingCapacityValue.textContent : '',
          deposit: $depositValue ? $depositValue.textContent : '',
          purchaseRange: $purchaseRangeValue ? $purchaseRangeValue.textContent : ''
        }
      };

      // Store locally (in a real app, you'd send this to your backend/CRM)
      try {
        const existing = JSON.parse(localStorage.getItem('investmentApp_leads') || '[]');
        existing.push(leadData);
        localStorage.setItem('investmentApp_leads', JSON.stringify(existing));
      } catch (e) {
        console.error('Failed to save lead:', e);
      }

      // Show success state
      if ($leadForm) $leadForm.classList.add('hidden');
      if ($leadSuccess) $leadSuccess.classList.remove('hidden');

      // Auto-close after 2.5s
      setTimeout(() => {
        hideLeadModal();
      }, 2500);
    }

    /**
     * Trigger print dialog for the report
     */
    function handlePrintReport() {
      window.print();
    }

    // ============================================
    // LOCAL STORAGE FUNCTIONS
    // ============================================

    /**
     * Save current form data to localStorage
     */
    function saveToLocalStorage() {
      const data = {
        propertyValue: $propertyValue.value,
        loanAmount: $loanAmount.value,
        annualIncome: $annualIncome.value,
        partnerIncome: $partnerIncome.value,
        monthlyExpenses: $monthlyExpenses.value,
        otherDebts: $otherDebts.value,
        cashSavings: $cashSavings.value,
        hasHecs: $hasHecs.checked,
        hecsBalance: $hecsBalance.value,
        hecsMonthlyRepayment: $hecsMonthlyRepayment.value,
        investmentStrategy: $strategy.value,
        expenseCategories: EXPENSE_CATEGORIES.reduce((acc, category) => {
          acc[category.id] = expenseInputs[category.id]?.value || '';
          return acc;
        }, {}),
        lastUpdated: new Date().toISOString()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    }

    /**
     * Load saved form data from localStorage
     */
    function loadFromLocalStorage() {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData) {
          const data = JSON.parse(savedData);

          $propertyValue.value = data.propertyValue || '';
          $loanAmount.value = data.loanAmount || '';
          $annualIncome.value = data.annualIncome || '';
          $partnerIncome.value = data.partnerIncome || '';
          $monthlyExpenses.value = data.monthlyExpenses || '';
          $otherDebts.value = data.otherDebts || '';
          $cashSavings.value = data.cashSavings || '';
          $strategy.value = data.investmentStrategy || 'balanced';
          const hasHecsSaved = Boolean(data.hasHecs);
          $hasHecs.checked = hasHecsSaved;
          toggleHecsFields(hasHecsSaved);
          if (hasHecsSaved) {
            $hecsBalance.value = data.hecsBalance || '';
            $hecsMonthlyRepayment.value = data.hecsMonthlyRepayment || '';
          }

          const savedExpenses = data.expenseCategories || {};
          let hasExpenseBreakdown = false;
          EXPENSE_CATEGORIES.forEach(category => {
            if (expenseInputs[category.id]) {
              const savedValue = savedExpenses[category.id] || '';
              expenseInputs[category.id].value = savedValue;
              if (savedValue && Number(savedValue) > 0) {
                hasExpenseBreakdown = true;
              }
            }
          });

          if (hasExpenseBreakdown) {
            updateExpenseTotals({ triggerSummary: false });
          } else {
            updateExpenseSummaryElements(getExpenseEntries(), getInputValue($monthlyExpenses));
          }

          if (isFormReadyForCalculation()) {
            triggerSummaryUpdate({ immediate: true });
          }
        } else {
          updateExpenseSummaryElements(getExpenseEntries(), getInputValue($monthlyExpenses));
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
      }
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Validate full form and calculate results on button click
     */
    function handleCalculate() {
      const propertyValid = validateField($propertyValue);
      const loanValid = validateField($loanAmount);
      const incomeValid = validateField($annualIncome);
      const partnerIncomeValid = validateField($partnerIncome);
      const expensesValid = validateField($monthlyExpenses);
      const debtsValid = validateField($otherDebts);
      const savingsValid = validateField($cashSavings);
      const hecsBalanceValid = !$hasHecs.checked || validateField($hecsBalance);
      const hecsRepaymentValid = !$hasHecs.checked || validateField($hecsMonthlyRepayment);

      let crossFieldValid = true;
      if (propertyValid && loanValid) {
        crossFieldValid = validateLoanAgainstProperty();
      }

      if (!propertyValid || !loanValid || !incomeValid || !partnerIncomeValid || !expensesValid || !debtsValid || !savingsValid || !hecsBalanceValid || !hecsRepaymentValid || !crossFieldValid) {
        return;
      }

      if (getInputValue($monthlyExpenses) <= 0) {
        if ($expenseQuickSummary) {
          $expenseQuickSummary.textContent = 'Add at least one expense category to continue.';
          $expenseQuickSummary.classList.add('expense-summary-inline--empty');
        }
        return;
      }

      triggerSummaryUpdate({ immediate: true, scrollIntoView: true });
      saveToLocalStorage();
    }

    /**
     * Handle input changes (validation, auto-save, auto-update)
     * @param {Event} event - Input/change event
     */
    function handleInputChange(event) {
      const target = event.target;
      if (
        !target ||
        !target.closest('#financialForm') ||
        !target.matches('input, select, textarea')
      ) {
        return;
      }

      if (target.dataset && target.dataset.expenseInput === 'true') {
        updateExpenseTotals();
        scheduleStage1Save();
        return;
      }

      if (target !== $strategy) {
        validateField(target);
        if (target === $loanAmount || target === $propertyValue) {
          validateLoanAgainstProperty();
        }
      }

      scheduleStage1Save();

      if (isFormReadyForCalculation() && !formHasErrors()) {
        triggerSummaryUpdate();
      } else {
        stopSummaryLoading();
      }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    $calculateBtn.addEventListener('click', handleCalculate);

    if ($financialForm) {
      $financialForm.addEventListener('input', handleInputChange);
    }
    if ($strategy) {
      $strategy.addEventListener('change', handleInputChange);
    }

    $hasHecs.addEventListener('change', () => {
      toggleHecsFields();
      scheduleStage1Save();
      if (isFormReadyForCalculation() && !formHasErrors()) {
        triggerSummaryUpdate();
      } else {
        stopSummaryLoading();
      }
    });

    // Lead modal & print report listeners
    if ($emailResultsBtn) {
      $emailResultsBtn.addEventListener('click', showLeadModal);
    }
    if ($printReportBtn) {
      $printReportBtn.addEventListener('click', handlePrintReport);
    }
    if ($leadModalClose) {
      $leadModalClose.addEventListener('click', hideLeadModal);
    }
    if ($leadModal) {
      $leadModal.addEventListener('click', (e) => {
        if (e.target === $leadModal) hideLeadModal();
      });
    }
    if ($leadForm) {
      $leadForm.addEventListener('submit', handleLeadSubmit);
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadFromLocalStorage();
      console.log('Property Investment App - Stage 1 Loaded');
    });

    // ============================================
