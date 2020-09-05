document.addEventListener("DOMContentLoaded", function(event) { 
    var homeCode = document.getElementById("homeCode");
    homeCode.addEventListener("click", homePage); 

    var directoryCode = document.getElementById("directoryCode");
    directoryCode.addEventListener("click", directoryPage); 
 
    var coursesCode = document.getElementById("coursesCode");
    coursesCode.addEventListener("click", coursesPage); 
 
    var infographicsCode = document.getElementById("infographicsCode");
    infographicsCode.addEventListener("click", infographicsPage); 

    var home = document.getElementById("home");
    var directory = document.getElementById("directory");
    var courses = document.getElementById("courses");
    var infographics = document.getElementById("infographics");

    document.addEventListener('keypress', function(event){
        if(event.which == "13"){
            event.preventDefault();
        }
    })

    function homePage(){
        currentPage = "home";
        home.classList.remove("home-hide");
        home.classList.add("home-show");
        directory.classList.remove("directory-show");
        directory.classList.add("directory-hide");
        courses.classList.remove("courses-show");
        courses.classList.add("courses-hide");
        infographics.classList.remove("infographics-show");
        infographics.classList.add("infographics-hide");
    }

    function directoryPage(){
        loadDirectory();
        home.classList.remove("home-show");
        home.classList.add("home-hide");
        directory.classList.remove("directory-hide");
        directory.classList.add("directory-show");
        courses.classList.remove("courses-show");
        courses.classList.add("courses-hide");
        infographics.classList.remove("infographics-show");
        infographics.classList.add("infographics-hide");
    }

    function coursesPage(){
        loadCourses();
        home.classList.remove("home-show");
        home.classList.add("home-hide");
        directory.classList.remove("directory-show");
        directory.classList.add("directory-hide");
        courses.classList.remove("courses-hide");
        courses.classList.add("courses-show");
        infographics.classList.remove("infographics-show");
        infographics.classList.add("infographics-hide");
    }

    function infographicsPage(){
        loadInfographics();
        home.classList.remove("home-show");
        home.classList.add("home-hide");
        directory.classList.remove("directory-show");
        directory.classList.add("directory-hide");
        courses.classList.remove("courses-show");
        courses.classList.add("courses-hide");
        infographics.classList.remove("infographics-hide");
        infographics.classList.add("infographics-show");
    }
});

