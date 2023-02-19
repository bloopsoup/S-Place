# Optimizations

## Private Methods
It's not for performance, but for easier class management.

## Prerender `TileMap`
One of the biggest bottlenecks seen in the profiler. 

Apparently drawing dozens of tiles over and over again doesn't bode well for performance. Since tiles
are ultimately static, we can prerender (do all the expensive drawing once) onto an offscreen canvas
and then draw that canvas onto the main canvas every frame.

## `Vector2` Operation Chains
In the data portion, these seem to take a significant chunk of time when looking at functions such as
`decrementVelocity` and `incrementVelocity`. Anything thing that makes copies when doing large
operations.

Despite the usefulness of `Vector2`, chaining multiple calls to its copy methods can be quite taxing.
We could add an `eval` which just evaluates `Vector2` expressions. No copies need to be made.
