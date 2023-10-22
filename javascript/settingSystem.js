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
    const lettersOnlyRegex = /^[a-zA-Z\s]+$/;
    const numbersOnlyRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
  
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
    fetch("../JSON/personalDetails.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {

  

      });

  
    // var updatePhotoForm = document.querySelector("#updatePhotoForm"),
    //   updatePhoto = document.querySelector("#updatePhoto");
  
    // updatePhoto.addEventListener("click", (e) => {
    //   fileInput = document.querySelector("#fileInput").value;
    //   console.log(fileInput);
    //   if (fileInput != "") {
    //     Swal.fire({
    //       title: "Update avatar?",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#73E977",
    //       cancelButtonColor: "#fa6363",
    //       confirmButtonText: "Confirm",
    //     }).then(() => {
    //       Swal.fire({
    //         icon: "success",
    //         title: "Avatar changed",
    //         showConfirmButton: false,
    //         timer: 2000,
    //       }).then(() => {
    //         updatePhotoForm.submit();
    //       });
    //     });
    //   }
    // });
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
  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  function previewFile(file) {
    var reader = new FileReader();
  
    reader.onload = function (e) {
      var previewImage = document.getElementById("preview");
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

  