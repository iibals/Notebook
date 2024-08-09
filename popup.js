document.getElementById('theNote').value = "";

// The whole note
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add');
    const hideShowBtn = document.getElementById('hide-show');
    const deleteBtn = document.getElementById('delete');
    const noteTextarea = document.getElementById('theNote');
    const notesContainer = document.getElementById('notesContainer');
    noteTextarea.focus();

    // إنشاء زر الترتيب ديناميكيًا وإضافته إلى الواجهة
    const sortBtn = document.createElement('button');
    sortBtn.id = 'sort';
    sortBtn.style.marginBottom = '10px';
    sortBtn.style.backgroundColor = 'transparent';
    sortBtn.style.border = 'none';
    sortBtn.style.cursor = 'pointer';
    sortBtn.style.fontSize = '14px';
    sortBtn.style.display = 'flex';
    sortBtn.style.alignItems = 'center';
    sortBtn.style.gap = '5px';
    sortBtn.style.marginLeft = '35px';
    document.body.insertBefore(sortBtn, notesContainer);

    const sortIcon = document.createElement('img');
    sortIcon.style.width = '20px';
    sortIcon.style.height = '20px';
    sortBtn.appendChild(sortIcon);

    const sortText = document.createElement('span');
    sortBtn.appendChild(sortText);

    // تعيين الألوان الصحيحة لزر الترتيب
    function applySortButtonColors() {
        if (document.body.classList.contains('dark-mode')) {
            sortText.style.color = '#ffffff';  // لون النص في الوضع الداكن
            sortIcon.style.filter = 'invert(1)';  // عكس ألوان الأيقونة لتظهر بشكل مناسب في الوضع الداكن
        } else {
            sortText.style.color = '#333333';  // لون النص في الوضع العادي
            sortIcon.style.filter = 'invert(0)';  // عدم عكس ألوان الأيقونة في الوضع العادي
        }
    }

    // تحقق من تفعيل الوضع الداكن عند تحميل الصفحة
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // تشغيل الألوان لأول مرة عند تحميل الصفحة
    applySortButtonColors();


    // إنشاء زر التبديل بين الوضعين ووضعه في أسفل اليسار
    const modeToggleBtn = document.createElement('button');
    modeToggleBtn.id = 'mode-toggle';
    modeToggleBtn.style.position = 'absolute';
    modeToggleBtn.style.bottom = '10px';
    modeToggleBtn.style.left = '35px';
    modeToggleBtn.style.backgroundColor = 'transparent';
    modeToggleBtn.style.border = 'none';
    modeToggleBtn.style.cursor = 'pointer';
    document.body.appendChild(modeToggleBtn);

    const modeIcon = document.createElement('img');
    modeIcon.style.width = '30px';
    modeIcon.style.height = '30px';
    modeToggleBtn.appendChild(modeIcon);

    // تعيين الأيقونة الصحيحة بناءً على الوضع الحالي
    function updateModeIcon() {
        if (document.body.classList.contains('dark-mode')) {
            modeIcon.src = 'img/lightmode.svg';
        } else {
            modeIcon.src = 'img/darkmode.svg';
        }
    }

    // تفعيل الوضع الداكن/العادي عند الضغط على الزر
    modeToggleBtn.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        }
        updateModeIcon();
        applySortButtonColors(); // تحديث ألوان زر sort
    });

    // تحديث الأيقونة عند تحميل الصفحة
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    updateModeIcon();
     // End of dark-light mode
    // الحصول على التبويب النشط الحالي
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const currentDomain = new URL(currentTab.url).hostname;

        // عرض الملاحظات المحفوظة عند تحميل الصفحة
        chrome.storage.local.get([currentDomain, 'sortOrder'], function(result) {
            let notes = result[currentDomain] || [];
            let sortOrder = result.sortOrder || 'desc'; // 'desc' لعرض الأحدث في الأعلى

            if (sortOrder === 'asc') {
                notes.reverse(); // ترتيب من الأقدم إلى الأحدث
            }

            notes.forEach(function(note, index) {
                displayNote(note, index);
            });

            updateSortButton(sortOrder); // تحديث السهم حسب ترتيب العرض الحالي

            sortBtn.addEventListener('click', function() {
                sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'; // التبديل بين الترتيبين
                chrome.storage.local.set({ 'sortOrder': sortOrder }, function() {
                    notesContainer.innerHTML = ''; // مسح كل الملاحظات من الواجهة
                    let sortedNotes = [...notes];
                    if (sortOrder === 'asc') {
                        sortedNotes.reverse(); // ترتيب من الأقدم إلى الأحدث
                    }
                    sortedNotes.forEach(function(note, idx) {
                        displayNote(note, idx); // إعادة عرض الملاحظات
                    });
                    updateSortButton(sortOrder); // تحديث السهم بعد التغيير
                });
            });
        });

        function addNote() {
            const note = noteTextarea.value.trim();
            if (note !== '') {
                chrome.storage.local.get([currentDomain, 'sortOrder'], function(result) {
                    let notes = result[currentDomain] || [];
                    let sortOrder = result.sortOrder || 'desc'; // الاحتفاظ بالترتيب الحالي
                    notes.push(note);
                    chrome.storage.local.set({ [currentDomain]: notes }, function() {
                        if (sortOrder === 'desc') {
                            displayNote(note, notes.length - 1); // عرض الملاحظة الجديدة في النهاية
                        } else {
                            notesContainer.innerHTML = ''; // إعادة عرض الملاحظات بترتيب صحيح
                            notes.reverse().forEach(function(note, idx) {
                                displayNote(note, idx);
                            });
                        }
                        noteTextarea.value = ''; // مسح حقل النص بعد الإضافة
                    });
                });
            }
        }

        // Event listener for the button
        addBtn.addEventListener('click', addNote);

        // Event listener for Enter key in the text area
        noteTextarea.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // منع السطر الجديد في textarea
                addNote(); // إضافة الملاحظة
            }
        });

        hideShowBtn.addEventListener('click', function() {
            if (notesContainer.style.display === 'none') {
                // إذا كانت الملاحظات مخفية، عرضها
                notesContainer.style.display = 'block';
            } else {
                // إذا كانت الملاحظات معروضة، إخفائها
                notesContainer.style.display = 'none';
            }
        });

        deleteBtn.addEventListener('click', function() {
            // عرض نافذة تأكيد
            var userConfirmed = confirm("Are you sure you want to delete all notes?");

            if (userConfirmed) {
                // إذا وافق المستخدم
                chrome.storage.local.remove(currentDomain, function() {
                    notesContainer.innerHTML = ''; // مسح كل الملاحظات من الواجهة
                });
            }
        });

        function displayNote(note, index) {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerText = note;
            noteElement.style.position = 'relative';
            noteElement.style.paddingRight = '40px'; // مساحة لزر الحذف
            noteElement.style.backgroundColor = 'transparent'; // خلفية شفافة
            noteElement.style.border = 'none'; // إزالة الحدود

            // إضافة زر حذف لكل ملاحظة
            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'img/deleteicon.svg'; // المسار إلى الصورة
            deleteIcon.className = 'delete-icon';
            deleteIcon.style.position = 'absolute';
            deleteIcon.style.top = '75%';
            deleteIcon.style.right = '10px';
            deleteIcon.style.transform = 'translateY(-50%)';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.width = '20px';
            deleteIcon.style.height = '20px';

            deleteIcon.addEventListener('click', function() {
                chrome.storage.local.get([currentDomain], function(result) {
                    let notes = result[currentDomain] || [];
                    notes.splice(index, 1); // حذف الملاحظة المحددة بناءً على المؤشر
                    chrome.storage.local.set({ [currentDomain]: notes }, function() {
                        notesContainer.innerHTML = ''; // مسح كل الملاحظات من الواجهة
                        notes.forEach(function(note, idx) {
                            displayNote(note, idx); // إعادة عرض الملاحظات المتبقية
                        });
                    });
                });
            });


            noteElement.appendChild(deleteIcon);
            notesContainer.insertBefore(noteElement, notesContainer.firstChild); // عرض الملاحظة في الأعلى
        }

        function updateSortButton(sortOrder) {
            if (sortOrder === 'desc') {
                sortIcon.src = 'img/arrowdown.svg';
                sortText.innerText = 'Sort by Oldest';
            } else {
                sortIcon.src = 'img/arrowup.svg';
                sortText.innerText = 'Sort by Newest';
            }
        }
    });
});
