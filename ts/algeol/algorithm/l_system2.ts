import * as vc from '../datatype/vector';
import * as mx from '../datatype/matrix';

export class Node<V, O> {
    constructor(
        public val: V,
        public option: O,
    ) {}
}

export function recurse<V, O>(nodes: Node<V, O>[], rule: (node: Node<V, O>) => Node<V, O>[]): Node<V, O>[] {
    return nodes
        .map(n => rule(n))
        .reduce((a, b) => a.concat(b));
}

export class Turtle {
    constructor(
        public pos: vc.V3 = vc.v3_zero,
        public pose: mx.M3 = mx.unit_m3,
    ) {}

    frontDir(): vc.V3 {
        return vc.array_to_v3(this.pose.col(0));
    }
    leftDir(): vc.V3 {
        return vc.array_to_v3(this.pose.col(1));
    }
    topDir(): vc.V3 {
        return vc.array_to_v3(this.pose.col(2));
    }

    setPos(newPos: vc.V3|number[]): Turtle {
        newPos = vc.to_v3_if_not(newPos);
        return new Turtle(newPos, this.pose);
    }
    setPose(newPose: mx.M3): Turtle {
        return new Turtle(this.pos, newPose);
    }

    move(front: number, left: number, top: number): Turtle {
        const newPos = vc.addAll([
            this.pos,
            this.frontDir().scalar(front),
            this.leftDir().scalar(left),
            this.topDir().scalar(top),
        ]);
        return new Turtle(newPos, this.pose);
    }
    moveFront(n: number): Turtle {
        const d = this.frontDir().scalar(n);
        const newPos = this.pos.add(d);
        return new Turtle(newPos, this.pose);
    }

    rot(axis: vc.V3|number[], rad: number): Turtle {
        const rot = mx.m3_rodrigues(axis, rad);
        const newPose = rot.mul(this.pose);
        return new Turtle(this.pos, newPose);
    }
    rotYawLeft(rad: number): Turtle {
        const axis = this.topDir();
        return this.rot(axis, rad);
    }
    rotPitchDown(rad: number): Turtle {
        const axis = this.leftDir();
        return this.rot(axis, rad);
    }
    rotRollRight(rad: number): Turtle {
        const axis = this.frontDir();
        return this.rot(axis, rad);
    }
}


export namespace ArithmeticSpiralTree {
    enum Value {
        lineFront,
        rot,
        lineFix,
    }

    export function init(): Node<Value, number>[] {
        return [
            new Node<Value, number>(Value.lineFront, 1),
        ];
    }

    export function rule(node: Node<Value, number>): Node<Value, number>[] {
        switch (node.val) {
            case Value.lineFront:
                return [
                    new Node<Value, number>(Value.lineFix, node.option),
                    new Node<Value, number>(Value.rot, 0),
                    new Node<Value, number>(Value.lineFront, node.option + 1),
                ];
            case Value.rot:
                return [node];
            case Value.lineFix:
                return [node];
        }
    }

    export class ArithmeticSpiralTree {
        constructor(
            public degree: number,
            public front: number,
            public down: number,
        ) {}
    
    
    
    }
}
