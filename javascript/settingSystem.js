function onload() {
  listeners();
  fetchNotification();
  fetchData();
}
const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
const numbersOnlyRegex = /^[0-9]+$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
facebookPattern =
  /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[^/?&]+)$/i;
let clinicDataArray = [];
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
}
async function fetchData() {
  try {
    const response = await fetch("../JSON/systemSettings.json");
    const data = await response.json();
    const clinicInfo = data.clinicInfo;
    const location = clinicInfo.location;

    clinicDataArray = [];

    var clinicImage = document.querySelector("#locationBgClinic"),
      locationBgClinicInput = document.querySelector("#locationBgClinicInput"),
      clinicLogo = document.querySelector("#logoClinic"),
      logoClinicInput = document.querySelector("#logoClinicInput"),
      clinicName = document.querySelector("#clinicName"),
      clinicEmail = document.querySelector("#email"),
      clinicNumber = document.querySelector("#contactNumber"),
      clinicFacebook = document.querySelector("#facebookLink"),
      clinicProvince = document.querySelector("#provinceInput"),
      clinicCity = document.querySelector("#cityInput"),
      clinicBarangay = document.querySelector("#barangayInput"),
      clinicDescription = document.querySelector("#clinicDescription");

    clinicImage.src = "../images/" + clinicInfo.image;
    clinicLogo.src = "../images/" + clinicInfo.logo;

    // locationBgClinicInput.value = clinicInfo.image;
    // logoClinicInput.value = clinicInfo.logo;
    clinicName.value = clinicInfo.clinicName;
    clinicEmail.value = clinicInfo.email;
    clinicNumber.value = clinicInfo.contactNumber;
    clinicFacebook.value = clinicInfo.facebookLink;
    clinicProvince.value = location.province;
    clinicCity.value = location.city;
    clinicBarangay.value = location.barangay;
    clinicDescription.value = clinicInfo.description;

    clinicDataArray.push({
      image: clinicInfo.image,
      logo: clinicInfo.logo,
      clinicName: clinicInfo.clinicName,
      email: clinicInfo.email,
      contactNumber: clinicInfo.contactNumber,
      facebookLink: clinicInfo.facebookLink,
      province: location.province,
      city: location.city,
      barangay: location.barangay,
      description: clinicInfo.description,
    });
    console.log(clinicDataArray);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile(file);
  } else {
    Swal.fire({
      text: "Drop a JPEG, JPG, or PNG file under 5MB.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}
function handleDrop1(event) {
  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[0];
  if (validateFileType(file) && validateFileSize(file)) {
    previewFile1(file);
  } else {
    Swal.fire({
      text: "Drop a JPEG, JPG, or PNG file under 5MB.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}
function previewImage(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      previewFile(file);
    } else {
      Swal.fire({
        text: "Please select a JPEG, JPG, or PNG file under 5MB.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      fileInput.value = "";
    }
  }
}
function previewImage1(event) {
  var fileInput = event.target;
  var file = fileInput.files[0];

  if (file) {
    if (validateFileType(file) && validateFileSize(file)) {
      previewFile1(file);
    } else {
      Swal.fire({
        text: "Please select a JPEG, JPG, or PNG file under 5MB.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      fileInput.value = "";
    }
  }
}
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
}
function previewFile(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("locationBgClinic");
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
function previewFile1(file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var previewImage = document.getElementById("logoClinic");
    previewImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
function validateFileType(file) {
  var allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
  return allowedExtensions.exec(file.name);
}
function validateFileSize(file) {
  var maxSizeInBytes = 5 * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}
function showError(input, message) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage");
  errorMes.innerText = message;
  input.style.borderColor = "var(--red)";
  input.classList.add("shake");
  setTimeout(() => {
    input.classList.remove("shake");
  }, 500);
}
function removeError(input) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage");
  errorMes.innerText = "";
  input.style.borderColor = "";
}
function removeErrorMessage(input) {
  parentElem = input.parentElement;
  errorMes = parentElem.querySelector(".errorMessage");
  errorMes.innerText = "";
  input.style.borderColor = "";
}
function formatDate(dateString) {
  const inputDate = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = inputDate.toLocaleDateString(undefined, options);
  return formattedDate;
}
function hasNumberAndLetter(passwordValue) {
  var hasNumber = false;
  var hasLetter = false;

  for (var i = 0; i < passwordValue.length; i++) {
    var char = passwordValue[i];

    if (!hasNumber && !isNaN(char)) {
      hasNumber = true;
    }

    if (!hasLetter && char.match(/[a-zA-Z]/)) {
      hasLetter = true;
    }
  }

  return hasNumber && hasLetter;
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
function showValue(selectElement, input) {
  var selectedText = selectElement.options[selectElement.selectedIndex].text;
  input.value = selectedText;
}
function validateSystemSettings() {
  var locationBgClinicInput = document.querySelector("#locationBgClinicInput"),
    logoClinicInput = document.querySelector("#logoClinicInput"),
    clinicName = document.querySelector("#clinicName"),
    clinicEmail = document.querySelector("#email"),
    clinicNumber = document.querySelector("#contactNumber"),
    clinicFacebook = document.querySelector("#facebookLink"),
    clinicProvince = document.querySelector("#provinceInput"),
    clinicCity = document.querySelector("#cityInput"),
    clinicBarangay = document.querySelector("#barangayInput"),
    clinicDescription = document.querySelector("#clinicDescription");
  isValid = false;

  var clinicNameValue = clinicName.value.trim(),
    clinicEmailValue = clinicEmail.value.trim(),
    clinicNumberValue = clinicNumber.value.trim(),
    clinicFacebookValue = clinicFacebook.value.trim(),
    clinicDescriptionValue = clinicDescription.value.trim();

  if (
    clinicNameValue !== clinicDataArray.clinicName ||
    clinicEmailValue !== clinicDataArray.email ||
    clinicNumberValue !== clinicDataArray.contactNumber ||
    clinicFacebookValue !== clinicDataArray.facebookLink ||
    clinicDescriptionValue !== clinicDataArray.description ||
    clinicProvince.value !== clinicDataArray.province ||
    clinicCity.value !== clinicDataArray.city ||
    clinicBarangay.value !== clinicDataArray.barangay ||
    locationBgClinicInput.files.length > 0 ||
    logoClinicInput.files.length > 0
  ) {

    if(clinicNameValue === ""){
      showError(clinicName, "Field required")
      isValid = false;
    }
    else{
      removeError(clinicName)
      isValid = true;
    }
    if(clinicEmailValue === ""){
      showError(clinicEmail, "Field required")
      isValid = false;
    }
    else if(!emailRegex.test(clinicEmailValue)){
      showError(clinicEmail, "InvalidFormat")
      isValid = false;
    }
    else{
      removeError(clinicEmail)
      isValid = true;
    }
    if(clinicNumberValue === ""){
      showError(clinicNumber, "Field required")
      isValid = false;
    }
    else if(!numbersOnlyRegex.test(clinicNumberValue)){
      showError(clinicNumber, "InvalidFormat")
      isValid = false;
    }
    else if(clinicNumberValue.length < 9){
      showError(clinicNumber, "InvalidFormat")
      isValid = false;
    }
    else{
      removeError(clinicNumber)
      isValid = true;
    }
    if(clinicFacebookValue === ""){
      removeError(clinicFacebook)
      isValid = true;
    }
    else if(!facebookPattern.test(clinicFacebookValue)){
      showError(clinicFacebook, "InvalidFormat")
      isValid = false;
    }
    else{
      removeError(clinicFacebook)
      isValid = true;
    }
    if(clinicDescriptionValue === ""){
      showError(clinicDescription,"Field required")
      isValid = false;
    }
    else{
      removeError(clinicDescription)
      isValid = true;
    }
    if (isValid) {
      settingsForm.addEventListener("settingsForm", function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        console.log(formDataObject);
      });
      Swal.fire({
        title: "Confirm changes? ",
        text: "You won't be able to revert this.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#73E977",
        cancelButtonColor: "#fa6363",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            text: "Changes saved",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            settingsForm.submit();
          });
        }
      });
    }

  }



}
