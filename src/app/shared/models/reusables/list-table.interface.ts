export interface TableColumns<T> {
    property: string;
    label: string;
    visible: boolean;
    type:
    | 'text'
    | 'number'
    | 'date'
    | 'datetime'
    | 'time'
    | 'boolean'
    | 'simpleBadge'
    | 'multipleBadge'
    | 'icon'
    | 'button'
    | 'badgeButton'
    | 'textWithPic'
    | 'DateBadge'
    | 'DateSingleBadge'
    | 'menu'
    | 'hour';
    cssProperty?: any;
    cssLabel?: any;
    cssSubProperty?: any;
    sort?: boolean;
    sortProperty?: string;
    action?: string;
    subProperty?: any;
    sticky?: boolean;
    download?: boolean;
    menuItems?: {
        label: string;
        icon: string;
        routerLink?: string;
        queryParams?: any;
        onClick: (element: T) => void;
    }[];
}

export interface TableFooter<T> {
    label: string;
    property: string;
    tooltip?: string;
    value: any;
}