function loadDirectory() { 
    var url = "http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=" + encodeURIComponent("https://unidirectory.auckland.ac.nz/rest/search?orgFilter=MATHS");
    fetch(url,{
                method:'GET',
                headers:{

                    'Accept':'application/json'

                }
        })
    .then(res => {
            if (res.ok) {
                console.log('SUCCESS');
                return res.json();
            } else {
                console.log('UNSUCCESSFUL');
            }
        })
    .then(
            directory => 
                {   console.log(directory);
                    appendData(directory);  
                    appendVcardData(directory); 
                })
    .catch(error => 
            console.log('ERROR')
        )
    


    
    function appendData(data){
        data.list.forEach(element => {
            if(element.imageId !== undefined) {
                fetch("http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=" +
                encodeURI("https://unidirectory.auckland.ac.nz/people/imageraw/" + element.profileUrl[1] + "/" + element.imageId + "/biggest"),{
                    method:'GET',
                    headers:{

                        'Accept':'image/*'

                    }
                })
                .then(res => {
                    if (res.ok) {
                        console.log('SUCCESS');
                    } else {
                        console.log('UNSUCCESSFUL');
                    }
                    return res.blob();
                })
                .then(
                    images => 
                        {   console.log(images);
                            appendImgData(images);
                        })
                .catch(error => 
                    console.log('ERROR')
                )
            }
            else {
                var anonContainer = document.getElementById("anonContainter");
                var img = document.createElement("img");
                img.src = "http://foreedge.com.au/wp-content/uploads/2016/01/Unknown.gif";
                img.style.width = '200px'
                img.style.height = '200px'
                anonContainer.appendChild(img);
            }
        }
        )  

    }

    function appendImgData(data) {
        var imageContainer = document.getElementById("imageContainter");
        var img = document.createElement("img");
        img.src = URL.createObjectURL(data);
        imageContainer.appendChild(img);
    }

    function appendVcardData(data){
        data.list.forEach(element => 

                fetch("http://redsox.uoa.auckland.ac.nz/cors/CorsProxyService.svc/proxy?url=" + encodeURIComponent("https://unidirectory.auckland.ac.nz/people/vcard/" + element.profileUrl[1]),{
                        method:'GET',
                })
                .then(res => {
                        if (res.ok) {
                            console.log('SUCCESS');
                            return res.text();
                        } else {
                            console.log('UNSUCCESSFUL');
                            return null;
                        }
                    })
                .then(
                        vCard => 
                            {   
                                if(vCard !== null) {
                                    console.log(vCard);
                                    showVcards(vCard); 
                                }
   
                            })
                .catch(error => 
                        console.log('ERROR')
                    )
                
            )
    }

    function showVcards(res){
        var phone;
        var address;
        var email;
        var vCard = res.split('\n');
        for (let j = 0; j < vCard.length; j++) {
            var info = vCard[j];

            if(info.startsWith("TEL")){           
                var temp = info.split(';');
                var temp = info.split(',');

                for (let i = 0; i < temp.length; i++) {
                    if(temp[i].startsWith("VOICE:")){
                        phone = temp[i].substring(6);
                        console.log(phone);
                    }
                }
            }    
            else if(info.startsWith("ADR")){      
                var temp = info.split(';');
                var length = temp.length;
                address = temp[length - 1];
                console.log(address);
            }           
            else if(info.startsWith("EMAIL")){     
                var temp = info.substring(6); 
                email = temp.split(':'); 
                console.log(email[1]);             
            }                      
        }

        var addressContainer = document.getElementById("addressContainter");
        var addressSection = document.createElement("address");

        if(email !== null && email.length > 1) {
            var emailEl = document.createElement("a");
            var br = document.createElement("br");
            if(emailEl !== null) {
                emailEl.href = "mailto:" + email[1];
                emailEl.text = "Email: " + email[1];
                addressSection.appendChild(emailEl);
                addressSection.appendChild(br);
            }
        }

        if(phone !== null && phone.length > 1) {
            var phoneEl = document.createElement("a");
            if(phoneEl !== null) {
                phoneEl.href = "tel:" + phone;
                phoneEl.text = "Phone: " + phone;
                addressSection.appendChild(phoneEl);
            }
        }

        if(address !== null && address.length > 1) {
            var addEl = document.createElement("div");
            var br = document.createElement("br");
            if(addEl !== null) {
                addEl.innerHTML = "Address: " + address;
                addressSection.appendChild(addEl);
                addressSection.appendChild(br);
            }
        }

        addressContainer.appendChild(addressSection);
    }
}

