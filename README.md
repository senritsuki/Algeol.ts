# Algeol.ts
- Algeol: Algorithmic Geometry Generator for TypeScript 2.x.
- アルゴリズムによる3Dジオメトリ生成を支援するライブラリ。TypeScript言語向け。
- ブラウザ環境、node.js環境、どちらでも動きます。

## 背景
- 私が運営している創作同人サークル「虚空旋律記」では空想的な3D風景を収めた画集を発行しているのですが、そこでは3Dモデルをプログラムで生成しており、そのノウハウが蓄積されてきたため、ライブラリとして公開してみることにしました。

## 注意
- 仕事ではなく趣味のため、バグの放置や開発中断が起こり得ます。
- 勉強のために、あえて車輪の細発明を行っています。そのため性能や品質が犠牲になっています。

## 使い方
- 準備中……

## ディレクトリ構成
|ディレクトリ名|概要|依存先|
|-|-|-|
|algeol/|メイン。ジオメトリの生成や複製など。|algeol/math|
|algeol/math/|数学・アルゴリズム関連の様々なオブジェクトや関数。|なし|
|algeol/presets/|特定のジオメトリの生成や、特定のフォーマットへの変換など。|algeol, algeol/math|
|algeol_tests/|テストコード。|algeol, algeol/math, algeol/presets|

- 循環依存はありません。

## ファイル・モジュール構成
|モジュール名|ファイルパス|概要|依存モジュール|
|-|-|-|-|
|algeol|algeol\algeol.ts|Geometry Generating and Duplicating - ジオメトリ生成と複製|vector, matrix|
|complex_number|algeol\math\complex_number.ts|Complex Number - 複素数・二元数|utility, vector|
|curve2|algeol\math\curve2.ts|Curve with Parametric Equation - 2次元平面におけるパラメトリック方程式による曲線|utility, vector|
|curve3|algeol\math\curve3.ts|Curve with Parametric Equation - 3次元空間におけるパラメトリック方程式による曲線|utility, vector|
|l_system|algeol\math\l_system.ts|L-system, Lindenmayer system|curve2, turtle|
|matrix|algeol\math\matrix.ts|Square Matrix - 正方行列|utility, vector|
|projection|algeol\math\projection.ts|Perspective Projection - 透視投影|vector, matrix|
|quaternion|algeol\math\quaternion.ts|Quaternion - クォータニオン・四元数|utility, vector, matrix|
|turtle|algeol\math\turtle.ts|Turtle graphics - タートルグラフィックス|utility, vector, curve2, curve3|
|utility|algeol\math\utility.ts|定数定義と数列生成|なし|
|vector|algeol\math\vector.ts|Vector - ベクトル|utility|
|format_svg|algeol\presets\format_svg.ts|フォーマット変換 for Scalable Vector Graphics .svg|utility, vector, curve2|
|format_wavefrontobj|algeol\presets\format_wavefrontobj.ts|フォーマット変換 for Wavefront .obj|algeol, vector|
|geo_multi|algeol\presets\geo_multi.ts|複合オブジェクト定義|algeol, utility, vector|
|geo_primitive|algeol\presets\geo_primitive.ts|プリミティブオブジェクト定義|algeol, utility, vector|

- 循環依存はありません。

## 参考文献
- Eric Lengyel, 狩野智英訳, 『ゲームプログラミングのための3Dグラフィックス数学』, ボーンデジタル, 2002年.
- Robert Cecil Martin, 瀬谷啓介訳, 『アジャイルソフトウェア開発の奥義 第2版』, ソフトバンククリエイティブ, 2008年.
- etc.
