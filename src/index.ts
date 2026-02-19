#! /usr/bin/env node
import process = require("process")
import readline = require("readline")
type Map<letters extends typeof OooO.letters> = ({
    [K in letters[number]]: string
})
class OooO {
    static letters = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ] as const
    /**
     * 生成映射表
     * @param src 小写字母
     */
    generateMap(src: string): Map<typeof OooO.letters> {
        const result = {} as Map<typeof OooO.letters>
        const length = 26 + 10
        const init = [...src.repeat(length)]
        OooO.letters.forEach((i, k) => {
            if (/[a-z]/g.exec(i)) {
                const tmp = Array.from(init)
                tmp[k] = src.toUpperCase()
                result[i] = tmp.join("")
            }
            else {
                const tmp = init.map(i => i.toUpperCase())
                tmp[k - 26] = src.toLowerCase()
                result[i] = tmp.join("")
            }
        })
        return result
    }
    static encrypt(src: string): string {
        const map = new OooO().generateMap("o")
        const res = [...btoa(encodeURIComponent(src)).replace(/=/g, "")].map((i) => map[i as typeof OooO.letters[number]])
        return res.join("")
    }
    static decrypt(src: string): string {
        const _t = new OooO().generateMap("o")
        const map: {
            [K in keyof typeof OooO.letters extends number ? K : string]: K
        } = {}
        Object.keys(_t).forEach((i) => {
            map[(_t as any)[i]] = i
        })
        const _src: string[] = []
        for (let i = 0; i <= src.length; i += 26 + 10) {
            _src.push([...src].slice(i, i + 26 + 10).join(""))
        }
        const res = _src.map((i) => map[i])
        return decodeURIComponent(atob(res.join("")))
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function run() {
    rl.question(
        `欢迎使用oOOo加密器\n\n\t功能选择\n1.加密\n2.解密\n3.退出\n`,
        ans => {
            switch (ans) {
                case "1": {
                    rl.question("输入加密的内容（中文英文任何字符皆可）：\n", src => {
                        console.log("加密结果：\n", OooO.encrypt(src))
                        rl.question("按任意键继续", () => run())
                    })
                    break
                }
                case "2": {
                    rl.question("输入解密的内容（只能输入使用本工具加密过的内容）：\n", src => {
                        console.log("解密结果：\n", OooO.decrypt(src))
                        rl.question("按任意键继续\n", () => run())
                    })
                    break
                }
                case "3": {
                    process.exit(0)
                }
            }
        })
}
run()