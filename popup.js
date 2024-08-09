document.getElementById('theNote').value = "";

// The whole note
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add');
    const hideShowBtn = document.getElementById('hide-show');
    const deleteBtn = document.getElementById('delete');
    const noteTextarea = document.getElementById('theNote');
    const notesContainer = document.getElementById('notesContainer');
    noteTextarea.focus();

    // الحصول على التبويب النشط الحالي
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const currentDomain = new URL(currentTab.url).hostname;

        // عرض الملاحظات المحفوظة عند تحميل الصفحة
        chrome.storage.local.get([currentDomain], function(result) {
            let notes = result[currentDomain] || [];
            notes.forEach(function(note) {
                displayNote(note);
            });
        });

        function addNote() {
            const note = noteTextarea.value.trim();
            if (note !== '') {
                chrome.storage.local.get([currentDomain], function(result) {
                    let notes = result[currentDomain] || [];
                    notes.push(note);
                    chrome.storage.local.set({ [currentDomain]: notes }, function() {
                        displayNote(note); // Display the new note
                        noteTextarea.value = ''; // Clear the text area after adding
                    });
                });
            }
        }
        // Event listener for the button
        addBtn.addEventListener('click', addNote);

        // Event listener for Enter key in the text area
        noteTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent new line in the textarea
                addNote(); // Add the note
            }
        });

        hideShowBtn.addEventListener('click', function() {
            if (notesContainer.style.display === 'none') {
                // إذا كانت الملاحظات مخفية، عرضها
                notesContainer.style.display = 'block';
                toggleIcon.src = 'img/hide.svg';
                toggleText.textContent = 'Hide Notes';
            } else {
                // إذا كانت الملاحظات معروضة، إخفائها
                notesContainer.style.display = 'none';
                toggleIcon.src = 'img/show.svg';
                toggleText.textContent = 'Show Notes';
            }
        });

        deleteBtn.addEventListener('click', function() {
            // Display a confirmation dialog
            var userConfirmed = confirm("Are you sure you want to delete all notes?");

            if (userConfirmed) {
                // User clicked "OK"
                chrome.storage.local.remove(currentDomain, function() {
                    notesContainer.innerHTML = ''; // Clear all notes from the UI
                });
            }
        });

        function displayNote(note) {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerText = note;
            notesContainer.appendChild(noteElement);
        }
    });
  // close the window
});
