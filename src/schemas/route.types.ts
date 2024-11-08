export type RouteMetadata = {
  title: string;
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
};
