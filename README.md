# Algeol

Algeol is a TypeScript library that contains various algorithms for three-dimensional geometry generation.

Algeolは、3次元ジオメトリ生成のための様々なアルゴリズムを含むTypeScriptライブラリです。

## 概要

Algeolでは、3Dモデリングソフト無しで3Dモデルを生成するために役立つオブジェクトや関数を実装しています。
例えば、ベクトルや行列、クォータニオンやパラメトリック曲線、3Dジオメトリを再帰的に格納し制御できるオブジェクトと,
そのオブジェクトをWavefront.obj形式に出力できる関数、などです。

3Dモデルはポリゴンの集合体であり、ポリゴンは3つ以上の頂点となる三次元ベクトルが集まったものです。
多くの3Dモデリングソフトは三次元ベクトルを意識せずに3Dモデルを編集できる機能を備えていますが、
Algeolは、全ての三次元ベクトルおよびそれを含むポリゴンや3Dモデルをプログラムで直接制御することに特化しています。

## 注意

- 未完成です。
- 実行速度を速くすることは目標としていません。
- decoder/savefile.ts はファイル出力を行うため Node.js が前提ですが、それ以外は Node.js / ブラウザ環境 どちらでも動くはずです。

## 使い方

Algeolはライブラリであり、クラスや関数の詰め合わせです。
使いたいクラスや関数が定義されたモジュールを選びimportする、という使い方を想定しています。
具体例である以下のサンプルもご覧ください。

|サンプル例|サンプルソースコード|
|---|---|
|ベーシックな三角形の出力|[Algeol.ts/examples/1-primitives/triangle.ts](Algeol.ts/examples/1-primitives/triangle.ts)|
|プラトンの立体（正多角形）の出力|[Algeol.ts/examples/1-primitives/platonic_solid.ts](Algeol.ts/examples/1-primitives/platonic_solid.ts)|
|三色（赤緑青）の立方体の出力|[Algeol.ts/examples/2-colors/rgb_cubes.ts](Algeol.ts/examples/2-colors/rgb_cubes.ts)|
|L\*C\*h色空間のカラーホイールの出力|[Algeol.ts/examples/2-colors/lch_color_wheel.ts](Algeol.ts/examples/2-colors/lch_color_wheel.ts)|
|L\*C\*h色空間の色立体の出力|[Algeol.ts/examples/2-colors/lch_3d.ts](Algeol.ts/examples/2-colors/lch_3d.ts)|


## ディレクトリ構成
|ディレクトリ名|概要|依存先ディレクトリ|
|---|---|---|
|Algeol.ts/algorithm/|数列、ベクトル、行列、曲線など|なし|
|Algeol.ts/geometry/|ジオメトリのプリセット定義、生成、複製など|algorithm|
|Algeol.ts/decoder/|Wavefront.objフォーマットへの変換、ファイル出力|algorithm, geometry|
|Algeol.ts/tests/|Jestテストコード|algorithm, geometry, decoder|
|Algeol.ts/examples/|サンプル|algorithm, geometry, decoder|


## モジュール構成
|モジュール名|パス|概要|
|---|---|---|
|color_converter|Algeol.ts/algorithm/color_converter.ts|Color space conversion (RGB, HSL, XYZ, L*a*b*, L*C*h) - 色空間の変換|
|complex_number|Algeol.ts/algorithm/complex_number.ts|Complex number - 複素数（二元数）の生成と演算|
|curve|Algeol.ts/algorithm/curve.ts|Parametric curves - パラメトリック曲線の生成|
|l_system|Algeol.ts/algorithm/l_system.ts|L-system|
|matrix|Algeol.ts/algorithm/matrix.ts|Matrix - 行列の生成と行列演算|
|projection|Algeol.ts/algorithm/projection.ts|Projection - 射影演算|
|quaternion|Algeol.ts/algorithm/quaternion.ts|Quaternion - クォータニオン（四元数）の生成と演算|
|sequence|Algeol.ts/algorithm/sequence.ts|Sequence - 数列の生成|
|turtle|Algeol.ts/algorithm/turtle.ts|Turtle graphics - タートルグラフィックス|
|utility|Algeol.ts/algorithm/utility.ts|Utility constants and functions - 汎用的な定数と関数|
|vector|Algeol.ts/algorithm/vector.ts|Vector - ベクトルの生成とベクトル演算|
|savefile|Algeol.ts/decoder/savefile.ts|オブジェクトとマテリアルのファイル出力|
|wavefront|Algeol.ts/decoder/wavefront.ts|Wavefront (.obj, .mtl) format - Wavefrontフォーマットへの変換|
|core|Algeol.ts/geometry/core.ts|オブジェクトとマテリアルの生成とグループ化、オブジェクトの変形と複製|
|core_primitive|Algeol.ts/geometry/core_primitive.ts|プリミティブオブジェクトの生成|

## 背景・作った理由

私事ですが虚空旋律記という同人サークルを運営しており、3DCG画集を発行しています。
いくつかの画集では、プログラムで3Dモデルを直接生成する（3Dモデリングソフトに頼らない）、という拘った創り方をしてきました。
そこで記述したソースコードの一部をライブラリ化したのが、このAlgeolです。

## 参考文献
- Eric Lengyel, 狩野智英訳, 『ゲームプログラミングのための3Dグラフィックス数学』, ボーンデジタル, 2002年.
- Robert Cecil Martin, 瀬谷啓介訳, 『アジャイルソフトウェア開発の奥義 第2版』, ソフトバンククリエイティブ, 2008年.
- etc.
