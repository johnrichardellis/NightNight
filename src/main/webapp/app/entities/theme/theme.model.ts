export interface ITheme {
  id?: number;
  title?: string | null;
  link?: string | null;
}

export class Theme implements ITheme {
  constructor(public id?: number, public title?: string | null, public link?: string | null) {}
}

export function getThemeIdentifier(theme: ITheme): number | undefined {
  return theme.id;
}
