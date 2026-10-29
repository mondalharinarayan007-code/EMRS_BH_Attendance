// Initial EMRS student roster and vacant-slot generation.
function getInitialList(classNum, totalSlots, names, filledCount) {
            let list = [];
            for (let i = 1; i <= totalSlots; i++) {
                if (i <= filledCount) {
                    list.push({
                        roll: i, 
                        id: `${i}_${classNum}_2026`, 
                        name: names[i - 1],
                        attendance: "Present"
                    });
                } else {
                    list.push({
                        roll: i, 
                        id: `${i}_${classNum}_2026`, 
                        name: "VACANT SLOT",
                        attendance: "N/A"
                    });
                }
            }
            return list;
        }

const rawHostelData = {
            "VI": getInitialList("6", 35, [
                "MOHIT HANSDA", "SUROJIT HEMBRAM", "DAKTAR MARDI", "BENZAMIN HEMBRAM", "ROHIT TUDU", 
                "BAIDYANATH HEMBRAM", "AKASH MURMU", "AJIT MURMU", "SOLOMON KISKU", "AKASH HEMBRAM", 
                "MEHNAT HEMBRAM", "SUBHOJIT HANSDA", "DIP SOREN", "KALIRAM MARDI", "RANA TUDU", 
                "AJINTO HANSDA", "JOYDEB SOREN", "ABHIJIT HANSDA", "RITESH SOREN", "DEBIPRASAD MARDI", 
                "MEGHNATH HEMBRAM", "DIPAK MARDI", "PRADIP MARANDI", "ABHIJIT HANSDA", "RAMESH MURMU", 
                "SHIBNATH TUDU", "RUPCHAND BESRA", "INDRADEB TUDU", "SANDIP HEMBRAM", "KALICHARAN TUDU", 
                "RAJKUMAR KISKU", "SUMON TUDU", "SUBHASH MUDI"
            ], 33),
            "VII": getInitialList("7", 35, [
                "RAKESH MURMU", "RAM SOREN", "NIRMAL MURMU", "KALYAN HANSDA", "ROHIT MURMU", 
                "JACK NILANGSHU SOREN", "DEBPRIYA HANSDA", "BIKASH MARDI", "SRINATH HEMBRAM", "RAJ MURMU", 
                "SUBHADEEP MURMU", "SHYMAL MURMU", "TARASHANKAR MURMU", "AMAR CHANDRA MARDI", "SATYAJIT TUDU", 
                "TILAK MADDI", "SUJIT HANSDA", "JOY HEMBRAM", "SANATAN TUDU", "DEBASISH KISKU", 
                "SAHEB SOREN", "RAHUL HANSDA", "RABINATH MARDI", "KARTICK SOREN", "DEVRAJ SOREN", 
                "LAKHAN SOREN", "SOUVIK KISKU", "SAMIR HEMBRAM", "RAKESH SOREN", "PABITRA TUDU", 
                "ABHIJIT MARDI", "SHIBAM TUDU"
            ], 32),
            "VIII": getInitialList("8", 35, [
                "RANIT HEMBRAM", "UJJAL SOREN", "RABINDRANATH MURMU", "BISWANATH HEMBRAM", "SAYAN HANSDA", 
                "RONIT MURMU", "MANIK MARANDI", "FANIBHUSAN KISKU", "CHHIDU HEMBRAM", "INDRA MURMU", 
                "KAMALBABU SOREN", "SANJOY HEMBRAM", "KALIDAS HANSDA", "DEBNATH ORANG", "AKASH SOREN", 
                "AMIT MADDI", "RABINDRANATH MURMU", "RONI MURMU", "ROHIT SOREN", "ABHISHEK TUDU", 
                "KINGSHUK MURMU", "RANJAN TUDU", "ARJUN MARDI", "TRISHANJIT MURMU", "ARITRA TUDU", 
                "SHIBA MURMU", "BIPLAB SOREN", "SAMIR HEMBRAM", "BISHNU TUDU", "ROKINATH HEMBRAM", 
                "SOHAN MARANDI", "SAIGUN TUDU", "SUBHOJIT KISKU", "BAPAN MARDI"
            ], 34),
            "IX": getInitialList("9", 35, [
                "MARSHAL HANSDA", "SUBHASH HEMBRAM", "ABINASH BASKI", "SUBHAJEET MURMU", "BISWANATH TUDU", 
                "PRAKASH TUDU", "SANJIT HANSDA", "JOHAN HANSDA", "SAHADEV TUDU", "NARESH HANSDA", 
                "KAJAL HANSDA", "BISWAJIT TUDU", "SHIBNATH MURMU", "ROHIT TUDU", "BISWAJIT SOREN", 
                "PARIMAL TUDU", "KARTICK MARDI", "MANASA BASKI", "PRIYOTOSH MUDI", "DEEP SOREN", 
                "RAJESH SOREN", "RAJIV KORA", "INDRAJIT SOREN", "BISWANATH MARDI", "SOMNATH MURMU", 
                "RAHUL HANSDA", "SUJAN HANSDA", "ABHIJEET HANSDA", "NARAYAN MURMU", "IMON HEMBRAM", "SUDIP SOREN"
            ], 31),
            "X": getInitialList("10", 35, [
                "JATIN MURMU", "RAJKUMAR TUDU", "BIKASH MURMU", "MANINDRA MURMU", "NITYANANDA TUDU", 
                "SAGUN MURMU", "AMIT KISKU", "SAMIR TUDU", "SUBHAM HEMBRAM", "SOUMADEEP MARDI", 
                "ROMEO KISKU", "SHIBA MURMU", "MARSHAL TUDU", "BIKRAM SARDAR", "SUBHAJIT MARDI", 
                "SUKANTA MURMU", "SIMAN HEMBRAM", "PRABIN KUMAR SOREN", "SUSANTA SOREN", "SHIBNATH HANSDA", 
                "DEBENDU HEMBRAM", "RAGHUNATH MARDI", "AJOY MARDI", "BIKASH TUDU", "SUSHIL HANSDA", 
                "SUJOY MURMU", "RAJU MARANDI", "JONI MURMU", "AMIT HANSDA"
            ], 29),
            "XI": getInitialList("11", 35, [
                "DEVJIT MARDI", "SANTOSH TUDU", "SACHIN MARDI", "SUPRIYO SARDAR", "SUBHOJIT TUDU", 
                "AKASH MURMU", "JOYDEV MURMU", "PARAMESWAR MARDI", "RAMKRISHNA TUDU", "BISHNU TUDU", 
                "DIP SOREN", "LABINDRA MARDI", "DEBICHARAN MURMU", "KRITIBAS SOREN", "DIBANJAN HANSDA", 
                "PRANATA SOREN", "SUNIL MURMU", "JOYEL SOREN", "ABINASH MARDI", "PRADIP MUDI", 
                "PIJUSH MURMU", "ROHIT TUDU", "DEBASISH MARANDI", "PABITRA HEMBRAM", "BAIDYANATH MURMU", 
                "BUDIRAM MURMU", "KARTIK HEMBRAM", "ANANTA HANSDA", "KAILASH HEMBROM", "SAILEN SOREN"
            ], 30),
            "XII": getInitialList("12", 35, [
                "SOUMEN KISKU", "RAHUL HEMROM", "SHYMAL HEMBRAM", "MOHAN HEMBRAM", "RIJU MURMU", 
                "SHYAMLAL SOREN", "LAXMAN SOREN", "DEB TUDU", "SUJOY TUDU", "JOSEF KISKU", 
                "PRADIP KUMAR KISKU", "SURENDRANATH SOREN", "SUBRATA HEMBRAM", "APURBA KISKU", "SANDIP MUDI", 
                "SURYA BASKI", "AKASH HANSDA", "SUMIT MURMU", "XAVIER SOREN", "ABINASH SOREN", 
                "LAKHISWAR MAHALI", "KRISHNA HEMROM", "BISWAJIT BASKEY", "PRASANTA SOREN", "JISEVA HEMBRAM", "NIRANJAN HANSDA"
            ], 26)
        };
