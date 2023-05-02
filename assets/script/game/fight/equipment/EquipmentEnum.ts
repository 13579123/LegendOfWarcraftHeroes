import { error } from "../../../util/out/error";
import { EquipmentMetaState } from "./EquipmentMetaState";

type Option = {
    id: string
}

export const EquipmentEnum: {[key: string]: EquipmentMetaState} = {}

export function RegisterEquipemtn(o: Option): ClassDecorator {
    return (TargetClass: any) => {
        if (EquipmentEnum[o.id]) return error("The id: " + o.id + " has been registered")
        EquipmentEnum[o.id] = TargetClass.getMetaInstance(o.id)
    }
}