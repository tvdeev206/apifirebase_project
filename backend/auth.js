import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EMAIL LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// SIGNUP
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// GOOGLE LOGIN
window.googleLogin = async function () {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    alert("Google login successful");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};