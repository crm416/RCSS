declare class validCSSPropsType {
    [prop:string]: number | string
}

declare class StyleObjType {
    className: string;
    style: validCSSPropsType
};
