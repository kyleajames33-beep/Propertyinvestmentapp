// STAGE 4: PROFESSIONAL NETWORK
    // ============================================
    const STORAGE_KEY_STAGE4 = 'investmentApp_stage4';
    let professionals = [];

    function loadStage4Data() {
      const saved = localStorage.getItem(STORAGE_KEY_STAGE4);
      if (saved) {
        professionals = JSON.parse(saved);
      }
      renderProfessionals();
    }

    function saveStage4Data() {
      localStorage.setItem(STORAGE_KEY_STAGE4, JSON.stringify(professionals));
    }

    function renderProfessionals() {
      const $grid = document.getElementById('professionalsGrid');

      if (professionals.length === 0) {
        $grid.innerHTML = `
          <div class="empty-state">
            <p>No professional contacts yet</p>
            <p style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: var(--space-4);">Build your property investment dream team here.</p>
            <button onclick="document.getElementById('addProfessionalBtn').click()" class="btn btn-primary btn-small">Add Your First Contact</button>
          </div>
        `;
        return;
      }

      $grid.innerHTML = professionals.map(pro => `
        <div class="card" style="margin-bottom: var(--space-4);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-3);">
            <div>
              <h3 style="margin: 0;">${pro.name}</h3>
              <p style="color: var(--primary-blue); margin: var(--space-1) 0 0 0;">${pro.category}</p>
            </div>
            <button onclick="deleteProfessional('${pro.id}')" class="btn btn-secondary btn-small" style="color: var(--danger-red);">Delete</button>
          </div>
          ${pro.rating > 0 ? `<div style="margin-bottom: var(--space-2); color: var(--warning-amber); font-weight: 700;">${['Poor','Below Average','Average','Good','Excellent'][pro.rating - 1]}</div>` : ''}
          ${pro.phone ? `<p><strong>Phone:</strong> ${pro.phone}</p>` : ''}
          ${pro.email ? `<p><strong>Email:</strong> ${pro.email}</p>` : ''}
          ${pro.notes ? `<p style="margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--gray-200);"><strong>Notes:</strong> ${pro.notes}</p>` : ''}
        </div>
      `).join('');
    }

    function addProfessional(data) {
      professionals.push({
        id: Date.now().toString(),
        ...data
      });
      saveStage4Data();
      renderProfessionals();
    }

    function deleteProfessional(id) {
      if (confirm('Delete this professional contact?')) {
        professionals = professionals.filter(p => p.id !== id);
        saveStage4Data();
        renderProfessionals();
      }
    }

    window.deleteProfessional = deleteProfessional;

    document.getElementById('addProfessionalBtn').addEventListener('click', () => {
      document.getElementById('addProfessionalForm').style.display = 'block';
      document.getElementById('addProfessionalBtn').style.display = 'none';
    });

    document.getElementById('cancelProfessionalBtn').addEventListener('click', () => {
      document.getElementById('addProfessionalForm').style.display = 'none';
      document.getElementById('addProfessionalBtn').style.display = 'block';
      document.getElementById('professionalForm').reset();
    });

    document.getElementById('professionalForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById('pro-name').value,
        category: document.getElementById('pro-category').value,
        phone: document.getElementById('pro-phone').value,
        email: document.getElementById('pro-email').value,
        rating: parseInt(document.getElementById('pro-rating').value),
        notes: document.getElementById('pro-notes').value
      };

      addProfessional(data);
      document.getElementById('addProfessionalForm').style.display = 'none';
      document.getElementById('addProfessionalBtn').style.display = 'block';
      e.target.reset();
    });

    // ============================================
