/* eslint-disable */
/**
 * fluentui
 * 
MIT License

Copyright (c) Microsoft Corporation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE

NOTE: Usage of the fonts and icons referenced in Fluent UI React is subject to the terms listed at https://aka.ms/fluentui-assets-license
 */

export {
    D50_to_D65,
    D65_to_D50,
    LAB_to_sRGB,
    LCH_to_Lab,
    LCH_to_P3,
    LCH_to_r2020,
    LCH_to_sRGB,
    Lab_to_LCH,
    Lab_to_XYZ,
    P3_to_LCH,
    XYZ_to_Lab,
    XYZ_to_lin_2020,
    XYZ_to_lin_P3,
    XYZ_to_lin_ProPhoto,
    XYZ_to_lin_a98rgb,
    XYZ_to_lin_sRGB,
    XYZ_to_uv,
    XYZ_to_xy,
    contrast,
    gam_2020,
    gam_P3,
    gam_ProPhoto,
    gam_a98rgb,
    gam_sRGB,
    hslToRgb,
    hueToChannel,
    lin_2020,
    lin_2020_to_XYZ,
    lin_P3,
    lin_P3_to_XYZ,
    lin_ProPhoto,
    lin_ProPhoto_to_XYZ,
    lin_a98rgb,
    lin_a98rgb_to_XYZ,
    lin_sRGB,
    lin_sRGB_to_XYZ,
    naive_CMYK_to_sRGB,
    naive_sRGB_to_CMYK,
    r2020_to_LCH,
    rgbToHsv,
    sRGB_to_LAB,
    sRGB_to_LCH,
    sRGB_to_luminance,
    snap_into_gamut,
    xy_to_uv
} from "./csswg.js";
export { getPointOnCurvePath, getPointsOnCurvePath } from "./geometry.js";
export {
    Lab_to_hex,
    curvePathFromPalette,
    hexColorsFromPalette,
    hex_to_LCH,
    hex_to_sRGB,
    paletteShadesFromCurve,
    sRGB_to_hex
} from "./palettes.js";
export { paletteTemplate, themeTemplate } from "./templates.js";