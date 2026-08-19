// client/src/api/notes.js
//
// Thin API helper for note generation.
// Flow: TopicForm -> generateNoteApi() -> Vite proxy (/api) -> Express route
//       -> generateNotes controller -> Groq / MongoDB -> JSON response.
//
// Expected success response body:
//   {
//     "data": "AI generated notes text...",
//     "noteId": "68xxxxxxxx"
//   }

/**
 * POST /api/notes/generate-notes with a JSON payload and optional auth token.
 *
 * @param {object} payload - { topic, classLevel, examType, revisionMode, includeDiagram, includeChart }
 * @param {string|null} token - JWT (from localStorage) sent as `Authorization: Bearer <token>`
 * @returns {Promise<object>} The parsed JSON body: { data, noteId }
 * @throws {Error} With a human-readable message when the request/backend fails.
 */
export async function generateNoteApi(payload, token) {
  try {
    // Relative URL -> automatically proxied by Vite to http://localhost:8000.
    // Same-origin request, so any auth cookie set by the backend also flows through.
    const res = await fetch("/api/notes/generate-notes", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        // Only attach the Authorization header when a token actually exists.
        // Backend middleware (isAuth) primarily reads the cookie, but this
        // keeps the header-based flow working too.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },

      body: JSON.stringify(payload),
    });

    // Parse the JSON body. If the server returned an empty / non-JSON body
    // (e.g. a 500 with HTML), `responseData` becomes `null` instead of crashing.
    const responseData = await res.json().catch(() => null);

    // --- Explicit HTTP status check ---
    // `fetch` does NOT throw on 4xx/5xx, so we must inspect `res.ok` ourselves.
    if (!res.ok) {
      // Print the raw backend error body to the F12 Console for easy debugging.
      console.error("Backend Error:", responseData);

      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${res.status}`
      );
    }

    // Success -> hand the parsed body straight back to the caller.
    // Caller reads `result.data`, `result.noteId`.
    return responseData;
  } catch (error) {
    // Catches network failures AND the re-thrown backend-error above.
    // Logging here gives a clear trail in the F12 Console.
    console.error("generateNoteApi Error:", error);
    throw error; // Re-throw so TopicForm can show the message to the user.
  }
}

/**
 * GET /api/notes/history with optional auth token.
 *
 * @param {string|null} token - JWT (from localStorage) sent as `Authorization: Bearer <token>`
 * @returns {Promise<object>} The parsed JSON body: { success, notes }
 * @throws {Error} With a human-readable message when the request/backend fails.
 */
export async function getHistoryApi(token) {
  try {
    const res = await fetch("/api/notes/history", {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Backend Error:", responseData);
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("getHistoryApi Error:", error);
    throw error;
  }
}

/**
 * DELETE /api/notes/history/:id with optional auth token.
 *
 * @param {string} id - The _id of the note to delete.
 * @param {string|null} token - JWT (from localStorage) sent as `Authorization: Bearer <token>`
 * @returns {Promise<object>} The parsed JSON body: { success, message }
 * @throws {Error} With a human-readable message when the request/backend fails.
 */
export async function deleteHistoryApi(id, token) {
  try {
    const res = await fetch(`/api/notes/history/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Backend Error:", responseData);
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("deleteHistoryApi Error:", error);
    throw error;
  }
}

/**
 * PUT /api/notes/history/:id with optional auth token.
 *
 * @param {string} id - The _id of the note to update.
 * @param {object} payload - { title?, content? }
 * @param {string|null} token - JWT (from localStorage) sent as `Authorization: Bearer <token>`
 * @returns {Promise<object>} The parsed JSON body: { success, note }
 * @throws {Error} With a human-readable message when the request/backend fails.
 */
export async function updateHistoryApi(id, payload, token) {
  try {
    const res = await fetch(`/api/notes/history/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Backend Error:", responseData);
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Request failed with status ${res.status}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("updateHistoryApi Error:", error);
    throw error;
  }
}