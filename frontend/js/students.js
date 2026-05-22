const API_URL = 'http://localhost:3000/api';

const studentState = {
  students: [],
  search: '',
  status: 'all'
};

const elements = {
  tableBody: document.getElementById('studentsTableBody'),
  message: document.getElementById('studentMessage'),
  search: document.getElementById('studentSearch'),
  statusFilter: document.getElementById('statusFilter'),
  modal: document.getElementById('studentModal'),
  modalTitle: document.getElementById('studentModalTitle'),
  form: document.getElementById('studentForm'),
  saveButton: document.getElementById('saveStudentBtn')
};

window.addEventListener('load', () => {
  document.body.classList.add('dashboard-page');
  checkUserSession();
  setupStudentListeners();
  loadStudents();
});

async function checkUserSession() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      window.location.href = 'index.html';
      return;
    }

    const data = await response.json();
    if (data.success && data.user) {
      displayUserInfo(data.user);
    }
  } catch (error) {
    console.error('Session check error:', error);
    window.location.href = 'index.html';
  }
}

function displayUserInfo(user) {
  document.getElementById('userName').textContent = user.fullName || user.username;
  document.getElementById('userRole').textContent = capitalize(user.role || 'user');
}

function setupStudentListeners() {
  document.getElementById('newStudentBtn').addEventListener('click', () => openStudentModal());
  document.getElementById('closeStudentModal').addEventListener('click', closeStudentModal);
  document.getElementById('cancelStudentForm').addEventListener('click', closeStudentModal);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('sidebarLogout').addEventListener('click', handleLogout);
  elements.form.addEventListener('submit', saveStudent);

  elements.search.addEventListener('input', debounce((event) => {
    studentState.search = event.target.value.trim();
    loadStudents();
  }, 250));

  elements.statusFilter.addEventListener('change', (event) => {
    studentState.status = event.target.value;
    loadStudents();
  });

  elements.tableBody.addEventListener('click', handleTableAction);
  elements.modal.addEventListener('click', (event) => {
    if (event.target === elements.modal) {
      closeStudentModal();
    }
  });
}

async function loadStudents() {
  const params = new URLSearchParams();

  if (studentState.search) {
    params.set('search', studentState.search);
  }

  if (studentState.status !== 'all') {
    params.set('status', studentState.status);
  }

  try {
    const response = await fetch(`${API_URL}/students?${params.toString()}`, {
      credentials: 'include'
    });

    if (response.status === 401) {
      window.location.href = 'index.html';
      return;
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Unable to load students');
    }

    studentState.students = data.students || [];
    renderStudents();
  } catch (error) {
    console.error('Load students error:', error);
    showMessage(error.message || 'Unable to load students', 'error');
  }
}

function renderStudents() {
  if (studentState.students.length === 0) {
    elements.tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No students found</td></tr>';
    return;
  }

  elements.tableBody.innerHTML = studentState.students.map((student) => `
    <tr>
      <td>${escapeHtml(student.roll_number)}</td>
      <td>${escapeHtml(student.first_name)} ${escapeHtml(student.last_name)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.phone || '-')}</td>
      <td><span class="status-badge ${student.status}">${capitalize(student.status)}</span></td>
      <td>${formatDate(student.enrollment_date)}</td>
      <td class="table-actions">
        <button type="button" class="text-button" data-action="edit" data-id="${student.id}">Edit</button>
        <button type="button" class="text-button danger" data-action="delete" data-id="${student.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function handleTableAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const student = studentState.students.find((item) => item.id === Number(button.dataset.id));
  if (!student) {
    return;
  }

  if (button.dataset.action === 'edit') {
    openStudentModal(student);
  }

  if (button.dataset.action === 'delete') {
    deleteStudent(student);
  }
}

function openStudentModal(student = null) {
  elements.form.reset();
  elements.message.style.display = 'none';
  document.getElementById('studentId').value = student?.id || '';
  elements.modalTitle.textContent = student ? 'Edit Student' : 'Add Student';
  elements.saveButton.textContent = student ? 'Update Student' : 'Save Student';

  if (student) {
    document.getElementById('rollNumber').value = student.roll_number || '';
    document.getElementById('firstName').value = student.first_name || '';
    document.getElementById('lastName').value = student.last_name || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('dateOfBirth').value = toInputDate(student.date_of_birth);
    document.getElementById('gender').value = student.gender || '';
    document.getElementById('enrollmentDate').value = toInputDate(student.enrollment_date);
    document.getElementById('status').value = student.status || 'active';
    document.getElementById('city').value = student.city || '';
    document.getElementById('state').value = student.state || '';
    document.getElementById('postalCode').value = student.postal_code || '';
    document.getElementById('address').value = student.address || '';
  } else {
    document.getElementById('enrollmentDate').value = toInputDate(new Date());
  }

  elements.modal.classList.add('open');
  elements.modal.setAttribute('aria-hidden', 'false');
  document.getElementById('rollNumber').focus();
}

function closeStudentModal() {
  elements.modal.classList.remove('open');
  elements.modal.setAttribute('aria-hidden', 'true');
}

async function saveStudent(event) {
  event.preventDefault();

  const id = document.getElementById('studentId').value;
  const payload = getStudentPayload();
  const url = id ? `${API_URL}/students/${id}` : `${API_URL}/students`;

  elements.saveButton.disabled = true;
  elements.saveButton.textContent = id ? 'Updating...' : 'Saving...';

  try {
    const response = await fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Unable to save student');
    }

    closeStudentModal();
    showMessage(data.message, 'success');
    await loadStudents();
  } catch (error) {
    console.error('Save student error:', error);
    showMessage(error.message || 'Unable to save student', 'error');
  } finally {
    elements.saveButton.disabled = false;
    elements.saveButton.textContent = id ? 'Update Student' : 'Save Student';
  }
}

async function deleteStudent(student) {
  const confirmed = confirm(`Delete ${student.first_name} ${student.last_name}?`);
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/students/${student.id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Unable to delete student');
    }

    showMessage(data.message, 'success');
    await loadStudents();
  } catch (error) {
    console.error('Delete student error:', error);
    showMessage(error.message || 'Unable to delete student', 'error');
  }
}

async function handleLogout(event) {
  event.preventDefault();

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } finally {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
}

function getStudentPayload() {
  return {
    roll_number: document.getElementById('rollNumber').value,
    first_name: document.getElementById('firstName').value,
    last_name: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    date_of_birth: document.getElementById('dateOfBirth').value,
    gender: document.getElementById('gender').value,
    enrollment_date: document.getElementById('enrollmentDate').value,
    status: document.getElementById('status').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    postal_code: document.getElementById('postalCode').value,
    address: document.getElementById('address').value
  };
}

function showMessage(message, type) {
  elements.message.textContent = message;
  elements.message.className = `login-message ${type}`;
  elements.message.style.display = 'block';
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function toInputDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

function capitalize(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function debounce(callback, wait) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), wait);
  };
}
