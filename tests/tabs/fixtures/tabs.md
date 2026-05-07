<!-- @case: basic two tabs -->

% Tab One
> Content for tab one.
% Tab Two
> Content for tab two.

<!-- @case: three tabs first open by default -->

% npm
> ```sh
> npm install my-package
> ```
% pnpm
> ```sh
> pnpm add my-package
> ```
% yarn
> ```sh
> yarn add my-package
> ```

<!-- @case: explicit open tab with %+ -->

% Tab One
> Content for tab one.
%+ Tab Two
> Content for tab two.
% Tab Three
> Content for tab three.

<!-- @case: tab with multi-paragraph body -->

% Tab One
> First paragraph.
>
> Second paragraph.
% Tab Two
> Only paragraph.

<!-- @case: tab with code block body -->

% npm
> ```sh
> npm install
> ```
% pnpm
> ```sh
> pnpm add
> ```

<!-- @case: tabs followed by paragraph -->

% Tab One
> Content for tab one.
% Tab Two
> Content for tab two.

This paragraph is outside the tab group.

<!-- @case: nested tabs depth two -->

% Node.js
%% npm
> ```sh
> npm install
> ```
%% pnpm
> ```sh
> pnpm add
> ```
% Deno
> ```sh
> deno add my-package
> ```

<!-- @case: tab with inline markup in label -->

% **Bold** label
> Content here.
% `code` label
> Content here.

<!-- @case: single tab -->

% Only Tab
> Content here.

<!-- @case: bare continuation keeps block open -->

% Tab One
> Line one.
>
> Line two after blank.
% Tab Two
> Content for tab two.

<!-- @case: tab with table body -->

% Tab One
> | Col A | Col B |
> |-------|-------|
> | Cell  | Cell  |
% Tab Two
> Content for tab two.

<!-- @case: tab with nested blockquote body -->

% Tab One
> First paragraph.
>
> > This is a nested blockquote.
% Tab Two
> Content for tab two.

<!-- @case: orphan blockquote before tabs: no blank line, absorbed -->

> This blockquote has no blank line before the tab header below it.
% Tab One
> Content for tab one.

<!-- @case: orphan blockquote before tabs: blank line, tabs render -->

> This blockquote is separated by a blank line.

% Tab One
> Content for tab one.
% Tab Two
> Content for tab two.

<!-- @case: blockquote terminated by code fence, then tabs -->

> This blockquote is terminated by the code fence that immediately follows it.
```js
const x = 1;
```
% Tab One
> Content for tab one.
% Tab Two
> Content for tab two.

<!-- @case: blank line between tabs splits into two groups -->

% Tab One
> Content for tab one.

% Tab Two
> Content for tab two.

<!-- @case: tab with empty body -->

% Tab One
% Tab Two
> Content for tab two.

<!-- @case: explicit open on first tab is redundant -->

%+ Tab One
> Content for tab one.
% Tab Two
> Content for tab two.

<!-- @case: multiple explicit open markers -->

% Tab One
> Content for tab one.
%+ Tab Two
> Content for tab two.
%+ Tab Three
> Content for tab three.

<!-- @case: depth-2 header with no depth-1 parent -->

%% Orphan
> Content here.

<!-- @case: depth skip from 1 to 3 terminates group -->

% Tab One
%%% Too Deep
> Content here.

<!-- @case: no label text -->

%
> Content here.
