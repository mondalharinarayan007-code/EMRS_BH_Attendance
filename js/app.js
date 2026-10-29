// Core attendance app: login, class navigation, attendance, profiles and PWA registration.
const DEFAULT_APP_PASSWORD = '2013';
        function unlockApp(event) {
            if (event) event.preventDefault();
            const savedPassword = localStorage.getItem('emrsAppPassword') || DEFAULT_APP_PASSWORD;
            const input = document.getElementById('appPassword');
            if (input.value !== savedPassword) {
                document.getElementById('loginError').classList.remove('hidden');
                input.select();
                return false;
            }
            document.getElementById('loginError').classList.add('hidden');
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('appShell').classList.remove('hidden');
            sessionStorage.setItem('emrsUnlocked', 'yes');
            return false;
        }


        setTheme(localStorage.getItem('emrsTheme') || 'tribal');

        const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        document.getElementById('currentDate').innerText = formattedDate;


        let hostelData = JSON.parse(localStorage.getItem('hostelHostelData_V8_2026')) || rawHostelData;
        let activeClass = Object.keys(hostelData)[0] || "VI";
        let dashboardFilter = null;
        const HISTORY_KEY = 'emrsAttendanceHistoryV1';
        let attendanceHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
        let historyExportRows = [];
        function localDateKey(date = new Date()) { const d = new Date(date); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
        function saveHistory() { localStorage.setItem(HISTORY_KEY, JSON.stringify(attendanceHistory)); }
        function snapshotToday() { const key = localDateKey(); if (!attendanceHistory[key]) { attendanceHistory[key] = {}; for (const cls in hostelData) { attendanceHistory[key][cls] = {}; (hostelData[cls]||[]).filter(s=>s.name !== 'VACANT SLOT').forEach(s=>{ attendanceHistory[key][cls][String(s.roll)] = s.attendance || 'Absent'; }); } saveHistory(); } }
        snapshotToday();

        function renderClassTabs() {
            const container = document.getElementById('classTabsContainer');
            container.innerHTML = "";
            
            for(let cls in hostelData) {
                const btn = document.createElement('button');
                btn.onclick = () => switchClass(cls);
                btn.setAttribute('data-class', cls);
                btn.className = `class-btn px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-all shadow-sm ${activeClass === cls ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'}`;
                btn.innerText = `Class ${cls}`;
                container.appendChild(btn);
            }
        }

        function switchClass(className) {
            activeClass = className;
            dashboardFilter = null;
            renderClassTabs();
            if(hostelData[className]) renderCards(hostelData[className]);
            updateGlobalStats();
            updateFilterBar();
        }

        function getAllStudents() {
            const all = [];
            for (const cls in hostelData) {
                (hostelData[cls] || []).forEach(item => {
                    if (item.name !== "VACANT SLOT") all.push({ ...item, _class: cls });
                });
            }
            return all;
        }

        function updateGlobalStats() {
            const all = getAllStudents();
            const globalStr = all.length;
            const globalAbs = all.filter(s => s.attendance === "Absent").length;
            const globalPres = all.filter(s => s.attendance === "Present").length;
            document.getElementById('globalStrength').innerText = globalStr;
            document.getElementById('globalAbsent').innerText = globalAbs;
            document.getElementById('globalPresent').innerText = globalPres;
            const classStudents = (hostelData[activeClass] || []).filter(s => s.name !== "VACANT SLOT");
            document.getElementById('classPresent').innerText = classStudents.filter(s => s.attendance === "Present").length;
            document.getElementById('classAbsent').innerText = classStudents.filter(s => s.attendance === "Absent").length;
            document.getElementById('classLate').innerText = classStudents.filter(s => s.attendance === "Late").length;
        }

        function updateFilterBar() {
            const bar = document.getElementById('dashboardFilterBar');
            const label = document.getElementById('dashboardFilterLabel');
            if (!dashboardFilter) { bar.classList.add('hidden'); return; }
            bar.classList.remove('hidden');
            const labels = {
                all: 'Showing all students across all classes',
                Present: 'Showing all Present students across all classes',
                Absent: 'Showing all Absent students across all classes',
                'class:Present': `Showing Present students — Class ${activeClass}`,
                'class:Absent': `Showing Absent students — Class ${activeClass}`,
                'class:Late': `Showing Late students — Class ${activeClass}`
            };
            label.textContent = labels[dashboardFilter] || 'Filtered students';
            document.querySelectorAll('.dashboard-tile').forEach(tile => tile.classList.remove('dashboard-tile-active'));
            const map = {all:'tileTotalStudents',Absent:'tileTotalAbsent',Present:'tileTotalPresent','class:Present':'tileClassPresent','class:Absent':'tileClassAbsent','class:Late':'tileClassLate'};
            const activeTile = document.getElementById(map[dashboardFilter]);
            if (activeTile) activeTile.classList.add('dashboard-tile-active');
        }

        function applyDashboardFilter(filter) {
            dashboardFilter = filter;
            let rows;
            if (filter === 'all') rows = getAllStudents();
            else if (filter === 'Present' || filter === 'Absent') rows = getAllStudents().filter(s => s.attendance === filter);
            else if (filter.startsWith('class:')) {
                const status = filter.split(':')[1];
                rows = ((hostelData[activeClass] || []).filter(s => s.name !== 'VACANT SLOT' && s.attendance === status)).map(s => ({...s, _class: activeClass}));
            } else rows = getAllStudents();
            renderStudentItems(rows);
            updateFilterBar();
        }

        function clearDashboardFilter() {
            dashboardFilter = null;
            renderCards(hostelData[activeClass] || []);
            updateFilterBar();
        }

        function renderCards(data) {
            const rows = (data || []).filter(item => item.name !== "VACANT SLOT").map(item => ({...item, _class: activeClass}));
            renderStudentItems(rows);
            updateGlobalStats();
        }

        function renderStudentItems(activeStudents) {
            const container = document.getElementById('studentCardContainer');
            container.innerHTML = "";
            if (!activeStudents.length) {
                container.innerHTML = '<div class="glass-card rounded-xl p-6 text-center text-sm font-semibold" style="color:var(--app-text)">No students match this tile/filter.</div>';
                return;
            }
            activeStudents.forEach(item => {
                const cls = item._class || activeClass;
                const isPresent = item.attendance === "Present";
                const isLate = item.attendance === "Late";
                const isAbsent = item.attendance === "Absent";
                const card = document.createElement('div');
                card.className = "glass-card p-2.5 rounded-xl shadow-sm transition hover:shadow border border-white flex flex-col gap-1.5";
                card.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="bg-emerald-600 text-white font-bold text-[11px] w-5 h-5 rounded-md flex items-center justify-center shadow-sm">${item.roll}</span>
                            <div class="min-w-0"><h4 onclick="viewProfile(${item.roll}, '${String(cls).replace(/'/g, "\'")}')" class="font-bold text-slate-900 text-xs cursor-pointer hover:text-emerald-600">${item.name}</h4><p class="text-[10px] text-slate-500">Class ${cls}</p></div>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-1.5">
                        <button onclick="updateAttendanceForClass('${String(cls).replace(/'/g, "\'")}', ${item.roll}, 'Present')" class="py-2 px-1 rounded-lg border font-bold text-[11px] transition flex items-center justify-center gap-1 ${isPresent ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-emerald-100 text-emerald-800'}">✓ Present</button>
                        <button onclick="updateAttendanceForClass('${String(cls).replace(/'/g, "\'")}', ${item.roll}, 'Late')" class="py-2 px-1 rounded-lg border font-bold text-[11px] transition flex items-center justify-center gap-1 ${isLate ? 'status-late' : 'bg-white border-amber-200 text-amber-800'}">◷ Late</button>
                        <button onclick="updateAttendanceForClass('${String(cls).replace(/'/g, "\'")}', ${item.roll}, 'Absent')" class="py-2 px-1 rounded-lg border font-bold text-[11px] transition flex items-center justify-center gap-1 ${isAbsent ? 'bg-rose-600 text-white border-rose-600' : 'bg-white border-rose-100 text-rose-700'}">✕ Absent</button>
                    </div>`;
                container.appendChild(card);
            });
        }

        function updateAttendanceForClass(className, roll, status) {
            const student = (hostelData[className] || []).find(s => s.roll === roll && s.name !== 'VACANT SLOT');
            if (!student) return;
            student.attendance = status;
            localStorage.setItem('hostelHostelData_V8_2026', JSON.stringify(hostelData));
            const dayKey = localDateKey();
            if (!attendanceHistory[dayKey]) attendanceHistory[dayKey] = {};
            if (!attendanceHistory[dayKey][className]) attendanceHistory[dayKey][className] = {};
            attendanceHistory[dayKey][className][String(roll)] = status;
            saveHistory();
            updateGlobalStats();
            if (dashboardFilter) applyDashboardFilter(dashboardFilter);
            else renderCards(hostelData[activeClass] || []);
        }

        function updateAttendance(roll, status) { updateAttendanceForClass(activeClass, roll, status); }


        function openFinishModal() {
            const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('reportDate').innerText = formattedDate;
            document.getElementById('reportClockTime').innerText = nowTime;

            let html = `
                <table class="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-xs">
                    <thead>
                        <tr class="bg-slate-900 text-white">
                            <th class="p-1.5 border border-slate-700">Class</th>
                            <th class="p-1.5 border border-slate-700 text-center">Total</th>
                            <th class="p-1.5 border border-slate-700 text-center">Present</th>
                            <th class="p-1.5 border border-slate-700 text-center">Late</th>
                            <th class="p-1.5 border border-slate-700 text-center">Absent</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            let grandTotal = 0, grandPresent = 0, grandLate = 0, grandAbsent = 0;

            for(let cls in hostelData) {
                let cTotal = 0, cPres = 0, cLate = 0, cAbs = 0;
                hostelData[cls].forEach(s => {
                    if(s.name !== "VACANT SLOT") {
                        cTotal++;
                        if(s.attendance === "Present") cPres++;
                        else if(s.attendance === "Late") cLate++;
                        else cAbs++;
                    }
                });

                grandTotal += cTotal;
                grandPresent += cPres;
                grandLate += cLate;
                grandAbsent += cAbs;

                html += `
                    <tr>
                        <td class="p-1.5 border border-slate-200 font-bold">Class ${cls}</td>
                        <td class="p-1.5 border border-slate-200 text-center">${cTotal}</td>
                        <td class="p-1.5 border border-slate-200 text-center text-emerald-600 font-bold">${cPres}</td>
                        <td class="p-1.5 border border-slate-200 text-center font-bold" style="color:#A66B08">${cLate}</td>
                        <td class="p-1.5 border border-slate-200 text-center text-rose-600 font-bold">${cAbs}</td>
                    </tr>
                `;
            }

            html += `
                        <tr class="bg-emerald-50 font-bold">
                            <td class="p-1.5 border border-emerald-200">Grand Total</td>
                            <td class="p-1.5 border border-emerald-200 text-center">${grandTotal}</td>
                            <td class="p-1.5 border border-emerald-200 text-center text-emerald-700">${grandPresent}</td>
                            <td class="p-1.5 border border-emerald-200 text-center" style="color:#A66B08">${grandLate}</td>
                            <td class="p-1.5 border border-emerald-200 text-center text-rose-700">${grandAbsent}</td>
                        </tr>
                    </tbody>
                </table>
            `;

            document.getElementById('summaryContent').innerHTML = html;
            document.getElementById('finishModal').classList.remove('hidden');
        }


        function getStudentHistory(className, roll) {
            return Object.keys(attendanceHistory).sort().filter(day => attendanceHistory[day]?.[className] && attendanceHistory[day][className][String(roll)])
              .map(day => ({ date: day, status: attendanceHistory[day][className][String(roll)] }));
        }
        function viewProfile(roll, className = activeClass) {
            const student = (hostelData[className] || []).find(s => s.roll === roll && s.name !== 'VACANT SLOT');
            if(!student) return;
            const records = getStudentHistory(className, roll);
            const now = new Date(); const monthPrefix = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`; const yearPrefix = String(now.getFullYear());
            const month = records.filter(r=>r.date.startsWith(monthPrefix)); const year = records.filter(r=>r.date.startsWith(yearPrefix));
            const pct = arr => arr.length ? Math.round(arr.filter(r=>r.status==='Present'||r.status==='Late').length/arr.length*100) : null;
            let streak = 0, streakStart = ''; const todayKey = localDateKey();
            for (const r of records.slice().sort((a,b)=>b.date.localeCompare(a.date))) {
              if (r.date > todayKey) continue;
              if (r.status === 'Absent') { streak++; streakStart = r.date; }
              else if (streak) break;
            }
            const status = student.attendance || 'Absent';
            const recordRows = records.slice().reverse().slice(0,20).map(r=>`<div class="flex justify-between gap-2 border-b py-1"><span>${r.date}</span><strong class="${r.status==='Present'?'text-emerald-700':r.status==='Late'?'text-amber-700':'text-rose-700'}">${r.status}</strong></div>`).join('') || '<p>No dated attendance records yet.</p>';
            const content = `<div class="space-y-2 text-xs">
              <p class="flex justify-between border-b pb-1"><strong>Class / Roll:</strong><span>${className} / ${student.roll}</span></p>
              <p class="flex justify-between border-b pb-1"><strong>Student ID:</strong><span class="font-mono">${student.id || '—'}</span></p>
              <p class="flex justify-between border-b pb-1"><strong>Name:</strong><span class="font-bold">${student.name}</span></p>
              <p class="flex justify-between border-b pb-1"><strong>Current status:</strong><span class="font-bold ${status==='Present'?'text-emerald-700':status==='Late'?'text-amber-700':'text-rose-700'}">${status}</span></p>
              <div class="grid grid-cols-2 gap-2"><div class="rounded-lg p-2 bg-white border"><p class="text-slate-500">Continuous absent</p><strong class="text-base ${streak?'text-rose-700':''}">${streak} recorded day(s)</strong>${streak?`<p>From ${streakStart}</p>`:''}</div><div class="rounded-lg p-2 bg-white border"><p class="text-slate-500">Records saved</p><strong class="text-base">${records.length} days</strong></div>
              <div class="rounded-lg p-2 bg-white border"><p class="text-slate-500">This month</p><strong class="text-base">${pct(month)===null?'—':pct(month)+'%'}</strong><p>${month.filter(r=>r.status==='Present').length} Present · ${month.filter(r=>r.status==='Late').length} Late · ${month.filter(r=>r.status==='Absent').length} Absent</p></div><div class="rounded-lg p-2 bg-white border"><p class="text-slate-500">This year</p><strong class="text-base">${pct(year)===null?'—':pct(year)+'%'}</strong><p>${year.filter(r=>r.status==='Present').length} Present · ${year.filter(r=>r.status==='Late').length} Late · ${year.filter(r=>r.status==='Absent').length} Absent</p></div></div>
              <div class="rounded-lg bg-white border p-2"><strong>Recent attendance history</strong><div class="mt-1 max-h-40 overflow-y-auto">${recordRows}</div></div>
              <p class="text-[10px] text-slate-500">Percentage counts Present and Late as attended, based only on saved daily records. Missing dates are not assumed absent.</p>
            </div>`;
            document.getElementById('profileContent').innerHTML = content;
            document.getElementById('profileModal').classList.remove('hidden');
        }

        function openHistoryModal() {
          const dateInput = document.getElementById('historyDate'); dateInput.value = localDateKey();
          const clsSelect = document.getElementById('historyClass'); clsSelect.innerHTML = Object.keys(hostelData).map(c=>`<option value="${c}" ${c===activeClass?'selected':''}>Class ${c}</option>`).join('');
          document.getElementById('historyModal').classList.remove('hidden'); showHistory();
        }
        function showHistory() {
          const date = document.getElementById('historyDate').value; const cls = document.getElementById('historyClass').value;
          const saved = attendanceHistory[date]?.[cls] || {}; const students = (hostelData[cls]||[]).filter(s=>s.name!=='VACANT SLOT');
          historyExportRows = students.filter(s=>saved[String(s.roll)]).map(s=>({Date:date,Class:cls,Roll:s.roll,Student:s.name,Status:saved[String(s.roll)]}));
          const counts = {Present:0,Late:0,Absent:0}; historyExportRows.forEach(r=>counts[r.Status]=(counts[r.Status]||0)+1);
          document.getElementById('historySummary').innerHTML = historyExportRows.length ? `<div class="rounded-lg p-2 bg-emerald-50 border border-emerald-100">${date} · Class ${cls} · Records ${historyExportRows.length} · Present ${counts.Present} · Late ${counts.Late} · Absent ${counts.Absent}</div>` : `<div class="rounded-lg p-3 bg-amber-50 border border-amber-200">এই তারিখে Class ${cls}-এর কোনো সংরক্ষিত Attendance নেই।</div>`;
          document.getElementById('historyResults').innerHTML = historyExportRows.map(r=>`<div class="flex items-center justify-between gap-2 border rounded-lg px-3 py-2 text-xs"><span><strong>${r.Roll}. ${r.Student}</strong></span><strong class="${r.Status==='Present'?'text-emerald-700':r.Status==='Late'?'text-amber-700':'text-rose-700'}">${r.Status}</strong></div>`).join('');
        }
        function exportHistoryCSV() {
          if (!historyExportRows.length) { alert('No saved attendance records for this date and class.'); return; }
          const cols = ['Date','Class','Roll','Student','Status']; const csv = [cols.join(','), ...historyExportRows.map(r=>cols.map(c=>'"'+String(r[c]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n');
          const filename=`EMRS_Attendance_${document.getElementById('historyDate').value}_Class_${document.getElementById('historyClass').value}`;
          if (window.XLSX) { const ws=XLSX.utils.json_to_sheet(historyExportRows); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Attendance History'); XLSX.writeFile(wb,filename+'.xlsx'); }
          else { const url = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'})); const a=document.createElement('a'); a.href=url; a.download=filename+'.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
        }
        function openBackupModal() { document.getElementById('backupModal').classList.remove('hidden'); }
        function downloadBackup() {
          const data = {app:'EMRS Attendance',version:2,createdAt:new Date().toISOString(),roster:hostelData,history:attendanceHistory,theme:localStorage.getItem('emrsTheme')||'tribal',password:localStorage.getItem('emrsAppPassword')||null};
          const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); const a=document.createElement('a'); a.href=url; a.download=`EMRS_Attendance_Backup_${localDateKey()}.json`; a.click(); URL.revokeObjectURL(url);
        }
        function restoreBackup() {
          const input=document.getElementById('restoreFile'); const file=input.files?.[0]; if(!file){alert('Please choose a backup JSON file first.');return;}
          const reader=new FileReader(); reader.onload=()=>{ try { const data=JSON.parse(reader.result); if(data.app!=='EMRS Attendance'||!data.roster||typeof data.roster!=='object'||!data.history||typeof data.history!=='object') throw new Error('Unsupported backup format');
            if(!confirm('Restore will replace the current student roster and attendance history. Continue?')) return;
            downloadBackup(); localStorage.setItem('hostelHostelData_V8_2026',JSON.stringify(data.roster)); localStorage.setItem(HISTORY_KEY,JSON.stringify(data.history)); if(data.theme)localStorage.setItem('emrsTheme',data.theme); if(data.password)localStorage.setItem('emrsAppPassword',data.password);
            alert('Backup restored. The app will reload.'); location.reload();
          } catch(e){alert('Restore failed: invalid or unsupported backup file.');} }; reader.readAsText(file);
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }


        window.onload = function() {
            snapshotToday();
            renderClassTabs();
            switchClass(activeClass);
        };

        // PWA service worker registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js').catch(() => {});
            });
        }
