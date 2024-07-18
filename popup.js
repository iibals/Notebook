document.getElementById('theNote').value = "";

// The whole note
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add');
    const hideBtn = document.getElementById('hide');
    const deleteBtn = document.getElementById('delete');
    const noteTextarea = document.getElementById('theNote');
    const notesContainer = document.getElementById('notesContainer');

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

        addBtn.addEventListener('click', function() {
            const note = noteTextarea.value.trim();
            if (note !== '') {
                chrome.storage.local.get([currentDomain], function(result) {
                    let notes = result[currentDomain] || [];
                    notes.push(note);
                    chrome.storage.local.set({ [currentDomain]: notes }, function() {
                        displayNote(note);
                        noteTextarea.value = ''; // تفريغ حقل النص بعد الإضافة
                    });
                });
            }
        });

        hideBtn.addEventListener('click', function() {
            // إخفاء جميع الملاحظات
            notesContainer.style.display = 'none';
        });

        deleteBtn.addEventListener('click', function() {
            chrome.storage.local.remove(currentDomain, function() {
                notesContainer.innerHTML = ''; // حذف جميع الملاحظات من واجهة المستخدم
            });
        });

        function displayNote(note) {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerText = note;
            notesContainer.appendChild(noteElement);
        }
    });
});
