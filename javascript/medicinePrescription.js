function onload() {
  listeners();
  fetchNotification();
}

function listeners() {
  const links = document.querySelectorAll(".links");
  links.forEach((link) => {
    const tooltipText = link.getAttribute("data-tooltip");

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = tooltipText;

    link.appendChild(tooltip);
  });
  var profileExpand = document.querySelector("#profileExpand");
  var logoutHolder = document.querySelector("#logoutHolder");
  var logoutHolderOptions = document.querySelectorAll(".logoutHolder span");
  profileExpand.addEventListener("click", () => {
    logoutHolder.classList.toggle("hidden");
    logoutHolderOptions.forEach((action) => {
      action.addEventListener("click", () => {
        logoutHolder.classList.add("hidden");
      });
    });
  });
  //search on everytype
  search.addEventListener("input", function () {
    //your code
    console.log(this.value);
  });

  // loader
  const containerBody = document.querySelector("#containerBody");

  const templateMedicineType = document.querySelector("#templateMedicineType");
  const nodatafound = document.querySelector("#no-data-found");
  const medsInfo = document.querySelector("#medsInfo");

  for (let i = 0; i < 20; i++) {
    const clone = document.importNode(templateMedicineType.content, true);
    containerBody.appendChild(clone);
  }
  fetch("../JSON/prescription.json")
    .then((response) => response.json())
    .then((data) => {
      updateDisplay("", data);
      var search = document.querySelector("#search");
      search.addEventListener("input", function () {
        updateDisplay(this.value, data);
      });
    });
  function filterData(data, searchTerm) {
    searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
    const filteredData = [];
    for (const patientInfo of data.patients) {
      const patientNameLower = patientInfo.patientName.toLowerCase();
      const doctorNameLower = patientInfo.issuedBy.toLowerCase();
      const dateIssuedLower = patientInfo.dateIssued.toLowerCase();

      if (
        patientNameLower.includes(searchTerm) ||
        doctorNameLower.includes(searchTerm) ||
        dateIssuedLower.includes(searchTerm)
      ) {
        const filteredPatient = { ...patientInfo };
        const filteredMedicines = [];

        for (const medicineKey in patientInfo.medicinesPrescribed) {
          if (patientInfo.medicinesPrescribed.hasOwnProperty(medicineKey)) {
            const medicine = patientInfo.medicinesPrescribed[medicineKey];
            filteredMedicines.push(medicine);
          }
        }
        filteredPatient.medicinesPrescribed = filteredMedicines;
        filteredData.push(filteredPatient);
      }
    }
    return filteredData;
  }

  function updateDisplay(searchTerm, data) {
    const containerBody = document.querySelector("#containerBody");
    containerBody.innerHTML = "";
    const filteredData = filterData(data, searchTerm);
    if (Object.keys(filteredData).length === 0) {
      const clone = document.importNode(nodatafound.content, true);
      containerBody.appendChild(clone);
    }
    for (const [i, patient] of filteredData.entries()) {
      const clonemedicineTypeTemplate = document.importNode(
        medsInfo.content,
        true
      );

      clonemedicineTypeTemplate.querySelector(
        "#patientNamePrescribe"
      ).innerHTML = highlightText(patient.patientName, searchTerm);
      clonemedicineTypeTemplate.querySelector(
        "#patientNamePrescribeOriginal"
      ).textContent = patient.patientName;
      truncateText(
        clonemedicineTypeTemplate.querySelector("#patientNamePrescribe"),
        22
      );
      clonemedicineTypeTemplate.querySelector("#issuedBy").innerHTML =
        highlightText(patient.issuedBy, searchTerm);
      clonemedicineTypeTemplate.querySelector("#issuedByOriginal").textContent =
        patient.issuedBy;
      truncateText(clonemedicineTypeTemplate.querySelector("#issuedBy"), 15);
      clonemedicineTypeTemplate.querySelector("#medicineBrand").innerHTML =
        highlightText(patient.dateIssued, searchTerm);
      clonemedicineTypeTemplate.querySelector("#patientAge").textContent =
        patient.age;
      clonemedicineTypeTemplate.querySelector("#patientAddress").textContent =
        patient.address;
      clonemedicineTypeTemplate.querySelector("#clinicName").textContent =
        patient.clinicName;
      clonemedicineTypeTemplate.querySelector("#clinicLogo").textContent =
        patient.clinicLogo;

      let patientMedications = "";

      for (const medicineKey in patient.medicinesPrescribed) {
        if (patient.medicinesPrescribed.hasOwnProperty(medicineKey)) {
          const medicine = patient.medicinesPrescribed[medicineKey];
          const medicationDetails = `${medicine.medicineName} ${medicine.medicineBrand} ${medicine.medicineDosage} ${medicine.medicineDosageType} (${medicine.medicineType}) - ${medicine.medicineTotal} pcs.`;
          patientMedications += medicationDetails + "<br>";
        }
      }

      clonemedicineTypeTemplate.querySelector("#medicineinfos").innerHTML =
        highlightText(patientMedications, searchTerm);
      clonemedicineTypeTemplate.querySelector(
        "#medicineinfosOriginal"
      ).innerHTML = patientMedications;
      truncateText(
        clonemedicineTypeTemplate.querySelector("#medicineinfos"),
        30
      );
      containerBody.appendChild(clonemedicineTypeTemplate);
    }
    const prescribeMedicine = document.querySelectorAll(".prescribeMedicine");
    const bg = document.querySelector("#bg");
    const printPage = document.querySelector("#printPage");
    prescribeMedicine.forEach((meds) => {
      meds.addEventListener("click", function () {
        bg.classList.remove("hidden");

        var patientName = this.closest(".medicineInformations").querySelector(
          "#patientNamePrescribeOriginal"
        ).textContent;
        var dentistName = this.closest(".medicineInformations").querySelector(
          "#issuedByOriginal"
        ).textContent;
        var issuedDate = this.closest(".medicineInformations").querySelector(
          "#medicineBrand"
        ).textContent;
        medicineinfosOriginal;
        var medicinesPrescribed = this.closest(
          ".medicineInformations"
        ).querySelector("#medicineinfosOriginal").innerHTML;
        var age = this.closest(".medicineInformations").querySelector(
          "#patientAge"
        ).textContent;
        var address = this.closest(".medicineInformations").querySelector(
          "#patientAddress"
        ).textContent;
        var clinicName = this.closest(".medicineInformations").querySelector(
          "#clinicName"
        ).textContent;
        var clinicLogo = this.closest(".medicineInformations").querySelector(
          "#clinicLogo"
        ).textContent;

        printPage.querySelector("#dentistName").textContent = dentistName;
        printPage.querySelector("#patientName").textContent = patientName;
        printPage.querySelector("#datePrescribed").textContent = issuedDate;
        printPage.querySelector(".medicinesPrescribedInfo").innerHTML =
          medicinesPrescribed;
        printPage.querySelector("#patientAge").textContent = age;
        printPage.querySelector("#patientAddress").textContent = address;
        printPage.querySelector("#clinicNamePreview").textContent = clinicName;
        printPage.querySelector("#clinicLogoPreview").src =
          "../images/" + clinicLogo;
      });

      var cancelPrintButton = bg.querySelector("#cancelPrint");
      cancelPrintButton.addEventListener("click", function () {
        bg.classList.add("hidden");
      });
      var printButton = bg.querySelector("#printButton");
      printButton.addEventListener("click", function () {
        window.print();
      });
    });
  }
}
function highlightText(text, searchTerm) {
  if (!searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
function truncateText(element, limit) {
  var text = element.textContent;
  if (text.length > limit) {
    var truncated = text.substring(0, limit) + "...";
    element.textContent = truncated;
  }
}
function viewNotification(event) {
  var url = event.currentTarget.querySelector("#urlRedirect").textContent;
  window.location.href = "../Admin" + url;
}

async function fetchNotification() {
  const container = document.querySelector("#allNotification");
  const loader = document.querySelector("#notificationLoader");
  const mainContainer = document.querySelector("#notificationMainTemplate");
  const nodatafound = document.querySelector("#no-notifications");
  try {
    for (let i = 0; i < 5; i++) {
      const clone = document.importNode(loader.content, true);
      container.appendChild(clone);
    }
    const response = await fetch("../JSON/notification.json");
    const data = await response.json();
    console.log(data);

    function filterData(data, searchTerm) {
      searchTerm = searchTerm ? searchTerm.toLowerCase() : "";
      const filteredData = [];

      for (const notifs of data.notification) {
        const title = notifs.title.toLowerCase();
        const text = notifs.text.toLowerCase();
        if (title.includes(searchTerm) || text.includes(searchTerm)) {
          filteredData.push(notifs);
        }
      }

      return filteredData;
    }
    function updateDisplay(searchTerm) {
      const filteredData = filterData(data, searchTerm);
      container.innerHTML = "";

      if (filteredData.length === 0) {
        const clone = document.importNode(nodatafound.content, true);
        container.appendChild(clone);
      } else {
        let hasUnreadNotifications = false;
        filteredData.sort((a, b) => {
          if (a.status === b.status) {
            return 0;
          }
          return a.status ? 1 : -1;
        });
        filteredData.forEach((item) => {
          const clone = document.importNode(mainContainer.content, true);

          var notificationStatus = item.status;

          if (notificationStatus === false) {
            clone.querySelector(".notif").classList.add("unread");
            const notifDot = document.createElement("div");
            notifDot.classList.add("notifDot");
            clone.querySelector(".notif").appendChild(notifDot);
            hasUnreadNotifications = true;
          }
          clone.querySelector("#imgNotif").src = "../images/" + item.image;
          clone.querySelector("#notificationTitle").innerHTML = highlightText(
            item.title,
            searchTerm
          );
          clone.querySelector("#notificationMessage").innerHTML = highlightText(
            item.text,
            searchTerm
          );
          clone.querySelector("#urlRedirect").innerHTML = item.url;
          container.appendChild(clone);
        });
        const notificationDots = document.querySelector(".notification-dot");
        if (!hasUnreadNotifications) {
          notificationDots.classList.add("hidden");
        } else {
          notificationDots.classList.remove("hidden");
        }
      }
    }
    function highlightText(text, searchTerm) {
      if (!searchTerm) {
        return `<span>${text}</span>`;
      }

      const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
      return text.replace(
        regex,
        (match) => `<p class="highlight">${match}</p>`
      );
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
    }

    updateDisplay("");
    var search = document.querySelector("#searchNotification");
    search.addEventListener("input", function () {
      updateDisplay(this.value);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
function viewNotificationContainer(event) {
  var parent = event.target.parentElement;
  var notificationContainer = parent.querySelector(".notificationContainer");
  notificationContainer.classList.toggle("hidden");
  event.target.classList.toggle("showContainer");
}
function addPrescription() {
  document.getElementById("addedMedicinePrescription").innerHTML = "";
  var prescribeMedicineForm = document.querySelector("#prescribeMedicineForm");
  prescribeMedicineForm.classList.add("showElement1");

  var cancelButton = prescribeMedicineForm.querySelector(
    "#prescribeMedicineFormCancel"
  );
  cancelButton.addEventListener("click", function () {
    prescribeMedicineForm.classList.remove("showElement1");
  });

  var prescribeMedicineFormSubmit = prescribeMedicineForm.querySelector(
    "#prescribeMedicineFormSubmit"
  );
  prescribeMedicineFormSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    var medicineDosagePrescribe = prescribeMedicineForm.querySelector(
      "#medicineDosagePrescribe"
    );
    var patientsNamePrescribe = prescribeMedicineForm.querySelector(
      "#patientsNamePrescribe"
    );

    if (patientsNamePrescribe.value.trim() === "") {
      patientsNamePrescribe.style.borderColor = "var(--red)";
      return;
    } else {
      patientsNamePrescribe.style.borderColor = "";
    }
    var clonedDivs = document.querySelectorAll(
      "#addedMedicinePrescription .inputHolder3"
    );
    var isValid = true;

    clonedDivs.forEach(function (div) {
      var inputs = div.querySelectorAll("input");
      var inputsNumber = div.querySelectorAll('input[type="number"]');

      inputs.forEach(function (input) {
        if (input.value.trim() === "") {
          input.style.borderColor = "var(--red)";
          isValid = false;
        } else {
          input.style.borderColor = "";
        }
      });

      inputsNumber.forEach(function (inputNumber) {
        if (inputNumber.value === "" || inputNumber.value <= "0") {
          inputNumber.style.borderColor = "var(--red)";
          isValid = false;
        } else {
          inputNumber.style.borderColor = "";
        }
      });
    });

    if (!isValid) {
      console.log("Please fill in all fields.");
      return;
    }

    var formData = new FormData(prescribeMedicineFormContainer);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    Swal.fire({
      title: "Confirm Prescription",
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#73E977",
      cancelButtonColor: "#fa6363",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Medicine Prescribed",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          //prescribeMedicineFormContainer.submit();
        });
      }
    });
  });
}
let cloneCount = 1;
function cloneDiv() {
  var originalDiv = document.getElementById("medicinePrescribeClone");
  var cloneDiv = originalDiv.cloneNode(true);

  cloneDiv.classList.remove("hidden");

  cloneDiv.querySelector("#addPresciption").value = "";
  cloneDiv.querySelector("#addPresciptionBrand").value = "";
  cloneDiv.querySelector("#addPresciptionCount").value = "0";
  cloneDiv.querySelector("#medicineDosagePrescribe").value = "0";
  cloneDiv.querySelector("#addPresciption").style.borderColor = "";
  cloneDiv.querySelector("#addPresciptionBrand").style.borderColor = "";
  cloneDiv.querySelector("#addPresciptionCount").style.borderColor = "";
  cloneDiv.querySelector("#medicineDosagePrescribe").style.borderColor = "";
  cloneDiv.querySelector("#dosageValuePrescribe").value = "ML";
  cloneDiv.querySelector("#dosageTypePrescribe").textContent = "ML";
  cloneCount++; // Increment clone count

  // Add the cloned div to the form
  document.getElementById("addedMedicinePrescription").appendChild(cloneDiv);
}
function removeDiv(divToRemove) {
  divToRemove.parentNode.removeChild(divToRemove);
}
function toggleDosageOptions(spanElement) {
  var dosageOptions = spanElement.parentNode.querySelector(".dosageOptions1");
  var sortCarretDosagePrescribe = spanElement.parentNode.querySelector(
    ".sortCarretDosagePrescribe"
  );

  dosageOptions.classList.toggle("showElement");

  var options = dosageOptions.querySelectorAll("span");
  options.forEach(function (element) {
    element.addEventListener("click", function () {
      var mgMl = this.textContent;
      spanElement.querySelector("#dosageTypePrescribe").textContent = mgMl;
      dosageOptions.classList.remove("showElement");
      var dosageValue = spanElement.parentNode.querySelector(
        'input[name="addDosage[]"]'
      );
      dosageValue.value = mgMl;

      var currentTransform = sortCarretDosagePrescribe.style.transform;
      if (currentTransform === "rotate(180deg)") {
        sortCarretDosagePrescribe.style.transform = "";
      } else {
        sortCarretDosagePrescribe.style.transform = "rotate(180deg)";
      }
    });
  });

  var currentTransform = sortCarretDosagePrescribe.style.transform;
  if (currentTransform === "") {
    sortCarretDosagePrescribe.style.transform = "rotate(180deg)";
  } else {
    sortCarretDosagePrescribe.style.transform = "";
  }
}
const names = [
  "John Kenneth Arellano",
  "Russel Dela Cruz",
  "Allysandra San Juan",
  "Geneses Galang",
  "Nicole Santos",
  "Franchesca Culalic",
];

const searchInput = document.querySelector("#patientsNamePrescribe");
const suggestionsContainer = document.querySelector("#searchPatientsName");
searchInput.addEventListener("input", (event) => {
  const searchInputValue = event.target.value.trim();
  if (searchInputValue === "") {
    suggestionsContainer.innerHTML = "";
    return;
  }
  const filteredNames = filterNames(searchInputValue);
  displaySuggestions(filteredNames);
});
function displaySuggestions(filteredNames) {
  suggestionsContainer.innerHTML = "";

  const searchInputValue = searchInput.value.toLowerCase();

  filteredNames.forEach((name) => {
    const suggestion = document.createElement("span");
    suggestion.className = "patientName";
    let highlightedName = "";
    let currentIndex = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name[i].toLowerCase();

      if (
        currentIndex < searchInputValue.length &&
        char === searchInputValue[currentIndex]
      ) {
        highlightedName += `<span class="highlight">${name[i]}</span>`;
        currentIndex++;
      } else {
        highlightedName += name[i];
      }
    }

    suggestion.innerHTML = highlightedName;
    suggestion.addEventListener("click", () => {
      searchInput.value = name;
      suggestionsContainer.innerHTML = "";
    });
    suggestionsContainer.appendChild(suggestion);
  });
}
function filterNames(searchInputValue) {
  const searchTerm = searchInputValue.toLowerCase();
  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchTerm)
  );

  return filteredNames;
}
function exportToExcel() {
  const rowsToExport = document.querySelectorAll(".medicineInformations");
  const data = [];

  rowsToExport.forEach((row) => {
    const nameElement = row.querySelector(
      ".patientNamePrescribe #patientNamePrescribeOriginal"
    );
    const nameValue = nameElement ? nameElement.innerText : "";

    const prescribeBy = row.querySelector("#issuedByOriginal");
    const prescribeByValue = prescribeBy ? prescribeBy.innerText : "";

    const timeTable = row.querySelector(".dateIssued #medicineBrand");
    const time = timeTable ? timeTable.innerText : "";

    const prescribeInfo = row.querySelector(
      ".prescribeInfo #medicineinfosOriginal"
    );
    const service = prescribeInfo ? prescribeInfo.innerText : "";

    data.push([nameValue, prescribeByValue, time, service]);
  });

  const ws = XLSX.utils.aoa_to_sheet(data);

  const customColumnWidths = [30, 25, 20, 40];

  ws["!cols"] = customColumnWidths.map((width) => ({ wch: width }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  const fileName = "Presciption" + getCurrentDateTime() + ".xlsx";
  XLSX.writeFile(wb, fileName);
}
function printPdf() {
  const pdf = new jsPDF("portrait");

  const rowsToExport = document.querySelectorAll(".medicineInformations");

  let data = [];

  for (const row of rowsToExport) {
    const nameElement = row.querySelector(
      ".patientNamePrescribe #patientNamePrescribeOriginal"
    );
    const nameValue = nameElement ? nameElement.innerText : "";

    const prescribeBy = row.querySelector("#issuedByOriginal");
    const prescribeByValue = prescribeBy ? prescribeBy.innerText : "";

    const timeTable = row.querySelector(".dateIssued #medicineBrand");
    const time = timeTable ? timeTable.innerText : "";

    const prescribeInfo = row.querySelector(
      ".prescribeInfo #medicineinfosOriginal"
    );
    const service = prescribeInfo ? prescribeInfo.innerText : "";

    data.push([nameValue, prescribeByValue, time, service]);
  }

  pdf.autoTable({
    head: [["Name", "Issued By", "Date Issued", "Info"]],
    body: data,
    theme: "striped",
    startY: 40,
    pageBreak: "auto",
    tableWidth: "wrap",
    headStyles: { halign: "center", valign: "middle" },
    bodyStyles: { halign: "center", valign: "middle" },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 72 },
    },
  });
  const img = new Image();
  img.src = "../images/logo.png";
  img.onload = () => {
    pdf.addImage(img, "png", 65, 2, 30, 30);

    pdf.setFontSize(20);
    pdf.setTextColor(33, 150, 243);
    pdf.text("Pablo De Jesus", 95, 16);
    pdf.setFontSize(14);
    pdf.text("Dental Clinic", 95, 24);
    pdf.setFontSize(10);
    pdf.text("Generated on " + formatDateTime(), 80, 33);
    pdf.save("Prescription" + getCurrentDateTime() + ".pdf");
  };
}
function getCurrentDateTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const currentDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return currentDateTime;
}
function formatDateTime() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const currentDateTime = `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;

  return currentDateTime;
}