function loadCourses() { 

    var url = "https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=MATHS&year=2020&size=500";
    fetch(url,{
                method:'GET',
                headers:{

                    'Accept':'application/json'

                }
        })
    .then(res => {
            if (res.ok) {
                console.log('SUCCESS');
            } else {
                console.log('UNSUCCESSFUL');
            }
            return res.json();
        })
    .then(
            courses => 
                {   //courses.data.forEach(element => console.log(element));
                    courses.data.forEach(element => 
                        {var coursesContainer = document.getElementById("coursesContainer");
                        var courseContainer = document.createElement("div");
                        var h2 = document.createElement("h2");
                        var year = document.createElement("h2");
                        var h3 = document.createElement("h3");
                        var h4 = document.createElement("h4");
                        var button = document.createElement('BUTTON');  
                        var br = document.createElement("br");
                        h2.innerHTML = element.subject + " " + element.catalogNbr;
                        year.innerHTML = element.year;
                        h3.innerHTML = element.title;
                        h4.innerHTML = element.description;
                        button.innerHTML = "Show Timetable";
                        button.style.marginBottom = "20px";
                        courseContainer.style.backgroundColor = "#87CEEB";
                        courseContainer.appendChild(h2);
                        courseContainer.appendChild(year);
                        courseContainer.appendChild(h3);
                        courseContainer.appendChild(h4);
                        courseContainer.appendChild(button);
                        courseContainer.appendChild(br);
                        coursesContainer.appendChild(courseContainer);
                        button.addEventListener("click", ()=>appendTimetableData(element.catalogNbr)); 
                        });
                })
    .catch(error => 
            console.log('ERROR')
        )
    
    function appendTimetableData(e){

        fetch( "https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2020&subject=MATHS&size=500&catalogNbr=" + e,{
                method:'GET',
                method:'GET',
                headers:{

                    'Accept':'application/json'

                }
        })
        .then(res => {
                if (res.ok) {
                    console.log('SUCCESS');
                    return res.json();
                } else {
                    console.log('UNSUCCESSFUL');
                }
            })
        .then(
                timetable => 
                    {   
                        if(timetable !== null) {
                            var popup = window.open("", "Timetable", "menubar=no,location=no,toolbar=no,status=no,scrollbars=no, width=1000, height=1000");

                            var timetableContainer = popup.document.createElement("div");
                            popup.document.body.appendChild(timetableContainer);
                            var table = popup.document.createElement("table");
                            table.style.border = "1px solid black";
                            timetableContainer.appendChild(table);
                            var title = table.insertRow(-1);
                            var tc1 = title.insertCell(0);
                            tc1.innerHTML = "Start Date";
                            tc1.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc1);
                            var tc2 = title.insertCell(1);
                            tc2.innerHTML = "End Date";
                            tc2.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc2);
                            var tc3 = title.insertCell(2);
                            tc3.innerHTML = "Start Time";
                            tc3.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc3);
                            var tc4 = title.insertCell(3);
                            tc4.innerHTML = "End Time";
                            tc4.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc4);
                            var tc5 = title.insertCell(4);
                            tc5.innerHTML = "Location";
                            tc5.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc5);
                            var tc6 = title.insertCell(5);
                            tc6.innerHTML = "Day of Week";
                            tc6.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc6);
                            var tc7 = title.insertCell(6);
                            tc7.innerHTML = "Meeting Number";
                            tc7.style.backgroundColor = "#87CEEB";
                            applyStyletoCell(tc7);


                            timetable.data.forEach(element => {
                                var meetingPatterns = element.meetingPatterns;
                                meetingPatterns.forEach(meeting => {
                                    var row = table.insertRow(-1);
                                    var cell1 = row.insertCell(0);
                                    applyStyletoCell(cell1);
                                    var cell2 = row.insertCell(1);
                                    applyStyletoCell(cell2);
                                    var cell3 = row.insertCell(2);
                                    applyStyletoCell(cell3);
                                    var cell4 = row.insertCell(3);
                                    applyStyletoCell(cell4);
                                    var cell5 = row.insertCell(4);
                                    applyStyletoCell(cell5);
                                    var cell6 = row.insertCell(5);
                                    applyStyletoCell(cell6);
                                    var cell7 = row.insertCell(6);
                                    applyStyletoCell(cell7);
  

                                    cell1.innerHTML = meeting.startDate;
                                    cell2.innerHTML = meeting.endDate;
                                    cell3.innerHTML = meeting.startTime;
                                    cell4.innerHTML = meeting.endTime;
                                    cell5.innerHTML = meeting.location;
                                    cell6.innerHTML = meeting.daysOfWeek;
                                    cell7.innerHTML = meeting.meetingNumber;
                                })
                            });
                            popup.document.close();
                        }

                    })
        .catch(error => 
                console.log('ERROR')
            )
            
    }
}

function applyStyletoCell(cell) {
    cell.style.border = "1px solid black";
    cell.style.padding = "10px";
}

