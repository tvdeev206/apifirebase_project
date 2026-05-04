import { db, auth } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("notes.js loaded");

// SAVE NOTE
window.saveNote = async function () {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const button = document.getElementById("saveBtn");

  // save original state once
  const originalText = "Save Note";
  const originalClass = "bg-brand-orange";

  try {
    // 🔵 LOADING STATE
    button.disabled = true;
    button.innerText = "Saving...";
    button.classList.remove("bg-green-500", "bg-red-500");
    button.classList.add("opacity-70");

    await addDoc(collection(db, "notes"), {
      uid: user.uid,
      title: title || "Untitled",
      content: content || "",
      createdAt: new Date()
    });

    // 🟢 SUCCESS STATE
    button.innerText = "Saved ✓";
    button.classList.remove("opacity-70", "bg-brand-orange");
    button.classList.add("bg-green-500");

    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove("bg-green-500");
      button.classList.add("bg-brand-orange");
      button.disabled = false;
    }, 1500);

  } catch (err) {
    console.error(err);

    // 🔴 ERROR STATE
    button.innerText = "Error";
    button.classList.remove("opacity-70", "bg-brand-orange");
    button.classList.add("bg-red-500");

    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove("bg-red-500");
      button.classList.add("bg-brand-orange");
      button.disabled = false;
    }, 1500);
  }
};

// LOAD NOTES
window.loadNotes = async function () {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, "notes"), where("uid", "==", user.uid));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
};

const textarea = document.getElementById("noteContent");

// detect slash command
textarea.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const value = textarea.value;

    const commandIndex = value.lastIndexOf("/ReNO");

    // if no command → normal enter
    if (commandIndex === -1) return;

    e.preventDefault();

    const commandText = value.substring(commandIndex).replace("/ReNO", "").trim();

    if (!commandText) return;

    textarea.value += "\n\n⏳ Thinking...\n";

    const res = await fetch("http://127.0.0.1:8000/reno", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: commandText
      })
    });

    const data = await res.json();

    // remove loading text + insert AI response
    textarea.value = textarea.value.replace("Thinking...", "");

    textarea.value += `\nReNO:\n${data.result}\n`;
  }
});

async function runReNO(command) {
  const res = await fetch("http://127.0.0.1:8000/reno", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: command })
  });

  const data = await res.json();
  return data.result;
}