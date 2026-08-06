/* 20 Years Experience Frontend CMS Pages & Page Details Controller */
document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById("cmsToast");
  const showToast = (msg, type = "success") => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = `cms-toast show ${type}`;
    setTimeout(() => {
      toastEl.className = "cms-toast";
    }, 3500);
  };

  // ==========================================
  // PAGE LIST VIEW (/admin/pages)
  // ==========================================
  const pageTableBody = document.getElementById("cmsPageList");
  if (pageTableBody) {
    let allPages = [];
    let currentFilter = "all";
    let searchQuery = "";

    const renderStats = (pages) => {
      const totalEl = document.getElementById("statTotalPages");
      const pubEl = document.getElementById("statPublishedPages");
      const draftEl = document.getElementById("statDraftPages");
      const blocksEl = document.getElementById("statTotalBlocks");

      if (totalEl) totalEl.textContent = pages.length;
      if (pubEl) pubEl.textContent = pages.filter((p) => p.status === "published").length;
      if (draftEl) draftEl.textContent = pages.filter((p) => p.status !== "published").length;
      if (blocksEl) {
        const totalBlocks = pages.reduce((acc, p) => {
          const details = p.pageDetails?.[0]?.json_data || p.json_data || [];
          return acc + (Array.isArray(details) ? details.length : 1);
        }, 0);
        blocksEl.textContent = totalBlocks;
      }
    };

    const renderPages = () => {
      const filtered = allPages.filter((p) => {
        const matchesFilter = currentFilter === "all" || p.status === currentFilter;
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !query ||
          (p.title || "").toLowerCase().includes(query) ||
          (p.slug || "").toLowerCase().includes(query) ||
          (p.page_type || "").toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        pageTableBody.innerHTML = `<tr><td colspan="6" class="mc-loading">No pages match your filter.</td></tr>`;
        return;
      }

      pageTableBody.innerHTML = filtered
        .map((p) => {
          const isPublished = p.status === "published";
          const badgeClass = isPublished ? "published" : "draft";
          const badgeLabel = isPublished ? "Published" : "Draft";
          const detailsCount = Array.isArray(p.pageDetails?.[0]?.json_data)
            ? p.pageDetails[0].json_data.length
            : Array.isArray(p.json_data)
            ? p.json_data.length
            : p.pageDetails?.length || 0;

          const createdDate = p.created_at || p.createdAt;
          const updatedDate = p.updated_at || p.updatedAt;
          const fmtCreated = createdDate ? new Date(createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
          const fmtUpdated = updatedDate ? new Date(updatedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

          return `
            <tr>
              <td>
                <div class="cms-page-identity">
                  <div class="cms-page-icon">${(p.page_type || "P").charAt(0).toUpperCase()}</div>
                  <div>
                    <span class="cms-page-title">${p.title}</span>
                    <span class="cms-page-slug">/${p.slug}</span>
                  </div>
                </div>
              </td>
              <td><code>${p.page_type || "page"}</code></td>
              <td><span class="cms-badge ${badgeClass}"><span class="cms-badge-dot"></span>${badgeLabel}</span></td>
              <td>
                <div class="cms-date-block">
                  <span class="cms-date-main">${fmtCreated}</span>
                  <span class="cms-date-sub">created_at</span>
                </div>
              </td>
              <td>
                <div class="cms-date-block">
                  <span class="cms-date-main">${fmtUpdated}</span>
                  <span class="cms-date-sub">${detailsCount} detail blocks</span>
                </div>
              </td>
              <td>
                <div class="cms-actions">
                  <button type="button" class="cms-btn-action preview-page-btn" data-id="${p.id}" title="Preview Page Details">👁 Preview</button>
                  <a href="/admin/pages/${p.id}/edit" class="cms-btn-action">✏ Edit</a>
                  <button type="button" class="cms-btn-action delete delete-page-btn" data-id="${p.id}" data-title="${p.title}">🗑 Delete</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    };

    const loadPages = async () => {
      try {
        pageTableBody.innerHTML = `<tr><td colspan="6" class="mc-loading">Loading CMS Pages...</td></tr>`;
        const res = await fetch("/api/pages");
        if (!res.ok) throw new Error("Failed to load pages");
        allPages = await res.json();
        renderStats(allPages);
        renderPages();
      } catch (err) {
        pageTableBody.innerHTML = `<tr><td colspan="6" class="mc-loading" style="color: #e11d48;">Error loading pages: ${err.message}</td></tr>`;
      }
    };

    // Filter Buttons
    document.querySelectorAll(".cms-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cms-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter") || "all";
        renderPages();
      });
    });

    // Search Input
    const searchInput = document.getElementById("cmsSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderPages();
      });
    }

    // Table actions delegation
    pageTableBody.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".delete-page-btn");
      if (deleteBtn) {
        const id = deleteBtn.getAttribute("data-id");
        const title = deleteBtn.getAttribute("data-title");
        if (confirm(`Are you sure you want to delete the CMS page "${title}" and its page details?`)) {
          try {
            const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            showToast(`Deleted page "${title}" successfully`);
            await loadPages();
          } catch (err) {
            showToast(err.message, "error");
          }
        }
      }

      const previewBtn = e.target.closest(".preview-page-btn");
      if (previewBtn) {
        const id = Number(previewBtn.getAttribute("data-id"));
        const page = allPages.find((p) => p.id === id);
        if (page) {
          openPreviewModal(page);
        }
      }
    });

    const openPreviewModal = (page) => {
      const modal = document.getElementById("cmsPreviewModal");
      const titleEl = document.getElementById("previewModalTitle");
      const bodyEl = document.getElementById("previewModalBody");
      if (!modal || !bodyEl) return;

      if (titleEl) titleEl.textContent = `Preview Page Details — ${page.title} (/${page.slug})`;

      const details = page.pageDetails?.[0]?.json_data || page.json_data || [];
      const blocks = Array.isArray(details) ? details : [details];

      if (blocks.length === 0) {
        bodyEl.innerHTML = `<p style="color: #64748b; text-align: center; padding: 40px;">No JSON page details blocks defined for this page yet.</p>`;
      } else {
        bodyEl.innerHTML = blocks
          .map((b, idx) => `
            <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 16px; background: #f8fafc;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: 800; color: #4e41c5; font-size: 11px; text-transform: uppercase;">Block #${idx + 1}: ${b.type || b.section || "Component"}</span>
                <code style="font-size: 11px; color: #64748b;">${b.title || ""}</code>
              </div>
              <pre style="background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; font-size: 12px; overflow-x: auto; margin: 0;">${JSON.stringify(b, null, 2)}</pre>
            </div>
          `)
          .join("");
      }

      modal.classList.add("open");
    };

    const closePreviewBtn = document.getElementById("closePreviewModal");
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener("click", () => {
        const modal = document.getElementById("cmsPreviewModal");
        if (modal) modal.classList.remove("open");
      });
    }

    loadPages();
  }

  // ==========================================
  // PAGE FORM VIEW (/admin/pages/new, edit)
  // ==========================================
  const cmsPageForm = document.getElementById("cmsPageForm");
  if (cmsPageForm) {
    const isEdit = cmsPageForm.getAttribute("data-mode") === "edit";
    const pageId = cmsPageForm.getAttribute("data-id");

    // Slug Generator
    const titleInput = document.getElementById("pageTitle");
    const slugInput = document.getElementById("pageSlug");
    let slugManual = isEdit;

    const generateSlug = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    if (titleInput && slugInput) {
      titleInput.addEventListener("input", () => {
        if (!slugManual) {
          slugInput.value = generateSlug(titleInput.value);
        }
      });
      slugInput.addEventListener("input", () => {
        slugManual = true;
      });
    }

    // Tabs for Visual Builder / JSON Editor
    const tabBtns = document.querySelectorAll(".cms-tab-btn");
    const tabPanes = document.querySelectorAll(".cms-tab-pane");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const activePane = document.getElementById(target);
        if (activePane) activePane.classList.add("active");

        if (target === "tab-json") {
          syncVisualToJson();
        } else if (target === "tab-visual") {
          syncJsonToVisual();
        }
      });
    });

    // Page Details Block Management
    let pageBlocks = [];
    const initialJsonEl = document.getElementById("initialJsonData");
    if (initialJsonEl && initialJsonEl.value) {
      try {
        const parsed = JSON.parse(initialJsonEl.value);
        pageBlocks = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        pageBlocks = [];
      }
    }

    const blocksContainer = document.getElementById("cmsBlocksContainer");
    const jsonTextarea = document.getElementById("jsonDataTextarea");

    const renderVisualBlocks = () => {
      if (!blocksContainer) return;
      if (pageBlocks.length === 0) {
        blocksContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; border: 2px dashed #cbd5e1; border-radius: 12px; background: #f8fafc;">
            <p style="margin: 0; color: #64748b; font-weight: 600;">No page details blocks yet.</p>
            <p style="margin: 6px 0 0; font-size: 11px; color: #94a3b8;">Use the buttons below to add Hero, Feature, Article, or Custom JSON blocks to this page.</p>
          </div>
        `;
        return;
      }

      blocksContainer.innerHTML = pageBlocks
        .map((block, idx) => {
          const type = block.type || block.section || "content";
          const importedChipsHtml = Array.isArray(block.items) && block.items.length > 0 ? `
            <div class="cms-form-group" style="background: #f8faff; padding: 14px; border-radius: 10px; border: 1px solid #e0e7ff;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="color: #4338ca; margin: 0; font-size: 11px;">📦 IMPORTED DATABASE CONTENT (${block.items.length} items)</label>
                <span style="font-size: 10px; color: #64748b; font-weight: 600;">${type.toUpperCase().replace('_', ' ')}</span>
              </div>
              <div class="cms-item-chip-list" style="max-height: 140px; overflow-y: auto;">
                ${block.items.map(item => `
                  <span class="cms-item-chip" style="background: #ffffff; border-color: #c7d2fe; color: #312e81;">
                    <span>${item.image ? '🖼️' : '🏷️'}</span>
                    <strong>${item.name || item.title || 'Item'}</strong>
                    <small style="color: #6366f1;">(/${item.slug || item.id})</small>
                  </span>
                `).join('')}
              </div>
            </div>
          ` : '';

          return `
            <div class="cms-block-card" data-index="${idx}">
              <div class="cms-block-header">
                <div class="cms-block-title">
                  <span class="cms-block-tag">${type}</span>
                  <span>Block #${idx + 1}: ${block.title || block.heading || "Section Block"}</span>
                </div>
                <div class="cms-block-controls">
                  ${idx > 0 ? `<button type="button" class="cms-block-btn move-up" data-index="${idx}" title="Move Up">↑</button>` : ""}
                  ${idx < pageBlocks.length - 1 ? `<button type="button" class="cms-block-btn move-down" data-index="${idx}" title="Move Down">↓</button>` : ""}
                  <button type="button" class="cms-block-btn delete delete-block" data-index="${idx}" title="Remove Block">✕</button>
                </div>
              </div>
              <div class="cms-block-body">
                <div class="cms-form-group">
                  <label>Block Title / Heading</label>
                  <input type="text" class="cms-form-control block-field" data-index="${idx}" data-field="title" value="${block.title || block.heading || ""}" placeholder="Section Title...">
                </div>
                <div class="cms-form-group">
                  <label>Block Subtitle / Description</label>
                  <textarea class="cms-form-control block-field" data-index="${idx}" data-field="description" rows="2" placeholder="Subtitle or descriptive text...">${block.description || block.content || ""}</textarea>
                </div>
                ${importedChipsHtml}
                <div class="cms-form-group">
                  <label>Block JSON Properties / Configuration</label>
                  <input type="text" class="cms-form-control block-field" data-index="${idx}" data-field="customProps" value="${encodeURIComponent(JSON.stringify(block.data || block.props || {}))}" readonly style="background: #f1f5f9; color: #64748b; font-family: monospace; font-size: 11px;" title="Full JSON properties can be edited in Raw JSON tab">
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    };

    const syncVisualToJson = () => {
      if (jsonTextarea) {
        jsonTextarea.value = JSON.stringify(pageBlocks, null, 2);
      }
    };

    const syncJsonToVisual = () => {
      if (!jsonTextarea) return;
      try {
        const parsed = JSON.parse(jsonTextarea.value || "[]");
        pageBlocks = Array.isArray(parsed) ? parsed : [parsed];
        renderVisualBlocks();
      } catch (err) {
        showToast("Invalid JSON in Raw Editor. Please fix JSON syntax before switching tabs.", "error");
      }
    };

    // Block field changes
    if (blocksContainer) {
      blocksContainer.addEventListener("input", (e) => {
        const fieldEl = e.target.closest(".block-field");
        if (fieldEl) {
          const idx = Number(fieldEl.getAttribute("data-index"));
          const field = fieldEl.getAttribute("data-field");
          if (pageBlocks[idx]) {
            pageBlocks[idx][field] = fieldEl.value;
            syncVisualToJson();
          }
        }
      });

      blocksContainer.addEventListener("click", (e) => {
        const delBtn = e.target.closest(".delete-block");
        if (delBtn) {
          const idx = Number(delBtn.getAttribute("data-index"));
          pageBlocks.splice(idx, 1);
          renderVisualBlocks();
          syncVisualToJson();
        }

        const upBtn = e.target.closest(".move-up");
        if (upBtn) {
          const idx = Number(upBtn.getAttribute("data-index"));
          if (idx > 0) {
            [pageBlocks[idx - 1], pageBlocks[idx]] = [pageBlocks[idx], pageBlocks[idx - 1]];
            renderVisualBlocks();
            syncVisualToJson();
          }
        }

        const downBtn = e.target.closest(".move-down");
        if (downBtn) {
          const idx = Number(downBtn.getAttribute("data-index"));
          if (idx < pageBlocks.length - 1) {
            [pageBlocks[idx + 1], pageBlocks[idx]] = [pageBlocks[idx], pageBlocks[idx + 1]];
            renderVisualBlocks();
            syncVisualToJson();
          }
        }
      });
    }

    // Add Block Template Buttons
    document.querySelectorAll(".cms-add-block-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const templateType = btn.getAttribute("data-template") || "section";
        const newBlock = {
          type: templateType,
          title: `New ${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Section`,
          description: `Description for ${templateType} block...`,
          data: {
            enabled: true,
            layout: "default",
          },
        };
        pageBlocks.push(newBlock);
        renderVisualBlocks();
        syncVisualToJson();
        showToast(`Added ${templateType} block template`);
      });
    });

    // ==========================================
    // IMPORT CONTENT FROM DATABASE MODAL LOGIC
    // ==========================================
    let currentImportType = null;
    let loadedImportItems = [];
    const importModal = document.getElementById("cmsImportModal");

    const renderImportModalList = (query = "") => {
      const bodyEl = document.getElementById("importModalBody");
      const countEl = document.getElementById("importSelectionCount");
      if (!bodyEl) return;

      const filtered = loadedImportItems.filter(item => {
        const q = query.toLowerCase();
        return !q || (item.name || item.title || "").toLowerCase().includes(q) || (item.slug || "").toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        bodyEl.innerHTML = `<p style="text-align: center; color: #64748b; padding: 30px;">No matching database items found.</p>`;
        return;
      }

      bodyEl.innerHTML = filtered.map(item => {
        const label = item.name || item.title || `Item #${item.id}`;
        return `
          <label class="cms-import-item-row" data-id="${item.id}">
            <div class="cms-import-item-left">
              <input type="checkbox" class="cms-import-checkbox" data-id="${item.id}">
              <div>
                <strong style="color: #0f172a; font-size: 13px; display: block;">${label}</strong>
                <span style="color: #64748b; font-size: 11px;">/${item.slug || item.id}</span>
              </div>
            </div>
            <span class="cms-badge" style="background: #f1f5f9; color: #475569;">#${item.id}</span>
          </label>
        `;
      }).join("");

      updateImportSelectionCount();
    };

    const updateImportSelectionCount = () => {
      const countEl = document.getElementById("importSelectionCount");
      const checked = document.querySelectorAll("#importModalBody .cms-import-checkbox:checked");
      if (countEl) {
        countEl.textContent = `${checked.length} items selected`;
      }
      document.querySelectorAll(".cms-import-item-row").forEach(row => {
        const cb = row.querySelector(".cms-import-checkbox");
        if (cb && cb.checked) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }
      });
    };

    if (importModal) {
      document.querySelectorAll(".cms-import-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          currentImportType = btn.getAttribute("data-import-type");
          const titleEl = document.getElementById("importModalTitle");
          const subEl = document.getElementById("importModalSubtitle");
          const iconEl = document.getElementById("importModalIcon");
          const bodyEl = document.getElementById("importModalBody");
          const searchInput = document.getElementById("importModalSearchInput");

          if (searchInput) searchInput.value = "";

          let endpoint = "/api/main-categories";
          if (currentImportType === "main_categories") {
            if (titleEl) titleEl.textContent = "Import Main Categories";
            if (subEl) subEl.textContent = "Embed top-level category blocks into your page details";
            if (iconEl) iconEl.textContent = "🏷️";
            endpoint = "/api/main-categories";
          } else if (currentImportType === "services") {
            if (titleEl) titleEl.textContent = "Import Services";
            if (subEl) subEl.textContent = "Embed services list or grid into your page details";
            if (iconEl) iconEl.textContent = "🛠️";
            endpoint = "/api/services";
          } else if (currentImportType === "sub_services") {
            if (titleEl) titleEl.textContent = "Import Sub Services";
            if (subEl) subEl.textContent = "Embed specialized sub-services into your page details";
            if (iconEl) iconEl.textContent = "⚡";
            endpoint = "/api/sub-services";
          }

          importModal.classList.add("open");
          if (bodyEl) bodyEl.innerHTML = `<p class="mc-loading">Loading database items...</p>`;

          try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to load items");
            loadedImportItems = await res.json();
            renderImportModalList();
          } catch (err) {
            if (bodyEl) bodyEl.innerHTML = `<p style="color: #e11d48; text-align: center; padding: 30px;">Error: ${err.message}</p>`;
          }
        });
      });

      document.getElementById("importModalBody")?.addEventListener("change", () => {
        updateImportSelectionCount();
      });

      document.getElementById("importModalSearchInput")?.addEventListener("input", (e) => {
        renderImportModalList(e.target.value);
      });

      document.getElementById("importSelectAllBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#importModalBody .cms-import-checkbox").forEach(cb => cb.checked = true);
        updateImportSelectionCount();
      });

      document.getElementById("importDeselectAllBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#importModalBody .cms-import-checkbox").forEach(cb => cb.checked = false);
        updateImportSelectionCount();
      });

      document.getElementById("closeImportModal")?.addEventListener("click", () => {
        importModal.classList.remove("open");
      });

      document.getElementById("cancelImportBtn")?.addEventListener("click", () => {
        importModal.classList.remove("open");
      });

      document.getElementById("confirmImportBtn")?.addEventListener("click", () => {
        const checked = Array.from(document.querySelectorAll("#importModalBody .cms-import-checkbox:checked"))
          .map(cb => Number(cb.getAttribute("data-id")));

        if (checked.length === 0) {
          showToast("Please select at least 1 item to import", "error");
          return;
        }

        const selectedItems = loadedImportItems.filter(item => checked.includes(item.id));
        const newBlock = {
          type: currentImportType,
          title: currentImportType === 'main_categories' ? `Main Categories Grid (${selectedItems.length} categories)` :
                 currentImportType === 'services' ? `Services Showcase (${selectedItems.length} services)` :
                 `Sub-Services List (${selectedItems.length} sub-services)`,
          description: `Featuring ${selectedItems.length} items dynamically imported from the database.`,
          items_count: selectedItems.length,
          items: selectedItems,
          display_style: currentImportType === 'sub_services' ? 'list' : 'grid'
        };

        pageBlocks.push(newBlock);
        renderVisualBlocks();
        syncVisualToJson();
        importModal.classList.remove("open");
        showToast(`Imported ${selectedItems.length} items as a new Page block!`);
      });
    }

    // Format JSON Button
    const formatJsonBtn = document.getElementById("formatJsonBtn");
    if (formatJsonBtn && jsonTextarea) {
      formatJsonBtn.addEventListener("click", () => {
        try {
          const parsed = JSON.parse(jsonTextarea.value || "[]");
          jsonTextarea.value = JSON.stringify(parsed, null, 2);
          pageBlocks = Array.isArray(parsed) ? parsed : [parsed];
          renderVisualBlocks();
          showToast("JSON Formatted Successfully");
        } catch (err) {
          showToast("Invalid JSON syntax: " + err.message, "error");
        }
      });
    }

    // Initialize visual blocks & JSON
    renderVisualBlocks();
    syncVisualToJson();

    // Form submission
    cmsPageForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      syncVisualToJson(); // ensure JSON is updated from visual blocks

      const title = document.getElementById("pageTitle")?.value;
      const slug = document.getElementById("pageSlug")?.value;
      const page_type = document.getElementById("pageType")?.value || "page";
      const status = document.getElementById("pageStatus")?.value || "draft";
      const display_order = Number(document.getElementById("pageOrder")?.value || 0);
      const created_at = document.getElementById("pageCreatedAt")?.value || null;
      let json_data = [];

      try {
        json_data = JSON.parse(jsonTextarea ? jsonTextarea.value : "[]");
      } catch (err) {
        showToast("JSON Syntax Error: Please check the Raw JSON tab", "error");
        return;
      }

      const payload = {
        title,
        slug,
        page_type,
        status,
        display_order,
        ...(created_at ? { created_at } : {}),
        json_data,
      };

      const saveBtn = document.getElementById("pageSaveBtn");
      const origText = saveBtn ? saveBtn.textContent : "Save";
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

      try {
        const url = isEdit ? `/api/pages/${pageId}` : "/api/pages";
        const method = isEdit ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to save CMS Page");
        }

        showToast(isEdit ? "Page updated successfully!" : "Page created successfully!");
        setTimeout(() => {
          window.location.href = "/admin/pages";
        }, 800);
      } catch (err) {
        showToast(err.message, "error");
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = origText;
        }
      }
    });
  }
});
