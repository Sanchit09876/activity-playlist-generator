document.addEventListener("DOMContentLoaded", () => {
  const activityInput = document.getElementById("activityInput");
  const activityHolder = document.getElementById("activityHolder");
  const result = document.getElementById("result");
  const randomBtn = document.getElementById("randomBtn");

  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("sliderValue");

  const songCountText = document.querySelector(".song-count");

  // sliderValue.textContent = slider.value;
  slider.addEventListener("input", () => {
    const thumbWidth = 35;
    const sliderWidth = slider.offsetWidth;
    const percentage = (slider.value - slider.min) / (slider.max - slider.min);

    const offset = 17.5 - percentage * 35;

    sliderValue.textContent = slider.value;
    sliderValue.style.left = `calc(${percentage * 100}% + ${offset}px)`;

    songCountText.textContent = slider.value;
  });
  slider.dispatchEvent(new Event("input")); //Manually fires the input event once on page loadF

  activityInput.addEventListener("input", () => {
    const currentText = activityInput.value.trim();

    if (currentText === "") {
      activityHolder.style.display = "none";
      return;
    }
    activityHolder.style.display = "block";

    activityHolder.innerHTML = `<p class="activity-label">Your Activity</p>
        <p class="activity-result"><i class="fa-solid fa-person-running"></i>  ${currentText}</p>`;
  });

  randomBtn.addEventListener("click", async () => {
    randomBtn.setAttribute("disabled", "true");

    activityHolder.style.display = "block";
    activityHolder.innerHTML = `<p class="activity-loading">Generating Random Activity</p>`;

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

        activityHolder.innerHTML = `<p class="activity-label">Your Activity</p>
        <p class="activity-result"><i class="fa-solid fa-person-running"></i>  ${data.activity}</p>`;

        // setTimeout(() => {
        //   activityHolder.innerHTML = "";
        //   activityHolder.style.display = "none";
        // }, 2000);

        randomBtn.removeAttribute("disabled");
      } else if (data.error) {
        activityHolder.innerHTML = `<p>${data.error}</p>`;

        randomBtn.removeAttribute("disabled");
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

  //Random Button Icon animation
  const diceIcon = document.querySelector(".fa-dice");
  randomBtn.addEventListener("mouseover", () => {
    diceIcon.classList.add("fa-bounce");
  });
  randomBtn.addEventListener("mouseout", () => {
    diceIcon.classList.remove("fa-bounce");
  });

  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", async () => {
    generateBtn.setAttribute("disabled", true);

    const activity = activityInput.value.trim();
    if (!activity) {
      generateBtn.removeAttribute("disabled");
      return;
    }

    try {
      const response = await fetch("php/ajax/generate_playlist.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          "activity=" +
          encodeURIComponent(activity) +
          "&count=" +
          encodeURIComponent(slider.value),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.playlist && Array.isArray(data.playlist)) {
        result.innerHTML = ""; // Clear any previous results before showing new ones

        // for (const song of data.playlist) {
        //   const itunesResult = await fetch("php/ajax/itunes_search.php", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //     // Encode the song data into URL format: "title=Highway+to+Hell&artist=AC%2FDC"
        //     body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
        //   });

        //   const itunesData = await itunesResult.json();

        // if (itunesData.preview_url) {
        //   result.innerHTML += `<div class="song-row">
        //   <p>${song.title} = ${song.artist}</p>
        //   <audio controls src="${itunesData.preview_url}"></audio>
        //   </div>`;
        // } else {
        //   result.innerHTML += `<p>${song.title} - ${song.artist} (preview unavailable)</p>`;
        // }

        for (let i = 0; i < data.playlist.length; i++) {
          result.innerHTML += `
            <div class="song-row skeleton-row">
              <div class="song-num skeleton-box"></div>
              <div class="album-art skeleton-box"></div>
              <div class="song-info">
                <div class="skeleton-box skeleton-title"></div>
                <div class="skeleton-box skeleton-artist"></div>
              </div>
              <div class="skeleton-box skeleton-audio"></div>
              <div class="skeleton-box skeleton-icon"></div>
            </div>`;
        }

        for (let i = 0; i < data.playlist.length; i++) {
          const song = data.playlist[i];

          // const itunesResult = await fetch("php/ajax/itunes_search.php", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
          //   body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
          // });

          // const youtubeResult = await fetch("php/ajax/youtube_search.php", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
          //   body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
          // });

          // const itunesData = await itunesResult.json();
          // console.log(itunesData);
          // console.log(itunesData.full_data);

          // const youtubeData = await youtubeResult.json();
          // console.log(youtubeData.youtube_url);

          const [itunesResult, youtubeResult] = await Promise.all([
            fetch("php/ajax/itunes_search.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
            }),
            fetch("php/ajax/youtube_search.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`,
            }),
          ]);

          const [itunesData, youtubeData] = await Promise.all([
            itunesResult.json(),
            youtubeResult.json(),
          ]);

          // console.log(itunesData);
          console.log(youtubeData);
          const artHTML = itunesData.artwork_url
            ? `<img src = "${itunesData.artwork_url}" alt="cover" class = "album-art">`
            : `<div class="album-art"></div>`;

          const previewHTML = itunesData.preview_url
            ? `<audio controls src = "${itunesData.preview_url}"></audio>`
            : `<span class="no-preview">Preview Unavailable</span>`;

          const itunesIcon = itunesData.track_url
            ? `<a href="${itunesData.track_url}" target="_blank" class="itunes-song-link"><i class="fa-brands fa-itunes"></i></a>`
            : ""; //if in backend it doesn't find preview of song, it doen't display anything

          const youtubeURL = youtubeData.youtube_url
            ? `<a href="${youtubeData.youtube_url}" target="_blank" class="youtube-song-link"><i class="fa-brands fa-youtube"></i></a>`
            : `<div class="youtube-placeholder"></div>`; //fallback container to preserve symmetry if icon doesn't show

          result.children[i].outerHTML = `
            <div class="song-row">
                <div class="song-num">${i + 1}</div>
                ${artHTML}
                  <div class="song-info">
                    <p class="song-title">${song.title}</p>
                    <p class="song-artist">${song.artist}</p>
                  </div>
              <div class="preview-area">${previewHTML}</div>
              ${itunesIcon}
              ${youtubeURL}
            </div>`;

          //Itunes logo hover animation
          const currentItunesIcon =
            result.children[i].querySelector(".fa-itunes");

          if (!currentItunesIcon) continue; //skip if icon doesn't load or error occurs (Preview unavailable)

          currentItunesIcon.addEventListener("mouseover", () =>
            currentItunesIcon.classList.add("fa-beat"),
          );
          currentItunesIcon.addEventListener("mouseout", () =>
            currentItunesIcon.classList.remove("fa-beat"),
          );

          //Youtube logo hover animation
          const currentYoutubeIcon =
            result.children[i].querySelector(".fa-youtube");

          if (!currentYoutubeIcon) continue;

          currentYoutubeIcon.addEventListener("mouseover", () =>
            currentYoutubeIcon.classList.add("fa-beat"),
          );
          currentYoutubeIcon.addEventListener("mouseout", () =>
            currentYoutubeIcon.classList.remove("fa-beat"),
          );
        }

        generateBtn.removeAttribute("disabled");
      } else if (data.error) {
        result.innerHTML = `<p>Error: ${data.error}</p>`;
        generateBtn.removeAttribute("disabled");
      } else {
        result.innerHTML = "<p>No playlist generated</p>";
        generateBtn.removeAttribute("disabled");
      }
    } catch (error) {
      console.error(error);
      result.innerHTML = "<p>❌ Network error or server problem.</p>";
      generateBtn.removeAttribute("disabled");
    }
  });

  //generate button animation
  const musicIcon = document.querySelector(".fa-music");
  generateBtn.addEventListener("mouseover", () => {
    musicIcon.classList.add("fa-beat");
  });
  generateBtn.addEventListener("mouseout", () => {
    musicIcon.classList.remove("fa-beat");
  });

  //Display ticks to navigate slider
  const tickContainer = document.getElementById("tickContainer");
  for (let i = 0; i <= 5; i++) {
    const span = document.createElement("span");
    span.textContent = "|";

    tickContainer.appendChild(span);
  }
});
