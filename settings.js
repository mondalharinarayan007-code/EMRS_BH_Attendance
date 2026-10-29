// Theme and application settings.
        function setTheme(theme) {
            const allowed = ['tribal','sand','terracotta','sky','lavender','slate'];
            if (!allowed.includes(theme)) theme = 'tribal';
            document.body.dataset.theme = theme;
            localStorage.setItem('emrsTheme', theme);
            document.querySelectorAll('[data-theme-choice]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === theme)));
            const colors = {tribal:'#426B50',sand:'#80643D',terracotta:'#89563A',sky:'#3E718F',lavender:'#6D5AA8',slate:'#456184'};
            document.querySelector('meta[name="theme-color"]').setAttribute('content', colors[theme]);
        }

        function changeAppPassword() {
            const next = document.getElementById('newAppPassword').value;
            const confirm = document.getElementById('confirmAppPassword').value;
            if (next.length < 4) { alert('Password must be at least 4 characters.'); return; }
            if (next !== confirm) { alert('Passwords do not match.'); return; }
            localStorage.setItem('emrsAppPassword', next);
            document.getElementById('newAppPassword').value = '';
            document.getElementById('confirmAppPassword').value = '';
            alert('Password updated on this device.');
        }

        function openSettingsModal() {
            const select = document.getElementById('settingsClassSelect');
            select.innerHTML = "";
            for(let cls in hostelData) {
                let opt = document.createElement('option');
                opt.value = cls;
                opt.innerText = `Class ${cls}`;
                select.appendChild(opt);
            }
            loadSettingsClassStudents();
            document.getElementById('settingsModal').classList.remove('hidden');
        }

        function loadSettingsClassStudents() {
            const cls = document.getElementById('settingsClassSelect').value;
            const container = document.getElementById('settingsStudentListContainer');
            container.innerHTML = "";

            if(!hostelData[cls]) return;

            hostelData[cls].forEach((s) => {
                const row = document.createElement('div');
                row.className = "flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm";
                row.innerHTML = `
                    <span class="font-bold text-slate-500 w-6">#${s.roll}</span>
                    <input type="text" value="${s.name}" data-roll="${s.roll}" class="setting-name-input flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-emerald-500 font-semibold text-slate-800" placeholder="Enter name or VACANT SLOT">
                    <button onclick="removeStudentSlot('${cls}', ${s.roll})" class="text-rose-500 hover:text-rose-700 px-1.5 py-0.5 text-xs font-bold" title="Delete">🗑️</button>
                `;
                container.appendChild(row);
            });
        }

        function addNewStudentSlot() {
            const cls = document.getElementById('settingsClassSelect').value;
            const list = hostelData[cls];
            const nextRoll = list.length > 0 ? list[list.length - 1].roll + 1 : 1;
            
            list.push({
                roll: nextRoll,
                id: `${nextRoll}_${cls}_2026`,
                name: "NEW STUDENT",
                attendance: "Present"
            });
            loadSettingsClassStudents();
        }

        function removeStudentSlot(cls, roll) {
            hostelData[cls] = hostelData[cls].filter(s => s.roll !== roll);
            loadSettingsClassStudents();
        }

        function addNewClass() {
            const newClsInput = document.getElementById('newClassNameInput');
            const newCls = newClsInput.value.trim().toUpperCase();
            if(!newCls) {
                alert("Please enter a valid class name!");
                return;
            }
            if(hostelData[newCls]) {
                alert("Class already exists!");
                return;
            }

            hostelData[newCls] = [
                { roll: 1, id: `1_${newCls}_2026`, name: "NEW STUDENT", attendance: "Present" }
            ];
            newClsInput.value = "";
            localStorage.setItem('hostelHostelData_V8_2026', JSON.stringify(hostelData));
            
            openSettingsModal();
            switchClass(newCls);
        }

        function saveSettingsChanges() {
            const cls = document.getElementById('settingsClassSelect').value;
            const inputs = document.querySelectorAll('.setting-name-input');
            
            inputs.forEach(input => {
                const roll = parseInt(input.getAttribute('data-roll'));
                const student = hostelData[cls].find(s => s.roll === roll);
                if(student) {
                    student.name = input.value.trim() || "VACANT SLOT";
                }
            });

            localStorage.setItem('hostelHostelData_V8_2026', JSON.stringify(hostelData));
            renderClassTabs();
            renderCards(hostelData[activeClass]);
            closeModal('settingsModal');
            alert("Settings saved successfully!");
        }
