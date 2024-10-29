// import {
//   ReactCompareSlider,
//   ReactCompareSliderImage,
// } from "react-compare-slider";
import { useVideoContext } from "./VideoProvider";
export function VideoSection() {
  const { outputVideo } = useVideoContext();
  // const videoUrl = URL.createObjectURL(video);
  return (
    <section className="imageSection">
      <video
        controls
        width={850}
        height={500}
        src={outputVideo}
        alt="originalImage"
        // autoPlay
        muted
        className="original-image"
        id="blurred"
        style={{
          border: "none",
          borderRadius: "20px",
        }}
      />
    </section>
  );
}
