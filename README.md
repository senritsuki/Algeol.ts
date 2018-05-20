# Algeol.ts

Algeol.ts is a TypeScript library that contains various algorithms for three-dimensional geometry generation.

Algeol.tsは、3次元ジオメトリ生成のための様々なアルゴリズムを含むTypeScriptライブラリです。

## 概要

Algeol.tsには、3Dモデリングソフト無しで3Dモデルを生成するために役立つオブジェクトや関数が実装されています。
例えば、ベクトルや行列、クォータニオンやパラメトリック曲線、3Dジオメトリを再帰的に格納し制御できるオブジェクトと,
そのオブジェクトをWavefront.obj形式に出力できる関数、などです。

3Dモデルはポリゴンの集合体であり、ポリゴンは3つ以上の頂点となる三次元ベクトルが集まったものです。
多くの3Dモデリングソフトは三次元ベクトルを意識せずに3Dモデルを編集できる機能を備えていますが、
Algeol.tsは、全ての三次元ベクトルおよびそれを含むポリゴンや3Dモデルをプログラムで直接制御することに特化しています。

## 注意

- 未完成です。
- 実行速度を速くすることは目標としていません。
- decoder/savefile.ts はファイル出力を行うため Node.js が前提ですが、それ以外は Node.js / ブラウザ環境 どちらでも動くはずです。

## 使い方

使いたいモジュールをimportして使います。

|例|ファイル|
|---|---|
|ベーシックな三角形の出力|[Algeol.ts/examples/1-primitives/triangle.ts](Algeol.ts/examples/1-primitives/triangle.ts)|
|プラトンの立体（正多角形）の出力|[Algeol.ts/examples/1-primitives/platonic_solid.ts](Algeol.ts/examples/1-primitives/platonic_solid.ts)|
|三色（赤緑青）の立方体の出力|[Algeol.ts/examples/2-colors/rgb_cubes.ts](Algeol.ts/examples/2-colors/rgb_cubes.ts)|
|L\*C\*h色空間のカラーホイールの出力|[Algeol.ts/examples/2-colors/lch_color_wheel.ts](Algeol.ts/examples/2-colors/lch_color_wheel.ts)|
|L\*C\*h色空間の色立体の出力|[Algeol.ts/examples/2-colors/lch_3d.ts](Algeol.ts/examples/2-colors/lch_3d.ts)|


## ディレクトリ構成
|ディレクトリ名|概要|依存先ディレクトリ|
|---|---|---|
|Algeol.ts/algorithm/|数列、ベクトル、行列、曲線など。|なし|
|Algeol.ts/geometry/|ジオメトリのプリセット定義、生成、複製など。|algorithm|
|Algeol.ts/decoder/|Wavefront.objフォーマットへの変換、ファイル出力。|algorithm, geometry|
|Algeo.ts/tests/|テストコード。Jest向け。|algorithm, geometry, decoder|
|Algeo.ts/examples/|サンプル。|algorithm, geometry, decoder|


## ファイル・モジュール構成
|モジュール名|ファイルパス|概要|依存モジュール|
|---|---|---|---|
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

## 背景・作った理由

私は以前から「虚空旋律記」という同人サークル活動をしており、
プログラムで生成した空想的な3D風景を収めた画集を発行したりしていました。
Algeol.tsは、その活動の副産物です。

## 参考文献
- Eric Lengyel, 狩野智英訳, 『ゲームプログラミングのための3Dグラフィックス数学』, ボーンデジタル, 2002年.
- Robert Cecil Martin, 瀬谷啓介訳, 『アジャイルソフトウェア開発の奥義 第2版』, ソフトバンククリエイティブ, 2008年.
- etc.
