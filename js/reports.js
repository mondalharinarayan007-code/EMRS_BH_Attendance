// Attendance report export functions.
        function exportAttendanceListExcel() {
            let fullList = [];
            for(let cls in hostelData) {
                hostelData[cls].forEach(s => {
                    if(s.name !== "VACANT SLOT") {
                        fullList.push({
                            "Date": formattedDate,
                            "Class": `Class ${cls}`,
                            "Roll": s.roll,
                            "Student Name": s.name,
                            "Attendance Status": s.attendance
                        });
                    }
                });
            }

            const worksheet = XLSX.utils.json_to_sheet(fullList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_Report");
            XLSX.writeFile(workbook, `EMRS_Hostel_Attendance_${formattedDate.replace(/ /g, '_')}.xlsx`);
        }

        function exportToPDF() {
            window.print();
        }
