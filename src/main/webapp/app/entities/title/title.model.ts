export interface ITitle {
  id?: number;
  title?: string | null;
  themes?: string | null;
  link?: string | null;
}

export class Title implements ITitle {
  constructor(public id?: number, public title?: string | null, public themes?: string | null, public link?: string | null) {}
}

export function getTitleIdentifier(title: ITitle): number | undefined {
  return title.id;
}
