import { error } from "../../../util/out/error"
import { ItemMetaState } from "./ItemMetaState"

type Option = {
    id: string
}

export const ItemEnum: {[key: string]: ItemMetaState} = {}

// 注册物品
export function RegisterCharacter(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (ItemEnum[o.id]) return error("The id: " + o.id + " has been registered")
        ItemEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}