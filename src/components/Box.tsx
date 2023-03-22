import styled, { css } from "styled-components";
import {
  color,
  flexbox,
  fontSize,
  fontWeight,
  layout,
  space,
  shadow,
  border,
  typography,
  position,
  ColorProps,
  FontSizeProps,
  FontWeightProps,
  LayoutProps,
  SpaceProps,
  FlexboxProps,
  GridProps,
  ShadowProps,
  BorderProps,
  TypographyProps,
  PositionProps,
  system,
  backgroundImage,
  BackgroundImageProps,
  ResponsiveValue,
  grid,
} from "styled-system";
import React from "react";

import { allStyledSystemProps } from "../styleguide/filterStyledSystemProps";

export interface BoxProps
  extends ColorProps,
    FontSizeProps,
    FontWeightProps,
    LayoutProps,
    SpaceProps,
    FlexboxProps,
    GridProps,
    TypographyProps,
    ShadowProps,
    BorderProps,
    PositionProps,
    BackgroundImageProps {
  boxShadow?: any;
  borderRadius?: any;
  textTransform?: ResponsiveValue<
    "none" | "capitalize" | "uppercase" | "lowercase"
  >;
  textDecoration?: ResponsiveValue<"none" | "underline" | "overline">;
  fontStyle?: ResponsiveValue<"normal" | "italic" | "oblique">;
  cursor?:
    | "pointer"
    | "auto"
    | "wait"
    | "crosshair"
    | "not-allowed"
    | "zoom-in"
    | "grab";
  wordBreak?:
    | "normal"
    | "break-all"
    | "keep-all"
    | "break-word"
    | "initial"
    | "inherit";
  visibility?: ResponsiveValue<"visible" | "hidden" | "collapse">;
  scrollSnapAlign?: "none" | "start" | "end" | "center";
  scrollSnapType?: "x mandatory" | "y mandatory";
  scrollBehavior?: "auto" | "smooth";
  scrollMarginTop?: string;
  objectFit?: "cover" | "fill" | "contain" | "none" | "scale-down";
  outline?:
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "hidden"
    | "inset"
    | "none"
    | "outset"
    | "ridge"
    | "solid";
  backgroundRepeat?:
    | "no-repeat"
    | "repeat"
    | "repeat-x"
    | "repeat-y"
    | "round"
    | "space";
  backgroundPosition?: "bottom" | "center" | "left" | "right" | "top";
  backgroundSize?: "auto" | "contain" | "cover";
  whiteSpace?:
    | "-moz-pre-wrap"
    | "break-spaces"
    | "normal"
    | "nowrap"
    | "pre"
    | "pre-line"
    | "pre-wrap";
  WebkitBoxOrient?:
    | "block-axis"
    | "horizontal"
    | "inherit"
    | "inline-axis"
    | "vertical";
  WebkitLineClamp?: "none" | number;
  transform?: ResponsiveValue<string>;
  row?: boolean;
  column?: boolean;
  center?: boolean;
  between?: boolean;
  hideScrollBar?: boolean;
  hidden?: boolean;
  truncate?: boolean;
  css?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const customProps = {
  boxShadow: {
    property: "boxShadow",
    scale: "boxShadow",
  },
  borderRadius: {
    property: "borderRadius",
    scale: "borderRadii",
  },
  textTransform: true,
  textDecoration: true,
  fontStyle: true,
  cursor: true,
  wordBreak: true,
  visibility: true,
  scrollSnapAlign: true,
  scrollSnapType: true,
  scrollBehavior: true,
  scrollMarginTop: true,
  outline: true,
  objectFit: true,
  transform: true,
  backgroundRepeat: true,
  backgroundPosition: true,
  backgroundSize: true,
  whiteSpace: true,
  WebkitBoxOrient: true,
  WebkitLineClamp: true,
  color: true,
};

const customPropsStyleFn = system(customProps as any);

const allBoxProps = { ...allStyledSystemProps, ...customProps };
const filterStyledSytemProps = (prop, defaultValidatorFn) =>
  !allBoxProps[prop] && defaultValidatorFn(prop);

const Box = styled.div.withConfig({
  shouldForwardProp: filterStyledSytemProps,
})<BoxProps>`
  ${(props) =>
    props.row &&
    css`
      display: flex;
      flex-direction: row;
    `};
  ${(props) =>
    props.column &&
    css`
      display: flex;
      flex-direction: column;
    `};
  ${(props) =>
    props.center &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `};
  ${(props) =>
    props.between &&
    css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `};
  ${color};
  ${flexbox};
  ${grid}
  ${fontSize};
  ${fontWeight};
  ${layout};
  ${typography};
  ${space};
  ${shadow};
  ${border};
  ${position};
  ${backgroundImage};
  ${customPropsStyleFn};
`;

export default Box;
