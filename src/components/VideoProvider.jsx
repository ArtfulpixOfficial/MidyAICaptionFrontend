import { createContext, useContext, useState } from "react";

const VideoContext = createContext({
  inputVideo: null,
  isLoading: false,
  outputVideo: null,
  subtitle: "",
  loadingStatus: "",
  jsonSubtitleData: [],
  fontSize: {},
  primaryColour: "",
  backgroundWidth: {},
  backColour: "",
  spacing: {},
  position: {},
  isBold: false,
  isItalic: false,
  isUnderline: false,
  fontFamily: {},
  outlineWidth: {},
  animation: {},
  animationDuration: {},
  animationDelay: {},
  effect: {},
});

const CustomVideoProvider = ({ children }) => {
  const [inputVideo, setInputVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outputVideo, setOutputVideo] = useState(null);
  const [subtitle, setSubtitle] = useState("");
  const [loadingStatus, setLoadingStatus] = useState("");
  const [jsonSubtitleData, setJsonSubtitleData] = useState([]);

  const [fontSize, setFontSize] = useState({ name: "16px", code: "16" });
  const [primaryColour, setPrimaryColour] = useState("ff0000"); // Default to white
  const [backgroundWidth, setBackgroundWidth] = useState({
    name: "Transparent (Default)",
    code: "0",
  }); // Default to black

  const [backColour, setBackColour] = useState("0000001c"); // Default to black
  const [spacing, setSpacing] = useState({ name: "Default", code: "0.00" });
  const [position, setPosition] = useState({ name: "40px", code: "40" });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontFamily, setFontFamily] = useState({
    name: "Arial",
    code: "Arial",
  });
  const [outlineWidth, setOutlineWidth] = useState({
    name: "Default(0)",
    code: "0",
  });

  const [animation, setAnimation] = useState({ name: "None", code: "none" });
  const [animationDuration, setAnimationDuration] = useState({
    name: "0.5s",
    code: "0.5",
  });
  const [animationDelay, setAnimationDelay] = useState({
    name: "0s",
    code: "0",
  });
  const [effect, setEffect] = useState({ name: "None", code: "none" });
  return (
    <VideoContext.Provider
      value={{
        inputVideo,
        setInputVideo,
        isLoading,
        setIsLoading,
        outputVideo,
        setOutputVideo,
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
        animationDelay,
        setAnimationDelay,
        effect,
        setEffect,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

const useVideoContext = () => {
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
    animationDelay,
    setAnimationDelay,
    effect,
    setEffect,
  } = useContext(VideoContext);
  return {
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
    animationDelay,
    setAnimationDelay,
    effect,
    setEffect,
  };
};

export { CustomVideoProvider, useVideoContext };
