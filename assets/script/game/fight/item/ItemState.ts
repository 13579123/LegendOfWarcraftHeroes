import { BasicState } from "../BasicState"
import { ItemMetaState } from "./ItemMetaState"

export type ItemStateCreate = {
    // id
    id: string
    // 数量
    number: number
}

export class ItemState extends BasicState<ItemMetaState> {

    number: number = 0

}
