import {error as ccError} from "cc"

export function error(...arg: any) {
    return ccError(...arg)
}