document.getElementById('theNote').value = "";

// The whole note
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add');
    const hideBtn = document.getElementById('hide');
    const deleteBtn = document.getElementById('delete');
    const noteTextarea = document.getElementById('theNote');

    addBtn.addEventListener('click', function() {
        const note = noteTextarea.value.trim();
        if (note !== '') {
            chrome.storage.local.get(['notes'], function(result) {
                let notes = result.notes || [];
                notes.push(note);
                chrome.storage.local.set({ 'notes': notes }, function() {
                    alert('Notes added :' + note);
                });
            });
        }
    });

    hideBtn.addEventListener('click', function() {
        // Hide all notes logic
        document.querySelectorAll('.note').forEach(function(note) {
            note.style.display = 'none';
        });
        alert('Hided');
    });

    deleteBtn.addEventListener('click', function() {
        chrome.storage.local.remove('notes', function() {
            alert('Delete all notes Confirmed');
        });
    });
});
