import { error } from "cc";
import { BasicMetaState } from "../BasicMetaState";
import { CharacterMetaState } from "./CharacterMetaState";

type Option = {
    id: string
}

export const CharacterEnum: {[key: string]: CharacterMetaState} = {}

// 注册角色
export function RegisterCharacter(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (CharacterEnum[o.id]) return error("The id: " + o.id + " has been registered")
        CharacterEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}