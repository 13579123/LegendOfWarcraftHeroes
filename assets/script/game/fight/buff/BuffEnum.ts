import { error } from "../../../util/out/error";
import { BuffMetaState } from "./BuffMetaState";

type Option = {
    id: string
}

export const BuffEnum: {[key: string]: BuffMetaState} = {}

export function RegisterBuff(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (BuffEnum[o.id]) return error("The id: " + o.id + " has been registered")
        BuffEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}