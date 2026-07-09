export interface ProjectContentType {
  readonly id: string;
  readonly codename: string;
  readonly name: string;
}

export interface ProjectContentTypesState {
  readonly contentTypes: ReadonlyArray<ProjectContentType>;
  readonly isLoading: boolean;
  readonly source: "delivery-api" | "context" | "none";
}