function loadInfographics() { 
    fetch("https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g" ,{
                method:'GET',
                headers:{

                    'Accept':'application/json'

                }
        })
    .then(res => {
            if (res.ok) {
                console.log('SUCCESS');
                return res.json();
            } else {
                console.log('UNSUCCESSFUL');
            }
        })
    .then(
            infographics => 
                {   console.log(infographics); 
                    for (let j = 0; j < infographics.length; j++) {
                        if(infographics[j] >= 0 || infographics[j] <= 100){
                            if(Math.floor(infographics[j]/10) <= 1){
                                var logoContainer1 = document.getElementById("logoContainer");
                                var logo1container = document.createElement("div");
                                var logo1a = document.createElement("img");
                                var day1 = document.createElement("h2");
                                day1.style.float = "left";
                                day1.innerHTML = j + 1;
                                logo1a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo1a.style.width = "130px";
                                logo1a.style.width = "130px";
                                logo1container.appendChild(day1);
                                logo1container.appendChild(logo1a);
                                logoContainer1.appendChild(logo1container);
                            } else if(Math.floor(infographics[j]/10) == 2) {
                                    var logoContainer2 = document.getElementById("logoContainer");
                                    var logo2container = document.createElement("div");
                                    var logo2a = document.createElement("img");
                                    var logo2b = document.createElement("img");
                                    var day2 = document.createElement("h2");
                                    day2.style.float = "left";
                                    day2.innerHTML = j + 1;
                                    logo2a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                    logo2a.style.width = "130px";
                                    logo2a.style.width = "130px";
                                    logo2b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                    logo2b.style.width = "130px";
                                    logo2b.style.width = "130px";
                                    logo2container.appendChild(logo2a);
                                    logo2container.appendChild(logo2b);
                                    logo2container.appendChild(day2);
                                    logoContainer2.appendChild(logo2container);

                            } else if(Math.floor(infographics[j]/10) == 3){
                                var logoContainer3 = document.getElementById("logoContainer");
                                var logo3container = document.createElement("div");
                                var logo3a = document.createElement("img");
                                var logo3b = document.createElement("img");
                                var logo3c = document.createElement("img");
                                var day3 = document.createElement("h2");
                                day3.style.float = "left";
                                day3.innerHTML = j + 1;
                                logo3a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo3a.style.width = "130px";
                                logo3a.style.width = "130px";
                                logo3b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo3b.style.width = "130px";
                                logo3b.style.width = "130px";
                                logo3c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo3c.style.width = "130px";
                                logo3c.style.width = "130px";
                                logo3container.appendChild(logo3a);
                                logo3container.appendChild(logo3b);
                                logo3container.appendChild(logo3c);
                                logo3container.appendChild(day3);
                                logoContainer3.appendChild(logo3container);
                            } else if(Math.floor(infographics[j]/10) == 4){
                                var logoContainer4 = document.getElementById("logoContainer");
                                var logo4container = document.createElement("div");
                                var logo4a = document.createElement("img");
                                var logo4b = document.createElement("img");
                                var logo4c = document.createElement("img");
                                var logo4d = document.createElement("img");
                                var day4 = document.createElement("h2");
                                day4.style.float = "left";
                                day4.innerHTML = j + 1;
                                logo4a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo4a.style.width = "130px";
                                logo4a.style.width = "130px";
                                logo4b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo4b.style.width = "130px";
                                logo4b.style.width = "130px";
                                logo4c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo4c.style.width = "130px";
                                logo4c.style.width = "130px";
                                logo4d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo4d.style.width = "130px";
                                logo4d.style.width = "130px";
                                logo4container.appendChild(logo4a);
                                logo4container.appendChild(logo4b);
                                logo4container.appendChild(logo4c);
                                logo4container.appendChild(logo4d);
                                logo4container.appendChild(day4);
                                logoContainer4.appendChild(logo4container);
                            } else if(Math.floor(infographics[j]/10) == 5){
                                var logoContainer5 = document.getElementById("logoContainer");
                                var logo5container = document.createElement("div");
                                var logo5a = document.createElement("img");
                                var logo5b = document.createElement("img");
                                var logo5c = document.createElement("img");
                                var logo5d = document.createElement("img");
                                var logo5e = document.createElement("img");
                                var day5 = document.createElement("h2");
                                day5.style.float = "left";
                                day5.innerHTML = j;
                                logo5a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo5a.style.width = "130px";
                                logo5a.style.width = "130px";
                                logo5b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo5b.style.width = "130px";
                                logo5b.style.width = "130px";
                                logo5c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo5c.style.width = "130px";
                                logo5c.style.width = "130px";
                                logo5d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo5d.style.width = "130px";
                                logo5d.style.width = "130px";
                                logo5e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo5e.style.width = "130px";
                                logo5e.style.width = "130px";
                                logo5container.appendChild(logo5a);
                                logo5container.appendChild(logo5b);
                                logo5container.appendChild(logo5c);
                                logo5container.appendChild(logo5d);
                                logo5container.appendChild(logo5e);
                                logo5container.appendChild(day5);
                                logoContainer5.appendChild(logo5container);

                            } else if(Math.floor(infographics[j]/10)== 6){
                                var logoContainer6 = document.getElementById("logoContainer");
                                var logo6container = document.createElement("div");
                                var logo6a = document.createElement("img");
                                var logo6b = document.createElement("img");
                                var logo6c = document.createElement("img");
                                var logo6d = document.createElement("img");
                                var logo6e = document.createElement("img");
                                var logo6f = document.createElement("img");
                                var day6 = document.createElement("h2");
                                day6.style.float = "left";
                                day6.innerHTML = j + 1;
                                logo6a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6a.style.width = "130px";
                                logo6a.style.width = "130px";
                                logo6b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6b.style.width = "130px";
                                logo6b.style.width = "130px";
                                logo6c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6c.style.width = "130px";
                                logo6c.style.width = "130px";
                                logo6d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6d.style.width = "130px";
                                logo6d.style.width = "130px";
                                logo6e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6e.style.width = "130px";
                                logo6e.style.width = "130px";
                                logo6f.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo6f.style.width = "130px";
                                logo6f.style.width = "130px";
                                logo6container.appendChild(logo6a);
                                logo6container.appendChild(logo6b);
                                logo6container.appendChild(logo6c);
                                logo6container.appendChild(logo6d);
                                logo6container.appendChild(logo6e);
                                logo6container.appendChild(logo6f);
                                logo6container.appendChild(day6);
                                logoContainer6.appendChild(logo6container);

                            } else if(Math.floor(infographics[j]/10) == 7){
                                var logoContainer7 = document.getElementById("logoContainer");
                                var logo7container = document.createElement("div");
                                var logo7a = document.createElement("img");
                                var logo7b = document.createElement("img");
                                var logo7c = document.createElement("img");
                                var logo7d = document.createElement("img");
                                var logo7e = document.createElement("img");
                                var logo7f = document.createElement("img");
                                var logo7g = document.createElement("img");
                                var day7 = document.createElement("h2");
                                day7.style.float = "left";
                                day7.innerHTML = j + 1;
                                logo7a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7a.style.width = "130px";
                                logo7a.style.width = "130px";
                                logo7b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7b.style.width = "130px";
                                logo7b.style.width = "130px";
                                logo7c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7c.style.width = "130px";
                                logo7c.style.width = "130px";
                                logo7d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7d.style.width = "130px";
                                logo7d.style.width = "130px";
                                logo7e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7e.style.width = "130px";
                                logo7e.style.width = "130px";
                                logo7f.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7f.style.width = "130px";
                                logo7f.style.width = "130px";
                                logo7g.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo7g.style.width = "130px";
                                logo7g.style.width = "130px";
                                logo7container.appendChild(logo7a);
                                logo7container.appendChild(logo7b);
                                logo7container.appendChild(logo7c);
                                logo7container.appendChild(logo7d);
                                logo7container.appendChild(logo7e);
                                logo7container.appendChild(logo7f);
                                logo7container.appendChild(logo7g);
                                logo7container.appendChild(day7);
                                logoContainer7.appendChild(logo7container);
                                
                            } else if(Math.floor(infographics[j]/10) == 8){
                                var logoContainer8 = document.getElementById("logoContainer");
                                var logo8container = document.createElement("div");
                                var logo8a = document.createElement("img");
                                var logo8b = document.createElement("img");
                                var logo8c = document.createElement("img");
                                var logo8d = document.createElement("img");
                                var logo8e = document.createElement("img");
                                var logo8f = document.createElement("img");
                                var logo8g = document.createElement("img");
                                var logo8h = document.createElement("img");
                                var day8 = document.createElement("h2");
                                day8.style.float = "left";
                                day8.innerHTML = j + 1;
                                logo8a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8a.style.width = "130px";
                                logo8a.style.width = "130px";
                                logo8b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8b.style.width = "130px";
                                logo8b.style.width = "130px";
                                logo8c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8c.style.width = "130px";
                                logo8c.style.width = "130px";
                                logo8d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8d.style.width = "130px";
                                logo8d.style.width = "130px";
                                logo8e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8e.style.width = "130px";
                                logo8e.style.width = "130px";
                                logo8f.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8f.style.width = "130px";
                                logo8f.style.width = "130px";
                                logo8g.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8g.style.width = "130px";
                                logo8g.style.width = "130px";
                                logo8h.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo8h.style.width = "130px";
                                logo8h.style.width = "130px";
                                logo8container.appendChild(logo8a);
                                logo8container.appendChild(logo8b);
                                logo8container.appendChild(logo8c);
                                logo8container.appendChild(logo8d);
                                logo8container.appendChild(logo8e);
                                logo8container.appendChild(logo8f);
                                logo8container.appendChild(logo8g);
                                logo8container.appendChild(logo8h);
                                logo8container.appendChild(day8);
                                logoContainer8.appendChild(logo8container);

                            } else if(Math.floor(infographics[j]/10) == 9){
                                var logoContainer9 = document.getElementById("logoContainer");
                                var logo9container = document.createElement("div");
                                var logo9a = document.createElement("img");
                                var logo9b = document.createElement("img");
                                var logo9c = document.createElement("img");
                                var logo9d = document.createElement("img");
                                var logo9e = document.createElement("img");
                                var logo9f = document.createElement("img");
                                var logo9g = document.createElement("img");
                                var logo9h = document.createElement("img");
                                var logo9i = document.createElement("img");
                                var day9 = document.createElement("h2");
                                day9.style.float = "left";
                                day9.innerHTML = j + 1;
                                logo9a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9a.style.width = "130px";
                                logo9a.style.width = "130px";
                                logo9b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9b.style.width = "130px";
                                logo9b.style.width = "130px";
                                logo9c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9c.style.width = "130px";
                                logo9c.style.width = "130px";
                                logo9d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9d.style.width = "130px";
                                logo9d.style.width = "130px";
                                logo9e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9e.style.width = "130px";
                                logo9e.style.width = "130px";
                                logo9f.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9f.style.width = "130px";
                                logo9f.style.width = "130px";
                                logo9g.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9g.style.width = "130px";
                                logo9g.style.width = "130px";
                                logo9h.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9h.style.width = "130px";
                                logo9h.style.width = "130px";
                                logo9i.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo9i.style.width = "130px";
                                logo9i.style.width = "130px";
                                logo9container.appendChild(logo9a);
                                logo9container.appendChild(logo9b);
                                logo9container.appendChild(logo9c);
                                logo9container.appendChild(logo9d);
                                logo9container.appendChild(logo9e);
                                logo9container.appendChild(logo9f);
                                logo9container.appendChild(logo9g);
                                logo9container.appendChild(logo9h);
                                logo9container.appendChild(logo9i);
                                logo9container.appendChild(day9);
                                logoContainer9.appendChild(logo9container);
                            
                            } else if(Math.floor(infographics[j]/10) == 10){
                                var logoContainer10 = document.getElementById("logoContainer");
                                var logo10container = document.createElement("div");
                                var logo10a = document.createElement("img");
                                var logo10b = document.createElement("img");
                                var logo10c = document.createElement("img");
                                var logo10d = document.createElement("img");
                                var logo10e = document.createElement("img");
                                var logo10f = document.createElement("img");
                                var logo10g = document.createElement("img");
                                var logo10h = document.createElement("img");
                                var logo10i = document.createElement("img");
                                var logo10j = document.createElement("img");
                                var day10 = document.createElement("h2");
                                day10.style.float = "left";
                                day10.innerHTML = j + 1;
                                logo10a.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10a.style.width = "130px";
                                logo10a.style.width = "130px";
                                logo10b.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10b.style.width = "130px";
                                logo10b.style.width = "130px";
                                logo10c.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10c.style.width = "130px";
                                logo10c.style.width = "130px";
                                logo10d.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10d.style.width = "130px";
                                logo10d.style.width = "130px";
                                logo10e.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10e.style.width = "130px";
                                logo10e.style.width = "130px";
                                logo10f.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10f.style.width = "130px";
                                logo10f.style.width = "130px";
                                logo10g.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10g.style.width = "130px";
                                logo10g.style.width = "130px";
                                logo10h.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10h.style.width = "130px";
                                logo10h.style.width = "130px";
                                logo10i.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10i.style.width = "130px";
                                logo10i.style.width = "130px";
                                logo10j.src = "https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg";
                                logo10j.style.width = "130px";
                                logo10j.style.width = "130px";
                                logo10container.appendChild(logo10a);
                                logo10container.appendChild(logo10b);
                                logo10container.appendChild(logo10c);
                                logo10container.appendChild(logo10d);
                                logo10container.appendChild(logo10e);
                                logo10container.appendChild(logo10f);
                                logo10container.appendChild(logo10g);
                                logo10container.appendChild(logo10h);
                                logo10container.appendChild(logo10i);
                                logo10container.appendChild(logo10j);
                                logo10container.appendChild(day10);
                                logoContainer10.appendChild(logo10container);
                            }
                        }
                    };
                })
    .catch(error => 
            console.log('ERROR')
        )





}
