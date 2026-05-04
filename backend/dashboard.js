import { firebaseConfig } from "./config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadNotes() {
  const container = document.getElementById("notesContainer");

  container.innerHTML = `
    <p class="text-gray-400">Loading notes...</p>
  `;

  try {
    const querySnapshot = await getDocs(collection(db, "notes"));

    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 class="text-xl font-semibold mb-2">No notes yet</h3>
          <p class="text-gray-500">Create your first note.</p>
        </div>
      `;
      return;
    }

    querySnapshot.forEach((doc) => {
      const note = doc.data();

      const card = document.createElement("div");

      card.className =
        "bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition";

      card.innerHTML = `
        <h3 class="text-2xl font-semibold mb-3">
          ${note.title || "Untitled"}
        </h3>

        <p class="text-gray-600 line-clamp-5">
          ${note.content || ""}
        </p>

        <div class="mt-5 text-sm text-brand-orange font-medium">
          Saved note
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    container.innerHTML = `
      <p class="text-red-500">${error.message}</p>
    `;
  }
}

loadNotes();