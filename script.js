document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-button');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const allBtn = document.getElementById('all-btn');
    const completedBtn = document.getElementById('completed-btn');
    const activeBtn = document.getElementById('active-btn');
  
    // 새로운 할 일 항목(li) 생성 함수
    function createTodoItem(text, completed = false) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (completed) {
        li.classList.add('completed');
      }
  
      // 할 일 텍스트를 담는 span 생성
      const span = document.createElement('span');
      span.textContent = text;
      li.appendChild(span);
  
      // 수정 버튼 생성
      const editButton = document.createElement('button');
      editButton.textContent = '수정';
      li.appendChild(editButton);
  
      // 삭제 버튼 생성
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '삭제';
      li.appendChild(deleteButton);
  
      // 삭제 버튼 이벤트: 항목 삭제 후 저장
      deleteButton.addEventListener('click', function(e) {
        e.stopPropagation(); // li 클릭 이벤트 전파 방지
        li.remove();
        saveTodos();
      });
  
      // 수정 버튼 이벤트: 수정 모드와 저장 모드 전환
      editButton.addEventListener('click', function(e) {
        e.stopPropagation();
        if (editButton.textContent === '수정') {
          // 수정 모드: span을 input으로 교체
          const editInput = document.createElement('input');
          editInput.type = 'text';
          editInput.value = span.textContent;
          li.insertBefore(editInput, span);
          li.removeChild(span);
          editButton.textContent = '저장';
        } else {
          // 저장 모드: input 값을 span으로 복구
          const editInput = li.querySelector('input');
          const newText = editInput.value.trim();
          if (newText !== "") {
            const newSpan = document.createElement('span');
            newSpan.textContent = newText;
            li.insertBefore(newSpan, editInput);
            li.removeChild(editInput);
          }
          editButton.textContent = '수정';
          saveTodos();
        }
      });
  
      // li 클릭 시 완료 상태 토글 (버튼, input 제외)
      li.addEventListener('click', function(e) {
        if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'input') {
          return;
        }
        li.classList.toggle('completed');
        saveTodos();
      });
  
      todoList.appendChild(li);
      saveTodos();
    }
  
    // 할 일 추가 함수
    function addTodo() {
      const text = todoInput.value.trim();
      if (text === "") return;
      createTodoItem(text, false);
      todoInput.value = "";
    }
  
    // 추가 버튼 및 Enter 키 이벤트 등록
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addTodo();
      }
    });
  
    // 필터링 기능: 전체, 완료, 미완료 항목 보여주기
    function applyFilter(filter) {
      const items = document.querySelectorAll('.todo-item');
      items.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        if (filter === 'all') {
          item.style.display = 'flex';
        } else if (filter === 'completed') {
          item.style.display = isCompleted ? 'flex' : 'none';
        } else if (filter === 'active') {
          item.style.display = !isCompleted ? 'flex' : 'none';
        }
      });
    }
  
    allBtn.addEventListener('click', function() { applyFilter('all'); });
    completedBtn.addEventListener('click', function() { applyFilter('completed'); });
    activeBtn.addEventListener('click', function() { applyFilter('active'); });
  
    // localStorage에 할 일 목록 저장
    function saveTodos() {
      const todos = [];
      const items = document.querySelectorAll('.todo-item');
      items.forEach(item => {
        const span = item.querySelector('span');
        if (!span) return; // 수정 모드 중인 항목은 스킵
        const text = span.textContent;
        const completed = item.classList.contains('completed');
        todos.push({ text, completed });
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  
    // localStorage에서 할 일 목록 불러오기
    function loadTodos() {
      const todosStr = localStorage.getItem('todos');
      if (todosStr) {
        const todos = JSON.parse(todosStr);
        todos.forEach(todo => {
          createTodoItem(todo.text, todo.completed);
        });
      }
    }
  
    // 페이지 로드 시 저장된 할 일 불러오기
    loadTodos();
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