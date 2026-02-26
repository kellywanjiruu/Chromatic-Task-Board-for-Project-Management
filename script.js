class TaskBoard {
  constructor() {
    this.tasks = [];
    this.currentFilter = "all";
    this.currentSort = "date-desc";
    this.searchTerm = "";
    this.currentPage = "dashboard";
    this.notifications = [
      {
        id: "1",
        title: "New task assigned",
        message: "You have been assigned a new task",
        time: "5 minutes ago",
        read: false,
        icon: "fa-tasks",
      },
      {
        id: "2",
        title: "Task completed",
        message: 'Sarah completed "Design Review"',
        time: "1 hour ago",
        read: false,
        icon: "fa-check-circle",
      },
      {
        id: "3",
        title: "Meeting reminder",
        message: "Team standup in 30 minutes",
        time: "2 hours ago",
        read: true,
        icon: "fa-calendar",
      },
      {
        id: "4",
        title: "Deadline approaching",
        message: "Project deadline is tomorrow",
        time: "5 hours ago",
        read: false,
        icon: "fa-clock",
      },
    ];

    this.initElements();
    this.initEventListeners();
    this.loadSampleTasks();
    this.loadFromLocalStorage();
    this.render();
    this.updateStats();
    this.renderNotifications();
  }

  initElements() {
    // Navigation
    this.navItems = document.querySelectorAll(".nav-item");
    this.pages = document.querySelectorAll(".page");

    // Sidebar
    this.sidebar = document.getElementById("sidebar");
    this.mobileMenuBtn = document.getElementById("mobileMenuBtn");

    // Theme
    this.themeToggle = document.getElementById("themeToggle");
    this.themeSelect = document.getElementById("themeSelect");

    // Notifications
    this.notificationBtn = document.getElementById("notificationBtn");
    this.notificationsPanel = document.getElementById("notificationsPanel");
    this.closeNotificationsBtn = document.getElementById(
      "closeNotificationsBtn",
    );
    this.notificationBadge = document.getElementById("notificationBadge");

    // User menu
    this.userMenuBtn = document.getElementById("userMenuBtn");
    this.userDropdown = document.getElementById("userDropdown");

    // Task elements
    this.taskGrid = document.getElementById("taskGrid");
    this.emptyState = document.getElementById("emptyState");
    this.fabBtn = document.getElementById("fabBtn");
    this.modal = document.getElementById("taskModal");
    this.modalClose = document.getElementById("closeModalBtn");
    this.cancelModalBtn = document.getElementById("cancelModalBtn");
    this.saveTaskBtn = document.getElementById("saveTaskBtn");
    this.taskForm = document.getElementById("taskForm");
    this.modalTitle = document.getElementById("modalTitle");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.sortSelect = document.getElementById("sortSelect");
    this.searchInput = document.getElementById("searchInput");

    // Stats elements
    this.pendingCount = document.getElementById("pendingCount");
    this.completedCount = document.getElementById("completedCount");
    this.highPriorityCount = document.getElementById("highPriorityCount");
    this.totalTasks = document.getElementById("totalTasks");
    this.taskCount = document.getElementById("taskCount");
    this.sidebarTaskCount = document.getElementById("sidebarTaskCount");

    // Page buttons
    this.emptyStateAddBtn = document.getElementById("emptyStateAddBtn");
    this.tasksPageAddBtn = document.getElementById("tasksPageAddBtn");
    this.inviteMemberBtn = document.getElementById("inviteMemberBtn");
    this.saveSettingsBtn = document.getElementById("saveSettingsBtn");

    // Analytics elements
    this.analyticsTimeframe = document.getElementById("analyticsTimeframe");

    // Settings elements
    this.displayName = document.getElementById("displayName");
    this.userEmail = document.getElementById("userEmail");
    this.userRole = document.getElementById("userRole");
    this.emailNotif = document.getElementById("emailNotif");
    this.pushNotif = document.getElementById("pushNotif");
    this.taskReminders = document.getElementById("taskReminders");
    this.colorOptions = document.querySelectorAll(".color-option");
  }

  initEventListeners() {
    // Navigation
    this.navItems.forEach((item) => {
      item.addEventListener("click", () => this.switchPage(item));
    });

    // Mobile menu
    if (this.mobileMenuBtn) {
      this.mobileMenuBtn.addEventListener("click", () => {
        this.sidebar.classList.toggle("active");
      });
    }

    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Theme select
    if (this.themeSelect) {
      this.themeSelect.addEventListener("change", (e) => {
        if (e.target.value === "dark") {
          document.body.classList.remove("light-theme");
          this.themeToggle.querySelector("i").className = "fas fa-moon";
        } else if (e.target.value === "light") {
          document.body.classList.add("light-theme");
          this.themeToggle.querySelector("i").className = "fas fa-sun";
        }
      });
    }

    // Notifications
    if (this.notificationBtn) {
      this.notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.notificationsPanel.classList.toggle("open");
      });
    }

    if (this.closeNotificationsBtn) {
      this.closeNotificationsBtn.addEventListener("click", () => {
        this.notificationsPanel.classList.remove("open");
      });
    }

    // User menu
    if (this.userMenuBtn) {
      this.userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.userDropdown.classList.toggle("active");
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.userDropdown?.contains(e.target) &&
        !this.userMenuBtn?.contains(e.target)
      ) {
        this.userDropdown?.classList.remove("active");
      }
      if (
        !this.notificationsPanel?.contains(e.target) &&
        !this.notificationBtn?.contains(e.target)
      ) {
        this.notificationsPanel?.classList.remove("open");
      }
      if (
        !this.sidebar?.contains(e.target) &&
        !this.mobileMenuBtn?.contains(e.target)
      ) {
        this.sidebar?.classList.remove("active");
      }
    });

    // FAB button
    if (this.fabBtn) {
      this.fabBtn.addEventListener("click", () => this.openModal());
    }

    // Modal close
    if (this.modalClose) {
      this.modalClose.addEventListener("click", () => this.closeModal());
    }
    if (this.cancelModalBtn) {
      this.cancelModalBtn.addEventListener("click", () => this.closeModal());
    }

    // Click outside modal
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    // Save task
    if (this.saveTaskBtn) {
      this.saveTaskBtn.addEventListener("click", () => this.saveTask());
    }

    // Form submit
    if (this.taskForm) {
      this.taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveTask();
      });
    }

    // Filters
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Sort
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.render();
      });
    }

    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.render();
      });
    }

    // Empty state add button
    if (this.emptyStateAddBtn) {
      this.emptyStateAddBtn.addEventListener("click", () => this.openModal());
    }

    // Tasks page add button
    if (this.tasksPageAddBtn) {
      this.tasksPageAddBtn.addEventListener("click", () => this.openModal());
    }

    // Invite member button
    if (this.inviteMemberBtn) {
      this.inviteMemberBtn.addEventListener("click", () => {
        alert("🎉 Invite member functionality would open here!");
      });
    }

    // Save settings button
    if (this.saveSettingsBtn) {
      this.saveSettingsBtn.addEventListener("click", () => {
        this.saveSettings();
      });
    }

    // Analytics timeframe
    if (this.analyticsTimeframe) {
      this.analyticsTimeframe.addEventListener("change", () => {
        this.updateAnalytics();
      });
    }

    // Color options
    this.colorOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.colorOptions.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");
        document.documentElement.style.setProperty(
          "--primary-100",
          option.style.backgroundColor,
        );
      });
    });

    // Settings switches
    document.querySelectorAll(".switch input").forEach((switch_) => {
      switch_.addEventListener("change", (e) => {
        const setting = e.target.id;
        const state = e.target.checked ? "enabled" : "disabled";
        this.showNotification(`${setting} ${state}`, "info");
      });
    });

    // Dropdown items
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const text = e.currentTarget.querySelector("span").textContent;
        this.showNotification(`Clicked: ${text}`, "info");
        this.userDropdown.classList.remove("active");
      });
    });
  }

  switchPage(selectedItem) {
    // Update active nav item
    this.navItems.forEach((item) => item.classList.remove("active"));
    selectedItem.classList.add("active");

    // Get page ID
    const pageId = selectedItem.getAttribute("data-page");
    this.currentPage = pageId;

    // Hide all pages
    this.pages.forEach((page) => page.classList.remove("active"));

    // Show selected page
    const activePage = document.getElementById(`${pageId}-page`);
    if (activePage) {
      activePage.classList.add("active");
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
      this.sidebar.classList.remove("active");
    }

    // Update content based on page
    if (pageId === "analytics") {
      this.updateAnalytics();
    } else if (pageId === "tasks") {
      this.renderTasksList();
    }

    this.showNotification(`Navigated to ${pageId}`, "info");
  }

  toggleTheme() {
    document.body.classList.toggle("light-theme");
    const icon = this.themeToggle.querySelector("i");

    if (document.body.classList.contains("light-theme")) {
      icon.className = "fas fa-sun";
      if (this.themeSelect) this.themeSelect.value = "light";
    } else {
      icon.className = "fas fa-moon";
      if (this.themeSelect) this.themeSelect.value = "dark";
    }
  }

  loadSampleTasks() {
    const sampleTasks = [
      {
        id: "1",
        title: "Design new dashboard layout",
        description:
          "Create wireframes and high-fidelity designs for the new analytics dashboard",
        priority: "high",
        category: "design",
        dueDate: "2026-03-01",
        completed: false,
        createdAt: "2026-02-20T10:30:00",
      },
      {
        id: "2",
        title: "Implement user authentication",
        description: "Add login/signup functionality with JWT tokens",
        priority: "high",
        category: "development",
        dueDate: "2026-02-28",
        completed: false,
        createdAt: "2026-02-19T14:20:00",
      },
      {
        id: "3",
        title: "Write API documentation",
        description: "Document all API endpoints for the developer portal",
        priority: "medium",
        category: "work",
        dueDate: "2026-03-05",
        completed: true,
        createdAt: "2026-02-18T09:15:00",
      },
      {
        id: "4",
        title: "Team meeting",
        description: "Weekly sync with the product team",
        priority: "medium",
        category: "work",
        dueDate: "2026-02-24",
        completed: false,
        createdAt: "2026-02-17T16:45:00",
      },
      {
        id: "5",
        title: "Fix responsive bugs",
        description: "Address mobile layout issues on the dashboard",
        priority: "high",
        category: "development",
        dueDate: "2026-02-27",
        completed: false,
        createdAt: "2026-02-16T11:30:00",
      },
      {
        id: "6",
        title: "Create marketing assets",
        description: "Design social media graphics for product launch",
        priority: "low",
        category: "design",
        dueDate: "2026-03-10",
        completed: false,
        createdAt: "2026-02-15T13:20:00",
      },
      {
        id: "7",
        title: "Code review",
        description: "Review pull requests from the team",
        priority: "medium",
        category: "development",
        dueDate: "2026-02-25",
        completed: true,
        createdAt: "2026-02-14T10:00:00",
      },
      {
        id: "8",
        title: "Update dependencies",
        description: "Upgrade npm packages to latest versions",
        priority: "low",
        category: "development",
        dueDate: "2026-03-15",
        completed: false,
        createdAt: "2026-02-13T15:40:00",
      },
      {
        id: "9",
        title: "User testing session",
        description: "Conduct usability tests with 5 participants",
        priority: "high",
        category: "work",
        dueDate: "2026-02-26",
        completed: false,
        createdAt: "2026-02-12T09:30:00",
      },
      {
        id: "10",
        title: "Prepare presentation",
        description: "Create slides for the stakeholder meeting",
        priority: "medium",
        category: "work",
        dueDate: "2026-02-28",
        completed: true,
        createdAt: "2026-02-11T14:15:00",
      },
    ];

    // Only load if no tasks exist
    if (this.tasks.length === 0) {
      this.tasks = sampleTasks;
    }
  }

  openModal(taskToEdit = null) {
    this.currentEditTask = taskToEdit;

    if (taskToEdit) {
      this.modalTitle.textContent = "Edit Task";
      document.getElementById("taskTitle").value = taskToEdit.title;
      document.getElementById("taskDescription").value =
        taskToEdit.description || "";
      document.getElementById("taskPriority").value = taskToEdit.priority;
      document.getElementById("taskCategory").value = taskToEdit.category;
      document.getElementById("taskDueDate").value = taskToEdit.dueDate || "";
      this.saveTaskBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';
    } else {
      this.modalTitle.textContent = "Create New Task";
      this.taskForm.reset();
      this.saveTaskBtn.innerHTML = '<i class="fas fa-plus"></i> Create Task';
    }

    this.modal.classList.add("active");
    document.getElementById("taskTitle").focus();
  }

  closeModal() {
    this.modal.classList.remove("active");
    this.currentEditTask = null;
    this.taskForm.reset();
  }

  saveTask() {
    const title = document.getElementById("taskTitle").value.trim();
    if (!title) {
      this.showNotification("Please enter a task title", "error");
      return;
    }

    const taskData = {
      id: this.currentEditTask
        ? this.currentEditTask.id
        : Date.now().toString(),
      title: title,
      description: document.getElementById("taskDescription").value.trim(),
      priority: document.getElementById("taskPriority").value,
      category: document.getElementById("taskCategory").value,
      dueDate: document.getElementById("taskDueDate").value,
      completed: this.currentEditTask ? this.currentEditTask.completed : false,
      createdAt: this.currentEditTask
        ? this.currentEditTask.createdAt
        : new Date().toISOString(),
    };

    if (this.currentEditTask) {
      const index = this.tasks.findIndex((t) => t.id === taskData.id);
      if (index !== -1) {
        this.tasks[index] = taskData;
      }
      this.showNotification(`Task "${title}" updated`, "success");
    } else {
      this.tasks.unshift(taskData);
      this.showNotification(`Task "${title}" created`, "success");

      // Add notification for new task
      this.notifications.unshift({
        id: Date.now().toString(),
        title: "New task created",
        message: `Task "${title}" has been created`,
        time: "Just now",
        read: false,
        icon: "fa-plus-circle",
      });
      this.updateNotificationBadge();
      this.renderNotifications();
    }

    this.saveToLocalStorage();
    this.closeModal();
    this.render();
    this.updateStats();

    if (this.currentPage === "tasks") {
      this.renderTasksList();
    }
  }

  toggleTaskComplete(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveToLocalStorage();
      this.render();
      this.updateStats();

      if (this.currentPage === "tasks") {
        this.renderTasksList();
      }

      this.showNotification(
        `Task "${task.title}" ${task.completed ? "completed" : "reopened"}`,
        "success",
      );
    }
  }

  deleteTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
      this.saveToLocalStorage();
      this.render();
      this.updateStats();

      if (this.currentPage === "tasks") {
        this.renderTasksList();
      }

      this.showNotification(`Task "${task.title}" deleted`, "warning");
    }
  }

  editTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      this.openModal(task);
    }
  }

  filterTasks() {
    let filtered = [...this.tasks];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(this.searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(this.searchTerm)),
      );
    }

    // Apply status filter
    switch (this.currentFilter) {
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "high":
        filtered = filtered.filter(
          (task) => task.priority === "high" && !task.completed,
        );
        break;
    }

    return filtered;
  }

  sortTasks(tasks) {
    const sorted = [...tasks];

    switch (this.currentSort) {
      case "date-desc":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "priority":
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        sorted.sort(
          (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority],
        );
        break;
      case "alpha":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return sorted;
  }

  render() {
    const filteredTasks = this.filterTasks();
    const sortedTasks = this.sortTasks(filteredTasks);

    if (this.taskGrid) {
      if (sortedTasks.length === 0) {
        this.taskGrid.innerHTML = "";
        if (this.emptyState) this.emptyState.style.display = "block";
      } else {
        if (this.emptyState) this.emptyState.style.display = "none";
        this.taskGrid.innerHTML = sortedTasks
          .map((task) => this.createTaskCard(task))
          .join("");
        this.attachTaskEvents();
      }
    }
  }

  renderTasksList() {
    const tasksList = document.getElementById("tasksList");
    if (!tasksList) return;

    const sortedTasks = this.sortTasks([...this.tasks]);

    if (sortedTasks.length === 0) {
      tasksList.innerHTML =
        '<div class="empty-state"><p>No tasks yet</p></div>';
      return;
    }

    tasksList.innerHTML = sortedTasks
      .map(
        (task) => `
            <div class="task-list-item ${task.completed ? "completed" : ""}">
                <div class="task-list-info">
                    <div class="task-list-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-list-meta">
                        <span><i class="fas fa-flag"></i> ${task.priority}</span>
                        <span><i class="fas fa-folder"></i> ${task.category}</span>
                        <span><i class="fas fa-calendar"></i> ${task.dueDate || "No due date"}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn complete" onclick="window.taskBoard.toggleTaskComplete('${task.id}')">
                        <i class="fas ${task.completed ? "fa-undo" : "fa-check"}"></i>
                    </button>
                    <button class="task-btn edit" onclick="window.taskBoard.editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete" onclick="window.taskBoard.deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `,
      )
      .join("");
  }

  createTaskCard(task) {
    const priorityClass = `priority-${task.priority}`;
    const completedClass = task.completed ? "completed" : "";
    const dueDate = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No due date";

    const taskColor =
      task.priority === "high"
        ? "#ff6b6b"
        : task.priority === "medium"
          ? "#ffd93d"
          : "#4ecdc4";

    return `
            <div class="task-card ${completedClass}" data-task-id="${task.id}" style="--task-color: ${taskColor}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <div class="task-badges">
                        <span class="task-priority ${priorityClass}">${task.priority}</span>
                        <span class="task-category">${task.category}</span>
                    </div>
                </div>
                ${
                  task.description
                    ? `
                    <p class="task-description">${this.escapeHtml(task.description)}</p>
                `
                    : ""
                }
                <div class="task-meta">
                    <span class="task-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${dueDate}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="task-btn complete" title="Toggle complete">
                        <i class="fas ${task.completed ? "fa-undo" : "fa-check"}"></i>
                    </button>
                    <button class="task-btn edit" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
  }

  attachTaskEvents() {
    document.querySelectorAll(".task-card").forEach((card) => {
      const taskId = card.dataset.taskId;

      card.querySelector(".complete").addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleTaskComplete(taskId);
      });

      card.querySelector(".edit").addEventListener("click", (e) => {
        e.stopPropagation();
        this.editTask(taskId);
      });

      card.querySelector(".delete").addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteTask(taskId);
      });
    });
  }

  updateStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter((t) => !t.completed).length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const highPriority = this.tasks.filter(
      (t) => t.priority === "high" && !t.completed,
    ).length;

    if (this.totalTasks) this.totalTasks.textContent = total;
    if (this.pendingCount) this.pendingCount.textContent = pending;
    if (this.completedCount) this.completedCount.textContent = completed;
    if (this.highPriorityCount)
      this.highPriorityCount.textContent = highPriority;
    if (this.taskCount) this.taskCount.textContent = pending;
    if (this.sidebarTaskCount) this.sidebarTaskCount.textContent = pending;
  }

  updateAnalytics() {
    // Update completion rate
    const completionRate = document.querySelector(".progress-value");
    if (completionRate) {
      const total = this.tasks.length;
      const completed = this.tasks.filter((t) => t.completed).length;
      const rate = total ? Math.round((completed / total) * 100) : 0;
      completionRate.textContent = rate + "%";

      const circle = document.querySelector(".progress-circle");
      if (circle) {
        const degrees = (rate / 100) * 360;
        circle.style.background = `conic-gradient(var(--primary-100) ${degrees}deg, rgba(255,255,255,0.1) ${degrees}deg)`;
      }
    }

    // Update priority chart
    const priorityChart = document.getElementById("priorityChart");
    if (priorityChart) {
      const high = this.tasks.filter((t) => t.priority === "high").length;
      const medium = this.tasks.filter((t) => t.priority === "medium").length;
      const low = this.tasks.filter((t) => t.priority === "low").length;
      const total = this.tasks.length;

      priorityChart.innerHTML = `
                <div class="priority-bar-item">
                    <span class="priority-bar-label">High</span>
                    <div class="priority-bar-progress">
                        <div class="priority-bar-fill" style="width: ${total ? (high / total) * 100 : 0}%"></div>
                    </div>
                    <span class="priority-bar-value">${high}</span>
                </div>
                <div class="priority-bar-item">
                    <span class="priority-bar-label">Medium</span>
                    <div class="priority-bar-progress">
                        <div class="priority-bar-fill" style="width: ${total ? (medium / total) * 100 : 0}%"></div>
                    </div>
                    <span class="priority-bar-value">${medium}</span>
                </div>
                <div class="priority-bar-item">
                    <span class="priority-bar-label">Low</span>
                    <div class="priority-bar-progress">
                        <div class="priority-bar-fill" style="width: ${total ? (low / total) * 100 : 0}%"></div>
                    </div>
                    <span class="priority-bar-value">${low}</span>
                </div>
            `;
    }

    // Update activity bars
    const activityBars = document.getElementById("activityBars");
    if (activityBars) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const activityData = days.map(() => Math.floor(Math.random() * 100) + 20);

      activityBars.innerHTML = days
        .map(
          (day, i) => `
                <div class="activity-bar-item">
                    <div class="activity-bar" style="height: ${activityData[i]}px"></div>
                    <span class="activity-bar-label">${day}</span>
                </div>
            `,
        )
        .join("");
    }

    // Update category distribution
    const categoryDist = document.getElementById("categoryDistribution");
    if (categoryDist) {
      const categories = ["work", "personal", "design", "development"];
      const categoryCounts = categories.map(
        (cat) => this.tasks.filter((t) => t.category === cat).length,
      );
      const total = this.tasks.length;

      categoryDist.innerHTML = categories
        .map(
          (cat, i) => `
                <div class="category-item">
                    <span class="category-name">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${total ? (categoryCounts[i] / total) * 100 : 0}%"></div>
                    </div>
                    <span class="category-count">${categoryCounts[i]}</span>
                </div>
            `,
        )
        .join("");
    }
  }

  renderNotifications() {
    const list = document.getElementById("notificationsList");
    if (!list) return;

    const unreadCount = this.notifications.filter((n) => !n.read).length;
    if (this.notificationBadge) {
      this.notificationBadge.textContent = unreadCount;
    }

    list.innerHTML = this.notifications
      .map(
        (notif) => `
            <div class="notification-item ${!notif.read ? "unread" : ""}" data-id="${notif.id}">
                <div class="notification-icon">
                    <i class="fas ${notif.icon}"></i>
                </div>
                <div class="notification-content">
                    <p>${notif.message}</p>
                    <span>${notif.time}</span>
                </div>
            </div>
        `,
      )
      .join("");

    // Add click handlers to mark as read
    list.querySelectorAll(".notification-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id;
        const notif = this.notifications.find((n) => n.id === id);
        if (notif) {
          notif.read = true;
          this.renderNotifications();
        }
      });
    });
  }

  updateNotificationBadge() {
    const unreadCount = this.notifications.filter((n) => !n.read).length;
    if (this.notificationBadge) {
      this.notificationBadge.textContent = unreadCount;
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification-toast ${type}`;

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };

    notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

    notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 32px;
            background: ${
              type === "success"
                ? "var(--secondary-100)"
                : type === "error"
                  ? "var(--primary-100)"
                  : "var(--purple-100)"
            };
            color: white;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  saveSettings() {
    const settings = {
      displayName: this.displayName?.value,
      email: this.userEmail?.value,
      role: this.userRole?.value,
      notifications: {
        email: this.emailNotif?.checked,
        push: this.pushNotif?.checked,
        reminders: this.taskReminders?.checked,
      },
    };

    localStorage.setItem("userSettings", JSON.stringify(settings));
    this.showNotification("Settings saved successfully!", "success");
  }

  saveToLocalStorage() {
    localStorage.setItem("chromaticTasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("chromaticTasks");
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load tasks from localStorage");
        this.loadSampleTasks();
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  window.taskBoard = new TaskBoard();

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
});
