document.addEventListener("DOMContentLoaded", () => {
  const activityInput = document.getElementById("activityInput");
  const activityHolder = document.getElementById("activityHolder");
  const result = document.getElementById("result");
  const randomBtn = document.getElementById("randomBtn");

  randomBtn.addEventListener("click", async () => {
    randomBtn.setAttribute("disabled", "true");

    activityHolder.innerHTML = "<p>Generating Random Activity...</p>";

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

        activityHolder.innerHTML = "<p>Activity Generated</p>";

        setTimeout(() => {
          activityHolder.innerHTML = "";
        }, 1000);

        randomBtn.removeAttribute("disabled");
      } else if (data.error) {
        activityHolder.innerHTML = `<p>${data.error}</p>`;

        activityHolder.removeAttribute("disabled");
      } else {
        activityHolder.innerHTML = "<p>No activity received!</p>";

        randomBtn.removeAttribute("disabled");
      }
    } catch (error) {
      activityHolder.innerHTML =
        "<p>Error Occured when generating activity!</p>";

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
        result.innerHTML = ""; // Clear any previous results before showing new ones

        for (const song of data.playlist) {
          const itunesResult = await fetch("php/ajax/itunes_search.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // Encode the song data into URL format: "title=Highway+to+Hell&artist=AC%2FDC"
            body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
          });

          const itunesData = await itunesResult.json();

          if (itunesData.preview_url) {
            result.innerHTML += `<div>
            <p>${song.title} = ${song.artist}</p>
            <audio controls src="${itunesData.preview_url}"></audio>
            </div>`;
          } else {
            result.innerHTML += `<p>${song.title} - ${song.artist} (preview unavailable)</p>`;
          }
        }
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
