import * as obj from '../algeol/datatype/object';
import * as 床 from './床';
import * as 木 from './木';


export interface 床と木info {
    g_name_床: string,
    g_name_幹: string,
    g_name_葉: string,
} 
export function 床と木(info: 床と木info): obj.Object {
    const floor = 床.逆4角錐({
        幅x: 1,
        幅y: 1,
        深さ: 1,
        原点: 床.原点.中心,
        g_name: info.g_name_床,
        transform: null,
    });
    const tree = 木.木({
        葉の数: 6,
        葉の段数: 3,
        段の高さ: 0.5,
        葉の小半径: 0.5,
        葉の大半径: 1.0,
        幹の半径: 0.05,
        g_name_幹: info.g_name_幹,
        g_name_葉: info.g_name_葉,
        transform: null,
    });
    return obj.objGrouped([
        floor,
        tree,
    ], null, null);
}
