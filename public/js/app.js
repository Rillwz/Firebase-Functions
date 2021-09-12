const requestModal = document.querySelector(".new-request");
const requestLink = document.querySelector(".add-request");

// open request modal based on querySelector
requestLink.addEventListener("click", () => {
  requestModal.classList.add("open");
});

// close request modal based on target { classList }
requestModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("new-request")) {
    requestModal.classList.remove("open");
  }
});
