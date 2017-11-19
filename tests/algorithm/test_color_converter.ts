import * as t from "../test_common";
import * as cc from "../../algorithm/color_converter";


export function test(): t.OkNg {

    return t.printModule('algeol/math/color', [
        {group: 'function', results: t.tests([
            t.dataStr(
                "color.fn.format_02f(0)",
                cc.etc.format_02f(0),
                '00'),
            t.dataStr(
                "color.fn.format_02f(10)",
                cc.etc.format_02f(10),
                '0a'),
            t.dataStr(
                "color.fn.format_02f(100)",
                cc.etc.format_02f(100),
                '64'),
            t.dataStr(
                "color.fn.format_02f(255)",
                cc.etc.format_02f(255),
                'ff'),
            t.dataStr(
                "color.rgb255_to_rgbhex([51, 102, 153])",
                cc.rgb255_to_rgbhex([51, 102, 153]),
                '#336699'),
            t.dataStr(
                "color.rgb255_to_rgbhex([0, 128, 255])",
                cc.rgb255_to_rgbhex([0, 128, 255]),
                '#0080ff'),
        ], t.evalStr)},
        {group: 'function', results: t.tests([
            t.dataNumArray(
                "color.rgbhex_to_rgb255('#369')",
                cc.rgbhex_to_rgb255('#369'),
                [51, 102, 153]),
            t.dataNumArray(
                "color.rgbhex_to_rgb255('#0080ff')",
                cc.rgbhex_to_rgb255('#0080ff'),
                [0, 128, 255]),
            t.dataNumArray(
                "color.rgb255_to_rgb01([0, 153, 255])",
                cc.rgb255_to_rgb01([0, 153, 255]),
                [0.0, 0.6, 1.0]),
            t.dataNumArray(
                "color.rgb01_to_rgb255([0.0, 0.6, 1.0])",
                cc.rgb01_to_rgb255([0.0, 0.6, 1.0]),
                [0, 153, 255]),
        ], t.evalNumArray)},
        {group: 'photoshop_rgbhex_to_lab', results: t.tests([
            t.dataNumArray(
                "color.rgbhex_to_lab('#000')",
                cc.rgbhex_to_lab('#000'),
                [0, 0, 0]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#666')",
                cc.rgbhex_to_lab('#666'),
                [43, 0, 0]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#ccc')",
                cc.rgbhex_to_lab('#ccc'),
                [82, 0, 0]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#fff')",
                cc.rgbhex_to_lab('#fff'),
                [100, 0, 0]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#321')",
                cc.rgbhex_to_lab('#321'),
                [15, 7, 15]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#369')",
                cc.rgbhex_to_lab('#369'),
                [42, -5, -33]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#cba')",
                cc.rgbhex_to_lab('#cba'),
                [77, 4, 11]),
            t.dataNumArray(
                "color.rgbhex_to_lab('#cde')",
                cc.rgbhex_to_lab('#cde'),
                [87, -3, -10]),
        ], t.evalNumArray, 0.5)},
        {group: 'photoshop_lab_to_rgbhex', results: t.tests([
            t.dataStr(
                "color.lab_to_rgbhex([0, 0, 0])",
                cc.lab_to_rgbhex([0, 0, 0]),
                '#000000'),
            t.dataStr(
                "color.lab_to_rgbhex([50, 0, 0])",
                cc.lab_to_rgbhex([50, 0, 0]),
                '#777777'),
            t.dataStr(
                "color.lab_to_rgbhex([50, 50, 0])",
                cc.lab_to_rgbhex([50, 50, 0]),
                '#c14e79'),
            t.dataStr(
                "color.lab_to_rgbhex([50, 0, 50])",
                cc.lab_to_rgbhex([50, 0, 50]),
                '#887616'),
            t.dataStr(
                "color.lab_to_rgbhex([50, -50, 0])",
                cc.lab_to_rgbhex([50, -50, 0]),
                '#008c75'),
            t.dataStr(
                "color.lab_to_rgbhex([50, 0, -50])",
                cc.lab_to_rgbhex([50, 0, -50]),
                '#367acd'),
            t.dataStr(
                "color.lab_to_rgbhex([100, 0, 0])",
                cc.lab_to_rgbhex([100, 0, 0]),
                '#ffffff'),
            ], t.evalStr)},
    ]);
}

declare const module: any;
if (module != null && !module.parent) test();

