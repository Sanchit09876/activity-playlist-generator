document.addEventListener("DOMContentLoaded", () => {
  // get references to the HTML elements we need
  const activityInput = document.getElementById("activityInput");
  const result = document.getElementById("result");
  const randomBtn = document.getElementById("randomBtn");

  // add a click event listener to the "Random Activity" button
  randomBtn.addEventListener("click", async () => {
    randomBtn.setAttribute("disabled", "true");
    // Show a loading message while fetching
    result.innerHTML = "<p>Generating Random Activity...</p>";

    try {
      // fetch a random activity from our PHP backend (api proxy)
      const response = await fetch("php/ajax/random_activity.php");

      // if the HTTP status is not OK (e.g., 404, 500), throw an error
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
      }
      // if the response contains an 'error' field, show it in the result div
      else if (data.error) {
        result.innerHTML = `<p>${data.error}</p>`;

        randomBtn.removeAttribute("disabled");
      }
      // otherwise, show a generic "no activity" message
      else {
        result.innerHTML = "<p>No activity received!</p>";

        randomBtn.removeAttribute("disabled");
      }
    } catch (error) {
      // if any error occurs (network, parsing, etc.), show an error message
      result.innerHTML = "<p>Error Occured when generating activity!</p>";

      randomBtn.removeAttribute("disabled");
    }
  });
});
