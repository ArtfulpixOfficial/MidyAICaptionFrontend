import { Button } from "./Button";
import { useVideoContext } from "./VideoProvider";

export function Navbar() {
  const {
    inputVideo,
    outputVideo,
    setInputVideo,
    setOutputVideo,
    setSubtitle,
    setIsLoading,
    setLoadingStatus,
    setJsonSubtitleData,
    setFontSize,
    setPrimaryColour,
    setBackgroundWidth,
    setBackColour,
    setSpacing,
    setPosition,
    setIsBold,
    setIsItalic,
    setIsUnderline,
    setFontFamily,
    setOutlineWidth,
    setAnimation,
    setAnimationDuration,
    setEffect,
  } = useVideoContext();
  const handleDownload = async function () {
    if (!outputVideo) return;
    const response = await fetch(outputVideo);
    const blob = await response.blob();
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `captioned.${blob.type.split("/")[1]}`; // or use the actual file extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    // const downloadBlobUrl = URL.createObjectURL(
    //   new Blob([data.buffer], { type: "video/mp4" })
    // );
    // const link = document.createElement("a");
    // link.href = downloadBlobUrl;
    // link.download = "converted.mp4";
    // link.click();
  };

  const resetApplication = () => {
    setInputVideo(null);
    setOutputVideo(null);
    setIsLoading(false);
    setSubtitle("");
    setLoadingStatus("");
    setJsonSubtitleData([]);
    setFontSize({ name: "16px", code: "16" });
    setPrimaryColour("ff0000");
    setBackgroundWidth({
      name: "Transparent (Default)",
      code: "0",
    });
    setBackColour("0000001c");
    setSpacing({ name: "Default", code: "0.00" });
    setPosition({ name: "40px", code: "40" });
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setFontFamily({
      name: "Arial",
      code: "Arial",
    });
    setOutlineWidth({
      name: "Default(0)",
      code: "0",
    });
    setAnimation({ name: "None", code: "none" });
    setAnimationDuration({
      name: "0.5s",
      code: "0.5",
    });
    setEffect({ name: "None", code: "none" });
  };
  return (
    <nav className={inputVideo ? "searchNav" : "normal"}>
      {inputVideo ? (
        <>
          <Button
            className="btnBack show"
            onClick={resetApplication}
          >{`< Back`}</Button>
          <Button
            className="btnDownload show"
            onClick={handleDownload}
            disabled={outputVideo ? false : true}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 19L21 19V21L3 21V19ZM13 9L20 9L12 17L4 9L11 9V1L13 1L13 9Z"
                fill="currentColor"
              ></path>
            </svg>
            Download
          </Button>
        </>
      ) : null}
    </nav>
  );
}
