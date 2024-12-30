import { useEffect, useState } from "react";
import OpenAI from "openai";
import { VideoSection } from "./VideoSection";
import { Message } from "./Message";
import UploadFile from "./UploadFile";
import { Button } from "./Button";
import { Button as PrimeButton } from "primereact/button";
import { Hourglass } from "react-loader-spinner";
import { useVideoContext } from "./VideoProvider";
import { createClient } from "@supabase/supabase-js";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { Column } from "primereact/column";
import parseSRT from "parse-srt";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ColorPicker } from "primereact/colorpicker";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import { TabView, TabPanel } from "primereact/tabview";

// import { parse } from "subtitle";

const convertColorToHex = (color) => {
  return color.slice(1).match(/.{2}/g).reverse().join("");
};

function convertTimeToASSFormat(seconds) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toFixed(2).padStart(5, "0");

  return `${hours}:${minutes}:${secs}`;
}

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const animationOptions = [
  { name: "None", code: "none" },
  { name: "Fade In", code: "fade" },
  { name: "Slide Up", code: "slideup" },
  { name: "Pop In", code: "pop" },
  { name: "Type Writer", code: "type" },
  { name: "Wave", code: "wave" },
];

const animationDurationOptions = [
  { name: "0.5s", code: "0.5" },
  { name: "1s", code: "1" },
  { name: "1.5s", code: "1.5" },
  { name: "2s", code: "2" },
];

const effectOptions = [
  { name: "None", code: "none" },
  { name: "Glow", code: "glow" },
  { name: "Shadow", code: "shadow" },
  { name: "Blur Edge", code: "blur" },
  { name: "Karaoke", code: "karaoke" },
];
const backGroundWidthOptions = [
  {
    name: "Transparent (Default)",
    code: "0",
  },
  {
    name: "Single Border",
    code: "1",
  },
  {
    name: "Background Box",
    code: "3",
  },
];

const fontSizeOptions = [
  { name: "16px", code: "16" },
  { name: "18px", code: "18" },
  { name: "20px", code: "20" },
  { name: "24px", code: "24" },
];

const spacingOptions = [
  { name: "Default", code: "0.00" },
  { name: "1px", code: "1.00" },
  { name: "2px", code: "2.00" },
  { name: "3px", code: "3.00" },
  { name: "4px", code: "4.00" },
  { name: "5px", code: "5.00" },
  { name: "6px", code: "6.00" },
  { name: "7px", code: "7.00" },
];
const outlineWidthOptions = [
  { name: "Default(0)", code: "0" },
  { name: "1px", code: "1" },
  { name: "2px", code: "2" },
  { name: "3px", code: "3" },
  { name: "4px", code: "4" },
  { name: "5px", code: "5" },
  { name: "6px", code: "6" },
  { name: "7px", code: "7" },
];

const positionOptions = [
  { name: "40px", code: "40" },
  { name: "45px", code: "45" },
  { name: "50px", code: "50" },
  { name: "60px", code: "60" },
  { name: "75px", code: "75" },
  { name: "90px", code: "90" },
  { name: "100px", code: "100" },
  { name: "120px", code: "120" },
  { name: "150px", code: "150" },
];

