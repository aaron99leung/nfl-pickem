import localFont from "next/font/local";

export const betrayed = localFont({
  src: "./fonts/betrayed.otf",
  variable: "--font-betrayed",
});

export const clashGrotesk = localFont({
  src: [
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/ClashGrotesk_Complete/Fonts/OTF/ClashGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-grotesk",
});

export const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi_Complete/Fonts/OTF/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});
