document.addEventListener('DOMContentLoaded', function () {
  // 투두 리스트 관련 요소
  const todoList = document.getElementById('todo-list');
  const newTodoInput = document.getElementById('new-todo');
  const addTodoButton = document.getElementById('add-todo');

  // 투두 리스트 항목 생성 함수
  function createTodoItem(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (completed) {
      li.classList.add('completed');
    }

    // 텍스트 스팬 추가
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    // 버튼 컨테이너 생성
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // 수정 버튼 추가
    const editButton = document.createElement('button');
    editButton.textContent = '수정';
    buttonContainer.appendChild(editButton);

    // 완료 버튼 추가
    const completeButton = document.createElement('button');
    completeButton.textContent = completed ? '완료 취소' : '완료';
    buttonContainer.appendChild(completeButton);

    // 삭제 버튼 추가 (초기에는 숨김)
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.style.display = completed ? 'inline-block' : 'none'; // 완료된 항목만 표시
    buttonContainer.appendChild(deleteButton);

    li.appendChild(buttonContainer);

    // 완료 상태 토글
    completeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      li.classList.toggle('completed');
      deleteButton.style.display = li.classList.contains('completed') ? 'inline-block' : 'none';
      completeButton.textContent = li.classList.contains('completed') ? '완료 취소' : '완료';
      saveTodos();
    });

    // 수정 버튼 기능
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (editButton.textContent === '수정') {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent;
        li.insertBefore(input, span);
        li.removeChild(span);
        editButton.textContent = '저장';
      } else {
        const input = li.querySelector('input');
        if (input.value.trim() !== '') {
          span.textContent = input.value.trim();
          li.insertBefore(span, input);
          li.removeChild(input);
          editButton.textContent = '수정';
          saveTodos();
        }
      }
    });

    // 삭제 버튼 기능
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      saveTodos();
    });

    todoList.appendChild(li);
    saveTodos();
  }

  // 새 투두 추가
  addTodoButton.addEventListener('click', () => {
    const text = newTodoInput.value.trim();
    if (text) {
      createTodoItem(text);
      newTodoInput.value = '';
    }
  });

  newTodoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = newTodoInput.value.trim();
      if (text) {
        createTodoItem(text);
        newTodoInput.value = '';
      }
    }
  });

  // 투두 리스트 저장
  function saveTodos() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach((item) => {
      const text = item.querySelector('span').textContent;
      const completed = item.classList.contains('completed');
      todos.push({ text, completed });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // 투두 리스트 로드
  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.forEach((todo) => createTodoItem(todo.text, todo.completed));
  }

  // 초기화
  loadTodos();

  // 뒤로가기 버튼 기능
  const backButton = document.querySelector('#back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (document.referrer) {
      window.location.href = document.referrer; // 이전 페이지로 이동
      } else {
      window.history.back(); // 이전 페이지 기록이 없으면 history.back() 사용
      }
    });
  }

  // 가계부 관련 요소 및 기능 삭제
  // const accountList = document.getElementById('account-list');
  // const accountDescriptionInput = document.getElementById('account-description');
  // const accountAmountInput = document.getElementById('account-amount');
  // const addAccountButton = document.getElementById('add-account');
  // const totalAmountElement = document.getElementById('total-amount');

  // function updateTotalAmount() { ... }
  // function createAccountItem(description, amount) { ... }
  // addAccountButton.addEventListener('click', () => { ... });
});

const CACHE_NAME = 'todo-app-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
  // 필요에 따라 아이콘 경로 추가: 예: './icons/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시된 파일이 있다면 반환, 없으면 네트워크 요청
        return response || fetch(event.request);
      })
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });

  // Display current date and time on separate lines
  function updateDateTime() {
    const currentDateElement = document.getElementById('current-date');
    const currentTimeElement = document.getElementById('current-time');
    if (currentDateElement && currentTimeElement) {
      const now = new Date();
      currentDateElement.textContent = now.toLocaleDateString();
      currentTimeElement.textContent = now.toLocaleTimeString();
    }
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();
}