import { DefaultTheme } from 'styled-components';

//Breakpoints
const breakpoints: DefaultTheme['breakpoints'] = ['0px', '576px', '768px', '992px', '1200px', '1440px', '1600px'];

breakpoints.mobS = breakpoints[0]; // 320px
breakpoints.mobL = breakpoints[1]; // 424px
breakpoints.tabS = breakpoints[2]; // 767px
breakpoints.tabL = breakpoints[3]; // 1024px
breakpoints.deskS = breakpoints[4]; //1200px
breakpoints.deskM = breakpoints[5]; //1440px
breakpoints.deskL = breakpoints[6]; //1600px

//Spacing
const space: DefaultTheme['space'] = [
	'0',
	'0.4rem',
	'0.8rem',
	'1.2rem',
	'1.6rem',
	'2rem',
	'2.4rem',
	'2.8rem',
	'3.2rem',
	'4rem',
	'4.8rem',
	'5.6rem',
	'6.4rem',
	'8rem',
	'10rem',
	'12rem',
];

space.mxxs = space[1]; //4px
space.mxs = space[2]; //8px
space.ms = space[3]; //12px
space.mm = space[4]; //16px
space.ml = space[5]; //20px
space.mxl = space[6]; //24px
space.mxxl = space[7]; //28px
space.mxxxl = space[8]; //32px

space.wxxs = space[9]; //40px
space.wxs = space[10]; //48px
space.ws = space[11]; //56px
space.wm = space[12]; //64px
space.wl = space[13]; //80px
space.wxl = space[14]; //100px
space.wxxl = space[15]; //120px

const colors: DefaultTheme['colors'] = {
	'simply-blue': '#4743C5',
	'simply-purple': '#8247E5',
	'simply-black': '#010211',
	'simply-white': '#ffffff',
	'disable-black': '#8C8CA1',
	'simply-gray': '#868686',
	'light-purple': '#EFEFFD',

	'blue-60': '#161572',
	'blue-50': '#24218C',
	'blue-40': '#4743C5',
	'blue-30': '#726EDC',
	'blue-20': '#DBDAFC',
	'blue-10': '#F0EFFC',

	'sky-blue-60': '#6C96E5',
	'sky-blue-50': '#91B7FF',
	'sky-blue-40': '#ABC8FF',
	'sky-blue-30': '#C4D9FF',
	'sky-blue-20': '#DFEAFF',
	'sky-blue-10': '#F7FAFF',

	'green-10': '#F1FCEF',
	'green-20': '#DAFCD6',
	'green-30': '#83F08D',
	'green-40': '#33CF5F',
	'green-50': '#199554',
	'green-60': '#10784B',

	'red-10': '#FCF2EF',
	'red-20': '#FCDDD5',
	'red-30': '#F28382',
	'red-40': '#D6314F',
	'red-50': '#9A1848',
	'red-60': '#7C0F42',

	'yellow-10': '#FFFCF2',
	'yellow-20': '#FFF6D9',
	'yellow-30': '#FFDE8E',
	'yellow-40': '#FFBA44',
	'yellow-50': '#DB9631',
	'yellow-60': '#935715',

	'gray-10': '#FAFAFF',
	'gray-20': '#DCDCE5',
	'gray-30': '#ABABB2',
	'gray-40': '#7A7A80',
	'gray-50': '#49494D',
	'gray-60': '#010211',

	'pfp-purple': '#726EDC',
	'pfp-red': '#F28382',
	'pfp-gray': '#8A819B',
};

const shadows: DefaultTheme['shadows'] = {
	'shadow-100': '0px 2px 4px -2px rgba(24, 39, 75, 0.12), 0px 4px 4px -2px rgba(24, 39, 75, 0.08)',
	'shadow-200': '0px 4px 6px -4px rgba(24, 39, 75, 0.12), 0px 8px 8px -4px rgba(24, 39, 75, 0.08)',
	'shadow-300': '0px 6px 8px -6px rgba(24, 39, 75, 0.12), 0px 8px 16px -6px rgba(24, 39, 75, 0.08)',
	'shadow-400': '0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)',
	'shadow-500': '0px 6px 14px -6px rgba(24, 39, 75, 0.12), 0px 10px 32px -4px rgba(24, 39, 75, 0.1)',
	'shadow-600': '0px 8px 18px -6px rgba(24, 39, 75, 0.12), 0px 12px 42px -4px rgba(24, 39, 75, 0.12)',
	'shadow-700': '0px 8px 22px -6px rgba(24, 39, 75, 0.12), 0px 14px 64px -4px rgba(24, 39, 75, 0.12)',
	'shadow-800': '0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)',
};

const theme: DefaultTheme = {
	space,
	breakpoints,
	colors,
	shadows,
};

export default theme;
