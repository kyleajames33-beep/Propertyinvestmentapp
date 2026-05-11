// STAGE 3: LOCATION INTELLIGENCE
    // ============================================
    const STORAGE_KEY_STAGE3 = 'investmentApp_stage3';
    let stage3Data = null;

    const STAGE3_AMENITIES = [
      { id: 'train', label: 'Train station', weight: 15, category: 'mobility' },
      { id: 'bus', label: 'Bus stops', weight: 10, category: 'mobility' },
      { id: 'school', label: 'Primary schools', weight: 12, category: 'education' },
      { id: 'highschool', label: 'High schools', weight: 12, category: 'education' },
      { id: 'shopping', label: 'Shopping centres', weight: 13, category: 'lifestyle' },
      { id: 'hospital', label: 'Hospitals / medical', weight: 10, category: 'services' },
      { id: 'parks', label: 'Parks / recreation', weight: 13, category: 'lifestyle' },
      { id: 'cbd', label: 'Close to CBD', weight: 15, category: 'mobility' }
    ];

    const STAGE3_CATEGORY_META = {
      mobility: { label: 'Mobility', description: 'Transport links and CBD proximity' },
      education: { label: 'Education', description: 'Primary and secondary schooling' },
      lifestyle: { label: 'Lifestyle', description: 'Shopping, parks, recreation' },
      services: { label: 'Health & services', description: 'Hospitals and daily needs' }
    };

    const STAGE3_GUIDANCE = [
      {
        id: 'ready',
        min: 75,
        label: 'Top-tier pocket',
        text: 'Outstanding amenity coverage. Shortlist this suburb and focus on the highlighted micro pockets.',
        color: 'var(--success-green)'
      },
      {
        id: 'investigate',
        min: 50,
        label: 'Worth investigating',
        text: 'Mixed amenity coverage. Validate micro pockets or future infrastructure before progressing.',
        color: 'var(--warning-amber)'
      },
      {
        id: 'research',
        min: 0,
        label: 'Needs more research',
        text: 'Limited access today. Only pursue if the thesis relies on planned infrastructure or a niche strategy.',
        color: 'var(--danger-red)'
      }
    ];

    const STAGE3_CATEGORY_TIPS = {
      mobility: 'Check council plans for transport upgrades or upcoming rapid-transit links.',
      education: 'Validate enrolment zones and upcoming school capacity expansions.',
      lifestyle: 'Investigate mixed-use projects or planned retail/park upgrades.',
      services: 'Confirm hospital/medical coverage and planned community services.'
    };

    const STAGE3_NEXT_STEPS = {
      ready: [
        'Contact agents covering the highlighted pockets and request recent sales evidence.',
        'Walk or virtually tour the suburb to confirm amenity quality matches check-box data.',
        'Feed this suburb into Stage 2 to compare against other shortlisted areas.'
      ],
      investigate: [
        'Validate whether planned infrastructure is funded or still speculative.',
        'Focus on micro pockets with the strongest category scores (see chips above).',
        'Add development notes for risks (flood zones, industrial interfaces, zoning limits).'
      ],
      research: [
        'Confirm whether infrastructure projects are committed before allocating more time.',
        'Use council strategic plans or ABS data to see if service gaps will be addressed.',
        'Consider alternative suburbs with stronger mobility/lifestyle coverage.'
      ]
    };

    let stage3AutoUpdateEnabled = false;

    const STAGE3_CATEGORY_MAX = STAGE3_AMENITIES.reduce((acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = 0;
      }
      acc[amenity.category] += amenity.weight;
      return acc;
    }, {});

    Object.keys(STAGE3_CATEGORY_META).forEach(category => {
      STAGE3_CATEGORY_META[category].max = STAGE3_CATEGORY_MAX[category] || 0;
    });

    const $stage3Form = document.getElementById('stage3Form');
    const $locationSuburb = document.getElementById('location-suburb');
    const $locationState = document.getElementById('location-state');
    const $locationNotesInput = document.getElementById('location-notes');
    const $locationPocketInput = document.getElementById('location-pocket');
    const $stage3Results = document.getElementById('stage3Results');
    const $locationScoreDisplay = document.getElementById('locationScoreDisplay');
    const $locationRecommendation = document.getElementById('locationRecommendation');
    const $locationHighlights = document.getElementById('locationHighlights');
    const $locationCategoryGrid = document.getElementById('locationCategoryGrid');
    const $locationOpportunities = document.getElementById('locationOpportunities');
    const $locationPocketSummary = document.getElementById('locationPocketSummary');
    const $locationNotesSummary = document.getElementById('locationNotesSummary');
    const $locationNextSteps = document.getElementById('locationNextSteps');
    const $locationLastAnalysis = document.getElementById('stage3LastAnalysis');
    const $locationLastSummary = document.getElementById('locationLastSummary');

    function getStage3AmenitySelections() {
      const selections = {};
      STAGE3_AMENITIES.forEach(config => {
        const checkbox = document.getElementById(`amenity-${config.id}`);
        selections[config.id] = checkbox ? Boolean(checkbox.checked) : false;
      });
      return selections;
    }

    function calculateStage3Metrics(selections) {
      const categoryTotals = {};
      let total = 0;
      STAGE3_AMENITIES.forEach(config => {
        if (selections[config.id]) {
          total += config.weight;
          categoryTotals[config.category] = (categoryTotals[config.category] || 0) + config.weight;
        }
      });
      return {
        score: Math.round(total), // weights sum to 100
        categoryTotals
      };
    }

    function getStage3Guidance(score) {
      return STAGE3_GUIDANCE.find(item => score >= item.min) || STAGE3_GUIDANCE[STAGE3_GUIDANCE.length - 1];
    }

    function buildCategoryStats(categoryTotals) {
      return Object.keys(STAGE3_CATEGORY_META).map(key => {
        const meta = STAGE3_CATEGORY_META[key];
        const value = categoryTotals[key] || 0;
        const percent = meta.max ? Math.round((value / meta.max) * 100) : 0;
        return {
          key,
          label: meta.label,
          description: meta.description,
          value,
          max: meta.max,
          percent: Math.min(percent, 100)
        };
      });
    }

    function renderStage3Results(data) {
      if (!data || typeof data.score !== 'number') {
        $stage3Results.style.display = 'none';
        $locationLastAnalysis.style.display = 'none';
        return;
      }

      const guidance = getStage3Guidance(data.score);
      const categoryStats = buildCategoryStats(data.categoryTotals || {});
      const highlights = [...categoryStats]
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 3)
        .filter(stat => stat.percent > 0);

      $locationScoreDisplay.textContent = `${data.score}/100`;
      $locationScoreDisplay.style.color = guidance.color;
      $locationRecommendation.innerHTML = `<strong style="color:${guidance.color};">${guidance.label}</strong><br>${guidance.text}`;

      $locationHighlights.innerHTML = highlights.length
        ? highlights.map(stat => `
            <span class="insight-chip">
              <span class="chip-label">${stat.label}</span>
              <span class="chip-value">${stat.percent}%</span>
            </span>
          `).join('')
        : '<span class="insight-chip"><span class="chip-label">No amenities selected yet</span></span>';

      $locationCategoryGrid.innerHTML = categoryStats.map(stat => `
        <div class="category-card">
          <h4>${stat.label}</h4>
          <p style="font-size: var(--text-sm); color: var(--gray-600);">${stat.description}</p>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${stat.percent}%"></div>
          </div>
          <p style="font-size: var(--text-sm); color: var(--gray-600);">${stat.value} / ${stat.max} pts</p>
        </div>
      `).join('');

      const opportunities = categoryStats.filter(stat => stat.percent < 50);
      $locationOpportunities.innerHTML = opportunities.length
        ? opportunities.map(stat => `
            <div class="opportunity-card">
              <h5>${stat.label} · ${stat.percent}%</h5>
              <p>${STAGE3_CATEGORY_TIPS[stat.key] || 'Capture more on-the-ground intel for this category.'}</p>
            </div>
          `).join('')
        : '<div class="opportunity-card"><p>All categories exceed 50% coverage. Focus on micro pockets and on-site validation.</p></div>';

      $locationPocketSummary.textContent = data.bestPocket
        ? data.bestPocket
        : 'Add pockets or streets to target after scoring the suburb.';
      $locationNotesSummary.textContent = data.notes
        ? data.notes
        : 'No development notes captured yet.';

      const nextStepsList = STAGE3_NEXT_STEPS[guidance.id] || [];
      $locationNextSteps.innerHTML = nextStepsList.length
        ? nextStepsList.map(step => `<li>${step}</li>`).join('')
        : '<li>Capture more notes about this suburb to unlock tailored next steps.</li>';

      const updatedDate = data.updatedAt ? new Date(data.updatedAt) : new Date();
      const dateLabel = Number.isNaN(updatedDate.getTime())
        ? ''
        : updatedDate.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
      const suburbLabel = data.suburb ? `${data.suburb}${data.state ? `, ${data.state}` : ''}` : 'Unknown suburb';

      $locationLastSummary.innerHTML = `
        <strong>${suburbLabel}</strong>
        ${dateLabel ? `· ${dateLabel}` : ''}
        <br>
        Score: ${data.score}/100 (${guidance.label})
      `;

      $stage3Results.style.display = 'block';
      $locationLastAnalysis.style.display = 'block';
    }

    function stage3ReadyForAnalysis() {
      return Boolean($locationSuburb.value.trim() && $locationState.value);
    }

    function buildStage3Payload() {
      if (!stage3ReadyForAnalysis()) {
        return null;
      }
      const amenitySelections = getStage3AmenitySelections();
      const metrics = calculateStage3Metrics(amenitySelections);
      return {
        suburb: $locationSuburb.value.trim(),
        state: $locationState.value,
        notes: $locationNotesInput.value.trim(),
        bestPocket: $locationPocketInput.value.trim(),
        amenities: amenitySelections,
        categoryTotals: metrics.categoryTotals,
        score: metrics.score,
        updatedAt: new Date().toISOString()
      };
    }

    function handleStage3Analysis({ save = true, showAlerts = false } = {}) {
      if (!stage3ReadyForAnalysis()) {
        if (showAlerts) {
          alert('Enter the suburb and state before scoring the location.');
        }
        return null;
      }
      const payload = buildStage3Payload();
      if (!payload) {
        return null;
      }
      stage3Data = payload;
      if (save) {
        saveStage3Data();
      }
      renderStage3Results(payload);
      stage3AutoUpdateEnabled = true;
      return payload;
    }

    function loadStage3Data() {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE3);
      if (saved) {
        stage3Data = JSON.parse(saved);
      } else {
        stage3Data = null;
      }

      $locationSuburb.value = stage3Data?.suburb || '';
      $locationState.value = stage3Data?.state || '';
      $locationNotesInput.value = stage3Data?.notes || '';
      $locationPocketInput.value = stage3Data?.bestPocket || '';

      const amenities = stage3Data?.amenities || {};
      STAGE3_AMENITIES.forEach(config => {
        const checkbox = document.getElementById(`amenity-${config.id}`);
        if (checkbox) {
          checkbox.checked = Boolean(amenities[config.id]);
        }
      });

      stage3AutoUpdateEnabled = Boolean(stage3Data && typeof stage3Data.score === 'number');

      if (stage3Data && typeof stage3Data.score === 'number') {
        renderStage3Results(stage3Data);
      } else {
        $stage3Results.style.display = 'none';
        $locationLastAnalysis.style.display = stage3Data ? 'block' : 'none';
      }
    }

    function saveStage3Data() {
      if (stage3Data) {
        localStorage.setItem(STORAGE_KEY_STAGE3, JSON.stringify(stage3Data));
      }
    }

    function maybeAutoUpdateStage3() {
      if (!stage3AutoUpdateEnabled) {
        return;
      }
      if (!stage3ReadyForAnalysis()) {
        return;
      }
      handleStage3Analysis({ save: true, showAlerts: false });
    }

    const scheduleStage3AutoUpdate = createDebouncedFunction(() => {
      if (stage3AutoUpdateEnabled) {
        maybeAutoUpdateStage3();
      }
    }, 350);

    $stage3Form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleStage3Analysis({ save: true, showAlerts: true });
    });

    // Stage 3 auto-update bindings
    [$locationSuburb, $locationState, $locationNotesInput, $locationPocketInput].forEach(element => {
      if (!element) {
        return;
      }
      element.addEventListener('input', scheduleStage3AutoUpdate);
    });

    STAGE3_AMENITIES.forEach(config => {
      const checkbox = document.getElementById(`amenity-${config.id}`);
      if (checkbox) {
        checkbox.addEventListener('change', scheduleStage3AutoUpdate);
      }
    });

    // ============================================