export function Main() {
  const {
    inputVideo,
    outputVideo,
    setInputVideo,
    setOutputVideo,
    isLoading,
    setIsLoading,
    subtitle,
    setSubtitle,
    loadingStatus,
    setLoadingStatus,
    jsonSubtitleData,
    setJsonSubtitleData,
    fontSize,
    setFontSize,
    primaryColour,
    setPrimaryColour,
    backgroundWidth,
    setBackgroundWidth,
    backColour,
    setBackColour,
    spacing,
    setSpacing,
    position,
    setPosition,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    fontFamily,
    setFontFamily,
    outlineWidth,
    setOutlineWidth,
    animation,
    setAnimation,
    animationDuration,
    setAnimationDuration,
    effect,
    setEffect,
    language,
    setLanguage,
  } = useVideoContext();
  const [uploadedFile, setUploadedFile] = useState(null);

  const convertToASS = () => {
    let assHeader = `[Script Info]
Title: Subtitle File
ScriptType: v4.00+
PlayDepth: 0
Timer: 100,0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, Bold, Italic, Underline, BorderStyle, Outline, Spacing, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontFamily.code},${fontSize.code},&H${convertColorToHex(
      `#${primaryColour}`
    )},&H${convertColorToHex(`#${backColour}`)},${isBold ? 1 : 0},${
      isItalic ? 1 : 0
    },${isUnderline ? 1 : 0},${backgroundWidth.code},${outlineWidth.code},${
      spacing.code
    },2,10,10,${position.code},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    let assBody = jsonSubtitleData
      .map((subtitle) => {
        let animatedText = subtitle.text;
        // Add animation effects using ASS override tags
        if (animation.code !== "none") {
          switch (animation.code) {
            case "fade":
              animatedText = `{\\fad(${
                animationDuration.code * 1000
              },0)}${animatedText}`;
              break;
            case "slideup":
              animatedText = `{\\move(0,${position.code + 20},0,${
                position.code
              },0,${animationDuration.code * 1000})}${animatedText}`;
              break;
            case "pop":
              animatedText = `{\\t(0,${
                animationDuration.code * 1000
              },\\fscx120\\fscy120)\\t(${animationDuration.code * 1000},${
                animationDuration.code * 2000
              },\\fscx100\\fscy100)}${animatedText}`;
              break;
            case "type": {
              const charDelay =
                (animationDuration.code * 1000) / animatedText.length;
              animatedText = animatedText
                .split("")
                .map(
                  (char, i) =>
                    `{\\alpha&HFF&\\t(${i * charDelay},${
                      (i + 1) * charDelay
                    },\\alpha&H00&)}${char}`
                )
                .join("");
              break;
            }
            case "wave":
              animatedText = `{\\t(0,${
                animationDuration.code * 1000
              },\\frz20\\frz0)}${animatedText}`;
              break;
          }
        }

        // Add visual effects
        if (effect.code !== "none") {
          switch (effect.code) {
            case "glow":
              animatedText = `{\\blur2\\bord3\\3c&HFFFFFF&}${animatedText}`;
              break;
            case "shadow":
              animatedText = `{\\shad4\\4c&H000000&}${animatedText}`;
              break;
            case "blur":
              animatedText = `{\\be1}${animatedText}`;
              break;
            case "karaoke": {
              const duration = subtitle.end - subtitle.start;
              animatedText = `{\\k${Math.round(
                duration * 100
              )}}${animatedText}`;
              break;
            }
          }
        }
        return `Dialogue: 0,${convertTimeToASSFormat(
          subtitle.start
        )},${convertTimeToASSFormat(subtitle.end)},Default,,0,0,${
          position.code
        },,${animatedText}`;
      })
      .join("\n");

    return assHeader + assBody;
  };

  const handleSubmit = async function () {
    try {
      setIsLoading(true);
      setLoadingStatus("Preparing Subtitles");
      const assBlob = new Blob([convertToASS()], {
        type: "text/plain",
      });
      const tempName = Date.now();
      // Uploading Input Video to Supabase
      await supabaseClient.storage
        .from("Caption input and output video bucket")
        .upload(`assSubtitles/inputVideo_${tempName}.ass`, assBlob, {
          contentType: "text/plain",
          upsert: true,
        });

      const assSubtitleUrl = supabaseClient.storage
        .from("Caption input and output video bucket")
        .getPublicUrl(`assSubtitles/inputVideo_${tempName}.ass`).data.publicUrl;

      // Start the video processing job
      setLoadingStatus("Initiating Video Processing");
      const response = await fetch(
        `${import.meta.env.VITE_AWS_URL}/api/convert`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: inputVideo,
            assUrl: assSubtitleUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to start processing: ${response.statusText}`);
      }

      const { jobId } = await response.json();

      // Poll for job status
      const maxAttempts = 120; // 10 minutes with 5-second intervals
      let attempts = 0;

      const pollStatus = async () => {
        if (attempts >= maxAttempts) {
          throw new Error("Processing timeout exceeded");
        }

        const statusResponse = await fetch(
          `${import.meta.env.VITE_AWS_URL}/api/status/${jobId}`
        );

        if (!statusResponse.ok) {
          throw new Error(
            `Failed to fetch status: ${statusResponse.statusText}`
          );
        }

        const jobStatus = await statusResponse.json();

        switch (jobStatus.status) {
          case "processing":
            // setLoadingStatus(`Processing Video: ${jobStatus.progress || 0}%`);
            setLoadingStatus(`Processing Video...`);
            attempts++;
            // Poll again after 5 seconds
            setTimeout(pollStatus, 5000);
            break;

          case "completed":
            setOutputVideo(jobStatus.result_url);
            setLoadingStatus("Done");
            setIsLoading(false);
            break;

          case "failed":
            throw new Error(
              `Video processing failed: ${
                jobStatus.error_message || "Unknown error"
              }`
            );

          default:
            throw new Error(`Unknown job status: ${jobStatus.status}`);
        }
      };
      // Start polling
      await pollStatus();
    } catch (error) {
      console.error("Video processing error:", error);
      setLoadingStatus(`Error: ${error.message}`);
      setIsLoading(false);
    }
    // setOutputVideo(result);
    // setLoadingStatus("Done");
    // setIsLoading(false);
  };
  async function onFileChange(file) {
    setUploadedFile(file);
  }

  async function generateCaptions() {
    // setInputVideo(file);
    // console.log(file.name.slice(-4));
    if (!uploadedFile || !language) return;
    const file = uploadedFile;
    setLoadingStatus("Uploading...");
    setIsLoading(true);
    const resSubtitle = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: file,
      response_format: "srt",
      language: language.code,
    });

    setJsonSubtitleData(parseSRT(resSubtitle.slice(0, -1)));
    const srtBlob = new Blob([resSubtitle.slice(0, -1)], {
      type: "text/plain",
    });
    const tempName = Date.now();
    setLoadingStatus("Generating Subtitles");
    // Uploading Input Video to Supabase
    await supabaseClient.storage
      .from("Caption input and output video bucket")
      .upload(`videos/inputVideo_${tempName}${file.name.slice(-4)}`, file, {
        upsert: true,
      });

    const videoPublicUrl = supabaseClient.storage
      .from("Caption input and output video bucket")
      .getPublicUrl(`videos/inputVideo_${tempName}${file.name.slice(-4)}`)
      .data.publicUrl;
    setInputVideo(videoPublicUrl);
    // Uploading Generated Subtitles to Supabase

    await supabaseClient.storage
      .from("Caption input and output video bucket")
      .upload(`subtitles/inputVideo_${tempName}.srt`, srtBlob, {
        contentType: "text/plain",
        upsert: true,
      });

    const subtitlePublicUrl = supabaseClient.storage
      .from("Caption input and output video bucket")
      .getPublicUrl(`subtitles/inputVideo_${tempName}.srt`).data.publicUrl;
    setSubtitle(subtitlePublicUrl);
    setIsLoading(false);
    setLoadingStatus("Done");
    setUploadedFile(null);
  }

  const onEditorValueChange = (props, value) => {
    let updatedSubtitles = [...jsonSubtitleData];
    updatedSubtitles[props.rowIndex][props.field] = value;
    setJsonSubtitleData(updatedSubtitles);
  };

  // Text editor for editing subtitle text
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        className="w-12"
      />
    );
  };

  // Timing editor for start and end times
  const timeEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="decimal"
        minFractionDigits={0}
        maxFractionDigits={3} // Adjust this according to the precision you need
        min={0} // Prevents negative time
        useGrouping={false} // To avoid grouping numbers with commas
        // className="w-6"
        inputClassName="w-2 ml-2"
      />
    );
  };

  const onRowEditComplete = (e) => {
    let _jsonSubtitleData = [...jsonSubtitleData];
    let { newData, index } = e;
    _jsonSubtitleData[index] = { ...newData, id: index + 1 };

    setJsonSubtitleData(_jsonSubtitleData);
  };

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <PrimeButton
        type="button"
        text
        severity="danger"
        icon="pi pi-trash"
        rounded
        onClick={() => {
          const newSubData = jsonSubtitleData
            .filter((sub) => sub.id !== rowData.id)
            .map((_, index) => {
              return { ..._, id: index + 1 };
            });
          setJsonSubtitleData(newSubData);
        }}
      ></PrimeButton>
    );
  };

  const footerTemplate = (data) => {
    return (
      <>
        <td></td>
        <td></td>
        <td>
          <div className="flex justify-content-center font-bold w-full py-2">
            <PrimeButton
              icon="pi pi-plus"
              severity="success"
              outlined
              rounded
              // className="justify-content-center"
              size="small"
              onClick={() =>
                setJsonSubtitleData((v) => [
                  ...v,
                  {
                    id: v.length + 1,
                    text: "Edit Row to change sub",
                    start: +Number(0.0).toFixed(3),
                    end: +Number(0.0).toFixed(3),
                  },
                ])
              }
            />
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
      </>
    );
  };

  return (
    <main className="px-5 align-items-center">
      {inputVideo && subtitle && outputVideo && !isLoading && <VideoSection />}
      {isLoading && (
        <>
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#fff", "#424b5a"]}
          />
          <h1>{loadingStatus}</h1>
          <h2>(Please Wait, This can take some minutes)</h2>
        </>
      )}
      {!outputVideo && !inputVideo && !isLoading && !subtitle && (
        <>
          {!uploadedFile ? (
            <>
              <Message />
              <UploadFile onFileChange={onFileChange} />
            </>
          ) : (
            <section className="imageSection mb-0">
              <video
                controls
                width={850}
                height={500}
                src={URL.createObjectURL(uploadedFile)}
                alt="originalImage"
                // autoPlay

                className="original-image"
                id="blurred"
                style={{
                  border: "none",
                  borderRadius: "20px",
                }}
              />
            </section>
          )}
          <div className="grid mt-5 flex align-items-center w-full justify-content-center gap-4">
            <div className="col-2 flex flex-column align-items-center">
              <label className="text-800 font-semibold text-white">
                Captions Language
              </label>
              <Dropdown
                value={language}
                options={[
                  { name: "Afrikaans", code: "af" },
                  { name: "Arabic", code: "ar" },
                  { name: "Armenian", code: "hy" },
                  { name: "Azerbaijani", code: "az" },
                  { name: "Belarusian", code: "be" },
                  { name: "Bosnian", code: "bs" },
                  { name: "Bulgarian", code: "bg" },
                  { name: "Catalan", code: "ca" },
                  { name: "Chinese", code: "zh" },
                  { name: "Croatian", code: "hr" },
                  { name: "Czech", code: "cs" },
                  { name: "Danish", code: "da" },
                  { name: "Dutch", code: "nl" },
                  { name: "English", code: "en" },
                  { name: "Estonian", code: "et" },
                  { name: "Finnish", code: "fi" },
                  { name: "French", code: "fr" },
                  { name: "Galician", code: "gl" },
                  { name: "German", code: "de" },
                  { name: "Greek", code: "el" },
                  { name: "Hebrew", code: "he" },
                  { name: "Hindi", code: "hi" },
                  { name: "Hungarian", code: "hu" },
                  { name: "Icelandic", code: "is" },
                  { name: "Indonesian", code: "id" },
                  { name: "Italian", code: "it" },
                  { name: "Japanese", code: "ja" },
                  { name: "Kannada", code: "kn" },
                  { name: "Kazakh", code: "kk" },
                  { name: "Korean", code: "ko" },
                  { name: "Latvian", code: "lv" },
                  { name: "Lithuanian", code: "lt" },
                  { name: "Macedonian", code: "mk" },
                  { name: "Malay", code: "ms" },
                  { name: "Marathi", code: "mr" },
                  { name: "Maori", code: "mi" },
                  { name: "Nepali", code: "ne" },
                  { name: "Norwegian", code: "no" },
                  { name: "Persian", code: "fa" },
                  { name: "Polish", code: "pl" },
                  { name: "Portuguese", code: "pt" },
                  { name: "Romanian", code: "ro" },
                  { name: "Russian", code: "ru" },
                  { name: "Serbian", code: "sr" },
                  { name: "Slovak", code: "sk" },
                  { name: "Slovenian", code: "sl" },
                  { name: "Spanish", code: "es" },
                  { name: "Swahili", code: "sw" },
                  { name: "Swedish", code: "sv" },
                  { name: "Tagalog", code: "tl" },
                  { name: "Tamil", code: "ta" },
                  { name: "Thai", code: "th" },
                  { name: "Turkish", code: "tr" },
                  { name: "Ukrainian", code: "uk" },
                  { name: "Urdu", code: "ur" },
                  { name: "Vietnamese", code: "vi" },
                  { name: "Welsh", code: "cy" },
                ]}
                onChange={(e) => setLanguage(e.value)}
                placeholder="Captions Language"
                optionLabel="name"
                className="w-full p-2 mt-2 py-3"
                checkmark
              />
            </div>
            <div className="col-2 grid flex align-items-center pt-6 pb-3">
              <Button
                className="btnBack show col py-3"
                onClick={generateCaptions}
              >{`Generate Captions`}</Button>
            </div>
          </div>
        </>
      )}
      {!outputVideo && inputVideo && !isLoading && subtitle && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // alignSelf: "center",
          }}
          // className="h-20rem align-self-start"
        >
          <div
            className="flex mb-4 align-items-stretch"
            style={{ minHeight: "60vh", maxHeight: "95vh" }}
          >
            <div
              className="card col-6 bg-white flex flex-column"
              style={{
                border: "none",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <TabView className="h-full" scrollable={true}>
                <TabPanel
                  header="Style"
                  contentClassName="overflow-y-auto" // Enable vertical scrolling
                  headerClassName="ml-4"
                  style={{ maxHeight: "calc(95vh - 3rem)" }} // Subtract header height
                >
                  <div className="p-2">
                    <div className="grid grid-nogutter py-2">
                      <div className="col-3 flex flex-column mr-4 mb-3">
                        <label className="text-800 font-semibold mb-2">
                          Font Family
                        </label>
                        <Dropdown
                          value={fontFamily}
                          options={[
                          { name: "Arial", code: "Arial" },
                          { name: "Noto Sans", code: "Noto Sans" },
                          { name: "Roboto", code: "Roboto" },
                          { name: "DM Sans", code: "DM Sans" },
                          { name: "Nunito", code: "Nunito" },
                          {
                            name: "Roboto Condensed",
                            code: "Roboto Condensed",
                          },
                          { name: "Inter", code: "Inter" },
                          { name: "Open Sans", code: "Open Sans" },
                          { name: "Roboto Mono", code: "Roboto Mono" },
                          { name: "Itim", code: "Itim" },
                          { name: "Oswald", code: "Oswald" },
                          { name: "Rubik", code: "Rubik" },
                          { name: "Kanit", code: "Kanit" },
                          {
                            name: "Playfair Display",
                            code: "Playfair Display",
                          },
                          { name: "Ubuntu", code: "Ubuntu" },
                          { name: "Lato", code: "Lato" },
                          { name: "Poppins", code: "Poppins" },
                          { name: "Montserrat", code: "Montserrat" },
                          { name: "Raleway", code: "Raleway" },
                        ]}
                          onChange={(e) => setFontFamily(e.value)}
                          placeholder="Font Family"
                          optionLabel="name"
                          className="w-full py-3 pl-2"
                          checkmark
                        />
                      </div>
                      <div className="col-3 flex flex-column mr-4">
                        <label className="text-800 font-semibold mb-2">
                          Font Size
                        </label>
                        <Dropdown
                          value={fontSize}
                          options={fontSizeOptions}
                          onChange={(e) => setFontSize(e.value)}
                          placeholder="Font Size"
                          optionLabel="name"
                          className="w-full py-3 pl-2"
                          checkmark
                        />
                      </div>
                      <div className="col-2 flex flex-column align-items-center">
                        <label className="text-800 font-semibold text-center">
                          Fill
                        </label>
                        <ColorPicker
                          value={primaryColour}
                          onChange={(e) => setPrimaryColour(e.value)}
                          className="pt-2 flex justify-content-center w-6"
                          // className="w-full"
                          inputClassName="w-full"
                        />
                      </div>
                      <div className="col-2 flex flex-column align-items-center">
                        <label className="text-800 font-semibold px-3 text-center">
                          Background
                        </label>
                        <ColorPicker
                          value={backColour}
                          onChange={(e) => setBackColour(e.value)}
                          className="pt-2 w-6"
                          inputClassName="w-full"
                        />
                      </div>

                      <div className="col-5 flex flex-column mr-4">
                        <label className="text-800 font-semibold">
                          Background Width
                        </label>
                        <Dropdown
                          value={backgroundWidth}
                          options={backGroundWidthOptions}
                          onChange={(e) => setBackgroundWidth(e.value)}
                          placeholder="Background Width"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>

                      <div className="col-2 flex align-items-end justify-content-end">
                        <PrimeButton
                          icon={<FormatBoldIcon />}
                          size="large"
                          outlined
                          severity={!isBold ? "secondary" : "contrast"}
                          aria-label="Filter"
                          className={`py-3 w-6`}
                          onClick={() => setIsBold(!isBold)}
                        />
                      </div>
                      <div className="col-2 flex align-items-end justify-content-center">
                        <PrimeButton
                          icon={<FormatItalicIcon />}
                          size="large"
                          outlined
                          severity={!isItalic ? "secondary" : "contrast"}
                          aria-label="Filter"
                          className={`py-3 w-6`}
                          onClick={() => setIsItalic(!isItalic)}
                        />
                      </div>
                      <div className="col-2 flex align-items-end justify-content-start">
                        <PrimeButton
                          // text
                          icon={<FormatUnderlinedIcon />}
                          severity={!isUnderline ? "secondary" : "contrast"}
                          size="large"
                          className={`py-3 w-6`}
                          onClick={() => setIsUnderline(!isUnderline)}
                          outlined
                          aria-label="Filter"
                        />
                      </div>

                      <div className="col-3 flex flex-column my-3">
                        <label className="text-800 font-semibold pt-2">
                          Outline Width
                        </label>
                        <Dropdown
                          value={outlineWidth}
                          options={outlineWidthOptions}
                          onChange={(e) => setOutlineWidth(e.value)}
                          placeholder="Outline Width"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>
                      <div className="col-3 flex flex-column mx-5 my-3">
                        <label className="text-800 font-semibold pt-2">
                          Letter Spacing
                        </label>
                        <Dropdown
                          value={spacing}
                          options={spacingOptions}
                          onChange={(e) => setSpacing(e.value)}
                          placeholder="Letter Spacing"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>
                      <div className="col-3 flex flex-column my-3">
                        <label className="text-800 font-semibold pt-2">
                          Position
                        </label>
                        <Dropdown
                          value={position}
                          options={positionOptions}
                          onChange={(e) => setPosition(e.value)}
                          placeholder="Adjust Position"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>

                      <div className="col-4 flex flex-column mr-2">
                        <label className="text-800 font-semibold">
                          Animation
                        </label>
                        <Dropdown
                          value={animation}
                          options={animationOptions}
                          onChange={(e) => setAnimation(e.value)}
                          placeholder="Select Animation"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>
                      {animation.code !== "none" && (
                        <div className="col-3 flex flex-column">
                          <label className="text-800 font-semibold">
                            Animation Duration
                          </label>
                          <Dropdown
                            value={animationDuration}
                            options={animationDurationOptions}
                            onChange={(e) => setAnimationDuration(e.value)}
                            placeholder="Duration"
                            optionLabel="name"
                            className="w-full p-2 mt-2 py-3"
                            checkmark
                          />
                        </div>
                      )}
                      <div className="col-4 flex flex-column ml-2">
                        <label className="text-800 font-semibold">Effect</label>
                        <Dropdown
                          value={effect}
                          options={effectOptions}
                          onChange={(e) => setEffect(e.value)}
                          placeholder="Select Effect"
                          optionLabel="name"
                          className="w-full p-2 mt-2 py-3"
                          checkmark
                        />
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header="Captions">
                  <div className="row flex flex-column">
                    <DataTable
                      rowGroupMode="subheader"
                      // footer={footerTemplate}
                      rowGroupFooterTemplate={footerTemplate}
                      scrollable
                      scrollHeight="570px"
                      value={jsonSubtitleData}
                      editMode="row"
                      onRowEditComplete={onRowEditComplete}
                      reorderableRows
                      onRowReorder={(e) => {
                        const newSubData = e.value.map((sub, index) => {
                          return { ...sub, id: index + 1 };
                        });
                        setJsonSubtitleData(newSubData);
                      }}
                      dataKey="id"
                    >
                      <Column rowReorder style={{ width: "2rem" }} />
                      <Column
                        field="text"
                        header="Subtitle Text"
                        editor={(options) => textEditor(options)}
                        headerClassName="py-2 text-lg"
                        className="py-2"
                      />
                      <Column
                        field="start"
                        header="Start Time"
                        editor={(options) => timeEditor(options)}
                        style={{ width: "15%" }}
                        align="center"
                        className="py-2"
                        headerClassName="py-2 text-lg"
                      />
                      <Column
                        field="end"
                        header="End Time"
                        editor={(options) => timeEditor(options)}
                        style={{ width: "15%" }}
                        align="center"
                        className="py-2"
                        headerClassName="text-lg"
                      />
                      <Column
                        rowEditor={allowEdit}
                        // body={actionBodyTemplate}
                        header="Actions"
                        headerStyle={{ width: "5%", minWidth: "4rem" }}
                        headerClassName="text-lg"
                        bodyStyle={{ textAlign: "center" }}
                        align="right"
                        className="py-2"
                      />
                      <Column
                        // rowEditor={allowEdit}
                        body={actionBodyTemplate}
                        // header="Actions"
                        // headerStyle={{ width: "3%", minWidth: "1rem" }}
                        // headerClassName="text-md"
                        // bodyStyle={{ textAlign: "center" }}
                        align="left"
                        className="py-2"
                      />
                    </DataTable>
                  </div>
                </TabPanel>
              </TabView>
            </div>
            <div className="col-6 original-image h-full py-0 flex justify-content-center">
              <video
                controls
                // width={850}
                // height={500}
                src={inputVideo}
                alt="originalImage"
                // autoPlay
                className="w-full"
                id="blurred"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  objectFit: "fill",
                  maxHeight: "82vh",
                  // width: "80%",
                  // height: "auto",
                  // width: "fit-content",
                }}
              />
            </div>
          </div>
          <Button
            className="btnBack show col-2 align-self-center"
            onClick={handleSubmit}
          >{`Convert`}</Button>
        </div>
      )}
    </main>
  );
}
