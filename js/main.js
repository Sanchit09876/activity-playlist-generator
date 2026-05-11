document.addEventListener("DOMContentLoaded", () => {
  const activityInput = document.getElementById("activityInput");
  const result = document.getElementById("result");
  const randomBtn = document.getElementById("randomBtn");

  randomBtn.addEventListener("click", async () => {
    randomBtn.setAttribute("disabled", "true");

    result.innerHTML = "<p>Generating Random Activity...</p>";

    try {
      // fetch a random activity from our PHP backend (api proxy)
      const response = await fetch("php/ajax/random_activity.php");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // parse the JSON response from the PHP backend code
      const data = await response.json();

      // if the response contains an 'activity' field, put it into the input field
      if (data.activity) {
        activityInput.value = `${data.activity}`;

        result.innerHTML = "<p>Activity Generated</p>";

        setTimeout(() => {
          result.innerHTML = "";
        }, 1000);

        randomBtn.removeAttribute("disabled");
      } else if (data.error) {
        result.innerHTML = `<p>${data.error}</p>`;

        randomBtn.removeAttribute("disabled");
      } else {
        result.innerHTML = "<p>No activity received!</p>";

        randomBtn.removeAttribute("disabled");
      }
    } catch (error) {
      result.innerHTML = "<p>Error Occured when generating activity!</p>";

      randomBtn.removeAttribute("disabled");
    }
  });

  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", async () => {
    const activity = activityInput.value.trim();
    if (!activity) return;

    try {
      const response = await fetch("php/ajax/generate_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "activity=" + encodeURIComponent(activity),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.playlist && Array.isArray(data.playlist)) {
        result.innerHTML = data.playlist
          .map((song) => `<p>${song.title} — ${song.artist}</p>`)
          .join("");
      } else if (data.error) {
        result.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        result.innerHTML = "<p>No playlist generated</p>";
      }
    } catch (error) {
      console.error(error);
      result.innerHTML = "<p>❌ Network error or server problem.</p>";
    }
  });
});
