# 33 million if statements

A web program to test if a number is odd or even using if statements

Inspired by [this blog](https://andreasjhkarlsson.github.io/jekyll/update/2023/12/27/4-billion-if-statements.html)

The main challenge in coding this is in making the script as short as possible.
- (I think) The browser limits the file size.
- (I think) Compilation causes a memory spike that can crash the page.

Notes:
- Using `if(c==0){return 1}if(c==1){return 0}if(c==2){return 1}` is long but fits the idea.
- Using `c==0?1:c==1?0:c==2?1:0` triggers max recursion limit.
- Using `c==0||c==2||c==4` for logic feels like it removes the if statements too much (also removes the point).
- Using `(c==0&&2)||(c==1&&1)||(c==2&&2)||0 - 1` is sort of in the middle.
- Using `String.fromCharCode()` allows representing of numbers through unicode characters, but is kinda cheating because it loops at 65535.
- Using `String.fromCodePoint()` on the other hand doesn't loop and has a maximum input of 1114111.

The highest I was able to do was with a limit of 2^25 and a 541MB html file.

Todo:
- Using functions `f=x=>c==x&&2` and `g=x=>c==x&&1` will shorten the chain to `f(0)||g(1)||f(2)||0 - 1`.
- Using the function namespace may be done as such: `a=_=>c==0&&2`, `b=_=>c==1&&1` and `d=_=>c==2&&2`. This will shorten the chain to `a()||b()||d()||0 - 1` , but will increase the overall code length because of the added function definitions. However, this can be alleviated by including multiple comparisons per function like `a=_=c==0&&2||c==1&&1||c==2&&2`. And, most importantly, this allows the function definitions to be done in separate .js files and decrease cpu load when interpreting/compiling the code.
- The two previous methods can be combined to shorten the function definitions to `a=_=f(0)||g(1)||f(2)`.
