import "styled-components";

interface ISpace {
  mxxs: string;
  mxs: string;
  ms: string;
  mm: string;
  ml: string;
  mxl: string;
  mxxl: string;
  mxxxl: string;

  wxxs: string;
  wxs: string;
  ws: string;
  wm: string;
  wl: string;
  wxl: string;
  wxxl: string;
}

interface IBreakpoints {
  mobS: string;
  mobL: string;
  tabS: string;
  tabL: string;
  deskS: string;
  deskM: string;
  deskL: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      "simply-blue": string;
      "simply-black": string;
      "simply-white": string;
      "disable-black": string;
      "simply-gray": string;
      "light-purple": string;
      "simply-purple": string;

      "blue-10": string;
      "blue-20": string;
      "blue-30": string;
      "blue-40": string;
      "blue-50": string;
      "blue-60": string;

      "sky-blue-10": string;
      "sky-blue-20": string;
      "sky-blue-30": string;
      "sky-blue-40": string;
      "sky-blue-50": string;
      "sky-blue-60": string;

      "green-10": string;
      "green-20": string;
      "green-30": string;
      "green-40": string;
      "green-50": string;
      "green-60": string;

      "red-10": string;
      "red-20": string;
      "red-30": string;
      "red-40": string;
      "red-50": string;
      "red-60": string;

      "yellow-10": string;
      "yellow-20": string;
      "yellow-30": string;
      "yellow-40": string;
      "yellow-50": string;
      "yellow-60": string;

      "gray-10": string;
      "gray-20": string;
      "gray-30": string;
      "gray-40": string;
      "gray-50": string;
      "gray-60": string;

      "pfp-purple": string;
      "pfp-red": string;
      "pfp-gray": string;
    };
    space: string[] & Partial<ISpace>;
    breakpoints: string[] & Partial<IBreakpoints>;
    shadows: {
      "shadow-100": string;
      "shadow-200": string;
      "shadow-300": string;
      "shadow-400": string;
      "shadow-500": string;
      "shadow-600": string;
      "shadow-700": string;
      "shadow-800": string;
    };
  }
}
