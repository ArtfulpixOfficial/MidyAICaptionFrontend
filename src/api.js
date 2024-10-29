const gettingStatusOfTask = async function (taskId) {
  let taskStatus = "Not even started";

  const checkCurrentStatus = async function () {
    const { status } = await fetch(
      `https://clipdrop-api.co/async-tasks/v1/task-status/${taskId}`,
      {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      }
    ).then((res) => res.json());
    taskStatus = status;
    console.log(status);
    if (status === "completed") {
      clearInterval(statusInterval);
    }
  };
  const statusInterval = setInterval(checkCurrentStatus, 5000);

  return new Promise((resolve) => {
    const checkStatus = () => {
      if (taskStatus === "completed") resolve(taskStatus);
      else {
        setTimeout(checkStatus, 1000);
      }
    };
    checkStatus();
  });
};

export async function clipBoardAPI(
  file,
  imgWidth,
  imgHeight,
  target_upscale = 2,
  strategy = "smooth"
) {
  // Making The body of the request
  const form = new FormData();
  form.append("image_file", file);
  form.append("target_width", target_upscale * imgWidth);
  form.append("target_height", target_upscale * imgHeight);
  form.append("strategy", strategy);

  // Sending the post request to the api
  const {
    taskId: { value: taskId },
  } = await fetch(process.env.REACT_APP_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": process.env.REACT_APP_API_KEY,
    },
    body: form,
  }).then((res) => res.json());

  console.log("Task Id is: " + taskId);

  // Getting status of my uploaded Image
  const result = await gettingStatusOfTask(taskId);

  console.log(`upscaling of your file is ${result}`);

  const { downloadUrl: imageURL } = await fetch(
    `https://clipdrop-api.co/async-tasks/v1/result/${taskId}`,
    {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    }
  ).then((res) => res.json());

  return imageURL;
}
