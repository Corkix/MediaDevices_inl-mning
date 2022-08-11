const cameraButton = window.document.querySelector("#start-camera");
const videoElem = window.document.querySelector("#camera");

const takePictureButton = window.document.querySelector("#take-picture");
const canvas = window.document.querySelector("#picture");

const pictureTaken = window.document.querySelector("picture-taken-container");

const galleryCont = window.document.querySelector("#gallery-contaier");
const galleryElem = window.document.querySelector("#gallery");

const photoBooth = window.document.querySelector("#photo-booth");
const returnButton = window.document.querySelector("#returnTo-Gallery");

const toastContainer = window.document.getElementById("toast-container");

const ctx = canvas.getContext("2d");
let stream;
const images = JSON.parse(localStorage.getItem("cameraApp")) ?? [];

function addToast(text) {
  const toast = `
    <div class="toast">${text}</div>
  `;
  toastContainer.innerHTML = toast;

  setTimeout(() => {
    toastContainer.innerHTML = null;
  }, 3000);
}

cameraButton.addEventListener("click", async () => {
  photoBooth.style.display = "flex";
  returnButton.style.display = "flex";
  cameraButton.style.display = "none";
  galleryCont.style.display = "none";

  if ("mediaDevices" in navigator) {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    console.log(stream);
    videoElem.srcObject = stream;
  }
});

returnButton.addEventListener("click", () => {
  returnButton.style.display = "none";
  photoBooth.style.display = "none";
  cameraButton.style.display = "flex";
  galleryCont.style.display = "flex";
});

takePictureButton.addEventListener("click", () => {
  ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png"); // Konverterar det till en png-bild

  const image = {
    id: Date.now(),
    image: imageData,
  };
  images.push(image);
  console.log(addToast);

  localStorage.setItem("cameraApp", JSON.stringify(images));

  addToast("Bilden har sparats");
  createImage(image);
});

function createImage(image) {
  const imageElem = window.document.createElement("img");
  imageElem.setAttribute("src", image.image);

  const imageWrapper = window.document.createElement("div");
  const imageDelete = window.document.createElement("button");
  imageDelete.innerHTML = "X";
  imageWrapper.setAttribute("id", image.id);

  imageDelete.addEventListener("click", () => {
    deleteImage(image);
  });

  imageWrapper.append(imageDelete);
  imageWrapper.append(imageElem);
  galleryElem.append(imageWrapper);
}

function deleteImage(image) {
  for (let index = 0; index < images.length; index++) {
    if (images[index].id == image.id) {
      images.splice([index], 1);
    }
  }
  window.document.getElementById(image.id).remove();
  localStorage.setItem("cameraApp", JSON.stringify(images));
}

function getImages() {
  const images = JSON.parse(localStorage.getItem("cameraApp")) ?? [];

  for (const image of images) {
    createImage(image);
  }
}

getImages();

window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "service-worker.js"
      );
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (err) {
      console.error("Whooopsie!", err);
    }
  }
});
