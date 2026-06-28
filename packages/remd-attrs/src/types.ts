/** A markdown construct that attribute lists can be attached to. */
export type AttrRuleName =
  | "fence"
  | "inline"
  | "table"
  | "list"
  | "heading"
  | "hr"
  | "softbreak"
  | "block";

/** Delimiters and allowed characters for the attribute-list syntax. */
export interface DelimiterConfig {
  /** Opening delimiter (default `{`). */
  left: string;
  /** Closing delimiter (default `}`). */
  right: string;
  /** Characters/patterns permitted inside the delimiters. */
  allowed: Array<string | RegExp>;
}

/** Options for the {@link remarkAttrs} plugin. */
export interface AttrsOptions extends Partial<DelimiterConfig> {
  /** Which constructs to enable. `"all"` (default), `false`/`[]` to disable, or a list of names. */
  rule?: "all" | boolean | AttrRuleName[];
}

/** A parsed `[key, value]` attribute pair. */
export type Attr = [key: string, value: string];

/** A `[start, end]` index range within the token content string. */
export type DelimiterRange = [start: number, end: number];
