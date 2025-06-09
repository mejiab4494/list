const choreInput = document.getElementById("choreInput");
const enter = document.getElementById("enter");
const deleteBtn = document.getElementById("delete");
const renderChores = document.getElementById("renderChores");

let saveChores = JSON.parse(localStorage.getItem('chores')) || [];

function saveToLocalStorage() {
  localStorage.setItem('chores', JSON.stringify(saveChores));
}

function addValue() {
  const inputValue = choreInput.value.trim().toLowerCase();

  if (inputValue !== '') {
    const newChore = { text: inputValue, done: false };

    if (saveChores.some(chore => chore.text === inputValue)) {
      alert('Chore already in the list');
    } else {
      saveChores.push(newChore);
      saveToLocalStorage();
      choreInput.value = '';
      return newChore;
    }
  }

  return null;
}

function deleteSingle(deleteChoreBtn, choreItem, chore) {
  deleteChoreBtn.addEventListener("click", () => {
    const index = saveChores.indexOf(chore);
    if (index !== -1) {
      saveChores.splice(index, 1);
      saveToLocalStorage();
    }
    renderChores.removeChild(choreItem);
  });
}

function toggleBox(checkbox, text, chore) {
  checkbox.addEventListener("change", () => {
    chore.done = checkbox.checked;
    text.classList.toggle("completed", chore.done);
    saveToLocalStorage();
  });
}

function createChoreItem(chore) {
  const choreItem = document.createElement("div");
  choreItem.classList.add("chore-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = chore.done;
  checkbox.classList.add("checkbox");

  const text = document.createElement("p");
  text.innerText = chore.text;
  if (chore.done) text.classList.add("completed");

  const deleteChoreBtn = document.createElement("button");
  deleteChoreBtn.innerText = "Delete";
  deleteChoreBtn.classList.add("delete-chore-btn");

  toggleBox(checkbox, text, chore);
  deleteSingle(deleteChoreBtn, choreItem, chore);

  choreItem.appendChild(checkbox);
  choreItem.appendChild(text);
  choreItem.appendChild(deleteChoreBtn);
  renderChores.appendChild(choreItem);
}

function renderValue() {
  const chore = addValue();
  if (chore) {
    createChoreItem(chore);
  }
}

function erase() {
  const hasChecked = saveChores.some(chore => chore.done);

  if (hasChecked) {
    // remeve all checked chores
    saveChores = saveChores.filter(chore => !chore.done);
  } else if (saveChores.length > 0) {
    // No checked chore — remove last chore
    saveChores.pop();
  }

  saveToLocalStorage();

  // Re-render the list
  renderChores.innerHTML = '';
  loadChoresFromStorage();
}

function loadChoresFromStorage() {
  saveChores.forEach(createChoreItem);
}

loadChoresFromStorage();

enter.addEventListener('click', renderValue);
deleteBtn.addEventListener('click', erase);
choreInput.addEventListener('keydown', (event) => {
  if(event.key === 'Enter') {
    renderValue();
  }
})
