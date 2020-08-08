import { List, Map, Record } from 'immutable'

export type iContent = string
                     | Map<string, any>
                     | Record<string, any>

export type iText = List<List<iContent>>

export interface Item { [k:string]: any }

export type Content = string
                    | Item

export type Text = Array<Array<Content>>

export type Path = Array<String|number>
export type Cursor = [number, number, number | Path]
