# `DeltaTimeRunner`
In theory, it should be used whenever something increments over some period of time. 
The reason you can't simply increment these things every frame is because different devices
have different native frame rates on the browser.

Suppose you had two computers: a computer `A` with high frame rate and computer `B` with a
lower frame rate. If you were to look at a character going `x` units per minute, you would
find that the character runs incredibly fast on `A` compared to `B`, even when they are using
the same velocity value.

## Changing the Runner

As of the moment, the `DeltaTimeRunner` is quite confusing with its inclusion of an `fps` member
even though you can't dictate the `fps` when requesting the next animation frame.

**Implementation**
1) Get rid of `fps` and `requiredFrameCount` and just use `requiredSeconds`.

## `Sprite` and `Collider`
A crucial component that handles sprite animations. Every object in the game needs a `Sprite`
component if it want to be displayed.

**Implementation**
1) Have each `Sprite` manage its own `DeltaTimeRunner`.
2) Give the `Sprite` its own update method called `updateFrame` (advances to the next frame when
enough time has passed).
3) Have the `GameObject` call that method in its own `update` step if needed.

The implementation details for `Collider` should almost be identical.

## `Movable`
Another critical component which handles movement and positioning for virtually every `GameObject`.
Adapting this component can be tricky due to how it interacts with user input.

The `Movable` itself will use a **command**-based system to handle requests to increment its
position and velocity. For example, here's what happens if you want to increment a `Movable`'s
position.
1) An object queues a `incrementPos` command for the `Movable`.
2) The `Movable` will process the command and enact the changes in its `update` step.

**Implementation**
1) Have each `Movable` manage its own `DeltaTimeRunner` and a command list.
2) Give the `Movable` its native `update` method which processes commands after enough time
has passed.
3) Have the `GameObject` call that method in its own `update` step.
4) Have the `GameObject`'s input handler call the queue methods.
