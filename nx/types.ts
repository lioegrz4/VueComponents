export interface Status {
    currentPath: Array<Path>
}

export type Path = Array<string | number>

export interface HandlerArg { type: string, path: Path, payload: any }